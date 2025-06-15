const { Command } = require("commander");
const { json } = require("express");

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
  .argument("[args]", "Arguments of the action")
  .argument("[port]", "port lol", 8765)
  .action(async (action, args, port) => {
    let parsedArgs = {};
    if (args) {
      try {
        parsedArgs = JSON.parse(args);
      } catch (err) {
        console.log(
          "ERROR: Failed to parse the arguments.\nPlease make sure the object of arguments is correctly entered as a JSON string."
        );
      }
    }
    try {
      const result = await invoke(port, action, 6, parsedArgs)
      console.log(result)
    } catch (err) {
      console.error(err)
    }
    // console.log(result)
    // console.log(action,args,port)
    // console.log(action,args,port)
  });
module.exports = anki;
