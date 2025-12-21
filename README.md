# SFRPG Easy NPC Crew

![Foundry v13](https://img.shields.io/badge/foundry-v13-green)

## Overview
This Module provides a button on Starship actor sheets with NPC crew selected to auto generate the NPC crew skills, based on the ship tier.

## Starship Chase Generator
- Scene Config gains a new tab: Starship Chase.
- Inputs: APL and Length (default 4), plus selectable Environmental Effects.
- Obstacles and Environmental Effects are stored in journals so GMs can expand them:
	- SEC Chase: Obstacles
	- SEC Chase: Environmental Effects
- Generating creates a Journal in folder "SEC Chases" with one section per round and buttons that roll to chat.

Notes:
- The module seeds default lists if the journals don’t exist.
- Click any "Roll" button inside the generated journal, enter a modifier, and the result posts to chat.

---

## Features
- NPC Crew Skill Automation: Fills starship NPC crew skills from tier and role presets.
- Ship Sheet Enhancements: Quick actions for shield divert, ship repair, and ship optimization.
- NPC Actor Tools: Set NPC attributes/attacks and copy images.
- Starship Chase Generator: Build chases from Scene Config and run them from a generated Journal.

## Requirements
- Foundry VTT v13 (module declares compatibility 10–13).
- Starfinder (SFRPG) system installed and active in the world.

## Getting Started
1) Install and enable the module in your world.
2) Open a Starship actor sheet that uses NPC Crew to see extra buttons.
3) Use Scene Config → Starship Chase tab to generate and run chases.

## Starship Actor Additions
- Set NPC Skills: Populates `system.crew.npcData` based on tier and options.
- Optimise: Tries to select a cost-effective frame and parts from SFRPG compendia.
- Repair Ship: Evenly redistributes shields, restores HP, and resets systems to nominal.
- Shield Divert: Small +/- buttons added to each shield arc header to shift shields by 5% power.

Where implemented
- Starship sheet buttons and behaviors are implemented in [modules/sfrpg-easy-crew.js](modules/sfrpg-easy-crew.js).
- Optimization helpers are in [modules/optimiseShip.js](modules/optimiseShip.js), with build factors in [modules/npcdata.js](modules/npcdata.js).

## NPC Actor Utilities (non-starship)
On NPC sheets, this module adds buttons under the Skills list:
- Set NPC Attributes: Opens a dialog to set HP from role/CR table and apply combat role stats (EAC/KAC/saves/skills).
- Set NPC Weapons: Attempts to normalize and upgrade weapons from compendia based on CR and role.
- Copy NPC Image: Copies actor image to prototype token and matching placed tokens.

Key data tables and images
- Role stat tables, HP and attack baselines: [modules/npcdata.js](modules/npcdata.js).

## Settings
World settings (Configure Settings → Module Settings):
- Envoy Captains: +1 to Bluff/Diplomacy/Intimidate for Captain role.
- Operative Pilots: +2 to Piloting for the Pilot role.

## Starship Chase Generator (Details)
- Access: Open any Scene → Configure → Starship Chase tab.
- Inputs: APL, Length (rounds, default 4), Environmental Effects (multi-select).
- Lists are editable:
	- In the tab’s “Manage Lists” (GM only) to add/remove entries inline and save.
	- Or by editing the seeded journals “SEC Chase: Obstacles” and “SEC Chase: Environmental Effects”.
- Generate: Creates a new Journal in folder “SEC Chases” with one section per round:
	- Shows obstacle, roles, failure text, and a suggested chase action.
	- Provides “Avg/Hard” roll buttons that post to chat.
	- Adjusts DCs automatically from selected effects and shows the adjustment reason.
	- Adds per-action notes when effects change outcomes (e.g., Cloud Cover, Volatile Atmosphere, Sabotaged Engine).
	- Includes an “Outcome Helper” button to summarize the final chase result.

Seeded data storage
- Obstacles/effects are stored as flags on their journals and mirrored to the page content for easy viewing.
- You can expand or replace these lists at any time; generation reads latest values.

## Known Limitations
- Ship optimization uses heuristics and compendium availability; review results and adjust as needed.
- Chase generator suggests a chase action per round and enforces “no consecutive duplicates”; action resolution is still GM-driven.
- Environmental effect DC adjustments are applied to displayed DCs but don’t alter any rules beyond display and notes.

## Quick Tips
- If you don’t see the starship buttons, make sure the ship is using NPC Crew.
- If journals for Obstacles/Effects don’t exist, they’re auto-created on world ready (GM only).
- You can re-generate a chase anytime; previously created journals remain for your records.


### Advanced Controls
- Manage lists inline: The Scene tab includes a "Manage Lists" section (GM only) to add/remove Obstacles and Environmental Effects and save them back to the journals.
- Action sequencing: Each round includes a pre-selected chase action; no action repeats in consecutive rounds and "Evaluate Weakness" appears at most once per chase.
- Outcome helper: Click the "Outcome Helper" button in the generated journal to input total successes and get a summarized result per Table 2–3.