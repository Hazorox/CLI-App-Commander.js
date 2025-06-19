const { Command } = require("commander");
const { input } = require("@inquirer/prompts");
const Table = require("cli-table3");
const { Client } = require("pg");
const color = require("chalk");
const chalk = new color.Chalk();
require("dotenv").config();
const env = process.env;
const server = new Client({
  port: 5432,
  host: env.HOST,
  user: env.USER,
  password: env.PASS,
  database: env.DB,
});
const verifyNumber = (num) => {
  if (num.toString() == NaN.toString()) {
    console.log(chalk.red("Please enter a valid Integer"));
    process.exit(1);
  }
};


//TODO: Add auto increment on deleting row

const notes = new Command("notes")
  .description("Make some to do notes!")
  .option("-n, --new", "Create a new note.")
  .option("-l, --list [string...]", "List your notes.")
  .option("-d, --delete <number>", "Delete a note by ID")
  .option("--done <number>", "Update your Note status to done.")
  .action(async (options) => {
    let listed;
    if (options) {
      if (Object.keys(options).length > 1) {
        console.log(chalk.red("Please enter only one flag / option"));
        process.exit(1);
      }
      let query;
      if (options.new) {
        const text = await input({
          message: "Please enter the text of your note.\n",
        });
        if (text.length < 2) {
          console.log(chalk.red("Too short input"));
          process.exit(1);
        }
        query = `INSERT INTO data (text, status) VALUES ('${text}', 'PENDING');`;
      } else if (options.list) {
        const choices = ["ALL", "PENDING", "DONE"];
        const userChoice =
          options.list === true ? "ALL" : options.list[0].toUpperCase();
        if (!choices.includes(userChoice)) {
          console.log(
            chalk.red(
              "Please enter a valid input from these values (all, pending, done)."
            )
          );
        }
        if (userChoice != "ALL") {
          query = `SELECT * FROM DATA WHERE STATUS = '${userChoice}';`;
        } else {
          query = `SELECT * FROM DATA;`;
        }
        listed = true;
      } else if (options.delete) {
        const id = parseInt(options.delete);
        verifyNumber(id);
        query = `DELETE FROM data WHERE id = ${id};`;
      } else {
        const id = parseInt(options.done);
        verifyNumber(id);
        query = `UPDATE data SET status = 'DONE' WHERE id = ${id};`;
      }
      try {
        await server.connect();
        const result = await server.query(query);
        if (listed) {
          if (result.rows.length != 0) {
            const table = new Table({
              head: ["ID", "Text", "Status"],
            });
            result.rows.forEach((row) => {
                const status = row.status == "DONE" ? chalk.green("Done") : chalk.yellow("Pending")
              table.push([row.id, row.text, status]);
            });
            console.log(table.toString());
          } else {
            console.log(chalk.red("Couldn't find any row with that status"));
            process.exit(1);
          }
        }
        console.log(chalk.green("Success!"));
        process.exit(1);
      } catch (err) {
        console.log(chalk.red("Error in connection to Database"));
      } finally {
        await server.end();
      }
    } else {
      console.log(chalk.red("Please enter to use the command"));
      process.exit(1);
    }
  });

module.exports = notes;
