import { svg, nothing } from "lit";
import { ticks, type Point, type Series } from "./history";

const LEFT = 40,
  TOP = 10,
  BOTTOM = 196,
  H = 230;
/** Room kept right of the plot for the percent axis. */
const RIGHT_GUTTER = 44;

export interface ChartText {
  number: (value: number, digits: number) => string;
  percent: (value: number) => string;
  time: (ms: number, withDay: boolean) => string;
  label: string;
}

/** Split into runs of known values, so an unavailable spell leaves a gap. */
function runs(points: Point[]): Array<Array<[number, number]>> {
  const out: Array<Array<[number, number]>> = [];
  let current: Array<[number, number]> = [];
  for (const [t, v] of points) {
    if (v === undefined) {
      if (current.length) out.push(current);
      current = [];
    } else current.push([t, v]);
  }
  if (current.length) out.push(current);
  return out;
}

/**
 * Valve opening as a stepped area on a 0–100 % scale (right axis), and the
 * temperatures as lines on a shared °C scale (left axis).
 */
export function chart(
  series: Series[],
  start: number,
  end: number,
  hover: number | undefined,
  text: ChartText,
  /** Drawn at its on-screen width, so the axis text stays 12 px on a phone. */
  W = 600,
) {
  const RIGHT = W - RIGHT_GUTTER;
  const temps = series.filter((s) => s.key !== "valve");
  const valve = series.find((s) => s.key === "valve");
  const values = temps.flatMap((s) =>
    s.points.flatMap(([, v]) => (v === undefined ? [] : [v])),
  );
  const lo = values.length ? Math.min(...values) : 0,
    hi = values.length ? Math.max(...values) : 30;
  const yTicks = ticks(Math.floor(lo - 1), Math.ceil(hi + 1));
  const yMin = yTicks[0],
    yMax = yTicks[yTicks.length - 1];
  const x = (t: number) =>
    LEFT +
    ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
      (RIGHT - LEFT);
  const y = (v: number) =>
    BOTTOM - ((v - yMin) / (yMax - yMin || 1)) * (BOTTOM - TOP);
  const yPct = (v: number) =>
    BOTTOM - (Math.min(100, Math.max(0, v)) / 100) * (BOTTOM - TOP);
  const hours = (end - start) / 3_600_000;
  // Hours between time labels; fewer of them on a phone-width chart.
  const narrow = W < 480;
  const every =
    hours <= 6
      ? narrow
        ? 2
        : 1
      : hours <= 24
        ? narrow
          ? 6
          : 4
        : narrow
          ? 48
          : 24;
  const xTicks: number[] = [];
  const hour = new Date(start);
  hour.setMinutes(0, 0, 0);
  let midnights = 0;
  for (let t = hour.getTime(); t <= end; t += 3_600_000) {
    const h = new Date(t).getHours();
    if (t < start) continue;
    if (
      every >= 24
        ? h === 0 && midnights++ % (every / 24) === 0
        : h % every === 0
    )
      xTicks.push(t);
  }
  const line = (points: Point[]) =>
    runs(points)
      .map((run) =>
        run
          .map(
            ([t, v], i) =>
              `${i ? "L" : "M"}${x(t).toFixed(1)},${y(v).toFixed(1)}`,
          )
          .join(" "),
      )
      .join(" ");
  // The valve holds each reading until the next one, as a valve does.
  const steps = (run: Array<[number, number]>) =>
    run
      .map(([t, v], i) => {
        const next = run[i + 1];
        return `${x(t).toFixed(1)},${yPct(v).toFixed(1)}${next ? ` L${x(next[0]).toFixed(1)},${yPct(v).toFixed(1)}` : ""}`;
      })
      .join(" L");
  const edge = (points: Point[]) =>
    runs(points)
      .map((run) => `M${steps(run)}`)
      .join(" ");
  const area = (points: Point[]) =>
    runs(points)
      .map((run) => {
        const last = run[run.length - 1];
        return `M${x(run[0][0]).toFixed(1)},${BOTTOM} L${steps(run)} L${x(last[0]).toFixed(1)},${BOTTOM} Z`;
      })
      .join(" ");
  return svg`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    ${yTicks.map(
      (v) =>
        svg`<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${y(v)} y2=${y(v)}></line>
        <text class="axis" x=${LEFT - 6} y=${y(v) + 4} text-anchor="end">${text.number(v, 0)}°</text>`,
    )}
    ${
      valve
        ? [0, 50, 100].map(
            (v) =>
              svg`<text class="axis" x=${RIGHT + 6} y=${yPct(v) + 4}>${text.percent(v)}</text>`,
          )
        : nothing
    }
    ${xTicks.map(
      (t) =>
        svg`<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP} y2=${BOTTOM}></line>
        <text class="axis" x=${x(t)} y=${BOTTOM + 18} text-anchor="middle">${text.time(t, every >= 24)}</text>`,
    )}
    ${
      valve
        ? svg`<path class="area s-valve" d=${area(valve.points)}></path>
            <path class="edge s-valve" d=${edge(valve.points)}></path>`
        : nothing
    }
    ${temps.map((s) => svg`<path class=${`line s-${s.key}`} d=${line(s.points)}></path>`)}
    ${
      hover === undefined
        ? nothing
        : svg`<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP} y2=${BOTTOM}></line>`
    }
  </svg>`;
}

/** The time under a pointer over the chart. */
export function timeAt(
  event: PointerEvent,
  element: Element,
  start: number,
  end: number,
): number {
  const box = element.getBoundingClientRect();
  const W = (element as SVGSVGElement).viewBox?.baseVal?.width || box.width;
  const RIGHT = W - RIGHT_GUTTER;
  const px = ((event.clientX - box.left) / box.width) * W;
  const ratio = (px - LEFT) / (RIGHT - LEFT);
  return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}
