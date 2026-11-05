import type { V2Lesson } from "./types";
import { aie1 } from "../content/aie1-lanskap";
import { aie2 } from "../content/aie2-prompt";
import { aie3 } from "../content/aie3-rag";
import { aie4 } from "../content/aie4-eval";
import { aie5 } from "../content/aie5-finetuning";
import { aie6 } from "../content/aie6-structured";
import { aie7 } from "../content/aie7-caching";
import { aie8 } from "../content/aie8-observability";
import { aie9 } from "../content/aie9-safety";
import { aie10 } from "../content/aie10-deploy";
import { aie11 } from "../content/aie11-ux";
import { aie12 } from "../content/aie12-capstone";
import { aie13 } from "../content/aie13-hybrid-search-reranking";
import { aie14 } from "../content/aie14-advanced-rag";
import { aie15 } from "../content/aie15-synthetic-eval-data";
import { aie16 } from "../content/aie16-embedding-selection";
import { aie17 } from "../content/aie17-visual-retrieval";
import { aie18 } from "../content/aie18-governance-produk";
import { aie19 } from "../content/aie19-self-hosting-llm";
import { aie20 } from "../content/aie20-langchain-langgraph";
import { aie21 } from "../content/aie21-eval-observability-praktik";
import { aie22 } from "../content/aie22-cloud-ai-deployment";
import { aie23 } from "../content/aie23-graphrag";

export const REG_AIE: Record<string, V2Lesson> = {
  "aie1-lanskap": aie1,
  "aie2-prompt": aie2,
  "aie3-rag": aie3,
  "aie4-eval": aie4,
  "aie5-finetuning": aie5,
  "aie6-structured": aie6,
  "aie7-caching": aie7,
  "aie8-observability": aie8,
  "aie9-safety": aie9,
  "aie10-deploy": aie10,
  "aie11-ux": aie11,
  "aie12-capstone": aie12,
  "aie13-hybrid-search-reranking": aie13,
  "aie14-advanced-rag": aie14,
  "aie15-synthetic-eval-data": aie15,
  "aie16-embedding-selection": aie16,
  "aie17-visual-retrieval": aie17,
  "aie18-governance-produk": aie18,
  "aie19-self-hosting-llm": aie19,
  "aie20-langchain-langgraph": aie20,
  "aie21-eval-observability-praktik": aie21,
  "aie22-cloud-ai-deployment": aie22,
  "aie23-graphrag": aie23,
};
