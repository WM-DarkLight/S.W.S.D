# Star Wars Starship Database

![Star Wars Starship Database](https://placeholder.svg?height=300&width=800&text=Star+Wars+Starship+Database)

A comprehensive interactive database of starships from the Star Wars universe, built with Next.js, TypeScript, and Tailwind CSS. This application features a sleek LCARS-inspired interface with Empire and Rebellion themes.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Adding New Starships](#adding-new-starships)
  - [Step-by-Step Guide](#step-by-step-guide)
  - [Complete Starship Template](#complete-starship-template)
  - [Field Descriptions](#field-descriptions)
  - [Example: Adding a New Starship](#example-adding-a-new-starship)
  - [Ship Categories and Examples](#ship-categories-and-examples)
  - [Testing Your New Ship](#testing-your-new-ship)
  - [Troubleshooting](#troubleshooting)
- [Adding Ship Images](#adding-ship-images)
- [Customizing Themes](#customizing-themes)
- [Component Documentation](#component-documentation)
- [Data Structure](#data-structure)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- 🚀 Detailed information on Star Wars starships
- 🔍 Search and filtering capabilities
- 📊 Side-by-side ship comparison
- 📑 Bookmarking system for favorite ships
- 🔄 Search history tracking
- 🌓 Empire and Rebellion themes
- 📱 Fully responsive design
- 💾 Local storage for user preferences

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/star-wars-starship-database.git
   cd star-wars-starship-database
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
star-wars-starship-database/
├── app/                      # Next.js app directory
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Main page component
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── bookmarks-list.tsx    # Bookmarks management
│   ├── faction-icons.tsx     # Faction icon components
│   ├── lcars-header.tsx      # LCARS-style header
│   ├── search-history.tsx    # Search history component
│   ├── ship-information-display.tsx # Ship info display
│   ├── starship-comparison.tsx # Ship comparison component
│   ├── starship-database.tsx # Main database component
│   ├── starship-detail.tsx   # Ship detail component
│   ├── starship-list.tsx     # Ship listing component
│   ├── theme-provider.tsx    # Theme context provider
│   └── theme-switcher.tsx    # Theme toggle component
├── data/                     # Data files
│   └── starships.ts          # Starship data
├── hooks/                    # Custom React hooks
│   └── use-toast.ts          # Toast notification hook
├── types/                    # TypeScript type definitions
│   └── starship.ts           # Starship interface
└── tailwind.config.ts        # Tailwind CSS configuration
\`\`\`

## Adding New Starships

### Step-by-Step Guide

1. **Open the starships data file**:
   Navigate to `data/starships.ts` in your project directory.

2. **Locate the starship array**:
   Find the `starshipData` array that contains all the ship entries:

   \`\`\`typescript
   export const starshipData: Starship[] = [
     // Existing ships...
   ]
   \`\`\`

3. **Add your new ship**:
   Add a new object to the array, following the template structure below.
   
   - Place your new ship at the end of the array
   - Don't forget to add a comma after the previous ship's closing brace
   - Make sure your ship has a unique `id` value

4. **Save the file**:
   Save the changes to `data/starships.ts`.

5. **Verify the syntax**:
   Ensure there are no syntax errors (missing commas, braces, etc.).

6. **Restart the development server** (if needed):
   If you're running the development server, it should automatically update with your changes.

### Complete Starship Template

Copy and paste this template into the `starshipData` array in `data/starships.ts`, then fill in the details for your new ship:

\`\`\`typescript
{
  // REQUIRED FIELDS - These must be included for every ship
  id: "your-ship-id",  // Unique identifier, kebab-case (e.g., "imperial-shuttle")
  name: "Your Ship Name",  // Display name (e.g., "Imperial Lambda-class Shuttle")
  manufacturer: "Ship Manufacturer",  // Who made the ship (e.g., "Sienar Fleet Systems")
  class: "Ship Class",  // Type of vessel (e.g., "Shuttle", "Starfighter", "Star Destroyer")
  faction: "Empire",  // Political alignment: "Empire", "Rebellion", or other faction

  // RECOMMENDED FIELDS - These provide basic information
  model: "Ship Model Designation",  // Official model name/number
  description: "A detailed description of the starship, its history, and significance in the Star Wars universe.",
  
  // SPECIFICATIONS - Technical details about the ship
  specs: {
    length: "Length in meters",  // Physical dimensions
    max_speed_atmos: "Maximum atmospheric speed in km/h",  // Atmospheric speed
    hyperdrive: "Hyperdrive class rating",  // Primary hyperdrive rating (lower is better)
    backup_hyperdrive: "Backup hyperdrive rating",  // Secondary hyperdrive (if applicable)
    crew: "Number of crew members",  // Required crew to operate
    passengers: "Number of passengers",  // Additional capacity beyond crew
    cargo_capacity: "Cargo capacity in metric tons",  // Cargo hold size
    consumables: "Duration of consumable supplies",  // How long it can operate without resupply
    armament: "Weapons systems",  // Detailed weapons loadout
    shielding: "Shield systems",  // Defensive capabilities
    complement: "Complement of vehicles or fighters"  // Carried vessels (for capital ships)
  },
  
  // QUICK REFERENCE PROPERTIES - Duplicated for easier access in UI
  hyperdrive_rating: "Primary hyperdrive rating",
  backup_hyperdrive_rating: "Backup hyperdrive rating",
  MGLT: "Speed in MGLT units",  // Space combat speed measurement
  length: "Length in meters",
  cargo_capacity: "Cargo capacity",
  crew: "Crew size",
  passengers: "Passenger capacity",
  armament: "Weapons systems",
  shields: "Shield systems",
  
  // EXTENDED INFORMATION - Detailed lore and technical data
  technicalNotes: [
    "Technical note 1",  // Special design features
    "Technical note 2",  // Engineering characteristics
    "Technical note 3"   // Notable systems or modifications
  ],
  
  // LORE INFORMATION - In-universe background
  lore: {
    history: "Historical background of the ship",  // Development and service history
    
    tacticalAssessment: "Tactical evaluation of the ship's capabilities",  // Military analysis
    
    notableEvents: [  // Famous incidents involving this ship class
      "Notable event 1",
      "Notable event 2",
      "Notable event 3"
    ],
    
    quotes: [  // Memorable quotes about the ship
      { text: "Quote about the ship", author: "Character Name" },
      { text: "Another quote", author: "Another Character" }
    ],
    
    strengths: [  // Combat/operational advantages
      "Strength 1",
      "Strength 2",
      "Strength 3"
    ],
    
    weaknesses: [  // Combat/operational disadvantages
      "Weakness 1",
      "Weakness 2",
      "Weakness 3"
    ],
    
    fleetRole: "Description of the ship's role in its fleet"  // Tactical purpose
  },
  
  // MISSION HISTORY - Notable operations
  missions: {
    notable: [
      {
        name: "Mission Name",  // Operation title
        code: "Mission Code",  // Military designation
        date: "Mission Date (e.g., 4 ABY)",  // When it occurred (BBY/ABY format)
        description: "Brief mission description",  // What happened
        status: "Completed",  // "Completed", "Failed", "Ongoing", or "Classified"
        outcome: "Mission outcome description"  // Results of the mission
      }
      // Add more missions as needed
    ]
  },
  
  // PERSONNEL INFORMATION - Crew details
  personnel: {
    notableCrew: [  // Famous individuals associated with this ship class
      {
        name: "Crew Member Name",
        rank: "Rank/Title",
        species: "Species",
        role: "Role on the ship"
      }
      // Add more crew members as needed
    ],
    
    standardComplement: {  // Typical crew composition
      officers: 0,  // Number of officers
      enlisted: 0,  // Number of enlisted personnel
      troops: 0,    // Number of troops/soldiers
      droids: 0     // Number of droids (can be a number or string like "Variable")
    }
  }
}
\`\`\`

### Field Descriptions

#### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier in kebab-case | `"imperial-shuttle"` |
| `name` | Display name of the ship | `"Imperial Lambda-class Shuttle"` |
| `manufacturer` | Company that built the ship | `"Sienar Fleet Systems"` |
| `class` | Type/category of vessel | `"Shuttle"` |
| `faction` | Political alignment | `"Empire"` |

#### Specifications

| Field | Description | Example |
|-------|-------------|---------|
| `length` | Physical size in meters | `"20 meters"` |
| `max_speed_atmos` | Maximum atmospheric speed | `"850 km/h"` |
| `hyperdrive` | Primary FTL rating | `"1.0 Class"` |
| `crew` | Required personnel | `"2"` |
| `armament` | Weapons systems | `"Laser cannons (3)"` |

#### Extended Information

| Field | Description | Purpose |
|-------|-------------|---------|
| `technicalNotes` | Array of technical details | Provides engineering context |
| `lore.history` | Background story | Gives historical context |
| `lore.strengths` | Array of advantages | Highlights ship capabilities |
| `lore.weaknesses` | Array of disadvantages | Shows ship limitations |
| `missions.notable` | Array of mission objects | Details famous operations |

### Example: Adding a New Starship

Here's a complete example of adding the B-wing starfighter to the database:

1. Open `data/starships.ts`
2. Add the following entry to the end of the `starshipData` array:

\`\`\`typescript
{
  id: "b-wing",
  name: "B-wing Starfighter",
  model: "A/SF-01 B-wing starfighter",
  manufacturer: "Slayn & Korpil",
  class: "Assault Starfighter/Bomber",
  faction: "Rebellion",
  description: "The B-wing starfighter is a heavily armed Rebel Alliance assault starfighter. The craft's unusual design features a gyroscopic cockpit and an asymmetrical wing configuration, giving it a distinctive appearance. Designed specifically to attack capital ships, the B-wing carries an impressive array of weapons.",
  specs: {
    length: "16.9 meters",
    max_speed_atmos: "950 km/h",
    hyperdrive: "2.0 Class",
    crew: "1",
    passengers: "0",
    cargo_capacity: "45 kg",
    consumables: "1 week",
    armament: "Laser cannons (3), Ion cannons (2), Proton torpedo launchers (2), Auto-blasters (2)",
    shielding: "Deflector shields",
  },
  hyperdrive_rating: "2.0",
  MGLT: "65",
  length: "16.9 meters",
  cargo_capacity: "45 kg",
  crew: "1",
  passengers: "0",
  armament: "Laser cannons (3), Ion cannons (2), Proton torpedo launchers (2), Auto-blasters (2)",
  shields: "Deflector shields",
  technicalNotes: [
    "Gyroscopic cockpit remains stationary while the ship rotates around it",
    "S-foils can be locked in multiple attack positions",
    "Heaviest weapons payload of any Rebel starfighter",
    "Equipped with advanced targeting systems for capital ship weak points"
  ],
  lore: {
    history: "The B-wing was developed by Admiral Ackbar and the Verpine colonists of the Roche asteroid field. It was designed specifically to counter the growing Imperial fleet of capital ships, addressing the Rebellion's need for a dedicated anti-ship starfighter.",
    tacticalAssessment: "The B-wing excels as a heavy assault fighter with capital ship-grade weapons in a starfighter frame. Its unique design allows it to deliver devastating firepower against larger vessels, though this comes at the cost of maneuverability and speed.",
    notableEvents: [
      "First combat deployment at the Battle of Endor",
      "Destruction of the Imperial Star Destroyer Devastator at the Battle of Kuat",
      "Defense of Mon Cala shipyards during Imperial counterattack"
    ],
    quotes: [
      { text: "She's not much to look at, but she'll tear through a Star Destroyer's shield generator like it was made of flimsi.", author: "General Crix Madine" },
      { text: "The most expensive way to deliver a proton torpedo in the galaxy, but worth every credit when you need to punch through capital ship armor.", author: "Admiral Ackbar" }
    ],
    strengths: [
      "Exceptional weapons payload",
      "Specialized for anti-capital ship combat",
      "Strong shields for a starfighter",
      "Rotating airframe provides tactical flexibility"
    ],
    weaknesses: [
      "Poor maneuverability",
      "Slow acceleration",
      "Complex design requires extensive maintenance",
      "Vulnerable to faster starfighters"
    ],
    fleetRole: "The B-wing serves as the Rebel Alliance's dedicated assault starfighter, designed to engage and disable capital ships. It operates in small wings, often with fighter escort, to deliver precision strikes against key systems on larger vessels."
  },
  missions: {
    notable: [
      {
        name: "Battle of Endor",
        code: "BE-ASF",
        date: "4 ABY",
        description: "Assault on Imperial Star Destroyers during the Battle of Endor.",
        status: "Completed",
        outcome: "Successfully disabled several Star Destroyers, contributing to the Rebel victory."
      },
      {
        name: "Operation Ringbreaker",
        code: "ORB-KT",
        date: "5 ABY",
        description: "Strike mission against Imperial shipyards at Kuat.",
        status: "Completed",
        outcome: "Destroyed multiple capital ships under construction and damaged shipyard facilities."
      }
    ]
  },
  personnel: {
    notableCrew: [
      {
        name: "Keyan Farlander",
        rank: "Commander",
        species: "Human",
        role: "Elite B-wing Pilot"
      },
      {
        name: "Ten Numb",
        rank: "Lieutenant",
        species: "Sullustan",
        role: "Blue Squadron B-wing Pilot"
      }
    ],
    standardComplement: {
      officers: 1,
      enlisted: 0,
      troops: 0,
      droids: 0
    }
  }
}
\`\`\`

3. Save the file
4. Verify the ship appears in the database UI

### Ship Categories and Examples

Different ship types require different levels of detail. Here are examples for various categories:

#### Starfighters

Starfighters typically emphasize:
- Maneuverability stats
- Weapons loadout
- Hyperdrive capabilities (if any)
- Pilot requirements

#### Capital Ships

Capital ships should focus on:
- Crew complement
- Carried vessels
- Command structure
- Shield and weapon systems
- Fleet role

#### Freighters/Transports

Civilian vessels should highlight:
- Cargo capacity
- Passenger accommodations
- Modifications (especially for smuggling vessels)
- Special features

#### Specialized Vessels

For unique ships like medical frigates or science vessels:
- Special equipment
- Unique capabilities
- Support roles
- Technical innovations

### Testing Your New Ship

After adding a new ship:

1. **Visual Verification**: Check that the ship appears in the main list
2. **Search Test**: Verify the ship can be found using the search function
3. **Detail View**: Ensure all information displays correctly in the detail view
4. **Comparison**: Test the ship in the comparison view with other vessels
5. **Filtering**: Confirm the ship appears in appropriate faction filters

### Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Ship doesn't appear in list | Syntax error in data entry | Check for missing commas or braces |
| Ship details don't display | Missing required fields | Ensure all required fields are present |
| Console errors | Invalid data types | Verify all fields match the expected types |
| Comparison doesn't work | Inconsistent spec format | Make sure specs use consistent units |
| Search doesn't find ship | Typo in searchable fields | Check name, model, and manufacturer spelling |

## Adding Ship Images

### Step-by-Step Guide for Adding Images

1. **Prepare your image**:
   - Recommended dimensions: 800×400 pixels
   - Format: JPG or PNG
   - File size: Optimize to under 200KB

2. **Name your image file**:
   - Use the exact same ID as your ship entry
   - Example: For a ship with `id: "b-wing"`, name the file `b-wing.jpg`

3. **Add the image to the project**:
   - Create a directory at `public/ships/` if it doesn't exist
   - Place your image file in this directory

4. **Update the image component** (if needed):
   - The `StarshipDetail` component should already be configured to look for images at `/ships/{ship.id}.jpg`
   - If you need to customize this behavior, edit the `StarshipDetail` component:

   \`\`\`typescript
   // In components/starship-detail.tsx
   <Image
     src={`/ships/${ship.id}.jpg`}
     alt={`${ship.name} visual feed`}
     width={800}
     height={400}
     className="w-full h-auto rounded mt-6 mb-2"
     onError={(e) => {
       e.currentTarget.src = `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(ship.name)}`;
     }}
   />
   \`\`\`

5. **Test the image display**:
   - Navigate to your ship's detail view
   - Verify the image loads correctly
   - Check that it displays properly on different screen sizes

### Image Best Practices

- **Consistency**: Maintain similar angles and styles across ship images
- **Background**: Use transparent or space backgrounds for better integration
- **Quality**: Use high-resolution images but optimize file size
- **Aspect Ratio**: Maintain consistent aspect ratios across all images
- **Fallbacks**: The system includes a fallback to placeholder if an image is missing

## Customizing Themes

The application has two built-in themes: Empire and Rebellion. You can customize these themes by editing the `tailwind.config.ts` file.

### Theme Colors

\`\`\`typescript
// Empire theme colors
empire: {
  accent: '#ff2a6d',
  'accent-dark': '#d81557',
  'accent-light': '#ff5a8b',
  panel: '#1a1a1a',
  'panel-dark': '#0f0f0f',
  'panel-light': '#2a2a2a',
  text: '#ffffff',
  'text-muted': '#a0a0a0',
  border: '#333333',
  space: '#000000',
},

// Rebellion theme colors
rebellion: {
  accent: '#4bb6f9',
  'accent-dark': '#1a9ef7',
  'accent-light': '#7cccfa',
  panel: '#1a2535',
  'panel-dark': '#0f1520',
  'panel-light': '#253545',
  text: '#ffffff',
  'text-muted': '#a0c0e0',
  border: '#2a3545',
  space: '#0a121f',
},
\`\`\`

### Adding a New Theme

To add a custom theme:

1. Add your theme colors to the `tailwind.config.ts` file:

\`\`\`typescript
// In tailwind.config.ts
theme: {
  extend: {
    colors: {
      // Existing themes...
      
      // Your new theme
      yourtheme: {
        accent: '#your-accent-color',
        'accent-dark': '#your-darker-accent',
        'accent-light': '#your-lighter-accent',
        panel: '#your-panel-color',
        'panel-dark': '#your-darker-panel',
        'panel-light': '#your-lighter-panel',
        text: '#your-text-color',
        'text-muted': '#your-muted-text',
        border: '#your-border-color',
        space: '#your-background-color',
      },
    }
  }
}
\`\`\`

2. Update the theme provider to include your new theme:

\`\`\`typescript
// In components/theme-provider.tsx
export type Theme = 'empire' | 'rebellion' | 'yourtheme';
\`\`\`

3. Add your theme to the theme switcher:

\`\`\`typescript
// In components/theme-switcher.tsx
const themes: { value: Theme; label: string }[] = [
  { value: 'empire', label: 'Empire' },
  { value: 'rebellion', label: 'Rebellion' },
  { value: 'yourtheme', label: 'Your Theme Name' },
];
\`\`\`

## Component Documentation

### StarshipDatabase

The main component that orchestrates the entire application.

**Props**: None

**State**:
- `searchTerm`: Current search input
- `selectedShip`: Currently selected ship for detailed view
- `comparisonShips`: Array of ships selected for comparison
- `view`: Current view mode ('details', 'comparison', 'history', 'bookmarks')
- `bookmarks`: Array of bookmarked ship IDs
- `searchHistory`: Array of previous search terms

**Key Functions**:
- `handleSearch`: Updates search term and adds to history
- `handleSelectShip`: Sets the currently selected ship
- `handleAddToComparison`: Adds a ship to comparison array
- `handleRemoveFromComparison`: Removes a ship from comparison
- `handleToggleBookmark`: Toggles bookmark status for a ship
- `handleSwitchView`: Changes the current view mode

### StarshipDetail

Displays detailed information about a selected starship.

**Props**:
- `ship`: Starship object to display
- `onAddToComparison`: Function to add ship to comparison
- `onToggleBookmark`: Function to toggle bookmark status
- `isBookmarked`: Boolean indicating if ship is bookmarked

**Key Sections**:
- Basic information and specifications
- Technical notes
- Historical information
- Tactical assessment
- Mission history
- Personnel information

### StarshipList

Renders the list of starships with filtering capabilities.

**Props**:
- `ships`: Array of all starships
- `searchTerm`: Current search term for filtering
- `onSelectShip`: Function called when a ship is selected
- `selectedShip`: Currently selected ship
- `onAddToComparison`: Function to add ship to comparison
- `comparisonShips`: Array of ships in comparison
- `onToggleBookmark`: Function to toggle bookmark status
- `bookmarkedShips`: Array of bookmarked ship IDs

**Key Functions**:
- `filteredShips`: Computes ships matching the search term
- `handleShipClick`: Handles ship selection
- `handleCompareClick`: Handles adding to comparison
- `handleBookmarkClick`: Handles toggling bookmarks

## Data Structure

The application uses a TypeScript interface to define the structure of starship data:

\`\`\`typescript
// In types/starship.ts
export interface Starship {
  id: string
  name: string
  model?: string
  manufacturer: string
  class: string
  faction: string
  description?: string
  specs?: {
    [key: string]: string
    length?: string
    width?: string
    height?: string
    max_speed_atmos?: string
    hyperdrive?: string
    backup_hyperdrive?: string
    crew?: string
    passengers?: string
    cargo_capacity?: string
    consumables?: string
    armament?: string
    shielding?: string
    complement?: string
  }
  // Additional properties for the wiki section
  hyperdrive_rating?: string
  backup_hyperdrive_rating?: string
  MGLT?: string
  length?: string
  cargo_capacity?: string
  crew?: string
  passengers?: string
  armament?: string
  shields?: string

  // Extended information fields
  technicalNotes?: string[]
  lore?: {
    history?: string
    tacticalAssessment?: string
    notableEvents?: string[]
    quotes?: { text: string; author: string }[]
    strengths?: string[]
    weaknesses?: string[]
    fleetRole?: string
  }
  missions?: {
    notable: {
      name: string
      code: string
      date: string
      description: string
      status: "Completed" | "Failed" | "Ongoing" | "Classified"
      outcome: string
    }[]
  }
  personnel?: {
    notableCrew: {
      name: string
      rank: string
      species?: string
      role?: string
    }[]
    standardComplement?: {
      officers?: number
      enlisted?: number
      troops?: number
      droids?: number | string
    }
  }
}
\`\`\`

### Data Flow Diagram

\`\`\`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  starships.ts   │────▶│ StarshipDatabase│────▶│  StarshipList   │
│  (Data Source)  │     │  (Main Component)│     │  (Display List) │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │ StarshipDetail  │     │   Bookmarks,    │
                        │ (Detail View)   │     │ Search History, │
                        │                 │     │   Comparison    │
                        └─────────────────┘     └─────────────────┘
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Star Wars and all related properties are owned by Lucasfilm Ltd. and The Walt Disney Company
- LCARS interface inspired by Star Trek's Library Computer Access/Retrieval System
- Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion
