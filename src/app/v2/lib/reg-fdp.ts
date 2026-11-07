import type { V2Lesson } from "./types";
import { fdp1 } from "../content/fdp1-xbrl";
import { fdp2 } from "../content/fdp2-edgar";
import { fdp3 } from "../content/fdp3-parsing";
import { fdp4 } from "../content/fdp4-cleaning";
import { fdp5 } from "../content/fdp5-rasio";
import { fdp6 } from "../content/fdp6-capstone";
import { fdp7 } from "../content/fdp7-penyimpanan";
import { fdp8 } from "../content/fdp8-otomasi-penjadwalan";
import { fdp9 } from "../content/fdp9-market-data";
import { fdp10 } from "../content/fdp10-model-tiga-laporan";

export const REG_FDP: Record<string, V2Lesson> = {
  "fdp1-xbrl": fdp1,
  "fdp2-edgar": fdp2,
  "fdp3-parsing": fdp3,
  "fdp4-cleaning": fdp4,
  "fdp5-rasio": fdp5,
  "fdp6-capstone": fdp6,
  "fdp7-penyimpanan": fdp7,
  "fdp8-otomasi-penjadwalan": fdp8,
  "fdp9-market-data": fdp9,
  "fdp10-model-tiga-laporan": fdp10,
};
