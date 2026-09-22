import { colorSchemeSelector } from "./color-schemes";
import { LitElement, css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import {
  GROUP_TYPE,
  GroupConfigError,
  normalizeGroupConfig,
  type GroupErrorCode,
} from "./group-config";
import { localize, type TextKey } from "./localize";
import { styles } from "./styles";
import type {
  GroupConfig,
  GroupSection,
  GroupThermostat,
  HomeAssistant,
} from "./types";

type GroupText = "title" | "icon" | "outdoor_entity" | "flow_entity";
type RoomText = "entity" | "name" | "icon" | "valve_entity";

/**
 * Edits a draft of the group configuration. Only a valid draft is sent to the
 * dashboard; a new room stays here until its climate entity is chosen.
 */
export class ThermostatGroupEditor extends LitElement {
  static styles = [
    styles,
    css`
      fieldset {
        display: grid;
        gap: 12px;
        margin: 0;
        padding: 12px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 12px;
      }
      legend {
        padding: 0 6px;
        font-weight: 600;
      }
      .room {
        display: grid;
        gap: 10px;
        padding: 10px;
        border-radius: 10px;
        background: var(--tv-pill);
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .bar strong {
        flex: 1;
        font-size: 13px;
      }
      .bar button,
      .add {
        min-height: 44px;
        min-width: 44px;
        padding: 0 12px;
        border-radius: 22px;
        border: 1px solid var(--divider-color, #ccc);
        background: var(--card-background-color, #fff);
      }
      .add {
        justify-self: start;
      }
      .warning {
        margin: 0;
        padding: 10px 12px;
        border-radius: 10px;
        color: var(--tv-error);
        background: color-mix(in srgb, var(--tv-error) 10%, transparent);
      }
    `,
  ];
  static properties = { hass: { attribute: false } };
  hass?: HomeAssistant;
  private config: GroupConfig = { type: GROUP_TYPE, sections: [] };
  private invalid?: GroupErrorCode;
  setConfig(config: GroupConfig): void {
    this.config = structuredClone({
      ...config,
      sections: config.sections ?? [],
    });
    this.invalid = undefined;
    this.requestUpdate();
  }
  private t(key: TextKey): string {
    return localize(this.hass, key);
  }
  /** Keep the draft; send it only when it is a configuration the card accepts. */
  private emit(next: GroupConfig): void {
    this.config = next;
    try {
      const config = normalizeGroupConfig(next);
      this.invalid = undefined;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (error) {
      if (!(error instanceof GroupConfigError)) throw error;
      this.invalid = error.code;
    }
    this.requestUpdate();
  }
  private set<K extends keyof GroupConfig>(key: K, value: GroupConfig[K] | "") {
    const next = { ...this.config, [key]: value };
    if (value === "" || value === undefined) delete next[key];
    this.emit(next);
  }
  private sections(update: (sections: GroupSection[]) => void): void {
    const sections = structuredClone(this.config.sections);
    update(sections);
    this.emit({ ...this.config, sections });
  }
  private setSection(si: number, key: "name" | "icon", value: string): void {
    this.sections((s) => {
      if (value) s[si][key] = value;
      else delete s[si][key];
    });
  }
  private setRoom(si: number, ti: number, key: RoomText, value: string): void {
    this.sections((s) => {
      const room = s[si].thermostats[ti] as unknown as Record<string, string>;
      if (value || key === "entity") room[key] = value;
      else delete room[key];
    });
  }
  private move<T>(list: T[], from: number, to: number): void {
    if (to < 0 || to >= list.length) return;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
  }
  private input(
    label: string,
    value: string | undefined,
    change: (value: string) => void,
    options: { list?: string[]; id?: string; placeholder?: string } = {},
  ) {
    return html`<label
      >${label}<input
        list=${options.list ? options.id! : ""}
        placeholder=${options.placeholder ?? ""}
        .value=${live(value ?? "")}
        @change=${(e: Event) =>
          change((e.target as HTMLInputElement).value.trim())}
      />${
        options.list
          ? html`<datalist id=${options.id!}>
              ${options.list.map((id) => html`<option value=${id}></option>`)}
            </datalist>`
          : nothing
      }</label
    >`;
  }
  private groupText(key: GroupText, list?: string[], placeholder = "") {
    return this.input(
      this.t(key),
      this.config[key],
      (value) => this.set(key, value),
      { list, id: `${key}-options`, placeholder },
    );
  }
  private orderButtons(
    count: number,
    index: number,
    move: (to: number) => void,
    remove: () => void,
    label: string,
  ) {
    return html`<button
        data-action="up"
        aria-label=${`${this.t("moveUp")}: ${label}`}
        title=${this.t("moveUp")}
        ?disabled=${index === 0}
        @click=${() => move(index - 1)}
      >
        ↑</button
      ><button
        data-action="down"
        aria-label=${`${this.t("moveDown")}: ${label}`}
        title=${this.t("moveDown")}
        ?disabled=${index === count - 1}
        @click=${() => move(index + 1)}
      >
        ↓</button
      ><button
        data-action="remove"
        aria-label=${`${this.t("remove")}: ${label}`}
        @click=${remove}
      >
        ${this.t("remove")}
      </button>`;
  }
  private room(
    si: number,
    ti: number,
    room: GroupThermostat,
    count: number,
    lists: { climates: string[]; valves: string[] },
  ) {
    const label =
      room.name ||
      room.entity ||
      this.t("thermostatN").replace("{n}", String(ti + 1));
    return html`<div class="room" data-room=${`${si}.${ti}`}>
      <div class="bar">
        <strong>${label}</strong>
        ${this.orderButtons(
          count,
          ti,
          (to) => this.sections((s) => this.move(s[si].thermostats, ti, to)),
          () => this.sections((s) => s[si].thermostats.splice(ti, 1)),
          label,
        )}
      </div>
      ${this.input(
        this.t("entity"),
        room.entity,
        (v) => this.setRoom(si, ti, "entity", v),
        {
          list: lists.climates,
          id: `climates-${si}-${ti}`,
          placeholder: "climate.…",
        },
      )}
      ${this.input(this.t("name"), room.name, (v) =>
        this.setRoom(si, ti, "name", v),
      )}
      ${this.input(
        this.t("icon"),
        room.icon,
        (v) => this.setRoom(si, ti, "icon", v),
        { placeholder: "mdi:sofa" },
      )}
      ${this.input(
        this.t("valve_entity"),
        room.valve_entity,
        (v) => this.setRoom(si, ti, "valve_entity", v),
        {
          list: lists.valves,
          id: `valves-${si}-${ti}`,
          placeholder: "sensor.…",
        },
      )}
    </div>`;
  }
  protected render() {
    const states = this.hass?.states ?? {};
    const ids = Object.keys(states);
    const climates = ids.filter((id) => id.startsWith("climate."));
    const valves = ids.filter(
      (id) =>
        /^(sensor|number|input_number)\./.test(id) &&
        states[id].attributes.unit_of_measurement === "%",
    );
    const temperatures = ids.filter(
      (id) =>
        /^(sensor|number|input_number)\./.test(id) &&
        (states[id].attributes.device_class === "temperature" ||
          ["°C", "°F"].includes(
            String(states[id].attributes.unit_of_measurement),
          )),
    );
    const appearance = this.config.appearance ?? "default";
    const sections = this.config.sections;
    return html`<div class="editor">
      ${
        this.invalid
          ? html`<p class="warning" role="alert" data-warning>
              ${
                this.invalid === "invalidThermostat"
                  ? this.t("draftInvalid")
                  : `${this.t("draftInvalid")} ${this.t(this.invalid)}`
              }
            </p>`
          : nothing
      }
      ${this.groupText("title", undefined, this.t("groupTitle"))}
      ${this.groupText("icon", undefined, "mdi:home-thermometer-outline")}
      <label
        >${this.t("appearance")}<select
          data-config="appearance"
          .value=${live(appearance)}
          @change=${(e: Event) =>
            this.set(
              "appearance",
              (e.target as HTMLSelectElement).value as "default" | "bubble",
            )}
        >
          ${(["default", "bubble"] as const).map(
            (v) =>
              html`<option value=${v} ?selected=${v === appearance}>
                ${this.t(v)}
              </option>`,
          )}
        </select></label
      >
      ${colorSchemeSelector(this.hass, this.config.color_scheme, (scheme) =>
        this.set("color_scheme", scheme),
      )}
      <label class="toggle"
        ><input
          data-config="show_valve"
          type="checkbox"
          .checked=${live(this.config.show_valve !== false)}
          @change=${(e: Event) =>
            this.set("show_valve", (e.target as HTMLInputElement).checked)}
        />${this.t("show_valve")}</label
      >
      ${this.groupText("outdoor_entity", temperatures, "sensor.…")}
      ${this.groupText("flow_entity", temperatures, "sensor.…")}
      ${sections.map((section, si) => {
        const label =
          section.name || this.t("sectionN").replace("{n}", String(si + 1));
        return html`<fieldset data-section=${si}>
          <legend>${label}</legend>
          <div class="bar">
            <strong></strong>
            ${this.orderButtons(
              sections.length,
              si,
              (to) => this.sections((s) => this.move(s, si, to)),
              () => this.sections((s) => s.splice(si, 1)),
              label,
            )}
          </div>
          ${this.input(this.t("sectionName"), section.name, (v) =>
            this.setSection(si, "name", v),
          )}
          ${this.input(
            this.t("icon"),
            section.icon,
            (v) => this.setSection(si, "icon", v),
            { placeholder: "mdi:home-floor-1" },
          )}
          ${section.thermostats.map((room, ti) =>
            this.room(si, ti, room, section.thermostats.length, {
              climates,
              valves,
            }),
          )}
          <button
            class="add"
            data-action="add-thermostat"
            @click=${() =>
              this.sections((s) => s[si].thermostats.push({ entity: "" }))}
          >
            + ${this.t("addThermostat")}
          </button>
        </fieldset>`;
      })}
      <button
        class="add"
        data-action="add-section"
        @click=${() =>
          this.sections((s) => s.push({ thermostats: [{ entity: "" }] }))}
      >
        + ${this.t("addSection")}
      </button>
    </div>`;
  }
}
if (!customElements.get("thermostat-group-card-editor"))
  customElements.define("thermostat-group-card-editor", ThermostatGroupEditor);
