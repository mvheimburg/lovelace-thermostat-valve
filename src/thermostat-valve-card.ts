import { applyColorScheme } from "./color-schemes";
import { LitElement, html, nothing, svg } from "lit";
import type { CardConfig, HassEntity, HomeAssistant } from "./types";
import { TYPE, normalizeConfig } from "./config";
import {
  available,
  nudge,
  numeric,
  status,
  target,
  tone,
  valve,
  type Target,
  type Valve,
} from "./model";
import {
  actionLabel,
  formatNumber,
  formatPercent,
  localize,
  modeLabel,
  type TextKey,
} from "./localize";
import { styles } from "./styles";
import "./editor";

/** Quiet time after the last +/- press before the target is sent. */
export const COMMIT_DELAY = 800;
/** How long a sent value is shown before falling back to the entity's. */
const CONFIRM_TIMEOUT = 15_000;

export class ThermostatValveCard extends LitElement {
  static styles = styles;
  private config?: CardConfig;
  private ha?: HomeAssistant;
  /** Target the household is dialling in, not yet confirmed by HA. */
  private draft?: number;
  private sent?: number;
  private sending = false;
  private error = "";
  private epoch = 0;
  private commitTimer?: ReturnType<typeof setTimeout>;
  private confirmTimer?: ReturnType<typeof setTimeout>;

