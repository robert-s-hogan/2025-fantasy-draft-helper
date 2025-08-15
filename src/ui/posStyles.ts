export type Pos = "RB" | "WR" | "TE" | "QB";

export const POS_BG: Record<Pos, string> = {
  RB: "bg-blue-100",
  WR: "bg-green-100",
  TE: "bg-yellow-100",
  QB: "bg-red-100",
};

export const POS_PILL: Record<Pos, string> = {
  RB: "bg-blue-100 text-slate-900",
  WR: "bg-green-100 text-slate-900",
  TE: "bg-yellow-100 text-slate-900",
  QB: "bg-red-100 text-slate-900",
};
