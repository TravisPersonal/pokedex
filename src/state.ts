import { createInterface, type Interface } from "node:readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { stdin, stdout } from "node:process";
import { PokeAPI, Pokemon } from "./pokeapi.js";
import { commandMap } from "./command_map.js";
import { commandMapb } from "./command_mapb.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { commandInspect } from "./command_inspect.js";
import { commandPokedex } from "./command_pokedex.js";

export type State = {
  interface: Interface;
  poke: PokeAPI,
  nextLocationsURL: string | null,
  previousLocationsURL: string | null,
  commands: Record<string, CLICommand>;
  pokedex: Record<string, Pokemon>;
};

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export function initState(): State {
  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "Pokedex > "
  });

  const registry = getCommands();
  const state: State = {
    interface: rl,
    commands: registry,
    pokedex: {},
    poke: new PokeAPI(300000),
    nextLocationsURL: null,
    previousLocationsURL: null,
  };
  return state;
}

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    },
    map: {
      name: "map",
      description: "Display names of 20 location areas",
      callback: commandMap,
    },
    mapb: {
      name: "mapb",
      description: "Display previous 20 location areas",
      callback: commandMapb,
    },
    explore: {
      name: "explore",
      description: "Explore a location area: explore <area-name>",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Catch a pokemon",
      callback: commandCatch,
    },
    inspect: {
      name: "inspect",
      description: "inspect a pokemon",
      callback: commandInspect,
    },
    pokedex: {
      name: "pokedex",
      description: "print pokemon in pokedex",
      callback: commandPokedex,
    }

  }
}
