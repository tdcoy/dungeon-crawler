# Node Creeper

A simple 2D roguelike adventure built with Angular and TypeScript.

Node Creeper is a path-based roguelike where every decision determines where you can go next. Explore a procedurally generated network of nodes, fight enemies, collect loot, manage your equipment, and find merchants as you attempt to reach the end of your journey.

## About the Game

Instead of directly controlling a character through a traditional map, Nodebound presents the player with a network of connected nodes.

Starting from the edge of the map, the player chooses which available node to explore.

Each node can contain:

- Enemies
- Gold
- Health
- Weapons
- Merchants
- Bosses
- Empty locations

Revealing a node can change which paths are available, forcing the player to make decisions about how they progress through the map.

## Features

### Procedural Map Generation

Each game generates a unique network of connected nodes.

- Randomized node positions
- Procedurally generated connections
- Random starting location
- Randomized enemy and loot placement
- Boss placement based on distance from the starting point

### Combat

Enemies have their own health and damage values.

Players can:

- Attack enemies
- Take damage
- Defeat enemies
- Collect rewards
- Track their current and maximum health

### Inventory & Equipment

Items are built using a component-based system. This allows different types of items to share functionality without requiring a large inheritance hierarchy.

### Merchants

Merchant nodes generate their own inventory based on the current game level.

Players can:

- Purchase items
- Sell items from their inventory
- Spend and earn gold
- Equip purchased equipment

### Loot

Enemies and exploration nodes can provide different types of rewards, including:

- Gold
- Health
- Weapons
- Other items

### Responsive Game UI

The game uses a dark fantasy-inspired interface with:

- Character and inventory sidebar
- Item tooltips
- Equipment indicators
- Merchant interface
- Enemy health and damage displays
- Game-over screen

## Technologies

- **Angular**
- **TypeScript**
- **HTML**
- **CSS**
- **SVG**
- **Angular Signals**

## Architecture

The project uses Angular services to manage game state and separate the game systems into individual responsibilities.

Some of the major systems include:
