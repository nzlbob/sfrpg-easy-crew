import { SEC } from "./npcdata.js"

export async function optimiseShip(event) {
  // Example optimization: Sort crew by skill level (assuming each crew member has a 'skill' property)
  const compendiumStarshipParts = await getCompendiumItems();
  console.log("Compendium Starship Parts:", compendiumStarshipParts);
  event.preventDefault(); // Prevent the default form submission behavior
  const element = event.currentTarget;
  const id = element.dataset.id;
  const type = element.dataset.type;
  const actor = type === "token" ? canvas.tokens.get(id).actor : game.actors.get(id);
  console.log("Optimise Ship clicked", actor, id, type);

  const items = actor.items.contents.filter(i => i.type.startsWith("starship"));
  console.log("items:", items);
  let frame = null
  items.some(i => {
 //   console.log("Item:", i);
    if (i.type === "starshipFrame") {
      frame = i;

   //   console.log("Deleted Frame:", frame);
      // return true; // Exit the loop early
    }
  })
  const starshipItems = [];
  actor.items.contents.forEach(i => {
    console.log("Item:", i.type, i.name);
    if (i.type.startsWith("starship")) {
      starshipItems.push(i.id);
    }
  });


  frame ? await actor.deleteEmbeddedDocuments("Item", starshipItems) : null;
  // console.log("frame:", frame);

  ui.notifications.error("No starship frame found on this actor.");
  frame = await findSuitableFrame(actor, compendiumStarshipParts.frames);
  const thruster = findSuitableThruster(frame.system.size, compendiumStarshipParts.thrusters);
  const armor = findSuitableArmor(actor.system.details.tier, compendiumStarshipParts.armor);
  const shield = findSuitableShield(actor.system.attributes.bp.max, compendiumStarshipParts.shields);
  const defense = findSuitableDefense(actor.system.details.tier, compendiumStarshipParts.defenses);
  const driftEngine = findSuitableDriftEngine(actor.system.details.tier, compendiumStarshipParts.driftEngines);
  const sensor = findSuitableSensor(actor.system.details.tier, compendiumStarshipParts.sensors);
  const computer = findSuitableComputer(actor.system.details.tier, compendiumStarshipParts.computers);
  const weapons = findSuitableWeapon(actor, compendiumStarshipParts.weapons, frame.system.weaponMounts);


  console.log("Suitable weapons found:", ...weapons);

  //return;

  // console.log("Suitable thruster found:", ...thruster);
  // console.log("Suitable armor found:", ...armor);
  // console.log("Suitable shield found:", ...shield);
  //actor.createEmbeddedDocuments("Item", [frame]);
  await actor.createEmbeddedDocuments("Item", [frame, ...thruster, ...armor, ...shield, ...defense, ...driftEngine, ...sensor, ...computer, ...weapons]);

  const powerCore = findSuitablePowerCore(actor, compendiumStarshipParts.powerCores);

  await actor.createEmbeddedDocuments("Item", powerCore);
  console.log("Frame found:", frame);

}

function findSuitablePowerCore(actor, powerCores) {
  let maxBP = Math.floor(actor.system.attributes.bp.max -  actor.system.attributes.bp.value);
  console.log("Finding power core for:", actor.system.attributes.power, powerCores);
  const sizedPowerCores = powerCores.filter(a => {
    if (a.system.cost > maxBP) return false
    if (a.system.pcu < actor.system.attributes.power.value) return false
    return true;
  }).sort((a, b) => a.system.pcu - b.system.pcu);
  console.log("Power cores found:", sizedPowerCores);
  if (sizedPowerCores.length === 0) {
    ui.notifications.error("No suitable power core found.");
    return [];
  }
  return [sizedPowerCores[0]];
}

