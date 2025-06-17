const j2h = require("node-json2html");
const fs = require("fs");
const { editor } = require("@inquirer/prompts");
const { Command } = require("commander");
const csv = require("csvtojson");
const { default: chalk } = require("chalk");
// Thanks to AI for this function lol ( I am terrible ikr )
function convertJSONToTable(jsonData) {
  let table = "<table><thead><tr>";
  const headerTemplates = Object.keys(jsonData[0]);
  headerTemplates.forEach(
    (headerTemplate) => (table += `<th>${headerTemplate}</th>`)
  );
  table += "</tr></thead><tbody>";
  jsonData.forEach((row) => {
    table += "<tr>";
    headerTemplates.forEach(
      (headerTemplate) => (table += `<td>${row[headerTemplate]}</td>`)
    );
    table += "</tr>";
  });
  table += "</tbody></table>";
}

const csvTable = new Command("csvTable").action(async (options) => {
  const input = await editor({
    message: "Please enter your input in CSV format",
  });

  try {
    csv({
      output: "json",
    })
      .fromString(input)
      .then((data) => {
        // I admit my failure here....
        // I used AI to define the rows and headers

        const headers = Object.keys(data[0]);

        // Create the header row
        let headerRow = headers.map((header) => `<th>${header}</th>`).join("");

        // Create rows for each object in data
        let rows = data
          .map((row) => {
            let cells = headers
              .map((header) => `<td>${row[header]}</td>`)
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("");

        fs.writeFile(
          "./result.html",
          `<table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`,
          (err) => {
            if (err) {
              console.error("Error writing file:", err);
              return;
            }
            console.log("File written successfully!");
          }
        );
        chalk.green("Success!");
      });
  } catch (err) {
    chalk.red("Error in operation\n");
    process.exit(1);
  }
});

module.exports = csvTable;


// No comments at all lol