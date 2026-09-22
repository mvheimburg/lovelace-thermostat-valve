import { afterEach, expect, it, vi } from "vitest";
import { ThermostatGroupCard } from "../src/thermostat-group-card";
import { ThermostatGroupEditor } from "../src/group-editor";
import {
  COMMIT_DELAY,
  ThermostatValveCard,
} from "../src/thermostat-valve-card";
import { climate, fixture, state } from "./ui-fixture";
import type { GroupConfig, HomeAssistant } from "../src/types";

const mounted: HTMLElement[] = [];
afterEach(() => {
  vi.useRealTimers();
  mounted.splice(0).forEach((c) => c.remove());
});
function house(): HomeAssistant {
  const hass = fixture();
  const office = {
    ...climate({ friendly_name: "Office", hvac_action: "cooling" }, "cool"),
    entity_id: "climate.office",
  };
  const loft = {
    ...climate({ friendly_name: "Loft", hvac_action: "idle" }),
    entity_id: "climate.loft",
  };
  hass.states["climate.office"] = office;
  hass.states["climate.loft"] = loft;
  hass.states["sensor.outdoor"] = state("sensor.outdoor", "4", {
    unit_of_measurement: "°C",
  });
  return hass;
}
const base: GroupConfig = {
  type: "custom:thermostat-group-card",
  title: "Upstairs",
  outdoor_entity: "sensor.outdoor",
  appearance: "bubble",
  sections: [
    {
      name: "Living",
      icon: "mdi:sofa",
      thermostats: [
        { entity: "climate.stue", name: "Living room" },
        { entity: "climate.office" },
      ],
    },
    { thermostats: [{ entity: "climate.loft", icon: "mdi:bed" }] },
  ],
};
async function card(config: unknown = base, hass: HomeAssistant = house()) {
  const c = new ThermostatGroupCard();
  c.setConfig(config);
  c.hass = hass;
  document.body.append(c);
  mounted.push(c);
  await c.updateComplete;
  await Promise.all(rooms(c).map((r) => r.updateComplete));
  return { c, hass };
}
const rooms = (c: HTMLElement) =>
  Array.from(
    c.shadowRoot!.querySelectorAll("thermostat-valve-card"),
  ) as ThermostatValveCard[];
const inRoom = (r: HTMLElement, selector: string) =>
  r.shadowRoot!.querySelector<HTMLElement>(selector)!;
const text = (root: ParentNode | null | undefined, selector: string) =>
  root?.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim();

it("shows each room group with its rooms as tiles, in order", async () => {
  const { c } = await card();
  const root = c.shadowRoot!;
  expect(text(root, "h2")).toBe("Upstairs");
  expect(
    Array.from(root.querySelectorAll("h3")).map((h) => h.textContent?.trim()),
  ).toEqual(["Living"]);
  const r = rooms(c);
  expect(r.map((x) => text(x.shadowRoot, ".title"))).toEqual([
    "Living room",
    "Office",
    "Loft",
  ]);
  expect(r.every((x) => x.hasAttribute("embedded"))).toBe(true);
  expect(r.every((x) => x.getAttribute("appearance") === "bubble")).toBe(true);
  expect(text(r[0].shadowRoot, "[data-valve]")).toBe("35%");
});

it("summarises what needs attention", async () => {
  const hass = house();
  hass.states["climate.loft"] = {
    ...hass.states["climate.loft"],
    state: "unavailable",
  };
  const { c } = await card(base, hass);
  expect(text(c.shadowRoot, "[data-summary]")).toBe(
    "1 heating · 1 cooling · 1 unavailable",
  );
  hass.states["climate.stue"] = climate({ hvac_action: "idle" });
  hass.states["climate.office"] = {
    ...hass.states["climate.office"],
    attributes: {
      ...hass.states["climate.office"].attributes,
      hvac_action: "idle",
    },
  };
  hass.states["climate.loft"] = {
    ...hass.states["climate.office"],
    entity_id: "climate.loft",
  };
  c.hass = { ...hass, states: { ...hass.states } };
  await c.updateComplete;
  expect(text(c.shadowRoot, "[data-summary]")).toBe("Not heating");
});

