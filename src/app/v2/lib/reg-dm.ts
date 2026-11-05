import type { V2Lesson } from "./types";
import { dm1 } from "../content/dm1-data-lifecycle";
import { dm2 } from "../content/dm2-pemodelan-data";
import { dm3a } from "../content/dm3a-database-relasional";
import { dm3b } from "../content/dm3b-database-nosql";
import { dm4 } from "../content/dm4-data-warehouse";
import { dm5 } from "../content/dm5-orkestrasi-dbt";
import { dm6 } from "../content/dm6-batch-streaming";
import { dm7 } from "../content/dm7-kualitas-data";
import { dm8 } from "../content/dm8-data-contract";
import { dm9 } from "../content/dm9-governance";
import { dm10 } from "../content/dm10-metadata-lineage";
import { dm11 } from "../content/dm11-master-data";
import { dm12 } from "../content/dm12-keamanan-privasi";
import { dm13 } from "../content/dm13-data-risiko-regulasi";
import { dm14 } from "../content/dm14-arsitektur-modern";
import { dm15 } from "../content/dm15-cloud-dataops";
import { dm16 } from "../content/dm16-bi-analytics-engineering";
import { dm17 } from "../content/dm17-strategi-data";
import { dm18 } from "../content/dm18-spark-pyspark";
import { dm19 } from "../content/dm19-capstone-dwh";
import { dm20 } from "../content/dm20-reference-data";
import { dm21 } from "../content/dm21-document-management";
import { dm22 } from "../content/dm22-data-sharing";
import { dm23 } from "../content/dm23-retensi-arsip";
import { dm24 } from "../content/dm24-katalog-data-hands-on";
import { dm25 } from "../content/dm25-great-expectations";
import { dm26 } from "../content/dm26-sertifikasi-regulasi-2026";
import { dm27 } from "../content/dm27-sap-mdg";

export const REG_DM: Record<string, V2Lesson> = {
  "dm1-data-lifecycle": dm1,
  "dm2-pemodelan-data": dm2,
  "dm3a-database-relasional": dm3a,
  "dm3b-database-nosql": dm3b,
  "dm4-data-warehouse": dm4,
  "dm5-orkestrasi-dbt": dm5,
  "dm6-batch-streaming": dm6,
  "dm7-kualitas-data": dm7,
  "dm8-data-contract": dm8,
  "dm9-governance": dm9,
  "dm10-metadata-lineage": dm10,
  "dm11-master-data": dm11,
  "dm12-keamanan-privasi": dm12,
  "dm13-data-risiko-regulasi": dm13,
  "dm14-arsitektur-modern": dm14,
  "dm15-cloud-dataops": dm15,
  "dm16-bi-analytics-engineering": dm16,
  "dm17-strategi-data": dm17,
  "dm18-spark-pyspark": dm18,
  "dm19-capstone-dwh": dm19,
  "dm20-reference-data": dm20,
  "dm21-document-management": dm21,
  "dm22-data-sharing": dm22,
  "dm23-retensi-arsip": dm23,
  "dm24-katalog-data-hands-on": dm24,
  "dm25-great-expectations": dm25,
  "dm26-sertifikasi-regulasi-2026": dm26,
  "dm27-sap-mdg": dm27,
};
