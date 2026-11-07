import type { V2Lesson } from "./types";
import { d1 } from "../content/d1-python-dasar";
import { d2 } from "../content/d2-struktur-data";
import { d3 } from "../content/d3-numpy";
import { d4 } from "../content/d4-pandas-dasar";
import { d5 } from "../content/d5-data-cleaning";
import { d6 } from "../content/d6-wrangling";
import { d7 } from "../content/d7-datetime-timeseries";
import { d8_1 } from "../content/d8-visualisasi-1";
import { d8_2 } from "../content/d8-visualisasi-2";
import { d9 } from "../content/d9-eda";
import { d10 } from "../content/d10-feature-engineering";
import { d11 } from "../content/d11-scipy-statsmodels";
import { d12 } from "../content/d12-sklearn";
import { d13 } from "../content/d13-performa";
import { d14 } from "../content/d14-rekayasa";
import { d15 } from "../content/d15-sql-python-api";
import { d16 } from "../content/d16-polars";
import { d17 } from "../content/d17-pytest";
import { d18 } from "../content/d18-fastapi-rest-api";
import { d19 } from "../content/d19-apache-airflow";
import { d20 } from "../content/d20-docker-git-workflow";
import { d21 } from "../content/d21-pyspark";
import { d22 } from "../content/d22-bigquery-snowflake";
import { d23 } from "../content/d23-oop-formal";
import { d24 } from "../content/d24-web-scraping";

export const REG_D: Record<string, V2Lesson> = {
  "d1-python-dasar": d1,
  "d2-struktur-data": d2,
  "d3-numpy": d3,
  "d4-pandas-dasar": d4,
  "d5-data-cleaning": d5,
  "d6-wrangling": d6,
  "d7-datetime-timeseries": d7,
  "d8-visualisasi-1": d8_1,
  "d8-visualisasi-2": d8_2,
  "d9-eda": d9,
  "d10-feature-engineering": d10,
  "d11-scipy-statsmodels": d11,
  "d12-sklearn": d12,
  "d13-performa": d13,
  "d14-rekayasa": d14,
  "d15-sql-python-api": d15,
  "d16-polars": d16,
  "d17-pytest": d17,
  "d18-fastapi-rest-api": d18,
  "d19-apache-airflow": d19,
  "d20-docker-git-workflow": d20,
  "d21-pyspark": d21,
  "d22-bigquery-snowflake": d22,
  "d23-oop-formal": d23,
  "d24-web-scraping": d24,
};
