import { State } from "./state.js";

export async function commandExit(state: State): Promise<void> {
  console.log("Closing the Pokedex... Goodbye!");
  state.interface.close();
  state.poke.closeCache();
  process.exit(0);
}
