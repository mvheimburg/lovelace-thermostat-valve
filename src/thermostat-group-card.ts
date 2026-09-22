import { LitElement, css, html, nothing } from "lit";
import { applyColorScheme } from "./color-schemes";
import { TYPE } from "./config";
import {
  GROUP_TYPE,
  GroupConfigError,
  normalizeGroupConfig,
  type GroupErrorCode,
} from "./group-config";
import { formatNumber, localize, type TextKey } from "./localize";
import { tone } from "./model";
import { styles } from "./styles";
import "./thermostat-valve-card";
import "./group-editor";
import type { ThermostatValveCard } from "./thermostat-valve-card";
import type {
  CardConfig,
  GroupConfig,
  GroupThermostat,
  HomeAssistant,
} from "./types";

/**
 * Several rooms in one card, optionally under group headings. Each room is a
 * thermostat-valve-card drawn as a tile, so every room keeps the single
 * card's stepper, pending/failure handling and history.
 */
export class ThermostatGroupCard extends LitElement {
  static styles = [
    styles,
    css`
      ha-card.group {
        padding: 12px;
        display: grid;
        gap: 12px;
      }
      header {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
      }
      header > ha-icon {
        color: var(--tv-muted);
        flex: none;
      }
      .heading {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .summary {
        font-size: 12px;
        color: var(--tv-muted);
      }
      .round {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--tv-pill);
        color: var(--primary-text-color, #1b1b1a);
      }
      section {
        display: grid;
        gap: 6px;
      }
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 4px 2px;
        font-size: 14px;
        font-weight: 600;
      }
      h3 ha-icon {
        --mdc-icon-size: 20px;
        color: var(--tv-muted);
      }
      .rooms {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
        gap: 6px;
      }
      .hint {
        margin: 0 4px;
        color: var(--tv-muted);
      }
      dialog p {
        margin: 12px 4px 0;
        line-height: 1.45;
      }
    `,
  ];
  private ha?: HomeAssistant;
  private config: GroupConfig = { type: GROUP_TYPE, sections: [] };
  private configError?: GroupErrorCode;
  /** One embedded room card per position, reused across renders. */
  private rows = new Map<string, { card: ThermostatValveCard; json: string }>();

