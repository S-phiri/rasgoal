import { LiveClass } from "@/hooks/useLiveClasses";

export const JOIN_WINDOW_MINUTES = 10;

export const getClassWindow = (c: Pick<LiveClass, "start_time" | "end_time">) => {
  const start = new Date(c.start_time);
  const end = new Date(c.end_time);
  const joinOpensAt = new Date(start.getTime() - JOIN_WINDOW_MINUTES * 60 * 1000);
  return { start, end, joinOpensAt };
};

export const canJoinClass = (c: Pick<LiveClass, "start_time" | "end_time" | "status">, now: Date) => {
  if (c.status === "cancelled" || c.status === "completed") return false;
  const { joinOpensAt, end } = getClassWindow(c);
  return now >= joinOpensAt && now <= end;
};

export const isUpcoming = (c: Pick<LiveClass, "end_time" | "status">, now: Date) => {
  if (c.status === "cancelled") return false;
  return new Date(c.end_time) >= now;
};

export const formatClassTime = (c: Pick<LiveClass, "start_time" | "end_time">) => {
  const s = new Date(c.start_time);
  const e = new Date(c.end_time);
  const dateOpts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${s.toLocaleDateString(undefined, dateOpts)} · ${s.toLocaleTimeString(undefined, timeOpts)} – ${e.toLocaleTimeString(undefined, timeOpts)}`;
};
