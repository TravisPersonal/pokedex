import { State } from "./state.js";

export async function commandExplore(state: State, ...args: string[]): Promise<void> {
  console.log(args.length);
  if (args.length !== 1) {
    throw new Error("You must provide a location area name");
  }
  const name = args[0];
  console.log(`Exploring ${name}...`);
  const loc = await state.poke.fetchLocation(name);
  console.log("Found Pokemon:");
  for (const enc of loc.pokemon_encounters) {
    console.log(` - ${enc.pokemon.name}`);
  }
}
