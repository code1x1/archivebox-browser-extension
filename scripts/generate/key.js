import { execSync } from "child_process";
import manifest from "../../public/manifest.json" with { type: 'json' };
import { writeFileSync } from "fs";
import path from "path";

const publicKey = execSync(
  'openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt | openssl rsa -pubout -outform DER | openssl base64 -A',
  { encoding: 'utf-8' }
);

manifest.key = publicKey;

writeFileSync(path.resolve(import.meta.dirname, "../../public/manifest.json"), JSON.stringify(manifest, null, 4))