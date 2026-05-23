export const games = [
  // Global — toujours en premier
  { id: "national", platform: "global", name: "Pokédex National", shortName: "National", subtitle: "Tous les Pokémon", dexUrl: "https://pokemondb.net/pokedex/national", coverPokemonIds: [1, 4, 7] },

  // Switch
  { id: "lets-go-pikachu-eevee", platform: "switch", name: "Pokémon Let's Go Pikachu/Évoli", shortName: "Let's Go", subtitle: "Kanto Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/lets-go-pikachu-eevee", coverPokemonIds: [25, 133, 150] },
  { id: "sword-shield", platform: "switch", name: "Pokémon Épée/Bouclier", shortName: "Épée/Bouclier", subtitle: "Galar Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sword-shield", coverPokemonIds: [1, 4, 7] },
  { id: "isle-of-armor", platform: "switch", name: "DLC - Isolarmure", shortName: "Isolarmure", subtitle: "Isolarmure Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sword-shield/isle-of-armor", coverPokemonIds: [1, 100, 101] },
  {
    id: "crown-tundra", platform: "switch", name: "DLC - Couronneige", shortName: "Couronneige", subtitle: "Couronneige Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sword-shield/crown-tundra", coverPokemonIds: [208, 209, 210],
    coverSprites: [
      { slug: "calyrex-shadow-rider", name: "shadow" },
      { slug: "calyrex", name: "calyrex" },
      { slug: "calyrex-ice-rider", name: "ice" }
    ]
  },
  { id: "brilliant-diamond-shining-pearl", platform: "switch", name: "Pokémon Diamant/Perle (Remake)", shortName: "Diamant/Perle Switch", subtitle: "Sinnoh Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/brilliant-diamond-shining-pearl", coverPokemonIds: [1, 4, 7] },
  {
    id: "legends-arceus", platform: "switch", name: "Pokémon Legends: Arceus", shortName: "Legends: Arceus", subtitle: "Hisui Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/legends-arceus", coverPokemonIds: [1, 4, 7],
    coverSprites: [
      { slug: "palkia-origin", name: "palkia" },
      { slug: "arceus-normal", name: "Arceus" },
      { slug: "dialga-origin", name: "dialga" }
    ]
  },
  { id: "scarlet-violet", platform: "switch", name: "Pokémon Écarlate/Violet", shortName: "Écarlate/Violet", subtitle: "Paldea Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/scarlet-violet", coverPokemonIds: [1, 4, 7] },
  { id: "teal-mask", platform: "switch", name: "DLC - Le Masque Turquoise", shortName: "Septentria", subtitle: "Kitakami Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/scarlet-violet/teal-mask", coverPokemonIds: [197, 198, 199] },
  { id: "indigo-disk", platform: "switch", name: "DLC - Le Disque Indigo", shortName: "Institut Myrtille", subtitle: "Blueberry Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/scarlet-violet/indigo-disk", coverPokemonIds: [236, 240, 243],
    coverSprites: [
      { slug: "terapagos-normal", name: "palkia" },
      { slug: "terapagos-terastal", name: "Arceus" },
      { slug: "pecharunt", name: "dialga" }
    ]
   },
  {
    id: "legends-z-a", platform: "switch", name: "Pokémon Legends: Z-A", shortName: "Legends: Z-A", subtitle: "Kalos Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/legends-z-a", coverPokemonIds: [718, 670, 718],
    coverSprites: [
      { slug: "zygarde-50", name: "Zygarde 50%" },
      { slug: "zygarde-complete", name: "Zygarde forme parfaite" },
      { slug: "zygarde-10", name: "Zygarde 10%" }
    ]
  },
  {
    id: "mega-dimension",
    platform: "switch",
    name: "DLC - Mega Dimension",
    shortName: "Mega Dimension",
    subtitle: "Hyperspace Pokédex",
    dexUrl: "https://pokemondb.net/pokedex/game/legends-z-a/mega-dimension",
    coverPokemonIds: [720, 491, 807],
    coverSprites: [
      { slug: "hoopa", name: "Hoopa" },
      { slug: "darkrai", name: "Darkrai" },
      { slug: "zeraora", name: "Zeraora" }
    ]
  },

  // 3DS
  { id: "x-y", platform: "3ds", name: "Pokémon X/Y", shortName: "X/Y", subtitle: "Kalos Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/x-y", coverPokemonIds: [1, 4, 7] },
  { id: "omega-ruby-alpha-sapphire", platform: "3ds", name: "Pokémon Rubis Oméga/Saphir Alpha", shortName: "ROSA", subtitle: "Hoenn Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/omega-ruby-alpha-sapphire", coverPokemonIds: [1, 4, 7],
    coverSprites: [
      { slug: "groudon-primal", name: "primo groudon" },
      { slug: "rayquaza-mega", name: "mega rayquaza" },
      { slug: "kyogre-primal", name: "primo kyogre" }
    ]
   },
  { id: "sun-moon", platform: "3ds", name: "Pokémon Soleil/Lune", shortName: "Soleil/Lune", subtitle: "Alola Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sun-moon", coverPokemonIds: [1, 4, 7] },
  { id: "ultra-sun-ultra-moon", platform: "3ds", name: "Pokémon Ultra-Soleil/Ultra-Lune", shortName: "USUL", subtitle: "Alola Pokédex étendu", dexUrl: "https://pokemondb.net/pokedex/game/ultra-sun-ultra-moon", coverPokemonIds: [389, 390, 400],
    coverSprites: [
      { slug: "necrozma-dawn-wings", name: "necrozma" },
      { slug: "necrozma-ultra", name: "necrozma" },
      { slug: "necrozma-dusk-mane", name: "necrozma" }
    ]
   }
];