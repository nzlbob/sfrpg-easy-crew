
import { SEC } from "./npcdata.js"
import { optimiseShip } from "./optimiseShip.js";


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
console.log("SFRPG Easy Crew Module Initialized",CONFIG);
CONFIG.SFRPG.combatRoles = {
    "trap": "SEC.CombatRoles.Trap",
    "combatant": "SFRPG.CombatRoles.Combatant",
    "expert": "SFRPG.CombatRoles.Expert",
    "spellcaster": "SFRPG.CombatRoles.Spellcaster"
};

CONFIG.SFRPG.combatRolesDescriptions = {
  "trap": "SFRPG.CombatRoles.Descriptions.Trap",
    "combatant": "SFRPG.CombatRoles.Descriptions.Combatant",
    "expert": "SFRPG.CombatRoles.Descriptions.Expert",
    "spellcaster": "SFRPG.CombatRoles.Descriptions.Spellcaster"
};

CONFIG.SFRPG.combatRoleImages = {
  "trap": "modules/sfrpg-easy-crew/images/tokens/Square Pit.webp",
    "combatant": "systems/sfrpg/images/cup/gameplay/combatant.webp",
    "expert": "systems/sfrpg/images/cup/gameplay/expert.webp",
    "spellcaster": "systems/sfrpg/images/cup/gameplay/spellcaster.webp"
};


});

Hooks.on("ready", function () {
  //  console.log("This code runs once core initialization is ready and game data is available.");

  /*
sfrpg.config.combatRoles = {
    "trap": "SFRPG.CombatRoles.Trap",
    "combatant": "SFRPG.CombatRoles.Combatant",
    "expert": "SFRPG.CombatRoles.Expert",
    "spellcaster": "SFRPG.CombatRoles.Spellcaster"
};

sfrpg.config.combatRolesDescriptions = {
  "trap": "SFRPG.CombatRoles.Descriptions.Trap",
    "combatant": "SFRPG.CombatRoles.Descriptions.Combatant",
    "expert": "SFRPG.CombatRoles.Descriptions.Expert",
    "spellcaster": "SFRPG.CombatRoles.Descriptions.Spellcaster"
};

sfrpg.config.combatRoleImages = {
  "trap": "systems/sfrpg/images/cup/gameplay/trap.webp",
    "combatant": "systems/sfrpg/images/cup/gameplay/combatant.webp",
    "expert": "systems/sfrpg/images/cup/gameplay/expert.webp",
    "spellcaster": "systems/sfrpg/images/cup/gameplay/spellcaster.webp"
};*/
  // Ensure default Starship Chase lists exist for Obstacles and Environmental Effects
  ensureChaseLists().catch(e => console.warn("SEC Chase: ensureChaseLists failed", e));
  // Wire journal roll buttons when journals render
  Hooks.on("renderJournalSheet", (app, html) => {
    html.on("click", ".sec-chase-roll", onChaseRollClick);
    html.on("click", ".sec-chase-outcome", onChaseOutcomeClick);
  });
  // Add Scene Config tab for Starship Chase generator
  Hooks.on("renderSceneConfig", (app, html) => injectChaseTab(app, html));
});

Hooks.on("renderActorSheet", (app, html, data) => {
  const type = app.actor.isToken ? "token" : "actor"
  const id = app.actor.isToken ? app.token.id : app.actor.id
  const actor = app.actor;

  if ((actor.type === "starship")) {

    // const weapons = html.querySelector('.tab.weapons.flexcol');

    const weapons = html.find(".tab.weapons.flexcol");



    const row = weapons[0].querySelectorAll("div.item-name.flexrow.rollable")
    for (let i = 0; i < row.length; i++) {
      const parent = row[i].parentElement
      const itemName = row[i].querySelector("h4")

      //  console.log("Item Names:", itemName)


      let itemNameText = itemName.innerText

      //  console.log("Starship Sheet Rendered", parent, weapons, row, itemName, itemNameText);

      const x = parent.dataset.itemId
      //  console.log("Starship Sheet Rendered", x);
      const item = actor.items.get(x)
      // console.log("Starship Item:", item);
      const range = item.system.range

      itemNameText = itemNameText + " " + (range ? "(" + range + ")" : "")
      itemName.innerText = itemNameText
    }
    const middleColumn = html.find(".crew-settings.flexrow");
    const shipAttributes = html.first(".flexcol.traits");
    const button = '<div class="NPCSETSKILL" data-id = "' + id + '"data-type = "' + type + '"> <button type="button"> Set NPC Skills</button> </div><div class="optimise-ship" data-id = "' + id + '"data-type = "' + type + '"> <button type="button">Optimise</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    const buttonRepair = '<div class="repairship" data-id = "' + id + '"data-type = "' + type + '"> <button type="button"> Repair Ship</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    if (actor.system.crew.useNPCCrew) middleColumn.find(".settings.flexrow").append(button);
    // middleColumn.find(".settings.flexrow").append(buttonRepair);





    //  console.log(app)
    const inCombat = game.combat ? (game.combat.combatants?.find(c => c.token?.id === app.token?.id) ? true : false) : false;
    //   console.log(`In Combat:`, inCombat, game.combat?.combatants, app.token?.id);
    if (!inCombat) {
      shipAttributes.find(".flexcol.traits").eq(0).find(".flexrow").find(".flexcol").find("div").append(buttonRepair);
    }

    /**
     * Change shield header color
     */
    const arc = ["forward", "port", "starboard", "aft"]
    const name = ["Forward", "Left", "Right", "Aft"]
    const tooltip = 'data-tooltip-direction="UP" data-tooltip= "Engineer - Divert. Power to Shields (' + Math.floor(actor.system.attributes.power.max * .05) + ')"'
    const shield = html.find(".attribute.defenses");
    //   console.log("Shield Element:", shield);

    for (let i = 0; i < 4; i++) {
      let a = shield[i].querySelector(".box-title")
      a.outerHTML = '<div ' + tooltip + ' class="flexrow attribute-name box-title"> <button class="engDivertdn" data-arc = "' + arc[i] + '" data-divert = "dn" data-id = "' + id + '"data-type = "' + type + '" type="button">-</button> <h4>' + name[i] + '</h4> <button class="engDivertup"  data-arc = "' + arc[i] + '" data-divert = "up" data-id = "' + id + '"data-type = "' + type + '" type="button">+</button></div>'
    }

    /**
     * End of shield header color change
     * 
     */

    /**
     * Bind Actions
     */

    html.find(".NPCSETSKILL").click(onSetNPCSkills.bind(html));
    html.find(".optimise-ship").click(optimiseShip.bind(html));
    html.find(".repairship").click(onRepairShip.bind(html));
    html.find(".engDivertdn").click(onDivertPower.bind(html));
    html.find(".engDivertup").click(onDivertPower.bind(html));
  }
  if (["npc", "npc2"].includes(actor.type)) {
    const tokenid = actor.token ? actor.token.id : "null";
    const skillList = html.find(".skills-list");
    //  console.log("Skills List:", app);
    const HPButton = '<hr style="border: 2px solid black;"> <div>Reset NPC for altered CR </div><div class="sms-setmaxhp" data-tooltip="SEC - Set the HP for this NPC" data-id = "' + actor.id + '" data-token = "' + actor.isToken + '" data-tokenid = "' + tokenid + '"> <button type="button">Set NPC Attributes</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    skillList.append(HPButton);
    const attButton = '<div class="sms-setattacks" data-tooltip="SEC - Set the Attacks for this NPC" data-id = "' + actor.id + '" data-token = "' + actor.isToken + '" data-tokenid = "' + tokenid + '"> <button type="button"> Set NPC Weapons</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    skillList.append(attButton);
    const imgButton = '<div class="sms-copyImage" data-tooltip="SEC - Copy Image for this NPC" data-id = "' + actor.id + '" data-token = "' + actor.isToken + '" data-tokenid = "' + tokenid + '"> <button type="button"> Copy NPC Image</button> </div>'//  $(`<button class="npc-button" title="NPC"><i class="fas fa-dollar-sign"></i></button>`);
    skillList.append(imgButton);
    html.find(".sms-setmaxhp").click(setNPC.bind(html));
    html.find(".sms-setattacks").click(setAttacks.bind(html));
    html.find(".sms-copyImage").click(copyImage.bind(html));

  }
})