it("sends a room's target to that room's thermostat only", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const { c, hass } = await card();
  const office = rooms(c)[1];
  inRoom(office, '[data-step="up"]').click();
  await office.updateComplete;
  vi.advanceTimersByTime(COMMIT_DELAY);
  expect(hass.callService).toHaveBeenCalledTimes(1);
  expect(hass.callService).toHaveBeenCalledWith("climate", "set_temperature", {
    entity_id: "climate.office",
    temperature: 22.5,
  });
});

it("shows a rejected request on the room and restores its target", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const hass = house();
  hass.callService = vi.fn(async () => {
    throw new Error("Device offline");
  });
  const { c } = await card(base, hass);
  const office = rooms(c)[1];
  inRoom(office, '[data-step="down"]').click();
  vi.advanceTimersByTime(COMMIT_DELAY);
  await vi.waitFor(() =>
    expect(text(office.shadowRoot, "[role=alert]")).toBe(
      "Could not set temperature: Device offline",
    ),
  );
  expect(text(office.shadowRoot, "output")).toBe("22.0 °C");
});

it("shares the outdoor sensor with every room's history", async () => {
  const hass = house();
  const calls: Record<string, unknown>[] = [];
  hass.callWS = vi.fn(async (message: Record<string, unknown>) => {
    calls.push(message);
    return {} as never;
  }) as HomeAssistant["callWS"];
  const { c } = await card(base, hass);
  const loft = rooms(c)[2];
  inRoom(loft, "[data-name]").click();
  await vi.waitFor(() => expect(calls.length).toBeGreaterThan(0));
  expect(JSON.stringify(calls)).toContain("sensor.outdoor");
  expect(JSON.stringify(calls)).toContain("climate.loft");
  inRoom(loft, "[data-close]").click();
});

it("disables the rooms' buttons while Home Assistant is disconnected", async () => {
  const hass = house();
  hass.connection = { connected: false };
  const { c } = await card(base, hass);
  for (const r of rooms(c))
    expect(inRoom(r, '[data-step="up"]').hasAttribute("disabled")).toBe(true);
});

it("follows Bokmål, including aliases and a live language change", async () => {
  const hass = house();
  hass.language = "nb_NO";
  const { c } = await card({ ...base, title: undefined }, hass);
  expect(text(c.shadowRoot, "h2")).toBe("Termostater");
  expect(text(c.shadowRoot, "[data-summary]")).toBe("1 varmer · 1 kjøler");
  expect(
    c
      .shadowRoot!.querySelector("[data-action=configure]")!
      .getAttribute("aria-label"),
  ).toBe("Konfigurer");
  expect(text(rooms(c)[0].shadowRoot, "[data-status]")).toBe(
    "Varmer · 21,3 °C",
  );
  c.hass = { ...hass, language: "en" };
  await c.updateComplete;
  expect(text(c.shadowRoot, "h2")).toBe("Thermostats");
});

it("explains where rooms are set up, and prompts when there are none", async () => {
  const { c } = await card({ type: "custom:thermostat-group-card" });
  expect(text(c.shadowRoot, ".hint")).toBe(
    "Edit the dashboard and add rooms to this card.",
  );
  expect(c.shadowRoot!.querySelector("[data-summary]")).toBeNull();
  c.shadowRoot!.querySelector<HTMLElement>("[data-action=configure]")!.click();
  const dialog = c.shadowRoot!.querySelector("dialog")!;
  expect(dialog.open).toBe(true);
  expect(text(dialog, "p")).toContain("edit the card");
  dialog.close();
});

it("reports an invalid configuration in the card's language", async () => {
  const hass = house();
  hass.language = "nb";
  const { c } = await card(
    { ...base, sections: [{ thermostats: [{ entity: "light.x" }] }] },
    hass,
  );
  expect(text(c.shadowRoot, "[role=alert]")).toBe(
    "Hvert rom trenger en klimaenhet.",
  );
  expect(rooms(c)).toHaveLength(0);
  expect(c.shadowRoot!.querySelector("[data-action=configure]")).not.toBeNull();
});

