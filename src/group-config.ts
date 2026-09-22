import { colorSchemes } from "./color-schemes";
import type { GroupConfig, GroupSection, GroupThermostat } from "./types";
export const GROUP_TYPE = "custom:thermostat-group-card" as const;
export type GroupErrorCode =
  | "invalidConfig"
  | "invalidType"
  | "invalidAppearance"
  | "invalidScheme"
  | "invalidSections"
  | "invalidSection"
  | "invalidThermostat"
  | "invalidValveEntity"
  | "invalidSensor"
  | "invalidText"
  | "invalidShowValve";
export class GroupConfigError extends Error {
  constructor(readonly code: GroupErrorCode) {
    super(code);
  }
}
function object(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new GroupConfigError("invalidConfig");
  return input as Record<string, unknown>;
}
function text(input: Record<string, unknown>, key: string): void {
  if (input[key] !== undefined && typeof input[key] !== "string")
    throw new GroupConfigError("invalidText");
}
function entity(
  input: Record<string, unknown>,
  key: string,
  pattern: RegExp,
  code: GroupErrorCode,
): void {
  const value = input[key];
  if (
    value !== undefined &&
    (typeof value !== "string" || !pattern.test(value))
  )
    throw new GroupConfigError(code);
}
const sensor = /^(sensor|number|input_number)\.\w+$/;
export function normalizeGroupConfig(input: unknown): GroupConfig {
  const c = object(input);
  if (c.type !== GROUP_TYPE) throw new GroupConfigError("invalidType");
  text(c, "title");
  text(c, "icon");
  if (
    c.appearance !== undefined &&
    !["default", "bubble"].includes(String(c.appearance))
  )
    throw new GroupConfigError("invalidAppearance");
  if (
    c.color_scheme !== undefined &&
    !colorSchemes.includes(c.color_scheme as (typeof colorSchemes)[number])
  )
    throw new GroupConfigError("invalidScheme");
  if (c.show_valve !== undefined && typeof c.show_valve !== "boolean")
    throw new GroupConfigError("invalidShowValve");
  entity(c, "outdoor_entity", sensor, "invalidSensor");
  entity(c, "flow_entity", sensor, "invalidSensor");
  const sections = c.sections ?? [];
  if (!Array.isArray(sections)) throw new GroupConfigError("invalidSections");
  return {
    ...c,
    type: GROUP_TYPE,
    sections: sections.map((value): GroupSection => {
      const s = object(value);
      if (!Array.isArray(s.thermostats))
        throw new GroupConfigError("invalidSection");
      text(s, "name");
      text(s, "icon");
      return {
        ...s,
        thermostats: s.thermostats.map((value): GroupThermostat => {
          const t = object(value);
          if (typeof t.entity !== "string" || !/^climate\.\w+$/.test(t.entity))
            throw new GroupConfigError("invalidThermostat");
          text(t, "name");
          text(t, "icon");
          entity(t, "valve_entity", sensor, "invalidValveEntity");
          return { ...t, entity: t.entity };
        }),
      };
    }),
  };
}
