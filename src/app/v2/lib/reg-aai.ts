import type { V2Lesson } from "./types";
import { aai1 } from "../content/aai1-lanskap";
import { aai18 } from "../content/aai18-fondasi-api-llm";
import { aai2 } from "../content/aai2-anatomi";
import { aai3 } from "../content/aai3-tool-use";
import { aai4 } from "../content/aai4-memory";
import { aai5 } from "../content/aai5-rag-agent";
import { aai6 } from "../content/aai6-multi-agent";
import { aai7 } from "../content/aai7-prompt";
import { aai8 } from "../content/aai8-evaluasi";
import { aai9 } from "../content/aai9-guardrail";
import { aai10 } from "../content/aai10-framework";
import { aai11 } from "../content/aai11-debugging";
import { aai12 } from "../content/aai12-capstone";
import { aai13 } from "../content/aai13-mcp";
import { aai14 } from "../content/aai14-context-engineering";
import { aai15 } from "../content/aai15-hardening-deploy";
import { aai16 } from "../content/aai16-tool-security";
import { aai17 } from "../content/aai17-a2a-protocol";
import { aai19 } from "../content/aai19-cloud-deployment-agen";
import { aai20 } from "../content/aai20-agen-sebagai-service";
import { aai21 } from "../content/aai21-automation-platforms";

export const REG_AAI: Record<string, V2Lesson> = {
  "aai1-lanskap": aai1,
  "aai18-fondasi-api-llm": aai18,
  "aai2-anatomi": aai2,
  "aai3-tool-use": aai3,
  "aai4-memory": aai4,
  "aai5-rag-agent": aai5,
  "aai6-multi-agent": aai6,
  "aai7-prompt": aai7,
  "aai8-evaluasi": aai8,
  "aai9-guardrail": aai9,
  "aai10-framework": aai10,
  "aai11-debugging": aai11,
  "aai12-capstone": aai12,
  "aai13-mcp": aai13,
  "aai14-context-engineering": aai14,
  "aai15-hardening-deploy": aai15,
  "aai16-tool-security": aai16,
  "aai17-a2a-protocol": aai17,
  "aai19-cloud-deployment-agen": aai19,
  "aai20-agen-sebagai-service": aai20,
  "aai21-automation-platforms": aai21,
};
