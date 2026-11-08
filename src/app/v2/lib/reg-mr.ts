import type { V2Lesson } from "./types";
import { mr1 } from "../content/mr1-trading-book";
import { mr2 } from "../content/mr2-volatilitas";
import { mr3 } from "../content/mr3-var";
import { mr4 } from "../content/mr4-var-lanjut";
import { mr5 } from "../content/mr5-expected-shortfall";
import { mr6 } from "../content/mr6-backtesting";
import { mr7 } from "../content/mr7-stress-test";
import { mr8 } from "../content/mr8-risiko-suku-bunga";
import { mr9 } from "../content/mr9-kurva-yield";
import { mr10 } from "../content/mr10-irrbb";
import { mr11 } from "../content/mr11-options-risk";
import { mr12 } from "../content/mr12-fx-komoditas";
import { mr13 } from "../content/mr13-risiko-likuiditas";
import { mr14 } from "../content/mr14-counterparty-risk";
import { mr15 } from "../content/mr15-model-stokastik";
import { mr16 } from "../content/mr16-regulasi-frtb";
import { mr17 } from "../content/mr17-limit-laporan";
import { mr18 } from "../content/mr18-validasi-model";
import { mr19 } from "../content/mr19-capstone-var-es";
import { mr20 } from "../content/mr20-model-risk-ai";
import { mr21 } from "../content/mr21-crypto-market-risk";
import { mr22 } from "../content/mr22-geopolitical-risk";
import { mr23 } from "../content/mr23-otc-clearing-ccp";
import { mr24 } from "../content/mr24-risk-factor-mapping";
import { mr25 } from "../content/mr25-nmrf-plat-frtb-ima";
import { mr26 } from "../content/mr26-tail-risk-hedging";
import { mr27 } from "../content/mr27-sql-otomatisasi-laporan";
import { mr28 } from "../content/mr28-sertifikasi-regulasi";
import { mr29 } from "../content/mr29-xva";
import { mr30 } from "../content/mr30-pl-attribution";
import { mr31 } from "../content/mr31-powerbi-risiko";
import { mr32 } from "../content/mr32-market-data-management";
import { mr33 } from "../content/mr33-economic-capital-raroc";
import { mr34 } from "../content/mr34-hedge-fund-illiquidity";
import { mr35 } from "../content/mr35-var-es-dengan-r";
import { mr36 } from "../content/mr36-repo-risk";
import { mr37 } from "../content/mr37-evt-var-es";
import { mr38 } from "../content/mr38-risiko-intraday";
import { mr39 } from "../content/mr39-climate-risk-trading-book";

export const REG_MR: Record<string, V2Lesson> = {
  "mr1-trading-book": mr1,
  "mr2-volatilitas": mr2,
  "mr3-var": mr3,
  "mr4-var-lanjut": mr4,
  "mr5-expected-shortfall": mr5,
  "mr6-backtesting": mr6,
  "mr7-stress-test": mr7,
  "mr8-risiko-suku-bunga": mr8,
  "mr9-kurva-yield": mr9,
  "mr10-irrbb": mr10,
  "mr11-options-risk": mr11,
  "mr12-fx-komoditas": mr12,
  "mr13-risiko-likuiditas": mr13,
  "mr14-counterparty-risk": mr14,
  "mr15-model-stokastik": mr15,
  "mr16-regulasi-frtb": mr16,
  "mr17-limit-laporan": mr17,
  "mr18-validasi-model": mr18,
  "mr19-capstone-var-es": mr19,
  "mr20-model-risk-ai": mr20,
  "mr21-crypto-market-risk": mr21,
  "mr22-geopolitical-risk": mr22,
  "mr23-otc-clearing-ccp": mr23,
  "mr24-risk-factor-mapping": mr24,
  "mr25-nmrf-plat-frtb-ima": mr25,
  "mr26-tail-risk-hedging": mr26,
  "mr27-sql-otomatisasi-laporan": mr27,
  "mr28-sertifikasi-regulasi": mr28,
  "mr29-xva": mr29,
  "mr30-pl-attribution": mr30,
  "mr31-powerbi-risiko": mr31,
  "mr32-market-data-management": mr32,
  "mr33-economic-capital-raroc": mr33,
  "mr34-hedge-fund-illiquidity": mr34,
  "mr35-var-es-dengan-r": mr35,
  "mr36-repo-risk": mr36,
  "mr37-evt-var-es": mr37,
  "mr38-risiko-intraday": mr38,
  "mr39-climate-risk-trading-book": mr39,
};
