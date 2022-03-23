import { program } from "commander";
import { createRequire } from "module";
import { exportAction } from "./commands/export.js";
import { importAction } from "./commands/import.js";

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

program
  .command("import")
  .description(
    "Import from a spreadsheet provided by a localisation team and generate new locale files"
  )
  .option(
    "-o, --output <path>",
    "path to the output locales directory",
    "./locales"
  )
  .option(
    "-s, --source <path>",
    "source .xlsx file path",
    "./translations.xlsx"
  )
  .option("-f, --force", "overwrite existing files without confirming")

  // TODO languages filtering
  // .option(
  //   "-l, --languages <languages...>",
  //   "translated languages to output locale files for"
  // )

  .action(importAction);

program.parse();
