// src/types/annotations.ts

export type InjuryPart =
  | "concussion"
  | "ankle"
  | "foot"
  | "toe"
  | "hand"
  | "wrist"
  | "knee"
  | "shoulder"
  | "hamstring"
  | "quad"
  | "groin"
  | "back"
  | string;

export type Annotation =
  | { kind: "injury"; part?: InjuryPart; status?: string }
  | { kind: "oline"; quality?: "improved" | "concern" | string }
  | {
      kind: "contract";
      state?: "holding-out" | "extension" | "signed" | string;
    }
  | { kind: "suspension"; games?: number }
  | { kind: "depthchart"; whoLeft?: string }
  | { kind: "film"; state?: string; tag?: string; grade?: string }
  | { kind: "flag" | "frag" | "swing" | "safe" | "acid_reflux" | "post_hype" };
