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
import { pma1b } from "../content/pm-a1b-ethics-cases";
import { pma2b } from "../content/pm-a2b-quant-lanjut";
import { pma3b } from "../content/pm-a3b-kebijakan-siklus";
import { pma4b } from "../content/pm-a4b-inventory";
import { pma4c } from "../content/pm-a4c-fixed-assets-debt";
import { pma4d } from "../content/pm-a4d-tax-intercorporate";
import { pma5b } from "../content/pm-a5b-struktur-modal";
import { pma6b } from "../content/pm-a6b-valuasi-lanjutan";
import { pma6c } from "../content/pm-a6c-analisis-industri";
import { pma7b } from "../content/pm-a7b-durasi-konveksitas";
import { pma7c } from "../content/pm-a7c-kredit-sekuritisasi";
import { pma8b } from "../content/pm-a8b-harga-opsi";
import { pma9b } from "../content/pm-a9b-hedge-fund-pe";
import { pma10b } from "../content/pm-a10b-IPS-risiko";
import { pmcfaFormulaSheet } from "../content/pm-cfa-formula-sheet";
import { pmcfaCalculatorDrill } from "../content/pm-cfa-calculator-drill";
import { pmcfaMockExam1 } from "../content/pm-cfa-mock-exam-1";
import { pmcfaFlashcards } from "../content/pm-cfa-flashcards";
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
  "pm-a1b-ethics-cases": pma1b,
  "pm-a2-quant-methods": pma2,
  "pm-a2b-quant-lanjut": pma2b,
  "pm-a3-economics": pma3,
  "pm-a3b-kebijakan-siklus": pma3b,
  "pm-a4-financial-statements": pma4,
  "pm-a4b-inventory": pma4b,
  "pm-a4c-fixed-assets-debt": pma4c,
  "pm-a4d-tax-intercorporate": pma4d,
  "pm-a5-corporate-issuers": pma5,
  "pm-a5b-struktur-modal": pma5b,
  "pm-a6-equity": pma6,
  "pm-a6b-valuasi-lanjutan": pma6b,
  "pm-a6c-analisis-industri": pma6c,
  "pm-a7-fixed-income": pma7,
  "pm-a7b-durasi-konveksitas": pma7b,
  "pm-a7c-kredit-sekuritisasi": pma7c,
  "pm-a8-derivatives": pma8,
  "pm-a8b-harga-opsi": pma8b,
  "pm-a9-alternatives": pma9,
  "pm-a9b-hedge-fund-pe": pma9b,
  "pm-a10-portfolio-mgmt": pma10,
  "pm-a10b-IPS-risiko": pma10b,
  "pm-cfa-formula-sheet": pmcfaFormulaSheet,
  "pm-cfa-calculator-drill": pmcfaCalculatorDrill,
  "pm-cfa-mock-exam-1": pmcfaMockExam1,
  "pm-cfa-flashcards": pmcfaFlashcards,
  "pm-b1-regresi": pmb1,
  "pm-b2-timeseries": pmb2,
  "pm-b3-ml-investasi": pmb3,
  "pm-b4-valuasi-ekuitas": pmb4,
  "pm-b5-fixed-income-lanjut": pmb5,
  "pm-b6-valuasi-derivatif": pmb6,
  "pm-b7-currency": pmb7,
  "pm-b8-faktor-risiko": pmb8,
};
