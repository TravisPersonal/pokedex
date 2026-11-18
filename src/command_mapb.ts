import { State } from "./state.js";
import { ShallowLocations } from "./pokeapi.js";

export async function commandMapb(state: State): Promise<void> {
  let location_areas: ShallowLocations;
  if (!state.previousLocationsURL) {
    console.log("You're on the first page");
    return;
  } else {
    location_areas = await state.poke.fetchLocations(state.previousLocationsURL);
    state.previousLocationsURL = location_areas.previous;
    state.nextLocationsURL = location_areas.next;
  }
  for (let result of location_areas.results) {
    console.log(`${result.name}`);
  }
}
