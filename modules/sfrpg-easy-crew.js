
import { SEC } from "./npcdata.js"

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
  const actor = app.actor;

  if ((actor.type === "starship")) {
    const middleColumn = html.find(".crew-settings.flexrow");
    const shipAttributes = html.first(".flexcol.traits");
    const button = '<div class="NPCSETSKILL" data-id = "' + id + '"data-type = "' + type + '"> <button type="button"> Set NPC Skills</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    const buttonRepair = '<div class="repairship" data-id = "' + id + '"data-type = "' + type + '"> <button type="button"> Repair Ship</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    if (actor.system.crew.useNPCCrew) middleColumn.find(".settings.flexrow").append(button);
    // middleColumn.find(".settings.flexrow").append(buttonRepair);
    shipAttributes.find(".flexcol.traits").eq(0).find(".flexrow").find(".flexcol").find("div").append(buttonRepair);
    html.find(".NPCSETSKILL").click(onSetNPCSkills.bind(html));
    html.find(".repairship").click(onRepairShip.bind(html));
  }
  if (["npc", "npc2"].includes(actor.type)) {
    const tokenid = actor.token ? actor.token.id : "null";
    const skillList = html.find(".skills-list");
    //  console.log("Skills List:", app);
    const HPButton = '<hr style="border: 2px solid black;"> <div>Reset NPC for altered CR </div><div class="sms-setmaxhp" data-tooltip="SEC - Set the HP for this NPC" data-id = "' + actor.id + '" data-token = "' + actor.isToken + '" data-tokenid = "' + tokenid + '"> <button type="button">Set NPC Attributes</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    skillList.append(HPButton);
    const attButton = '<div class="sms-setattacks" data-tooltip="SEC - Set the Attacks for this NPC" data-id = "' + actor.id + '" data-token = "' + actor.isToken + '" data-tokenid = "' + tokenid + '"> <button type="button"> Set NPC Weapons</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    skillList.append(attButton);
    html.find(".sms-setmaxhp").click(setNPC.bind(html));
    html.find(".sms-setattacks").click(setAttacks.bind(html));


  }
})
async function setAttacks(event) {
  // console.log("Set NPC Attacks clicked");

  var actor
  const button = $(event.currentTarget);
  const actorId = button.data("id");
  const isToken = button.data("token");
  const tokenId = button.data("tokenid");
  const multiAttacks = [];
  // console.log("Actor ID:", actorId, "Is Token:", isToken, "Token ID:", tokenId);
  if (isToken) {
    const token = await canvas.tokens.get(tokenId);
    if (token) {
      // console.log("Token found:", token);
      actor = token.actor;
    } else {
      console.error("Token not found with ID:", tokenId);
      return;
    }
  } else {
    actor = await game.actors.get(actorId);
    if (!actor) {
      console.error("Actor not found with ID:", actorId);
      return;
    }
  }
  if (!actor.system.details.combatRole) { ui.notifications.warn("Set NPC Combat role."); return; }
  // console.log("Actor:", actor);
  const packs = game.packs.filter(p =>
    p.documentName === "Item" && (["sfrpg"].includes(p.metadata.packageName)) && (p.metadata.name === "equipment")
  );
  //  console.log("Pack:", packs);
  const compendiumweapons = [];

  for (const pack of packs) {
    try {
      const items = await pack.getDocuments({ type: "weapon" });
      compendiumweapons.push(...items);
    } catch (e) {
      console.warn(`Failed to load: ${pack.metadata.label}`, e);
    }
  }
  const meleecompendiumweapons = [] //compendiumweapons.filter(item => ["advancedM", "basicM"].includes(item.system.weaponType));
  const rangedcompendiumweapons = []
  compendiumweapons.forEach(item => {
    if (["advancedM", "basicM"].includes(item.system.weaponType)) {
      meleecompendiumweapons.push(item);
    } else {
      rangedcompendiumweapons.push(item);
    }
  });

  const upgradeItems = actor.items.contents.filter(item => {
    let flag = true
    flag = flag && ["weapon"].includes(item.type)
    // console.log("Item:", item.name, (item.parentItem ? false : true));
    flag = flag && (item.parentItem ? false : true);
    //  flag = flag && ["advancedM", "basicM", "smallA", "longA", "heavy", "sniper", "special", "solarian"].includes(item.system.weaponType)

    return flag
  });

  function calculateMaxRoll(rolltext) {
    const roll = new Roll(rolltext);
    let maxRoll = 0;
    roll.terms.forEach(element => {
      //    console.log("Roll Element:", element, element.constructor.name);
      if (element.constructor.name === "Die") maxRoll += element.number * element.faces;
      if (element.constructor.name === "NumericTerm") maxRoll += element.number || 0;
    });
    //   console.log("Max Roll:", maxRoll);
    return maxRoll;
  }
  // const affectedAtt = { str: "mwak", dex: "rwak" } // what are the boosted stats
  const stats = ["str", "dex", "con", "int", "wis", "cha"]
  stats.sort((a, b) => {
    return (actor.system.abilities[b].mod || 0) - (actor.system.abilities[a].mod || 0);
  });
  const majorStat = stats[0];
  //  console.log("Stats:", stats);
  upgradeItems.sort((a, b) => {
    return (b.system.attackBonus || 0) - (a.system.attackBonus || 0);
  });



  // console.log("Upgrade Items:", upgradeItems, SEC.NPCAttackStats[actor.system.details.combatRole][actor.system.details.cr].energy, meleecompendiumweapons);
  //cycle through and recalculate
  const itemsToDelete = [];
  const itemsToUpdate = [];
  const itemsToCreate = [];
  const multiAttackNames = ["multiatk", "multiattack"];
  upgradeItems.forEach((item, index) => {
    multiAttackNames.some(tag => item.name.toLowerCase().includes(tag)) ? multiAttacks.push(item) : null
  })

  // update Items 

  upgradeItems.forEach((item, index) => {
    item.img = item.img.includes("icons/default/") ? findNewPicture(item) : item.img;
    console.log("Updating Item:", item.name, item.img);
    const okLevel = (((item.system.level - 2) < actor.system.details.cr) && ((item.system.level + 4) > actor.system.details.cr))
    const existingCompendiumItem = item._source._stats.compendiumSource
    const isMultiAttack = multiAttackNames.some(tag => item.name.toLowerCase().includes(tag))
    const multiAttack = 6 * (isMultiAttack ? 1 : 0);

    let attackBonus = 0
    const attackStat = SEC.NPCAttackStats[actor.system.details.combatRole][actor.system.details.cr];
    const meleeW = ["advancedM", "basicM"].includes(item.system.weaponType)
    const meleeA = ["mwak", "msak"].includes(item.system.actionType)
    checkCompendium(actor, item, meleeW ? meleecompendiumweapons : rangedcompendiumweapons).then((retunData) => {

      console.log("Check Compendium Result:", retunData);

      const exact = retunData.exact
      const roots = retunData.root
      const similar = retunData.similar

      // attack bonus calculation
      if (majorStat === "str") {
        if (meleeA) {
          attackBonus = parseInt(attackStat.high) - multiAttack || 0;
        }
        else {
          attackBonus = parseInt(attackStat.low) - multiAttack || 0;
        }
      } else {
        if (meleeA) {
          attackBonus = parseInt(attackStat.low) - multiAttack || 0;
        } else {
          attackBonus = parseInt(attackStat.high) - multiAttack || 0;
        }
      }
      console.log("attackBonus:", item, attackBonus);
      console.log("Compendium Source:", item._source._stats.compendiumSource);
      console.log("isMultiAttack:", multiAttacks);

      const exactMatch = exact !== null;
      const rootMatch = roots.length > 0;
      const similarMatch = similar.length > 0;

      /***
       * The existing item is novel and has no compendium analog update the damage as per the AA
       * Mostly natural weapons
       */
      if ((!existingCompendiumItem) && (!exactMatch) && (!rootMatch)) {
        const version = game.modules.get("sfrpg-easy-crew")?.version || "1.0.0";
        const flags = { SEC: { version: version } };
        item.flags = foundry.utils.mergeObject(item.flags ?? {}, flags);
        item.system.attackBonus = attackBonus;
        item.system.damage.parts.forEach((part, index) => {
          if (index === 0) {
            part.formula = ""
            if (meleeW && isMultiAttack) {
              part.formula = multiAttacks.length > 3 ? attackStat.three : multiAttacks.length > 1 ? attackStat.four : null;
            }
            if (meleeW && (!isMultiAttack)) {
              part.formula = attackStat.standard;
            }
            if ((!meleeA) && (item.system.actionTarget === "eac")) {
              part.formula = attackStat.energy;
            }
            if ((!meleeA) && (item.system.actionTarget === "kac")) {
              part.formula = attackStat.energy;
            }
          }
        });
        item.update({
          'flags': item.flags,
          'system.attackBonus': item.system.attackBonus,
          'system.damage.parts': item.system.damage.parts,
          'img': item.img
        });
      }

      /***
       * The existing item is not from the compendium but has an exact match
       * 
       * 
       */
      if (existingCompendiumItem || exactMatch) {
        const sourceItem = exact ///existingCompendiumItem ? fromUuid(existingCompendiumItem) : exact;
        // if (sourceItem) {
        const newItem = foundry.utils.duplicate(sourceItem);
        newItem.system.attackBonus = attackBonus;
        newItem.system.ability = null;
        newItem.system.equipped = true;
        newItem.img = item.img;
        newItem.system.proficient = true;
        newItem.system.damage.parts.forEach((part, index) => {
          part.formula += (" + " + `${actor.system.details.cr}`);
          console.log("Damage Part:", part, (" + " + `${actor.system.details.cr}`));
        });
        const version = game.modules.get("sfrpg-easy-crew")?.version || "1.0.0";
        const flags = { SEC: { version: version } };
        newItem.flags = foundry.utils.mergeObject(newItem.flags ?? {}, flags);

        console.log("Updating Item from Compendium:", item.name, newItem);
        item.update({
          'name': newItem.name,
          'type': newItem.type,
          'system': newItem.system,
          'flags': newItem.flags,
          'img': newItem.img,

        });
        // }

      }

    });
    console.log("Post Flags:", item.flags, item.system);

  })

  /***
   *  if (this.type === "character" && game.settings.get("sfrpg", "autoAddUnarmedStrike")) {
              const ITEM_UUID = "Compendium.sfrpg.equipment.AWo4DU0s18agsFtJ"; // Unarmed strike
              const source = (await fromUuid(ITEM_UUID)).toObject();
              source.system.proficient = true;
              source.flags = foundry.utils.mergeObject(source.flags ?? {}, { core: { sourceId: ITEM_UUID } });
  
              updates.items = [source];
          }
  
   * 
   * 
   */
  //  console.log("All Items:", melee);

  const dmgByCR = calculateMaxRoll(SEC.NPCAttackStats[actor.system.details.combatRole][actor.system.details.cr].standard);

  console.log("Max Damage CR:", dmgByCR);
}

