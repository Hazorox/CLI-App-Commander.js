import { Command } from "commander";
const app = new Command();
app
  .name("JScripting")
  .description(
    "A random app made by hazorox ( On GitHub ) for educational purposes"
  )
  .argument('<string...>')
  .version("1.0.0 Alpha")
  .option("-n", "Let us know your name :>","Weird Ah User")
  .action((args, option)=>{
    if (option.n){
        console.log(`Welcome!\nWhat an interesting name, ${args[0]}\nHope you enjoy your try!`)
    }
  })
app.parse()
