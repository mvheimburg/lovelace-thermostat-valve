// Renders the README images from the simulated preview in demo/ (no live Home Assistant).
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
(async () => {
  const server = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "5199", "--strictPort"],
    { stdio: "pipe" },
  );
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.stdout.on("data", (chunk) => {
        if (chunk.toString().includes("Local:")) resolve();
      });
      server.on("exit", (code) => reject(new Error(`Preview server exited: ${code}`)));
      server.on("error", reject);
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1180, height: 900 },
      deviceScaleFactor: 1,
      locale: "nb-NO",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:5199/demo/");
    await page.locator("thermostat-group-card").locator("ha-card").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const settle = () => page.waitForTimeout(300);

    await page.locator("#language").click(); // English for the single cards
    await settle();
    await page.locator("#cards").screenshot({ path: "docs/thermostat-valve-card.png" });
    await page.locator("#language").click(); // back to Bokmål
    await settle();
    await page.locator("thermostat-group-card").screenshot({ path: "docs/thermostat-group-card.png" });
    await page.locator("#theme").click();
    await settle();
    await page.locator("thermostat-group-card").screenshot({ path: "docs/thermostat-group-dark.png" });
    await page.locator("#theme").click();

    await page.setViewportSize({ width: 760, height: 620 });
    await page.locator("thermostat-group-card thermostat-valve-card").first().locator("[data-name]").click();
    await page.locator("thermostat-group-card thermostat-valve-card").first().locator(".chart").waitFor();
    await settle();
    await page.screenshot({ path: "docs/thermostat-valve-history.png" });
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 360, height: 900 });
    await page.evaluate(() => {
      document.activeElement?.blur();
      document.querySelector("thermostat-group-card").scrollIntoView();
    });
    await settle();
    await page.screenshot({ path: "docs/thermostat-group-mobile.png" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error("Mobile viewport overflows horizontally");
    if (errors.length) throw new Error(errors.join("\n"));
    console.log("Saved five simulated previews; no browser errors or mobile overflow.");
  } finally {
    await browser?.close();
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
