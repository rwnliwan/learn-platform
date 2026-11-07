import type { V2Lesson } from "./types";
import { llmops1 } from "../content/llmops1-lanskap";
import { llmops2 } from "../content/llmops2-prompt-mgmt";
import { llmops3 } from "../content/llmops3-eval";
import { llmops4 } from "../content/llmops4-rag-ops";
import { llmops5 } from "../content/llmops5-guardrail";
import { llmops6 } from "../content/llmops6-cost";
import { llmops7 } from "../content/llmops7-observability";
import { llmops8 } from "../content/llmops8-finetune";
import { llmops9 } from "../content/llmops9-safety";
import { llmops10 } from "../content/llmops10-deploy";
import { llmops11 } from "../content/llmops11-feedback";
import { llmops12 } from "../content/llmops12-capstone";
import { llmops13 } from "../content/llmops13-inference-selfhosted";
import { llmops14 } from "../content/llmops14-smart-routing";
import { llmops15 } from "../content/llmops15-latency-slo";
import { llmops16 } from "../content/llmops16-speculative-decoding";
import { llmops17 } from "../content/llmops17-governance-kepatuhan";
import { llmops18 } from "../content/llmops18-agent-ops";
import { llmops19 } from "../content/llmops19-mcp";
import { llmops20 } from "../content/llmops20-evaluasi-llm-rag";
import { llmops21 } from "../content/llmops21-gateway-semantic-caching";
import { llmops22 } from "../content/llmops22-rlhf-dpo-ops";

export const REG_LLMOPS: Record<string, V2Lesson> = {
  "llmops1-lanskap": llmops1,
  "llmops2-prompt-mgmt": llmops2,
  "llmops3-eval": llmops3,
  "llmops4-rag-ops": llmops4,
  "llmops5-guardrail": llmops5,
  "llmops6-cost": llmops6,
  "llmops7-observability": llmops7,
  "llmops8-finetune": llmops8,
  "llmops9-safety": llmops9,
  "llmops10-deploy": llmops10,
  "llmops11-feedback": llmops11,
  "llmops12-capstone": llmops12,
  "llmops13-inference-selfhosted": llmops13,
  "llmops14-smart-routing": llmops14,
  "llmops15-latency-slo": llmops15,
  "llmops16-speculative-decoding": llmops16,
  "llmops17-governance-kepatuhan": llmops17,
  "llmops18-agent-ops": llmops18,
  "llmops19-mcp": llmops19,
  "llmops20-evaluasi-llm-rag": llmops20,
  "llmops21-gateway-semantic-caching": llmops21,
  "llmops22-rlhf-dpo-ops": llmops22,
};
