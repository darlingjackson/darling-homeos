/* ================================================================
DARLING HOMEOS
CLEANING // HOME TOPOLOGY CONTROLLER

FILE:
assets/js/cleaning.js

OWNS:
- Cleaning topology
- Room + Zone mode
- Cleaning protocols
- Cleaning session rendering
- Cleaning Memory presentation

HomeStore owns persistence.
app.css + shell.js own the shared app shell.
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
"use strict";

if (!window.HomeStore || !window.HomeApp) {
console.error("DARLING HomeOS Cleaning requires HomeStore and HomeApp.");
return;
}

const CleaningApp = {
FLOORS: {
"upstairs": {
"name": "Upstairs",
"code": "LVL // 02",
"short": "Master + Kids + Laundry",
"description": "Private living, kids spaces, laundry and linen systems."
},
"main": {
"name": "Main Floor",
"code": "LVL // 01",
"short": "Living + Kitchen + MIL",
"description": "Main living, entertaining, kitchen and guest-suite spaces."
},
"basement": {
"name": "Basement",
"code": "LVL // 00",
"short": "Lower Living + Bedrooms",
"description": "Lower bedrooms, bathroom, living and family recreation spaces."
},
"outdoors": {
"name": "Outdoors",
"code": "EXT // 01",
"short": "Exterior + Garage",
"description": "Porches, decks, yards, outdoor living and garage systems."
}
},

ZONE_DEFAULTS: [
{
"id": "z01",
"code": "Z-01",
"name": "Master Suite",
"icon": "MS",
"color": "#8e63ff",
"description": "Master bedroom, primary bathroom and both walk-in closets."
},
{
"id": "z02",
"code": "Z-02",
"name": "Kids Wing + Den",
"icon": "KD",
"color": "#5b87ff",
"description": "Kids bedrooms, shared bathroom, upstairs den, hall and stairs."
},
{
"id": "z03",
"code": "Z-03",
"name": "Laundry + Linen",
"icon": "LL",
"color": "#22c7e9",
"description": "Laundry room and upstairs linen storage."
},
{
"id": "z04",
"code": "Z-04",
"name": "Main Living + Dining",
"icon": "LD",
"color": "#f15fa9",
"description": "Entryway, formal dining, living room and breakfast nook."
},
{
"id": "z05",
"code": "Z-05",
"name": "Kitchen + Pantry",
"icon": "KP",
"color": "#ff844d",
"description": "Kitchen, pantry, food storage and beverage systems."
},
{
"id": "z06",
"code": "Z-06",
"name": "Mother-in-Law Suite",
"icon": "MI",
"color": "#32cfa6",
"description": "Downstairs guest bedroom and private bathroom."
},
{
"id": "z07",
"code": "Z-07",
"name": "Basement",
"icon": "BS",
"color": "#9b6cff",
"description": "Basement bedrooms, bathroom, living room and commons space."
},
{
"id": "z08",
"code": "Z-08",
"name": "Exterior Living",
"icon": "EX",
"color": "#83c940",
"description": "Front porch, yards, upper deck and under-deck living."
},
{
"id": "z09",
"code": "Z-09",
"name": "Garage",
"icon": "GA",
"color": "#efad3d",
"description": "Garage floor, household storage and utility organization."
}
],

HOME_MAP: [
{
"id": "master-bedroom",
"code": "R-U01",
"name": "Master Bedroom",
"short": "MB",
"floor": "upstairs",
"zoneId": "z01",
"type": "bedroom",
"description": "Primary bedroom and private resting space.",
"grid": [
1,
1,
5,
3
]
},
{
"id": "master-bath",
"code": "R-U02",
"name": "Master Bathroom",
"short": "BA",
"floor": "upstairs",
"zoneId": "z01",
"type": "bathroom",
"description": "Primary bathroom, vanity, shower, tub and private bath surfaces.",
"grid": [
1,
4,
3,
2
]
},
{
"id": "master-closet-one",
"code": "R-U03",
"name": "Walk-In Closet A",
"short": "CA",
"floor": "upstairs",
"zoneId": "z01",
"type": "closet",
"description": "First walk-in closet in the Master Suite.",
"grid": [
4,
4,
2,
2
]
},
{
"id": "master-closet-two",
"code": "R-U04",
"name": "Walk-In Closet B",
"short": "CB",
"floor": "upstairs",
"zoneId": "z01",
"type": "closet",
"description": "Second walk-in closet in the Master Suite.",
"grid": [
1,
6,
2,
2
]
},
{
"id": "kids-bedroom-one",
"code": "R-U05",
"name": "Kids Bedroom A",
"short": "K1",
"floor": "upstairs",
"zoneId": "z02",
"type": "bedroom",
"description": "Kids bedroom and personal storage space.",
"grid": [
7,
1,
3,
2
]
},
{
"id": "kids-bedroom-two",
"code": "R-U06",
"name": "Kids Bedroom B",
"short": "K2",
"floor": "upstairs",
"zoneId": "z02",
"type": "bedroom",
"description": "Kids bedroom and personal storage space.",
"grid": [
10,
1,
3,
2
]
},
{
"id": "kids-shared-bath",
"code": "R-U07",
"name": "Kids Shared Bath",
"short": "KB",
"floor": "upstairs",
"zoneId": "z02",
"type": "bathroom",
"description": "Shared children's bathroom and bath storage.",
"grid": [
7,
3,
3,
2
]
},
{
"id": "kids-bedroom-three",
"code": "R-U08",
"name": "Kids Bedroom C",
"short": "K3",
"floor": "upstairs",
"zoneId": "z02",
"type": "bedroom",
"description": "Kids bedroom and personal storage space.",
"grid": [
10,
3,
3,
2
]
},
{
"id": "upstairs-den",
"code": "R-U09",
"name": "Upstairs Den",
"short": "DN",
"floor": "upstairs",
"zoneId": "z02",
"type": "living",
"description": "Upstairs family den and shared kids living area.",
"grid": [
7,
5,
4,
3
]
},
{
"id": "upstairs-hall-stairs",
"code": "R-U10",
"name": "Hall + Stairs",
"short": "HS",
"floor": "upstairs",
"zoneId": "z02",
"type": "hall",
"description": "Upstairs traffic areas, hallway and carpeted stairs.",
"grid": [
11,
5,
2,
3
]
},
{
"id": "laundry-room",
"code": "R-U11",
"name": "Laundry Room",
"short": "LR",
"floor": "upstairs",
"zoneId": "z03",
"type": "laundry",
"description": "Laundry workspace, machines, folding and supply storage.",
"grid": [
3,
6,
2,
2
]
},
{
"id": "linen-closet",
"code": "R-U12",
"name": "Linen Closet",
"short": "LC",
"floor": "upstairs",
"zoneId": "z03",
"type": "linen",
"description": "Large upstairs linen and household storage closet.",
"grid": [
5,
6,
2,
2
]
},
{
"id": "entryway",
"code": "R-M01",
"name": "Entryway",
"short": "EN",
"floor": "main",
"zoneId": "z04",
"type": "entry",
"description": "Front entry, shoe storage and large mirror.",
"grid": [
1,
1,
3,
2
]
},
{
"id": "formal-dining",
"code": "R-M02",
"name": "Formal Dining Room",
"short": "FD",
"floor": "main",
"zoneId": "z04",
"type": "dining",
"description": "Formal dining and entertaining space.",
"grid": [
4,
1,
4,
2
]
},
{
"id": "living-room",
"code": "R-M03",
"name": "Living Room",
"short": "LV",
"floor": "main",
"zoneId": "z04",
"type": "living",
"description": "Main family living and gathering space.",
"grid": [
8,
1,
5,
4
]
},
{
"id": "breakfast-nook",
"code": "R-M04",
"name": "Breakfast Nook",
"short": "BN",
"floor": "main",
"zoneId": "z04",
"type": "dining",
"description": "Everyday dining space connected to the kitchen.",
"grid": [
6,
5,
3,
2
]
},
{
"id": "kitchen",
"code": "R-M05",
"name": "Kitchen",
"short": "KT",
"floor": "main",
"zoneId": "z05",
"type": "kitchen",
"description": "Kitchen work surfaces, appliances, cabinets and food-prep systems.",
"grid": [
1,
3,
5,
3
]
},
{
"id": "walk-in-pantry",
"code": "R-M06",
"name": "Walk-In Pantry",
"short": "PN",
"floor": "main",
"zoneId": "z05",
"type": "pantry",
"description": "Food storage, household backstock and beverage mini fridge.",
"grid": [
1,
6,
5,
2
]
},
{
"id": "mil-bedroom",
"code": "R-M07",
"name": "Mother-in-Law Bedroom",
"short": "MI",
"floor": "main",
"zoneId": "z06",
"type": "bedroom",
"description": "Private downstairs guest-suite bedroom.",
"grid": [
9,
5,
4,
2
]
},
{
"id": "mil-bath",
"code": "R-M08",
"name": "Mother-in-Law Bath",
"short": "MB",
"floor": "main",
"zoneId": "z06",
"type": "bathroom",
"description": "Private bathroom serving the Mother-in-Law Suite.",
"grid": [
9,
7,
4,
1
]
},
{
"id": "basement-bedroom-one",
"code": "R-B01",
"name": "Basement Bedroom A",
"short": "B1",
"floor": "basement",
"zoneId": "z07",
"type": "bedroom",
"description": "Lower-level bedroom and storage space.",
"grid": [
1,
1,
3,
3
]
},
{
"id": "basement-bedroom-two",
"code": "R-B02",
"name": "Basement Bedroom B",
"short": "B2",
"floor": "basement",
"zoneId": "z07",
"type": "bedroom",
"description": "Second lower-level bedroom and storage space.",
"grid": [
1,
4,
3,
3
]
},
{
"id": "basement-bath",
"code": "R-B03",
"name": "Basement Bathroom",
"short": "BB",
"floor": "basement",
"zoneId": "z07",
"type": "bathroom",
"description": "Lower-level shared bathroom.",
"grid": [
4,
1,
3,
2
]
},
{
"id": "basement-living",
"code": "R-B04",
"name": "Basement Living Room",
"short": "BL",
"floor": "basement",
"zoneId": "z07",
"type": "living",
"description": "Lower-level family living and lounge space.",
"grid": [
7,
1,
6,
3
]
},
{
"id": "basement-commons",
"code": "R-B05",
"name": "Game + Commons Room",
"short": "GM",
"floor": "basement",
"zoneId": "z07",
"type": "living",
"description": "Large recreation, game and family commons area.",
"grid": [
4,
4,
9,
4
]
},
{
"id": "front-porch",
"code": "R-O01",
"name": "Front Porch",
"short": "FP",
"floor": "outdoors",
"zoneId": "z08",
"type": "outdoor",
"description": "Covered front entry and porch area.",
"grid": [
1,
1,
4,
2
]
},
{
"id": "front-yard",
"code": "R-O02",
"name": "Front Yard",
"short": "FY",
"floor": "outdoors",
"zoneId": "z08",
"type": "outdoor",
"description": "Front lawn, walkway and visible exterior areas.",
"grid": [
1,
3,
4,
3
]
},
{
"id": "upper-deck",
"code": "R-O03",
"name": "Upper Deck",
"short": "UD",
"floor": "outdoors",
"zoneId": "z08",
"type": "outdoor",
"description": "Upper outdoor deck and seating area.",
"grid": [
5,
1,
4,
3
]
},
{
"id": "under-deck",
"code": "R-O04",
"name": "Under-Deck Living",
"short": "LD",
"floor": "outdoors",
"zoneId": "z08",
"type": "outdoor",
"description": "Covered outdoor living space beneath the deck.",
"grid": [
5,
4,
4,
3
]
},
{
"id": "backyard",
"code": "R-O05",
"name": "Backyard",
"short": "BY",
"floor": "outdoors",
"zoneId": "z08",
"type": "outdoor",
"description": "Fenced backyard and family outdoor space.",
"grid": [
9,
1,
4,
4
]
},
{
"id": "garage",
"code": "R-O06",
"name": "Garage",
"short": "GA",
"floor": "outdoors",
"zoneId": "z09",
"type": "garage",
"description": "Garage floor, storage and utility organization.",
"grid": [
9,
5,
4,
3
]
}
],

TASK_LIBRARY: {
"bedroom": {
"quick": [
"Make or straighten bed",
"Collect dirty laundry",
"Put away visible items",
"Clear nightstands and dresser tops",
"Empty trash",
"Quick vacuum or floor pickup"
],
"standard": [
"Dust furniture and decor",
"Wipe mirrors",
"Wipe switches, handles and touchpoints",
"Vacuum room thoroughly",
"Clean visible baseboard trouble spots",
"Reset pillows, blankets and decor"
],
"deep": [
"Vacuum under bed",
"Move accessible furniture and clean underneath",
"Clean all baseboards",
"Dust vents and ceiling fixtures",
"Clean doors and trim",
"Clean windows and window sills",
"Dust blinds",
"Review items for decluttering",
"Organize one drawer or storage area"
]
},
"bathroom": {
"quick": [
"Clear vanity and counters",
"Wipe sink and faucet",
"Clean toilet",
"Straighten towels",
"Empty trash",
"Quick floor reset"
],
"standard": [
"Clean mirror",
"Disinfect vanity and counters",
"Scrub sink",
"Clean toilet completely",
"Clean tub and/or shower",
"Wipe fixtures",
"Vacuum and mop floor",
"Restock bathroom essentials"
],
"deep": [
"Deep scrub shower and tub",
"Clean grout and corners",
"Clean shower glass or curtain area",
"Wipe cabinet fronts",
"Clean inside vanity drawers as needed",
"Clean baseboards",
"Clean doors and trim",
"Dust vents and exhaust fan",
"Declutter bathroom products",
"Check product inventory and backstock"
]
},
"closet": {
"quick": [
"Return clothing to proper place",
"Pick items up from floor",
"Straighten shoes",
"Collect laundry",
"Reset visible shelves"
],
"standard": [
"Dust exposed shelves",
"Straighten hanging clothing",
"Organize shoes",
"Vacuum floor",
"Reset accessories and storage bins"
],
"deep": [
"Review clothing for purge or donation",
"Clean all shelving",
"Vacuum edges and corners",
"Clean baseboards",
"Wipe closet doors and trim",
"Reorganize storage bins",
"Review seasonal clothing",
"Remove items that no longer belong"
]
},
"living": {
"quick": [
"Collect items that belong elsewhere",
"Reset pillows and blankets",
"Clear tables and visible surfaces",
"Remove trash and cups",
"Quick floor pickup"
],
"standard": [
"Dust furniture and decor",
"Wipe tables and hard surfaces",
"Clean mirrors or glass surfaces",
"Vacuum upholstery as needed",
"Vacuum or mop floor",
"Wipe switches and touchpoints"
],
"deep": [
"Move accessible furniture and clean underneath",
"Vacuum under cushions",
"Clean baseboards",
"Dust vents and ceiling fixtures",
"Clean windows and sills",
"Dust blinds or curtains",
"Clean doors and trim",
"Declutter storage and media areas",
"Review decor and remove unnecessary items"
]
},
"hall": {
"quick": [
"Remove items from hall and stairs",
"Straighten visible surfaces",
"Quick stair pickup",
"Spot vacuum high-traffic areas"
],
"standard": [
"Vacuum hallway",
"Vacuum stairs thoroughly",
"Wipe railing",
"Wipe switches and touchpoints",
"Dust visible ledges"
],
"deep": [
"Clean baseboards",
"Clean stair edges",
"Clean railing and spindles thoroughly",
"Clean walls and scuff marks",
"Dust vents",
"Clean doors and trim"
]
},
"laundry": {
"quick": [
"Clear folding surfaces",
"Put away laundry supplies",
"Remove empty containers",
"Sweep visible debris",
"Reset laundry baskets"
],
"standard": [
"Wipe counters and shelving",
"Wipe machine exteriors",
"Dust surfaces",
"Vacuum or sweep floor",
"Mop floor",
"Organize laundry products"
],
"deep": [
"Clean behind and beside machines where accessible",
"Clean baseboards",
"Wipe cabinet and shelf fronts",
"Declutter laundry products",
"Clean doors and trim",
"Review laundry supply inventory"
]
},
"linen": {
"quick": [
"Refold loose linens",
"Return misplaced items",
"Straighten shelves",
"Remove empty packaging"
],
"standard": [
"Organize towels by category",
"Organize sheets and bedding",
"Dust accessible shelving",
"Vacuum closet floor"
],
"deep": [
"Remove all items shelf by shelf",
"Wipe shelving",
"Purge worn or unused linens",
"Match sheet sets",
"Reorganize household backstock",
"Review household supply inventory"
]
},
"entry": {
"quick": [
"Put shoes in proper storage",
"Remove items that belong elsewhere",
"Straighten entry decor",
"Wipe visible mirror spots",
"Quick floor pickup"
],
"standard": [
"Clean mirror",
"Dust entry furniture and decor",
"Wipe door handles and switches",
"Vacuum or mop floor",
"Clean front-door interior"
],
"deep": [
"Clean baseboards",
"Clean front door and trim",
"Clean walls and scuff marks",
"Organize shoe storage",
"Declutter entry storage",
"Clean corners and edges"
]
},
"dining": {
"quick": [
"Clear table",
"Return misplaced items",
"Reset chairs",
"Straighten table decor",
"Quick floor pickup"
],
"standard": [
"Clean table and chairs",
"Dust furniture and decor",
"Clean mirrors or glass",
"Wipe switches and touchpoints",
"Vacuum or mop floor"
],
"deep": [
"Clean chair legs and bases",
"Clean table base",
"Clean baseboards",
"Dust light fixture",
"Clean windows and sills",
"Clean curtains or blinds as appropriate",
"Clean doors and trim",
"Declutter dining storage"
]
},
"kitchen": {
"quick": [
"Load or unload dishwasher",
"Clear counters",
"Wipe counters",
"Wipe stovetop",
"Clean sink",
"Put food and dishes away",
"Quick floor sweep"
],
"standard": [
"Clean appliance exteriors",
"Clean microwave exterior and interior",
"Wipe cabinet trouble spots",
"Clean backsplash",
"Disinfect counters",
"Clean sink and faucet thoroughly",
"Vacuum or sweep floor",
"Mop floor",
"Empty trash and recycling"
],
"deep": [
"Wipe all cabinet fronts",
"Clean cabinet handles",
"Clean dishwasher interior/filter",
"Deep clean stovetop",
"Clean oven as needed",
"Clean refrigerator exterior",
"Clean kitchen freezer exterior",
"Clean under movable counter appliances",
"Clean baseboards",
"Clean doors and trim",
"Dust vents and light fixtures",
"Review refrigerator inventory",
"Review kitchen freezer inventory",
"Discard expired food",
"Add needed items to shopping list"
]
},
"pantry": {
"quick": [
"Return food to correct zones",
"Straighten shelves",
"Remove empty boxes and packaging",
"Clear pantry floor",
"Reset beverage area"
],
"standard": [
"Group similar foods together",
"Wipe visible shelf spills",
"Organize household backstock",
"Organize beverage mini fridge area",
"Sweep and mop pantry floor"
],
"deep": [
"Work shelf by shelf",
"Remove items and wipe shelves",
"Check expiration dates",
"Discard expired food",
"Consolidate duplicate open packages",
"Review pantry inventory",
"Review beverage mini fridge inventory",
"Clean mini fridge interior",
"Clean pantry baseboards",
"Clean doors and trim",
"Reorganize food categories",
"Update quantities in Home Inventory",
"Add shortages to shopping list"
]
},
"outdoor": {
"quick": [
"Collect outdoor trash and stray items",
"Straighten furniture",
"Shake or reset outdoor mats",
"Clear visible debris"
],
"standard": [
"Sweep hard surfaces",
"Wipe outdoor furniture",
"Clean tables",
"Wipe railings",
"Reset outdoor decor"
],
"deep": [
"Deep sweep corners and edges",
"Wash outdoor furniture",
"Clean railings thoroughly",
"Clean exterior doors",
"Clean exterior windows where accessible",
"Remove cobwebs",
"Review damaged or unused outdoor items",
"Organize outdoor storage"
]
},
"garage": {
"quick": [
"Return tools and supplies to storage",
"Remove trash",
"Clear walking paths",
"Quick floor sweep"
],
"standard": [
"Organize visible storage",
"Sweep garage floor",
"Wipe work surfaces",
"Consolidate loose household items"
],
"deep": [
"Sort garage storage by category",
"Purge trash and donation items",
"Clean shelving",
"Sweep floor edges and corners",
"Clean garage doors where accessible",
"Review household backstock",
"Review seasonal storage",
"Reorganize frequently used items"
]
}
},

selectedFloor: "upstairs",
selectedRoomId: "master-bedroom",
selectedZoneId: "z01",
cleaningMode: "room",
pendingTarget: null,
recommendedRoomId: null,
clockTimer: null,

init() {
this.ensureCleaningSetup();
this.readQueryString();
this.bindEvents();
this.bindStateEvents();
this.render();
this.startClock();
},

ensureCleaningSetup() {
const state = HomeStore.getState();
state.cleaning = state.cleaning && typeof state.cleaning === "object"
? state.cleaning
: {};

const savedZones = Array.isArray(state.cleaning.zones)
? state.cleaning.zones
: [];

state.cleaning.zones = this.ZONE_DEFAULTS.map(base => {
const saved = savedZones.find(zone => zone.id === base.id) || {};
return {
...base,
...saved,
id: base.id,
code: saved.code || base.code,
name: saved.name || base.name,
icon: saved.icon || base.icon,
color: saved.color || base.color,
description: saved.description || base.description,
progress: Number(saved.progress ?? 80),
status: saved.status || "STABLE",
lastQuickAt: saved.lastQuickAt || null,
lastStandardAt: saved.lastStandardAt || null,
lastDeepAt: saved.lastDeepAt || null
};
});

const savedRooms = Array.isArray(state.cleaning.rooms)
? state.cleaning.rooms
: [];

state.cleaning.rooms = this.HOME_MAP.map(mapRoom => {
const saved = savedRooms.find(room => room.id === mapRoom.id) || {};
const zone = state.cleaning.zones.find(item => item.id === mapRoom.zoneId);
const rawState = Number(saved.cleanState ?? zone?.progress ?? 80);
const cleanState = Number.isFinite(rawState)
? Math.max(0, Math.min(100, rawState))
: 80;

return {
...saved,
...mapRoom,
cleanState,
lastQuickAt: saved.lastQuickAt || null,
lastStandardAt: saved.lastStandardAt || null,
lastDeepAt: saved.lastDeepAt || null
};
});

state.cleaning.history = Array.isArray(state.cleaning.history)
? state.cleaning.history
: [];
state.cleaning.pausedSessions = Array.isArray(state.cleaning.pausedSessions)
? state.cleaning.pausedSessions
: [];
state.cleaning.activeSession = state.cleaning.activeSession || null;
state.activity = Array.isArray(state.activity) ? state.activity : [];

if (!this.FLOORS[state.cleaning.selectedFloor]) {
state.cleaning.selectedFloor = "upstairs";
}

if (!["room", "zone"].includes(state.cleaning.cleaningMode)) {
state.cleaning.cleaningMode = "room";
}

const savedRoom = state.cleaning.rooms.find(
room => room.id === state.cleaning.selectedRoomId
);
const savedZone = state.cleaning.zones.find(
zone => zone.id === state.cleaning.selectedZone
);

this.selectedFloor = savedRoom?.floor || state.cleaning.selectedFloor;
this.selectedRoomId = savedRoom?.id ||
state.cleaning.rooms.find(room => room.floor === this.selectedFloor)?.id ||
state.cleaning.rooms[0]?.id ||
null;
this.selectedZoneId = savedZone?.id ||
state.cleaning.rooms.find(room => room.id === this.selectedRoomId)?.zoneId ||
state.cleaning.zones[0]?.id ||
"z01";
this.cleaningMode = state.cleaning.cleaningMode;

state.cleaning.selectedFloor = this.selectedFloor;
state.cleaning.selectedRoomId = this.selectedRoomId;
state.cleaning.selectedZone = this.selectedZoneId;

this.recalculateAllZones(state);
HomeStore.saveState(state);
},

readQueryString() {
const params = new URLSearchParams(window.location.search);
const requestedZone = params.get("zone");
const requestedRoom = params.get("room");
const state = HomeStore.getState();
let changed = false;

if (
requestedZone &&
state.cleaning.zones.some(zone => zone.id === requestedZone)
) {
this.selectedZoneId = requestedZone;
this.cleaningMode = "zone";
state.cleaning.selectedZone = requestedZone;
state.cleaning.cleaningMode = "zone";
changed = true;
}

if (requestedRoom) {
const room = state.cleaning.rooms.find(item => item.id === requestedRoom);
if (room) {
this.selectedRoomId = room.id;
this.selectedFloor = room.floor;
this.selectedZoneId = room.zoneId;
this.cleaningMode = "room";
state.cleaning.selectedRoomId = room.id;
state.cleaning.selectedFloor = room.floor;
state.cleaning.selectedZone = room.zoneId;
state.cleaning.cleaningMode = "room";
changed = true;
}
}

if (changed) HomeStore.saveState(state);
},

bindStateEvents() {
window.addEventListener("homeos:statechange", event => {
const state = event.detail || HomeStore.getState();

if (this.FLOORS[state.cleaning?.selectedFloor]) {
this.selectedFloor = state.cleaning.selectedFloor;
}
if (["room", "zone"].includes(state.cleaning?.cleaningMode)) {
this.cleaningMode = state.cleaning.cleaningMode;
}
if (state.cleaning?.rooms?.some(room => room.id === state.cleaning.selectedRoomId)) {
this.selectedRoomId = state.cleaning.selectedRoomId;
}
if (state.cleaning?.zones?.some(zone => zone.id === state.cleaning.selectedZone)) {
this.selectedZoneId = state.cleaning.selectedZone;
}

this.render(state);

const dialog = document.getElementById("cleaningDialog");
if (dialog?.open && state.cleaning.activeSession) {
this.showSessionScreen(state.cleaning.activeSession);
}
});
},

render(providedState = null) {
const state = providedState || HomeStore.getState();
this.renderHero(state);
this.renderGuide(state);
this.renderActiveSession(state);
this.renderMode();
this.renderFloorTabs(state);
this.renderRoomMap(state);
this.renderSelectedRoom(state);
this.renderZoneGrid(state);
this.renderSelectedZone(state);
this.renderHistory(state);
},

startClock() {
this.renderDate();
if (this.clockTimer) clearInterval(this.clockTimer);
this.clockTimer = setInterval(() => this.renderDate(), 1000);
},

renderDate() {
const now = new Date();
this.setText(
"cleaningDateTime",
`${HomeApp.formatDate(now)} · ${HomeApp.formatTime(now)}`
);
},

renderHero(state) {
this.setText("mappedSpaceCount", state.cleaning.rooms.length);
this.setText("zoneCount", String(state.cleaning.zones.length).padStart(2, "0"));
this.setText("heroCurrentFloor", this.FLOORS[this.selectedFloor]?.name || "Home");
this.setText("heroActiveCleaning", state.cleaning.activeSession ? "Active" : "None");
},

renderGuide(state) {
const rooms = state.cleaning.rooms || [];
const homeScore = rooms.length
? Math.round(
rooms.reduce((sum, room) => sum + Number(room.cleanState || 0), 0) /
rooms.length
)
: 100;

const priority = { deep: 3, standard: 2, quick: 1 };
const recommended = [...rooms].sort((a, b) => {
const levelDiff =
priority[this.getSuggestedLevel(b)] -
priority[this.getSuggestedLevel(a)];
return levelDiff || Number(a.cleanState || 0) - Number(b.cleanState || 0);
})[0] || null;

const attention = rooms.filter(room =>
this.getSuggestedLevel(room) !== "quick" || Number(room.cleanState || 0) < 82
);
const active = state.cleaning.activeSession;
const button = document.getElementById("guidePrimaryAction");

this.recommendedRoomId = recommended?.id || null;
this.setText("homeCleanScore", `${homeScore}%`);
this.setText("roomsAttentionCount", attention.length);

if (active) {
this.setText("cleaningGuideStatus", "SESSION ACTIVE");
this.setText(
"cleaningGuideMessage",
`${active.targetName} is still in progress. Your checklist is saved exactly where you left it.`
);
if (button) {
button.textContent = "RESUME ACTIVE CLEAN →";
button.dataset.guideAction = "resume";
delete button.dataset.roomId;
}
return;
}

if (!recommended) {
this.setText("cleaningGuideStatus", "READY");
this.setText(
"cleaningGuideMessage",
"Home topology is online. Choose a room or zone when you are ready to clean."
);
if (button) {
button.textContent = "OPEN ROOM MODE →";
button.dataset.guideAction = "room-mode";
delete button.dataset.roomId;
}
return;
}

const level = this.getSuggestedLevel(recommended);
const zone = state.cleaning.zones.find(item => item.id === recommended.zoneId);

this.setText(
"cleaningGuideStatus",
level === "deep" ? "ATTENTION" : level === "standard" ? "NEXT UP" : "STABLE"
);
this.setText(
"cleaningGuideMessage",
`${recommended.name} is the best next target. HomeOS recommends a ${this.titleCase(level)} Clean${zone ? ` in ${zone.name}` : ""}.`
);

if (button) {
button.textContent = `START ${recommended.name.toUpperCase()} →`;
button.dataset.guideAction = "recommended";
button.dataset.roomId = recommended.id;
}
},

renderActiveSession(state) {
const strip = document.getElementById("activeCleaningStrip");
const session = state.cleaning.activeSession;
if (!strip) return;

if (!session) {
strip.classList.add("is-hidden");
return;
}

strip.classList.remove("is-hidden");
const progress = this.getSessionProgress(session);

this.setText(
"activeCleaningTitle",
`${session.targetName} · ${this.titleCase(session.level)}`
);

this.setText(
"activeCleaningDetail",
`${progress.complete} of ${progress.total} tasks complete · progress saved`
);

this.setText(
"activeCleaningPercent",
`${progress.percent}%`
);

const bar =
document.getElementById(
"activeCleaningBar"
);

if (bar) {
bar.style.width =
`${progress.percent}%`;
}
},

renderMode() {
document
.querySelectorAll(
"[data-cleaning-mode]"
)
.forEach(button => {
button.classList.toggle(
"active",
button.dataset.cleaningMode ===
this.cleaningMode
);
});

document
.getElementById(
"roomModeWorkspace"
)
?.classList.toggle(
"is-hidden",
this.cleaningMode !==
"room"
);

document
.getElementById(
"zoneModeWorkspace"
)
?.classList.toggle(
"is-hidden",
this.cleaningMode !==
"zone"
);
},

renderFloorTabs(state) {
const container =
document.getElementById(
"floorTabs"
);

if (!container) {
return;
}

const order = [
"upstairs",
"main",
"basement",
"outdoors"
];

container.innerHTML =
order
.map(floorId => {
const floor =
this.FLOORS[
floorId
];

const rooms =
state.cleaning
.rooms
.filter(
room =>
room.floor ===
floorId
);

const average =
this.averageRooms(
rooms
);

const status =
this.statusFromScore(
average
);

const active =
floorId ===
this.selectedFloor;

return `
<button
class="floor-tab ${active ? "active" : ""}"
type="button"
data-floor="${floorId}"
aria-pressed="${active}"
>

<div class="floor-tab-top">

<span class="floor-tab-code">
${floor.code}
</span>

<span class="floor-tab-status">
<i></i>
${status}
</span>

</div>


<div class="floor-tab-core">

<strong>
${floor.name}
</strong>

<span class="floor-tab-arrow">
→
</span>

</div>


<p class="floor-tab-description">
${floor.short}
</p>


<div class="floor-tab-metrics">

<span>
<strong>
${String(rooms.length).padStart(2, "0")}
</strong>
SPACES
</span>

<span>
<strong>
${average}%
</strong>
CLEAN
</span>

</div>


<div
class="floor-tab-track"
aria-hidden="true"
>
<span
style="width: ${average}%;"
></span>
</div>

</button>
`;
})
.join("");

const floor =
this.FLOORS[
this.selectedFloor
];

const floorRooms =
state.cleaning
.rooms
.filter(
room =>
room.floor ===
this.selectedFloor
);

const floorAverage =
this.averageRooms(
floorRooms
);

this.setText(
"mapLevelCode",
floor?.code ||
"LEVEL"
);

this.setText(
"mapFloorTitle",
floor?.name ||
"Home"
);

this.setText(
"mapFloorDescription",
floor?.description ||
""
);

this.setText(
"floorStateLabel",
this.statusFromScore(
floorAverage
)
);

this.setText(
"heroCurrentFloor",
floor?.name ||
"Home"
);
},

renderRoomMap(state) {
const container =
document.getElementById(
"roomMap"
);

if (!container) {
return;
}

const rooms =
state.cleaning
.rooms
.filter(
room =>
room.floor ===
this.selectedFloor
);

if (
!rooms.some(
room =>
room.id ===
this.selectedRoomId
)
) {
this.selectedRoomId =
rooms[0]?.id ||
null;
}

container.innerHTML =
rooms
.map(room => {
const zone =
state.cleaning
.zones
.find(
item =>
item.id ===
room.zoneId
);

const [
col,
row,
width,
height
] =
room.grid;

const selected =
room.id ===
this.selectedRoomId;

return `
<button
class="room-tile ${selected ? "selected" : ""}"
type="button"
data-room-id="${room.id}"
style="
--room-color: ${zone?.color || "#8e63ff"};
grid-column: ${col} / span ${width};
grid-row: ${row} / span ${height};
"
>

<div class="room-tile-top">

<span class="room-tile-icon">
${HomeApp.escapeHtml(room.short)}
</span>

<span class="room-tile-code">
${HomeApp.escapeHtml(room.code)}
</span>

</div>


<h3>
${HomeApp.escapeHtml(room.name)}
</h3>


<div class="room-tile-bottom">

<span class="room-tile-zone">
${HomeApp.escapeHtml(zone?.code || "")}
</span>

<strong class="room-tile-score">
${Number(room.cleanState || 0)}%
</strong>

</div>

</button>
`;
})
.join("");
},

renderSelectedRoom(state) {
const room =
state.cleaning
.rooms
.find(
item =>
item.id ===
this.selectedRoomId
);

if (!room) {
return;
}

const zone =
state.cleaning
.zones
.find(
item =>
item.id ===
room.zoneId
);

this.setText(
"selectedRoomCode",
room.code
);

this.setText(
"selectedRoomIcon",
room.short
);

this.setText(
"selectedRoomName",
room.name
);

this.setText(
"selectedRoomZone",
`${zone?.code || ""} · ${zone?.name || ""}`
);

this.setText(
"selectedRoomDescription",
room.description
);

this.setText(
"selectedRoomState",
`${room.cleanState}%`
);

this.setText(
"selectedRoomSuggested",
this.getSuggestedLevel(room)
.toUpperCase()
);

this.setText(
"selectedRoomQuick",
HomeApp.formatLastCompleted(
room.lastQuickAt
)
);

this.setText(
"selectedRoomStandard",
HomeApp.formatLastCompleted(
room.lastStandardAt
)
);

this.setText(
"selectedRoomDeep",
HomeApp.formatLastCompleted(
room.lastDeepAt
)
);

this.setText(
"selectedRoomFloor",
this.FLOORS[
room.floor
]?.name ||
room.floor
);

const accent =
document.getElementById(
"selectedRoomAccent"
);

const icon =
document.getElementById(
"selectedRoomIcon"
);

if (accent) {
accent.style.background =
zone?.color ||
"var(--cleaning)";
}

if (icon) {
icon.style.color =
zone?.color ||
"var(--cleaning)";
}
},

renderZoneGrid(state) {
const container =
document.getElementById(
"zoneCleaningGrid"
);

if (!container) {
return;
}

container.innerHTML =
state.cleaning
.zones
.map(zone => {
const rooms =
state.cleaning
.rooms
.filter(
room =>
room.zoneId ===
zone.id
);

const progress =
this.averageRooms(
rooms
);

const status =
this.statusFromScore(
progress
);

return `
<button
class="zone-cleaning-card ${zone.id === this.selectedZoneId ? "selected" : ""}"
type="button"
data-cleaning-zone="${zone.id}"
style="--zone-color: ${zone.color};"
>

<div class="zone-cleaning-card-top">

<span class="zone-cleaning-card-icon">
${HomeApp.escapeHtml(zone.icon || "Z")}
</span>

<span class="zone-cleaning-card-code">
${HomeApp.escapeHtml(zone.code)}
</span>

</div>


<h3>
${HomeApp.escapeHtml(zone.name)}
</h3>

<p>
${rooms.length}
mapped
${rooms.length === 1 ? "space" : "spaces"}
</p>


<div class="zone-cleaning-card-footer">

<span>
${status}
</span>

<strong>
${progress}%
</strong>

</div>

</button>
`;
})
.join("");
},

renderSelectedZone(state) {
const zone =
state.cleaning
.zones
.find(
item =>
item.id ===
this.selectedZoneId
);

if (!zone) {
return;
}

const rooms =
state.cleaning
.rooms
.filter(
room =>
room.zoneId ===
zone.id
);

const progress =
this.averageRooms(
rooms
);

const recommendation =
this.getSuggestedLevel({
cleanState:
progress,

lastQuickAt:
zone.lastQuickAt,

lastStandardAt:
zone.lastStandardAt,

lastDeepAt:
zone.lastDeepAt
});

this.setText(
"selectedZoneCode",
zone.code
);

this.setText(
"selectedZoneName",
zone.name
);

this.setText(
"selectedZoneDescription",
zone.description
);

this.setText(
"selectedZoneState",
`${progress}%`
);

this.setText(
"selectedZoneRooms",
rooms.length
);

this.setText(
"selectedZoneSuggested",
recommendation
.toUpperCase()
);

this.setText(
"selectedZoneStatus",
this.statusFromScore(
progress
)
);

const accent =
document.getElementById(
"selectedZoneAccent"
);

if (accent) {
accent.style.background =
zone.color;
}

const list =
document.getElementById(
"selectedZoneRoomList"
);

if (list) {
list.innerHTML =
rooms
.map(
room => `
<span>
${HomeApp.escapeHtml(room.name)}
</span>
`
)
.join("");
}
},

renderHistory(state) {
const container =
document.getElementById(
"cleaningHistoryList"
);

if (!container) {
return;
}

const history =
(
state.cleaning
.history ||
[]
)
.slice(
0,
8
);

if (!history.length) {
container.innerHTML = `

<div class="cleaning-memory-empty">

<div class="cleaning-memory-empty-visual">

<div class="cleaning-memory-orbit">
<span></span>
<i>✦</i>
</div>

</div>


<div class="cleaning-memory-empty-copy">

<span class="ui-kicker">
MEMORY NODE // READY
</span>

<h3>
Cleaning memory is ready.
</h3>

<p>
Complete your first Quick, Standard or
Deep Clean and HomeOS will begin building
a history for this home.
</p>

</div>


<div class="cleaning-memory-empty-readout">

<span>
COMPLETED PROTOCOLS
</span>

<strong>
00
</strong>

<div>
<i></i>
MEMORY ONLINE
</div>

</div>

</div>
`;

return;
}

container.innerHTML =
history
.map(
item => `

<article class="cleaning-history-row">

<span class="cleaning-history-icon">
✓
</span>


<div class="cleaning-history-main">

<span class="cleaning-history-system">
CLEANING MEMORY
</span>

<h3>
${HomeApp.escapeHtml(item.targetName)}
</h3>

<p>
${this.titleCase(item.level)}
Clean ·
${item.taskCount}
tasks
</p>

</div>


<div class="cleaning-history-meta">

<span>
TYPE
</span>

<strong>
${item.targetType === "zone" ? "ZONE" : "ROOM"}
</strong>

</div>


<div class="cleaning-history-meta">

<span>
FINISHED
</span>

<strong>
${this.formatDateTime(item.completedAt)}
</strong>

</div>

</article>
`
)
.join("");
},

getSuggestedLevel(target) {
if (
target.lastDeepAt &&
this.daysSince(
target.lastDeepAt
) >= 60
) {
return "deep";
}

if (
target.lastStandardAt &&
this.daysSince(
target.lastStandardAt
) >= 10
) {
return "standard";
}

if (
target.lastQuickAt &&
this.daysSince(
target.lastQuickAt
) >= 3
) {
return "quick";
}

if (
Number(
target.cleanState ||
0
) < 65
) {
return "deep";
}

if (
Number(
target.cleanState ||
0
) < 82
) {
return "standard";
}

return "quick";
},

openCleaningForRoom() {
const state =
HomeStore.getState();

const room =
state.cleaning
.rooms
.find(
item =>
item.id ===
this.selectedRoomId
);

if (!room) {
return;
}

this.pendingTarget = {
type:
"room",

id:
room.id,

name:
room.name,

zoneId:
room.zoneId
};

this.openCleaningDialog();
},

openCleaningForZone() {
const state =
HomeStore.getState();

const zone =
state.cleaning
.zones
.find(
item =>
item.id ===
this.selectedZoneId
);

if (!zone) {
return;
}

this.pendingTarget = {
type:
"zone",

id:
zone.id,

name:
zone.name,

zoneId:
zone.id
};

this.openCleaningDialog();
},

openCleaningDialog() {
const dialog =
document.getElementById(
"cleaningDialog"
);

const state =
HomeStore.getState();

const active =
state.cleaning
.activeSession;

if (
!dialog ||
!this.pendingTarget
) {
return;
}

if (
active &&
active.targetType ===
this.pendingTarget.type &&
active.targetId ===
this.pendingTarget.id
) {
this.showSessionScreen(
active
);

if (!dialog.open) {
dialog.showModal();
}

return;
}

this.setText(
"cleaningDialogKicker",
this.pendingTarget.type ===
"zone"
? "ZONE CLEANING"
: "ROOM CLEANING"
);

this.setText(
"cleaningDialogTitle",
this.pendingTarget.name
);

let level =
"standard";

if (
this.pendingTarget.type ===
"room"
) {
const room =
state.cleaning
.rooms
.find(
item =>
item.id ===
this.pendingTarget.id
);

if (room) {
level =
this.getSuggestedLevel(
room
);
}
}

else {
const zone =
state.cleaning
.zones
.find(
item =>
item.id ===
this.pendingTarget.id
);

const rooms =
state.cleaning
.rooms
.filter(
room =>
room.zoneId ===
this.pendingTarget.id
);

if (zone) {
level =
this.getSuggestedLevel({
cleanState:
this.averageRooms(
rooms
),

lastQuickAt:
zone.lastQuickAt,

lastStandardAt:
zone.lastStandardAt,

lastDeepAt:
zone.lastDeepAt
});
}
}

this.setText(
"cleaningProtocolRecommendation",
`HomeOS recommends a ${this.titleCase(level)} Clean for this target. You can choose any level below.`
);

document
.querySelectorAll(
"[data-cleaning-level]"
)
.forEach(
card => {
card.classList.toggle(
"recommended",
card.dataset.cleaningLevel ===
level
);
}
);

document
.getElementById(
"cleaningLevelScreen"
)
?.classList
.remove(
"is-hidden"
);

document
.getElementById(
"cleaningTaskScreen"
)
?.classList
.add(
"is-hidden"
);

if (!dialog.open) {
dialog.showModal();
}
},

startCleaningSession(level) {
if (
!this.pendingTarget ||
![
"quick",
"standard",
"deep"
]
.includes(
level
)
) {
return;
}

const state =
HomeStore.getState();

const current =
state.cleaning
.activeSession;

if (
current &&
(
current.targetId !==
this.pendingTarget.id ||
current.targetType !==
this.pendingTarget.type
)
) {
const replace =
window.confirm(
`You already have ${current.targetName} in progress. Start ${this.pendingTarget.name} instead? Your current progress will stay saved and HomeOS will bring it back after this clean is finished.`
);

if (!replace) {
return;
}
}

const tasks =
this.generateTasks(
this.pendingTarget.type,
this.pendingTarget.id,
level,
state
);

if (!tasks.length) {
HomeApp.toast(
"HomeOS could not build a checklist for this space."
);

return;
}

const now =
new Date()
.toISOString();

const session = {
id:
`clean-${Date.now()}`,

targetType:
this.pendingTarget.type,

targetId:
this.pendingTarget.id,

targetName:
this.pendingTarget.name,

zoneId:
this.pendingTarget.zoneId,

level,

startedAt:
now,

updatedAt:
now,

tasks
};

HomeStore.update(
store => {
store.cleaning
.pausedSessions =
Array.isArray(
store.cleaning
.pausedSessions
)
? store.cleaning
.pausedSessions
: [];

if (
store.cleaning
.activeSession
) {
store.cleaning
.pausedSessions
.push({
...store.cleaning
.activeSession,

pausedAt:
now
});
}

store.cleaning
.activeSession =
session;
}
);

this.showSessionScreen(
session
);

HomeApp.toast(
`${session.targetName} ${this.titleCase(level)} Clean started.`
);
},

generateTasks(
targetType,
targetId,
level,
state
) {
const rooms =
targetType ===
"room"
? state.cleaning
.rooms
.filter(
room =>
room.id ===
targetId
)
: state.cleaning
.rooms
.filter(
room =>
room.zoneId ===
targetId
);

const result =
[];

const stamp =
Date.now();

rooms.forEach(
room => {
const library =
this.TASK_LIBRARY[
room.type
] ||
this.TASK_LIBRARY
.living;

const titles = [
...library.quick
];

if (
level ===
"standard" ||
level ===
"deep"
) {
titles.push(
...library.standard
);
}

if (
level ===
"deep"
) {
titles.push(
...library.deep
);
}

titles.forEach(
(
title,
index
) => {
result.push({
id:
`${room.id}-${level}-${index}-${stamp}`,

group:
targetType ===
"zone"
? room.name
: null,

roomId:
room.id,

title,

done:
false,

completedAt:
null,

custom:
false
});
}
);
}
);

return result;
},

showSessionScreen(session) {
this.setText(
"cleaningDialogKicker",
session.targetType ===
"zone"
? "ZONE CLEANING"
: "ROOM CLEANING"
);

this.setText(
"cleaningDialogTitle",
session.targetName
);

this.setText(
"cleaningProtocolRecommendation",
`${this.titleCase(session.level)} protocol active. Check tasks as you move through the space.`
);

document
.getElementById(
"cleaningLevelScreen"
)
?.classList
.add(
"is-hidden"
);

document
.getElementById(
"cleaningTaskScreen"
)
?.classList
.remove(
"is-hidden"
);

this.renderActiveDialogSession(
session
);
},

renderActiveDialogSession(session) {
const progress =
this.getSessionProgress(
session
);

this.setText(
"sessionLevelTitle",
`${this.titleCase(session.level)} Clean`
);

this.setText(
"sessionProgressPercent",
`${progress.percent}%`
);

const bar =
document.getElementById(
"sessionProgressBar"
);

if (bar) {
bar.style.width =
`${progress.percent}%`;
}

const completeButton =
document.getElementById(
"completeCleaningButton"
);

if (completeButton) {
completeButton.disabled =
progress.percent !==
100;
}

this.renderTaskList(
session
);
},

renderTaskList(session) {
const container =
document.getElementById(
"cleaningTaskList"
);

if (!container) {
return;
}

let lastGroup =
null;

let html =
"";

session.tasks
.forEach(
task => {
if (
task.group &&
task.group !==
lastGroup
) {
html += `
<div class="cleaning-task-group">
${HomeApp.escapeHtml(task.group)}
</div>
`;

lastGroup =
task.group;
}

const safeId =
HomeApp.escapeHtml(
task.id
);

html += `
<div
class="cleaning-task-row ${task.done ? "done" : ""}"
>

<input
type="checkbox"
id="${safeId}"
data-cleaning-task="${safeId}"
${task.done ? "checked" : ""}
>

<label
for="${safeId}"
>
${HomeApp.escapeHtml(task.title)}
</label>

${
task.custom
? `
<button
class="remove-custom-task"
type="button"
data-remove-custom="${safeId}"
title="Remove custom task"
>
×
</button>
`
: ""
}

</div>
`;
}
);

container.innerHTML =
html;
},

getSessionProgress(session) {
const total =
Array.isArray(
session?.tasks
)
? session.tasks.length
: 0;

const complete =
total
? session.tasks
.filter(
task =>
task.done
)
.length
: 0;

return {
total,
complete,

percent:
total
? Math.round(
(
complete /
total
) *
100
)
: 100
};
},

toggleTask(taskId) {
HomeStore.update(
state => {
const session =
state.cleaning
.activeSession;

if (!session) {
return;
}

const task =
session.tasks
.find(
item =>
item.id ===
taskId
);

if (!task) {
return;
}

task.done =
!task.done;

task.completedAt =
task.done
? new Date()
.toISOString()
: null;

session.updatedAt =
new Date()
.toISOString();
}
);
},

addManualTask() {
const input =
document.getElementById(
"manualCleaningTask"
);

const title =
input
?.value
.trim() ||
"";

if (!title) {
return;
}

HomeStore.update(
state => {
const session =
state.cleaning
.activeSession;

if (!session) {
return;
}

session.tasks
.push({
id:
`custom-clean-${Date.now()}`,

group:
session.targetType ===
"zone"
? "Added During Clean"
: null,

roomId:
session.targetType ===
"room"
? session.targetId
: null,

title,

done:
false,

completedAt:
null,

custom:
true
});

session.updatedAt =
new Date()
.toISOString();
}
);

if (input) {
input.value =
"";
}

HomeApp.toast(
"Cleaning task added."
);
},

removeCustomTask(taskId) {
HomeStore.update(
state => {
const session =
state.cleaning
.activeSession;

if (!session) {
return;
}

session.tasks =
session.tasks
.filter(
task =>
!(
task.id ===
taskId &&
task.custom
)
);

session.updatedAt =
new Date()
.toISOString();
}
);
},

completeCleaning() {
const state =
HomeStore.getState();

const session =
state.cleaning
.activeSession;

if (!session) {
return;
}

const progress =
this.getSessionProgress(
session
);

if (
progress.percent !==
100
) {
HomeApp.toast(
"Finish the remaining cleaning tasks first."
);

return;
}

const now =
new Date()
.toISOString();

let restoredSessionName =
"";

HomeStore.update(
store => {
const active =
store.cleaning
.activeSession;

if (
!active ||
active.id !==
session.id
) {
return;
}

const targetRooms =
active.targetType ===
"room"
? store.cleaning
.rooms
.filter(
room =>
room.id ===
active.targetId
)
: store.cleaning
.rooms
.filter(
room =>
room.zoneId ===
active.targetId
);

targetRooms.forEach(
room => {
room.cleanState =
100;

this.applyCompletionDates(
room,
active.level,
now
);
}
);

const zone =
store.cleaning
.zones
.find(
item =>
item.id ===
active.zoneId
);

if (
active.targetType ===
"zone" &&
zone
) {
this.applyCompletionDates(
zone,
active.level,
now
);
}

this.recalculateAllZones(
store
);

store.cleaning.history =
Array.isArray(
store.cleaning
.history
)
? store.cleaning
.history
: [];

store.cleaning.history
.unshift({
id:
`clean-history-${Date.now()}`,

targetType:
active.targetType,

targetId:
active.targetId,

targetName:
active.targetName,

zoneId:
active.zoneId,

level:
active.level,

taskCount:
active.tasks.length,

startedAt:
active.startedAt,

completedAt:
now
});

store.cleaning.history =
store.cleaning
.history
.slice(
0,
100
);

store.activity =
Array.isArray(
store.activity
)
? store.activity
: [];

store.activity
.unshift({
id:
`activity-${Date.now()}`,

type:
"cleaning",

title:
`${active.targetName} ${this.titleCase(active.level)} Clean completed`,

description:
`${active.tasks.length} cleaning tasks completed.`,

createdAt:
now
});

store.activity =
store.activity
.slice(
0,
200
);

store.cleaning
.pausedSessions =
Array.isArray(
store.cleaning
.pausedSessions
)
? store.cleaning
.pausedSessions
: [];

const restored =
store.cleaning
.pausedSessions
.pop() ||
null;

store.cleaning
.activeSession =
restored;

restoredSessionName =
restored?.targetName ||
"";
}
);

document
.getElementById(
"cleaningDialog"
)
?.close();

HomeApp.toast(
restoredSessionName
? `${session.targetName} ${this.titleCase(session.level)} Clean completed. ${restoredSessionName} is ready to resume.`
: `${session.targetName} ${this.titleCase(session.level)} Clean completed.`
);
},

applyCompletionDates(
target,
level,
timestamp
) {
if (
level ===
"quick"
) {
target.lastQuickAt =
timestamp;

return;
}

if (
level ===
"standard"
) {
target.lastQuickAt =
timestamp;

target.lastStandardAt =
timestamp;

return;
}

target.lastQuickAt =
timestamp;

target.lastStandardAt =
timestamp;

target.lastDeepAt =
timestamp;
},

resumeActiveSession() {
const state =
HomeStore.getState();

const session =
state.cleaning
.activeSession;

if (!session) {
return;
}

this.pendingTarget = {
type:
session.targetType,

id:
session.targetId,

name:
session.targetName,

zoneId:
session.zoneId
};

if (
session.targetType ===
"room"
) {
const room =
state.cleaning
.rooms
.find(
item =>
item.id ===
session.targetId
);

if (room) {
this.cleaningMode =
"room";

this.selectedRoomId =
room.id;

this.selectedFloor =
room.floor;

this.selectedZoneId =
room.zoneId;

state.cleaning.cleaningMode =
"room";

state.cleaning.selectedRoomId =
room.id;

state.cleaning.selectedFloor =
room.floor;

state.cleaning.selectedZone =
room.zoneId;
}
}

else {
this.cleaningMode =
"zone";

this.selectedZoneId =
session.targetId;

state.cleaning.cleaningMode =
"zone";

state.cleaning.selectedZone =
session.targetId;
}

HomeStore.saveState(
state
);

this.showSessionScreen(
session
);

const dialog =
document.getElementById(
"cleaningDialog"
);

if (
dialog &&
!dialog.open
) {
dialog.showModal();
}
},

selectRecommendedRoom(roomId) {
const state =
HomeStore.getState();

const room =
state.cleaning
.rooms
.find(
item =>
item.id ===
roomId
);

if (!room) {
return;
}

this.cleaningMode =
"room";

this.selectedRoomId =
room.id;

this.selectedFloor =
room.floor;

this.selectedZoneId =
room.zoneId;

HomeStore.update(
store => {
store.cleaning.cleaningMode =
"room";

store.cleaning.selectedRoomId =
room.id;

store.cleaning.selectedFloor =
room.floor;

store.cleaning.selectedZone =
room.zoneId;
}
);

this.openCleaningForRoom();
},

bindEvents() {
document.addEventListener(
"click",
event => {

const guide =
event.target.closest(
"#guidePrimaryAction"
);

if (guide) {
const action =
guide.dataset
.guideAction;

if (
action ===
"resume"
) {
this.resumeActiveSession();
}

else if (
action ===
"room-mode"
) {
this.setMode(
"room",
true
);
}

else {
this.selectRecommendedRoom(
guide.dataset
.roomId ||
this.recommendedRoomId
);
}

return;
}


const mode =
event.target.closest(
"[data-cleaning-mode]"
);

if (mode) {
this.setMode(
mode.dataset
.cleaningMode,
false
);

return;
}


if (
event.target.closest(
"#heroRoomMode"
)
) {
this.setMode(
"room",
true
);

return;
}


if (
event.target.closest(
"#heroZoneMode"
)
) {
this.setMode(
"zone",
true
);

return;
}


const floorButton =
event.target.closest(
"[data-floor]"
);

if (floorButton) {
this.selectFloor(
floorButton.dataset
.floor
);

return;
}


const roomButton =
event.target.closest(
"[data-room-id]"
);

if (roomButton) {
this.selectRoom(
roomButton.dataset
.roomId
);

return;
}


const zoneButton =
event.target.closest(
"[data-cleaning-zone]"
);

if (zoneButton) {
this.selectZone(
zoneButton.dataset
.cleaningZone
);

return;
}


if (
event.target.closest(
"#openRoomCleaning"
)
) {
this.openCleaningForRoom();

return;
}


if (
event.target.closest(
"#openZoneCleaning"
)
) {
this.openCleaningForZone();

return;
}


if (
event.target.closest(
"#resumeCleaningButton"
)
) {
this.resumeActiveSession();

return;
}


const level =
event.target.closest(
"[data-cleaning-level]"
);

if (level) {
this.startCleaningSession(
level.dataset
.cleaningLevel
);

return;
}


if (
event.target.closest(
"#addManualCleaningTask"
)
) {
this.addManualTask();

return;
}


const custom =
event.target.closest(
"[data-remove-custom]"
);

if (custom) {
this.removeCustomTask(
custom.dataset
.removeCustom
);

return;
}


if (
event.target.closest(
"#completeCleaningButton"
)
) {
this.completeCleaning();

return;
}


if (
event.target.closest(
"#closeCleaningDialog"
) ||
event.target.closest(
"#pauseCleaningButton"
)
) {
document
.getElementById(
"cleaningDialog"
)
?.close();
}
}
);


document.addEventListener(
"change",
event => {
const task =
event.target.closest(
"[data-cleaning-task]"
);

if (task) {
this.toggleTask(
task.dataset
.cleaningTask
);
}
}
);


document
.getElementById(
"manualCleaningTask"
)
?.addEventListener(
"keydown",
event => {
if (
event.key ===
"Enter"
) {
event.preventDefault();

this.addManualTask();
}
}
);
},

selectFloor(floorId) {
if (
!this.FLOORS[
floorId
]
) {
return;
}

const state =
HomeStore.getState();

const firstRoom =
state.cleaning
.rooms
.find(
room =>
room.floor ===
floorId
);

this.selectedFloor =
floorId;

if (firstRoom) {
this.selectedRoomId =
firstRoom.id;

this.selectedZoneId =
firstRoom.zoneId;
}

HomeStore.update(
store => {
store.cleaning.selectedFloor =
this.selectedFloor;

store.cleaning.selectedRoomId =
this.selectedRoomId;

store.cleaning.selectedZone =
this.selectedZoneId;
}
);
},

selectRoom(roomId) {
const state =
HomeStore.getState();

const room =
state.cleaning
.rooms
.find(
item =>
item.id ===
roomId
);

if (!room) {
return;
}

this.selectedRoomId =
room.id;

this.selectedFloor =
room.floor;

this.selectedZoneId =
room.zoneId;

HomeStore.update(
store => {
store.cleaning.selectedRoomId =
room.id;

store.cleaning.selectedFloor =
room.floor;

store.cleaning.selectedZone =
room.zoneId;
}
);
},

selectZone(zoneId) {
const state =
HomeStore.getState();

if (
!state.cleaning
.zones
.some(
zone =>
zone.id ===
zoneId
)
) {
return;
}

this.selectedZoneId =
zoneId;

HomeStore.update(
store => {
store.cleaning.selectedZone =
zoneId;
}
);
},

setMode(
mode,
shouldScroll = false
) {
if (
![
"room",
"zone"
]
.includes(
mode
)
) {
return;
}

this.cleaningMode =
mode;

HomeStore.update(
state => {
state.cleaning.cleaningMode =
mode;
}
);

if (shouldScroll) {
requestAnimationFrame(
() => {
document
.getElementById(
mode ===
"room"
? "roomModeWorkspace"
: "zoneModeWorkspace"
)
?.scrollIntoView({
behavior:
"smooth",

block:
"start"
});
}
);
}
},

recalculateAllZones(state) {
state.cleaning
.zones
.forEach(
zone => {
const rooms =
state.cleaning
.rooms
.filter(
room =>
room.zoneId ===
zone.id
);

zone.progress =
this.averageRooms(
rooms
);

zone.status =
this.statusFromScore(
zone.progress
);
}
);
},

averageRooms(rooms) {
if (
!rooms?.length
) {
return 100;
}

return Math.round(
rooms
.reduce(
(
sum,
room
) =>
sum +
Number(
room.cleanState ||
0
),
0
) /
rooms.length
);
},

statusFromScore(score) {
const value =
Number(
score ||
0
);

if (
value >=
90
) {
return "SETTLED";
}

if (
value >=
75
) {
return "STABLE";
}

if (
value >=
60
) {
return "ACTIVE";
}

return "ATTENTION";
},

daysSince(value) {
if (!value) {
return Infinity;
}

const date =
new Date(
value
);

if (
Number.isNaN(
date.getTime()
)
) {
return Infinity;
}

return Math.floor(
(
Date.now() -
date.getTime()
) /
86400000
);
},

titleCase(value) {
return String(
value ||
""
)
.replace(
/[-_]+/g,
" "
)
.replace(
/\b\w/g,
letter =>
letter.toUpperCase()
);
},

formatDateTime(value) {
if (!value) {
return "Not tracked";
}

const date =
new Date(
value
);

if (
Number.isNaN(
date.getTime()
)
) {
return "Not tracked";
}

return (
`${HomeApp.formatDate(date)} · ${HomeApp.formatTime(date)}`
);
},

setText(
id,
value
) {
const element =
document.getElementById(
id
);

if (element) {
element.textContent =
value;
}
}
};

window.CleaningApp =
CleaningApp;

CleaningApp.init();
});