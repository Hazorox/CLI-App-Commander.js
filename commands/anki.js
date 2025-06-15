const { Command } = require("commander");
const { editor } = require("@inquirer/prompts");
// Dealing with Anki ( Copied from the docs )
const idk = require("xhr2");
async function invoke(port, action, version, params = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new idk();
    xhr.addEventListener("error", () => reject("failed to issue request"));
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw "response has an unexpected number of fields";
        }
        if (!response.hasOwnProperty("error")) {
          throw "response is missing required error field";
        }
        if (!response.hasOwnProperty("result")) {
          throw "response is missing required result field";
        }
        if (response.error) {
          throw response.error;
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open("POST", `http://127.0.0.1:${port}`);
    xhr.send(JSON.stringify({ action, version, params }));
  });
}

const anki = new Command("anki")
  .description("Connect to AnkiConnect extension to modify your decks")
  .argument("<action>", "Action to do in Anki")
  // .argument("[args]", "Arguments of the action")
  .argument("[port]", "port lol", 8765)
  .action(async (action, port) => {
    const args = await editor({
      message: "Please enter your arguments in JSON object format",
    });

    if (args != "" & args != {}) {
      try {
        const parsedArgs = JSON.parse(args);

        try {
          const result = await invoke(port, action, 6, parsedArgs);
          console.log(result);
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.log("Please enter your JSON object in correct format");
      }
    } else {
      try {
        const result = await invoke(port, action, 6);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    }
    // console.log(action,args,port)
    // console.log(action,args,port)
  });
module.exports = anki;
