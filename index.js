// index.js
import Handlebars from "handlebars";
import asyncHelpers from "handlebars-async-helpers";

const hb = asyncHelpers(Handlebars);

async function load(resourcePath) {
  if (typeof window === "undefined") {
    // Node.js.
    // Checking for e.g. `process.versions?.node` does not work on esm.sh, for some reason
    const { readFile } = await import("node:fs/promises");

    return readFile(resourcePath, "utf8");
  } else {
    // Browser
    const response = await fetch(new URL(resourcePath, import.meta.url));
    if (!response.ok) {
      throw new Error(
        `failed to fetch resource ${resourcePath}: ${response.status}`,
      );
    }
    return response.text();
  }
}

hb.registerHelper("css", async function (sheetname) {
  const contents = await load("resources/" + sheetname);
  return new Handlebars.SafeString("<style>" + contents + "</style>");
});

hb.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

export async function render(resume) {
  const template_promise = load("./template.handlebars");
  const translations = load(`./locales/${resume.meta.lang ?? "en"}.json`)
    .then(JSON.parse)
    .then((translations) => {
      hb.registerHelper("i18n", function (key) {
        return translations[key];
      });
    });
  const regionNames = new Intl.DisplayNames([resume.meta.lang ?? "en"], {
    type: "region",
  });
  hb.registerHelper("toCountryName", (code) => regionNames.of(code));

  const [template, _] = await Promise.all([template_promise, translations]);

  return hb.compile(template, { noEscape: true })({ resume });
}
