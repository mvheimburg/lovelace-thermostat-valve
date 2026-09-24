import { afterEach, expect, it, vi } from "vitest";
import {
  COMMIT_DELAY,
  ThermostatValveCard,
} from "../src/thermostat-valve-card";
import { ThermostatValveEditor } from "../src/editor";
import { climate, fixture, state } from "./ui-fixture";
import type { CardConfig, HomeAssistant } from "../src/types";

const mounted: HTMLElement[] = [];
afterEach(() => {
  vi.useRealTimers();
  mounted.splice(0).forEach((c) => c.remove());
});
async function card(
  config: Partial<CardConfig> = {},
  hass: HomeAssistant = fixture(),
) {
  const c = new ThermostatValveCard();
  c.setConfig({
    type: "custom:thermostat-valve-card",
    entity: "climate.stue",
    ...config,
  });
  c.hass = hass;
  document.body.append(c);
  mounted.push(c);
  await c.updateComplete;
  return { c, hass };
}
const q = <T extends Element>(c: HTMLElement, selector: string) =>
  c.shadowRoot!.querySelector<T>(selector)!;
const text = (c: HTMLElement, selector: string) =>
  q(c, selector)?.textContent?.replace(/\s+/g, " ").trim();
async function update(c: ThermostatValveCard, hass: HomeAssistant) {
  c.hass = { ...hass, states: { ...hass.states } };
  await c.updateComplete;
}

it("shows the room, what it is doing, the valve and the target", async () => {
  const { c } = await card();
  expect(text(c, ".title")).toContain("Oppholdsrom");
  expect(text(c, "[data-status]")).toBe("Heating · 21.3 °C");
  expect(text(c, "[data-valve]")).toBe("35%");
  expect(text(c, "output")).toBe("22.0 °C");
  expect(q(c, "ha-card").classList).toContain("tone-heating");
});

it("collects several presses into one set_temperature call after a pause", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const { c, hass } = await card();
  const up = q<HTMLButtonElement>(c, '[data-step="up"]');
  up.click();
  up.click();
  up.click();
  await c.updateComplete;
  expect(text(c, "output")).toBe("23.5 °C");
  expect(q(c, "output").classList).toContain("pending");
  vi.advanceTimersByTime(COMMIT_DELAY - 1);
  expect(hass.callService).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(hass.callService).toHaveBeenCalledTimes(1);
  expect(hass.callService).toHaveBeenCalledWith("climate", "set_temperature", {
    entity_id: "climate.stue",
    temperature: 23.5,
  });
});

it("blocks duplicate requests while one is pending and settles on HA's value", async () => {
  const { c, hass } = await card();
  let done!: () => void;
  vi.mocked(hass.callService).mockImplementationOnce(
    () => new Promise<void>((resolve) => (done = resolve)) as Promise<unknown>,
  );
  q<HTMLButtonElement>(c, '[data-step="down"]').click();
  const first = c.commit();
  await c.updateComplete;
  expect(q<HTMLButtonElement>(c, '[data-step="down"]').disabled).toBe(true);
  expect(q(c, "output").getAttribute("aria-busy")).toBe("true");
  q<HTMLButtonElement>(c, '[data-step="down"]').click();
  await c.commit();
  expect(hass.callService).toHaveBeenCalledTimes(1);
  done();
  await first;
  await c.updateComplete;
  expect(text(c, "output")).toBe("21.5 °C");
  hass.states["climate.stue"] = climate({ temperature: 21.5 });
  await update(c, hass);
  expect(q(c, "output").classList).not.toContain("pending");
  expect(q<HTMLButtonElement>(c, '[data-step="down"]').disabled).toBe(false);
});

it("restores the authoritative target and explains a failed request", async () => {
  const { c, hass } = await card();
  vi.mocked(hass.callService).mockRejectedValueOnce(Error("Device timed out"));
  q<HTMLButtonElement>(c, '[data-step="up"]').click();
  await c.commit();
  await c.updateComplete;
  expect(text(c, "[role=alert]")).toBe(
    "Could not set temperature: Device timed out",
  );
  expect(text(c, "output")).toBe("22.0 °C");
});

it("stops at the reported range and snaps to the step", async () => {
  const hass = fixture();
  hass.states["climate.stue"] = climate({
    temperature: 29.8,
    target_temp_step: 0.5,
  });
  const { c } = await card({}, hass);
  q<HTMLButtonElement>(c, '[data-step="up"]').click();
  await c.updateComplete;
  expect(text(c, "output")).toBe("30.0 °C");
  expect(q<HTMLButtonElement>(c, '[data-step="up"]').disabled).toBe(true);
});

