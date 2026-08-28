/* ================================================================
   DARLING HOMEOS
   UNIVERSAL HOME MEMORY

   FILE:
   assets/js/store.js


   PURPOSE:
   This is the SINGLE source of truth for DARLING HomeOS.

   ALL modules read and write through HomeStore:

       Dashboard
       Daily Rhythm
       Cleaning
       Laundry
       Inventory
       Seasonal Home Care


   IMPORTANT ARCHITECTURE RULE:

   Page controllers should NOT use localStorage directly.

   Instead use:

       HomeStore.getState()
       HomeStore.update()
       HomeStore.saveState()


   WHY:

   Today:
       HomeStore uses localStorage.

   Later:
       We can replace the storage layer with a database without
       rebuilding every HomeOS page.


   CURRENT CORE VERSION:
       2


   MAJOR VERSION 2 CHANGES:

   - Daily Rhythm is officially:
         Opening Shift
         Closing Shift

   - Old Morning / Day state is migrated safely.

   - Daily Rhythm automatically rolls into a new day.

   - Previous Daily Rhythm progress is archived.

   - Fake starter Laundry loads are removed from fresh state.

   - Daily Rhythm participates in Home Pulse.

   - Older saved HomeOS data is preserved instead of erased.
================================================================ */


(function () {

    "use strict";


    /* ============================================================
       STORAGE
    ============================================================ */

    const STORAGE_KEY =
        "darling_homeos_core_v1";


    const CORE_VERSION =
        2;


    const DAILY_VERSION =
        2;



    /* ============================================================
       DATE HELPERS

       HomeOS uses LOCAL calendar dates.

       Do NOT use:
           new Date().toISOString().slice(0, 10)

       for daily rollover because ISO dates are UTC.
    ============================================================ */

    function getLocalDateKey(
        date = new Date()
    ) {

        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            )
                .padStart(
                    2,
                    "0"
                );


        const day =
            String(
                date.getDate()
            )
                .padStart(
                    2,
                    "0"
                );


        return (
            `${year}-${month}-${day}`
        );

    }



    /* ============================================================
       DAILY RHYTHM STARTER TASKS

       These are the canonical HomeOS Daily Rhythm tasks.

       daily.js may add custom tasks, but these provide the shared
       baseline so Dashboard and Daily Rhythm agree even before the
       user opens daily.html.
    ============================================================ */

    const OPENING_TASKS = [

        {
            id:
                "opening-make-beds",

            title:
                "Make beds"
        },


        {
            id:
                "opening-blinds",

            title:
                "Open blinds and curtains"
        },


        {
            id:
                "opening-laundry",

            title:
                "Collect laundry from bedrooms and bathrooms"
        },


        {
            id:
                "opening-dishwasher",

            title:
                "Empty dishwasher and put dishes away"
        },


        {
            id:
                "opening-kitchen",

            title:
                "Reset kitchen after breakfast"
        },


        {
            id:
                "opening-bathrooms",

            title:
                "Quick reset bathroom counters"
        },


        {
            id:
                "opening-laundry-flow",

            title:
                "Start or move the first laundry load"
        },


        {
            id:
                "opening-strays",

            title:
                "Put away visible stray items"
        },


        {
            id:
                "opening-living",

            title:
                "Quick reset of the main living area"
        },


        {
            id:
                "opening-plants",

            title:
                "Check plants and water if needed"
        }

    ];



    const CLOSING_TASKS = [

        {
            id:
                "closing-dishwasher",

            title:
                "Load and run dishwasher"
        },


        {
            id:
                "closing-sink",

            title:
                "Leave kitchen sink empty"
        },


        {
            id:
                "closing-counters",

            title:
                "Reset kitchen counters and island"
        },


        {
            id:
                "closing-dining",

            title:
                "Reset dining and breakfast areas"
        },


        {
            id:
                "closing-living",

            title:
                "Reset living room"
        },


        {
            id:
                "closing-strays",

            title:
                "Put away visible stray items downstairs"
        },


        {
            id:
                "closing-laundry",

            title:
                "Check laundry — move, fold or put away"
        },


        {
            id:
                "closing-upstairs",

            title:
                "Complete a five-minute upstairs reset"
        },


        {
            id:
                "closing-trash",

            title:
                "Check kitchen trash and take out if needed"
        },


        {
            id:
                "closing-morning",

            title:
                "Prepare anything needed for tomorrow morning"
        }

    ];



    /* ============================================================
       CREATE DAILY TASK
    ============================================================ */

    function createDailyTask(
        task
    ) {

        return {

            id:
                task.id,

            title:
                task.title,

            done:
                false,

            completedAt:
                null,

            custom:
                false

        };

    }



    /* ============================================================
       DEFAULT HOME

       IMPORTANT:

       This is used only when:

       - HomeOS runs for the first time
       - Saved state cannot be recovered
       - HomeStore.reset() is deliberately called

       Existing saved state is MERGED with this structure.
    ============================================================ */

    const DEFAULT_STATE = {

        version:
            CORE_VERSION,


        /* ========================================================
           SETTINGS
        ======================================================== */

        settings: {

            theme:
                "light"

        },



        /* ========================================================
           CLEANING
        ======================================================== */

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


            zones: [

                {
                    id:
                        "z01",

                    code:
                        "Z-01",

                    name:
                        "Master Suite",

                    icon:
                        "MB",

                    color:
                        "#8e63ff",

                    soft:
                        "#f1ebff",

                    progress:
                        87,

                    status:
                        "SETTLED",

                    description:
                        "Master bedroom, master bathroom and both walk-in closets.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z02",

                    code:
                        "Z-02",

                    name:
                        "Kids Wing + Den",

                    icon:
                        "KW",

                    color:
                        "#22c7e9",

                    soft:
                        "#e7faff",

                    progress:
                        82,

                    status:
                        "SETTLED",

                    description:
                        "Reset the kids' rooms, shared bath, den and upstairs traffic areas.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z03",

                    code:
                        "Z-03",

                    name:
                        "Laundry + Linen",

                    icon:
                        "LL",

                    color:
                        "#28d4c2",

                    soft:
                        "#e9fbf8",

                    progress:
                        72,

                    status:
                        "ACTIVE",

                    description:
                        "Laundry room, linen closet, upstairs landing and stairs.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z04",

                    code:
                        "Z-04",

                    name:
                        "Main Living",

                    icon:
                        "ML",

                    color:
                        "#f0b23f",

                    soft:
                        "#fff7e6",

                    progress:
                        91,

                    status:
                        "SETTLED",

                    description:
                        "Entryway, formal dining room, living room and breakfast area.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z05",

                    code:
                        "Z-05",

                    name:
                        "Kitchen + Pantry",

                    icon:
                        "KP",

                    color:
                        "#ff667d",

                    soft:
                        "#fff0f3",

                    progress:
                        69,

                    status:
                        "ATTENTION",

                    description:
                        "Kitchen, walk-in pantry, refrigerator, freezers and mini fridge.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z06",

                    code:
                        "Z-06",

                    name:
                        "Mother-in-Law Suite",

                    icon:
                        "MI",

                    color:
                        "#f15fa9",

                    soft:
                        "#fff0f7",

                    progress:
                        89,

                    status:
                        "SETTLED",

                    description:
                        "Mother-in-law bedroom and private bathroom.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z07",

                    code:
                        "Z-07",

                    name:
                        "Basement",

                    icon:
                        "BS",

                    color:
                        "#5487ff",

                    soft:
                        "#edf2ff",

                    progress:
                        74,

                    status:
                        "ACTIVE",

                    description:
                        "Basement bedrooms, bathroom, living room and commons spaces.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z08",

                    code:
                        "Z-08",

                    name:
                        "Outdoor Living",

                    icon:
                        "OL",

                    color:
                        "#83c940",

                    soft:
                        "#f0f8e7",

                    progress:
                        68,

                    status:
                        "ATTENTION",

                    description:
                        "Front porch, yard, decks and outdoor family spaces.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                },


                {
                    id:
                        "z09",

                    code:
                        "Z-09",

                    name:
                        "Garage",

                    icon:
                        "GA",

                    color:
                        "#ff844d",

                    soft:
                        "#fff1e9",

                    progress:
                        81,

                    status:
                        "SETTLED",

                    description:
                        "Garage storage, floors and utility areas.",

                    lastQuickAt:
                        null,

                    lastStandardAt:
                        null,

                    lastDeepAt:
                        null

                }

            ],


            history:
                []

        },



        /* ========================================================
           DAILY RHYTHM

           CANONICAL MODEL:

               Opening
               Closing

           Morning / Day are no longer part of the current model.
        ======================================================== */

        dailyRhythm: {

            version:
                DAILY_VERSION,


            currentDate:
                getLocalDateKey(),


            selectedShift:
                "opening",


            opening:
                OPENING_TASKS
                    .map(
                        createDailyTask
                    ),


            closing:
                CLOSING_TASKS
                    .map(
                        createDailyTask
                    ),


            history:
                [],


            lastResetAt:
                null

        },



        /* ========================================================
           LAUNDRY

           IMPORTANT:
           NO FAKE ACTIVE LOADS.

           laundry.js is responsible for initializing its recurring
           schedule and maintenance definitions.
        ======================================================== */

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



        /* ========================================================
           INVENTORY

           inventory.js will initialize the six storage zones and
           starter tracked items if the user has never used Inventory.
        ======================================================== */

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



        /* ========================================================
           SEASONAL HOME CARE

           seasonal.js owns detailed checklists.

           We keep all four season shells here so Dashboard can
           safely read them before a detail page is opened.
        ======================================================== */

        seasonal: {

            activeSeason:
                "fall",


            seasons: {

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

            }

        },



        /* ========================================================
           HOME MEMORY ACTIVITY STREAM
        ======================================================== */

        activity:
            []

    };



    /* ============================================================
       GENERAL UTILITIES
    ============================================================ */

    function clone(
        value
    ) {

        return JSON.parse(
            JSON.stringify(
                value
            )
        );

    }



    function clamp(
        value,
        minimum = 0,
        maximum = 100
    ) {

        const number =
            Number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
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



    /* ============================================================
       SAFE STATE MERGE

       RULE:

       - New default fields get added.
       - Existing saved fields remain.
       - Unknown module-specific fields remain.
       - Arrays from saved state are preserved.

       This is what lets us evolve HomeOS without deleting user data.
    ============================================================ */

    function mergeState(
        defaults,
        saved
    ) {

        if (
            Array.isArray(
                defaults
            )
        ) {

            return Array.isArray(
                saved
            )
                ? saved

                : clone(
                    defaults
                );

        }


        if (
            typeof defaults !==
                "object" ||
            defaults ===
                null
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
                "object"
        ) {

            Object
                .keys(
                    saved
                )
                .forEach(
                    key => {

                        if (
                            key in
                            defaults
                        ) {

                            merged[
                                key
                            ] =
                                mergeState(

                                    defaults[
                                        key
                                    ],

                                    saved[
                                        key
                                    ]

                                );

                        }


                        else {

                            /*
                               Preserve data belonging to modules
                               introduced after this store version.
                            */

                            merged[
                                key
                            ] =
                                saved[
                                    key
                                ];

                        }

                    }
                );

        }


        return merged;

    }



    /* ============================================================
       DAILY RHYTHM MIGRATION HELPERS
    ============================================================ */

    function normalizeTitle(
        value
    ) {

        return String(
            value || ""
        )
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                " "
            )
            .trim();

    }



    function findLegacyTask(
        tasks,
        searchTerms
    ) {

        const safeTasks =
            Array.isArray(
                tasks
            )
                ? tasks

                : [];


        return safeTasks
            .find(
                task => {

                    const title =
                        normalizeTitle(
                            task.title
                        );


                    return searchTerms
                        .some(
                            term =>
                                title.includes(
                                    normalizeTitle(
                                        term
                                    )
                                )
                        );

                }
            );

    }



    /* ============================================================
       MIGRATE OLD MORNING + DAY → OPENING

       This only runs if a saved HomeOS does NOT already contain
       the new opening array.

       We try to preserve completion from the old checklist.
    ============================================================ */

    function migrateOpeningTasks(
        rhythm
    ) {

        const legacyTasks = [

            ...(
                Array.isArray(
                    rhythm.morning
                )
                    ? rhythm.morning

                    : []
            ),

            ...(
                Array.isArray(
                    rhythm.day
                )
                    ? rhythm.day

                    : []
            )

        ];


        const matchingTerms = {

            "opening-make-beds":
                [
                    "make beds"
                ],


            "opening-blinds":
                [
                    "open blinds"
                ],


            "opening-laundry":
                [
                    "collect laundry"
                ],


            "opening-dishwasher":
                [
                    "empty dishwasher"
                ],


            "opening-kitchen":
                [
                    "kitchen reset",
                    "check kitchen"
                ],


            "opening-bathrooms":
                [
                    "bathroom counter"
                ],


            "opening-laundry-flow":
                [
                    "move laundry"
                ],


            "opening-strays":
                [
                    "put away stray"
                ],


            "opening-living":
                [
                    "reset main living"
                ],


            "opening-plants":
                []

        };


        const migrated =
            OPENING_TASKS
                .map(
                    starter => {

                        const old =
                            findLegacyTask(

                                legacyTasks,

                                matchingTerms[
                                    starter.id
                                ] || []

                            );


                        return {

                            id:
                                starter.id,

                            title:
                                starter.title,

                            done:
                                Boolean(
                                    old?.done
                                ),

                            completedAt:
                                old?.completedAt ||
                                null,

                            custom:
                                false

                        };

                    }
                );



        /*
           Preserve any custom tasks that happened to exist in the
           old Morning / Day model.
        */

        legacyTasks
            .filter(
                task =>
                    task.custom
            )
            .forEach(
                task => {

                    migrated.push({

                        ...task,

                        id:
                            task.id ||
                            `opening-custom-${Date.now()}-${Math.random()}`,

                        custom:
                            true

                    });

                }
            );


        return migrated;

    }



    /* ============================================================
       MIGRATE OLD CLOSING → NEW CLOSING
    ============================================================ */

    function migrateClosingTasks(
        rhythm
    ) {

        const oldClosing =
            Array.isArray(
                rhythm.closing
            )
                ? rhythm.closing

                : [];


        const matchingTerms = {

            "closing-dishwasher":
                [
                    "run dishwasher"
                ],


            "closing-sink":
                [
                    "sink"
                ],


            "closing-counters":
                [
                    "reset counters"
                ],


            "closing-dining":
                [
                    "dining"
                ],


            "closing-living":
                [
                    "reset living room"
                ],


            "closing-strays":
                [
                    "stray"
                ],


            "closing-laundry":
                [
                    "check laundry"
                ],


            "closing-upstairs":
                [
                    "upstairs reset"
                ],


            "closing-trash":
                [
                    "trash"
                ],


            "closing-morning":
                [
                    "prepare for morning"
                ]

        };


        const migrated =
            CLOSING_TASKS
                .map(
                    starter => {

                        const exact =
                            oldClosing
                                .find(
                                    task =>
                                        task.id ===
                                        starter.id
                                );


                        const old =
                            exact ||
                            findLegacyTask(

                                oldClosing,

                                matchingTerms[
                                    starter.id
                                ] || []

                            );


                        return {

                            id:
                                starter.id,

                            title:
                                starter.title,

                            done:
                                Boolean(
                                    old?.done
                                ),

                            completedAt:
                                old?.completedAt ||
                                null,

                            custom:
                                false

                        };

                    }
                );


        oldClosing
            .filter(
                task =>
                    task.custom
            )
            .forEach(
                task => {

                    if (
                        !migrated.some(
                            item =>
                                item.id ===
                                task.id
                        )
                    ) {

                        migrated.push({

                            ...task,

                            custom:
                                true

                        });

                    }

                }
            );


        return migrated;

    }



    /* ============================================================
       DAILY PROGRESS CALCULATOR
    ============================================================ */

    function calculateTaskProgress(
        tasks
    ) {

        const list =
            Array.isArray(
                tasks
            )
                ? tasks

                : [];


        const total =
            list.length;


        const completed =
            list
                .filter(
                    task =>
                        task.done
                )
                .length;


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
       ARCHIVE DAILY RHYTHM

       HomeOS keeps the last 30 archived days.

       We store summary percentages instead of duplicating the entire
       checklist every single day.
    ============================================================ */

    function archiveDailyRhythm(
        state,
        dateKey
    ) {

        const rhythm =
            state.dailyRhythm;


        if (
            !dateKey
        ) {

            return;

        }


        if (
            !Array.isArray(
                rhythm.history
            )
        ) {

            rhythm.history =
                [];

        }


        const alreadyArchived =
            rhythm.history
                .some(
                    day =>
                        day.date ===
                        dateKey
                );


        if (
            alreadyArchived
        ) {

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


        const allTasks = [

            ...(
                rhythm.opening ||
                []
            ),

            ...(
                rhythm.closing ||
                []
            )

        ];


        const overall =
            calculateTaskProgress(
                allTasks
            );


        rhythm.history
            .unshift({

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
            rhythm.history
                .slice(
                    0,
                    30
                );

    }



    /* ============================================================
       DAILY NEW-DAY RESET

       This runs centrally through HomeStore.

       That means Dashboard can trigger the rollover even if the user
       has NOT opened daily.html yet.
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



        /* --------------------------------------------------------
           SAVE YESTERDAY
        -------------------------------------------------------- */

        archiveDailyRhythm(

            state,

            rhythm.currentDate

        );



        /* --------------------------------------------------------
           RESET OPENING
        -------------------------------------------------------- */

        (
            rhythm.opening ||
            []
        )
            .forEach(
                task => {

                    task.done =
                        false;


                    task.completedAt =
                        null;

                }
            );



        /* --------------------------------------------------------
           RESET CLOSING
        -------------------------------------------------------- */

        (
            rhythm.closing ||
            []
        )
            .forEach(
                task => {

                    task.done =
                        false;


                    task.completedAt =
                        null;

                }
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
       NORMALIZE / UPGRADE SAVED HOMEOS STATE

       This lets old saved versions survive architecture changes.
    ============================================================ */

    function normalizeState(
        state
    ) {

        state.version =
            CORE_VERSION;



        /* ========================================================
           SHARED ARRAYS
        ======================================================== */

        if (
            !Array.isArray(
                state.activity
            )
        ) {

            state.activity =
                [];

        }



        /* ========================================================
           DAILY RHYTHM
        ======================================================== */

        if (
            !state.dailyRhythm ||
            typeof state.dailyRhythm !==
                "object"
        ) {

            state.dailyRhythm =
                clone(
                    DEFAULT_STATE.dailyRhythm
                );

        }


        const rhythm =
            state.dailyRhythm;


        /*
           Only migrate if Opening does not already exist.

           This protects the Daily Rhythm page the user has already
           configured.
        */

        if (
            !Array.isArray(
                rhythm.opening
            )
        ) {

            rhythm.opening =
                migrateOpeningTasks(
                    rhythm
                );

        }


        /*
           Old Closing arrays can still exist.

           If this store has never been upgraded to version 2,
           convert them to the new canonical Closing tasks.
        */

        if (
            rhythm.version !==
                DAILY_VERSION
        ) {

            rhythm.closing =
                migrateClosingTasks(
                    rhythm
                );

        }


        else if (
            !Array.isArray(
                rhythm.closing
            )
        ) {

            rhythm.closing =
                CLOSING_TASKS
                    .map(
                        createDailyTask
                    );

        }


        if (
            !Array.isArray(
                rhythm.history
            )
        ) {

            rhythm.history =
                [];

        }



        /*
           Transitional compatibility:

           Old Dashboard code may still have stored:
               morning
               day

           Both are now treated as Opening.
        */

        if (
            ![
                "opening",
                "closing"
            ]
                .includes(
                    rhythm.selectedShift
                )
        ) {

            rhythm.selectedShift =
                rhythm.selectedShift ===
                    "closing"

                    ? "closing"

                    : "opening";

        }


        rhythm.version =
            DAILY_VERSION;


        rollDailyRhythmIfNeeded(
            state
        );



        /* ========================================================
           LAUNDRY
        ======================================================== */

        if (
            !state.laundry ||
            typeof state.laundry !==
                "object"
        ) {

            state.laundry =
                clone(
                    DEFAULT_STATE.laundry
                );

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



        /* ========================================================
           INVENTORY
        ======================================================== */

        if (
            !state.inventory ||
            typeof state.inventory !==
                "object"
        ) {

            state.inventory =
                clone(
                    DEFAULT_STATE.inventory
                );

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



        /* ========================================================
           SEASONAL
        ======================================================== */

        if (
            !state.seasonal ||
            typeof state.seasonal !==
                "object"
        ) {

            state.seasonal =
                clone(
                    DEFAULT_STATE.seasonal
                );

        }


        if (
            !state.seasonal.seasons ||
            typeof state.seasonal.seasons !==
                "object"
        ) {

            state.seasonal.seasons =
                clone(
                    DEFAULT_STATE
                        .seasonal
                        .seasons
                );

        }


        return state;

    }



    /* ============================================================
       STORAGE — READ

       getState():

       1. Reads localStorage.
       2. Merges new schema fields.
       3. Runs migrations.
       4. Handles Daily Rhythm rollover.
       5. Silently saves upgraded structure if necessary.

       IMPORTANT:
       Silent normalization does NOT fire homeos:statechange.
    ============================================================ */

    function getState() {

        const saved =
            localStorage
                .getItem(
                    STORAGE_KEY
                );


        if (
            !saved
        ) {

            const initial =
                normalizeState(
                    clone(
                        DEFAULT_STATE
                    )
                );


            localStorage
                .setItem(

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

                    DEFAULT_STATE,

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
               Upgrade storage quietly if schema changed.

               We deliberately do not dispatch an event here because
               getState() is a read operation and can be called while
               rendering.
            */

            if (
                normalizedJson !==
                saved
            ) {

                localStorage
                    .setItem(

                        STORAGE_KEY,

                        normalizedJson

                    );

            }


            return normalized;

        }


        catch (
            error
        ) {

            console.error(
                "DARLING HomeOS storage error:",
                error
            );


            const resetState =
                normalizeState(
                    clone(
                        DEFAULT_STATE
                    )
                );


            localStorage
                .setItem(

                    STORAGE_KEY,

                    JSON.stringify(
                        resetState
                    )

                );


            return resetState;

        }

    }



    /* ============================================================
       STORAGE — SAVE

       saveState() is the official write point.

       After saving, HomeOS broadcasts:

           homeos:statechange

       Page controllers listen to this event and redraw themselves.
    ============================================================ */

    function saveState(
        state
    ) {

        const normalized =
            normalizeState(
                state
            );


        localStorage
            .setItem(

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
       STORAGE — UPDATE

       Preferred state-changing pattern:

           HomeStore.update(state => {
               state.inventory...
           });

       The updated state is automatically saved and broadcast.
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
       THEME
    ============================================================ */

    function setTheme(
        theme
    ) {

        const safeTheme =
            theme ===
                "dark"

                ? "dark"

                : "light";


        return update(
            state => {

                state.settings.theme =
                    safeTheme;

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

        const zones =
            state.cleaning
                ?.zones ||
            [];


        return zones
            .find(
                zone =>
                    zone.id ===
                    zoneId
            ) ||
            null;

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


                if (
                    exists
                ) {

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


        if (
            !zones.length
        ) {

            return 100;

        }


        const total =
            zones.reduce(
                (
                    sum,
                    zone
                ) => {

                    return (
                        sum +
                        clamp(
                            zone.progress
                        )
                    );

                },
                0
            );


        return Math.round(
            total /
            zones.length
        );

    }



    /* ============================================================
       DAILY RHYTHM — COMPATIBILITY

       During cleanup some older Dashboard code may still request:

           morning
           day

       Both are temporarily mapped to:

           opening

       This prevents the main page from breaking while we replace
       dashboard.js and index.html next.
    ============================================================ */

    function normalizeRhythmShift(
        shift
    ) {

        if (
            shift ===
                "closing"
        ) {

            return "closing";

        }


        return "opening";

    }



    /* ============================================================
       SCORE ONE DAILY SHIFT
    ============================================================ */

    function getRhythmScore(
        shift,
        state = getState()
    ) {

        const safeShift =
            normalizeRhythmShift(
                shift
            );


        const tasks =
            state.dailyRhythm[
                safeShift
            ] || [];


        return calculateTaskProgress(
            tasks
        ).percent;

    }



    /* ============================================================
       SCORE WHOLE DAILY RHYTHM

       TIME-AWARE:

       Before 3 PM:
           Opening is the responsibility currently being measured.

       3 PM and later:
           Opening + Closing count together.

       This avoids lowering Home Pulse for an untouched Closing Shift
       early in the morning.
    ============================================================ */

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



    /* ============================================================
       TOGGLE DAILY TASK
    ============================================================ */

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

                const tasks =
                    state.dailyRhythm[
                        safeShift
                    ] || [];


                const task =
                    tasks
                        .find(
                            item =>
                                item.id ===
                                taskId
                        );


                if (
                    !task
                ) {

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



    /* ============================================================
       SELECT DAILY SHIFT
    ============================================================ */

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
       LAUNDRY HELPERS
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



    function normalizeDayName(
        value
    ) {

        return String(
            value || ""
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



    /* ============================================================
       MONDAY-BASED WEEK KEY

       Used by recurring Laundry schedules.
    ============================================================ */

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
            day ===
                0

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

            current
                .getFullYear(),

            String(
                current.getMonth() +
                1
            )
                .padStart(
                    2,
                    "0"
                ),

            String(
                current.getDate()
            )
                .padStart(
                    2,
                    "0"
                )

        ]
            .join(
                "-"
            );

    }



    /* ============================================================
       LAUNDRY HEALTH

       WEIGHTING:

           Weekly Schedule     50%
           Active Loads        30%
           Room Maintenance    20%

       NOTE:

       This calculates health only.

       laundry.js still controls which weekday tab is selected and
       how load cards redraw. We will repair that page separately.
    ============================================================ */

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
            LAUNDRY_DAYS
                .indexOf(
                    today
                );


        const weekKey =
            getLaundryWeekKey();



        /* ========================================================
           LOAD STAGE SCORES
        ======================================================== */

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



        /* ========================================================
           WEEKLY SCHEDULE SCORE
        ======================================================== */

        const dueItems =
            schedule
                .filter(
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
                            index !==
                                -1 &&
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
                dueItems
                    .map(
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


                            if (
                                complete
                            ) {

                                return 100;

                            }


                            const active =
                                activeLoads
                                    .find(
                                        load =>
                                            load.scheduleId ===
                                            item.id
                                    );


                            if (
                                active
                            ) {

                                return (
                                    stageScores[
                                        active.stage
                                    ] ||
                                    35
                                );

                            }


                            /*
                               Today's unstarted load is less urgent
                               than a load left behind from an earlier
                               day this week.
                            */

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



        /* ========================================================
           ACTIVE FLOW SCORE
        ======================================================== */

        let activeScore =
            100;


        if (
            activeLoads.length
        ) {

            activeScore =
                Math.round(

                    activeLoads
                        .reduce(
                            (
                                total,
                                load
                            ) => {

                                return (
                                    total +
                                    (
                                        stageScores[
                                            load.stage
                                        ] ||
                                        35
                                    )
                                );

                            },
                            0
                        ) /

                    activeLoads.length

                );

        }



        /* ========================================================
           MAINTENANCE SCORE
        ======================================================== */

        let maintenanceScore =
            100;


        if (
            maintenance.length
        ) {

            const values =
                maintenance
                    .map(
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

                                /*
                                   New maintenance tasks start at a
                                   neutral baseline instead of ruining
                                   Home Pulse immediately.
                                */

                                return 80;

                            }


                            const age =
                                daysSince(
                                    task.lastCompletedAt
                                );


                            if (
                                age ===
                                    null
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



        /* ========================================================
           FINAL LAUNDRY HEALTH
        ======================================================== */

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
       INVENTORY HEALTH

       If tracked Inventory items exist we calculate from the actual
       items so Home Pulse never depends on a stale stored percentage.

       inventory.js also keeps state.inventory.health synchronized.
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
            items
                .filter(
                    item =>
                        Number(
                            item.target
                        ) > 0
                );


        if (
            tracked.length
        ) {

            const total =
                tracked
                    .reduce(
                        (
                            sum,
                            item
                        ) => {

                            const target =
                                Math.max(
                                    1,

                                    Number(
                                        item.target
                                    ) || 1
                                );


                            const current =
                                Math.max(
                                    0,

                                    Number(
                                        item.current
                                    ) || 0
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

        const seasonal =
            state.seasonal ||
            {};


        const selected =
            seasonal.activeSeason ||
            "fall";


        const season =
            seasonal.seasons?.[
                selected
            ];


        if (
            !season
        ) {

            return 100;

        }


        return clamp(
            season.progress ??
            0
        );

    }



    function setActiveSeason(
        season
    ) {

        return update(
            state => {

                if (
                    state.seasonal
                        .seasons?.[
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
       HOME PULSE — SYSTEM SCORES

       The five live systems are now:

           Cleaning
           Daily Rhythm
           Laundry
           Inventory
           Seasonal
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



    /* ============================================================
       HOME PULSE

       WEIGHTS:

           Cleaning       30%
           Daily Rhythm   20%
           Laundry        20%
           Inventory      17%
           Seasonal       13%

       TOTAL:
           100%
    ============================================================ */

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



    /* ============================================================
       HOME PRIORITY

       IMPORTANT TRANSITION NOTE:

       Daily Rhythm affects Home Pulse now.

       However, until we replace the current Dashboard controller,
       Priority remains limited to:

           Cleaning
           Laundry
           Inventory
           Seasonal

       Your current dashboard only has labels for these four systems.

       Once dashboard.js is cleaned, we can safely decide whether
       Daily Rhythm should also become a top-level Home Priority.
    ============================================================ */

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


        return Object
            .entries(
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
       TIME — DAYS SINCE
    ============================================================ */

    function daysSince(
        dateString
    ) {

        if (
            !dateString
        ) {

            return null;

        }


        const date =
            new Date(
                dateString
            );


        const timestamp =
            date.getTime();


        if (
            !Number.isFinite(
                timestamp
            )
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



    /* ============================================================
       TIME — MINUTES SINCE
    ============================================================ */

    function minutesSince(
        dateString
    ) {

        if (
            !dateString
        ) {

            return null;

        }


        const date =
            new Date(
                dateString
            );


        const timestamp =
            date.getTime();


        if (
            !Number.isFinite(
                timestamp
            )
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



    /* ============================================================
       RESET HOMEOS

       WARNING:

       This intentionally clears saved HomeOS state and returns the
       application to DEFAULT_STATE.

       It should only be called from a deliberate future Reset HomeOS
       control.

       Normal page loading NEVER calls reset().
    ============================================================ */

    function reset() {

        const state =
            normalizeState(
                clone(
                    DEFAULT_STATE
                )
            );


        saveState(
            state
        );


        return state;

    }



    /* ============================================================
       PUBLIC HOMEOS API

       Keep this centralized.

       Pages should call these functions instead of reaching into
       localStorage themselves.
    ============================================================ */

    window.HomeStore = {


        /* --------------------------------------------------------
           CORE STATE
        -------------------------------------------------------- */

        getState,

        saveState,

        update,



        /* --------------------------------------------------------
           SETTINGS
        -------------------------------------------------------- */

        setTheme,



        /* --------------------------------------------------------
           CLEANING
        -------------------------------------------------------- */

        getZone,

        setSelectedZone,

        getCleaningScore,



        /* --------------------------------------------------------
           DAILY RHYTHM
        -------------------------------------------------------- */

        getRhythmScore,

        getDailyRhythmScore,

        toggleRhythmTask,

        setRhythmShift,



        /* --------------------------------------------------------
           LAUNDRY
        -------------------------------------------------------- */

        getLaundryScore,

        getLaundryToday,

        getLaundryWeekKey,



        /* --------------------------------------------------------
           INVENTORY
        -------------------------------------------------------- */

        getInventoryScore,



        /* --------------------------------------------------------
           SEASONAL
        -------------------------------------------------------- */

        getSeasonScore,

        setActiveSeason,



        /* --------------------------------------------------------
           HOME INTELLIGENCE
        -------------------------------------------------------- */

        getSystemScores,

        getHomePulse,

        getPriority,



        /* --------------------------------------------------------
           TIME
        -------------------------------------------------------- */

        daysSince,

        minutesSince,

        getLocalDateKey,



        /* --------------------------------------------------------
           RESET
        -------------------------------------------------------- */

        reset

    };


})();