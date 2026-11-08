import type { V2Lesson } from "./types";
import { fr1 } from "../content/fr1-lanskap-fraud";
import { fr2 } from "../content/fr2-fraud-vs-aml";
import { fr3 } from "../content/fr3-data-fraud";
import { fr4 } from "../content/fr4-label-fraud";
import { fr5 } from "../content/fr5-rule-based";
import { fr6 } from "../content/fr6-feature-engineering";
import { fr7 } from "../content/fr7-supervised-ml";
import { fr8 } from "../content/fr8-unsupervised";
import { fr9 } from "../content/fr9-evaluasi";
import { fr10 } from "../content/fr10-drift";
import { fr11 } from "../content/fr11-threshold";
import { fr12 } from "../content/fr12-graph-analytics";
import { fr13 } from "../content/fr13-realtime";
import { fr14 } from "../content/fr14-case-management";
import { fr15 } from "../content/fr15-aml";
import { fr16 } from "../content/fr16-anomali-time-series";
import { fr17 } from "../content/fr17-explainability";
import { fr18 } from "../content/fr18-mlops";
import { fr19 } from "../content/fr19-nlp-phishing";
import { fr20 } from "../content/fr20-capstone";
import { fr21 } from "../content/fr21-sql-fraud";
import { fr22 } from "../content/fr22-chargeback";
import { fr23 } from "../content/fr23-regulasi-indonesia";
import { fr24 } from "../content/fr24-fraud-loss-reporting-roi";
import { fr25 } from "../content/fr25-fraud-triangle-fraud-tree";
import { fr26 } from "../content/fr26-whistleblowing-program";
import { fr27 } from "../content/fr27-teknik-investigasi";
import { fr28 } from "../content/fr28-financial-statement-fraud";
import { fr29 } from "../content/fr29-benford-law";
import { fr30 } from "../content/fr30-synthetic-data-gan";
import { fr31 } from "../content/fr31-genai-detection-pipeline";
import { fr32 } from "../content/fr32-audit-independen-aml";
import { fr33 } from "../content/fr33-bsa-vs-eu-amld";
import { fr34 } from "../content/fr34-correspondent-banking";
import { aml1 } from "../content/aml1-triage-alert";
import { aml2 } from "../content/aml2-kyc-cdd";
import { aml3 } from "../content/aml3-edd";
import { aml4 } from "../content/aml4-sanctions";
import { aml5 } from "../content/aml5-structuring";
import { aml6 } from "../content/aml6-layering";
import { aml7 } from "../content/aml7-sar";
import { aml8 } from "../content/aml8-network";
import { aml9 } from "../content/aml9-virtual-assets";
import { aml10 } from "../content/aml10-ira";
import { aml11 } from "../content/aml11-terrorist-financing";
import { aml12 } from "../content/aml12-bribery-corruption";
import { aml13 } from "../content/aml13-cybercrime-laundering";
import { aml14 } from "../content/aml14-regtech-ai-pkyc";
import { aml15 } from "../content/aml15-sanctions-evasion";
import { aml16 } from "../content/aml16-fatf-greylist-indonesia";
import { aml17 } from "../content/aml17-fusion-center";
import { aml18 } from "../content/aml18-defi-laundering";
import { aml19 } from "../content/aml19-gaming-gambling-ml";
import { aml20 } from "../content/aml20-beneficial-ownership-ubo";
import { aml21 } from "../content/aml21-proliferation-financing";
import { aml22 } from "../content/aml22-travel-rule";
import { aml23 } from "../content/aml23-operasional-ppatk";
import { aml24 } from "../content/aml24-ai-enabled-fraud";
import { aml25 } from "../content/aml25-graph-analytics-laundering";
import { aml26 } from "../content/aml26-trade-based-ml";

export const REG_FR: Record<string, V2Lesson> = {
  "fr1-lanskap-fraud": fr1,
  "fr2-fraud-vs-aml": fr2,
  "fr3-data-fraud": fr3,
  "fr4-label-fraud": fr4,
  "fr5-rule-based": fr5,
  "fr6-feature-engineering": fr6,
  "fr7-supervised-ml": fr7,
  "fr8-unsupervised": fr8,
  "fr9-evaluasi": fr9,
  "fr10-drift": fr10,
  "fr11-threshold": fr11,
  "fr12-graph-analytics": fr12,
  "fr13-realtime": fr13,
  "fr14-case-management": fr14,
  "fr15-aml": fr15,
  "fr16-anomali-time-series": fr16,
  "fr17-explainability": fr17,
  "fr18-mlops": fr18,
  "fr19-nlp-phishing": fr19,
  "fr20-capstone": fr20,
  "fr21-sql-fraud": fr21,
  "fr22-chargeback": fr22,
  "fr23-regulasi-indonesia": fr23,
  "fr24-fraud-loss-reporting-roi": fr24,
  "fr25-fraud-triangle-fraud-tree": fr25,
  "fr26-whistleblowing-program": fr26,
  "fr27-teknik-investigasi": fr27,
  "fr28-financial-statement-fraud": fr28,
  "fr29-benford-law": fr29,
  "fr30-synthetic-data-gan": fr30,
  "fr31-genai-detection-pipeline": fr31,
  "fr32-audit-independen-aml": fr32,
  "fr33-bsa-vs-eu-amld": fr33,
  "fr34-correspondent-banking": fr34,
  "aml1-triage-alert": aml1,
  "aml2-kyc-cdd": aml2,
  "aml3-edd": aml3,
  "aml4-sanctions": aml4,
  "aml5-structuring": aml5,
  "aml6-layering": aml6,
  "aml7-sar": aml7,
  "aml8-network": aml8,
  "aml9-virtual-assets": aml9,
  "aml10-ira": aml10,
  "aml11-terrorist-financing": aml11,
  "aml12-bribery-corruption": aml12,
  "aml13-cybercrime-laundering": aml13,
  "aml14-regtech-ai-pkyc": aml14,
  "aml15-sanctions-evasion": aml15,
  "aml16-fatf-greylist-indonesia": aml16,
  "aml17-fusion-center": aml17,
  "aml18-defi-laundering": aml18,
  "aml19-gaming-gambling-ml": aml19,
  "aml20-beneficial-ownership-ubo": aml20,
  "aml21-proliferation-financing": aml21,
  "aml22-travel-rule": aml22,
  "aml23-operasional-ppatk": aml23,
  "aml24-ai-enabled-fraud": aml24,
  "aml25-graph-analytics-laundering": aml25,
  "aml26-trade-based-ml": aml26,
};
