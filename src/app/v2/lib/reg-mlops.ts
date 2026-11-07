import type { V2Lesson } from "./types";
import { mlops1 } from "../content/mlops1-lanskap";
import { mlops2 } from "../content/mlops2-pipeline";
import { mlops3 } from "../content/mlops3-feature-store";
import { mlops4 } from "../content/mlops4-registry";
import { mlops5 } from "../content/mlops5-cicd";
import { mlops6 } from "../content/mlops6-serving";
import { mlops7 } from "../content/mlops7-monitoring";
import { mlops8 } from "../content/mlops8-retraining";
import { mlops9 } from "../content/mlops9-testing";
import { mlops10 } from "../content/mlops10-governance";
import { mlops11 } from "../content/mlops11-k8s";
import { mlops12 } from "../content/mlops12-capstone";
import { mlops13 } from "../content/mlops13-experiment-tracking";
import { mlops14 } from "../content/mlops14-terraform-iac";
import { mlops15 } from "../content/mlops15-finops-ml";
import { mlops16 } from "../content/mlops16-triton-serving";
import { mlops17 } from "../content/mlops17-keamanan-ml";
import { mlops18 } from "../content/mlops18-platform-engineering";
import { mlops19 } from "../content/mlops19-llmops-end-to-end";
import { mlops20 } from "../content/mlops20-cloud-ml-platforms";
import { mlops21 } from "../content/mlops21-kserve-inference-optimization";
import { mlops22 } from "../content/mlops22-distributed-training";
import { mlops23 } from "../content/mlops23-airflow-orkestrasi";

export const REG_MLOPS: Record<string, V2Lesson> = {
  "mlops1-lanskap": mlops1,
  "mlops2-pipeline": mlops2,
  "mlops3-feature-store": mlops3,
  "mlops4-registry": mlops4,
  "mlops5-cicd": mlops5,
  "mlops6-serving": mlops6,
  "mlops7-monitoring": mlops7,
  "mlops8-retraining": mlops8,
  "mlops9-testing": mlops9,
  "mlops10-governance": mlops10,
  "mlops11-k8s": mlops11,
  "mlops12-capstone": mlops12,
  "mlops13-experiment-tracking": mlops13,
  "mlops14-terraform-iac": mlops14,
  "mlops15-finops-ml": mlops15,
  "mlops16-triton-serving": mlops16,
  "mlops17-keamanan-ml": mlops17,
  "mlops18-platform-engineering": mlops18,
  "mlops19-llmops-end-to-end": mlops19,
  "mlops20-cloud-ml-platforms": mlops20,
  "mlops21-kserve-inference-optimization": mlops21,
  "mlops22-distributed-training": mlops22,
  "mlops23-airflow-orkestrasi": mlops23,
};
