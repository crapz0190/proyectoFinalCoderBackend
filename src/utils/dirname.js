import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = join(dirname(_filename), "../");

export default _dirname;
