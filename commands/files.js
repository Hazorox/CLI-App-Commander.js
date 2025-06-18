const { Command } = require("commander");
const { editor } = require("@inquirer/prompts");
const fs = require("fs");

const handleErr = (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
};

const files = new Command()
  .name("files")
  .description("Read/Write")
  .argument("[write]", "write to a file")
  .argument("[read]", "read file's contents")
  .option("-a, --append", "Append content to file")
  .action(async (choice, file, options) => {
    const action = choice == "read" ? "-r" : "-w";
    if (options.append & (action ==  "-r")) {
      console.log("Can't append contents while reading a file");
      process.exit(1);
    }

    if (!fs.existsSync(file) & (action == "-r")) {
      console.log("File not found");
      process.exit(1);
    }

    if (action == "-w") {
      const input = await editor({
        message: "Please enter your input",
      });
      if (options.append) {
        fs.appendFile(file, input, "utf8", (err) => handleErr(err));
      } else {
        fs.writeFile(file, input, "utf8", (err) => handleErr(err));
      }
      console.log("File Modified Successfuly!");
    }
  });
module.exports = files;
