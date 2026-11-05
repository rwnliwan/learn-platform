import type { V2Lesson } from "./types";
import { pma1 } from "../content/pm-a1-ethics";
import { pma2 } from "../content/pm-a2-quant-methods";
import { pma3 } from "../content/pm-a3-economics";
import { pma4 } from "../content/pm-a4-financial-statements";
import { pma5 } from "../content/pm-a5-corporate-issuers";
import { pma6 } from "../content/pm-a6-equity";
import { pma7 } from "../content/pm-a7-fixed-income";
import { pma8 } from "../content/pm-a8-derivatives";
import { pma9 } from "../content/pm-a9-alternatives";
import { pma10 } from "../content/pm-a10-portfolio-mgmt";
import { pmb1 } from "../content/pm-b1-regresi";
import { pmb2 } from "../content/pm-b2-timeseries";
import { pmb3 } from "../content/pm-b3-ml-investasi";
import { pmb4 } from "../content/pm-b4-valuasi-ekuitas";
import { pmb5 } from "../content/pm-b5-fixed-income-lanjut";
import { pmb6 } from "../content/pm-b6-valuasi-derivatif";
import { pmb7 } from "../content/pm-b7-currency";
import { pmb8 } from "../content/pm-b8-faktor-risiko";

export const REG_PM1: Record<string, V2Lesson> = {
  "pm-a1-ethics": pma1,
  "pm-a2-quant-methods": pma2,
  "pm-a3-economics": pma3,
  "pm-a4-financial-statements": pma4,
  "pm-a5-corporate-issuers": pma5,
  "pm-a6-equity": pma6,
  "pm-a7-fixed-income": pma7,
  "pm-a8-derivatives": pma8,
  "pm-a9-alternatives": pma9,
  "pm-a10-portfolio-mgmt": pma10,
  "pm-b1-regresi": pmb1,
  "pm-b2-timeseries": pmb2,
  "pm-b3-ml-investasi": pmb3,
  "pm-b4-valuasi-ekuitas": pmb4,
  "pm-b5-fixed-income-lanjut": pmb5,
  "pm-b6-valuasi-derivatif": pmb6,
  "pm-b7-currency": pmb7,
  "pm-b8-faktor-risiko": pmb8,
};
