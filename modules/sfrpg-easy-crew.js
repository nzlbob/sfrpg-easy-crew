
Hooks.on("init", function () {
  // console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
  game.settings.register("sfrpg-easy-crew", "pilotOperative", {
    name: "Operative Pilots",
    hint: "Pilots are assumed to be operatives and gain the +2 bonus to Piloting checks from NPC Operative and skillful special abilities.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register("sfrpg-easy-crew", "captainEnvoy", {
    name: "Envoy Captains",
    hint: "Captains are assumed to be envoys and gain the +1 bonus to Diplomacy, Bluff and Intimidate checks from skillful NPC special abilities.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

Hooks.on("ready", function () {
  //  console.log("This code runs once core initialization is ready and game data is available.");
});

Hooks.on("renderActorSheet", (app, html, data) => {
  const type = app.actor.isToken ? "token" : "actor"
  const id = app.actor.isToken ? app.token.id : app.actor.id

  if ((app.actor.type === "starship")) {
    const middleColumn = html.find(".crew-settings.flexrow");
    const shipAttributes = html.first(".flexcol.traits");
    const button = '<div class="NPCSETSKILL" data-id = "' + id + '"data-type = "' + type + '"> <button type="button"> Set NPC Skills</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    const buttonRepair = '<div class="repairship" data-id = "' + id + '"data-type = "' + type + '"> <button type="button"> Repair Ship</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    if (app.actor.system.crew.useNPCCrew) middleColumn.find(".settings.flexrow").append(button);
    middleColumn.find(".settings.flexrow").append(buttonRepair);
    shipAttributes.find(".flexcol.traits").eq(0).find(".flexrow").find(".flexcol").find("div").append(buttonRepair);
    html.find(".NPCSETSKILL").click(onSetNPCSkills.bind(html));
    html.find(".repairship").click(onRepairShip.bind(html));
  }

})

function onRepairShip(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const element = event.currentTarget;
  const id = element.dataset.id;
  const type = element.dataset.type;
  const actor = type === "token" ? canvas.tokens.get(id).actor : game.actors.get(id);
  console.log("Repair Ship Clicked", actor, id, type);
  // Call the repair ship function here
const newQuadrants = foundry.utils.duplicate(actor.system.quadrants)
const newSystems = foundry.utils.duplicate(actor.system.attributes.systems)
 const evenShield = Math.floor(actor.system.attributes.shields.max / 4) // Calculate the even shield value for each quadrant
 const leftoverShield = actor.system.attributes.shields.max - evenShield * 4

 for (let [a,b] of Object.entries(newQuadrants)) {
  //   console.log(a,b)

    b.shields.value = evenShield
    if (a == "forward") {
      b.shields.value += leftoverShield // Add any leftover shields to the fore quadrant
    }
  }

  for (let [name,system] of Object.entries(newSystems)) {
    system.value = 'nominal'

  }
actor.update({"system.attributes.hp.value": actor.system.attributes.hp.max})
actor.update({"system.attributes.systems": newSystems}) // Update the systems to nominal status
console.log("New Quadrants", newQuadrants, "New Systems", newSystems)

//actor.sheet.close() // Close the sheet before updating
actor.update({"system.quadrants": newQuadrants}).then(() => {
 // actor.update(hpToMax).then(() => {
  actor.sheet.render(false); // Re-render the sheet to show the updated values 
  ui.notifications.info("Ship Repaired to Full HP", { permanent: true, localize: true });
    // console.log("Ship Repaired")
    // actor.sheet.render(true)
  }).catch(err => {
    console.error("Error repairing ship:", err);
    ui.notifications.error("Failed to repair ship.");
  });



}

function onSetNPCSkills(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const element = event.currentTarget;
  const id = element.dataset.id;
  const type = element.dataset.type;
  const actor = type === "token" ? canvas.tokens.get(id).actor : game.actors.get(id);
  console.log("Set NPC Skills Clicked", actor, id, type);
  setNPCSkills(actor);
}

Hooks.on("renderRegionConfig", function (app, html, data) {
  // console.log("This code runs when the Region Sheet is rendered.", app, html, data);
});



async function setNPCSkills(actor) {

  /**
   * @module npc.js
   * @name NPC Creation Script
   * @file npc.js
   * @description This file is used to create NPCs for the game. It uses the NPC array to create 
   * the NPCs and then uses the skillset to assign skills to the NPCs. It also uses the crew 
   * modifier to modify the NPCs.
   * @author Bob
   * @date 2025-04-27
   * @version 1.0
   * 
   * Assumptions
   * Captain: Envoy Skill expertise in Diplomacy 
   * Pilot: Operative +1 to Piloting
   * Engineer: Mechanic +1 to Engineering (Bypass)
   * 
   */
const pilotOperative = game.settings.get("sfrpg-easy-crew", "pilotOperative")
const captainEnvoy = game.settings.get("sfrpg-easy-crew", "captainEnvoy")

  const useNPCCrew = actor.system.crew.useNPCCrew
  if (!useNPCCrew) return
  const crewmodifier = 0
  const crewAPL = actor.system.details.tier + crewmodifier
  const crew = await foundry.utils.duplicate(actor.system.crew.npcData)
  //  AA:142 Adjustment Special Abilities : Increase all master and good skill bonuses by 1.
  const operativeSkillModifier = pilotOperative ? 2 : 0 // NPC Bonus for skillful and NPC Operatives Adjustments:  +1 to all skill checks
  const envoySkillModifier = captainEnvoy ? 1 : 0   // NPC Bonus for skillful Envoy

/*
Alternate gunner formulas = 
Tier < 10 Gunner = round(crewAPL * 1.25 -3.5)
Tier >= 10 Gunner = round(crewAPL * 1.45 )
https://paizo.com/starfinder/faq
*/
const gunnerSkill = crewAPL < 10?  Math.round(crewAPL * 1.25 - 3.5) : Math.round(crewAPL * 1.45) // This is the gunner modifier for NPCs, it is based on the crewAPL and is used to calculate the gunner skill bonus.

const npcArray = [
    { tier: 0, minor: 0, major: 0, gunner: 0 },
    { tier: 1, minor: 5, major: 10, gunner: 5 },
    { tier: 2, minor: 7, major: 12, gunner: 6 },
    { tier: 3, minor: 8, major: 13, gunner: 7 },
    { tier: 4, minor: 10, major: 15, gunner: 9 },
    { tier: 5, minor: 11, major: 16, gunner: 10 },
    { tier: 6, minor: 13, major: 18, gunner: 11 },
    { tier: 7, minor: 14, major: 19, gunner: 12, },
    { tier: 8, minor: 16, major: 21, gunner: 14 },
    { tier: 9, minor: 17, major: 22, gunner: 15 },
    { tier: 10, minor: 19, major: 24, gunner: 15 },
    { tier: 11, minor: 20, major: 25, gunner: 16 },
    { tier: 12, minor: 22, major: 27, gunner: 17 },
    { tier: 13, minor: 23, major: 28, gunner: 19 },
    { tier: 14, minor: 25, major: 30, gunner: 20 },
    { tier: 15, minor: 26, major: 31, gunner: 22 },
    { tier: 16, minor: 28, major: 33, gunner: 23 },
    { tier: 17, minor: 29, major: 34, gunner: 25 },
    { tier: 18, minor: 31, major: 36, gunner: 26 },
    { tier: 19, minor: 32, major: 37, gunner: 28 },
    { tier: 20, minor: 34, major: 39, gunner: 29 }
  ]
  const skillset = {
    captain: {
      blu: "minor",
      com: "minor",
      dip: "major",
      eng: "minor",
      gun: "gunner",
      int: "minor",
      pil: "minor",

    },
    chiefMate: {
      acr: "major",
      ath: "major",

    },
    engineer: {

      eng: "major",

    },
    gunner: {
      gun: "gunner",
    },
    magicOfficer: {

      mys: "major",

    },
    pilot: {
      pil: "major"

    },
    scienceOfficer: {
      com: "major",
    }
  }

  for (let [rolekey, rolevalue] of Object.entries(skillset)) {
    for (let [skillkey, skillvalue] of Object.entries(rolevalue)) {
      // console.log(rolekey, skillkey, skillvalue,crew[rolekey])
      //  if (!crew[rolekey].skills[skillkey]) {
      crew[rolekey].skills[skillkey] = {
        isTrainedOnly: false,
        hasArmorCheckPenalty: false,
        value: 0,
        misc: 0,
        ranks: Math.floor(crewAPL * 0.75),
        ability: "int",
        subname: "",
        mod: npcArray[crewAPL].minor,
        enabled: true
      }
      //   }
    }
  }

  for (let [crewkey, crewvalue] of Object.entries(crew)) {
    if (!crewvalue.numberOfUses) continue

    for (let [skillname, skill] of Object.entries(crewvalue.skills)) {
      //   console.log(skillname, skill)
      if (skillset[crewkey][skillname] == "major") {
        skill.mod = npcArray[crewAPL].major
        skill.ranks = crewAPL
      }
      if (skillset[crewkey][skillname] == "minor") {
        skill.mod = npcArray[crewAPL].minor
        skill.ranks = Math.floor(crewAPL * 0.9)
      }
      if (skillset[crewkey][skillname] == "gunner") {
        skill.mod = npcArray[crewAPL].gunner
        skill.ranks = crewAPL
      }

      if (pilotOperative && (crewkey == "pilot")) {
        crewvalue.skills[skillname].mod = npcArray[crewAPL].major + operativeSkillModifier
      }
      if (captainEnvoy && (crewkey == "captain") && (["dip", "int", "blu"].includes(skillname))) {
        crewvalue.skills[skillname].mod = npcArray[crewAPL].major + envoySkillModifier
      }
      skill.ranks = crewAPL

    }
  }
  console.log(crew, actor)

  actor.update({ "system.crew.npcData": crew }).then(() => {
    ui.notifications.info("NPC Crew Skills Updated", { permanent: true, localize: true });
    //  console.log("Crew Updated")
    // actor.sheet.render(true)
  })


  /**
   * AA P127
   * EVERYTHING IS OPTIONAL
   * When creating an NPC, you are free to enact whatever changes you need to in order to make your creation work the way you intend. For example, an array might tell you to select two special abilities, but you know you need four—or only one. Go ahead and make the change! 
   * If you want your combatant NPC to have a really high AC but not many Hit Points, you can increase its AC by 1 and use the expert array’s HP. This doesn’t make the statistics wrong; rather, it helps the statistics match your concept. Creating NPCs is fundamentally a creative process, so while these steps are useful to keep the NPC’s capabilities from going too far astray for its CR, don’t treat them as hard restrictions
   * 
   * 
   */

}