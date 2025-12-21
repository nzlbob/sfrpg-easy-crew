export const SEC = {};

SEC

SEC.HP = {
    trap: {
        "1/2": 12,
        "1": 19,
        "2": 25,
        "3": 38,
        "4": 50,
        "5": 69,
        "6": 88,
        "7": 107,
        "8": 125,
        "9": 144,
        "10": 163,
        "11": 181,
        "12": 200,
        "13": 225,
        "14": 250,
        "15": 275,
        "16": 300,
        "17": 338,
        "18": 375,
        "19": 413,
        "20": 463
    },
    combatant: {
        "1/3": 6,
        "1/2": 13,
        "1": 20,
        "2": 25,
        "3": 40,
        "4": 50,
        "5": 70,
        "6": 90,
        "7": 105,
        "8": 125,
        "9": 145,
        "10": 165,
        "11": 180,
        "12": 200,
        "13": 225,
        "14": 250,
        "15": 275,
        "16": 300,
        "17": 340,
        "18": 375,
        "19": 415,
        "20": 465,
        "21": 500,
        "22": 550,
        "23": 600,
        "24": 650,
        "25": 700
    },
    expert: {
        "1/3": 6,
        "1/2": 12,
        "1": 17,
        "2": 23,
        "3": 35,
        "4": 45,
        "5": 65,
        "6": 80,
        "7": 100,
        "8": 115,
        "9": 135,
        "10": 150,
        "11": 170,
        "12": 185,
        "13": 210,
        "14": 235,
        "15": 255,
        "16": 280,
        "17": 315,
        "18": 350,
        "19": 385,
        "20": 430,
        "21": 465,
        "22": 500,
        "23": 550,
        "24": 600,
        "25": 650
    },
    spellcaster: {
        "1/3": 5,
        "1/2": 11,
        "1": 16,
        "2": 21,
        "3": 32,
        "4": 43,
        "5": 60,
        "6": 75,
        "7": 90,
        "8": 105,
        "9": 120,
        "10": 140,
        "11": 155,
        "12": 170,
        "13": 190,
        "14": 215,
        "15": 235,
        "16": 255,
        "17": 285,
        "18": 320,
        "19": 350,
        "20": 395,
        "21": 425,
        "22": 470,
        "23": 510,
        "24": 550,
        "25": 600
    }
}
SEC.NPCAttackStats = {
    "combatant": {
        "1/3": { high: "4", low: "1", energy: "1d4", kinetic: "1d4", standard: "1d6+@abilities.str.mod", three: "-", four: "-" },
        "1/2": { high: "6", low: "3", energy: "1d4", kinetic: "1d6", standard: "1d6+@abilities.str.mod", three: "-", four: "-" },
        "1": { high: "8", low: "5", energy: "1d4", kinetic: "1d6", standard: "1d6+@abilities.str.mod", three: "-", four: "-" },
        "2": { high: "10", low: "7", energy: "1d4", kinetic: "1d6", standard: "1d6+@abilities.str.mod", three: "-", four: "-" },
        "3": { high: "11", low: "8", energy: "1d4", kinetic: "1d6", standard: "1d6@abilities.str.mod", three: "-", four: "-" },
        "4": { high: "12", low: "9", energy: "1d4", kinetic: "1d6", standard: "1d6+@abilities.str.mod", three: "-", four: "-" },
        "5": { high: "14", low: "11", energy: "1d6", kinetic: "1d8", standard: "1d6+@abilities.str.mod", three: "-", four: "-" },
        "6": { high: "16", low: "13", energy: "1d10", kinetic: "2d6", standard: "1d8+@abilities.str.mod", three: "1d4+@abilities.str.mod", four: "-" },
        "7": { high: "17", low: "14", energy: "2d6", kinetic: "2d8", standard: "2d6+@abilities.str.mod", three: "1d8+@abilities.str.mod", four: "1d6+@abilities.str.mod" },
        "8": { high: "19", low: "16", energy: "2d8", kinetic: "3d6", standard: "3d4+@abilities.str.mod", three: "1d10+@abilities.str.mod", four: "1d6+@abilities.str.mod" },
        "9": { high: "21", low: "18", energy: "3d6", kinetic: "5d4", standard: "2d10+@abilities.str.mod", three: "2d6+@abilities.str.mod", four: "1d10+@abilities.str.mod" },
        "10": { high: "22", low: "19", energy: "2d10", kinetic: "4d6", standard: "2d10+@abilities.str.mod", three: "3d4+@abilities.str.mod", four: "1d10+@abilities.str.mod" },
        "11": { high: "23", low: "20", energy: "3d8", kinetic: "3d10", standard: "4d6+@abilities.str.mod", three: "2d8+@abilities.str.mod", four: "2d6+@abilities.str.mod" },
        "12": { high: "25", low: "22", energy: "6d4", kinetic: "4d8", standard: "6d4+@abilities.str.mod", three: "3d6+@abilities.str.mod", four: "3d4+@abilities.str.mod" },
        "13": { high: "26", low: "23", energy: "5d6", kinetic: "6d6", standard: "3d12+@abilities.str.mod", three: "2d12+@abilities.str.mod", four: "2d8+@abilities.str.mod" },
        "14": { high: "27", low: "24", energy: "3d12", kinetic: "5d10", standard: "8d6+@abilities.str.mod", three: "4d8+@abilities.str.mod", four: "4d6+@abilities.str.mod" },
        "15": { high: "28", low: "25", energy: "5d8", kinetic: "8d6", standard: "8d6+@abilities.str.mod", three: "3d12+@abilities.str.mod", four: "6d4+@abilities.str.mod" },
        "16": { high: "30", low: "27", energy: "7d6", kinetic: "6d10", standard: "6d10+@abilities.str.mod", three: "5d8+@abilities.str.mod", four: "3d10+@abilities.str.mod" },
        "17": { high: "31", low: "28", energy: "8d6", kinetic: "6d12", standard: "6d12+@abilities.str.mod", three: "4d12+@abilities.str.mod", four: "3d12+@abilities.str.mod" },
        "18": { high: "32", low: "29", energy: "6d10", kinetic: "8d10", standard: "13d6+@abilities.str.mod", three: "8d6+@abilities.str.mod", four: "5d8+@abilities.str.mod" },
        "19": { high: "33", low: "30", energy: "8d8", kinetic: "9d10", standard: "15d6+@abilities.str.mod", three: "6d10+@abilities.str.mod", four: "4d12+@abilities.str.mod" },
        "20": { high: "34", low: "31", energy: "12d6", kinetic: "16d6", standard: "11d10+@abilities.str.mod", three: "6d12+@abilities.str.mod", four: "8d6+@abilities.str.mod" },
        "21": { high: "35", low: "32", energy: "13d6", kinetic: "18d6", standard: "12d10+@abilities.str.mod", three: "8d10+@abilities.str.mod", four: "6d10+@abilities.str.mod" },
        "22": { high: "36", low: "33", energy: "12d8", kinetic: "20d6", standard: "21d6+@abilities.str.mod", three: "9d10+@abilities.str.mod", four: "8d8+@abilities.str.mod" },
        "23": { high: "37", low: "34", energy: "17d6", kinetic: "14d10", standard: "24d6+@abilities.str.mod", three: "10d10+@abilities.str.mod", four: "12d6+@abilities.str.mod" },
        "24": { high: "39", low: "36", energy: "10d12", kinetic: "19d8", standard: "14d12+@abilities.str.mod", three: "11d10+@abilities.str.mod", four: "13d6+@abilities.str.mod" },
        "25": { high: "40", low: "37", energy: "13d10", kinetic: "14d12", standard: "18d10+@abilities.str.mod", three: "12d10+@abilities.str.mod", four: "9d10+@abilities.str.mod" }
    },
    "expert": {
        "1/3": { high: "2", low: "0", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "1/2": { high: "4", low: "2", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "1": { high: "6", low: "4", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "2": { high: "8", low: "6", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "3": { high: "9", low: "7", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "4": { high: "10", low: "8", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "5": { high: "12", low: "10", energy: "1d4", kinetic: "1d6", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "6": { high: "14", low: "12", energy: "1d6", kinetic: "1d8", standard: "1d6+@abilities.str.mod", three: "1d4+@abilities.str.mod", four: "-" },
        "7": { high: "15", low: "13", energy: "1d8", kinetic: "1d12", standard: "1d8+@abilities.str.mod", three: "1d4+@abilities.str.mod", four: "1d4+@abilities.str.mod" },
        "8": { high: "17", low: "15", energy: "1d10", kinetic: "2d6", standard: "1d12+@abilities.str.mod", three: "1d8+@abilities.str.mod", four: "1d4+@abilities.str.mod" },
        "9": { high: "19", low: "17", energy: "2d6", kinetic: "2d8", standard: "3d4+@abilities.str.mod", three: "1d10+@abilities.str.mod", four: "1d6+@abilities.str.mod" },
        "10": { high: "20", low: "18", energy: "3d4", kinetic: "2d8", standard: "2d8+@abilities.str.mod", three: "1d10+@abilities.str.mod", four: "1d8+@abilities.str.mod" },
        "11": { high: "21", low: "19", energy: "2d8", kinetic: "2d10", standard: "2d10+@abilities.str.mod", three: "3d4+@abilities.str.mod", four: "1d10+@abilities.str.mod" },
        "12": { high: "23", low: "21", energy: "2d8", kinetic: "2d10", standard: "2d12+@abilities.str.mod", three: "3d4+@abilities.str.mod", four: "1d12+@abilities.str.mod" },
        "13": { high: "24", low: "22", energy: "2d10", kinetic: "4d6", standard: "6d4+@abilities.str.mod", three: "3d6+@abilities.str.mod", four: "3d4+@abilities.str.mod" },
        "14": { high: "25", low: "23", energy: "5d4", kinetic: "4d8", standard: "6d6+@abilities.str.mod", three: "4d6+@abilities.str.mod", four: "3d6+@abilities.str.mod" },
        "15": { high: "26", low: "24", energy: "4d6", kinetic: "6d6", standard: "5d8+@abilities.str.mod", three: "6d4+@abilities.str.mod", four: "2d10+@abilities.str.mod" },
        "16": { high: "28", low: "26", energy: "6d4", kinetic: "5d8", standard: "6d8+@abilities.str.mod", three: "4d8+@abilities.str.mod", four: "3d8+@abilities.str.mod" },
        "17": { high: "29", low: "27", energy: "4d8", kinetic: "4d12", standard: "8d6+@abilities.str.mod", three: "3d12+@abilities.str.mod", four: "6d4+@abilities.str.mod" },
        "18": { high: "30", low: "28", energy: "3d12", kinetic: "8d6", standard: "8d8+@abilities.str.mod", three: "5d8+@abilities.str.mod", four: "4d8+@abilities.str.mod" },
        "19": { high: "31", low: "29", energy: "5d8", kinetic: "6d10", standard: "9d8+@abilities.str.mod", three: "6d8+@abilities.str.mod", four: "3d12+@abilities.str.mod" },
        "20": { high: "32", low: "30", energy: "4d12", kinetic: "8d8", standard: "13d6+@abilities.str.mod", three: "9d6+@abilities.str.mod", four: "5d8+@abilities.str.mod" },
        "21": { high: "33", low: "31", energy: "8d6", kinetic: "6d12", standard: "15d6+@abilities.str.mod", three: "10d6+@abilities.str.mod", four: "4d12+@abilities.str.mod" },
        "22": { high: "34", low: "32", energy: "6d10", kinetic: "8d10", standard: "17d6+@abilities.str.mod", three: "6d12+@abilities.str.mod", four: "8d6+@abilities.str.mod" },
        "23": { high: "35", low: "33", energy: "8d8", kinetic: "13d6", standard: "12d10+@abilities.str.mod", three: "8d10+@abilities.str.mod", four: "6d10+@abilities.str.mod" },
        "24": { high: "37", low: "35", energy: "9d8", kinetic: "15d6", standard: "21d6+@abilities.str.mod", three: "9d10+@abilities.str.mod", four: "8d8+@abilities.str.mod" },
        "25": { high: "38", low: "36", energy: "8d10", kinetic: "16d6", standard: "12d12+@abilities.str.mod", three: "15d6+@abilities.str.mod", four: "6d12+@abilities.str.mod" }

    },
    "spellcaster": {
        "1/3": { high: "0", low: "-2", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "1/2": { high: "2", low: "0", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "1": { high: "4", low: "2", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "2": { high: "6", low: "4", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "3": { high: "7", low: "5", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "4": { high: "8", low: "6", energy: "1d4", kinetic: "1d4", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "5": { high: "10", low: "8", energy: "1d4", kinetic: "1d6", standard: "1d4+@abilities.str.mod", three: "-", four: "-" },
        "6": { high: "12", low: "10", energy: "1d6", kinetic: "1d8", standard: "1d6+@abilities.str.mod", three: "1d4+@abilities.str.mod", four: "-" },
        "7": { high: "13", low: "11", energy: "1d8", kinetic: "1d12", standard: "1d8+@abilities.str.mod", three: "1d4+@abilities.str.mod", four: "1d4+@abilities.str.mod" },
        "8": { high: "15", low: "13", energy: "1d10", kinetic: "2d6", standard: "1d12+@abilities.str.mod", three: "1d8+@abilities.str.mod", four: "1d4+@abilities.str.mod" },
        "9": { high: "17", low: "15", energy: "2d6", kinetic: "2d8", standard: "3d4+@abilities.str.mod", three: "1d10+@abilities.str.mod", four: "1d6+@abilities.str.mod" },
        "10": { high: "18", low: "16", energy: "3d4", kinetic: "2d8", standard: "2d8+@abilities.str.mod", three: "1d10+@abilities.str.mod", four: "1d8+@abilities.str.mod" },
        "11": { high: "19", low: "17", energy: "2d8", kinetic: "2d10", standard: "2d10+@abilities.str.mod", three: "3d4+@abilities.str.mod", four: "1d10+@abilities.str.mod" },
        "12": { high: "21", low: "19", energy: "2d8", kinetic: "2d10", standard: "2d12+@abilities.str.mod", three: "3d4+@abilities.str.mod", four: "1d12+@abilities.str.mod" },
        "13": { high: "22", low: "20", energy: "2d10", kinetic: "4d6", standard: "6d4+@abilities.str.mod", three: "3d6+@abilities.str.mod", four: "3d4+@abilities.str.mod" },
        "14": { high: "23", low: "2", energy: "5d4", kinetic: "4d8", standard: "6d6+@abilities.str.mod", three: "4d6+@abilities.str.mod", four: "3d6+@abilities.str.mod" },
        "15": { high: "24", low: "22", energy: "4d6", kinetic: "6d6", standard: "5d8+@abilities.str.mod", three: "6d4+@abilities.str.mod", four: "2d10+@abilities.str.mod" },
        "16": { high: "26", low: "24", energy: "6d4", kinetic: "5d8", standard: "6d8+@abilities.str.mod", three: "4d8+@abilities.str.mod", four: "3d8+@abilities.str.mod" },
        "17": { high: "27", low: "25", energy: "4d8", kinetic: "4d12", standard: "8d6+@abilities.str.mod", three: "3d12+@abilities.str.mod", four: "6d4+@abilities.str.mod" },
        "18": { high: "28", low: "26", energy: "3d12", kinetic: "8d6", standard: "8d8+@abilities.str.mod", three: "5d8+@abilities.str.mod", four: "4d8+@abilities.str.mod" },
        "19": { high: "29", low: "27", energy: "5d8", kinetic: "6d10", standard: "9d8+@abilities.str.mod", three: "6d8+@abilities.str.mod", four: "3d12+@abilities.str.mod" },
        "20": { high: "30", low: "28", energy: "4d12", kinetic: "8d8", standard: "13d6+@abilities.str.mod", three: "9d6+@abilities.str.mod", four: "5d8+@abilities.str.mod" },
        "21": { high: "31", low: "29", energy: "8d6", kinetic: "6d12", standard: "15d6+@abilities.str.mod", three: "10d6+@abilities.str.mod", four: "4d12+@abilities.str.mod" },
        "22": { high: "32", low: "30", energy: "6d10", kinetic: "8d10", standard: "17d6+@abilities.str.mod", three: "6d12+@abilities.str.mod", four: "8d6+@abilities.str.mod" },
        "23": { high: "33", low: "31", energy: "8d8", kinetic: "13d6", standard: "12d10+@abilities.str.mod", three: "8d10+@abilities.str.mod", four: "6d10+@abilities.str.mod" },
        "24": { high: "35", low: "33", energy: "9d8", kinetic: "15d6", standard: "21d6+@abilities.str.mod", three: "9d10+@abilities.str.mod", four: "8d8+@abilities.str.mod" },
        "25": { high: "36", low: "34", energy: "8d10", kinetic: "16d6", standard: "12d12+@abilities.str.mod", three: "15d6+@abilities.str.mod", four: "6d12+@abilities.str.mod" },

    }
}
SEC.NPCMainStats = {
    "combatant": {
        "1/3": { eac: 10, kac: 12, fort: 1, ref: 1, will: 0, hp: 6, abildc: 8, spelldc: 8, modifiers: [3, 1, 0], abilities: 1, skillmaster: { mod: 7, num: 1 }, skillgood: { mod: 3, num: 2 } },
        "1/2": { eac: 10, kac: 12, fort: 2, ref: 2, will: 0, hp: 13, abildc: 9, spelldc: 9, modifiers: [3, 2, 1], abilities: 1, skillmaster: { mod: 9, num: 1 }, skillgood: { mod: 4, num: 2 } },
        "1": { eac: 11, kac: 13, fort: 3, ref: 3, will: 1, hp: 20, abildc: 10, spelldc: 9, modifiers: [4, 2, 1], abilities: 1, skillmaster: { mod: 10, num: 1 }, skillgood: { mod: 5, num: 2 } },
        "2": { eac: 13, kac: 15, fort: 4, ref: 4, will: 1, hp: 25, abildc: 11, spelldc: 10, modifiers: [4, 2, 1], abilities: 2, skillmaster: { mod: 12, num: 1 }, skillgood: { mod: 7, num: 2 } },
        "3": { eac: 14, kac: 16, fort: 5, ref: 5, will: 2, hp: 40, abildc: 12, spelldc: 11, modifiers: [4, 2, 1], abilities: 2, skillmaster: { mod: 13, num: 1 }, skillgood: { mod: 8, num: 2 } },
        "4": { eac: 16, kac: 18, fort: 6, ref: 6, will: 3, hp: 50, abildc: 13, spelldc: 11, modifiers: [5, 3, 1], abilities: 2, skillmaster: { mod: 15, num: 1 }, skillgood: { mod: 10, num: 2 } },
        "5": { eac: 17, kac: 19, fort: 7, ref: 7, will: 4, hp: 70, abildc: 13, spelldc: 11, modifiers: [5, 3, 2], abilities: 2, skillmaster: { mod: 16, num: 1 }, skillgood: { mod: 11, num: 2 } },
        "6": { eac: 18, kac: 20, fort: 8, ref: 8, will: 5, hp: 90, abildc: 14, spelldc: 12, modifiers: [5, 3, 2], abilities: 2, skillmaster: { mod: 18, num: 1 }, skillgood: { mod: 13, num: 2 } },
        "7": { eac: 19, kac: 21, fort: 9, ref: 9, will: 6, hp: 105, abildc: 15, spelldc: 13, modifiers: [5, 4, 2], abilities: 2, skillmaster: { mod: 19, num: 1 }, skillgood: { mod: 14, num: 2 } },
        "8": { eac: 20, kac: 22, fort: 10, ref: 10, will: 7, hp: 125, abildc: 16, spelldc: 13, modifiers: [6, 4, 2], abilities: 2, skillmaster: { mod: 21, num: 1 }, skillgood: { mod: 16, num: 2 } },
        "9": { eac: 22, kac: 24, fort: 11, ref: 11, will: 8, hp: 145, abildc: 16, spelldc: 13, modifiers: [6, 4, 3], abilities: 2, skillmaster: { mod: 22, num: 1 }, skillgood: { mod: 17, num: 2 } },
        "10": { eac: 23, kac: 25, fort: 12, ref: 12, will: 9, hp: 165, abildc: 17, spelldc: 14, modifiers: [8, 5, 3], abilities: 2, skillmaster: { mod: 24, num: 1 }, skillgood: { mod: 19, num: 2 } },
        "11": { eac: 24, kac: 26, fort: 13, ref: 13, will: 10, hp: 180, abildc: 18, spelldc: 14, modifiers: [8, 5, 3], abilities: 2, skillmaster: { mod: 25, num: 1 }, skillgood: { mod: 20, num: 2 } },
        "12": { eac: 26, kac: 28, fort: 14, ref: 14, will: 11, hp: 200, abildc: 19, spelldc: 15, modifiers: [8, 5, 4], abilities: 3, skillmaster: { mod: 27, num: 1 }, skillgood: { mod: 22, num: 2 } },
        "13": { eac: 27, kac: 29, fort: 15, ref: 15, will: 12, hp: 225, abildc: 19, spelldc: 15, modifiers: [8, 6, 4], abilities: 3, skillmaster: { mod: 28, num: 1 }, skillgood: { mod: 23, num: 2 } },
        "14": { eac: 28, kac: 30, fort: 16, ref: 16, will: 12, hp: 250, abildc: 20, spelldc: 15, modifiers: [8, 6, 4], abilities: 3, skillmaster: { mod: 30, num: 1 }, skillgood: { mod: 25, num: 2 } },
        "15": { eac: 29, kac: 31, fort: 17, ref: 17, will: 13, hp: 275, abildc: 21, spelldc: 16, modifiers: [9, 7, 5], abilities: 3, skillmaster: { mod: 31, num: 1 }, skillgood: { mod: 26, num: 2 } },
        "16": { eac: 30, kac: 32, fort: 18, ref: 18, will: 14, hp: 300, abildc: 22, spelldc: 16, modifiers: [10, 7, 5], abilities: 3, skillmaster: { mod: 33, num: 1 }, skillgood: { mod: 28, num: 2 } },
        "17": { eac: 31, kac: 33, fort: 19, ref: 19, will: 15, hp: 340, abildc: 22, spelldc: 16, modifiers: [11, 8, 5], abilities: 3, skillmaster: { mod: 34, num: 1 }, skillgood: { mod: 29, num: 2 } },
        "18": { eac: 32, kac: 34, fort: 19, ref: 19, will: 16, hp: 375, abildc: 23, spelldc: 17, modifiers: [11, 8, 6], abilities: 4, skillmaster: { mod: 36, num: 1 }, skillgood: { mod: 31, num: 2 } },
        "19": { eac: 33, kac: 35, fort: 20, ref: 20, will: 16, hp: 415, abildc: 24, spelldc: 18, modifiers: [11, 9, 6], abilities: 4, skillmaster: { mod: 37, num: 1 }, skillgood: { mod: 32, num: 2 } },
        "20": { eac: 35, kac: 37, fort: 21, ref: 21, will: 17, hp: 465, abildc: 25, spelldc: 19, modifiers: [12, 9, 6], abilities: 4, skillmaster: { mod: 39, num: 1 }, skillgood: { mod: 34, num: 2 } },
        "21": { eac: 36, kac: 38, fort: 22, ref: 22, will: 18, hp: 500, abildc: 25, spelldc: 19, modifiers: [12, 10, 7], abilities: 4, skillmaster: { mod: 40, num: 1 }, skillgood: { mod: 35, num: 2 } },
        "22": { eac: 38, kac: 40, fort: 22, ref: 22, will: 18, hp: 550, abildc: 26, spelldc: 20, modifiers: [13, 10, 7], abilities: 4, skillmaster: { mod: 42, num: 1 }, skillgood: { mod: 37, num: 2 } },
        "23": { eac: 39, kac: 41, fort: 23, ref: 23, will: 19, hp: 600, abildc: 27, spelldc: 21, modifiers: [13, 11, 7], abilities: 4, skillmaster: { mod: 43, num: 1 }, skillgood: { mod: 38, num: 2 } },
        "24": { eac: 41, kac: 43, fort: 24, ref: 24, will: 20, hp: 650, abildc: 28, spelldc: 22, modifiers: [15, 11, 8], abilities: 4, skillmaster: { mod: 45, num: 1 }, skillgood: { mod: 40, num: 2 } },
        "25": { eac: 42, kac: 44, fort: 25, ref: 25, will: 21, hp: 700, abildc: 28, spelldc: 22, modifiers: [15, 12, 8], abilities: 4, skillmaster: { mod: 46, num: 1 }, skillgood: { mod: 41, num: 2 } },

    },
    "expert": {
        "1/3": { eac: 10, kac: 11, fort: 0, ref: 0, will: 2, hp: 6, abildc: 10, spelldc: 10, modifiers: [3, 1, 0], abilities: 1, skillmaster: { mod: 7, num: 3 }, skillgood: { mod: 3, num: 2 } },
        "1/2": { eac: 10, kac: 11, fort: 0, ref: 0, will: 3, hp: 12, abildc: 11, spelldc: 11, modifiers: [3, 2, 1], abilities: 1, skillmaster: { mod: 9, num: 3 }, skillgood: { mod: 4, num: 2 } },
        "1": { eac: 11, kac: 12, fort: 1, ref: 1, will: 4, hp: 17, abildc: 12, spelldc: 11, modifiers: [4, 2, 1], abilities: 1, skillmaster: { mod: 10, num: 3 }, skillgood: { mod: 5, num: 2 } },
        "2": { eac: 13, kac: 14, fort: 1, ref: 1, will: 5, hp: 23, abildc: 13, spelldc: 12, modifiers: [4, 2, 1], abilities: 1, skillmaster: { mod: 12, num: 3 }, skillgood: { mod: 7, num: 2 } },
        "3": { eac: 14, kac: 15, fort: 2, ref: 2, will: 6, hp: 35, abildc: 14, spelldc: 13, modifiers: [4, 2, 1], abilities: 2, skillmaster: { mod: 13, num: 3 }, skillgood: { mod: 8, num: 2 } },
        "4": { eac: 16, kac: 17, fort: 3, ref: 3, will: 7, hp: 45, abildc: 15, spelldc: 13, modifiers: [5, 3, 1], abilities: 2, skillmaster: { mod: 15, num: 3 }, skillgood: { mod: 10, num: 2 } },
        "5": { eac: 17, kac: 18, fort: 4, ref: 4, will: 8, hp: 65, abildc: 15, spelldc: 13, modifiers: [5, 3, 2], abilities: 2, skillmaster: { mod: 16, num: 3 }, skillgood: { mod: 11, num: 2 } },
        "6": { eac: 18, kac: 19, fort: 5, ref: 5, will: 9, hp: 80, abildc: 16, spelldc: 14, modifiers: [5, 3, 2], abilities: 2, skillmaster: { mod: 18, num: 3 }, skillgood: { mod: 13, num: 2 } },
        "7": { eac: 19, kac: 20, fort: 6, ref: 6, will: 10, hp: 100, abildc: 17, spelldc: 15, modifiers: [5, 4, 2], abilities: 2, skillmaster: { mod: 19, num: 3 }, skillgood: { mod: 14, num: 2 } },
        "8": { eac: 20, kac: 21, fort: 7, ref: 7, will: 11, hp: 115, abildc: 18, spelldc: 15, modifiers: [6, 4, 2], abilities: 2, skillmaster: { mod: 21, num: 3 }, skillgood: { mod: 16, num: 2 } },
        "9": { eac: 22, kac: 23, fort: 8, ref: 8, will: 12, hp: 135, abildc: 18, spelldc: 15, modifiers: [6, 4, 3], abilities: 2, skillmaster: { mod: 22, num: 3 }, skillgood: { mod: 17, num: 2 } },
        "10": { eac: 23, kac: 24, fort: 9, ref: 9, will: 13, hp: 150, abildc: 19, spelldc: 16, modifiers: [8, 5, 3], abilities: 2, skillmaster: { mod: 24, num: 3 }, skillgood: { mod: 19, num: 2 } },
        "11": { eac: 24, kac: 25, fort: 10, ref: 10, will: 14, hp: 170, abildc: 20, spelldc: 16, modifiers: [8, 5, 3], abilities: 2, skillmaster: { mod: 25, num: 3 }, skillgood: { mod: 20, num: 2 } },
        "12": { eac: 26, kac: 27, fort: 11, ref: 11, will: 15, hp: 185, abildc: 21, spelldc: 17, modifiers: [8, 5, 4], abilities: 3, skillmaster: { mod: 27, num: 3 }, skillgood: { mod: 22, num: 2 } },
        "13": { eac: 27, kac: 28, fort: 12, ref: 12, will: 16, hp: 210, abildc: 21, spelldc: 17, modifiers: [8, 6, 4], abilities: 3, skillmaster: { mod: 28, num: 3 }, skillgood: { mod: 23, num: 2 } },
        "14": { eac: 28, kac: 29, fort: 12, ref: 12, will: 17, hp: 235, abildc: 22, spelldc: 17, modifiers: [8, 6, 4], abilities: 3, skillmaster: { mod: 30, num: 3 }, skillgood: { mod: 25, num: 2 } },
        "15": { eac: 29, kac: 30, fort: 13, ref: 13, will: 18, hp: 255, abildc: 23, spelldc: 18, modifiers: [9, 7, 5], abilities: 3, skillmaster: { mod: 31, num: 3 }, skillgood: { mod: 26, num: 2 } },
        "16": { eac: 30, kac: 31, fort: 14, ref: 14, will: 19, hp: 280, abildc: 24, spelldc: 18, modifiers: [10, 7, 5], abilities: 3, skillmaster: { mod: 33, num: 3 }, skillgood: { mod: 28, num: 2 } },
        "17": { eac: 31, kac: 32, fort: 15, ref: 15, will: 20, hp: 315, abildc: 24, spelldc: 18, modifiers: [11, 8, 5], abilities: 3, skillmaster: { mod: 34, num: 3 }, skillgood: { mod: 29, num: 2 } },
        "18": { eac: 32, kac: 33, fort: 16, ref: 16, will: 20, hp: 350, abildc: 25, spelldc: 19, modifiers: [11, 8, 6], abilities: 3, skillmaster: { mod: 36, num: 3 }, skillgood: { mod: 31, num: 2 } },
        "19": { eac: 33, kac: 34, fort: 16, ref: 16, will: 21, hp: 385, abildc: 26, spelldc: 20, modifiers: [11, 9, 6], abilities: 4, skillmaster: { mod: 37, num: 3 }, skillgood: { mod: 32, num: 2 } },
        "20": { eac: 35, kac: 36, fort: 17, ref: 17, will: 22, hp: 430, abildc: 27, spelldc: 21, modifiers: [12, 9, 6], abilities: 4, skillmaster: { mod: 39, num: 3 }, skillgood: { mod: 34, num: 2 } },
        "21": { eac: 36, kac: 37, fort: 18, ref: 18, will: 23, hp: 465, abildc: 27, spelldc: 21, modifiers: [12, 10, 7], abilities: 4, skillmaster: { mod: 40, num: 3 }, skillgood: { mod: 35, num: 2 } },
        "22": { eac: 38, kac: 39, fort: 18, ref: 18, will: 23, hp: 500, abildc: 28, spelldc: 22, modifiers: [13, 10, 7], abilities: 4, skillmaster: { mod: 42, num: 3 }, skillgood: { mod: 37, num: 2 } },
        "23": { eac: 39, kac: 40, fort: 19, ref: 19, will: 24, hp: 550, abildc: 29, spelldc: 23, modifiers: [13, 11, 7], abilities: 4, skillmaster: { mod: 43, num: 3 }, skillgood: { mod: 38, num: 2 } },
        "24": { eac: 41, kac: 42, fort: 20, ref: 20, will: 25, hp: 600, abildc: 30, spelldc: 24, modifiers: [15, 11, 8], abilities: 4, skillmaster: { mod: 45, num: 3 }, skillgood: { mod: 40, num: 2 } },
        "25": { eac: 42, kac: 43, fort: 21, ref: 21, will: 26, hp: 650, abildc: 30, spelldc: 24, modifiers: [15, 12, 8], abilities: 4, skillmaster: { mod: 46, num: 3 }, skillgood: { mod: 41, num: 2 } },

    },
    "spellcaster": {
        "1/3": { eac: 9, kac: 10, fort: 0, ref: 0, will: 2, hp: 5, abildc: 10, spelldc: 12, modifiers: [3, 1, 0], abilities: 1, skillmaster: { mod: 7, num: 2 }, skillgood: { mod: 3, num: 1 } },
        "1/2": { eac: 9, kac: 10, fort: 0, ref: 0, will: 3, hp: 11, abildc: 11, spelldc: 13, modifiers: [3, 2, 1], abilities: 1, skillmaster: { mod: 9, num: 2 }, skillgood: { mod: 4, num: 1 } },
        "1": { eac: 10, kac: 11, fort: 1, ref: 1, will: 4, hp: 16, abildc: 12, spelldc: 13, modifiers: [4, 2, 1], abilities: 1, skillmaster: { mod: 10, num: 2 }, skillgood: { mod: 5, num: 1 } },
        "2": { eac: 12, kac: 13, fort: 1, ref: 1, will: 5, hp: 21, abildc: 13, spelldc: 14, modifiers: [4, 2, 1], abilities: 2, skillmaster: { mod: 12, num: 2 }, skillgood: { mod: 7, num: 1 } },
        "3": { eac: 13, kac: 14, fort: 2, ref: 2, will: 6, hp: 32, abildc: 14, spelldc: 15, modifiers: [4, 2, 1], abilities: 2, skillmaster: { mod: 13, num: 2 }, skillgood: { mod: 8, num: 1 } },
        "4": { eac: 15, kac: 16, fort: 3, ref: 3, will: 7, hp: 43, abildc: 15, spelldc: 15, modifiers: [5, 3, 1], abilities: 2, skillmaster: { mod: 15, num: 2 }, skillgood: { mod: 10, num: 1 } },
        "5": { eac: 16, kac: 17, fort: 4, ref: 4, will: 8, hp: 60, abildc: 15, spelldc: 15, modifiers: [5, 3, 2], abilities: 2, skillmaster: { mod: 16, num: 2 }, skillgood: { mod: 11, num: 1 } },
        "6": { eac: 17, kac: 18, fort: 5, ref: 5, will: 9, hp: 75, abildc: 16, spelldc: 16, modifiers: [5, 3, 2], abilities: 2, skillmaster: { mod: 18, num: 2 }, skillgood: { mod: 13, num: 1 } },
        "7": { eac: 18, kac: 19, fort: 6, ref: 6, will: 10, hp: 90, abildc: 17, spelldc: 17, modifiers: [5, 4, 2], abilities: 2, skillmaster: { mod: 19, num: 2 }, skillgood: { mod: 14, num: 1 } },
        "8": { eac: 19, kac: 20, fort: 7, ref: 7, will: 11, hp: 105, abildc: 18, spelldc: 17, modifiers: [6, 4, 2], abilities: 2, skillmaster: { mod: 21, num: 2 }, skillgood: { mod: 16, num: 1 } },
        "9": { eac: 21, kac: 22, fort: 8, ref: 8, will: 12, hp: 120, abildc: 18, spelldc: 17, modifiers: [6, 4, 3], abilities: 2, skillmaster: { mod: 22, num: 2 }, skillgood: { mod: 17, num: 1 } },
        "10": { eac: 22, kac: 23, fort: 9, ref: 9, will: 13, hp: 140, abildc: 19, spelldc: 18, modifiers: [8, 5, 3], abilities: 2, skillmaster: { mod: 24, num: 2 }, skillgood: { mod: 19, num: 1 } },
        "11": { eac: 23, kac: 24, fort: 10, ref: 10, will: 14, hp: 155, abildc: 20, spelldc: 18, modifiers: [8, 5, 3], abilities: 2, skillmaster: { mod: 25, num: 2 }, skillgood: { mod: 20, num: 1 } },
        "12": { eac: 25, kac: 26, fort: 11, ref: 11, will: 15, hp: 170, abildc: 21, spelldc: 19, modifiers: [8, 5, 4], abilities: 3, skillmaster: { mod: 27, num: 2 }, skillgood: { mod: 22, num: 1 } },
        "13": { eac: 26, kac: 27, fort: 12, ref: 12, will: 16, hp: 190, abildc: 21, spelldc: 19, modifiers: [8, 6, 4], abilities: 3, skillmaster: { mod: 28, num: 2 }, skillgood: { mod: 23, num: 1 } },
        "14": { eac: 27, kac: 28, fort: 12, ref: 12, will: 17, hp: 215, abildc: 22, spelldc: 19, modifiers: [8, 6, 4], abilities: 3, skillmaster: { mod: 30, num: 2 }, skillgood: { mod: 25, num: 1 } },
        "15": { eac: 28, kac: 29, fort: 13, ref: 13, will: 18, hp: 235, abildc: 23, spelldc: 20, modifiers: [9, 7, 5], abilities: 3, skillmaster: { mod: 31, num: 2 }, skillgood: { mod: 26, num: 1 } },
        "16": { eac: 29, kac: 30, fort: 14, ref: 14, will: 19, hp: 255, abildc: 24, spelldc: 20, modifiers: [10, 7, 5], abilities: 3, skillmaster: { mod: 33, num: 2 }, skillgood: { mod: 28, num: 1 } },
        "17": { eac: 30, kac: 31, fort: 15, ref: 15, will: 20, hp: 285, abildc: 24, spelldc: 20, modifiers: [11, 8, 5], abilities: 3, skillmaster: { mod: 34, num: 2 }, skillgood: { mod: 29, num: 1 } },
        "18": { eac: 31, kac: 32, fort: 16, ref: 16, will: 20, hp: 320, abildc: 25, spelldc: 21, modifiers: [11, 8, 6], abilities: 4, skillmaster: { mod: 36, num: 2 }, skillgood: { mod: 31, num: 1 } },
        "19": { eac: 32, kac: 33, fort: 16, ref: 16, will: 21, hp: 350, abildc: 26, spelldc: 22, modifiers: [11, 9, 6], abilities: 4, skillmaster: { mod: 37, num: 2 }, skillgood: { mod: 32, num: 1 } },
        "20": { eac: 34, kac: 35, fort: 17, ref: 17, will: 22, hp: 395, abildc: 27, spelldc: 23, modifiers: [12, 9, 6], abilities: 4, skillmaster: { mod: 39, num: 2 }, skillgood: { mod: 34, num: 1 } },
        "21": { eac: 35, kac: 36, fort: 18, ref: 18, will: 23, hp: 425, abildc: 27, spelldc: 23, modifiers: [12, 10, 7], abilities: 4, skillmaster: { mod: 40, num: 2 }, skillgood: { mod: 35, num: 1 } },
        "22": { eac: 37, kac: 38, fort: 18, ref: 18, will: 23, hp: 470, abildc: 28, spelldc: 24, modifiers: [13, 10, 7], abilities: 4, skillmaster: { mod: 42, num: 2 }, skillgood: { mod: 37, num: 1 } },
        "23": { eac: 38, kac: 39, fort: 19, ref: 19, will: 24, hp: 510, abildc: 29, spelldc: 25, modifiers: [13, 11, 7], abilities: 4, skillmaster: { mod: 43, num: 2 }, skillgood: { mod: 38, num: 1 } },
        "24": { eac: 40, kac: 41, fort: 20, ref: 20, will: 25, hp: 550, abildc: 30, spelldc: 26, modifiers: [15, 11, 8], abilities: 4, skillmaster: { mod: 45, num: 2 }, skillgood: { mod: 40, num: 1 } },
        "25": { eac: 41, kac: 42, fort: 21, ref: 21, will: 26, hp: 600, abildc: 30, spelldc: 26, modifiers: [15, 12, 8], abilities: 4, skillmaster: { mod: 46, num: 2 }, skillgood: { mod: 41, num: 1 } },

    }
}
SEC.attackImages = {
    "basicM": {
        "default": ["systems/sfrpg/icons/default/bolter-gun.svg"],
        "bite": ["icons/creatures/abilities/mouth-teeth-sharp.webp",
            "icons/creatures/abilities/mouth-teeth-lamprey-red.webp",
            "icons/creatures/abilities/mouth-teeth-long-red.webp",
            "icons/creatures/abilities/mouth-teeth-rows-red.webp"
        ],
        "claw": ["icons/creatures/claws/claw-curved-jagged-gray.webp",
            "icons/creatures/claws/claw-curved-jagged-yellow.webp",
            "icons/creatures/claws/claw-curved-poison-purple.webp",
            "icons/creatures/claws/claw-hooked-curved.webp"
        ],
        "antler": ["icons/creatures/mammals/deer-antlers-blue.webp",
            "icons/creatures/mammals/deer-antlers-glowing-blue.webp",
            "icons/creatures/mammals/deer-antlers-green.webp",
            "icons/creatures/mammals/ox-bull-horned-glowing-orange.webp"
        ],
        "tail": ["icons/creatures/abilities/tail-swipe-green.webp",
        ],
        "sting": ["icons/creatures/abilities/stinger-poison-scorpion-brown.webp",
        ],
        "hoof": ["icons/creatures/mammals/deer-movement-leap-green.webp",
        ],
        "tentacle": ["icons/creatures/tentacles/tentacles-thing-green.webp",
            "icons/creatures/tentacles/tentacle-earth-green.webp",
            "icons/creatures/tentacles/tentacles-octopus-black-pink.webp",
            "icons/creatures/tentacles/tentacles-suctioncups-pink.webp"

        ],
        "wing": ["icons/creatures/abilities/wing-batlike-red-pink.webp",
            "icons/creatures/abilities/wing-batlike-white-blue.webp",
            "icons/creatures/abilities/wing-batlike-purple-blue.webp"
        ],
        "horn": ["icons/creatures/abilities/bull-head-horns-glowing.webp",
            "icons/creatures/mammals/beast-horned-scaled-glowing-orange.webp",
            "icons/creatures/unholy/demon-fanged-horned-yellow.webp"
        ],
        "slam": ["icons/creatures/abilities/paw-print-tan.webp",
            "icons/creatures/claws/claw-bear-paw-swipe-brown.webp",
            "icons/commodities/bones/bone-simple-white-brown.webp"

        ],
        "spit": ["icons/creatures/slimes/slime-movment-dripping-green.webp",
            "icons/creatures/slimes/slime-movement-pseudopods-blue.webp"

        ]
    },
    "advancedM": {
        "default": ["systems/sfrpg/icons/equipment/weapons/cryopike.webp"],
        "boomknuckle": ["systems/sfrpg/icons/equipment/magic%20items/reckless-gloves.webp"],
        "doshko": ["systems/sfrpg/icons/equipment/weapons/doshko.webp"]
    },
    "smallA": {
        "default": ["systems/sfrpg/icons/equipment/weapons/plasma-pistol-red-star.webp"],
        "pistol": ["systems/sfrpg/icons/equipment/weapons/laser-pistol-aphelion.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-pistol-azimuth.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-pistol-corona.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-pistol-perihelion.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-pistol-zenith.webp"],
        "smg": ["systems/sfrpg/icons/equipment/weapons/arc_rifle_static.webp"],

        "needler": ["systems/sfrpg/icons/equipment/weapons/needler-pistol-advanced.webp",
            "systems/sfrpg/icons/equipment/weapons/needler-pistol-elite.webp",
            "systems/sfrpg/icons/equipment/weapons/needler-pistol-paragon.webp",
            "systems/sfrpg/icons/equipment/weapons/needler-pistol-supreme.webp",
            "systems/sfrpg/icons/equipment/weapons/needler-pistol-tactical.webp"]
    },
    "longA": {
        "default": ["systems/sfrpg/icons/equipment/weapons/plasma-claw-electocellular.webp"],
        "rifle": ["systems/sfrpg/icons/equipment/weapons/gamma-rifle-fusion.webp",
            "systems/sfrpg/icons/equipment/weapons/gamma-rifle-ionizing.webp",
            "ssystems/sfrpg/icons/equipment/weapons/gamma-rifle-synchrotron.webp",
            "systems/sfrpg/icons/equipment/weapons/gamma-rifle-terrestrial.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-aphelion.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-azimuth.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-corona.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-perihelion.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-zenith.webp"],
        "laser": ["systems/sfrpg/icons/equipment/weapons/laser-rifle-aphelion.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-azimuth.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-corona.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-perihelion.webp",
            "systems/sfrpg/icons/equipment/weapons/laser-rifle-zenith.webp"],
        "needler": ["systems/sfrpg/icons/equipment/weapons/needler-rifle.webp"],
        "scattergun": ["systems/sfrpg/icons/equipment/weapons/scattergun-snub.webp",
            "systems/sfrpg/icons/equipment/weapons/scattergun-vortex.webp",
            "systems/sfrpg/icons/equipment/weapons/scattergun-grapeshot.webp"
        ],
    },
    "heavy": {
        "default": ["systems/sfrpg/icons/equipment/weapons/artillery-laser-aphelion.webp"]
    },
    "sniper": {
        "default": ["systems/sfrpg/icons/equipment/weapons/shirren-eye-rifle-advanced.webp"]
    },
    "grenade": {
        "default": ["icons/weapons/thrown/grenade-round.webp"]
    },
    "special": {
        "default": ["icons/weapons/thrown/shuriken-double-red.webp"]
    },
    "solarian": {
        "default": ["icons/commodities/gems/gem-rough-cushion-orange-red.webp"]
    }


};

SEC.buildFactors = {
    "frameCost": 0.18,
    "frameUpgrade": 0.3,
    "powerCore": 4,
    "defense": 0.2,
    "offense": 0.3,
    "computer": { base: 0.3, nodes: 2 },
    "sensor": 0.2,
    "weapon": 5,
    "armor": 0.8, // tier + value
    "shields": 0.14,
    "thrusters": 14,
    "sizeFactors": {
        "tiny": {
            arcLimit: 2,
            fixedLimit: ["light"],
            turretLimit: ["light"],
        },

        "small": {
            arcLimit: 2,
            fixedLimit: ["light"],
            turretLimit: ["light"]
        },

        "medium": {
            arcLimit: 3,
            fixedLimit: ["light", "heavy"],
            turretLimit: ["light", "heavy"]
        },
        "large": {
            arcLimit: 4,
            fixedLimit: ["light", "heavy"],
            turretLimit: ["light", "heavy"]
        },

        "huge": {
            arcLimit: 4,
            fixedLimit: ["light", "heavy", "capital"],
            turretLimit: ["light", "heavy"]
        },

        "gargantuan": {
            arcLimit: 4,
            fixedLimit: ["light", "heavy", "capital"],
            turretLimit: ["light", "heavy"]
        },

        "colossal": {
            arcLimit: 4,
            fixedLimit: ["light", "heavy", "capital"],
            turretLimit: ["light", "heavy"]
        }
    }
}
/*

1. Largest hull with turret



PHB 305 
By spending 4 BP, the crew can upgrade a light weapon mount in any of the aft, forward, port, or starboard arcs to a
heavy weapon mount. 

By spending 6 BP, the crew can upgrade a light weapon mount on a turret to a heavy weapon mount. 

By spending 5 Build Points, the crew can upgrade a heavy weapon mount in any of the aft, forward, port, or starboard arcs to a
capital weapon mount. 

Heavy weapons can be mounted on only Medium or larger starships. 

Capital weapons can be mounted on
only Huge or larger starships and can’t be mounted on turrets.

By spending 3 BP, the crew can fit a new light weapon mount
in any of the aft, forward, port, or starboard arcs with enough
free space. 

By spending 5 BP, the crew can fit a new light weapon
mount on a turret that has enough free space. 

Tiny and Small starships can have only two weapon mounts per arc (and per turret). 
Medium and Large starships can have only three weapon mounts per arc (and per turret). 
Huge and larger starships can have only four weapon mounts per arc (and per turret).


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