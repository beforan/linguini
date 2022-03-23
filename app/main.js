import { program } from "commander";
import { createRequire } from "module";
import { exportAction } from "./commands/export.js";

export const require = createRequire(import.meta.url);
const pkg = require("../package.json");

program.name(pkg.name).description(pkg.description).version(pkg.version);

program
  .command("export")
  .description(
    "Export locale files to a spreadsheet suitable for sending to a localisation team"
  )
  .requiredOption("-s, --source <path>", "path to the source locales directory")
  .option(
    "-o, --output <path>",
    "output .xlsx file path",
    "./translations.xlsx"
  )
  .option(
    "-l, --languages <languages...>",
    "translated languages to include in the output"
  )
  .option("-b, --base <language>", "base language", "dev")
  .action(exportAction);

program.parse();