// -------------------------
// Starship Chase Generator
// -------------------------

const SEC_CHASE = {
  folderName: "SEC Chase",
  obstaclesJournal: "SEC Chase: Obstacles",
  effectsJournal: "SEC Chase: Environmental Effects",
  chasesFolder: "SEC Chases"
};

async function ensureChaseLists() {
  const worldUserIsGM = game.user?.isGM;
  if (!worldUserIsGM) return; // Only GMs seed content

  let chaseFolder = game.folders?.getName?.(SEC_CHASE.folderName) || game.folders?.find?.(f => f.type === "JournalEntry" && f.name === SEC_CHASE.folderName);
  if (!chaseFolder) {
    chaseFolder = await Folder.create({ name: SEC_CHASE.folderName, type: "JournalEntry" });
  }

  // Obstacles
  let obstaclesJE = game.journal.getName?.(SEC_CHASE.obstaclesJournal) || game.journal.find?.(j => j.name === SEC_CHASE.obstaclesJournal);
  if (!obstaclesJE) {
    const obstacles = getDefaultObstacles();
    const content = renderObstacleListContent(obstacles);
    obstaclesJE = await JournalEntry.create({
      name: SEC_CHASE.obstaclesJournal,
      folder: chaseFolder?.id,
      pages: [{ name: "Obstacles", type: "text", text: { content, format: 1 } }],
      flags: { "sfrpg-easy-crew": { obstacles } }
    });
  }

  // Environmental Effects
  let effectsJE = game.journal.getName?.(SEC_CHASE.effectsJournal) || game.journal.find?.(j => j.name === SEC_CHASE.effectsJournal);
  if (!effectsJE) {
    const effects = getDefaultEffects();
    const content = renderEffectsListContent(effects);
    effectsJE = await JournalEntry.create({
      name: SEC_CHASE.effectsJournal,
      folder: chaseFolder?.id,
      pages: [{ name: "Effects", type: "text", text: { content, format: 1 } }],
      flags: { "sfrpg-easy-crew": { effects } }
    });
  }
}

function getDefaultObstacles() {
  return [
    { name: "Arcane Warp", roles: ["Magic Officer"], failure: "Next chase action check takes –2." },
    { name: "Debris Cloud", roles: ["Gunner", "Pilot"], failure: "Take 1 hit." },
    { name: "Electromagnetic Interference", roles: ["Engineer", "Science Officer"], failure: "Next Engineer or Science Officer check –2." },
    { name: "Emplacement", roles: ["Engineer", "Gunner", "Pilot", "Science Officer"], failure: "Take 1 hit." },
    { name: "Energy Spike", roles: ["Chief Mate", "Engineer"], failure: "Take 1 hit." },
    { name: "False Alarm", roles: ["Captain", "Chief Mate"], failure: "Next chase action check –1." },
    { name: "Geyser", roles: ["Pilot", "Science Officer"], failure: "Take 1 hit." },
    { name: "Hangers On", roles: ["Chief Mate", "Engineer"], failure: "Next Piloting check –2." },
    { name: "Local Intervention", roles: ["Captain"], failure: "Next chase action check –2." },
    { name: "Magical Anomaly", roles: ["Magic Officer"], failure: "Next Magic Officer check –2." },
    { name: "Misdirection", roles: ["Captain"], failure: "Next chase action check –2." },
    { name: "Narrow Pass", roles: ["Gunner", "Pilot"], failure: "Take 1 hit." },
    { name: "Offensive Spell", roles: ["Magic Officer"], failure: "Next chase action check –2." },
    { name: "Rogue Meteoroid", roles: ["Gunner", "Magic Officer", "Pilot"], failure: "Take 1 hit." },
    { name: "Stall", roles: ["Chief Mate", "Engineer"], failure: "Next Piloting check –2." },
    { name: "Turbulence", roles: ["Pilot"], failure: "Next Chief Mate, Gunner, or Magic Officer check –2." }
  ];
}

