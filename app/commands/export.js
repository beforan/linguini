import fs from "fs";
import path from "path";
import xl from "excel4node";
import { flattenLanguage } from "../helpers/flattenLanguage.js";

export const exportAction = (options) => {
  // load language data based on options
  const languages = {};
  fs.readdirSync(options.source)
    .filter((file) => {
      // confirm it's a directory
      const stats = fs.lstatSync(path.join(options.source, file));
      if (!stats.isDirectory) return false;

      // always include base
      if (options.base === file) return true;

      // no languages option means no filtering
      if (!options.languages) return true;

      // else exclude languages not in the languages option
      if (!options.languages?.includes(file)) return false;

      return true;
    })
    .forEach((file) => {
      // Currently we only load "core.json"
      languages[file] = require(path.join(options.source, file, "core.json"));
    });

  // build output spreadsheet
  const wb = new xl.Workbook();

  const baseLng = flattenLanguage(languages[options.base]);

  Object.keys(languages)
    .filter((l) => l !== options.base)
    .forEach((l) => {
      const lng = flattenLanguage(languages[l]);

      const ws = wb.addWorksheet(lng.name ?? l);

      // Header row
      ws.cell(1, 1).string("Key");
      ws.cell(1, 2).string("Base Text");
      ws.cell(1, 3).string(`Translated Text`);

      // add language code to allow round tripping on import
      ws.cell(2, 1).string("__code__");
      ws.cell(2, 2).string(options.base);
      ws.cell(2, 3).string(l);

      // each base key row
      let row = 3;
      Object.keys(baseLng).forEach((k) => {
        ws.cell(row, 1).string(k);
        ws.cell(row, 2).string(baseLng[k]);
        ws.cell(row, 3).string(lng[k] ?? "");
        row++;
      });
    });

  // Write the output xlsx
  wb.write(options.output);
};
