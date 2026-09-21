import { colorSchemeSelector } from "./color-schemes";
import { LitElement, html } from "lit";
import { live } from "lit/directives/live.js";
import type { CardConfig, HomeAssistant } from "./types";
import { TYPE, normalizeConfig } from "./config";
import { localize, type TextKey } from "./localize";
import { styles } from "./styles";
export class ThermostatValveEditor extends LitElement {
  static styles = styles;
  static properties = { hass: { attribute: false } };
  hass?: HomeAssistant;
  private config: CardConfig = { type: TYPE, entity: "" };
  setConfig(config: CardConfig): void {
    this.config = { ...config };
    this.requestUpdate();
  }
  protected updated(): void {
    this.renderRoot
      .querySelectorAll<HTMLInputElement>("input")
      .forEach((input) => {
        if (input.validity.customError)
          input.setCustomValidity(this.t("invalidValue"));
      });
  }
  private t(key: TextKey): string {
    return localize(this.hass, key);
  }
  private emit(next: CardConfig): void {
    this.config = next;
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...next } },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private change(key: keyof CardConfig, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    const value =
      input instanceof HTMLInputElement && input.type === "checkbox"
        ? input.checked
        : input.value.trim();
    const next = { ...this.config, [key]: value } as CardConfig;
    if (value === "") delete next[key];
    try {
      normalizeConfig(next);
    } catch {
      if (input instanceof HTMLInputElement) {
        input.setCustomValidity(this.t("invalidValue"));
        input.reportValidity();
      }
      return;
    }
    if (input instanceof HTMLInputElement) input.setCustomValidity("");
    this.emit(next);
  }
  private text(
    key: "entity" | "valve_entity" | "name" | "icon",
    list?: string[],
    placeholder = "",
  ) {
    return html`<label
      >${this.t(key)}<input
        data-config=${key}
        list=${list ? `${key}-options` : ""}
        placeholder=${placeholder}
        .value=${live(String(this.config[key] ?? ""))}
        @change=${(e: Event) => this.change(key, e)}
      />${
        list
          ? html`<datalist id=${`${key}-options`}>
              ${list.map((id) => html`<option value=${id}></option>`)}
            </datalist>`
          : ""
      }</label
    >`;
  }
  protected render() {
    const states = this.hass?.states ?? {};
    const climates = Object.keys(states).filter((id) =>
      id.startsWith("climate."),
    );
    const valves = Object.keys(states).filter(
      (id) =>
        /^(sensor|number|input_number)\./.test(id) &&
        states[id].attributes.unit_of_measurement === "%",
    );
    const appearance = this.config.appearance ?? "default";
    return html`<div class="editor">
      ${this.text("entity", climates, "climate.…")}
      ${this.text("valve_entity", valves, "sensor.…")}
      <label class="toggle"
        ><input
          data-config="show_valve"
          type="checkbox"
          .checked=${live(this.config.show_valve !== false)}
          @change=${(e: Event) => this.change("show_valve", e)}
        />${this.t("show_valve")}</label
      >
      ${this.text("name")} ${this.text("icon", undefined, "mdi:sofa")}
      <label
        >${this.t("appearance")}<select
          data-config="appearance"
          .value=${live(appearance)}
          @change=${(e: Event) => this.change("appearance", e)}
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
        this.emit({ ...this.config, color_scheme: scheme }),
      )}
    </div>`;
  }
}
if (!customElements.get("thermostat-valve-card-editor"))
  customElements.define("thermostat-valve-card-editor", ThermostatValveEditor);
