import { existsSync, readFileSync, writeFileSync } from "fs";
import { set } from "lodash-es";
import mkdirp from "mkdirp";
import path from "path";
import { read, utils } from "xlsx";
import enquirer from "enquirer";

const { Confirm } = enquirer;

const readExport = (path) => {
  const buf = readFileSync(path);
  const wb = read(buf);

  // TODO options.languages filtering?

  const languages = {};

  wb.SheetNames.forEach((name) => {
    const ws = wb.Sheets[name];

    const json = utils.sheet_to_json(ws);

    let code;

    const lng = json.reduce((a, entry) => {
      // leave language code out of the import result
      // but keep it to use as a key
      if (entry.Key === "__code__") {
        code = entry["Translated Text"];
        return a;
      }

      // otherwise, unpack the key and store the value
      set(a, entry.Key, entry["Translated Text"]);
      return a;
    }, {});

    languages[code] = lng;
  });

  return languages;
};

export const importAction = async (options) => {
  const languages = readExport(options.source);

  for (const l of Object.keys(languages)) {
    // 1. ensure output directory exists
    // 2. for each language, ensure directory exists
    const lngPath = path.join(options.output, l);
    await mkdirp(lngPath);

    const filePath = path.join(lngPath, "core.json");

    // 3. prompt for existing file / allow force
    if (existsSync(filePath)) {
      let overwrite = options.force;

      if (!overwrite) {
        const prompt = new Confirm({
          message: `'${l}' locale file already exists, overwrite?`,
        });
        overwrite = await prompt.run();
      }

      if (!overwrite) continue;
    }

    // 4. write output file
    writeFileSync(filePath, JSON.stringify(languages[l], null, 2), {
      flags: "w",
    });
  }
};
