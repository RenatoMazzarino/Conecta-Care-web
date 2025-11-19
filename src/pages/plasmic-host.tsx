import * as React from "react";
import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";

import { PLASMIC } from "../plasmic-init";

export default function PlasmicHost() {
  void PLASMIC; // ensure loader initialization side-effects run
  return <PlasmicCanvasHost />;
}
