import type { State } from "./state.js";

export function cleanInput(input: string): string[] {
  let result: string[] = input.trim().toLowerCase().split(" ");
  return result;
}

export function startREPL(state: State) {
  state.interface.on("line", async (input: string) => {
    const words = cleanInput(input);
    if (words.length === 0) {
      state.interface.prompt();
      return;
    }
    let command = words[0];
    if (command in state.commands) {
      try {
        await state.commands[command].callback(state, ...words.slice(1));
      } catch (e) {
        console.log(`Error calling API ${e}`);
      }
    } else {
      console.log("Unknown command");
    }
    state.interface.prompt();
  });
};
