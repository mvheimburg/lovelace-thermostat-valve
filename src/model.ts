import type { CardConfig, HassEntity, HomeAssistant } from "./types";
export type Tone = "heating" | "cooling" | "idle" | "off" | "unavailable";
export function available(entity?: HassEntity): entity is HassEntity {
  return !!entity && !["unavailable", "unknown", ""].includes(entity.state);
}
export function numeric(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return;
  if (typeof value === "string" && !value.trim()) return;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
function action(entity: HassEntity): string | undefined {
  const value = entity.attributes.hvac_action;
  return typeof value === "string" && value ? value : undefined;
}
/**
 * What the room is doing. hvac_action is authoritative; entities that do not
 * report it fall back to their mode, so a thermostat set to heat reads warm.
 */
export function tone(entity?: HassEntity): Tone {
  if (!available(entity)) return "unavailable";
  const reported = action(entity);
  if (reported) {
    if (["heating", "preheating", "defrosting"].includes(reported))
      return "heating";
    if (reported === "cooling") return "cooling";
    return reported === "off" ? "off" : "idle";
  }
  if (entity.state === "heat") return "heating";
  if (entity.state === "cool") return "cooling";
  return entity.state === "off" ? "off" : "idle";
}
/** The status word: the reported action, else the mode. */
export function status(entity: HassEntity): {
  kind: "action" | "mode";
  value: string;
} {
  const reported = action(entity);
  return reported
    ? { kind: "action", value: reported }
    : { kind: "mode", value: entity.state };
}
// Attribute names TRV integrations use for the valve opening in percent.
const valveAttributes = [
  "valve_position",
  "valve_opening",
  "pi_heating_demand",
];
const valveId =
  /(valve_opening|valve_position|valve|pi_heating_demand|heating_demand)$/;
export interface Valve {
  value?: number;
  /** A separate entity the reading comes from, for more-info. */
  entityId?: string;
  /** The climate attribute the reading comes from, for history. */
  attribute?: string;
}
/**
 * The valve opening, from (in order) the configured entity, a climate
 * attribute, or a percent sensor/number on the same device.
 */
export function valve(
  hass: HomeAssistant,
  config: CardConfig,
  climate?: HassEntity,
): Valve | undefined {
  if (config.show_valve === false) return;
  const read = (id: string): Valve => {
    const e = hass.states[id];
    return { entityId: id, value: available(e) ? numeric(e.state) : undefined };
  };
  if (config.valve_entity) return read(config.valve_entity);
  for (const key of valveAttributes) {
    const value = numeric(climate?.attributes[key]);
    if (value !== undefined) return { value, attribute: key };
  }
  const device = hass.entities?.[config.entity]?.device_id;
  if (!device) return;
  const mates = Object.values(hass.entities ?? {}).filter(
    (e) =>
      e.device_id === device &&
      /^(sensor|number)\./.test(e.entity_id) &&
      valveId.test(e.entity_id) &&
      hass.states[e.entity_id]?.attributes.unit_of_measurement === "%",
  );
  // Prefer an explicit valve reading over a heating-demand estimate.
  mates.sort(
    (a, b) =>
      Number(/demand/.test(a.entity_id)) - Number(/demand/.test(b.entity_id)),
  );
  return mates[0] ? read(mates[0].entity_id) : undefined;
}
export interface Target {
  value?: number;
  min: number;
  max: number;
  step: number;
  digits: number;
  /** Single setpoint that the card may change. */
  settable: boolean;
  range?: [number, number];
}
const TARGET_TEMPERATURE = 1;
export function target(entity: HassEntity, unit: string): Target {
  const a = entity.attributes;
  const step =
    numeric(a.target_temp_step) ??
    numeric(a.precision) ??
    (unit === "°F" ? 1 : 0.5);
  const fahrenheit = unit === "°F";
  const min = numeric(a.min_temp) ?? (fahrenheit ? 45 : 7);
  const max = numeric(a.max_temp) ?? (fahrenheit ? 95 : 35);
  const digits = Math.min(2, (String(step).split(".")[1] ?? "").length);
  const value = numeric(a.temperature);
  const low = numeric(a.target_temp_low),
    high = numeric(a.target_temp_high);
  return {
    value,
    min,
    max,
    step,
    digits,
    settable:
      value !== undefined &&
      (Number(a.supported_features ?? 0) & TARGET_TEMPERATURE) !== 0,
    range:
      value === undefined && low !== undefined && high !== undefined
        ? [low, high]
        : undefined,
  };
}
/** Move by whole steps, snapped to the step grid and clamped to the range. */
export function nudge(t: Target, from: number, steps: number): number {
  const snapped = Math.round((from + steps * t.step) / t.step) * t.step;
  return Number(Math.min(t.max, Math.max(t.min, snapped)).toFixed(4));
}
