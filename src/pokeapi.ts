import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  #cache: Cache;

  constructor(cacheInterval: number) {
    this.#cache = new Cache(cacheInterval);
  }
  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    let url: string;
    if (pageURL) {
      url = pageURL;
    } else {
      url = PokeAPI.baseURL + "/location-area"
    }

    const cached = this.#cache.get<ShallowLocations>(url);
    if (cached !== undefined) {
      return cached;
    }
    let data: ShallowLocations;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }
      data = await resp.json();
    }
    catch (e) {
      throw new Error(`failed to fetch location data: ${e}`);
    }
    this.#cache.add(url, data);
    return data;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    let url: string = PokeAPI.baseURL + "/location-area/" + locationName;
    const cached = this.#cache.get<Location>(url);
    if (cached !== undefined) {
      return cached;
    }
    let data: Location;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }
      data = await resp.json();
    } catch (e) {
      throw new Error(`failed to fetch location: ${e}`);
    }
    this.#cache.add(url, data);
    return data;
  }


  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    let url: string = PokeAPI.baseURL + "/pokemon/" + pokemonName;
    const cached = this.#cache.get<Pokemon>(url);
    if (cached !== undefined) {
      return cached;
    }
    let data: Pokemon;
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`);
      }
      data = await resp.json();
    } catch (e) {
      throw new Error(`failed to fetch pokemon: ${e}`);
    }
    this.#cache.add(url, data);
    return data;
  }

  closeCache() {
    this.#cache.stopReapLoop();
  }
}

export type ShallowLocations = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Result[],
};

export type Result = {
  name: string,
  url: string,
};

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type EncounterRate = {
  rate: number;
  version: NamedAPIResource;
};

export type EncounterMethodRate = {
  encounter_method: NamedAPIResource;
  version_details: EncounterRate[];
};

export type LocalizedName = {
  name: string;
  language: NamedAPIResource;
};

export type EncounterDetail = {
  min_level: number;
  max_level: number;
  chance: number;
  method: NamedAPIResource;
  condition_values: NamedAPIResource[];
  pokemon_details: null;
};

export type PokemonVersionDetail = {
  version: NamedAPIResource;
  max_chance: number;
  encounter_details: EncounterDetail[];
};

export type PokemonEncounter = {
  pokemon: NamedAPIResource;
  version_details: PokemonVersionDetail[];
};

export type Location = {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: EncounterMethodRate[];
  location: NamedAPIResource;
  names: LocalizedName[];
  pokemon_encounters: PokemonEncounter[];
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: GameIndex[];
  held_items: HeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  species: NamedAPIResource;
  sprites: Sprites;
  cries: Cries;
  stats: PokemonStat[];
  types: PokemonType[];
  past_types: PastType[];
  past_abilities: PastAbility[];
};

export type PokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
};

export type GameIndex = {
  game_index: number;
  version: NamedAPIResource;
};

export type HeldItem = {
  item: NamedAPIResource;
  version_details: { rarity: number; version: NamedAPIResource }[];
};

export type PokemonMove = {
  move: NamedAPIResource;
  version_group_details: VersionGroupDetail[];
};

export type VersionGroupDetail = {
  level_learned_at: number;
  version_group: NamedAPIResource;
  move_learn_method: NamedAPIResource;
  order: number;
  enhancement_level: any;
};

// Sprite shapes
type FrontBack = {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
};

type Front = {
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
};

type FrontOnly = {
  front_default: string;
  front_female: any;
};

type Gray = {
  back_default: string;
  back_gray: string;
  front_default: string;
  front_gray: string;
};

type Shiny = {
  back_default: string;
  back_shiny: string;
  front_default: string;
  front_shiny: string;
};

export type Sprites = {
  back_default: string;
  back_female: any;
  back_shiny: string;
  back_shiny_female: any;
  front_default: string;
  front_female: any;
  front_shiny: string;
  front_shiny_female: any;
  other: {
    dream_world: FrontOnly;
    home: Front;
    "official-artwork": { front_default: string; front_shiny: string };
    showdown: FrontBack;
  };
  versions: {
    "generation-i": { "red-blue": Gray; yellow: Gray };
    "generation-ii": { crystal: Shiny; gold: Shiny; silver: Shiny };
    "generation-iii": {
      emerald: { front_default: string; front_shiny: string };
      "firered-leafgreen": Shiny;
      "ruby-sapphire": Shiny;
    };
    "generation-iv": {
      "diamond-pearl": FrontBack;
      "heartgold-soulsilver": FrontBack;
      platinum: FrontBack;
    };
    "generation-v": { "black-white": FrontBack & { animated: FrontBack } };
    "generation-vi": { "omegaruby-alphasapphire": Front; "x-y": Front };
    "generation-vii": { icons: FrontOnly; "ultra-sun-ultra-moon": Front };
    "generation-viii": { icons: FrontOnly };
  };
};

export type Cries = {
  latest: string;
  legacy: string;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
};

export type PokemonType = {
  slot: number;
  type: NamedAPIResource;
};

export type PastType = {
  generation: NamedAPIResource;
  types: PokemonType[];
};

export type PastAbility = {
  generation: NamedAPIResource;
  abilities: { ability: any; is_hidden: boolean; slot: number }[];
};
