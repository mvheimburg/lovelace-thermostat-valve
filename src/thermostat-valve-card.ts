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
  formatLocale,
  formatNumber,
  formatPercent,
  localize,
  modeLabel,
  type TextKey,
} from "./localize";
import { styles } from "./styles";
import { chart, timeAt } from "./chart";
import {
  RANGES,
  loadHistory,
  valueAt,
  type Range,
  type Series,
  type Source,
} from "./history";
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
  /** The history dialog: chosen range, loaded series and the hovered time. */
  private range: Range = 24;
  private series?: Series[];
  private window?: [number, number];
  private loading = false;
  private historyError = "";
  private hover?: number;
  private historyTicket = 0;
  private plotWidth = 600;
  private resize?: ResizeObserver;

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
  protected updated(): void {
    const plot = this.shadowRoot?.querySelector(".plot");
    if (!plot || this.resize) return;
    this.resize = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      // Redraw next frame, outside the observer's own layout pass.
      if (width > 0 && Math.abs(width - this.plotWidth) > 4)
        requestAnimationFrame(() => {
          this.plotWidth = width;
          this.requestUpdate();
        });
    });
    this.resize.observe(plot);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resize?.disconnect();
    this.resize = undefined;
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
    this.historyTicket++;
    this.series = this.window = this.hover = undefined;
    this.loading = false;
    this.historyError = "";
    this.dialog?.close();
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
  private get dialog(): HTMLDialogElement | null | undefined {
    return this.shadowRoot?.querySelector<HTMLDialogElement>("#history");
  }
  /** Valve, room, outdoor and flow temperature: whichever this room has. */
  private sources(): Source[] {
    const config = this.config!;
    const climate = this.climate;
    const out: Source[] = [];
    const v = climate ? valve(this.ha!, config, climate) : undefined;
    if (v?.entityId) out.push({ key: "valve", entityId: v.entityId });
    else if (v?.attribute)
      out.push({
        key: "valve",
        entityId: config.entity,
        attribute: v.attribute,
      });
    out.push({
      key: "room",
      entityId: config.entity,
      attribute: "current_temperature",
    });
    if (config.outdoor_entity)
      out.push({ key: "outdoor", entityId: config.outdoor_entity });
    if (config.flow_entity)
      out.push({ key: "flow", entityId: config.flow_entity });
    return out;
  }
  private async openHistory(): Promise<void> {
    if (!this.config || !this.ha) return;
    await this.updateComplete;
    const dialog = this.dialog;
    if (dialog && !dialog.open) dialog.showModal();
    void this.loadHistory();
  }
  private async loadHistory(range: Range = this.range): Promise<void> {
    if (!this.ha) return;
    const ticket = ++this.historyTicket;
    this.range = range;
    this.loading = true;
    this.historyError = "";
    this.hover = undefined;
    this.requestUpdate();
    const end = Date.now();
    try {
      const series = await loadHistory(this.ha, this.sources(), range, end);
      if (ticket !== this.historyTicket) return;
      this.series = series;
      this.window = [end - range * 3_600_000, end];
    } catch (error) {
      if (ticket !== this.historyTicket) return;
      this.series = this.window = undefined;
      this.historyError = `${this.t("historyFailed")}: ${
        error instanceof Error
          ? error.message
          : typeof error === "object" && error && "message" in error
            ? String(error.message)
            : String(error)
      }`;
    }
    this.loading = false;
    this.requestUpdate();
  }
  private closeHistory(): void {
    this.dialog?.close();
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
    return html`<button
      class="valve"
      data-valve
      aria-label=${`${label}. ${this.t("history")}`}
      title=${label}
      @click=${() => void this.openHistory()}
    >
      ${ring}
    </button>`;
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
          <button
            class="name"
            data-name
            aria-label=${`${name}: ${this.t("history")}`}
            @click=${() => void this.openHistory()}
          >
            <span class="title">${name}</span>
            <span class="status" data-status>${this.statusLine(climate)}</span>
          </button>
          ${this.valveView(v)}${this.control(climate)}
        </div>
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      </ha-card>
      ${this.historyDialog(name)}`;
  }
  private historyDialog(name: string) {
    const hour12 =
      this.ha?.locale?.time_format === "12"
        ? true
        : this.ha?.locale?.time_format === "24"
          ? false
          : undefined;
    const locale = formatLocale(this.ha);
    const time = (ms: number, withDay: boolean) =>
      new Intl.DateTimeFormat(
        locale,
        withDay
          ? { weekday: "short", day: "numeric" }
          : { hour: "2-digit", minute: "2-digit", hour12 },
      ).format(ms);
    const span = (hours: number) =>
      new Intl.NumberFormat(locale, {
        style: "unit",
        unit: hours < 48 ? "hour" : "day",
        unitDisplay: "short",
      }).format(hours < 48 ? hours : hours / 24);
    const reading = (s: Series, value: number | undefined) =>
      value === undefined
        ? "—"
        : s.key === "valve"
          ? formatPercent(this.ha, value)
          : this.temperature(value, 1);
    const series = this.series;
    const window = this.window;
    const at = this.hover;
    return html`<dialog
      id="history"
      aria-labelledby="history-title"
      @close=${() => {
        this.historyTicket++;
        this.hover = undefined;
      }}
    >
      <div class="history-head">
        <h2 id="history-title">${name}</h2>
        <button
          class="close"
          data-close
          aria-label=${this.t("close")}
          title=${this.t("close")}
          @click=${() => this.closeHistory()}
        >
          ×
        </button>
      </div>
      <div class="ranges" role="group" aria-label=${this.t("history")}>
        ${RANGES.map(
          (hours) =>
            html`<button
              data-range=${hours}
              aria-pressed=${String(this.range === hours)}
              ?disabled=${this.loading && this.range === hours}
              @click=${() => void this.loadHistory(hours)}
            >
              ${span(hours)}
            </button>`,
        )}
      </div>
      <div
        class="plot"
        aria-busy=${String(this.loading)}
        @pointermove=${(e: PointerEvent) => {
          const svg = (e.currentTarget as HTMLElement).querySelector("svg");
          if (!svg || !window) return;
          this.hover = timeAt(e, svg, window[0], window[1]);
          this.requestUpdate();
        }}
        @pointerleave=${() => {
          this.hover = undefined;
          this.requestUpdate();
        }}
      >
        ${
          this.historyError
            ? html`<p class="error" role="alert">${this.historyError}</p>`
            : !series || !window
              ? html`<p class="hint" role="status">${this.t("loading")}</p>`
              : series.every((s) => s.points.every(([, v]) => v === undefined))
                ? html`<p class="hint">${this.t("noHistory")}</p>`
                : chart(
                    series,
                    window[0],
                    window[1],
                    at,
                    {
                      number: (v, d) => formatNumber(this.ha, v, d),
                      percent: (v) => formatPercent(this.ha, v),
                      time,
                      label: `${this.t("history")}: ${name}`,
                    },
                    Math.max(280, this.plotWidth),
                  )
        }
      </div>
      <p class="when" aria-live="polite">
        ${at === undefined ? this.t("now") : time(at, false)}
      </p>
      <div class="legend">
        ${(series ?? []).map(
          (s) =>
            html`<button
              class=${`item s-${s.key}`}
              data-series=${s.key}
              @click=${() => {
                this.closeHistory();
                this.info(s.entityId);
              }}
            >
              <span class="swatch"></span>
              <span class="label">${this.t(s.key)}</span>
              <strong
                >${reading(
                  s,
                  at === undefined
                    ? s.points[s.points.length - 1]?.[1]
                    : valueAt(s, at),
                )}</strong
              >
            </button>`,
        )}
      </div>
    </dialog>`;
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
