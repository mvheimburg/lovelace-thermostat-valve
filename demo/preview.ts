import "../src/thermostat-valve-card";
import type { ThermostatValveCard } from "../src/thermostat-valve-card";
import type { HassEntity, HomeAssistant } from "../src/types";

const now = new Date().toISOString();
const room = (
  id: string,
  name: string,
  mode: string,
  action: string,
  current: number,
  target: number,
  extra: Record<string, unknown> = {},
): HassEntity => ({
  entity_id: id,
  state: mode,
  last_updated: now,
  attributes: {
    friendly_name: name,
    hvac_modes: ["off", "heat", "cool"],
    hvac_action: action,
    current_temperature: current,
    temperature: target,
    min_temp: 5,
    max_temp: 30,
    target_temp_step: 0.5,
    supported_features: 385,
    ...extra,
  },
});
const states: Record<string, HassEntity> = {
  "climate.stue": room(
    "climate.stue",
    "Oppholdsrom",
    "heat",
    "heating",
    21.3,
    24,
  ),
  "sensor.stue_valve_opening": {
    entity_id: "sensor.stue_valve_opening",
    state: "62",
    attributes: { unit_of_measurement: "%" },
  },
  "climate.soverom": room(
    "climate.soverom",
    "Soverom",
    "heat",
    "idle",
    19.1,
    18,
    {
      pi_heating_demand: 0,
    },
  ),
  "climate.kontor": room(
    "climate.kontor",
    "Kontor",
    "cool",
    "cooling",
    25.4,
    22,
    {
      valve_position: 40,
    },
  ),
};
const hass: HomeAssistant = {
  states,
  language: "en",
  config: { unit_system: { temperature: "°C" } },
  connection: { connected: true },
  entities: {
    "climate.stue": { entity_id: "climate.stue", device_id: "trv" },
    "sensor.stue_valve_opening": {
      entity_id: "sensor.stue_valve_opening",
      device_id: "trv",
    },
  },
  async callService(_domain, _service, data) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    states[data.entity_id as string].attributes.temperature = data.temperature;
    update();
  },
};
const cards: ThermostatValveCard[] = [];
function update() {
  for (const c of cards) c.hass = { ...hass, states: { ...hass.states } };
}
for (const [entity, icon, appearance] of [
  ["climate.stue", "mdi:sofa", "bubble"],
  ["climate.soverom", "mdi:bed", "bubble"],
  ["climate.kontor", "mdi:desk", "default"],
] as const) {
  const c = document.createElement(
    "thermostat-valve-card",
  ) as ThermostatValveCard;
  c.setConfig({
    type: "custom:thermostat-valve-card",
    entity,
    icon,
    appearance,
  });
  c.hass = hass;
  document.querySelector("#cards")!.append(c);
  cards.push(c);
}
if (!customElements.get("ha-icon"))
  customElements.define(
    "ha-icon",
    class extends HTMLElement {
      set icon(value: string) {
        const glyphs: Record<string, string> = {
          "mdi:sofa": "🛋",
          "mdi:bed": "🛏",
          "mdi:desk": "🖥",
        };
        this.textContent = glyphs[value] ?? "🌡";
        this.style.fontSize = "20px";
      }
    },
  );
document
  .querySelector("#theme")!
  .addEventListener("click", () => document.body.classList.toggle("dark"));
document.querySelector("#language")!.addEventListener("click", () => {
  hass.language = hass.language === "en" ? "nb" : "en";
  update();
});
let saved: HassEntity | undefined;
document.querySelector("#offline")!.addEventListener("click", () => {
  if (saved) {
    states["climate.stue"] = saved;
    saved = undefined;
  } else {
    saved = states["climate.stue"];
    states["climate.stue"] = { ...saved, state: "unavailable" };
  }
  update();
});