function findNewPicture(item) {
  // Implement your logic to find a new picture for the item
  // This is just a placeholder implementation
  let key = null
  const keywords = item.name.toLowerCase().split(" ");
  keywords.some(keyword => {
    // Implement your logic to find a new picture based on keywords
    if (keyword.endsWith("s")) {
      keyword = keyword.slice(0, -1);
    }
    if (SEC.attackImages[keyword]) {
      console.log("Keyword:", keyword);
      key = keyword
      return true
    }
  });
  if (key) return SEC.attackImages[key][Math.floor(Math.random() * SEC.attackImages[key].length)];
  const newPicture = "systems/sfrpg/icons/default/bolter-gun.svg";
  return newPicture;
}

async function checkCompendium(actor, item, weaponArray) {
  let exact = null;
  let root = [];
  let similar = [];
  let category = "uncategorized";
  weaponArray.forEach(weapon => {
    if (weapon.name.toLowerCase() === item.name.toLowerCase()) {
      exact = weapon;
      if (item.system.weaponCategory === "uncategorized") {
        item.system.weaponCategory = weapon.system.weaponCategory;
      }
    }
  })
  weaponArray.forEach(weapon => {
    if (weapon.name.split(", ")[0].trim().toLowerCase() === item.name.split(", ")[0].trim().toLowerCase()) {
      if (((weapon.system.level - 2) < actor.system.details.cr) && ((weapon.system.level + 4) > actor.system.details.cr)) {
        root.push(weapon);
      }
      return;
    }
    if ((weapon.system.weaponType === item.system.weaponType)) {
      if (weapon.system.weaponCategory === item.system.weaponCategory) {
        if (((weapon.system.level - 2) < actor.system.details.cr) && ((weapon.system.level + 4) > actor.system.details.cr)) {
          similar.push(weapon);
        }
        return;
      }
    }
  });
  return { exact, root, similar };
}
/*
"basicM": "SFRPG.WeaponTypesBasicMelee",
    "advancedM": "SFRPG.WeaponTypesAdvMelee",    "smallA": "SFRPG.WeaponTypesSmallArms",    "longA": "SFRPG.WeaponTypesLongArms",    "heavy": "SFRPG.WeaponTypesHeavy",
    "sniper": "SFRPG.WeaponTypesSniper",    "grenade": "SFRPG.WeaponTypesGrenades",    "special": "SFRPG.WeaponTypesSpecial",    "solarian": "SFRPG.WeaponTypesSolarian"
*/
async function setNPC(event) {
  console.log("Set NPC HP clicked");
  var actor
  const button = $(event.currentTarget);
  const actorId = button.data("id");
  const isToken = button.data("token");
  const tokenId = button.data("tokenid");
  console.log("Actor ID:", actorId, "Is Token:", isToken, "Token ID:", tokenId);
  if (isToken) {
    const token = await canvas.tokens.get(tokenId);
    if (token) {
      console.log("Token found:", token);
      actor = token.actor;
    } else {
      console.error("Token not found with ID:", tokenId);
      return;
    }
  } else {
    actor = await game.actors.get(actorId);
    if (!actor) {
      console.error("Actor not found with ID:", actorId);
      return;
    }
  }

  console.log("Actor:", actor);


  let templateData = {
    actor: actor,
    npctype: actor.system.details.combatRole,
    extrahp: actor.flags.sms?.extrahp || false,
    hp: actor.system.attributes.hp.value,
    maxhp: actor.system.attributes.hp.max,
    gmnotes: actor.system.gmnotes || "",
    name: actor.name
  }

  //  console.log(templateData)


  const content = await renderTemplate("modules/sell-my-shit/templates/set-npc-hp.html", templateData);



  const updateNPCHP = async (data) => {
    const hp = foundry.utils.duplicate(templateData.actor.system.attributes.hp);
    if (templateData.npctype) {
      const maxhp = SEC.HP[templateData.npctype][templateData.actor.system.details.cr];
      hp.max = maxhp;
      hp.value = maxhp;
      if (templateData.extrahp) {
        hp.max += Math.floor(hp.max * 0.2);
        hp.value += Math.floor(hp.max * 0.2);
      }
      return hp;
    }
    const result = await Dialog.prompt({
      title: "Set NPC Max HP",
      content: content,
      label: "Set Max HP",
      callback: (html, s) => {

        const form = html[0].querySelector("form");
        let formDataExtended = new FormDataExtended(form);
        foundry.utils.mergeObject(templateData, formDataExtended.object);
        console.log(templateData, formDataExtended);

        if (templateData.npctype) {
          const maxhp = SEC.HP[templateData.npctype][templateData.actor.system.details.cr];
          hp.max = maxhp;
          hp.value = maxhp;
          if (templateData.extrahp) {
            hp.max += Math.floor(hp.max * 0.2);
            hp.value += Math.floor(hp.max * 0.2);
          }
        }
        else {
          hp.value = hp.max;
        }

        //hp.tooltip = ["Set to Max HP"];



        //  actor.update({ "system.attributes.hp": hp });
      }
    });
    return hp;
  };
  updateNPCHP(templateData).then((reply) => {

    actor.update({

      "system.attributes.hp.max": reply.max,
      "system.attributes.hp.value": reply.value,
      "system.details.combatRole": templateData.npctype,
      "flags.sms.extrahp": templateData.extrahp === "extrahp" ? true : false,
    }).then(() => {
      //  console.log(`HP Updated`, templateData);
      setNPCAbilities(actor);
    });
  });
}

