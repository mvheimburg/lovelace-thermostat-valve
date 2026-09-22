import { colorSchemeStyles } from "./color-schemes";
import { css } from "lit";
/**
 * A single row in the family of our Bubble-style cards: a status circle
 * tinted by heating/cooling (the row itself stays neutral), the name with a status line, a valve ring and a stepper pill.
 * Colours come from HA theme and climate state variables.
 */
export const styles = css`
  :host {
    display: block;
    color: var(--primary-text-color, #1b1b1a);
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
    --tv-muted: var(--secondary-text-color, #5b5a55);
    --tv-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --tv-pill: var(--secondary-background-color, #f3f2ee);
    --tv-heat: var(--state-climate-heat-color, #ff8100);
    --tv-cool: var(--state-climate-cool-color, #2b9af9);
    --tv-idle: var(--disabled-text-color, #8a8984);
    --tv-error: var(--error-color, #c62828);
    --tv-radius: var(--ha-card-border-radius, 16px);
    --tv-circle: 50%;
  }
  :host([appearance="bubble"]) {
    --tv-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --tv-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --tv-radius: var(--bubble-border-radius, 32px);
    --tv-circle: var(--bubble-icon-border-radius, 50%);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    display: block;
    container-type: inline-size;
    padding: 6px;
    background: var(--tv-surface);
    border-radius: var(--tv-radius);
    overflow: hidden;
    --tone: var(--tv-idle);
  }
  :host([appearance="bubble"]) ha-card {
    border: var(--bubble-border, none);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  /* A room inside the thermostat group card: a tile on the group's surface. */
  :host([embedded]) ha-card {
    background: color-mix(in srgb, var(--tv-pill) 45%, var(--tv-surface));
    border: none;
    border-radius: min(var(--tv-radius), 24px);
    box-shadow: none;
    --ha-card-border-width: 0;
  }
  .tone-heating {
    --tone: var(--tv-heat);
  }
  .tone-cooling {
    --tone: var(--tv-cool);
  }
  .tone-unavailable {
    --tone: var(--tv-error);
  }
  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 8px;
    min-height: 44px;
  }
  button {
    font: inherit;
    color: inherit;
    border: 0;
    margin: 0;
    background: none;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  button:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }
  .symbol {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border-radius: var(--tv-circle);
    color: var(--tone);
    background: color-mix(in srgb, var(--tone) 14%, var(--tv-pill));
  }
  .tone-idle .symbol,
  .tone-off .symbol {
    color: var(--tv-muted);
    background: var(--tv-pill);
  }
  .name {
    flex: 1 1 96px;
    min-width: 0;
    padding: 2px 0;
    text-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 44px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .status {
    font-size: 12px;
    color: var(--tv-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tone-heating .status strong,
  .tone-cooling .status strong {
    color: color-mix(in srgb, var(--tone) 55%, var(--primary-text-color, #000));
  }
  .status strong {
    font-weight: 600;
  }
  .tone-unavailable .status {
    color: var(--tv-error);
  }
  .valve {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 44px;
    padding: 0 4px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: var(--tv-muted);
  }
  .ring {
    width: 20px;
    height: 20px;
    transform: rotate(-90deg);
    flex: none;
  }
  .ring circle {
    fill: none;
    stroke-width: 4;
  }
  .ring .track {
    stroke: color-mix(in srgb, var(--tv-muted) 30%, transparent);
  }
  .ring .arc {
    stroke: var(--tone);
    stroke-linecap: round;
    transition: stroke-dasharray 0.4s;
  }
  .tone-idle .ring .arc,
  .tone-off .ring .arc {
    stroke: var(--tv-muted);
  }
  .stepper {
    display: flex;
    align-items: center;
    margin-inline-start: auto;
    border-radius: 22px;
    background: var(--tv-pill);
    min-height: 44px;
  }
  .stepper button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 20px;
    line-height: 1;
  }
  .stepper button:disabled {
    opacity: 0.4;
  }
  .stepper button:not(:disabled):hover {
    background: color-mix(in srgb, var(--tv-muted) 14%, transparent);
  }
  .value {
    min-width: 4.6em;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .value.pending {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }
  .value[aria-busy="true"] {
    opacity: 0.6;
  }
  .range {
    padding: 0 14px;
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .error {
    margin: 6px 8px 2px;
    font-size: 12px;
    color: var(--tv-error);
    overflow-wrap: anywhere;
  }
  /* Narrow columns: the stepper moves under the name. */
  @container (max-width: 300px) {
    .stepper {
      flex: 1 0 100%;
      justify-content: space-between;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ring .arc {
      transition: none;
    }
  }
  /* History: one chart of the valve (area) and the temperatures (lines). */
  .s-valve {
    --series: var(--tv-heat);
  }
  .s-room {
    --series: var(--primary-text-color, #1b1b1a);
  }
  .s-outdoor {
    --series: var(--tv-cool);
  }
  .s-flow {
    --series: var(--purple-color, #926bc7);
  }
  dialog {
    color: var(--primary-text-color, #1b1b1a);
    background: var(--tv-surface);
    border: 0;
    border-radius: min(var(--tv-radius), 28px);
    padding: 16px 16px 20px;
    width: min(640px, calc(100vw - 24px));
    max-height: 90dvh;
    overflow: auto;
    box-shadow: 0 16px 60px #0006;
  }
  dialog::backdrop {
    background: #0007;
  }
  .history-head {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .history-head h2 {
    flex: 1;
    margin: 0 4px;
    font-size: 18px;
    font-weight: 600;
  }
  .close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 24px;
    line-height: 1;
    background: var(--tv-pill);
  }
  .ranges {
    display: flex;
    gap: 6px;
    margin: 10px 0 6px;
  }
  .ranges button {
    min-height: 36px;
    padding: 0 14px;
    border-radius: 18px;
    background: var(--tv-pill);
    font-size: 13px;
    font-weight: 600;
  }
  .ranges button[aria-pressed="true"] {
    background: color-mix(
      in srgb,
      var(--primary-color, #03a9f4) 22%,
      var(--tv-pill)
    );
  }
  .plot {
    min-height: 120px;
    touch-action: pan-y;
  }
  .chart {
    display: block;
    width: 100%;
    height: auto;
  }
  .chart .grid {
    stroke: color-mix(in srgb, var(--tv-muted) 22%, transparent);
    stroke-width: 1;
  }
  .chart .axis {
    fill: var(--tv-muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .chart .line {
    fill: none;
    stroke: var(--series);
    stroke-width: 2;
    stroke-linejoin: round;
  }
  .chart .edge {
    fill: none;
    stroke: var(--series);
    stroke-width: 1.5;
  }
  .chart .area {
    fill: color-mix(in srgb, var(--series) 28%, transparent);
    stroke: none;
  }
  .chart .cursor {
    stroke: var(--tv-muted);
    stroke-dasharray: 3 3;
  }
  .plot .hint {
    margin: 40px 0;
    text-align: center;
    color: var(--tv-muted);
  }
  .when {
    margin: 4px 4px 6px;
    font-size: 12px;
    color: var(--tv-muted);
  }
  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
    gap: 6px;
  }
  .legend .item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2px 8px;
    min-height: 44px;
    padding: 8px 12px;
    border-radius: 16px;
    background: var(--tv-pill);
    text-align: start;
  }
  .legend .swatch {
    grid-row: span 2;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--series);
  }
  .legend .label {
    font-size: 12px;
    color: var(--tv-muted);
  }
  .legend strong {
    font-size: 15px;
    font-variant-numeric: tabular-nums;
  }
  .editor {
    display: grid;
    gap: 14px;
  }
  .editor label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
  }
  .editor input,
  .editor select {
    font: inherit;
    color: inherit;
    min-height: 44px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #ccc);
    background: var(--card-background-color, #fff);
    width: 100%;
  }
  .editor .toggle {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  .editor input[type="checkbox"] {
    width: 20px;
    min-height: 20px;
    height: 20px;
  }
  ${colorSchemeStyles}
`;
