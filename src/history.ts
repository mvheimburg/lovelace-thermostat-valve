import type { HomeAssistant } from "./types";
import { available, numeric } from "./model";

export type SeriesKey = "valve" | "room" | "outdoor" | "flow";
/** Where one line of the chart comes from: an entity's state or one of its attributes. */
export interface Source {
  key: SeriesKey;
  entityId: string;
  attribute?: string;
}
/** Time (ms) and value; `undefined` breaks the line (unavailable). */
export type Point = [number, number | undefined];
export interface Series extends Source {
  points: Point[];
}
export const RANGES = [6, 24, 168] as const;
export type Range = (typeof RANGES)[number];

/** Home Assistant's compressed history row. */
interface Row {
  s: string;
  a?: Record<string, unknown>;
  lu?: number;
  lc?: number;
}
type Reply = Record<string, Row[]>;

function read(
  source: Source,
  state: string,
  attributes?: Record<string, unknown>,
) {
  if (["unavailable", "unknown", ""].includes(state)) return undefined;
  return source.attribute
    ? numeric(attributes?.[source.attribute])
    : numeric(state);
}

/**
 * The history of every source over the last `hours`, ending with the current
 * state. Attribute sources need attributes on every row; the others do not.
 */
export async function loadHistory(
  hass: HomeAssistant,
  sources: Source[],
  hours: number,
  now = Date.now(),
): Promise<Series[]> {
  if (!hass.callWS) throw new Error("Home Assistant history API unavailable");
  const start = new Date(now - hours * 3_600_000).toISOString();
  const ask = async (list: Source[], attributes: boolean): Promise<Reply> =>
    list.length
      ? hass.callWS!<Reply>({
          type: "history/history_during_period",
          start_time: start,
          entity_ids: [...new Set(list.map((s) => s.entityId))],
          minimal_response: !attributes,
          no_attributes: !attributes,
          significant_changes_only: false,
        })
      : {};
  const [withAttributes, plain] = await Promise.all([
    ask(
      sources.filter((s) => s.attribute),
      true,
    ),
    ask(
      sources.filter((s) => !s.attribute),
      false,
    ),
  ]);
  return sources.map((source) => {
    const rows = (source.attribute ? withAttributes : plain)[source.entityId];
    const points: Point[] = (rows ?? []).map((row) => [
      Math.max(Date.parse(start), (row.lu ?? row.lc ?? 0) * 1000),
      read(source, row.s, row.a),
    ]);
    const current = hass.states[source.entityId];
    if (current)
      points.push([
        now,
        available(current)
          ? read(source, current.state, current.attributes)
          : undefined,
      ]);
    return { ...source, points };
  });
}

/** The value in force at `time`: the last point at or before it. */
export function valueAt(series: Series, time: number): number | undefined {
  let value: number | undefined;
  for (const [t, v] of series.points) {
    if (t > time) break;
    value = v;
  }
  return value;
}

/** Round-number ticks covering [min, max], about `count` of them. */
export function ticks(min: number, max: number, count = 4): number[] {
  const raw = (max - min) / count || 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
    10 * power;
  const out: number[] = [];
  for (let v = Math.floor(min / step) * step; v <= max + step / 2; v += step)
    out.push(Number(v.toFixed(6)));
  return out;
}