async function setNPCAbilities(actor) {
  const stats = ["str", "dex", "con", "int", "wis", "cha"]
  const skills = [];
  let expertskillvalue = 0
  let goodskillvalue = 0
  const newSkills = foundry.utils.duplicate(actor.system.skills)
  const skillmaster = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].skillmaster;
  const skillgood = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].skillgood;
  for (let [key, value] of Object.entries(newSkills)) {
    skills.push({ key: key, value: foundry.utils.duplicate(value) })
  }
  // Sort by name (ascending), then age (ascending), then score (descending)
  skills.sort((a, b) => {

      if (a.value.enabled && !b.value.enabled) {
      return -1; // a comes first
    }
    if (!a.value.enabled && b.value.enabled) {
      return 1; // b comes first
    }
        if (a.value.mod !== b.value.mod) {
      return b.value.mod - a.value.mod; // Sort by mod descending
    }
    if (actor.system.abilities[a.value.ability].mod !== actor.system.abilities[b.value.ability].mod) {
      return actor.system.abilities[b.value.ability].mod - actor.system.abilities[a.value.ability].mod; // Sort by ability numerically
    }

    return Math.floor(Math.random() * 100) - 30; // equal
  });

  skills.forEach((skill, index) => {
    newSkills[skill.key].mod = 0
    if (index < skillmaster.num) {
      newSkills[skill.key].mod = skillmaster.mod
          newSkills[skill.key].tooltip[0] = 'Skill Ranks: +' + newSkills[skill.key].mod
    } else if (index < (skillmaster.num + skillgood.num)) {
      newSkills[skill.key].mod = skillgood.mod
          newSkills[skill.key].tooltip[0] = 'Skill Ranks: +' + newSkills[skill.key].mod
    } else {
      newSkills[skill.key].mod = actor.system.abilities[skill.value.ability].mod
          newSkills[skill.key].tooltip[0] = 'Skill Ranks: + 0'
    }
    newSkills[skill.key].ranks = newSkills[skill.key].mod

  });

  console.log("Sorted Skills:", skills, newSkills);

  const eac = foundry.utils.duplicate(actor.system.attributes.eac)
  const kac = foundry.utils.duplicate(actor.system.attributes.kac)
  const fort = foundry.utils.duplicate(actor.system.attributes.fort)
  const reflex = foundry.utils.duplicate(actor.system.attributes.reflex)
  const will = foundry.utils.duplicate(actor.system.attributes.will)
  stats.sort((a, b) => {
    return (actor.system.abilities[b].mod || 0) - (actor.system.abilities[a].mod || 0);
  });
  const abilityScores = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].modifiers;
  const abilities = foundry.utils.duplicate(actor.system.abilities);
  eac.value = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].eac;
  kac.value = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].kac;
  fort.value = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].fort;
  reflex.value = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].ref;
  will.value = SEC.NPCMainStats[actor.system.details.combatRole][actor.system.details.cr].wil;

  eac.base = eac.value;
  kac.base = kac.value;
  fort.base = fort.value;
  reflex.base = reflex.value;
  will.base = will.value;

  abilities[stats[0]].mod = abilityScores[0];
  abilities[stats[0]].base = abilityScores[0];
  abilities[stats[1]].mod = abilityScores[1];
  abilities[stats[1]].base = abilityScores[1];
  abilities[stats[2]].mod = abilityScores[2];
  abilities[stats[2]].base = abilityScores[2];


  actor.update({
    "system.skills": newSkills,
    "system.abilities": abilities,
    "system.attributes.eac": eac,
    "system.attributes.kac": kac,
    "system.attributes.fort": fort,
    "system.attributes.reflex": reflex,
    "system.attributes.will": will
  }).then(() => {
    //  console.log("NPC Abilities Updated", actor);
  });
}


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

  for (let [a, b] of Object.entries(newQuadrants)) {
    //   console.log(a,b)

    b.shields.value = evenShield
    if (a == "forward") {
      b.shields.value += leftoverShield // Add any leftover shields to the fore quadrant
    }
  }

  for (let [name, system] of Object.entries(newSystems)) {
    system.value = 'nominal'

  }
  actor.update({ "system.attributes.hp.value": actor.system.attributes.hp.max })
  actor.update({ "system.attributes.systems": newSystems }) // Update the systems to nominal status
  console.log("New Quadrants", newQuadrants, "New Systems", newSystems)

  //actor.sheet.close() // Close the sheet before updating
  actor.update({ "system.quadrants": newQuadrants }).then(() => {
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
  const gunnerSkill = crewAPL < 10 ? Math.round(crewAPL * 1.25 - 3.5) : Math.round(crewAPL * 1.45) // This is the gunner modifier for NPCs, it is based on the crewAPL and is used to calculate the gunner skill bonus.

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