function getDefaultEffects() {
  return [
    { name: "Amateur Opponent", effect: "Evaluate Weakness grants 3 successes instead of 2." },
    { name: "Cloud Cover", effect: "Failing Environmental Cover does not cause a hit." },
    { name: "Incorporeal Opponent", effect: "Create Obstacle and Environmental Cover DCs +5." },
    { name: "Innocent Bystanders", effect: "Negotiate Obstruction DC +5." },
    { name: "Magic-Dampening Field", effect: "Magic Officer checks DC +5." },
    { name: "Post-Combat Chase", effect: "Chase starts at half hit threshold (rounded down)." },
    { name: "Sabotaged Engine", effect: "Failing Outspeed results in 1 hit." },
    { name: "Seasoned Bounty Hunter", effect: "Outmaneuver DC +5." },
    { name: "Swarming Ships", effect: "Covering Fire DC +5." },
    { name: "Volatile Atmosphere", effect: "Taking Covering Fire causes 1 hit to firing ship." }
  ];
}

function renderObstacleListContent(list) {
  const items = list.map(o => `<li><b>${o.name}</b> — Roles: ${o.roles.join(", ")}. Failure: ${o.failure}</li>`).join("");
  return `<h2>Starship Chase Obstacles</h2><p>Edit via Scene Config tab or update this journal's flags.</p><ul>${items}</ul>`;
}

function renderEffectsListContent(list) {
  const items = list.map(e => `<li><b>${e.name}</b> — ${e.effect}</li>`).join("");
  return `<h2>Environmental Effects</h2><p>Select effects in Scene Config before generating a chase.</p><ul>${items}</ul>`;
}

function readObstaclesFromJournal() {
  const je = game.journal.getName?.(SEC_CHASE.obstaclesJournal) || game.journal.find?.(j => j.name === SEC_CHASE.obstaclesJournal);
  const fallback = getDefaultObstacles();
  const fromFlags = je?.flags?.["sfrpg-easy-crew"]?.obstacles;
  if (Array.isArray(fromFlags) && fromFlags.length) return fromFlags;
  return fallback;
}

function readEffectsFromJournal() {
  const je = game.journal.getName?.(SEC_CHASE.effectsJournal) || game.journal.find?.(j => j.name === SEC_CHASE.effectsJournal);
  const fallback = getDefaultEffects();
  const fromFlags = je?.flags?.["sfrpg-easy-crew"]?.effects;
  if (Array.isArray(fromFlags) && fromFlags.length) return fromFlags;
  return fallback;
}

function injectChaseTab(app, html) {
  try {
    const nav = html.find(".sheet-tabs").first();
    const body = html.find(".tab[data-tab]").last().parent();
    if (!nav.length || !body.length) return;

    // Add tab header
    const tabId = "sec-chase";
    if (!nav.find(`[data-tab="${tabId}"]`).length) {
      nav.append(`<a class="item" data-tab="${tabId}"><i class="fas fa-rocket"></i> Starship Chase</a>`);
    }

    // Build tab content
    const obstacles = readObstaclesFromJournal();
    const effects = readEffectsFromJournal();

    const effectsOptions = effects.map(e => `<option value="${e.name}">${e.name}</option>`).join("");
    const obstaclesRows = obstacles.map((o, i) => `
      <tr>
        <td><input type="text" value="${o.name}" data-idx="${i}" class="sec-ob-name"/></td>
        <td><input type="text" value="${o.roles.join(', ')}" data-idx="${i}" class="sec-ob-roles"/></td>
        <td><input type="text" value="${o.failure}" data-idx="${i}" class="sec-ob-failure"/></td>
        <td><button type="button" class="sec-ob-remove" data-idx="${i}">Remove</button></td>
      </tr>`).join("");
    const effectsRows = effects.map((e, i) => `
      <tr>
        <td><input type="text" value="${e.name}" data-idx="${i}" class="sec-ef-name"/></td>
        <td><input type="text" value="${e.effect}" data-idx="${i}" class="sec-ef-effect"/></td>
        <td><button type="button" class="sec-ef-remove" data-idx="${i}">Remove</button></td>
      </tr>`).join("");
    const content = `
    <div class="tab" data-tab="${tabId}">
      <div class="form-group">
        <label>Average Party Level (APL)</label>
        <input type="number" name="sec-apl" value="${Math.max(1, Math.min(20, game.settings.get("core", "levels") || 5))}" min="1" max="20"/>
      </div>
      <div class="form-group">
        <label>Chase Length (rounds)</label>
        <input type="number" name="sec-length" value="4" min="1" max="12"/>
      </div>
      <div class="form-group">
        <label>Environmental Effects</label>
        <select name="sec-effects" multiple size="5">${effectsOptions}</select>
      </div>
      <p>Obstacle pool: ${obstacles.length} entries (editable below or via journal "${SEC_CHASE.obstaclesJournal}").</p>
      <button type="button" class="sec-generate-chase">Generate Starship Chase Journal</button>

      <hr/>
      <details>
        <summary><b>Manage Lists</b> (GM only)</summary>
        <div style="margin-top:6px;">
          <h3>Obstacles</h3>
          <table class="sec-table" style="width:100%;">
            <thead><tr><th>Name</th><th>Roles (comma-separated)</th><th>Failure</th><th></th></tr></thead>
            <tbody class="sec-ob-tbody">${obstaclesRows}</tbody>
          </table>
          <button type="button" class="sec-ob-add">Add Obstacle</button>
        </div>
        <div style="margin-top:10px;">
          <h3>Environmental Effects</h3>
          <table class="sec-table" style="width:100%;">
            <thead><tr><th>Name</th><th>Effect</th><th></th></tr></thead>
            <tbody class="sec-ef-tbody">${effectsRows}</tbody>
          </table>
          <button type="button" class="sec-ef-add">Add Effect</button>
        </div>
        <div style="margin-top:10px;">
          <button type="button" class="sec-save-lists">Save Lists to Journals</button>
        </div>
      </details>
    </div>`;

    // Append once
    if (!body.find(`.tab[data-tab='${tabId}']`).length) body.append(content);

    // Rebind tabs so the new tab is clickable
    try { app._tabs?.forEach(t => t.bind(html[0])); } catch (e) { /* ignore */ }

    // Activate tab events
    const root = body.find(`.tab[data-tab='${tabId}']`);
    root.find(".sec-generate-chase").on("click", async () => {
      const apl = Number(root.find("input[name='sec-apl']").val()) || 1;
      const length = Number(root.find("input[name='sec-length']").val()) || 4;
      const selected = Array.from(root.find("select[name='sec-effects']")[0].selectedOptions).map(o => o.value);
      const selectedEffects = readEffectsFromJournal().filter(e => selected.includes(e.name));
      await generateChaseJournal(app.document, apl, length, selectedEffects);
    });

    // List management (GM only)
    if (game.user?.isGM) {
      root.on("click", ".sec-ob-add", () => {
        const tbody = root.find(".sec-ob-tbody");
        const i = tbody.find("tr").length;
        tbody.append(`<tr>
          <td><input type="text" value="New Obstacle" data-idx="${i}" class="sec-ob-name"/></td>
          <td><input type="text" value="Pilot" data-idx="${i}" class="sec-ob-roles"/></td>
          <td><input type="text" value="Failure text" data-idx="${i}" class="sec-ob-failure"/></td>
          <td><button type="button" class="sec-ob-remove" data-idx="${i}">Remove</button></td>
        </tr>`);
      });
      root.on("click", ".sec-ef-add", () => {
        const tbody = root.find(".sec-ef-tbody");
        const i = tbody.find("tr").length;
        tbody.append(`<tr>
          <td><input type="text" value="New Effect" data-idx="${i}" class="sec-ef-name"/></td>
          <td><input type="text" value="Effect text" data-idx="${i}" class="sec-ef-effect"/></td>
          <td><button type="button" class="sec-ef-remove" data-idx="${i}">Remove</button></td>
        </tr>`);
      });
      root.on("click", ".sec-ob-remove", (ev) => {
        $(ev.currentTarget).closest("tr").remove();
      });
      root.on("click", ".sec-ef-remove", (ev) => {
        $(ev.currentTarget).closest("tr").remove();
      });
      root.on("click", ".sec-save-lists", async () => {
        const obs = [];
        root.find(".sec-ob-tbody tr").each((_, tr) => {
          const row = $(tr);
          const name = row.find(".sec-ob-name").val();
          const roles = String(row.find(".sec-ob-roles").val() || "").split(",").map(s => s.trim()).filter(Boolean);
          const failure = row.find(".sec-ob-failure").val();
          if (name) obs.push({ name, roles, failure });
        });
        const efs = [];
        root.find(".sec-ef-tbody tr").each((_, tr) => {
          const row = $(tr);
          const name = row.find(".sec-ef-name").val();
          const effect = row.find(".sec-ef-effect").val();
          if (name) efs.push({ name, effect });
        });
        await saveChaseListsToJournals(obs, efs);
        ui.notifications.info("Starship Chase lists saved.");
      });
    }
  } catch (e) {
    console.warn("SEC Chase: injectChaseTab failed", e);
  }
}

