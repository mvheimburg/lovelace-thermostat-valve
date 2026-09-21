import type { CardConfig } from "./types";
export const TYPE = "custom:thermostat-valve-card";
export function normalizeConfig(config: CardConfig): CardConfig {
  if (!config || config.type !== TYPE)
    throw new Error(`Expected type: ${TYPE}`);
  if (
    typeof config.entity !== "string" ||
    !/^climate\.\w+$/.test(config.entity)
  )
    throw new Error("entity must be a climate entity");
  if (
    config.valve_entity !== undefined &&
    (typeof config.valve_entity !== "string" ||
      !/^(sensor|number|input_number)\.\w+$/.test(config.valve_entity))
  )
    throw new Error("valve_entity must be a sensor or number entity");
  for (const key of ["outdoor_entity", "flow_entity"] as const)
    if (
      config[key] !== undefined &&
      (typeof config[key] !== "string" ||
        !/^(sensor|input_number|number)\.\w+$/.test(config[key] ?? ""))
    )
      throw new Error(`${key} must be a sensor entity`);
  if (config.show_valve !== undefined && typeof config.show_valve !== "boolean")
    throw new Error("Invalid show_valve");
  if (
    config.appearance !== undefined &&
    !["default", "bubble"].includes(config.appearance)
  )
    throw new Error("Invalid appearance");
  for (const key of ["name", "icon"] as const)
    if (
      config[key] !== undefined &&
      (typeof config[key] !== "string" || !config[key]?.trim())
    )
      throw new Error(`Invalid ${key}`);
  return { appearance: "default", show_valve: true, ...config };
}
