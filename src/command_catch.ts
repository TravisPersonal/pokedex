import type { State } from "./state.js";

const CATCH_DIFFICULTY = 100;

export async function commandCatch(state: State, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error("You must provide a pokemon name");
  }
  const name = args[0];
  console.log(`Throwing a Pokeball at ${name}...`);
  const pokemon = await state.poke.fetchPokemon(name);
  const chanceToCatch = CATCH_DIFFICULTY / (CATCH_DIFFICULTY + pokemon.base_experience);
  if (Math.random() < chanceToCatch) {
    console.log(`${name} was caught!`);
    state.pokedex[name] = pokemon;
  } else {
    console.log(`${name} escaped!`);
  }

}