function dcForAPL(apl) {
  const table = {
    1: { avg: 11, hard: 16 }, 2: { avg: 13, hard: 18 }, 3: { avg: 14, hard: 19 }, 4: { avg: 16, hard: 21 },
    5: { avg: 17, hard: 22 }, 6: { avg: 19, hard: 24 }, 7: { avg: 20, hard: 25 }, 8: { avg: 22, hard: 27 },
    9: { avg: 23, hard: 28 }, 10: { avg: 25, hard: 30 }, 11: { avg: 26, hard: 31 }, 12: { avg: 28, hard: 33 },
    13: { avg: 29, hard: 34 }, 14: { avg: 31, hard: 36 }, 15: { avg: 32, hard: 37 }, 16: { avg: 34, hard: 39 },
    17: { avg: 35, hard: 40 }, 18: { avg: 37, hard: 42 }, 19: { avg: 38, hard: 43 }, 20: { avg: 40, hard: 45 }
  };
  const key = Math.max(1, Math.min(20, Math.round(apl)));
  return table[key];
}

async function generateChaseJournal(scene, apl, length, selectedEffects) {
  const obstacles = [...readObstaclesFromJournal()];
  const effects = selectedEffects || [];
  const dc = dcForAPL(apl);
  const actions = selectChaseActions(length);

  // Select obstacles for rounds (avoid repeats until exhausted)
  const rounds = [];
  let pool = [...obstacles];
  for (let i = 0; i < length; i++) {
    if (pool.length === 0) pool = [...obstacles];
    const idx = Math.floor(Math.random() * pool.length);
    const ob = pool.splice(idx, 1)[0];
    rounds.push({ round: i + 1, obstacle: ob });
  }

  const effectLines = effects.map(e => `<li><b>${e.name}</b>: ${e.effect}</li>`).join("") || "<li>None</li>";
  const roundsHtml = rounds.map((r, i) => {
    const label = `Round ${r.round} — ${r.obstacle.name}`;
    const roles = r.obstacle.roles.join(", ");
    const failure = r.obstacle.failure;
    const action = actions[i];
    const obDC = computeObstacleDC(dc, r.obstacle, effects);
    const actDC = computeActionDC(dc, action.name, effects);
    const effectNotes = computePerActionNotes(action.name, effects);
    return `
    <section style="border:1px solid var(--color-border); padding:6px; margin:6px 0;">
      <h3>${label}</h3>
      <p><b>Roles:</b> ${roles}</p>
      <p><b>On Failure:</b> ${failure}</p>
      <p><b>Chase Action:</b> ${action.name}${action.note ? ` — ${action.note}` : ''}</p>
      <div>
        <button type="button" class="sec-chase-roll" data-kind="obstacle" data-round="${r.round}" data-dc="${obDC.avg}" data-label="${r.obstacle.name} (Obstacle)">Roll Obstacle (Avg DC ${obDC.avg}${obDC.adj ? `, ${obDC.adj}` : ''})</button>
        <button type="button" class="sec-chase-roll" data-kind="obstacle-hard" data-round="${r.round}" data-dc="${obDC.hard}" data-label="${r.obstacle.name} (Obstacle Hard)">Roll Obstacle (Hard DC ${obDC.hard}${obDC.adj ? `, ${obDC.adj}` : ''})</button>
      </div>
      <div style="margin-top:4px;">
        <button type="button" class="sec-chase-roll" data-kind="action" data-round="${r.round}" data-dc="${actDC.avg}" data-label="${action.name}">Roll ${action.name} (Avg DC ${actDC.avg}${actDC.adj ? `, ${actDC.adj}` : ''})</button>
        <button type="button" class="sec-chase-roll" data-kind="action-hard" data-round="${r.round}" data-dc="${actDC.hard}" data-label="${action.name} (Hard)">Roll ${action.name} (Hard DC ${actDC.hard}${actDC.adj ? `, ${actDC.adj}` : ''})</button>
      </div>
      ${effectNotes ? `<div style="margin-top:4px; font-size:0.9em; color: var(--color-text-light-6);"><i class="fas fa-info-circle"></i> ${effectNotes}</div>` : ''}
    </section>`;
  }).join("");

  const header = `
  <h1>Starship Chase</h1>
  <p><b>Scene:</b> ${scene.name} | <b>APL:</b> ${apl} | <b>Length:</b> ${length} rounds</p>
  <h2>Environmental Effects</h2>
  <ul>${effectLines}</ul>
  <button type="button" class="sec-chase-outcome">Outcome Helper</button>
  <hr/>`;

  const content = header + roundsHtml;

  // Ensure destination folder exists
  let destFolder = game.folders?.getName?.(SEC_CHASE.chasesFolder) || game.folders?.find?.(f => f.type === "JournalEntry" && f.name === SEC_CHASE.chasesFolder);
  if (!destFolder) destFolder = await Folder.create({ name: SEC_CHASE.chasesFolder, type: "JournalEntry" });

  const name = `Starship Chase - ${scene.name} - ${new Date().toLocaleString()}`;
  const je = await JournalEntry.create({ name, folder: destFolder?.id, pages: [{ name: "Chase", type: "text", text: { content, format: 1 } }], flags: { "sfrpg-easy-crew": { apl, length, effects } } });
  await je?.sheet?.render(true);
  ui.notifications.info(`Created Starship Chase journal: ${name}`);
}