it("disables actions when the thermostat or the connection is unavailable", async () => {
  const { c, hass } = await card();
  hass.states["climate.stue"] = state("climate.stue", "unavailable", {
    friendly_name: "Oppholdsrom",
  });
  await update(c, hass);
  expect(text(c, "[data-status]")).toBe("Unavailable");
  expect(text(c, "output")).toBe("—");
  expect(q<HTMLButtonElement>(c, '[data-step="up"]').disabled).toBe(true);
  expect(q(c, "ha-card").classList).toContain("tone-unavailable");

  const offline = fixture();
  offline.connection = { connected: false };
  const second = await card({}, offline);
  expect(q<HTMLButtonElement>(second.c, '[data-step="up"]').disabled).toBe(
    true,
  );
  q<HTMLButtonElement>(second.c, '[data-step="up"]').click();
  await second.c.commit();
  expect(offline.callService).not.toHaveBeenCalled();
});

it("reports a missing entity without crashing", async () => {
  const { c } = await card({ entity: "climate.gone" });
  expect(text(c, ".title")).toBe("climate.gone");
  expect(text(c, "[data-status]")).toBe("Entity not found");
});

it.each([
  [{ hvac_action: "cooling" }, "cool", "tone-cooling", "Cooling"],
  [{ hvac_action: "idle" }, "heat", "tone-idle", "Idle"],
  [{ hvac_action: undefined }, "heat", "tone-heating", "Heat"],
  [{ hvac_action: undefined }, "off", "tone-off", "Off"],
  [{ hvac_action: "venting" }, "heat", "tone-idle", "venting"],
])("tones %o in mode %s as %s", async (attributes, mode, tone, word) => {
  const hass = fixture();
  hass.states["climate.stue"] = climate(attributes, mode);
  const { c } = await card({}, hass);
  expect(q(c, "ha-card").classList).toContain(tone);
  expect(text(c, "[data-status] strong")).toBe(word);
});

it("reads the valve from config, climate attributes or the same device", async () => {
  const hass = fixture();
  hass.states["sensor.other"] = state("sensor.other", "80", {
    unit_of_measurement: "%",
  });
  const configured = await card({ valve_entity: "sensor.other" }, hass);
  expect(text(configured.c, "[data-valve]")).toBe("80%");
  q<HTMLButtonElement>(configured.c, "[data-valve]").click();

  const attr = fixture();
  attr.states["climate.stue"] = climate({ pi_heating_demand: 12 });
  const fromAttribute = await card({}, attr);
  expect(text(fromAttribute.c, "[data-valve]")).toBe("12%");
  expect(q(fromAttribute.c, "[data-valve]").tagName).toBe("BUTTON");

  const hidden = await card({ show_valve: false });
  expect(q(hidden.c, "[data-valve]")).toBeNull();

  const none = fixture();
  none.entities = {};
  const missing = await card({}, none);
  expect(q(missing.c, "[data-valve]")).toBeNull();

  const down = fixture();
  down.states["sensor.stue_valve_opening"] = state(
    "sensor.stue_valve_opening",
    "unavailable",
    { unit_of_measurement: "%" },
  );
  const unavailable = await card({}, down);
  expect(text(unavailable.c, "[data-valve]")).toBe("—");
  expect(q(unavailable.c, "[data-valve]").getAttribute("aria-label")).toBe(
    "Valve opening: Unavailable. History",
  );
});

