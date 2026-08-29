/* ================================================================
   DARLING HOMEOS
   UNIVERSAL HOME MEMORY

   FILE:
   assets/js/store.js

   RESPONSIBILITY:
   - One persistent HomeOS state
   - One localStorage boundary
   - Shared module state
   - Daily rollover
   - Shared health / Home Pulse calculations

   PAGE CONTROLLERS MUST NOT USE localStorage DIRECTLY.
================================================================ */

(function () {
    "use strict";


    /* ============================================================
       STORAGE
    ============================================================ */

    const STORAGE_KEY =
        "darling_homeos_core_v1";

    const CORE_VERSION =
        4;


    /* ============================================================
       DAILY / LAUNDRY CONSTANTS
    ============================================================ */

    const LAUNDRY_DAYS = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];

    const JS_DAY_MAP = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];


    /* ============================================================
       BASIC HELPERS
    ============================================================ */

    function clone(value) {
        return JSON.parse(
            JSON.stringify(value)
        );
    }


    function clamp(
        value,
        minimum = 0,
        maximum = 100
    ) {
        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {
            return minimum;
        }

        return Math.min(
            maximum,
            Math.max(
                minimum,
                number
            )
        );
    }


    function getLocalDateKey(
        date = new Date()
    ) {
        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${year}-${month}-${day}`;
    }


    function getCalendarSeason(
        date = new Date()
    ) {
        const month =
            date.getMonth() + 1;

        if (
            month >= 3 &&
            month <= 5
        ) {
            return "spring";
        }

        if (
            month >= 6 &&
            month <= 8
        ) {
            return "summer";
        }

        if (
            month >= 9 &&
            month <= 11
        ) {
            return "fall";
        }

        return "winter";
    }


    function daysSince(
        dateString
    ) {
        if (!dateString) {
            return null;
        }

        const timestamp =
            new Date(
                dateString
            ).getTime();

        if (
            !Number.isFinite(timestamp)
        ) {
            return null;
        }

        return Math.max(
            0,
            Math.floor(
                (
                    Date.now() -
                    timestamp
                ) /
                86400000
            )
        );
    }


    function minutesSince(
        dateString
    ) {
        if (!dateString) {
            return null;
        }

        const timestamp =
            new Date(
                dateString
            ).getTime();

        if (
            !Number.isFinite(timestamp)
        ) {
            return null;
        }

        return Math.max(
            0,
            Math.floor(
                (
                    Date.now() -
                    timestamp
                ) /
                60000
            )
        );
    }


    function makeId(prefix) {
        if (
            typeof crypto !==
                "undefined" &&
            typeof crypto.randomUUID ===
                "function"
        ) {
            return `${prefix}-${crypto.randomUUID()}`;
        }

        return (
            `${prefix}-${Date.now()}-` +
            Math.random()
                .toString(16)
                .slice(2)
        );
    }


    /* ============================================================
       DEFAULT CLEANING ZONES

       This is the shared nine-zone topology.

       Cleaning owns room/task detail.
       Seasonal reads these same zones.
       Dashboard reads these same zones.
    ============================================================ */

    function createDefaultCleaningZones() {
        return [
            {
                id: "z01",
                code: "Z-01",
                name: "Master Suite",
                icon: "MB",
                color: "#8e63ff",
                soft: "#f1ebff",
                progress: 87,
                status: "SETTLED",
                description:
                    "Master bedroom, master bathroom and both walk-in closets.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z02",
                code: "Z-02",
                name: "Kids Wing + Den",
                icon: "KW",
                color: "#22c7e9",
                soft: "#e7faff",
                progress: 82,
                status: "SETTLED",
                description:
                    "Kids' rooms, shared bathroom, den and upstairs traffic areas.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z03",
                code: "Z-03",
                name: "Laundry + Linen",
                icon: "LL",
                color: "#28d4c2",
                soft: "#e9fbf8",
                progress: 72,
                status: "ACTIVE",
                description:
                    "Laundry room, linen closet, upstairs landing and stairs.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z04",
                code: "Z-04",
                name: "Main Living",
                icon: "ML",
                color: "#f0b23f",
                soft: "#fff7e6",
                progress: 91,
                status: "SETTLED",
                description:
                    "Entryway, formal dining room, living room and breakfast area.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z05",
                code: "Z-05",
                name: "Kitchen + Pantry",
                icon: "KP",
                color: "#ff667d",
                soft: "#fff0f3",
                progress: 69,
                status: "ATTENTION",
                description:
                    "Kitchen, walk-in pantry, refrigerator, freezers and mini fridge.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z06",
                code: "Z-06",
                name: "Mother-in-Law Suite",
                icon: "MI",
                color: "#f15fa9",
                soft: "#fff0f7",
                progress: 89,
                status: "SETTLED",
                description:
                    "Mother-in-law bedroom and private bathroom.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z07",
                code: "Z-07",
                name: "Basement",
                icon: "BS",
                color: "#5487ff",
                soft: "#edf2ff",
                progress: 74,
                status: "ACTIVE",
                description:
                    "Basement bedrooms, bathroom, living room and commons spaces.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z08",
                code: "Z-08",
                name: "Outdoor Living",
                icon: "OL",
                color: "#83c940",
                soft: "#f0f8e7",
                progress: 68,
                status: "ATTENTION",
                description:
                    "Front porch, yard, decks and outdoor family spaces.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            },

            {
                id: "z09",
                code: "Z-09",
                name: "Garage",
                icon: "GA",
                color: "#ff844d",
                soft: "#fff1e9",
                progress: 81,
                status: "SETTLED",
                description:
                    "Garage storage, floors and utility areas.",
                lastQuickAt: null,
                lastStandardAt: null,
                lastDeepAt: null
            }
        ];
    }


    /* ============================================================
       DEFAULT SEASONS
    ============================================================ */

    function createDefaultSeasons() {
        return {
            spring: {
                name:
                    "Spring Renewal",

                progress:
                    0,

                description:
                    "Fresh air, decluttering and a full spring home refresh.",

                zones:
                    [],

                selectedZone:
                    "z01",

                completedAt:
                    null
            },

            summer: {
                name:
                    "Summer Reset",

                progress:
                    0,

                description:
                    "Outdoor living, entertaining and warm-weather home care.",

                zones:
                    [],

                selectedZone:
                    "z01",

                completedAt:
                    null
            },

            fall: {
                name:
                    "Fall Refresh",

                progress:
                    0,

                description:
                    "Prepare the home for cooler weather, hosting and fall decorating.",

                zones:
                    [],

                selectedZone:
                    "z01",

                completedAt:
                    null
            },

            winter: {
                name:
                    "Winter Reset",

                progress:
                    0,

                description:
                    "Prepare the home for winter comfort, protection and holiday hosting.",

                zones:
                    [],

                selectedZone:
                    "z01",

                completedAt:
                    null
            }
        };
    }


    /* ============================================================
       DEFAULT HOMEOS STATE
    ============================================================ */

    function createDefaultState() {
        return {
            version:
                CORE_VERSION,


            settings: {
                theme:
                    "light"
            },


            cleaning: {
                selectedZone:
                    "z02",

                activeSession:
                    null,

                rooms:
                    [],

                pausedSessions:
                    [],

                cleaningMode:
                    "room",

                selectedFloor:
                    "upstairs",

                zones:
                    createDefaultCleaningZones(),

                history:
                    []
            },


            /*
               Daily Rhythm task templates are NOT hard-coded here.

               daily.js owns the current real-life checklist.
               HomeStore owns its saved state and rollover.
            */
            dailyRhythm: {
                currentDate:
                    getLocalDateKey(),

                selectedShift:
                    "opening",

                opening:
                    [],

                closing:
                    [],

                dailyTemplateVersion:
                    0,

                sharedShoppingMigrated:
                    true,

                history:
                    [],

                lastResetAt:
                    null
            },


            laundry: {
                activeLoads:
                    [],

                weeklySchedule:
                    [],

                maintenance:
                    [],

                history:
                    [],

                selectedDay:
                    null,

                setupComplete:
                    false
            },


            inventory: {
                health:
                    100,

                lowItems:
                    [],

                zones:
                    [],

                items:
                    [],

                shoppingList:
                    [],

                autoAddShortages:
                    false,

                selectedZone:
                    "pantry",

                setupComplete:
                    false
            },


            seasonal: {
                /*
                   seasonal.js keeps this synchronized with the
                   actual calendar season.
                */
                activeSeason:
                    getCalendarSeason(),

                seasons:
                    createDefaultSeasons()
            },


            activity:
                []
        };
    }


    /* ============================================================
       SAFE STATE MERGE

       Existing data wins.
       New schema fields are added.
       Saved arrays remain intact.
    ============================================================ */

    function mergeState(
        defaults,
        saved
    ) {
        if (
            Array.isArray(defaults)
        ) {
            return Array.isArray(saved)
                ? saved
                : clone(defaults);
        }

        if (
            defaults === null ||
            typeof defaults !==
                "object"
        ) {
            return saved !==
                undefined
                ? saved
                : defaults;
        }

        const merged = {
            ...defaults
        };

        if (
            saved &&
            typeof saved ===
                "object" &&
            !Array.isArray(saved)
        ) {
            Object.keys(saved)
                .forEach(
                    key => {
                        if (
                            key in defaults
                        ) {
                            merged[key] =
                                mergeState(
                                    defaults[key],
                                    saved[key]
                                );
                        }

                        else {
                            merged[key] =
                                saved[key];
                        }
                    }
                );
        }

        return merged;
    }


    /* ============================================================
       TASK PROGRESS
    ============================================================ */

    function calculateTaskProgress(
        tasks
    ) {
        const list =
            Array.isArray(tasks)
                ? tasks
                : [];

        const total =
            list.length;

        const completed =
            list.filter(
                task =>
                    task.done
            ).length;

        return {
            total,

            completed,

            remaining:
                Math.max(
                    0,
                    total -
                    completed
                ),

            percent:
                total
                    ? Math.round(
                        (
                            completed /
                            total
                        ) *
                        100
                    )
                    : 100
        };
    }


    /* ============================================================
       DAILY HISTORY
    ============================================================ */

    function archiveDailyRhythm(
        state,
        dateKey
    ) {
        if (!dateKey) {
            return;
        }

        const rhythm =
            state.dailyRhythm;

        if (
            !Array.isArray(
                rhythm.history
            )
        ) {
            rhythm.history =
                [];
        }

        const exists =
            rhythm.history.some(
                day =>
                    day.date ===
                    dateKey
            );

        if (exists) {
            return;
        }

        const opening =
            calculateTaskProgress(
                rhythm.opening
            );

        const closing =
            calculateTaskProgress(
                rhythm.closing
            );

        const overall =
            calculateTaskProgress(
                [
                    ...(
                        rhythm.opening ||
                        []
                    ),

                    ...(
                        rhythm.closing ||
                        []
                    )
                ]
            );

        rhythm.history.unshift({
            id:
                `daily-history-${dateKey}`,

            date:
                dateKey,

            openingProgress:
                opening.percent,

            closingProgress:
                closing.percent,

            overallProgress:
                overall.percent,

            completed:
                overall.completed,

            total:
                overall.total,

            archivedAt:
                new Date()
                    .toISOString()
        });

        rhythm.history =
            rhythm.history.slice(
                0,
                30
            );
    }


    /* ============================================================
       DAILY NEW-DAY TASK RESET
    ============================================================ */

    function resetDailyTasksForNewDay(
        tasks
    ) {
        return (
            Array.isArray(tasks)
                ? tasks
                : []
        )
            .filter(
                task =>
                    !(
                        task.custom &&
                        task.recurring ===
                            false
                    )
            )
            .map(
                task => ({
                    ...task,

                    done:
                        false,

                    completedAt:
                        null
                })
            );
    }


    /* ============================================================
       DAILY NEW-DAY ROLLOVER

       - Archive yesterday
       - Keep built-ins
       - Keep repeating custom tasks
       - Remove today-only custom tasks

       Shopping is NOT owned here.
       All HomeOS shopping lives in state.inventory.shoppingList.
    ============================================================ */

    function rollDailyRhythmIfNeeded(
        state
    ) {
        const rhythm =
            state.dailyRhythm;

        const today =
            getLocalDateKey();

        if (
            !rhythm.currentDate
        ) {
            rhythm.currentDate =
                today;

            return;
        }

        if (
            rhythm.currentDate ===
            today
        ) {
            return;
        }

        const previousDate =
            rhythm.currentDate;

        archiveDailyRhythm(
            state,
            previousDate
        );

        rhythm.opening =
            resetDailyTasksForNewDay(
                rhythm.opening
            );

        rhythm.closing =
            resetDailyTasksForNewDay(
                rhythm.closing
            );

        rhythm.currentDate =
            today;

        rhythm.selectedShift =
            "opening";

        rhythm.lastResetAt =
            new Date()
                .toISOString();
    }


    /* ============================================================
       LEGACY DAILY SHOPPING MIGRATION

       Daily Rhythm used to own a separate shoppingList.
       HomeOS now has ONE shared shopping list:

           state.inventory.shoppingList

       Migrate unfinished legacy Daily items once, then remove the
       obsolete Daily shopping fields so they cannot come back.
    ============================================================ */

    function migrateLegacyDailyShopping(
        state
    ) {
        const rhythm =
            state.dailyRhythm ||
            {};

        if (
            !state.inventory ||
            typeof state.inventory !==
                "object"
        ) {
            state.inventory = {
                health: 100,
                lowItems: [],
                zones: [],
                items: [],
                shoppingList: [],
                autoAddShortages: false,
                selectedZone: "pantry",
                setupComplete: false
            };
        }

        if (
            !Array.isArray(
                state.inventory.shoppingList
            )
        ) {
            state.inventory.shoppingList =
                [];
        }

        const legacyShopping =
            Array.isArray(
                rhythm.shoppingList
            )
                ? rhythm.shoppingList
                : [];

        legacyShopping
            .filter(
                item =>
                    !item?.done
            )
            .forEach(
                item => {
                    const name =
                        String(
                            item?.name ||
                            item?.title ||
                            ""
                        )
                            .trim();

                    if (!name) {
                        return;
                    }

                    const normalizedName =
                        name
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                " "
                            )
                            .trim();

                    const alreadyExists =
                        state.inventory
                            .shoppingList
                            .some(
                                entry =>
                                    String(
                                        entry?.name ||
                                        entry?.title ||
                                        ""
                                    )
                                        .toLowerCase()
                                        .replace(
                                            /[^a-z0-9]+/g,
                                            " "
                                        )
                                        .trim() ===
                                    normalizedName
                            );

                    if (alreadyExists) {
                        return;
                    }

                    state.inventory
                        .shoppingList
                        .push({
                            id:
                                item.id ||
                                makeId(
                                    "daily-shopping"
                                ),

                            sourceType:
                                "custom",

                            origin:
                                "daily",

                            sourceLabel:
                                "Daily Rhythm",

                            inventoryItemId:
                                null,

                            name,

                            quantity:
                                Math.max(
                                    1,
                                    Number(
                                        item.quantity
                                    ) ||
                                    1
                                ),

                            quantityMode:
                                "manual",

                            unit:
                                item.unit ||
                                "",

                            checked:
                                false,

                            addedAt:
                                item.createdAt ||
                                item.dayDate ||
                                new Date()
                                    .toISOString()
                        });
                }
            );

        delete rhythm.shoppingList;
        delete rhythm.shoppingDate;

        rhythm.sharedShoppingMigrated =
            true;
    }


    /* ============================================================
       STATE NORMALIZATION
    ============================================================ */

    function normalizeState(
        state
    ) {
        state.version =
            CORE_VERSION;


        /* --------------------------------------------------------
           SETTINGS
        -------------------------------------------------------- */

        if (
            !state.settings ||
            typeof state.settings !==
                "object"
        ) {
            state.settings = {
                theme:
                    "light"
            };
        }

        state.settings.theme =
            state.settings.theme ===
                "dark"
                ? "dark"
                : "light";


        /* --------------------------------------------------------
           ACTIVITY
        -------------------------------------------------------- */

        if (
            !Array.isArray(
                state.activity
            )
        ) {
            state.activity =
                [];
        }


        /* --------------------------------------------------------
           CLEANING
        -------------------------------------------------------- */

        if (
            !state.cleaning ||
            typeof state.cleaning !==
                "object"
        ) {
            state.cleaning =
                createDefaultState()
                    .cleaning;
        }

        if (
            !Array.isArray(
                state.cleaning.zones
            ) ||
            !state.cleaning.zones.length
        ) {
            state.cleaning.zones =
                createDefaultCleaningZones();
        }

        if (
            !Array.isArray(
                state.cleaning.rooms
            )
        ) {
            state.cleaning.rooms =
                [];
        }

        if (
            !Array.isArray(
                state.cleaning.pausedSessions
            )
        ) {
            state.cleaning.pausedSessions =
                [];
        }

        if (
            !Array.isArray(
                state.cleaning.history
            )
        ) {
            state.cleaning.history =
                [];
        }


        /* --------------------------------------------------------
           DAILY RHYTHM
        -------------------------------------------------------- */

        if (
            !state.dailyRhythm ||
            typeof state.dailyRhythm !==
                "object"
        ) {
            state.dailyRhythm =
                createDefaultState()
                    .dailyRhythm;
        }

        const rhythm =
            state.dailyRhythm;

        if (
            !Array.isArray(
                rhythm.opening
            )
        ) {
            rhythm.opening =
                [];
        }

        if (
            !Array.isArray(
                rhythm.closing
            )
        ) {
            rhythm.closing =
                [];
        }

        if (
            !Array.isArray(
                rhythm.history
            )
        ) {
            rhythm.history =
                [];
        }

        if (
            ![
                "opening",
                "closing"
            ].includes(
                rhythm.selectedShift
            )
        ) {
            rhythm.selectedShift =
                "opening";
        }

        if (
            !Number.isFinite(
                Number(
                    rhythm.dailyTemplateVersion
                )
            )
        ) {
            rhythm.dailyTemplateVersion =
                0;
        }

        /* --------------------------------------------------------
           LAUNDRY
        -------------------------------------------------------- */

        if (
            !state.laundry ||
            typeof state.laundry !==
                "object"
        ) {
            state.laundry =
                createDefaultState()
                    .laundry;
        }

        if (
            !Array.isArray(
                state.laundry.activeLoads
            )
        ) {
            state.laundry.activeLoads =
                [];
        }

        if (
            !Array.isArray(
                state.laundry.weeklySchedule
            )
        ) {
            state.laundry.weeklySchedule =
                [];
        }

        if (
            !Array.isArray(
                state.laundry.maintenance
            )
        ) {
            state.laundry.maintenance =
                [];
        }

        if (
            !Array.isArray(
                state.laundry.history
            )
        ) {
            state.laundry.history =
                [];
        }


        /* --------------------------------------------------------
           INVENTORY
        -------------------------------------------------------- */

        if (
            !state.inventory ||
            typeof state.inventory !==
                "object"
        ) {
            state.inventory =
                createDefaultState()
                    .inventory;
        }

        if (
            !Array.isArray(
                state.inventory.zones
            )
        ) {
            state.inventory.zones =
                [];
        }

        if (
            !Array.isArray(
                state.inventory.items
            )
        ) {
            state.inventory.items =
                [];
        }

        if (
            !Array.isArray(
                state.inventory.lowItems
            )
        ) {
            state.inventory.lowItems =
                [];
        }

        if (
            !Array.isArray(
                state.inventory.shoppingList
            )
        ) {
            state.inventory.shoppingList =
                [];
        }


        /*
           Finish cross-module Daily normalization only after
           Inventory is guaranteed to exist, because legacy Daily
           shopping belongs in the shared Inventory shopping list.
        */
        migrateLegacyDailyShopping(
            state
        );

        rollDailyRhythmIfNeeded(
            state
        );


        /* --------------------------------------------------------
           SEASONAL
        -------------------------------------------------------- */

        if (
            !state.seasonal ||
            typeof state.seasonal !==
                "object"
        ) {
            state.seasonal =
                createDefaultState()
                    .seasonal;
        }

        if (
            !state.seasonal.seasons ||
            typeof state.seasonal.seasons !==
                "object"
        ) {
            state.seasonal.seasons =
                createDefaultSeasons();
        }

        const defaultSeasons =
            createDefaultSeasons();

        [
            "spring",
            "summer",
            "fall",
            "winter"
        ].forEach(
            seasonKey => {
                if (
                    !state.seasonal
                        .seasons[
                            seasonKey
                        ]
                ) {
                    state.seasonal
                        .seasons[
                            seasonKey
                        ] =
                        defaultSeasons[
                            seasonKey
                        ];
                }
            }
        );

        if (
            !state.seasonal
                .seasons[
                    state.seasonal
                        .activeSeason
                ]
        ) {
            state.seasonal.activeSeason =
                getCalendarSeason();
        }


        return state;
    }


    /* ============================================================
       STORAGE READ
    ============================================================ */

    function getState() {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {
            const initial =
                normalizeState(
                    createDefaultState()
                );

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    initial
                )
            );

            return initial;
        }

        try {
            const parsed =
                JSON.parse(
                    saved
                );

            const merged =
                mergeState(
                    createDefaultState(),
                    parsed
                );

            const normalized =
                normalizeState(
                    merged
                );

            const normalizedJson =
                JSON.stringify(
                    normalized
                );

            /*
               Quietly save schema upgrades.

               A read does not broadcast a state-change event.
            */
            if (
                normalizedJson !==
                saved
            ) {
                localStorage.setItem(
                    STORAGE_KEY,
                    normalizedJson
                );
            }

            return normalized;
        }

        catch (error) {
            console.error(
                "DARLING HomeOS storage error:",
                error
            );

            const resetState =
                normalizeState(
                    createDefaultState()
                );

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    resetState
                )
            );

            return resetState;
        }
    }


    /* ============================================================
       STORAGE SAVE
    ============================================================ */

    function saveState(
        state
    ) {
        const normalized =
            normalizeState(
                state
            );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                normalized
            )
        );

        window.dispatchEvent(
            new CustomEvent(
                "homeos:statechange",
                {
                    detail:
                        normalized
                }
            )
        );

        return normalized;
    }


    /* ============================================================
       STORAGE UPDATE
    ============================================================ */

    function update(
        callback
    ) {
        const state =
            getState();

        if (
            typeof callback ===
                "function"
        ) {
            callback(
                state
            );
        }

        return saveState(
            state
        );
    }


    /* ============================================================
       SETTINGS
    ============================================================ */

    function setTheme(
        theme
    ) {
        return update(
            state => {
                state.settings.theme =
                    theme ===
                        "dark"
                        ? "dark"
                        : "light";
            }
        );
    }


    /* ============================================================
       CLEANING
    ============================================================ */

    function getZone(
        zoneId,
        state = getState()
    ) {
        return (
            state.cleaning
                ?.zones ||
            []
        ).find(
            zone =>
                zone.id ===
                zoneId
        ) || null;
    }


    function setSelectedZone(
        zoneId
    ) {
        return update(
            state => {
                const exists =
                    state.cleaning
                        .zones
                        .some(
                            zone =>
                                zone.id ===
                                zoneId
                        );

                if (exists) {
                    state.cleaning
                        .selectedZone =
                        zoneId;
                }
            }
        );
    }


    function getCleaningScore(
        state = getState()
    ) {
        const zones =
            state.cleaning
                ?.zones ||
            [];

        if (!zones.length) {
            return 100;
        }

        const total =
            zones.reduce(
                (
                    sum,
                    zone
                ) =>
                    sum +
                    clamp(
                        zone.progress
                    ),
                0
            );

        return Math.round(
            total /
            zones.length
        );
    }


    /* ============================================================
       DAILY RHYTHM
    ============================================================ */

    function normalizeRhythmShift(
        shift
    ) {
        return shift ===
            "closing"
            ? "closing"
            : "opening";
    }


    function getRhythmScore(
        shift,
        state = getState()
    ) {
        const safeShift =
            normalizeRhythmShift(
                shift
            );

        return calculateTaskProgress(
            state.dailyRhythm[
                safeShift
            ] || []
        ).percent;
    }


    function getDailyRhythmScore(
        state = getState()
    ) {
        const rhythm =
            state.dailyRhythm ||
            {};

        const opening =
            Array.isArray(
                rhythm.opening
            )
                ? rhythm.opening
                : [];

        const closing =
            Array.isArray(
                rhythm.closing
            )
                ? rhythm.closing
                : [];

        const hour =
            new Date()
                .getHours();

        /*
           Before 3 PM:
           Closing Shift does not lower Home Pulse yet.

           At 3 PM and later:
           both shifts contribute.
        */
        if (
            hour < 15
        ) {
            return calculateTaskProgress(
                opening
            ).percent;
        }

        return calculateTaskProgress(
            [
                ...opening,
                ...closing
            ]
        ).percent;
    }


    function toggleRhythmTask(
        shift,
        taskId
    ) {
        const safeShift =
            normalizeRhythmShift(
                shift
            );

        return update(
            state => {
                const task =
                    (
                        state.dailyRhythm[
                            safeShift
                        ] ||
                        []
                    ).find(
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
            }
        );
    }


    function setRhythmShift(
        shift
    ) {
        const safeShift =
            normalizeRhythmShift(
                shift
            );

        return update(
            state => {
                state.dailyRhythm
                    .selectedShift =
                    safeShift;
            }
        );
    }


    /* ============================================================
       LAUNDRY
    ============================================================ */

    function normalizeDayName(
        value
    ) {
        return String(
            value ||
            ""
        )
            .trim()
            .toLowerCase();
    }


    function getLaundryToday() {
        return JS_DAY_MAP[
            new Date()
                .getDay()
        ];
    }


    function getLaundryWeekKey(
        date = new Date()
    ) {
        const current =
            new Date(
                date
            );

        const day =
            current.getDay();

        const difference =
            day === 0
                ? -6
                : 1 -
                    day;

        current.setDate(
            current.getDate() +
            difference
        );

        current.setHours(
            0,
            0,
            0,
            0
        );

        return [
            current.getFullYear(),

            String(
                current.getMonth() + 1
            ).padStart(
                2,
                "0"
            ),

            String(
                current.getDate()
            ).padStart(
                2,
                "0"
            )
        ].join("-");
    }


    function getLaundryScore(
        state = getState()
    ) {
        const laundry =
            state.laundry ||
            {};

        const schedule =
            Array.isArray(
                laundry.weeklySchedule
            )
                ? laundry.weeklySchedule
                : [];

        const activeLoads =
            Array.isArray(
                laundry.activeLoads
            )
                ? laundry.activeLoads
                : [];

        const maintenance =
            Array.isArray(
                laundry.maintenance
            )
                ? laundry.maintenance
                : [];

        const today =
            getLaundryToday();

        const todayIndex =
            LAUNDRY_DAYS.indexOf(
                today
            );

        const weekKey =
            getLaundryWeekKey();

        const stageScores = {
            wash:
                35,

            dry:
                55,

            fold:
                75,

            "put-away":
                95
        };


        /* --------------------------------------------------------
           WEEKLY SCHEDULE
        -------------------------------------------------------- */

        const dueItems =
            schedule.filter(
                item => {
                    const day =
                        normalizeDayName(
                            item.day
                        );

                    const index =
                        LAUNDRY_DAYS
                            .indexOf(
                                day
                            );

                    return (
                        index !== -1 &&
                        index <=
                            todayIndex
                    );
                }
            );

        let scheduleScore =
            100;

        if (
            dueItems.length
        ) {
            const values =
                dueItems.map(
                    item => {
                        const itemDay =
                            normalizeDayName(
                                item.day
                            );

                        const complete =
                            Array.isArray(
                                item.completedWeeks
                            ) &&
                            item.completedWeeks
                                .includes(
                                    weekKey
                                );

                        if (complete) {
                            return 100;
                        }

                        const active =
                            activeLoads.find(
                                load =>
                                    load.scheduleId ===
                                    item.id
                            );

                        if (active) {
                            return (
                                stageScores[
                                    active.stage
                                ] ||
                                35
                            );
                        }

                        if (
                            itemDay ===
                            today
                        ) {
                            return 70;
                        }

                        return 45;
                    }
                );

            scheduleScore =
                Math.round(
                    values.reduce(
                        (
                            total,
                            value
                        ) =>
                            total +
                            value,
                        0
                    ) /
                    values.length
                );
        }


        /* --------------------------------------------------------
           ACTIVE FLOW
        -------------------------------------------------------- */

        let activeScore =
            100;

        if (
            activeLoads.length
        ) {
            activeScore =
                Math.round(
                    activeLoads.reduce(
                        (
                            total,
                            load
                        ) =>
                            total +
                            (
                                stageScores[
                                    load.stage
                                ] ||
                                35
                            ),
                        0
                    ) /
                    activeLoads.length
                );
        }


        /* --------------------------------------------------------
           ROOM MAINTENANCE
        -------------------------------------------------------- */

        let maintenanceScore =
            100;

        if (
            maintenance.length
        ) {
            const values =
                maintenance.map(
                    task => {
                        const frequency =
                            Math.max(
                                1,
                                Number(
                                    task.frequencyDays
                                ) ||
                                30
                            );

                        if (
                            !task.lastCompletedAt
                        ) {
                            return 80;
                        }

                        const age =
                            daysSince(
                                task.lastCompletedAt
                            );

                        if (
                            age === null
                        ) {
                            return 80;
                        }

                        if (
                            age <=
                            frequency
                        ) {
                            return 100;
                        }

                        const overdue =
                            age -
                            frequency;

                        return Math.max(
                            20,
                            100 -
                            overdue *
                            6
                        );
                    }
                );

            maintenanceScore =
                Math.round(
                    values.reduce(
                        (
                            total,
                            value
                        ) =>
                            total +
                            value,
                        0
                    ) /
                    values.length
                );
        }


        return Math.round(
            scheduleScore *
            0.50 +

            activeScore *
            0.30 +

            maintenanceScore *
            0.20
        );
    }


    /* ============================================================
       INVENTORY
    ============================================================ */

    function getInventoryScore(
        state = getState()
    ) {
        const inventory =
            state.inventory ||
            {};

        const items =
            Array.isArray(
                inventory.items
            )
                ? inventory.items
                : [];

        const tracked =
            items.filter(
                item =>
                    Number(
                        item.target
                    ) > 0
            );

        if (
            tracked.length
        ) {
            const total =
                tracked.reduce(
                    (
                        sum,
                        item
                    ) => {
                        const target =
                            Math.max(
                                1,
                                Number(
                                    item.target
                                ) ||
                                1
                            );

                        const current =
                            Math.max(
                                0,
                                Number(
                                    item.current
                                ) ||
                                0
                            );

                        return (
                            sum +
                            Math.min(
                                current /
                                target,
                                1
                            )
                        );
                    },
                    0
                );

            return Math.round(
                (
                    total /
                    tracked.length
                ) *
                100
            );
        }

        return clamp(
            inventory.health ??
            100
        );
    }


    /* ============================================================
       SEASONAL
    ============================================================ */

    function getSeasonScore(
        state = getState()
    ) {
        const seasonKey =
            state.seasonal
                ?.activeSeason ||
            getCalendarSeason();

        const season =
            state.seasonal
                ?.seasons?.[
                    seasonKey
                ];

        if (!season) {
            return 100;
        }

        return clamp(
            season.progress ??
            0
        );
    }


    /*
       TEMPORARY COMPATIBILITY:

       The current Dashboard still calls this while we clean it.

       Seasonal detail pages should not use this to redefine
       the real calendar season.

       Remove this function during Dashboard cleanup.
    */
    function setActiveSeason(
        season
    ) {
        return update(
            state => {
                if (
                    state.seasonal
                        ?.seasons?.[
                            season
                        ]
                ) {
                    state.seasonal
                        .activeSeason =
                        season;
                }
            }
        );
    }


    /* ============================================================
       HOME INTELLIGENCE
    ============================================================ */

    function getSystemScores(
        state = getState()
    ) {
        return {
            cleaning:
                getCleaningScore(
                    state
                ),

            rhythm:
                getDailyRhythmScore(
                    state
                ),

            laundry:
                getLaundryScore(
                    state
                ),

            inventory:
                getInventoryScore(
                    state
                ),

            seasonal:
                getSeasonScore(
                    state
                )
        };
    }


    function getHomePulse(
        state = getState()
    ) {
        const scores =
            getSystemScores(
                state
            );

        return Math.round(
            scores.cleaning *
            0.30 +

            scores.rhythm *
            0.20 +

            scores.laundry *
            0.20 +

            scores.inventory *
            0.17 +

            scores.seasonal *
            0.13
        );
    }


    /*
       Daily Rhythm is already part of Home Pulse.

       It is temporarily excluded from the Dashboard's top
       priority label because the existing Dashboard does not
       yet have a Rhythm priority treatment.

       We can revisit this when dashboard.js is cleaned.
    */
    function getPriority(
        state = getState()
    ) {
        const scores =
            getSystemScores(
                state
            );

        const priorityScores = {
            cleaning:
                scores.cleaning,

            laundry:
                scores.laundry,

            inventory:
                scores.inventory,

            seasonal:
                scores.seasonal
        };

        return Object.entries(
            priorityScores
        )
            .sort(
                (
                    first,
                    second
                ) =>
                    first[1] -
                    second[1]
            )[0][0];
    }


    /* ============================================================
       ACTIVITY / HOME MEMORY
    ============================================================ */

    function addActivity(
        activity
    ) {
        if (!activity) {
            return getState();
        }

        return update(
            state => {
                if (
                    !Array.isArray(
                        state.activity
                    )
                ) {
                    state.activity =
                        [];
                }

                state.activity.unshift({
                    id:
                        activity.id ||
                        makeId(
                            "activity"
                        ),

                    type:
                        activity.type ||
                        "home",

                    title:
                        activity.title ||
                        "HomeOS update",

                    description:
                        activity.description ||
                        "",

                    createdAt:
                        activity.createdAt ||
                        new Date()
                            .toISOString(),

                    ...activity
                });

                state.activity =
                    state.activity.slice(
                        0,
                        200
                    );
            }
        );
    }


    /* ============================================================
       RESET HOMEOS
    ============================================================ */

    function reset() {
        const state =
            normalizeState(
                createDefaultState()
            );

        saveState(
            state
        );

        return state;
    }


    /* ============================================================
       PUBLIC HOMEOS API
    ============================================================ */

    window.HomeStore = {

        /* CORE */
        getState,
        saveState,
        update,


        /* SETTINGS */
        setTheme,


        /* CLEANING */
        getZone,
        setSelectedZone,
        getCleaningScore,


        /* DAILY RHYTHM */
        getRhythmScore,
        getDailyRhythmScore,
        toggleRhythmTask,
        setRhythmShift,


        /* LAUNDRY */
        getLaundryScore,
        getLaundryToday,
        getLaundryWeekKey,


        /* INVENTORY */
        getInventoryScore,


        /* SEASONAL */
        getSeasonScore,
        setActiveSeason,


        /* HOME INTELLIGENCE */
        getSystemScores,
        getHomePulse,
        getPriority,


        /* HOME MEMORY */
        addActivity,


        /* TIME */
        daysSince,
        minutesSince,
        getLocalDateKey,
        getCalendarSeason,


        /* RESET */
        reset
    };

})();