function findSuitableWeapon(actor, weapons, weaponMounts) {
  // console.log("Finding weapon of type:", actor, weapons);
  let maxBP = Math.floor(actor.system.attributes.bp.max * SEC.buildFactors.offense);

  const mediumWeapons = weapons.filter(weapon => {
    if (!(weapon.system.weaponType === "direct")) return false
    if (!(weapon.system.class === "heavy")) return false
    if (!(["long", "medium"].includes(weapon.system.range))) return false
    if (weapon.system.special.orbital) return false

    return true;
  }).sort((a, b) => averageDamage(b.system.damage) - averageDamage(a.system.damage));
 // console.log("BP remaining:", actor.system.attributes.bp.max - actor.system.attributes.bp.value, actor.system.attributes.bp.max);
 // console.log("Max BP for weapons:", maxBP);
 // console.log("Medium weapons found:", mediumWeapons);


  console.log("Max BP for weapons:", maxBP);
//  console.log("Medium weapons found:", mediumWeapons);


  const sizedWeapons = []
  for (let i = 0; i < weaponMounts.turret.heavySlots; i++) {
    const random = Math.floor(Math.random() * 6);
    if (mediumWeapons[random].system.cost <= maxBP) {

      sizedWeapons.push(mediumWeapons[random].toObject());
      maxBP -= mediumWeapons[random].system.cost;
    }
    else {
      console.log("Not enough BP for weapon:", mediumWeapons[random].name, mediumWeapons[random].system.cost, maxBP);
      const cheapSizedWeapons = mediumWeapons.filter(a => a.system.cost <= maxBP).sort((a, b) => averageDamage(b.system.damage) - averageDamage(a.system.damage));
      if (cheapSizedWeapons.length > 0) {
        sizedWeapons.push(cheapSizedWeapons[0].toObject());
        maxBP -= cheapSizedWeapons[0].system.cost;
      sizedWeapons[sizedWeapons.length-1].system.mount.mounted = true;
      sizedWeapons[sizedWeapons.length-1].system.mount.arc = "turret";

      }
      else {
   //     console.log("No more BP for weapons:", maxBP);
        break;
      }
    }
  }
  console.log("Remaining BP for weapons:", maxBP);
 for (let i = 0; i < weaponMounts.forward.heavySlots; i++) {
    const random = Math.floor(Math.random() * 6);
    if (mediumWeapons[random].system.cost <= maxBP) {

      sizedWeapons.push(mediumWeapons[random].toObject());
      maxBP -= mediumWeapons[random].system.cost;
            sizedWeapons[sizedWeapons.length-1].system.mount.mounted = true;
      sizedWeapons[sizedWeapons.length-1].system.mount.arc = "forward";
    }
  }




  sizedWeapons[0].system.mount.mounted = true;
  sizedWeapons[0].system.mount.arc = "turret";
  // Base 14 + tier + build factor
  // let tens = Math.floor(SEC.buildFactors.weapon / 10);
  // let units = SEC.buildFactors.weapon - tens * 10;
  // console.log("Looking for weapon of size:", units, tier, SEC.buildFactors, SEC.buildFactors.weapon * tier);
  // let unitsSize = Math.max(1, Math.floor(SEC.buildFactors.weapon * tier));

  return sizedWeapons;
}

function averageDamage(damage) {
  const parts = damage.parts[0].formula.split("d");
  if (parts.length != 2) return 0;
  const numDice = parseInt(parts[0]);
  const dieType = parseInt(parts[1]);
  if (isNaN(numDice) || isNaN(dieType)) return 0;
  return numDice * (dieType + 1) / 2;

}

function findSuitableSensor(tier, sensors) {
  let unitsSize = Math.max(1, Math.floor(SEC.buildFactors.sensor * tier));
  // console.log("Looking for sensor of size:", unitsSize, tier, SEC.buildFactors, SEC.buildFactors.sensor * tier);
  const sizedSensors = sensors.filter(a => a.system.cost <= unitsSize).sort((a, b) => b.system.sensorRange - a.system.sensorRange);
  // console.log("Sensors of size", unitsSize, ":", sizedSensors);
  return [sizedSensors[0]];
}

function findSuitableComputer(tier, computers) {
  let unitsSize = Math.max(1, Math.floor(SEC.buildFactors.computer.base * tier));
  // console.log("Looking for computer of size:", unitsSize, tier, SEC.buildFactors, SEC.buildFactors.computer * tier);
  const sizedComputers = computers.filter(a => {


    return (a.system.modifier == unitsSize) && (a.system.nodes === SEC.buildFactors.computer.nodes);

  });
  // console.log("Computers of size", unitsSize, ":", sizedComputers);
  return sizedComputers;
}

function findSuitableShield(bpMax, shields) {
  let unitsSize = Math.floor(SEC.buildFactors.shields * bpMax);  // Base 14 + tier + build factor
  const sizedShields = []
  shields.forEach(t => {
    // is the thruster in budget.
    if (t.system.cost <= unitsSize) {

      if (sizedShields.length === 0) {
        sizedShields.push(t.toObject());
      }
      else if (t.system.shieldPoints > sizedShields[0].system.shieldPoints) {
        sizedShields[0] = t.toObject();
      }
    }
  });

  return sizedShields;
}


