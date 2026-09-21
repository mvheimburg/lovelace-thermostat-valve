import { vi } from "vitest";
import type { HassEntity, HomeAssistant } from "../src/types";
export const state = (
  id: string,
  value: string,
  attributes: Record<string, unknown> = {},
): HassEntity => ({
  entity_id: id,
  state: value,
  attributes,
  last_updated: "2026-09-21T06:00:00Z",
});
export const climate = (
  attributes: Record<string, unknown> = {},
  value = "heat",
) =>
  state("climate.stue", value, {
    friendly_name: "Oppholdsrom",
    hvac_modes: ["off", "heat"],
    hvac_action: "heating",
    current_temperature: 21.3,
    temperature: 22,
    min_temp: 5,
    max_temp: 30,
    target_temp_step: 0.5,
    supported_features: 385,
    ...attributes,
  });
export function fixture(): HomeAssistant {
  const states = [
    climate(),
    state("sensor.stue_valve_opening", "35", { unit_of_measurement: "%" }),
    state("sensor.stue_battery", "80", { unit_of_measurement: "%" }),
  ];
  return {
    language: "en",
    config: { unit_system: { temperature: "°C" } },
    connection: { connected: true },
    states: Object.fromEntries(states.map((s) => [s.entity_id, s])),
    entities: {
      "climate.stue": { entity_id: "climate.stue", device_id: "trv" },
      "sensor.stue_valve_opening": {
        entity_id: "sensor.stue_valve_opening",
        device_id: "trv",
      },
      "sensor.stue_battery": {
        entity_id: "sensor.stue_battery",
        device_id: "trv",
      },
    },
    callService: vi.fn(async () => {}),
  };
}
