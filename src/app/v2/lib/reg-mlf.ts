import type { V2Lesson } from "./types";
import { mlfL01 } from "../content/mlf-l01-data-cleaning";
import { mlfL02 } from "../content/mlf-l02-missing-data-imputasi";
import { mlfL03 } from "../content/mlf-l03-distribusi-outlier";
import { mlfL04 } from "../content/mlf-l04-data-wrangling";
import { mlfL05 } from "../content/mlf-l05-ab-testing";
import { mlf1 } from "../content/mlf1-tiga-tipe-satu-alur";
import { mlf2 } from "../content/mlf2-membaca-angka";
import { mlf3 } from "../content/mlf3-evaluasi-model";
import { mlf4 } from "../content/mlf4-overfitting-underfitting";
import { mlfM21 } from "../content/mlf-m21-supervised-logistic-regression";
import { mlfM22 } from "../content/mlf-m22-scorecard-woe-iv";
import { mlfM23 } from "../content/mlf-m23-pd-lgd-ead-expected-loss";
import { mlfM24 } from "../content/mlf-m24-vintage-rollrate-ifrs9";
import { mlfM25 } from "../content/mlf-m25-reject-inference";
import { mlfM31 } from "../content/mlf-m31-unsupervised-clustering-anomaly";
import { mlfM32 } from "../content/mlf-m32-network-link-analysis";
import { mlfM33 } from "../content/mlf-m33-velocity-benford";
import { mlfM34 } from "../content/mlf-m34-behavioral-peer-group";
import { mlfM35 } from "../content/mlf-m35-alert-triage-economics";
import { mlfM41 } from "../content/mlf-m41-random-forest-ensembles";
import { mlfM42 } from "../content/mlf-m42-var-expected-shortfall";
import { mlfM43 } from "../content/mlf-m43-var-backtesting-volatility";
import { mlfM44 } from "../content/mlf-m44-greeks-risk-decomposition";
import { mlfM45 } from "../content/mlf-m45-drawdown-regime-stress";
import { mlfM51 } from "../content/mlf-m51-gradient-descent-optimization";
import { mlfM52 } from "../content/mlf-m52-constrained-optimization-lagrange";
import { mlfM53 } from "../content/mlf-m53-markowitz-efficient-frontier";
import { mlfM54 } from "../content/mlf-m54-risk-parity-budgeting";
import { mlfM55 } from "../content/mlf-m55-black-litterman-shrinkage";
import { mlfM61 } from "../content/mlf-m61-hyperparameter-tuning";
import { mlfM62 } from "../content/mlf-m62-cross-validation-nested-cv";
import { mlfM63 } from "../content/mlf-m63-regularization-early-stopping";
import { mlfM64 } from "../content/mlf-m64-calibration-threshold-selection";
import { mlfM65 } from "../content/mlf-m65-automl-selection-bias";

export const REG_MLF: Record<string, V2Lesson> = {
  "mlf-l01-data-cleaning": mlfL01,
  "mlf-l02-missing-data-imputasi": mlfL02,
  "mlf-l03-distribusi-outlier": mlfL03,
  "mlf-l04-data-wrangling": mlfL04,
  "mlf-l05-ab-testing": mlfL05,
  "mlf1-tiga-tipe-satu-alur": mlf1,
  "mlf2-membaca-angka": mlf2,
  "mlf3-evaluasi-model": mlf3,
  "mlf4-overfitting-underfitting": mlf4,
  "mlf-m21-supervised-logistic-regression": mlfM21,
  "mlf-m22-scorecard-woe-iv": mlfM22,
  "mlf-m23-pd-lgd-ead-expected-loss": mlfM23,
  "mlf-m24-vintage-rollrate-ifrs9": mlfM24,
  "mlf-m25-reject-inference": mlfM25,
  "mlf-m31-unsupervised-clustering-anomaly": mlfM31,
  "mlf-m32-network-link-analysis": mlfM32,
  "mlf-m33-velocity-benford": mlfM33,
  "mlf-m34-behavioral-peer-group": mlfM34,
  "mlf-m35-alert-triage-economics": mlfM35,
  "mlf-m41-random-forest-ensembles": mlfM41,
  "mlf-m42-var-expected-shortfall": mlfM42,
  "mlf-m43-var-backtesting-volatility": mlfM43,
  "mlf-m44-greeks-risk-decomposition": mlfM44,
  "mlf-m45-drawdown-regime-stress": mlfM45,
  "mlf-m51-gradient-descent-optimization": mlfM51,
  "mlf-m52-constrained-optimization-lagrange": mlfM52,
  "mlf-m53-markowitz-efficient-frontier": mlfM53,
  "mlf-m54-risk-parity-budgeting": mlfM54,
  "mlf-m55-black-litterman-shrinkage": mlfM55,
  "mlf-m61-hyperparameter-tuning": mlfM61,
  "mlf-m62-cross-validation-nested-cv": mlfM62,
  "mlf-m63-regularization-early-stopping": mlfM63,
  "mlf-m64-calibration-threshold-selection": mlfM64,
  "mlf-m65-automl-selection-bias": mlfM65,
};