function findSuitableDriftEngine(tier, driftEngines) {
  let unitsSize = Math.floor(SEC.buildFactors.driftEngines * tier);  // Base 14 + tier + build factor
  unitsSize = 1;
  // console.log("Looking for drift engine of size:", driftEngines);
  // console.log("Looking for drift engine of size:", unitsSize, tier, SEC.buildFactors, SEC.buildFactors.driftEngines * tier);
  const sizedDriftEngines = driftEngines.filter(a => a.system.engineRating == unitsSize && a.system.cost == 2);
  sizedDriftEngines[0].system.isPowered = false

  //console.log("Drift Engines of size", sizedDriftEngines[0].system.isPowered);
  return sizedDriftEngines;
}

function findSuitableArmor(tier, armor) {
  let unitsSize = Math.floor(SEC.buildFactors.armor * tier);  // Base 14 + tier + build factor
  // console.log("Looking for armor of size:", unitsSize, tier, SEC.buildFactors, SEC.buildFactors.armor * tier);
  const sizedArmors = armor.filter(a => a.system.armorBonus == unitsSize);
  // console.log("Armors of size", unitsSize, ":", sizedArmors);
  return sizedArmors;
}

function findSuitableDefense(tier, defense) {
  let unitsSize = Math.max(1, Math.floor(SEC.buildFactors.defense * tier));  // Base 14 + tier + build factor
  // console.log("Looking for defense of size:", unitsSize, tier, SEC.buildFactors, SEC.buildFactors.defense * tier);
  const sizedDefenses = defense.filter(a => a.system.targetLockBonus == unitsSize);
  //  console.log("Defenses of size", unitsSize, ":", sizedDefenses);
  return sizedDefenses;
}

function findSuitableThruster(size, thrusters) {
  // Find a suitable frame from the actor's items or from a predefined list
  const sizedThrusters = thrusters.filter(t => t.system.supportedSize === size);
  let thruster = [];
  // let tens = Math.floor(SEC.buildFactors.thrusters / 10);
  let units = SEC.buildFactors.thrusters //- tens * 10;
  // console.log("Thrusters of size", size, ":", sizedThrusters);
  sizedThrusters.forEach(t => {
    // is the thruster in budget.
    if (thruster.length === 0) {
      thruster.push(t.toObject());
    }
    else if (t.system.speed > thruster[0].system.speed && (!(t.system.speed > units))) {
      thruster[0] = t.toObject();
    }
    /*   
   if (t.system.speed === 1000000) {
       for (let i = 0; i < tens; i++) {
         thruster.push(t.toObject());
         }
       }
       else 
       if (t.system.speed === units) {
         thruster.push(t.toObject());
   
       }
   */
  });
  return thruster;
}

