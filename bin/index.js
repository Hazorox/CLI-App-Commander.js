#!/usr/bin/env node
const { Command } = require("commander");
const figlet = require("figlet");
const anki = require("../commands/anki");
const files = require("../commands/files");
const csvTable = require("../commands/csv_table")
const app = new Command();
let userName;
app
  .name("JScripting")
  .description(
    "A random app made by hazorox ( On GitHub ) for educational purposes"
  )
  .version("1.0.0 Alpha")
  .addCommand(anki)
  .addCommand(files)
  .addCommand(csvTable)
  .command("setUser")
  .description("Let us know your name or else...")
  .argument("<string...>")
  .option("-n", `Try writing "huh"`, "Weird Ah User")
  .action((args, option) => {
    let name = args[0];
    if (name.toUpperCase() == "HUH") {
      console.log("\n\n\n");
      figlet.text(
        "GET OUT >:O",
        {
          font: "Star Wars",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 120,
          whitespaceBreak: true,
        },
        function (err, data) {
          if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
          }
          console.log(data);
        }
      );
      name = "ↈ";
    } else {
      console.log(
        `Welcome!\nWhat an interesting name, ${name}\nHope you enjoy your try!`
      );
    }
    userName = name;
  });
app.parse(process.argv);
module.exports = { userName };
