import type { HomeAssistant } from "./types";
type Context = Pick<HomeAssistant, "language" | "locale">;
const norwegian = /^(nb|nn|no)(-|$)/;
function tag(value: string | undefined): string {
  return (value ?? "").replace(/_/g, "-").toLowerCase();
}
/** Dictionary language: `nb` for Bokmål and its aliases, otherwise `en`. */
export function language(hass?: Context): "en" | "nb" {
  return norwegian.test(tag(hass?.language || hass?.locale?.language))
    ? "nb"
    : "en";
}
/**
 * Formatting locale, kept apart from the dictionary: `en-GB` keeps its own
 * formats. Norwegian aliases become `nb-NO`; malformed tags fall back to `en`.
 */
export function formatLocale(hass?: Context): string {
  const value = tag(hass?.locale?.language || hass?.language || "en");
  if (norwegian.test(value)) return "nb-NO";
  try {
    return Intl.getCanonicalLocales(value)[0] ?? "en";
  } catch {
    return "en";
  }
}
/** HA's number-format preference, as HA's own frontend maps it. */
function numberLocale(hass?: Context): string | undefined {
  switch (hass?.locale?.number_format) {
    case "comma_decimal":
      return "de";
    case "decimal_period":
      return "en-US";
    case "space_comma":
      return "fr";
    case "system":
      return undefined;
    default:
      return formatLocale(hass);
  }
}
export function formatNumber(
  hass: Context | undefined,
  value: number,
  fractionDigits: number,
): string {
  return new Intl.NumberFormat(numberLocale(hass), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: hass?.locale?.number_format !== "none",
  }).format(value);
}
export function formatPercent(
  hass: Context | undefined,
  value: number,
): string {
  return new Intl.NumberFormat(numberLocale(hass), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100);
}
const en = {
  heating: "Heating",
  cooling: "Cooling",
  idle: "Idle",
  off: "Off",
  drying: "Drying",
  fan: "Fan",
  preheating: "Preheating",
  defrosting: "Defrosting",
  heat: "Heat",
  cool: "Cool",
  heat_cool: "Heat/cool",
  auto: "Auto",
  dry: "Dry",
  fan_only: "Fan only",
  unavailable: "Unavailable",
  missing: "Entity not found",
  valve: "Valve opening",
  target: "Target temperature",
  lower: "Lower target temperature",
  raise: "Raise target temperature",
  range: "Target range",
  failed: "Could not set temperature",
  entity: "Climate entity",
  valve_entity: "Valve entity (optional, found automatically)",
  show_valve: "Show valve opening",
  name: "Name",
  icon: "Icon",
  appearance: "Appearance",
  default: "Default",
  bubble: "Bubble",
  invalidValue: "Invalid value",
  history: "History",
  historyFailed: "Could not load history",
  noHistory: "No history for this period",
  loading: "Loading history…",
  close: "Close",
  now: "Now",
  room: "Room",
  outdoor: "Outdoor",
  flow: "Flow",
  outdoor_entity: "Outdoor temperature (for history)",
  flow_entity: "Flow temperature (for history)",
  groupTitle: "Thermostats",
  configure: "Configure",
  configureHelp:
    "Rooms, names, icons and the outdoor and flow sensors belong to this card: edit the dashboard, then edit the card. Tap a room's icon to change its mode or preset in Home Assistant.",
  setup: "Edit the dashboard and add rooms to this card.",
  summaryHeating: "{n} heating",
  summaryCooling: "{n} cooling",
  summaryUnavailable: "{n} unavailable",
  allIdle: "Not heating",
  title: "Title",
  sections: "Room groups",
  sectionName: "Group heading (optional)",
  addSection: "Add room group",
  addThermostat: "Add room",
  thermostatN: "Room {n}",
  sectionN: "Room group {n}",
  moveUp: "Move up",
  moveDown: "Move down",
  remove: "Remove",
  draftInvalid:
    "Your latest edits are not saved yet. Choose a climate entity for every room, or remove the empty row.",
  invalidConfig: "The card configuration must be an object.",
  invalidType: "Expected type: custom:thermostat-group-card.",
  invalidAppearance: "appearance must be default or bubble.",
  invalidScheme:
    "Choose a valid color_scheme: home-assistant, bright, warm, mint, sky or lavender.",
  invalidSections: "sections must be a list of room groups.",
  invalidSection: "Each room group needs a list of thermostats.",
  invalidThermostat: "Each room needs a climate entity.",
  invalidValveEntity: "valve_entity must be a sensor or number entity.",
  invalidSensor: "outdoor_entity and flow_entity must be sensor entities.",
  invalidText: "Titles, names and icons must be text.",
  invalidShowValve: "show_valve must be true or false.",
};
const nb: typeof en = {
  heating: "Varmer",
  cooling: "Kjøler",
  idle: "Hviler",
  off: "Av",
  drying: "Avfukter",
  fan: "Vifte",
  preheating: "Forvarmer",
  defrosting: "Avriser",
  heat: "Varme",
  cool: "Kjøling",
  heat_cool: "Varme/kjøling",
  auto: "Auto",
  dry: "Avfukting",
  fan_only: "Bare vifte",
  unavailable: "Utilgjengelig",
  missing: "Fant ikke enheten",
  valve: "Ventilåpning",
  target: "Ønsket temperatur",
  lower: "Senk ønsket temperatur",
  raise: "Øk ønsket temperatur",
  range: "Ønsket område",
  failed: "Kunne ikke endre temperaturen",
  entity: "Klimaenhet",
  valve_entity: "Ventilenhet (valgfri, finnes automatisk)",
  show_valve: "Vis ventilåpning",
  name: "Navn",
  icon: "Ikon",
  appearance: "Utseende",
  default: "Standard",
  bubble: "Bubble",
  invalidValue: "Ugyldig verdi",
  history: "Historikk",
  historyFailed: "Kunne ikke hente historikk",
  noHistory: "Ingen historikk for denne perioden",
  loading: "Henter historikk …",
  close: "Lukk",
  now: "Nå",
  room: "Rom",
  outdoor: "Ute",
  flow: "Tur",
  outdoor_entity: "Utetemperatur (for historikk)",
  flow_entity: "Turtemperatur (for historikk)",
  groupTitle: "Termostater",
  configure: "Konfigurer",
  configureHelp:
    "Rom, navn, ikoner og ute- og turtemperatur hører til dette kortet: rediger dashbordet, og rediger så kortet. Trykk på ikonet til et rom for å endre modus eller forhåndsvalg i Home Assistant.",
  setup: "Rediger dashbordet og legg til rom i dette kortet.",
  summaryHeating: "{n} varmer",
  summaryCooling: "{n} kjøler",
  summaryUnavailable: "{n} utilgjengelig",
  allIdle: "Varmer ikke",
  title: "Tittel",
  sections: "Romgrupper",
  sectionName: "Gruppeoverskrift (valgfri)",
  addSection: "Legg til romgruppe",
  addThermostat: "Legg til rom",
  thermostatN: "Rom {n}",
  sectionN: "Romgruppe {n}",
  moveUp: "Flytt opp",
  moveDown: "Flytt ned",
  remove: "Fjern",
  draftInvalid:
    "De siste endringene er ikke lagret ennå. Velg en klimaenhet for hvert rom, eller fjern den tomme raden.",
  invalidConfig: "Kortoppsettet må være et objekt.",
  invalidType: "Forventet type: custom:thermostat-group-card.",
  invalidAppearance: "appearance må være default eller bubble.",
  invalidScheme:
    "Velg en gyldig color_scheme: home-assistant, bright, warm, mint, sky eller lavender.",
  invalidSections: "sections må være en liste med romgrupper.",
  invalidSection: "Hver romgruppe trenger en liste med termostater.",
  invalidThermostat: "Hvert rom trenger en klimaenhet.",
  invalidValveEntity: "valve_entity må være en sensor- eller tallenhet.",
  invalidSensor: "outdoor_entity og flow_entity må være sensorenheter.",
  invalidText: "Titler, navn og ikoner må være tekst.",
  invalidShowValve: "show_valve må være true eller false.",
};
export type TextKey = keyof typeof en;
export function localize(hass: Context | undefined, key: TextKey): string {
  return (language(hass) === "nb" ? nb : en)[key];
}
const actions = [
  "heating",
  "cooling",
  "idle",
  "off",
  "drying",
  "fan",
  "preheating",
  "defrosting",
];
const modes = ["off", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"];
/** Display label for an hvac_action; unknown values stay recognizable. */
export function actionLabel(hass: Context | undefined, action: string): string {
  return actions.includes(action) ? localize(hass, action as TextKey) : action;
}
export function modeLabel(hass: Context | undefined, mode: string): string {
  return modes.includes(mode) ? localize(hass, mode as TextKey) : mode;
}