async function findSuitableFrame(actor, frames) {
  const regexA = /AA\d+/g; // Matches "AA" followed by "X" and one or more digits
  const regexB = /AA \d+/g;
  let frame = null
  frames.forEach(f => {
    //  console.log("Checking frame:", f);

    const matches = [...f.system.source.matchAll(regexA)]; // Use matchAll to get all matches with details
    matches.push(...[...f.system.source.matchAll(regexB)]);
    // Ignore anything that is from the Alien Archive. It's not a ship frame.
    if (matches.length > 0 || !f.system.cost) {
      //   console.log("AA Item:", f.name, f.system.source);
      return; // No matches found, skip this iteration
    }

    // is the frame in budget.
    if ((f.system.cost < (actor.system.attributes.bp.max * SEC.buildFactors.frameCost))) {
      //   console.log("Affordable frame found:", f.name, f.system);
      if (!frame) {
        frame = f;
        // console.log("New frame found:", frame.system.cost, f.system.cost, frame.name);
        // find affordable frame with highest hitpoints.
      } else if (f.system.hitpoints.base > frame.system.hitpoints.base) {
        frame = f;
        // console.log("New best frame found:", frame.system.cost, f.system.cost, frame.name);
      }

    }

  })
  console.log("Current best frame:", frame.name);

  return await upGradeFrame(frame.toObject());

  // Find a suitable frame from the actor's items or from a predefined list
  return frame;
}
async function upGradeFrame(frame) {
  if (!frame) return null;


  frame.name = `${frame.name} (Upgraded)`;
  let maxBP = Math.floor(frame.system.cost * SEC.buildFactors.frameUpgrade);
  console.log("Max BP for upgrade:", maxBP, frame.system.cost, SEC.buildFactors.frameUpgrade);
  const addNewLight = 3
  const upgradetoHeavy = 6

  for (let i = 1; i < SEC.buildFactors.sizeFactors[frame.system.size].arcLimit; i++) {
    // figure out how many light weapon slots can be upgraded to heavy weapon slots.
    if (["medium", "large", "huge", "gargantuan", "colossal"].includes(frame.system.size)) {

      // Add new turret slots if there are none and there is budget.
      if (frame.system.weaponMounts.turret.lightSlots === 0 && maxBP >= addNewLight) {
        frame.system.weaponMounts.turret.lightSlots++
        frame.system.cost += addNewLight;
        maxBP -= addNewLight
        console.log("Adding light weapon turret slot", i,frame.system.weaponMounts.turret.lightSlots);
        frame.system.description.value += `<p>Added light weapon turret slot ${i} for ${addNewLight} BP</p>`;
      }
      // Upgrade light weapon slots to heavy weapon slots if there is budget.
      if (frame.system.weaponMounts.turret.lightSlots > 0 && maxBP >= upgradetoHeavy) {
        frame.system.weaponMounts.turret.lightSlots--
        console.log("Upgrading light weapon turret slot to heavy weapon slot", i,frame.system.weaponMounts.turret.lightSlots);
        frame.system.weaponMounts.turret.heavySlots++
        frame.system.cost += upgradetoHeavy;
        maxBP -= upgradetoHeavy
        frame.system.description.value += `<p>Upgraded light weapon turret slot ${i} to heavy weapon slots for ${upgradetoHeavy} BP</p>`;
      }


    }

  }



  return frame;
}

async function getCompendiumItems() {
  console.log("This is a static function");


  const packs = game.packs.filter(p =>
    p.documentName === "Item" && (["sfrpg"].includes(p.metadata.packageName)) && (p.metadata.name.startsWith("starship"))
  );
  //  console.log("Pack:", packs);
  const compendiumFrames = [];
  const compendiumThrusters = [];
  const compendiumArmor = [];
  const compendiumShields = [];
  const compendiumDefense = [];
  const compendiumDriftEngines = [];
  const compendiumSensors = [];
  const compendiumComputers = [];
  const compendiumHWeapons = [];
  const compendiumPowerCores = [];


  for (const pack of packs) {
    try {
      const frame = await pack.getDocuments({ type: "starshipFrame" });
      compendiumFrames.push(...frame);

      const thruster = await pack.getDocuments({ type: "starshipThruster" });
      compendiumThrusters.push(...thruster);

      const armor = await pack.getDocuments({ type: "starshipArmor" });
      compendiumArmor.push(...armor);

      const shield = await pack.getDocuments({ type: "starshipShield" });
      compendiumShields.push(...shield);

      const defense = await pack.getDocuments({ type: "starshipDefensiveCountermeasure" });
      compendiumDefense.push(...defense);

      const driftEngines = await pack.getDocuments({ type: "starshipDriftEngine" });
      compendiumDriftEngines.push(...driftEngines);

      const sensors = await pack.getDocuments({ type: "starshipSensor" });
      compendiumSensors.push(...sensors);

      const computers = await pack.getDocuments({ type: "starshipComputer" });
      compendiumComputers.push(...computers);

      const weapons = await pack.getDocuments({ type: "starshipWeapon" });
      compendiumHWeapons.push(...weapons);

      const powerCores = await pack.getDocuments({ type: "starshipPowerCore" });
      compendiumPowerCores.push(...powerCores);

    } catch (e) {
      console.warn(`Failed to load: ${pack.metadata.label}`, e);
    }
  }
  const starshipParts = {
    frames: compendiumFrames,
    thrusters: compendiumThrusters,
    armor: compendiumArmor,
    shields: compendiumShields,
    defenses: compendiumDefense,
    driftEngines: compendiumDriftEngines,
    sensors: compendiumSensors,
    computers: compendiumComputers,
    weapons: compendiumHWeapons,
    powerCores: compendiumPowerCores
  };
  return starshipParts;

}
