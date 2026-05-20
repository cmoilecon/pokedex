export const games = [
  // Global — toujours en premier
  { id: "national", platform: "global", name: "Pokédex National", shortName: "National", subtitle: "Tous les Pokémon", dexUrl: "https://pokemondb.net/pokedex/national", coverPokemonIds: [1, 4, 7] },

  // Switch
  { id: "lets-go-pikachu-eevee", platform: "switch", name: "Pokémon Let's Go Pikachu/Évoli", shortName: "Let's Go", subtitle: "Kanto Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/lets-go-pikachu-eevee", coverPokemonIds: [1, 4, 7] },
  { id: "sword-shield", platform: "switch", name: "Pokémon Épée/Bouclier", shortName: "Épée/Bouclier", subtitle: "Galar Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sword-shield", coverPokemonIds: [1, 4, 7] },
  { id: "isle-of-armor", platform: "switch", name: "Épée/Bouclier — Isolarmure", shortName: "Isolarmure", subtitle: "Isolarmure Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sword-shield/isle-of-armor", coverPokemonIds: [1, 100, 101] },
  { id: "crown-tundra", platform: "switch", name: "Épée/Bouclier — Couronneige", shortName: "Couronneige", subtitle: "Couronneige Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sword-shield/crown-tundra", coverPokemonIds: [200, 208, 210] },
  { id: "brilliant-diamond-shining-pearl", platform: "switch", name: "Pokémon Diamant Étincelant/Perle Scintillante", shortName: "Diamant/Perle Switch", subtitle: "Sinnoh Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/brilliant-diamond-shining-pearl", coverPokemonIds: [1, 4, 7] },
  { id: "legends-arceus", platform: "switch", name: "Pokémon Legends: Arceus", shortName: "Legends: Arceus", subtitle: "Hisui Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/legends-arceus", coverPokemonIds: [1, 4, 7] },
  { id: "scarlet-violet", platform: "switch", name: "Pokémon Écarlate/Violet", shortName: "Écarlate/Violet", subtitle: "Paldea Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/scarlet-violet", coverPokemonIds: [1, 4, 7] },
  { id: "teal-mask", platform: "switch", name: "Écarlate/Violet — Le Masque Turquoise", shortName: "Septentria", subtitle: "Kitakami Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/scarlet-violet/teal-mask", coverPokemonIds: [197, 198, 199] },
  { id: "indigo-disk", platform: "switch", name: "Écarlate/Violet — Le Disque Indigo", shortName: "Institut Myrtille", subtitle: "Blueberry Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/scarlet-violet/indigo-disk", coverPokemonIds: [241, 240, 243] },
  { id: "legends-z-a", platform: "switch", name: "Pokémon Legends: Z-A", shortName: "Legends: Z-A", subtitle: "Kalos Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/legends-z-a", coverPokemonIds: [1, 4, 7] },
  { id: "mega-dimension", platform: "switch", name: "Legends: Z-A — Mega Dimension", shortName: "Mega Dimension", subtitle: "Hyperspace Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/legends-z-a/mega-dimension", coverPokemonIds: [121, 125, 132] },

  // 3DS
  { id: "x-y", platform: "3ds", name: "Pokémon X/Y", shortName: "X/Y", subtitle: "Kalos Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/x-y", coverPokemonIds: [650, 653, 656] },
  { id: "omega-ruby-alpha-sapphire", platform: "3ds", name: "Pokémon Rubis Oméga/Saphir Alpha", shortName: "ROSA", subtitle: "Hoenn Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/omega-ruby-alpha-sapphire", coverPokemonIds: [252, 255, 258] },
  { id: "sun-moon", platform: "3ds", name: "Pokémon Soleil/Lune", shortName: "Soleil/Lune", subtitle: "Alola Pokédex", dexUrl: "https://pokemondb.net/pokedex/game/sun-moon", coverPokemonIds: [722, 725, 728] },
  { id: "ultra-sun-ultra-moon", platform: "3ds", name: "Pokémon Ultra-Soleil/Ultra-Lune", shortName: "USUL", subtitle: "Alola Pokédex étendu", dexUrl: "https://pokemondb.net/pokedex/game/ultra-sun-ultra-moon", coverPokemonIds: [722, 725, 728] }
];