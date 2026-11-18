import { ShallowLocations } from "./pokeapi.js";
import { State } from "./state.js";

export async function commandMap(state: State): Promise<void> {
  let location_areas: ShallowLocations;
  if (!state.nextLocationsURL) {
    location_areas = await state.poke.fetchLocations();
    state.nextLocationsURL = location_areas.next;
    state.previousLocationsURL = location_areas.previous;
  } else {
    location_areas = await state.poke.fetchLocations(state.nextLocationsURL);
    state.previousLocationsURL = location_areas.previous;
    state.nextLocationsURL = location_areas.next;
  }
  for (let result of location_areas.results) {
    console.log(`${result.name}`);
  }
}