const HOUR = 3_600_000;
/** History replies as Home Assistant's websocket sends them (seconds). */
function withHistory(hass: HomeAssistant, now: number, fail?: Error) {
  const s = (ms: number) => ms / 1000;
  hass.states["sensor.ute"] = state("sensor.ute", "4.5", {
    device_class: "temperature",
    unit_of_measurement: "°C",
  });
  hass.states["sensor.tur"] = state("sensor.tur", "30", {
    device_class: "temperature",
    unit_of_measurement: "°C",
  });
  const callWS = vi.fn(async (message: Record<string, unknown>) => {
    if (fail) throw fail;
    const ids = message.entity_ids as string[];
    const rows: Record<string, unknown[]> = {
      "climate.stue": [
        { s: "heat", a: { current_temperature: 20.1 }, lu: s(now - 20 * HOUR) },
        { s: "heat", a: { current_temperature: 21 }, lu: s(now - 10 * HOUR) },
      ],
      "sensor.stue_valve_opening": [
        { s: "0", lu: s(now - 20 * HOUR) },
        { s: "unavailable", lu: s(now - 12 * HOUR) },
        { s: "80", lu: s(now - 8 * HOUR) },
      ],
      "sensor.ute": [{ s: "2", lu: s(now - 20 * HOUR) }],
      "sensor.tur": [{ s: "28", lu: s(now - 20 * HOUR) }],
    };
    return Object.fromEntries(ids.map((id) => [id, rows[id] ?? []]));
  });
  hass.callWS = callWS as HomeAssistant["callWS"];
  return callWS;
}
const settle = () => new Promise((r) => setTimeout(r, 0));
const legend = (c: HTMLElement) =>
  Array.from(c.shadowRoot!.querySelectorAll(".history-legend .history-item")).map((i) =>
    i.textContent!.replace(/\s+/g, " ").trim(),
  );

it("opens one history of valve, room, outdoor and flow temperature from the valve or the name", async () => {
  const now = Date.now();
  const hass = fixture();
  const callWS = withHistory(hass, now);
  const { c } = await card(
    { outdoor_entity: "sensor.ute", flow_entity: "sensor.tur" },
    hass,
  );
  q<HTMLButtonElement>(c, "[data-valve]").click();
  await c.updateComplete;
  await settle();
  await c.updateComplete;
  const dialog = q<HTMLDialogElement>(c, "#history");
  expect(dialog.open).toBe(true);
  expect(text(c, "#history-title")).toContain("Oppholdsrom");
  expect(callWS).toHaveBeenCalledTimes(2);
  const messages = callWS.mock.calls.map((call) => call[0]);
  const withAttributes = messages.find((message) => message.no_attributes === false)!;
  const plain = messages.find((message) => message.no_attributes === true)!;
  expect(withAttributes).toMatchObject({
    type: "history/history_during_period",
    entity_ids: ["climate.stue"],
    minimal_response: false,
    no_attributes: false,
    significant_changes_only: false,
  });
  expect(plain).toMatchObject({
    entity_ids: ["sensor.stue_valve_opening", "sensor.ute", "sensor.tur"],
    minimal_response: true,
    no_attributes: true,
  });
  expect(Date.parse(String(plain.start_time))).toBeCloseTo(now - 24 * HOUR, -4);
  // Current values, with the valve drawn as an area and three temperature lines.
  expect(legend(c)).toEqual([
    "Valve opening 35%",
    "Room 21.3 °C",
    "Outdoor 4.5 °C",
    "Flow 30.0 °C",
  ]);
  expect(c.shadowRoot!.querySelectorAll(".history-chart .area.series-0")).toHaveLength(1);
  expect(c.shadowRoot!.querySelectorAll(".history-chart .line")).toHaveLength(4);
  // The unavailable spell leaves a gap: two separate line runs.
  expect(
    q(c, ".history-chart .line.series-0").getAttribute("d")!.match(/M/g),
  ).toHaveLength(2);

  dialog.close();
  q<HTMLButtonElement>(c, "[data-name]").click();
  await c.updateComplete;
  expect(dialog.open).toBe(true);
});

it("shows the values under the pointer and reloads for another range", async () => {
  const now = Date.now();
  const hass = fixture();
  const callWS = withHistory(hass, now);
  const { c } = await card({ outdoor_entity: "sensor.ute" }, hass);
  q<HTMLButtonElement>(c, "[data-valve]").click();
  await settle();
  await c.updateComplete;
  const plot = q<HTMLElement>(c, ".history-plot");
  const box = q(c, ".history-chart").getBoundingClientRect();
  const width = q<SVGSVGElement>(c, ".history-chart").viewBox.baseVal.width;
  // The plot spans x 40 to width − 44; a third in is 16 hours ago.
  plot.dispatchEvent(
    new PointerEvent("pointermove", {
      clientX: box.left + ((40 + (width - 84) / 3) / width) * box.width,
      bubbles: true,
    }),
  );
  await c.updateComplete;
  expect(legend(c)).toEqual([
    "Valve opening 0%",
    "Room 20.1 °C",
    "Outdoor 2.0 °C",
  ]);
  expect(q(c, ".history-chart .cursor")).not.toBeNull();
  plot.dispatchEvent(new PointerEvent("pointerleave"));
  await c.updateComplete;
  expect(text(c, ".history-when")).toBe("Now");

  q<HTMLButtonElement>(c, '[data-range="168"]').click();
  await settle();
  await c.updateComplete;
  expect(callWS).toHaveBeenCalledTimes(4);
  expect(Date.parse(String(callWS.mock.calls[3][0].start_time))).toBeCloseTo(
    now - 168 * HOUR,
    -4,
  );
  expect(q(c, '[data-range="168"]').getAttribute("aria-pressed")).toBe("true");
});

