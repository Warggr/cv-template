// index.js
import Handlebars from 'handlebars';
import fs from 'node:fs';
 
const template = fs.readFileSync('./template.handlebars', 'utf8');

Handlebars.registerHelper("css", function(sheetname) {
    const contents = fs.readFileSync('resources/' + sheetname, 'utf8');
    return new Handlebars.SafeString('<style>' + contents + '</style>')
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

export function render(resume) {
  return Handlebars.compile(template)({ resume });
}
