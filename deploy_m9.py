#!/usr/bin/env python3
"""Deploy M9 Learn v2 (next-on-pages output) ke Cloudflare Pages.

Direktori WAJIB .vercel/output/static (BUKAN .vercel/output — insiden M5).
Mewarisi os.environ penuh (proxy). Token via dynamic_credentials (tidak diprint).
"""
import os
import subprocess
import sys

sys.path.insert(0, "/opt/hatch/workflow-skills/custom-connector-setup/bin")
from dynamic_credentials import dynamic_credential_entry

HERE = os.path.dirname(os.path.abspath(__file__))
WRANGLER = os.path.expanduser(
    "~/workspace/radar-tokenized-stocks/web/node_modules/.bin/wrangler"
)

env = dict(os.environ)
env["CLOUDFLARE_API_TOKEN"] = dynamic_credential_entry("custom.cloudflare")["surrogate"]

cmd = [
    WRANGLER, "pages", "deploy", ".vercel/output/static",
    "--project-name", "learn-platform",
    "--branch", "main",
    "--commit-dirty=true",
]
print("CMD:", " ".join(cmd), flush=True)
r = subprocess.run(cmd, cwd=HERE, env=env)
print("WRANGLER EXIT:", r.returncode, flush=True)
sys.exit(r.returncode)