  get hass(): HomeAssistant | undefined {
    return this.ha;
  }
  set hass(value: HomeAssistant | undefined) {
    this.ha = value;
    const climate = this.climate;
    if (
      !this.sending &&
      this.sent !== undefined &&
      numeric(climate?.attributes.temperature) === this.sent
    )
      this.settle();
    this.requestUpdate();
  }
  setConfig(value: CardConfig): void {
    const next = normalizeConfig(value);
    applyColorScheme(this, value.color_scheme, this.ha);
    if (next.entity !== this.config?.entity) this.reset();
    this.config = next;
    this.setAttribute("appearance", next.appearance ?? "default");
    this.requestUpdate();
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    // A target the user already chose is still sent when the view closes.
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = undefined;
      void this.commit();
    }
  }
  private get climate(): HassEntity | undefined {
    return this.config ? this.ha?.states[this.config.entity] : undefined;
  }
  private get unit(): string {
    return this.ha?.config?.unit_system?.temperature ?? "°C";
  }
  private t = (key: TextKey) => localize(this.ha, key);
  private reset(): void {
    this.epoch++;
    clearTimeout(this.commitTimer);
    clearTimeout(this.confirmTimer);
    this.commitTimer = this.confirmTimer = undefined;
    this.draft = this.sent = undefined;
    this.sending = false;
    this.error = "";
  }
  private settle(): void {
    clearTimeout(this.confirmTimer);
    this.confirmTimer = undefined;
    this.draft = this.sent = undefined;
  }
  private get live(): boolean {
    return this.ha?.connection?.connected !== false;
  }
  private canStep(t: Target): boolean {
    return this.live && !this.sending && available(this.climate) && t.settable;
  }
  private step(steps: number): void {
    const climate = this.climate;
    if (!climate) return;
    const t = target(climate, this.unit);
    if (!this.canStep(t)) return;
    clearTimeout(this.confirmTimer);
    this.confirmTimer = undefined;
    this.sent = undefined;
    this.draft = nudge(t, this.draft ?? t.value!, steps);
    this.error = "";
    clearTimeout(this.commitTimer);
    this.commitTimer = setTimeout(() => {
      this.commitTimer = undefined;
      void this.commit();
    }, COMMIT_DELAY);
    this.requestUpdate();
  }
  /** Send the draft once; Home Assistant's reply decides what is shown. */
  async commit(): Promise<void> {
    clearTimeout(this.commitTimer);
    this.commitTimer = undefined;
    const climate = this.climate;
    const value = this.draft;
    if (!this.ha || !climate || value === undefined || this.sending) return;
    const t = target(climate, this.unit);
    if (!this.canStep(t) || value === t.value) {
      this.draft = undefined;
      this.requestUpdate();
      return;
    }
    const ticket = this.epoch;
    this.sending = true;
    this.sent = value;
    this.requestUpdate();
    try {
      await this.ha.callService("climate", "set_temperature", {
        entity_id: climate.entity_id,
        temperature: value,
      });
      if (ticket !== this.epoch) return;
      this.sending = false;
      if (numeric(this.climate?.attributes.temperature) === value)
        this.settle();
      else
        this.confirmTimer = setTimeout(() => {
          this.settle();
          this.requestUpdate();
        }, CONFIRM_TIMEOUT);
    } catch (error) {
      if (ticket !== this.epoch) return;
      this.sending = false;
      this.draft = this.sent = undefined;
      const message = error instanceof Error ? error.message : String(error);
      this.error = `${this.t("failed")}: ${message}`;
    }
    this.requestUpdate();
  }
  private info(entityId?: string): void {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private temperature(value: number, digits: number): string {
    return `${formatNumber(this.ha, value, digits)} ${this.unit}`;
  }
  private statusLine(climate?: HassEntity) {
    if (!climate) return html`${this.t("missing")}`;
    if (!available(climate)) return html`${this.t("unavailable")}`;
    const s = status(climate);
    const word =
      s.kind === "action"
        ? actionLabel(this.ha, s.value)
        : modeLabel(this.ha, s.value);
    const current = numeric(climate.attributes.current_temperature);
    return html`<strong>${word}</strong
      >${current === undefined ? nothing : html` · ${this.temperature(current, 1)}`}`;
  }
  private valveView(v: Valve | undefined) {
    if (!v) return nothing;
    const percent =
      v.value === undefined ? undefined : Math.max(0, Math.min(100, v.value));
    const text = percent === undefined ? "—" : formatPercent(this.ha, percent);
    const label = `${this.t("valve")}: ${percent === undefined ? this.t("unavailable") : text}`;
    const ring = html`<svg class="ring" viewBox="0 0 20 20" aria-hidden="true">
        <circle class="track" cx="10" cy="10" r="8"></circle>
        ${
          percent
            ? svg`<circle
                class="arc"
                cx="10"
                cy="10"
                r="8"
                pathLength="100"
                stroke-dasharray=${`${percent} 100`}
              ></circle>`
            : nothing
        }</svg
      ><span>${text}</span>`;
    return v.entityId
      ? html`<button
          class="valve"
          data-valve
          aria-label=${label}
          title=${label}
          @click=${() => this.info(v.entityId)}
        >
          ${ring}
        </button>`
      : html`<span
          class="valve"
          data-valve
          role="img"
          aria-label=${label}
          title=${label}
          >${ring}</span
        >`;
  }
  private control(climate?: HassEntity) {
    if (!climate) return nothing;
    const t = target(climate, this.unit);
    if (available(climate) && t.range && !t.settable)
      return html`<span class="range" title=${this.t("range")}
        >${formatNumber(this.ha, t.range[0], t.digits)}–${this.temperature(t.range[1], t.digits)}</span
      >`;
    const enabled = this.canStep(t);
    const shown = this.draft ?? (available(climate) ? t.value : undefined);
    return html`<div
      class="stepper"
      role="group"
      aria-label=${this.t("target")}
    >
      <button
        data-step="down"
        aria-label=${this.t("lower")}
        title=${this.t("lower")}
        ?disabled=${!enabled || (shown !== undefined && shown <= t.min)}
        @click=${() => this.step(-1)}
      >
        −
      </button>
      <output
        class=${`value ${this.draft !== undefined ? "pending" : ""}`}
        aria-live="polite"
        aria-busy=${this.sending ? "true" : "false"}
        >${shown === undefined ? "—" : this.temperature(shown, t.digits)}</output
      >
      <button
        data-step="up"
        aria-label=${this.t("raise")}
        title=${this.t("raise")}
        ?disabled=${!enabled || (shown !== undefined && shown >= t.max)}
        @click=${() => this.step(1)}
      >
        +
      </button>
    </div>`;
  }
  protected render() {
    if (!this.config || !this.ha) return nothing;
    const climate = this.climate;
    const name =
      this.config.name ??
      String(climate?.attributes.friendly_name ?? this.config.entity);
    const icon =
      this.config.icon ?? String(climate?.attributes.icon ?? "mdi:thermostat");
    const v = climate ? valve(this.ha, this.config, climate) : undefined;
    return html`<ha-card
      class=${`tone-${climate ? tone(climate) : "unavailable"}`}
    >
      <div class="row">
        <button
          class="symbol"
          aria-label=${name}
          @click=${() => this.info(this.config?.entity)}
        >
          <ha-icon .icon=${icon}></ha-icon>
        </button>
        <button class="name" @click=${() => this.info(this.config?.entity)}>
          <span class="title">${name}</span>
          <span class="status" data-status>${this.statusLine(climate)}</span>
        </button>
        ${this.valveView(v)}${this.control(climate)}
      </div>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
    </ha-card>`;
  }
  getCardSize(): number {
    return 1;
  }
  getGridOptions() {
    return { columns: 12, rows: 1, min_columns: 6, min_rows: 1 };
  }
  static getConfigElement(): HTMLElement {
    return document.createElement("thermostat-valve-card-editor");
  }
  static getStubConfig(hass?: HomeAssistant): Partial<CardConfig> {
    const entity = Object.keys(hass?.states ?? {}).find((id) =>
      id.startsWith("climate."),
    );
    return { type: TYPE, entity: entity ?? "climate.living_room" };
  }
}
if (!customElements.get("thermostat-valve-card"))
  customElements.define("thermostat-valve-card", ThermostatValveCard);
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
if (!catalog.customCards.some((c) => c.type === "thermostat-valve-card"))
  catalog.customCards.push({
    type: "thermostat-valve-card",
    name: "Thermostat Valve Card",
    description:
      "Compact thermostat row: target temperature, valve opening and heating/cooling state",
    preview: true,
  });