async function onChaseRollClick(event) {
  event.preventDefault();
  const btn = event.currentTarget;
  const dc = Number(btn.dataset.dc) || 0;
  const label = btn.dataset.label || "Chase Check";
  const kind = btn.dataset.kind || "check";

  const content = `<div class="form-group"><label>Modifier</label><input type="number" name="mod" value="0"/></div>`;
  new Dialog({
    title: `${label} — DC ${dc}`,
    content,
    buttons: {
      roll: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Roll",
        callback: async (html) => {
          const mod = Number(html.find("input[name='mod']").val()) || 0;
          const r = await (new Roll("1d20 + @mod", { mod })).evaluate({ async: true });
          const flavor = `${label} — ${kind.toUpperCase()} vs DC ${dc}`;
          r.toMessage({ speaker: ChatMessage.getSpeaker(), flavor });
        }
      },
      cancel: { label: "Cancel" }
    },
    default: "roll"
  }).render(true);
}

async function onChaseOutcomeClick(event) {
  event.preventDefault();
  const content = `
    <div class="form-group"><label>Length (rounds)</label><input type="number" name="len" value="6" min="1"/></div>
    <div class="form-group"><label>Successes</label><input type="number" name="succ" value="0" min="0"/></div>`;
  new Dialog({
    title: "Starship Chase Outcome",
    content,
    buttons: {
      show: {
        icon: '<i class="fas fa-flag-checkered"></i>',
        label: "Show Outcome",
        callback: (html) => {
          const len = Number(html.find("input[name='len']").val()) || 6;
          const succ = Number(html.find("input[name='succ']").val()) || 0;
          const outcome = outcomeForSuccesses(succ, len);
          const flavor = `Chase Outcome — Successes: ${succ}/${len}`;
          const msg = `<div><b>Outcome:</b> ${outcome.result}</div>
                       <div><b>SP Lost:</b> ${outcome.sp}</div>
                       <div><b>HP Lost:</b> ${outcome.hp}</div>
                       <div><b>Wrecked Systems:</b> ${outcome.systems}</div>`;
          ChatMessage.create({ content: msg, speaker: ChatMessage.getSpeaker(), flavor });
        }
      },
      cancel: { label: "Cancel" }
    },
    default: "show"
  }).render(true);
}

function outcomeForSuccesses(succ, len) {
  // Baseline is Table 2–3 for 6 rounds; scale thresholds linearly to chosen length
  const ratio = len > 0 ? succ / len : 0;
  // 5+ = Success (perfect), 4 = Success (minor losses), 3 = Failure (moderate), <=2 = Failure (severe)
  let result = "Failure"; let sp = "100%"; let hp = "100%"; let systems = 5;
  if (ratio >= 5 / 6) { result = "Success"; sp = "0%"; hp = 0; systems = 0; }
  else if (ratio >= 4 / 6) { result = "Success"; sp = "10%"; hp = "10%"; systems = 1; }
  else if (ratio >= 3 / 6) { result = "Failure"; sp = "50%"; hp = "50%"; systems = 2; }
  return { result, sp, hp, systems };
}

const CHASE_ACTIONS = [
  { name: "Covering Fire", note: "+1 success on success." },
  { name: "Create Obstacle", note: "+1 success on success." },
  { name: "Environmental Cover", note: "+1 success on success; Fail by 5+: 1 hit." },
  { name: "Evaluate Weakness", note: "Next action +2; if 1 success, becomes 2; once per chase." },
  { name: "Negotiate Obstruction", note: "+1 success on success; Fail by 5+: 1 hit." },
  { name: "Outmaneuver", note: "If next action would be 1 success, becomes 2; Fail by 5+: 1 hit." },
  { name: "Outspeed", note: "+1 success on success; Fail by 5+: cannot be selected again." }
];

function selectChaseActions(length) {
  const actions = [];
  let last = null;
  let usedEval = false;
  for (let i = 0; i < length; i++) {
    const pool = CHASE_ACTIONS.filter(a => a.name !== last && (a.name !== "Evaluate Weakness" || !usedEval));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    actions.push(pick);
    last = pick.name;
    if (pick.name === "Evaluate Weakness") usedEval = true;
  }
  return actions;
}