it("keeps a room's card when the group changes, and resets it for a new entity", async () => {
  const { c } = await card();
  const first = rooms(c)[0];
  c.setConfig({ ...base, title: "Oppe" });
  await c.updateComplete;
  expect(rooms(c)[0]).toBe(first);
  c.setConfig({
    ...base,
    sections: [{ thermostats: [{ entity: "climate.loft" }] }],
  });
  await c.updateComplete;
  await rooms(c)[0].updateComplete;
  expect(rooms(c)).toHaveLength(1);
  expect(text(rooms(c)[0].shadowRoot, ".title")).toBe("Loft");
});

it("lets both cards grow with their content in a sections view", () => {
  expect(new ThermostatValveCard().getGridOptions().rows).toBe("auto");
  expect(new ThermostatGroupCard().getGridOptions().rows).toBe("auto");
});

async function editor(config: GroupConfig = base, hass = house()) {
  const e = new ThermostatGroupEditor();
  e.hass = hass;
  e.setConfig(config);
  document.body.append(e);
  mounted.push(e);
  await e.updateComplete;
  const changes: GroupConfig[] = [];
  e.addEventListener("config-changed", (ev) =>
    changes.push((ev as CustomEvent).detail.config),
  );
  return { e, changes };
}
const $ = <T extends HTMLElement>(e: HTMLElement, s: string) =>
  e.shadowRoot!.querySelector<T>(s)!;
const last = <T>(list: T[]) => list[list.length - 1];
function type(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("change"));
}

it("keeps a new room as a draft until its climate entity is chosen", async () => {
  const { e, changes } = await editor();
  $(e, '[data-section="1"] [data-action=add-thermostat]').click();
  await e.updateComplete;
  expect(changes).toHaveLength(0);
  expect($(e, "[data-warning]")).not.toBeNull();
  const entity = $<HTMLInputElement>(e, '[data-room="1.1"] input');
  type(entity, "climate.office");
  await e.updateComplete;
  expect(e.shadowRoot!.querySelector("[data-warning]")).toBeNull();
  expect(last(changes).sections[1].thermostats).toEqual([
    { entity: "climate.loft", icon: "mdi:bed" },
    { entity: "climate.office" },
  ]);
});

it("reorders and removes rooms and room groups", async () => {
  const { e, changes } = await editor();
  $(e, '[data-room="0.1"] [data-action=up]').click();
  expect(
    last(changes).sections[0].thermostats.map(
      (t: { entity: string }) => t.entity,
    ),
  ).toEqual(["climate.office", "climate.stue"]);
  await e.updateComplete;
  $(e, '[data-section="1"] > .bar [data-action=up]').click();
  expect(last(changes).sections[0].thermostats[0].entity).toBe("climate.loft");
  await e.updateComplete;
  $(e, '[data-section="0"] > .bar [data-action=remove]').click();
  expect(last(changes).sections).toHaveLength(1);
});

it("edits shared settings and clears empty optional fields", async () => {
  const { e, changes } = await editor();
  const inputs = e.shadowRoot!.querySelectorAll<HTMLInputElement>(
    ".editor > label > input",
  );
  type(inputs[0], "Oppe");
  expect(last(changes).title).toBe("Oppe");
  const outdoor = Array.from(inputs).find((i) => i.value === "sensor.outdoor")!;
  type(outdoor, "");
  expect("outdoor_entity" in last(changes)).toBe(false);
  $<HTMLInputElement>(e, "[data-config=show_valve]").click();
  expect(last(changes).show_valve).toBe(false);
});

it("labels the editor in Bokmål", async () => {
  const hass = house();
  hass.language = "nb";
  const { e } = await editor(base, hass);
  expect(text(e.shadowRoot, "[data-action=add-section]")).toBe(
    "+ Legg til romgruppe",
  );
  expect(text(e.shadowRoot, '[data-section="1"] legend')).toBe("Romgruppe 2");
});