it("explains a failed history request and speaks Bokmål", async () => {
  const hass = fixture();
  hass.language = "nb";
  withHistory(hass, Date.now(), new Error("Recorder is off"));
  const { c } = await card({}, hass);
  q<HTMLButtonElement>(c, "[data-name]").click();
  await settle();
  await c.updateComplete;
  expect(text(c, "#history [role=alert]")).toContain("Recorder is off");
  expect(text(c, "[data-retry]")).toBe("Prøv igjen");
  expect(
    Array.from(c.shadowRoot!.querySelectorAll("[data-range]")).map((b) =>
      b.textContent!.trim(),
    ),
  ).toEqual(["6 t", "24 t", "7 d"]);
  expect(q(c, "[data-close-history]").getAttribute("aria-label")).toBe("Lukk historikk");
});

it("opens more-info for the thermostat from the icon and for a line from the legend", async () => {
  const hass = fixture();
  withHistory(hass, Date.now());
  const { c } = await card({ flow_entity: "sensor.tur" }, hass);
  const opened: string[] = [];
  c.addEventListener("hass-more-info", (e) =>
    opened.push((e as CustomEvent).detail.entityId),
  );
  q<HTMLButtonElement>(c, ".symbol").click();
  q<HTMLButtonElement>(c, "[data-valve]").click();
  await settle();
  await c.updateComplete;
  expect(opened).toEqual(["climate.stue"]);
  q<HTMLButtonElement>(c, '[data-series="sensor.tur"]').click();
  expect(q<HTMLDialogElement>(c, "#history").open).toBe(false);
  expect(opened).toEqual(["climate.stue", "sensor.tur"]);
});

it("clears loaded history when the thermostat changes", async () => {
  const hass = fixture();
  withHistory(hass, Date.now());
  const { c } = await card({}, hass);
  q<HTMLButtonElement>(c, "[data-valve]").click();
  await settle();
  await c.updateComplete;
  expect(legend(c).length).toBeGreaterThan(0);
  c.setConfig({
    type: "custom:thermostat-valve-card",
    entity: "climate.other",
  });
  await c.updateComplete;
  expect(q<HTMLDialogElement>(c, "#history").open).toBe(false);
  expect(legend(c)).toEqual([]);
  expect(() =>
    c.setConfig({
      type: "custom:thermostat-valve-card",
      entity: "climate.stue",
      outdoor_entity: "weather.home",
    }),
  ).toThrow("outdoor_entity");
});

it("shows a dual setpoint read-only instead of guessing which end to move", async () => {
  const hass = fixture();
  hass.states["climate.stue"] = climate(
    { temperature: null, target_temp_low: 20, target_temp_high: 24 },
    "heat_cool",
  );
  const { c } = await card({}, hass);
  expect(q(c, ".stepper")).toBeNull();
  expect(text(c, ".range")).toBe("20.0–24.0 °C");
});

it("localizes Bokmål from locale aliases, follows language changes and keeps names", async () => {
  const hass = {
    ...fixture(),
    language: undefined,
    locale: { language: "NB_no" },
  };
  const { c } = await card({ name: "Stua" }, hass);
  expect(text(c, ".title")).toBe("Stua");
  expect(text(c, "[data-status]")).toBe("Varmer · 21,3 °C");
  expect(text(c, "output")).toBe("22,0 °C");
  expect(text(c, "[data-valve]")).toBe("35 %");
  expect(q(c, '[data-step="up"]').getAttribute("aria-label")).toBe(
    "Øk ønsket temperatur",
  );
  c.hass = { ...hass, language: "en", locale: { language: "en-GB" } };
  await c.updateComplete;
  expect(text(c, "[data-status]")).toBe("Heating · 21.3 °C");
  c.hass = {
    ...hass,
    language: "en",
    locale: { language: "en", number_format: "comma_decimal" },
  };
  await c.updateComplete;
  expect(text(c, "output")).toBe("22,0 °C");
});