async function saveChaseListsToJournals(obstacles, effects) {
  let chaseFolder = game.folders?.find?.(f => f.type === "JournalEntry" && f.name === SEC_CHASE.folderName);
  if (!chaseFolder) chaseFolder = await Folder.create({ name: SEC_CHASE.folderName, type: "JournalEntry" });

  // Obstacles
  let obstaclesJE = game.journal.find?.(j => j.name === SEC_CHASE.obstaclesJournal);
  if (!obstaclesJE) {
    obstaclesJE = await JournalEntry.create({ name: SEC_CHASE.obstaclesJournal, folder: chaseFolder?.id });
  }
  const obContent = renderObstacleListContent(obstacles);
  await obstaclesJE.update({ flags: { "sfrpg-easy-crew": { obstacles } } });
  const obPage = obstaclesJE.pages?.[0];
  if (obPage) await obstaclesJE.update({ [`pages.${obstaclesJE.pages.findIndex(p => p.id === obPage.id)}.text.content`]: obContent });
  else await obstaclesJE.createEmbeddedDocuments("JournalEntryPage", [{ name: "Obstacles", type: "text", text: { content: obContent, format: 1 } }]);

  // Effects
  let effectsJE = game.journal.find?.(j => j.name === SEC_CHASE.effectsJournal);
  if (!effectsJE) {
    effectsJE = await JournalEntry.create({ name: SEC_CHASE.effectsJournal, folder: chaseFolder?.id });
  }
  const efContent = renderEffectsListContent(effects);
  await effectsJE.update({ flags: { "sfrpg-easy-crew": { effects } } });
  const efPage = effectsJE.pages?.[0];
  if (efPage) await effectsJE.update({ [`pages.${effectsJE.pages.findIndex(p => p.id === efPage.id)}.text.content`]: efContent });
  else await effectsJE.createEmbeddedDocuments("JournalEntryPage", [{ name: "Effects", type: "text", text: { content: efContent, format: 1 } }]);
}

async function onDivertPower(event) {
  // console.log("Divert Power clicked:", event);
  var actor
  const button = $(event.currentTarget);
  const actorId = button.data("id");
  const isToken = button.data("type") === "token";
  const arc = button.data("arc");
  const direction = button.data("divert") === "up" ? true : false;
  // console.log("Direction:", actorId, isToken, arc, direction);

  if (isToken) {
    const token = await canvas.tokens.get(actorId);
    if (token) {
      actor = token.actor;
    } else {
      console.error("Token not found with ID:", actorId);
      return;
    }
  } else {
    actor = await game.actors.get(actorId);
    if (!actor) {
      console.error("Actor not found with ID:", actorId);
      return;
    }
  }
  // console.log("Actor:", actor, arc);

  const power = direction ? Math.min(Math.floor(actor.system.attributes.power.max * .05), actor.system.attributes.shields.max - actor.system.attributes.shields.value) : Math.floor(actor.system.attributes.power.max * .05);
  // console.log("Power to divert:", power);
  let update = {};
  const shieldArc = "system.quadrants." + arc + ".shields.value"
  //console.log("Power to divert:", power, shieldArc,actor.system.quadrants);
  if (direction) {
    update = {
      [shieldArc]: Math.min(actor.system.quadrants[arc].shields.value + power, actor.system.attributes.shields.limit)
    };
  } else {
    update = {
      [shieldArc]: Math.max(actor.system.quadrants[arc].shields.value - power, 0)
    };
  }
  // console.log("Update Data:", update);
  await actor.update(update);
  ui.notifications.info("Diverted " + power + " power to " + arc + " shields.");

}