  get hass(): HomeAssistant | undefined {
    return this.ha;
  }
  set hass(value: HomeAssistant | undefined) {
    this.ha = value;
    this.requestUpdate();
  }
  setConfig(input: unknown): void {
    this.configError = undefined;
    try {
      this.config = normalizeGroupConfig(input);
    } catch (error) {
      if (!(error instanceof GroupConfigError)) throw error;
      this.config = { type: GROUP_TYPE, sections: [] };
      this.configError = error.code;
    }
    applyColorScheme(this, this.config.color_scheme);
    this.setAttribute("appearance", this.config.appearance ?? "default");
    this.requestUpdate();
  }
  private t = (key: TextKey) => localize(this.ha, key);
  /** The single-room configuration for one entry, with the group's shared settings. */
  private roomConfig(t: GroupThermostat): CardConfig {
    const c = this.config;
    const room: CardConfig = {
      type: TYPE,
      entity: t.entity,
      appearance: c.appearance ?? "default",
      show_valve: c.show_valve !== false,
    };
    if (t.name?.trim()) room.name = t.name;
    if (t.icon?.trim()) room.icon = t.icon;
    if (t.valve_entity) room.valve_entity = t.valve_entity;
    if (c.outdoor_entity) room.outdoor_entity = c.outdoor_entity;
    if (c.flow_entity) room.flow_entity = c.flow_entity;
    return room;
  }
  private row(key: string, t: GroupThermostat): ThermostatValveCard {
    const config = this.roomConfig(t);
    const json = JSON.stringify(config);
    let row = this.rows.get(key);
    if (!row) {
      const card = document.createElement(
        "thermostat-valve-card",
      ) as ThermostatValveCard;
      card.setAttribute("embedded", "");
      row = { card, json: "" };
      this.rows.set(key, row);
    }
    if (row.json !== json) {
      row.card.setConfig(config);
      row.json = json;
    }
    row.card.hass = this.ha;
    return row.card;
  }
  /** What needs attention: how many rooms heat, cool or are unavailable. */
  private summary(): string {
    const ids = new Set(
      this.config.sections.flatMap((s) => s.thermostats.map((t) => t.entity)),
    );
    const counts = { heating: 0, cooling: 0, unavailable: 0 };
    for (const id of ids) {
      const kind = tone(this.ha?.states[id]);
      if (kind in counts) counts[kind as keyof typeof counts]++;
    }
    const parts = (
      [
        ["heating", "summaryHeating"],
        ["cooling", "summaryCooling"],
        ["unavailable", "summaryUnavailable"],
      ] as const
    )
      .filter(([kind]) => counts[kind])
      .map(([kind, key]) =>
        this.t(key).replace("{n}", formatNumber(this.ha, counts[kind], 0)),
      );
    return parts.length ? parts.join(" · ") : this.t("allIdle");
  }
  private get dialog(): HTMLDialogElement | null | undefined {
    return this.shadowRoot?.querySelector<HTMLDialogElement>("#configure");
  }
  protected render() {
    if (!this.ha) return nothing;
    const used = new Set<string>();
    const rooms = this.config.sections.map((s, si) =>
      s.thermostats.map((t, ti) => {
        const key = `${si}.${ti}`;
        used.add(key);
        return this.row(key, t);
      }),
    );
    for (const key of [...this.rows.keys()])
      if (!used.has(key)) this.rows.delete(key);
    const empty = !used.size;
    return html`<ha-card class="group">
      <header>
        <ha-icon
          .icon=${this.config.icon || "mdi:home-thermometer-outline"}
        ></ha-icon>
        <div class="heading">
          <h2>${this.config.title || this.t("groupTitle")}</h2>
          ${
            empty || this.configError
              ? nothing
              : html`<span class="summary" data-summary
                  >${this.summary()}</span
                >`
          }
        </div>
        <button
          class="round"
          data-action="configure"
          aria-label=${this.t("configure")}
          title=${this.t("configure")}
          @click=${() => this.dialog?.showModal()}
        >
          <ha-icon .icon=${"mdi:cog-outline"}></ha-icon>
        </button>
      </header>
      ${
        this.configError
          ? html`<p class="error" role="alert">${this.t(this.configError)}</p>`
          : empty
            ? html`<p class="hint">${this.t("setup")}</p>`
            : this.config.sections.map(
                (s, si) =>
                  html`<section>
                    ${
                      s.name?.trim() || s.icon
                        ? html`<h3>
                            ${
                              s.icon
                                ? html`<ha-icon .icon=${s.icon}></ha-icon>`
                                : nothing
                            }${s.name ?? ""}
                          </h3>`
                        : nothing
                    }
                    <div class="rooms">${rooms[si]}</div>
                  </section>`,
              )
      }
      <dialog id="configure" aria-labelledby="configure-title">
        <div class="history-head">
          <h2 id="configure-title">${this.t("configure")}</h2>
          <button
            class="close"
            data-close
            aria-label=${this.t("close")}
            title=${this.t("close")}
            @click=${() => this.dialog?.close()}
          >
            ×
          </button>
        </div>
        <p>${this.t("configureHelp")}</p>
      </dialog>
    </ha-card>`;
  }
  getCardSize(): number {
    return (
      1 +
      this.config.sections.reduce(
        (n, s) => n + (s.name ? 1 : 0) + s.thermostats.length,
        0,
      )
    );
  }
  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }
  static getConfigElement(): HTMLElement {
    return document.createElement("thermostat-group-card-editor");
  }
  static getStubConfig(hass?: HomeAssistant): GroupConfig {
    const climates = Object.keys(hass?.states ?? {})
      .filter((id) => id.startsWith("climate."))
      .slice(0, 4);
    return {
      type: GROUP_TYPE,
      sections: climates.length
        ? [{ thermostats: climates.map((entity) => ({ entity })) }]
        : [],
    };
  }
}
if (!customElements.get("thermostat-group-card"))
  customElements.define("thermostat-group-card", ThermostatGroupCard);
// Card-picker metadata has no hass context and stays English.
const catalog = window as unknown as {
  customCards?: {
    type: string;
    name: string;
    description: string;
    preview: boolean;
  }[];
};
catalog.customCards ??= [];
if (!catalog.customCards.some((c) => c.type === "thermostat-group-card"))
  catalog.customCards.push({
    type: "thermostat-group-card",
    name: "Thermostat Group Card",
    description:
      "Several rooms' thermostats in one card, with valve opening, heating/cooling state and target temperature",
    preview: true,
  });
