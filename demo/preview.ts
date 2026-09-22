import "../src/index";
import {
  mdiBathtubOutline,
  mdiBed,
  mdiCogOutline,
  mdiDesk,
  mdiDoor,
  mdiHomeFloor1,
  mdiHomeFloor2,
  mdiHomeThermometerOutline,
  mdiSofa,
  mdiThermostat,
} from "@mdi/js";
import type { ThermostatValveCard } from "../src/thermostat-valve-card";
import type { ThermostatGroupCard } from "../src/thermostat-group-card";
import type { HassEntity, HomeAssistant } from "../src/types";

// Generic dummy names only: published previews must not reveal a real home.
const icons: Record<string, string> = {
  "mdi:sofa": mdiSofa,
  "mdi:bed": mdiBed,
  "mdi:desk": mdiDesk,
  "mdi:bathtub-outline": mdiBathtubOutline,
  "mdi:door": mdiDoor,
  "mdi:home-floor-1": mdiHomeFloor1,
  "mdi:home-floor-2": mdiHomeFloor2,
  "mdi:home-thermometer-outline": mdiHomeThermometerOutline,
  "mdi:cog-outline": mdiCogOutline,
};
if (!customElements.get("ha-icon"))
  customElements.define(
    "ha-icon",
    class extends HTMLElement {
      set icon(value: string) {
        this.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" style="display:block"><path d="${icons[value] ?? mdiThermostat}"/></svg>`;
      }
    },
  );

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
const sensor = (id: string, value: string, unit: string): HassEntity => ({
  entity_id: id,
  state: value,
  attributes: { unit_of_measurement: unit },
});
const states: Record<string, HassEntity> = Object.fromEntries(
  [
    room("climate.demo_living", "Stue", "heat", "heating", 21.3, 22),
    sensor("sensor.demo_living_valve_opening", "62", "%"),
    room("climate.demo_kitchen", "Kjøkken", "heat", "idle", 21.8, 21, {
      pi_heating_demand: 0,
    }),
    room("climate.demo_office", "Kontor", "cool", "cooling", 25.4, 22, {
      valve_position: 40,
    }),
    room("climate.demo_hall", "Gang", "heat", "idle", 19.6, 19, {
      valve_position: 0,
    }),
    room("climate.demo_bath", "Bad", "heat", "heating", 23.1, 24, {
      valve_position: 88,
    }),
    room("climate.demo_bedroom_1", "Soverom 1", "heat", "idle", 18.4, 18, {
      valve_position: 0,
    }),
    room("climate.demo_bedroom_2", "Soverom 2", "heat", "heating", 19.2, 20, {
      valve_position: 35,
    }),
    sensor("sensor.demo_outdoor", "4.5", "°C"),
    sensor("sensor.demo_flow", "34.0", "°C"),
  ].map((s) => [s.entity_id, s]),
);

/** A simulated day: flow follows the cold night, the valve opens in the morning. */
function history(message: Record<string, unknown>) {
  const start = Date.parse(String(message.start_time));
  const end = Date.now();
  const step = 20 * 60_000;
  const out: Record<string, unknown[]> = {};
  for (const id of message.entity_ids as string[]) {
    const rows: unknown[] = [];
    for (let t = start; t < end; t += step) {
      const hour = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      const night = Math.cos(((hour - 4) / 24) * 2 * Math.PI); // 1 at 04:00
      const morning = hour >= 5 && hour < 9 ? 1 - (hour - 5) / 4 : 0;
      const outdoor = 6 - 5 * night;
      const lu = t / 1000;
      if (id === "sensor.demo_outdoor")
        rows.push({ s: outdoor.toFixed(1), lu });
      else if (id === "sensor.demo_flow")
        rows.push({ s: (30 + 6 * night + 8 * morning).toFixed(1), lu });
      else if (id.endsWith("valve_opening"))
        rows.push({ s: String(Math.round(15 + 70 * morning)), lu });
      else if (id.startsWith("climate.")) {
        const a = states[id].attributes;
        rows.push({
          s: states[id].state,
          lu,
          a: {
            current_temperature: Number(
              (Number(a.current_temperature) - 0.8 * night).toFixed(1),
            ),
            valve_position: Math.round(10 + 60 * morning),
            pi_heating_demand: Math.round(10 + 60 * morning),
          },
        });
      }
    }
    out[id] = rows;
  }
  return out;
}

const hass: HomeAssistant = {
  states,
  language: "nb",
  locale: { language: "nb-NO" },
  config: { unit_system: { temperature: "°C" } },
  connection: { connected: true },
  entities: {
    "climate.demo_living": {
      entity_id: "climate.demo_living",
      device_id: "trv",
    },
    "sensor.demo_living_valve_opening": {
      entity_id: "sensor.demo_living_valve_opening",
      device_id: "trv",
    },
  },
  async callService(_domain, _service, data) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    states[data.entity_id as string].attributes.temperature = data.temperature;
    update();
  },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    return history(message) as T;
  },
};
const cards: Array<ThermostatValveCard | ThermostatGroupCard> = [];
function update() {
  for (const c of cards) c.hass = { ...hass, states: { ...hass.states } };
}
for (const [entity, icon, appearance] of [
  ["climate.demo_living", "mdi:sofa", "bubble"],
  ["climate.demo_bedroom_1", "mdi:bed", "bubble"],
  ["climate.demo_office", "mdi:desk", "default"],
] as const) {
  const c = document.createElement(
    "thermostat-valve-card",
  ) as ThermostatValveCard;
  c.setConfig({
    type: "custom:thermostat-valve-card",
    entity,
    icon,
    appearance,
    outdoor_entity: "sensor.demo_outdoor",
    flow_entity: "sensor.demo_flow",
  });
  c.hass = hass;
  document.querySelector("#cards")!.append(c);
  cards.push(c);
}
const group = document.createElement(
  "thermostat-group-card",
) as ThermostatGroupCard;
group.setConfig({
  type: "custom:thermostat-group-card",
  title: "Hjemme",
  appearance: "bubble",
  outdoor_entity: "sensor.demo_outdoor",
  flow_entity: "sensor.demo_flow",
  sections: [
    {
      name: "1. etasje",
      icon: "mdi:home-floor-1",
      thermostats: [
        { entity: "climate.demo_living", icon: "mdi:sofa" },
        { entity: "climate.demo_kitchen", icon: "mdi:sofa" },
        { entity: "climate.demo_hall", icon: "mdi:door" },
      ],
    },
    {
      name: "2. etasje",
      icon: "mdi:home-floor-2",
      thermostats: [
        { entity: "climate.demo_bath", icon: "mdi:bathtub-outline" },
        { entity: "climate.demo_office", icon: "mdi:desk" },
        { entity: "climate.demo_bedroom_1", icon: "mdi:bed" },
        { entity: "climate.demo_bedroom_2", icon: "mdi:bed" },
      ],
    },
  ],
});
group.hass = hass;
document.querySelector("#group")!.append(group);
cards.push(group);

document
  .querySelector("#theme")!
  .addEventListener("click", () => document.body.classList.toggle("dark"));
document.querySelector("#language")!.addEventListener("click", () => {
  hass.language = hass.language === "en" ? "nb" : "en";
  hass.locale = { language: hass.language === "en" ? "en-GB" : "nb-NO" };
  update();
});
let saved: HassEntity | undefined;
document.querySelector("#offline")!.addEventListener("click", () => {
  if (saved) {
    states["climate.demo_living"] = saved;
    saved = undefined;
  } else {
    saved = states["climate.demo_living"];
    states["climate.demo_living"] = { ...saved, state: "unavailable" };
  }
  update();
});
