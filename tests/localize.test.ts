import { expect, it } from "vitest";
import {
  actionLabel,
  formatLocale,
  formatNumber,
  language,
  localize,
  modeLabel,
} from "../src/localize";
import { nudge, target } from "../src/model";
import { climate } from "./ui-fixture";

it.each(["nb", "nb-NO", "NB_no", "no", "NO_no", "nn"])(
  "supports Norwegian alias %s",
  (value) => {
    expect(localize({ language: value }, "heating")).toBe("Varmer");
    expect(formatLocale({ language: value })).toBe("nb-NO");
  },
);
it("prefers the active language and falls back safely", () => {
  expect(language({ language: "en", locale: { language: "nb" } })).toBe("en");
  expect(language({ locale: { language: "nb" } })).toBe("nb");
  expect(localize({ language: "fr" }, "heating")).toBe("Heating");
  expect(formatLocale({ language: "bad locale!" })).toBe("en");
  expect(formatLocale()).toBe("en");
  expect(formatLocale({ language: "en", locale: { language: "en-GB" } })).toBe(
    "en-GB",
  );
});
it("keeps unknown HA values recognizable", () => {
  expect(actionLabel({ language: "nb" }, "cooling")).toBe("Kjøler");
  expect(actionLabel({ language: "nb" }, "venting")).toBe("venting");
  expect(modeLabel({ language: "nb" }, "heat_cool")).toBe("Varme/kjøling");
  expect(modeLabel({ language: "nb" }, "eco_plus")).toBe("eco_plus");
});
it("honours HA's number format preference", () => {
  expect(
    formatNumber(
      { language: "nb", locale: { number_format: "decimal_period" } },
      21.5,
      1,
    ),
  ).toBe("21.5");
  expect(formatNumber({ language: "en" }, 1234.5, 1)).toBe("1,234.5");
  expect(
    formatNumber(
      { language: "en", locale: { number_format: "none" } },
      1234.5,
      1,
    ),
  ).toBe("1234.5");
});
it("derives steps, digits and defaults from the entity", () => {
  const t = target(climate({ target_temp_step: undefined }), "°C");
  expect([t.step, t.digits, t.settable]).toEqual([0.5, 1, true]);
  expect(target(climate({ target_temp_step: 1 }), "°C").digits).toBe(0);
  expect(target(climate({ supported_features: 0 }), "°C").settable).toBe(false);
  expect(nudge(t, 21.3, 1)).toBe(22);
  expect(nudge({ ...t, step: 0.1, digits: 1 }, 20.2, 1)).toBe(20.3);
  expect(nudge(t, 5, -1)).toBe(5);
});
