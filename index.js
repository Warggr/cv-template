import Handlebars from "handlebars";
import template from "./template.handlebars";

import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";

import fonts from "./resources/fonts.css";
import semantics from "./resources/semantics.css";
import columns from "./resources/columns.css";
import style from "./resources/style.css";
import editor from "./resources/editor.css";

const cssFiles = {
  "fonts.css": fonts,
  "columns.css": columns,
  "style.css": style,
  "editor.css": editor,
  "semantics.css": semantics,
};

const locales = {
  en: en,
  de: de,
  fr: fr,
};

Handlebars.registerHelper("css", function (sheetname) {
  const contents = cssFiles[sheetname];
  return new Handlebars.SafeString("<style>" + contents + "</style>");
});

Handlebars.registerHelper("toLowerCase", function (str) {
  return str.toLowerCase();
});

export function render(resume) {
  const locale = locales[`./locales/${resume.meta.lang ?? "en"}.json`];

  const translations = locales[resume.meta.lang ?? "en"];
  Handlebars.registerHelper("i18n", function (key) {
    return translations[key];
  });

  const regionNames = new Intl.DisplayNames([resume.meta.lang ?? "en"], {
    type: "region",
  });
  Handlebars.registerHelper("toCountryName", (code) => regionNames.of(code));

  return Handlebars.compile(template, { noEscape: true })({ resume });
}
