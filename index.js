// index.js
import Handlebars from "handlebars";
import fs from "node:fs";

const template = fs.readFileSync("./template.handlebars", "utf8");

Handlebars.registerHelper("css", function (sheetname) {
  const contents = fs.readFileSync("resources/" + sheetname, "utf8");
  return new Handlebars.SafeString("<style>" + contents + "</style>");
});

Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

export function render(resume) {
  const translations = JSON.parse(
    fs.readFileSync(`./locales/${resume.meta.lang ?? "en"}.json`),
  );
  Handlebars.registerHelper("i18n", function (key) {
    console.warn("Translating", key);
    return translations[key];
  });

  return Handlebars.compile(template, { noEscape: true })({ resume });
}