it("drops a draft when the configured thermostat changes", async () => {
  const hass = fixture();
  hass.states["climate.kjokken"] = {
    ...climate({ friendly_name: "Kjøkken", temperature: 19 }),
    entity_id: "climate.kjokken",
  };
  const { c } = await card({}, hass);
  q<HTMLButtonElement>(c, '[data-step="up"]').click();
  c.setConfig({
    type: "custom:thermostat-valve-card",
    entity: "climate.kjokken",
  });
  await c.updateComplete;
  expect(text(c, "output")).toBe("19.0 °C");
  await c.commit();
  expect(hass.callService).not.toHaveBeenCalled();
});

it("rejects invalid configuration", () => {
  const c = new ThermostatValveCard();
  expect(() =>
    c.setConfig({ type: "custom:thermostat-valve-card", entity: "sensor.x" }),
  ).toThrow(/climate/);
  expect(() =>
    c.setConfig({
      type: "custom:thermostat-valve-card",
      entity: "climate.x",
      valve_entity: "switch.x",
    }),
  ).toThrow(/valve_entity/);
});

it("edits configuration in Bokmål, keeps other keys and validates entities", async () => {
  const editor = new ThermostatValveEditor();
  editor.hass = { ...fixture(), language: "nb" };
  editor.setConfig({
    type: "custom:thermostat-valve-card",
    entity: "climate.stue",
    name: "Stua",
  });
  document.body.append(editor);
  mounted.push(editor);
  await editor.updateComplete;
  expect(editor.shadowRoot!.textContent).toContain("Vis ventilåpning");
  const options = Array.from(
    editor.shadowRoot!.querySelectorAll("#valve_entity-options option"),
    (o) => o.getAttribute("value"),
  );
  expect(options).toEqual(["sensor.stue_valve_opening", "sensor.stue_battery"]);
  const event = vi.fn();
  editor.addEventListener("config-changed", event);
  const appearance = editor.shadowRoot!.querySelector<HTMLSelectElement>(
    '[data-config="appearance"]',
  )!;
  appearance.value = "bubble";
  appearance.dispatchEvent(new Event("change"));
  expect(event.mock.calls[0][0].detail.config).toEqual({
    type: "custom:thermostat-valve-card",
    entity: "climate.stue",
    name: "Stua",
    appearance: "bubble",
  });
  const valve = editor.shadowRoot!.querySelector<HTMLInputElement>(
    '[data-config="valve_entity"]',
  )!;
  valve.value = "switch.nope";
  valve.dispatchEvent(new Event("change"));
  expect(valve.validationMessage).toBe("Ugyldig verdi");
  expect(event).toHaveBeenCalledTimes(1);
});

it("offers shared history retry and restores focus to the reading", async () => {
  const hass = fixture();
  const requests = withHistory(hass, Date.now(), new Error('Recorder paused'));
  const { c } = await card({}, hass);
  const trigger = q<HTMLButtonElement>(c, '[data-name]');
  trigger.focus();
  trigger.click();
  await settle();
  await c.updateComplete;
  const retry = q<HTMLButtonElement>(c, '[data-retry]');
  expect(retry).not.toBeNull();
  requests.mockResolvedValue({});
  retry.click();
  await settle();
  await c.updateComplete;
  expect(c.shadowRoot!.querySelector('#history [role=alert]')).toBeNull();
  q<HTMLButtonElement>(c, '[data-close-history]').click();
  await settle();
  expect(c.shadowRoot!.activeElement).toBe(trigger);
});

it("uses a fixed percent scale and clears history when related sensors change", async () => {
  const hass = fixture();
  withHistory(hass, Date.now());
  const { c } = await card({ outdoor_entity: 'sensor.ute' }, hass);
  q<HTMLButtonElement>(c, '[data-valve]').click();
  await settle();
  await c.updateComplete;
  const ticks = Array.from(c.shadowRoot!.querySelectorAll('.history-chart .axis')).map((node) => node.textContent);
  expect(ticks).toContain('100');
  expect(ticks).toContain('%');
  c.hass = { ...hass, language: 'NB_no', locale: { language: 'nb-NO', time_format: '24' } };
  await c.updateComplete;
  expect(legend(c)[0]).toContain('Ventilåpning');
  c.setConfig({ type: 'custom:thermostat-valve-card', entity: 'climate.stue', outdoor_entity: 'sensor.other' });
  await c.updateComplete;
  expect(q<HTMLDialogElement>(c, '#history').open).toBe(false);
  expect(legend(c)).toEqual([]);
});
