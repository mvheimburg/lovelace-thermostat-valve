import type { ColorScheme } from "./color-schemes";
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_updated?: string;
  last_changed?: string;
}
/** The subset of the frontend's entity registry display cache we read. */
export interface EntityEntry {
  entity_id: string;
  device_id?: string | null;
  hidden?: boolean;
}
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, EntityEntry>;
  connection?: { connected: boolean };
  language?: string;
  locale?: { language?: string; number_format?: string; time_format?: string };
  config?: { unit_system?: { temperature?: string } };
  callService(
    domain: string,
    service: string,
    data: Record<string, unknown>,
  ): Promise<unknown>;
  callWS?<T>(message: Record<string, unknown>): Promise<T>;
}
export interface CardConfig {
  type: string;
  entity: string;
  valve_entity?: string;
  show_valve?: boolean;
  outdoor_entity?: string;
  flow_entity?: string;
  name?: string;
  icon?: string;
  appearance?: "default" | "bubble";
  color_scheme?: ColorScheme;
}
export interface GroupThermostat {
  entity: string;
  name?: string;
  icon?: string;
  valve_entity?: string;
}
export interface GroupSection {
  name?: string;
  icon?: string;
  thermostats: GroupThermostat[];
}
export interface GroupConfig {
  type: "custom:thermostat-group-card";
  title?: string;
  icon?: string;
  appearance?: "default" | "bubble";
  color_scheme?: ColorScheme;
  show_valve?: boolean;
  outdoor_entity?: string;
  flow_entity?: string;
  sections: GroupSection[];
}
