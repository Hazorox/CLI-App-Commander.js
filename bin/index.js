#!/usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
const app = new Command();

app
  .name("JScripting")
  .description(
    "A random app made by hazorox ( On GitHub ) for educational purposes"
  )
  .version("1.0.0 Alpha")
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
    const userName = name;
  });
app.parse();
