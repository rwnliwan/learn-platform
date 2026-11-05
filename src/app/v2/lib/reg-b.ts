import type { V2Lesson } from "./types";
import { b1 } from "../content/b1-aksioma-peluang";
import { b2 } from "../content/b2-kombinatorik";
import { b3 } from "../content/b3-peluang-bersyarat";
import { b4 } from "../content/b4-bayes";
import { b5 } from "../content/b5-variabel-acak-ekspektasi";
import { b6_1 } from "../content/b6-distribusi-diskret-1";
import { b6_2 } from "../content/b6-distribusi-diskret-2";
import { b7_1 } from "../content/b7-distribusi-kontinu-1";
import { b7_2 } from "../content/b7-distribusi-kontinu-2";
import { b8 } from "../content/b8-fitting-distribusi";
import { b9 } from "../content/b9-joint-kovarians";
import { b10 } from "../content/b10-copula";
import { b11 } from "../content/b11-lln-clt";
import { b12 } from "../content/b12-monte-carlo";
import { b13 } from "../content/b13-vasicek";
import { b14 } from "../content/b14-markov-chain";
import { b15 } from "../content/b15-proses-stokastik";
import { b16 } from "../content/b16-heavy-tails-evt";
import { b17 } from "../content/b17-bayesian-praktis";
import { b18 } from "../content/b18-poisson-process";
import { b19 } from "../content/b19-mcmc";
import { b20 } from "../content/b20-hidden-markov";
import { b21 } from "../content/b21-ab-testing-terapan";
import { b22 } from "../content/b22-regresi-scorecard";
import { b23 } from "../content/b23-time-series-arima-garch";
import { b24 } from "../content/b24-backtesting-monitoring-model";

export const REG_B: Record<string, V2Lesson> = {
  "b1-aksioma-peluang": b1,
  "b2-kombinatorik": b2,
  "b3-peluang-bersyarat": b3,
  "b4-bayes": b4,
  "b5-variabel-acak-ekspektasi": b5,
  "b6-distribusi-diskret-1": b6_1,
  "b6-distribusi-diskret-2": b6_2,
  "b7-distribusi-kontinu-1": b7_1,
  "b7-distribusi-kontinu-2": b7_2,
  "b8-fitting-distribusi": b8,
  "b9-joint-kovarians": b9,
  "b10-copula": b10,
  "b11-lln-clt": b11,
  "b12-monte-carlo": b12,
  "b13-vasicek": b13,
  "b14-markov-chain": b14,
  "b15-proses-stokastik": b15,
  "b16-heavy-tails-evt": b16,
  "b17-bayesian-praktis": b17,
  "b18-poisson-process": b18,
  "b19-mcmc": b19,
  "b20-hidden-markov": b20,
  "b21-ab-testing-terapan": b21,
  "b22-regresi-scorecard": b22,
  "b23-time-series-arima-garch": b23,
  "b24-backtesting-monitoring-model": b24,
};