async function copyImage(event) {
  //  console.log("Copy NPC Image clicked");
  var actor
  const button = $(event.currentTarget);
  const actorId = button.data("id");
  const isToken = button.data("token");
  const tokenId = button.data("tokenid");
  console.log("Actor ID:", actorId, "Is Token:", isToken, "Token ID:", tokenId);
  if (isToken) {
    const token = await canvas.tokens.get(tokenId);
    if (token) {


      console.log("Token found:", token); actor = token.actor;
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
  const image = actor.img.includes("icons/default/") ? findNewActorPicture(actor) : actor.img;

  const reply = await actor.updateSource({ "prototypeToken.texture.src": image });
  console.log("Updated Actor Image:", reply);
  if (actor.isToken) {
    const updateToken = await canvas.tokens.get(actor.token.id).document.update({ "texture.src": image });
    console.log("Updated Token Image:", updateToken);
  }
  else {
    canvas.tokens.placeables.forEach(async (token) => {
      if (token.actor?.id === actor.id) {
        const updateToken = await token.document.update({ "texture.src": image });
        console.log("Updated Token Image:", updateToken);
      }
    });
  }
}

async function findNewActorPicture(actor) {
  console.log("Find New Actor Picture:", actor.name, actor.img);
  return actor.img
}



async function setAttacks(event) {
  // console.log("Set NPC Attacks clicked");


  var actor
  const button = $(event.currentTarget);
  const actorId = button.data("id");
  const isToken = button.data("token");
  const tokenId = button.data("tokenid");
  const multiAttacks = [];
  const lootContainers = [];

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
  const actorCR = convertCR(actor.system.details.cr);




  
  // Ensure actor has the correct "Weapon Specialisation (NPC)" from sec_items
  async function ensureNpcWeaponSpecialisation(actor) {
    const itemName = "Weapon Specialization (NPC)";
    try {
      const pack = game.packs.get("sfrpg-easy-crew.sec_items");
      if (!pack) {
        console.warn("Compendium sfrpg-easy-crew.sec_items not found");
        return;
      }
      const index = await pack.getIndex();
      const entry = index.find(e => e.name === itemName);
      if (!entry) {
        console.warn(`${itemName} not found in sfrpg-easy-crew.sec_items`);
        return;
      }
      const doc = await pack.getDocument(entry._id ?? entry.id);
      const newItemData = doc.toObject();

      const existing = actor.items.filter(i => i.name === itemName);
      if (existing.length) {
        await actor.deleteEmbeddedDocuments("Item", existing.map(i => i.id));
      }
      console.log(`Adding ${itemName} to actor ${actor.name}`);
      await actor.createEmbeddedDocuments("Item", [newItemData]);
    } catch (err) {
      console.error("ensureNpcWeaponSpecialisation error:", err);
    }
  }

  await ensureNpcWeaponSpecialisation(actor);

  // console.log("Actor:", actor);
  const packs = game.packs.filter(p => {
    console.log("Pack Check:", p.documentName, p.metadata.packageName, p.metadata.name);
    return p.documentName === "Item" && (["sfrpg","sfrpg-easy-crew"].includes(p.metadata.packageName)) && (["equipment","sec_items"].includes(p.metadata.name));
  });
  //  console.log("Pack:", packs);
  const compendiumweapons = [];

  for (const pack of packs) {
    console.log("Loading Pack:", pack.metadata.label);
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
    // see loot containers
    if (item.type === "container" && item.name.toLowerCase().includes("loot")) {
      lootContainers.push(item)
    }
    //filter for weapons only
    let flag = true
    flag = flag && ["weapon"].includes(item.type)
    // console.log("Item:", correctedName, (item.parentItem ? false : true));
    flag = flag && (item.parentItem ? false : true);
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
  //end of calculateMaxRoll

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


  const itemsToDelete = [];
  const itemsToUpdate = [];
  const itemsToCreate = [];
  const multiAttackNames = ["multiatk", "multiattack"];
  let newLootContainer = null
  //cycle through and recalculate
  upgradeItems.forEach((item, index) => {
    multiAttackNames.some(tag => item.name.toLowerCase().includes(tag)) ? multiAttacks.push(item) : null
  })

  // update Items 
  if (lootContainers.length === 0) {
    ui.notifications.warn("No loot containers found. Create default.");
    newLootContainer = await actor.createEmbeddedDocuments("Item", [{
      name: "Loot - " + actor.name,
      type: "container",
      img: "systems/sfrpg/icons/equipment/technological%20items/xenobiologists-field-kit.webp",
      system: {
        container: {
          isOpen: true,
          storage: [
            {
              type: "bulk",
              acceptsType: ["ammunition", "augmentation", "consumable", "container", "equipment", "fusion", "goods", "hybrid", "magic", "shield", "technological", "upgrade", "weapon", "weaponAccessory"],
              affectsEncumbrance: false,
              amount: "1303",
              subtype: "",
              weightProperty: "bulk"
            }
          ],
        },
        description: { value: "<h2>Bequest by " + actor.name + "</h2><p>I hereby give all the rest of my real and personal property, whatever and wherever situated, to the party for its general purposes.</p>", chat: "", unidentified: "" }
      },
      flags: { "SEC": { loot: true } }
    }]);
    console.log("Created Loot Container:", newLootContainer);
    // newLootContainer[0].update({ "system.storage[0].amount": 13013 });

    lootContainers.push(newLootContainer[0]);

  }
  console.log("Loot Containers:", lootContainers);



  upgradeItems.forEach((item, index) => {
    item.img = item.img.includes("icons/default/") ? findNewPicture(item) : item.img;
console.log("------------Processing Item:", item.name, item);
    const okLevel = (((item.system.level - 2) < actor.system.details.cr) && ((item.system.level + 4) > actor.system.details.cr))
    const existingCompendiumItem = item._source._stats.compendiumSource?.includes("Compendium.") ? item._source._stats.compendiumSource : null;
    const isMultiAttack = multiAttackNames.some(tag => item.name.toLowerCase().includes(tag))
    const multiAttack = 6 * (isMultiAttack ? 1 : 0);

    let attackBonus = 0

    const attackStat = SEC.NPCAttackStats[actor.system.details.combatRole][actorCR];
    const meleeW = ["advancedM", "basicM"].includes(item.system.weaponType)
    const meleeA = ["mwak", "msak"].includes(item.system.actionType)
    checkCompendium(actor, item, meleeW ? meleecompendiumweapons : rangedcompendiumweapons).then(async (returnData) => {

      console.log("Check Compendium Result:", returnData);

      const exact = returnData.exact
      const roots = returnData.root
      const similar = returnData.similar

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

        const sourceItem = existingCompendiumItem ? await fromUuid(existingCompendiumItem) : exact;
        console.log("Found Exact Compendium Item for:", item.name, sourceItem, existingCompendiumItem);
        const newItem = await foundry.utils.duplicate(sourceItem);
        console.log("Duplicated Item:", newItem);
        newItem.system.attackBonus = attackBonus;
        newItem.system.ability = "";
        newItem.system.equipped = true;
        newItem.img = item.img;
        newItem.system.proficient = true;
        newItem.system.damage.parts.forEach((part, index) => {


            if (!part || typeof part.formula !== "string") return;
            // Strip flat numeric bonuses like "+ 5" from the formula (e.g., "2d10 + 5" -> "2d10").
            part.formula = part.formula.replace(/\s*\+\s*[-+]?\d+(?:\.\d+)?/g, "").trim();


          // console.log("Damage Part:", part, (" + " + `${actor.system.details.cr}`));
        });
        const version = game.modules.get("sfrpg-easy-crew")?.version || "1.0.0";
        const flags = { SEC: { version: version } };
        newItem.flags = foundry.utils.mergeObject(newItem.flags ?? {}, flags);

        console.log("Updating Item from Compendium:", item.name, newItem);
        item.update({
          'name': ">" + newItem.name,
          'type': newItem.type,
          'system': newItem.system,
          'flags': newItem.flags,
          'img': newItem.img,

        });
        // }

        // this is the original compendium item = sourceItem
        // is there an item in the loot container with this name


        //  const result =  actor.createEmbeddedDocuments("Item", [newItemData]);
        //  addedItem = targetActor.getItem(result._id);

        //  
        let existingItem = false
        lootContainers.forEach(container => {
          existingItem = container.contents.some(i => {
            console.log("Loot Container Item:", i.name, sourceItem.name);
            return i.name === sourceItem.name;
          });
          console.log("Existing Item in Loot Container:", existingItem);

        })

        if (!existingItem) {
          const newItemData = sourceItem.toObject();
          const newItem = actor.createEmbeddedDocuments("Item", [newItemData]).then((result) => {

            console.log("Created Loot Item:", result)
            const newContents = []
            newContents.push({ id: result[0]._id, index: 0 });
            const combinedContents = lootContainers[0].system.container.contents.concat(newContents);
            console.log("Adding to Loot Container:", lootContainers[0], newContents, combinedContents);
            lootContainers[0].update({ "system.container.contents": combinedContents });



          });

        }
      }

    });
    console.log("Post Flags:", item.flags, item.system);

  })
  // update Items end


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

  console.log("All Items:", actor.system.details.combatRole, actor.system.details.cr, actorCR, upgradeItems, multiAttacks);

  const dmgByCR = calculateMaxRoll(SEC.NPCAttackStats[actor.system.details.combatRole][actorCR].standard);

  console.log("Max Damage CR:", dmgByCR);
}

function convertCR(cr) {
  if (cr == 1 / 2) return "1/2";
  if (cr == 1 / 3) return "1/3";
  return cr.toString();
}

function findNewPicture(item) {
  // Implement your logic to find a new picture for the item
  // This is just a placeholder implementation
  let key = null
  const weaponType = item.system.weaponType;
  const keywords = item.name.toLowerCase().split(" ");
  keywords.some(keyword => {
    // Implement your logic to find a new picture based on keywords
    if (keyword.endsWith(",")) {
      keyword = keyword.slice(0, -1);
    }
    if (keyword.endsWith("s")) {
      keyword = keyword.slice(0, -1);
    }

    // console.log("Keyword Check:", keyword, SEC.attackImages[weaponType][keyword]);
    if (SEC.attackImages[weaponType][keyword]) {
      key = keyword
      return true
    }
  });
  // console.log("Find New Picture:", item.name, weaponType, key, item,SEC.attackImages[weaponType][key]);
  if (key) return SEC.attackImages[weaponType][key][Math.floor(Math.random() * SEC.attackImages[weaponType][key].length)];
  const newPicture = SEC.attackImages[weaponType].default[Math.floor(Math.random() * SEC.attackImages[weaponType].default.length)];
  return newPicture;
  /*
      "basicM": "SFRPG.WeaponTypesBasicMelee",
      "advancedM": "SFRPG.WeaponTypesAdvMelee",
      "smallA": "SFRPG.WeaponTypesSmallArms",
      "longA": "SFRPG.WeaponTypesLongArms",
      "heavy": "SFRPG.WeaponTypesHeavy",
      "sniper": "SFRPG.WeaponTypesSniper",
      "grenade": "SFRPG.WeaponTypesGrenades",
      "special": "SFRPG.WeaponTypesSpecial",
      "solarian": "SFRPG.WeaponTypesSolarian"
  */

}





async function checkCompendium(actor, item, weaponArray) {
  let exact = null;
  let root = [];
  let similar = [];
  let category = "uncategorized";

  const correctedName = item.name.startsWith(">") ? item.name.slice(1) : item.name

  weaponArray.forEach(weapon => {
    if (weapon.name.toLowerCase() === correctedName.toLowerCase()) {
      exact = weapon;
      if (item.system.weaponCategory === "uncategorized") {
        item.system.weaponCategory = weapon.system.weaponCategory;
      }
    }
  })
  weaponArray.forEach(weapon => {
    if (weapon.name.split(", ")[0].trim().toLowerCase() === correctedName.split(", ")[0].trim().toLowerCase()) {
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


  const content = await renderTemplate("modules/sfrpg-easy-crew/templates/set-npc-hp.html", templateData);



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
if (actor.system.details.combatRole === "trap") { ui.notifications.warn("Trap error"); return; }
  console.log("NPC Abilities Calculation:", actor.system.details.combatRole, actor.system.details.cr, newSkills);
  const skillmaster = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].skillmaster;
  const skillgood = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].skillgood;
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
  const abilityScores = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].modifiers;
  const abilities = foundry.utils.duplicate(actor.system.abilities);
  eac.value = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].eac;
  kac.value = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].kac;
  fort.value = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].fort;
  reflex.value = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].ref;
  will.value = SEC.NPCMainStats[actor.system.details.combatRole][convertCR(actor.system.details.cr)].will;

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
 // actor.update({ "system.attributes.hp.value": actor.system.attributes.hp.max })
 // actor.update({ "system.attributes.systems": newSystems }) // Update the systems to nominal status
 // console.log("New Quadrants", newQuadrants, "New Systems", newSystems)

  actor.update({"system.attributes.hp.value": actor.system.attributes.hp.max ,"system.attributes.systems": newSystems, "system.quadrants": newQuadrants }).then(() => {
    actor.sheet.render(false); // Re-render the sheet to show the updated values 
    ui.notifications.info("Ship Repaired to Full HP", { permanent: true, localize: true });

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

// ---------- DC adjustments and helpers ----------

const ACTION_ROLES = {
  "Covering Fire": ["Gunner"],
  "Create Obstacle": ["Chief Mate", "Engineer", "Magic Officer", "Science Officer"],
  "Environmental Cover": ["Pilot"],
  "Evaluate Weakness": ["Captain", "Science Officer"],
  "Negotiate Obstruction": ["Gunner", "Science Officer"],
  "Outmaneuver": ["Pilot"],
  "Outspeed": ["Chief Mate", "Engineer", "Magic Officer"]
};

function computeActionDC(base, actionName, effects) {
  let avg = base.avg; let hard = base.hard; const reasons = [];
  const names = new Set((effects || []).map(e => e.name));
  const roles = ACTION_ROLES[actionName] || [];

  const add = (n, why) => { avg += n; hard += n; reasons.push(`${n > 0 ? '+' : ''}${n} ${why}`); };

  if (names.has("Incorporeal Opponent") && ["Create Obstacle", "Environmental Cover"].includes(actionName)) add(5, "Incorporeal");
  if (names.has("Innocent Bystanders") && actionName === "Negotiate Obstruction") add(5, "Bystanders");
  if (names.has("Seasoned Bounty Hunter") && actionName === "Outmaneuver") add(5, "Bounty Hunter");
  if (names.has("Swarming Ships") && actionName === "Covering Fire") add(5, "Swarming Ships");
  if (names.has("Magic-Dampening Field") && roles.includes("Magic Officer")) add(5, "Magic-Dampening");

  return { avg, hard, adj: reasons.join(", ") };
}

function computeObstacleDC(base, obstacle, effects) {
  let avg = base.avg; let hard = base.hard; const reasons = [];
  const names = new Set((effects || []).map(e => e.name));
  if (names.has("Magic-Dampening Field") && (obstacle.roles || []).includes("Magic Officer")) {
    avg += 5; hard += 5; reasons.push("+5 Magic-Dampening");
  }
  return { avg, hard, adj: reasons.join(", ") };
}

function computePerActionNotes(actionName, effects) {
  const names = new Set((effects || []).map(e => e.name));
  const notes = [];
  if (names.has("Cloud Cover") && actionName === "Environmental Cover") notes.push("Failing Environmental Cover does not cause a hit.");
  if (names.has("Volatile Atmosphere") && actionName === "Covering Fire") notes.push("Taking Covering Fire causes 1 hit to the firing ship.");
  if (names.has("Sabotaged Engine") && actionName === "Outspeed") notes.push("Failing Outspeed results in 1 hit.");
  if (names.has("Amateur Opponent") && actionName === "Evaluate Weakness") notes.push("Evaluate Weakness: next action yields 3 successes instead of 2.");
  if (notes.length) return notes.join(" ");
  return "";
}