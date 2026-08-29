/* ================================================================
   DARLING HOMEOS
   DASHBOARD CONTROLLER

   FILE:
   assets/js/dashboard.js

   OWNS:
   - Dashboard rendering
   - Dashboard-only UI state
   - Dashboard quick actions
   - HomeOS guide messaging

   DOES NOT OWN:
   - Persistence
   - Shared shell
   - Module workflows
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    if (!window.HomeStore || !window.HomeApp) {
        console.error(
            "DARLING HomeOS Dashboard requires HomeStore and HomeApp."
        );

        return;
    }


    const Dashboard = {

        selectedZoneId: null,

        selectedRhythm:
            "opening",

        lastDateKey:
            null,

        clockTimer:
            null,


        /* ============================================================
           START
        ============================================================ */

        init() {

            const state =
                HomeStore.getState();


            this.selectedZoneId =
                this.resolveSelectedZone(
                    state
                );


            this.selectedRhythm =
                this.resolveRhythmShift(
                    state
                );


            this.lastDateKey =
                HomeStore.getLocalDateKey();


            this.bindEvents();

            this.bindStateEvents();

            this.render(
                state
            );

            this.startClock();

        },


        /* ============================================================
           HOMEOS STATE CONNECTION
        ============================================================ */

        bindStateEvents() {

            window.addEventListener(
                "homeos:statechange",
                event => {

                    const state =
                        event.detail ||
                        HomeStore.getState();


                    const savedZone =
                        state.cleaning
                            ?.selectedZone;


                    const zoneStillExists =
                        state.cleaning
                            ?.zones
                            ?.some(
                                zone =>
                                    zone.id ===
                                    savedZone
                            );


                    if (
                        zoneStillExists
                    ) {

                        this.selectedZoneId =
                            savedZone;

                    }


                    const savedShift =
                        state.dailyRhythm
                            ?.selectedShift;


                    if (
                        [
                            "opening",
                            "closing"
                        ]
                            .includes(
                                savedShift
                            )
                    ) {

                        this.selectedRhythm =
                            savedShift;

                    }


                    this.render(
                        state
                    );

                }
            );

        },


        /* ============================================================
           MASTER RENDER
        ============================================================ */

        render(
            providedState = null
        ) {

            const state =
                providedState ||
                HomeStore.getState();


            this.renderHomeHealth(
                state
            );

            this.renderFocus(
                state
            );

            this.renderZones(
                state
            );

            this.renderRhythm(
                state
            );

            this.renderLaundry(
                state
            );

            this.renderInventory(
                state
            );

            this.renderSeasonal(
                state
            );

        },


        /* ============================================================
           CLOCK
        ============================================================ */

        startClock() {

            this.updateClock();


            if (
                this.clockTimer
            ) {

                clearInterval(
                    this.clockTimer
                );

            }


            this.clockTimer =
                setInterval(
                    () => {

                        this.updateClock();

                    },
                    1000
                );

        },


        updateClock() {

            const now =
                new Date();


            const greeting =
                HomeApp.getGreeting(
                    now
                );


            const greetingElement =
                document.getElementById(
                    "dashboardGreeting"
                );


            if (
                greetingElement
            ) {

                greetingElement.innerHTML =
                    `${greeting},<br><span>Darling.</span>`;

            }


            this.setText(
                "dashboardDateTime",
                `${HomeApp.formatDate(now)} · ${HomeApp.formatTime(now)}`
            );


            this.setText(
                "todayDayChip",
                HomeApp.getDayCode(
                    now
                )
            );


            /*
               store.js owns rollover.

               Dashboard only notices that the local date changed
               and asks HomeStore for the current state.
            */

            const today =
                HomeStore.getLocalDateKey(
                    now
                );


            if (
                this.lastDateKey &&
                today !==
                    this.lastDateKey
            ) {

                this.lastDateKey =
                    today;


                const state =
                    HomeStore.getState();


                this.selectedRhythm =
                    this.getRecommendedRhythm(
                        state
                    );


                this.render(
                    state
                );


                return;

            }


            this.lastDateKey =
                today;

        },


        /* ============================================================
           HOME PULSE
        ============================================================ */

        renderHomeHealth(
            state
        ) {

            const pulse =
                HomeStore.getHomePulse(
                    state
                );


            const status =
                HomeApp.getHomeStatus(
                    pulse
                );


            const priority =
                HomeStore.getPriority(
                    state
                );


            const priorityLabels = {

                cleaning:
                    "Cleaning",

                rhythm:
                    "Daily Rhythm",

                laundry:
                    "Laundry",

                inventory:
                    "Inventory",

                seasonal:
                    "Seasonal"

            };


            this.setText(
                "homePulseValue",
                `${pulse}%`
            );


            this.setText(
                "homePulseStatus",
                status
            );


            this.setText(
                "homePriority",
                priorityLabels[
                    priority
                ] ||
                "Home"
            );


            let signal =
                "Needs You";


            if (
                pulse >= 85
            ) {

                signal =
                    "Strong";

            }

            else if (
                pulse >= 72
            ) {

                signal =
                    "Stable";

            }

            else if (
                pulse >= 55
            ) {

                signal =
                    "Active";

            }


            this.setText(
                "homeSignal",
                signal
            );


            const ring =
                document.getElementById(
                    "homePulseRing"
                );


            if (
                ring
            ) {

                const fullAngle =
                    Math.round(
                        pulse *
                        3.6
                    );


                const middleAngle =
                    Math.round(
                        fullAngle *
                        0.48
                    );


                ring.style.setProperty(
                    "--pulse-value",
                    `${fullAngle}deg`
                );


                ring.style.background = `
                    conic-gradient(
                        from 220deg,

                        var(--inventory)
                        0deg,

                        var(--cleaning)
                        ${middleAngle}deg,

                        var(--laundry)
                        ${fullAngle}deg,

                        var(--surface-muted)
                        ${fullAngle}deg,

                        var(--surface-muted)
                        360deg
                    )
                `;

            }


            this.renderGuide(
                state,
                pulse,
                priority
            );

        },


        /* ============================================================
           HOMEOS GUIDE
        ============================================================ */

        renderGuide(
            state,
            pulse,
            priority
        ) {

            const plan =
                this.getGuidePlan(
                    state,
                    pulse,
                    priority
                );


            this.setText(
                "homeMessageTitle",
                plan.title
            );


            this.setText(
                "homeMessageText",
                plan.message
            );


            const action =
                document.querySelector(
                    ".guide-action"
                );


            if (
                !action
            ) {

                return;

            }


            action.href =
                plan.href;


            action.innerHTML = `
                ${HomeApp.escapeHtml(plan.action)}
                <span>→</span>
            `;


            action.dataset
                .guideSystem =
                plan.system;

        },


        getGuidePlan(
            state,
            pulse,
            priority
        ) {

            const zones =
                state.cleaning
                    ?.zones ||
                [];


            const selectedZone =
                zones.find(
                    zone =>
                        zone.id ===
                        this.selectedZoneId
                ) ||
                zones[0];


            const loads =
                Array.isArray(
                    state.laundry
                        ?.activeLoads
                )
                    ? state.laundry
                        .activeLoads

                    : [];


            const lowItems =
                Array.isArray(
                    state.inventory
                        ?.lowItems
                )
                    ? state.inventory
                        .lowItems

                    : [];


            /*
               Dashboard never decides what season the house is in.

               HomeStore's calendar helper is canonical.
            */

            const activeSeason =
                HomeStore.getCalendarSeason();


            const season =
                state.seasonal
                    ?.seasons
                    ?.[
                        activeSeason
                    ];


            const recommendedRhythm =
                this.getRecommendedRhythm(
                    state
                );


            const rhythm =
                this.getDailyOverallProgress(
                    state
                );


            /* --------------------------------------------------------
               LAUNDRY
            -------------------------------------------------------- */

            if (
                priority ===
                    "laundry" &&
                loads.length
            ) {

                const load =
                    loads[0];


                const stage =
                    HomeApp.laundryStageLabel(
                        load.stage ||
                        "wash"
                    );


                const needsYou =
                    load.stage ===
                        "fold" ||

                    load.stage ===
                        "put-away";


                return {

                    system:
                        "laundry",

                    title:
                        needsYou

                            ? `${load.name || "Laundry"} is waiting for you.`

                            : `${load.name || "Laundry"} is moving.`,

                    message:
                        needsYou

                            ? `It is at ${stage}. I would move this load forward first so Laundry Flow does not stall.`

                            : `It is currently at ${stage}. Laundry Flow is active and I am keeping it in view for you.`,

                    action:
                        "Open Laundry Flow",

                    href:
                        "laundry.html"

                };

            }


            /* --------------------------------------------------------
               CLEANING
            -------------------------------------------------------- */

            if (
                priority ===
                    "cleaning" &&
                selectedZone
            ) {

                const level =
                    HomeApp
                        .getSuggestedCleaningLevel(
                            selectedZone
                        );


                return {

                    system:
                        "cleaning",

                    title:
                        `${selectedZone.name} is a good place to start.`,

                    message:
                        `I would use a ${this.titleCase(level)} Clean here. ` +
                        `The zone is currently at ${Number(selectedZone.progress || 0)}%, ` +
                        `so we can improve the house without trying to clean everything at once.`,

                    action:
                        `Start ${this.titleCase(level)} Clean`,

                    href:
                        `cleaning.html?zone=${encodeURIComponent(selectedZone.id)}`

                };

            }


            /* --------------------------------------------------------
               INVENTORY
            -------------------------------------------------------- */

            if (
                priority ===
                "inventory"
            ) {

                if (
                    lowItems.length
                ) {

                    const first =
                        lowItems[0];


                    const needed =
                        Math.max(
                            0,

                            Number(
                                first.target ||
                                0
                            ) -

                            Number(
                                first.current ||
                                0
                            )
                        );


                    return {

                        system:
                            "inventory",

                        title:
                            `${lowItems.length} item${lowItems.length === 1 ? " needs" : "s need"} restocking.`,

                        message:
                            `${first.name} is one of the current shortages` +
                            `${needed ? ` and needs ${needed} more` : ""}. ` +
                            `I can keep the rest together in the HomeOS Shopping List.`,

                        action:
                            "Open Inventory",

                        href:
                            "inventory.html"

                    };

                }


                return {

                    system:
                        "inventory",

                    title:
                        "Your inventory is looking good.",

                    message:
                        "Tracked household stock is close to the levels you prefer. " +
                        "Nothing here needs to become a big project.",

                    action:
                        "View Inventory",

                    href:
                        "inventory.html"

                };

            }


            /* --------------------------------------------------------
               SEASONAL
            -------------------------------------------------------- */

            if (
                priority ===
                "seasonal"
            ) {

                return {

                    system:
                        "seasonal",

                    title:
                        season

                            ? `${season.name} is still in progress.`

                            : "Seasonal Home Care is ready.",

                    message:
                        season

                            ? `${Number(season.progress || 0)}% of this seasonal reset is complete. We can keep moving through it zone by zone.`

                            : "Your seasonal system is ready whenever you want to continue.",

                    action:
                        season

                            ? `Open ${this.titleCase(activeSeason)} Workspace`

                            : "Open Seasonal Care",

                    href:
                        season

                            ? `seasons/${activeSeason}.html`

                            : "seasonal.html"

                };

            }


            /* --------------------------------------------------------
               DAILY RHYTHM PRIORITY

               Store is ready for this once Rhythm becomes eligible
               for top-level Home Priority.
            -------------------------------------------------------- */

            if (
                priority ===
                "rhythm"
            ) {

                const name =
                    recommendedRhythm ===
                        "opening"

                        ? "Opening Shift"

                        : "Closing Shift";


                return {

                    system:
                        "daily",

                    title:
                        `${name} is the next useful move.`,

                    message:
                        `${rhythm.remaining} daily task${rhythm.remaining === 1 ? "" : "s"} remain. ` +
                        "HomeOS will keep the other systems in view while you work through the rhythm.",

                    action:
                        `Open ${name}`,

                    href:
                        "daily.html"

                };

            }


            /* --------------------------------------------------------
               HOME IS STRONG
            -------------------------------------------------------- */

            if (
                pulse >=
                    85 &&
                rhythm.percent <
                    100
            ) {

                const name =
                    recommendedRhythm ===
                        "opening"

                        ? "Opening Shift"

                        : "Closing Shift";


                return {

                    system:
                        "daily",

                    title:
                        "Your home is in a really good place.",

                    message:
                        `${name} is the easiest next move. ` +
                        "Everything else is stable enough to stay in the background.",

                    action:
                        `Open ${name}`,

                    href:
                        "daily.html"

                };

            }


            /* --------------------------------------------------------
               FULLY SETTLED
            -------------------------------------------------------- */

            if (
                rhythm.percent ===
                100
            ) {

                return {

                    system:
                        "home",

                    title:
                        "Everything is in flow.",

                    message:
                        "Opening and Closing are complete, and the major home systems are holding steady. " +
                        "You do not need to create more work just because HomeOS is open.",

                    action:
                        "View Home Map",

                    href:
                        "cleaning.html"

                };

            }


            return {

                system:
                    "daily",

                title:
                    "Your home is holding its rhythm.",

                message:
                    "I am keeping Cleaning, Laundry, Inventory, Daily Rhythm and Seasonal Home Care connected. " +
                    "We only need to move the next thing forward.",

                action:
                    "Open Daily Rhythm",

                href:
                    "daily.html"

            };

        },


        /* ============================================================
           TODAY'S FOCUS
        ============================================================ */

        resolveSelectedZone(
            state
        ) {

            const zones =
                state.cleaning
                    ?.zones ||
                [];


            const saved =
                state.cleaning
                    ?.selectedZone;


            if (
                zones.some(
                    zone =>
                        zone.id ===
                        saved
                )
            ) {

                return saved;

            }


            const priorityZone =
                [
                    ...zones
                ]
                    .sort(
                        (
                            first,
                            second
                        ) =>

                            Number(
                                first.progress ||
                                0
                            ) -

                            Number(
                                second.progress ||
                                0
                            )
                    )[0];


            return (
                priorityZone?.id ||
                "z01"
            );

        },


        renderFocus(
            state
        ) {

            let zone =
                HomeStore.getZone(
                    this.selectedZoneId,
                    state
                );


            if (
                !zone
            ) {

                this.selectedZoneId =
                    this.resolveSelectedZone(
                        state
                    );


                zone =
                    HomeStore.getZone(
                        this.selectedZoneId,
                        state
                    );

            }


            if (
                !zone
            ) {

                return;

            }


            this.setText(
                "focusZoneName",
                zone.name
            );


            this.setText(
                "focusZoneDescription",
                zone.description
            );


            this.setText(
                "focusLastStandard",
                HomeApp
                    .formatLastCompleted(
                        zone.lastStandardAt
                    )
            );


            this.setText(
                "focusSuggestedLevel",
                HomeApp
                    .getSuggestedCleaningLevel(
                        zone
                    )
            );


            this.setText(
                "focusCleanState",
                `${Number(zone.progress || 0)}%`
            );


            const line =
                document.getElementById(
                    "focusColorLine"
                );


            if (
                line
            ) {

                line.style.background =
                    zone.color;


                line.style.color =
                    zone.color;


                line.style.boxShadow =
                    `0 0 18px ${zone.color}`;

            }

        },


        /* ============================================================
           ZONE NETWORK
        ============================================================ */

        renderZones(
            state
        ) {

            const container =
                document.getElementById(
                    "zoneNetworkGrid"
                );


            if (
                !container
            ) {

                return;

            }


            const zones =
                state.cleaning
                    ?.zones ||
                [];


            if (
                !zones.length
            ) {

                container.innerHTML = `
                    <div class="empty-state">
                        <div>
                            <h3>
                                Home Map is waiting.
                            </h3>

                            <p>
                                Cleaning has not finished setting up
                                the home zones yet.
                            </p>
                        </div>
                    </div>
                `;


                return;

            }


            container.innerHTML =
                zones
                    .map(
                        zone => {

                            const selected =
                                zone.id ===
                                this.selectedZoneId;


                            const progress =
                                Math.max(
                                    0,

                                    Math.min(
                                        100,

                                        Number(
                                            zone.progress ||
                                            0
                                        )
                                    )
                                );


                            return `
                                <button
                                    class="
                                        zone-network-item
                                        ${selected ? "selected" : ""}
                                    "
                                    type="button"
                                    data-zone-id="${HomeApp.escapeHtml(zone.id)}"
                                    style="
                                        --zone-color: ${zone.color};
                                        --zone-soft: ${zone.soft};
                                        --zone-border: ${zone.color}55;
                                    "
                                >

                                    <div class="zone-item-top">

                                        <span class="zone-symbol">
                                            ${HomeApp.escapeHtml(zone.icon || "HM")}
                                        </span>

                                        <span class="zone-code">
                                            ${HomeApp.escapeHtml(zone.code || "")}
                                        </span>

                                    </div>

                                    <h3>
                                        ${HomeApp.escapeHtml(zone.name)}
                                    </h3>

                                    <div class="zone-item-state">

                                        <span>
                                            ${HomeApp.escapeHtml(zone.status || "READY")}
                                        </span>

                                        <strong>
                                            ${progress}%
                                        </strong>

                                    </div>

                                    <div class="zone-item-track">

                                        <span
                                            style="width: ${progress}%;"
                                        ></span>

                                    </div>

                                </button>
                            `;

                        }
                    )
                    .join("");

        },


        /* ============================================================
           DAILY RHYTHM
        ============================================================ */

        resolveRhythmShift(
            state
        ) {

            const saved =
                state.dailyRhythm
                    ?.selectedShift;


            if (
                [
                    "opening",
                    "closing"
                ]
                    .includes(
                        saved
                    )
            ) {

                return saved;

            }


            return this.getRecommendedRhythm(
                state
            );

        },


        getShiftProgress(
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

        },


        getDailyOverallProgress(
            state
        ) {

            const rhythm =
                state.dailyRhythm ||
                {};


            return this.getShiftProgress(
                [

                    ...(
                        Array.isArray(
                            rhythm.opening
                        )
                            ? rhythm.opening
                            : []
                    ),

                    ...(
                        Array.isArray(
                            rhythm.closing
                        )
                            ? rhythm.closing
                            : []
                    )

                ]
            );

        },


        getRecommendedRhythm(
            state
        ) {

            const rhythm =
                state.dailyRhythm ||
                {};


            const opening =
                this.getShiftProgress(
                    rhythm.opening
                );


            const closing =
                this.getShiftProgress(
                    rhythm.closing
                );


            if (
                opening.percent ===
                    100 &&
                closing.percent <
                    100
            ) {

                return "closing";

            }


            if (
                closing.percent ===
                    100 &&
                opening.percent <
                    100
            ) {

                return "opening";

            }


            return (
                new Date()
                    .getHours() <
                15

                    ? "opening"

                    : "closing"
            );

        },


        renderRhythm(
            state
        ) {

            const rhythm =
                state.dailyRhythm ||
                {};


            const recommended =
                this.getRecommendedRhythm(
                    state
                );


            if (
                ![
                    "opening",
                    "closing"
                ]
                    .includes(
                        this.selectedRhythm
                    )
            ) {

                this.selectedRhythm =
                    recommended;

            }


            const opening =
                this.getShiftProgress(
                    rhythm.opening
                );


            const closing =
                this.getShiftProgress(
                    rhythm.closing
                );


            const overall =
                this.getDailyOverallProgress(
                    state
                );


            const selectedProgress =
                this.selectedRhythm ===
                    "opening"

                    ? opening

                    : closing;


            const selectedName =
                this.selectedRhythm ===
                    "opening"

                    ? "Opening Shift"

                    : "Closing Shift";


            const recommendedName =
                recommended ===
                    "opening"

                    ? "Opening Shift"

                    : "Closing Shift";


            this.setText(
                "rhythmTitle",

                overall.percent ===
                    100

                    ? "Today's Rhythm Complete"

                    : selectedName
            );


            this.setText(
                "rhythmScore",
                `${overall.percent}%`
            );


            let description;


            if (
                overall.percent ===
                100
            ) {

                description =
                    "Opening and Closing are finished. The house can settle until tomorrow.";

            }

            else if (
                this.selectedRhythm ===
                recommended
            ) {

                description =
                    `${recommendedName} makes the most sense right now. ` +
                    `${selectedProgress.remaining} task${selectedProgress.remaining === 1 ? "" : "s"} remain in this shift.`;

            }

            else {

                description =
                    `You are viewing ${selectedName}. ` +
                    `HomeOS currently recommends ${recommendedName}, ` +
                    `but your place is saved either way.`;

            }


            this.setText(
                "rhythmDescription",
                description
            );


            [
                {
                    id:
                        "opening",

                    progress:
                        opening
                },

                {
                    id:
                        "closing",

                    progress:
                        closing
                }
            ]
                .forEach(
                    shift => {

                        const button =
                            document.querySelector(
                                `[data-rhythm="${shift.id}"]`
                            );


                        if (
                            button
                        ) {

                            button.classList.toggle(
                                "is-active",
                                shift.id ===
                                    this.selectedRhythm
                            );


                            button.dataset.recommended =
                                String(
                                    shift.id ===
                                    recommended
                                );

                        }


                        this.setQueryText(
                            `[data-rhythm-count="${shift.id}"]`,
                            `${shift.progress.completed}/${shift.progress.total} complete`
                        );


                        this.setQueryText(
                            `[data-rhythm-percent="${shift.id}"]`,
                            `${shift.progress.percent}%`
                        );


                        const bar =
                            document.querySelector(
                                `[data-rhythm-bar="${shift.id}"]`
                            );


                        if (
                            bar
                        ) {

                            bar.style.width =
                                `${shift.progress.percent}%`;

                        }

                    }
                );


            const tasks =
                Array.isArray(
                    rhythm[
                        this.selectedRhythm
                    ]
                )
                    ? rhythm[
                        this.selectedRhythm
                    ]

                    : [];


            const preview = [

                ...tasks.filter(
                    task =>
                        !task.done
                ),

                ...tasks.filter(
                    task =>
                        task.done
                )

            ]
                .slice(
                    0,
                    4
                );


            const container =
                document.getElementById(
                    "rhythmTaskGrid"
                );


            if (
                container
            ) {

                if (
                    !preview.length
                ) {

                    container.innerHTML = `
                        <div class="empty-state">
                            <div>
                                <h3>
                                    No Daily Rhythm tasks found.
                                </h3>

                                <p>
                                    Open Daily Rhythm to finish
                                    setting up this shift.
                                </p>
                            </div>
                        </div>
                    `;

                }

                else {

                    container.innerHTML =
                        preview
                            .map(
                                task => {

                                    const safeId =
                                        HomeApp.escapeHtml(
                                            task.id
                                        );


                                    const title =
                                        HomeApp.escapeHtml(
                                            task.title
                                        );


                                    return `
                                        <div
                                            class="
                                                rhythm-task
                                                ${task.done ? "done" : ""}
                                            "
                                        >
                                            <input
                                                type="checkbox"
                                                id="dashboard-${safeId}"
                                                data-rhythm-task="${safeId}"
                                                data-rhythm-task-shift="${this.selectedRhythm}"
                                                ${task.done ? "checked" : ""}
                                            >

                                            <label
                                                for="dashboard-${safeId}"
                                            >
                                                ${title}
                                            </label>
                                        </div>
                                    `;

                                }
                            )
                            .join("");

                }

            }


            this.setText(
                "rhythmSummary",

                `${overall.completed} of ${overall.total} daily tasks complete · ` +
                `${selectedProgress.remaining} left in ${selectedName}`
            );


            const openButton =
                document.getElementById(
                    "openDailyRhythmButton"
                );


            if (
                openButton
            ) {

                openButton.dataset
                    .openShift =
                    this.selectedRhythm;

            }

        },


        /* ============================================================
           LAUNDRY
        ============================================================ */

        getLaundryScheduleName(
            item
        ) {

            return (
                item?.name ||
                item?.label ||
                item?.loadName ||
                item?.title ||
                "Scheduled Load"
            );

        },


        getLaundryLoadStatus(
            load
        ) {

            if (
                load?.status
            ) {

                return load.status;

            }


            return {

                wash:
                    "ACTIVE",

                dry:
                    "ACTIVE",

                fold:
                    "NEEDS YOU",

                "put-away":
                    "NEEDS YOU"

            }[
                load?.stage
            ] ||
            "ACTIVE";

        },


        renderLaundry(
            state
        ) {

            const laundry =
                state.laundry ||
                {};


            const loads =
                Array.isArray(
                    laundry.activeLoads
                )
                    ? laundry.activeLoads
                    : [];


            const schedule =
                Array.isArray(
                    laundry.weeklySchedule
                )
                    ? laundry.weeklySchedule
                    : [];


            const today =
                HomeStore.getLaundryToday();


            const weekKey =
                HomeStore.getLaundryWeekKey();


            const todaySchedule =
                schedule
                    .filter(
                        item =>

                            String(
                                item.day ||
                                ""
                            )
                                .toLowerCase() ===
                            today
                    );


            const unfinishedToday =
                todaySchedule
                    .filter(
                        item =>

                            !(
                                Array.isArray(
                                    item.completedWeeks
                                ) &&

                                item.completedWeeks
                                    .includes(
                                        weekKey
                                    )
                            )
                    );


            this.setText(
                "laundryActiveCount",
                `${String(loads.length).padStart(2, "0")} ACTIVE`
            );


            if (
                loads.length ===
                1
            ) {

                this.setText(
                    "laundryTitle",
                    "Laundry is moving"
                );


                this.setText(
                    "laundryDescription",

                    `${loads[0].name || "Laundry Load"} is currently at ` +
                    `${HomeApp.laundryStageLabel(loads[0].stage || "wash")}.`
                );

            }

            else if (
                loads.length >
                1
            ) {

                this.setText(
                    "laundryTitle",
                    "Laundry is moving"
                );


                this.setText(
                    "laundryDescription",
                    `${loads.length} loads are currently moving through Laundry Flow.`
                );

            }

            else if (
                unfinishedToday.length
            ) {

                const names =
                    unfinishedToday
                        .map(
                            item =>
                                this.getLaundryScheduleName(
                                    item
                                )
                        )
                        .join(
                            " + "
                        );


                this.setText(
                    "laundryTitle",
                    "Today's laundry is ready"
                );


                this.setText(
                    "laundryDescription",
                    `${names} ${unfinishedToday.length === 1 ? "is" : "are"} on today's schedule.`
                );

            }

            else if (
                todaySchedule.length
            ) {

                this.setText(
                    "laundryTitle",
                    "Today's laundry is complete"
                );


                this.setText(
                    "laundryDescription",
                    "Nothing is waiting in Laundry Flow right now."
                );

            }

            else {

                this.setText(
                    "laundryTitle",
                    "Laundry is clear"
                );


                this.setText(
                    "laundryDescription",
                    "No active loads and nothing else is scheduled for today."
                );

            }


            const container =
                document.getElementById(
                    "dashboardLoadList"
                );


            if (
                !container
            ) {

                return;

            }


            if (
                loads.length
            ) {

                container.innerHTML =
                    loads
                        .slice(
                            0,
                            3
                        )
                        .map(
                            load => `
                                <div class="dashboard-load-row">

                                    <span
                                        class="
                                            load-state-dot
                                            ${load.stage || "wash"}
                                        "
                                    ></span>

                                    <div class="dashboard-load-name">

                                        <strong>
                                            ${HomeApp.escapeHtml(load.name || "Laundry Load")}
                                        </strong>

                                        <span>
                                            ${HomeApp.laundryStageLabel(load.stage || "wash").toUpperCase()}
                                        </span>

                                    </div>

                                    <span class="dashboard-load-status">
                                        ${HomeApp.escapeHtml(this.getLaundryLoadStatus(load))}
                                    </span>

                                </div>
                            `
                        )
                        .join("");


                return;

            }


            if (
                unfinishedToday.length
            ) {

                container.innerHTML =
                    unfinishedToday
                        .slice(
                            0,
                            3
                        )
                        .map(
                            item => `
                                <div class="dashboard-load-row">

                                    <span class="load-state-dot wash"></span>

                                    <div class="dashboard-load-name">

                                        <strong>
                                            ${HomeApp.escapeHtml(this.getLaundryScheduleName(item))}
                                        </strong>

                                        <span>
                                            SCHEDULED TODAY
                                        </span>

                                    </div>

                                    <span class="dashboard-load-status">
                                        READY
                                    </span>

                                </div>
                            `
                        )
                        .join("");


                return;

            }


            container.innerHTML = `
                <div class="dashboard-load-row">

                    <span class="load-state-dot put-away"></span>

                    <div class="dashboard-load-name">

                        <strong>
                            Laundry Flow Clear
                        </strong>

                        <span>
                            NOTHING WAITING
                        </span>

                    </div>

                </div>
            `;

        },


        /* ============================================================
           INVENTORY
        ============================================================ */

        renderInventory(
            state
        ) {

            const score =
                HomeStore.getInventoryScore(
                    state
                );


            const items =
                Array.isArray(
                    state.inventory
                        ?.lowItems
                )
                    ? state.inventory
                        .lowItems

                    : [];


            this.setText(
                "inventoryScore",
                `${score}%`
            );


            this.setText(
                "inventoryTitle",

                items.length
                    ? "Restock signal"

                    : "Fully stocked"
            );


            this.setText(
                "inventoryDescription",

                items.length

                    ? `${items.length} household essential${items.length === 1 ? " is" : "s are"} below your preferred level.`

                    : "Your tracked inventory is currently at preferred levels."
            );


            const container =
                document.getElementById(
                    "dashboardInventoryList"
                );


            if (
                !container
            ) {

                return;

            }


            if (
                !items.length
            ) {

                container.innerHTML = `
                    <div class="dashboard-inventory-row">

                        <div class="dashboard-inventory-name">

                            <strong>
                                Home Inventory
                            </strong>

                            <span>
                                PREFERRED LEVELS MET
                            </span>

                        </div>

                        <span class="dashboard-inventory-needed">
                            ✓
                        </span>

                    </div>
                `;


                return;

            }


            container.innerHTML =
                items
                    .slice(
                        0,
                        4
                    )
                    .map(
                        item => {

                            const current =
                                Math.max(
                                    0,

                                    Number(
                                        item.current ||
                                        0
                                    )
                                );


                            const target =
                                Math.max(
                                    0,

                                    Number(
                                        item.target ||
                                        0
                                    )
                                );


                            const needed =
                                Math.max(
                                    0,
                                    target -
                                    current
                                );


                            return `
                                <div class="dashboard-inventory-row">

                                    <div class="dashboard-inventory-name">

                                        <strong>
                                            ${HomeApp.escapeHtml(item.name || "Inventory Item")}
                                        </strong>

                                        <span>
                                            ${current}/${target}
                                            ${HomeApp.escapeHtml(item.unit || "")}
                                        </span>

                                    </div>

                                    <span class="dashboard-inventory-needed">
                                        +${String(needed).padStart(2, "0")}
                                    </span>

                                </div>
                            `;

                        }
                    )
                    .join("");

        },


        /* ============================================================
           SEASONAL
        ============================================================ */

        renderSeasonal(
            state
        ) {

            /*
               Calendar season drives the Dashboard.

               Clicking another season opens that workspace.
               It never changes HomeOS' actual season.
            */

            const active =
                HomeStore.getCalendarSeason();


            const season =
                state.seasonal
                    ?.seasons
                    ?.[
                        active
                    ];


            if (
                !season
            ) {

                this.setText(
                    "seasonTitle",
                    "Seasonal Home Care"
                );


                this.setText(
                    "seasonScore",
                    "0%"
                );


                this.setText(
                    "seasonDescription",
                    "Seasonal Home Care is ready when you are."
                );


                return;

            }


            this.setText(
                "seasonTitle",
                season.name
            );


            this.setText(
                "seasonScore",
                `${Number(season.progress || 0)}%`
            );


            this.setText(
                "seasonDescription",
                season.description
            );


            document
                .querySelectorAll(
                    "[data-season]"
                )
                .forEach(
                    link => {

                        const isActive =
                            link.dataset
                                .season ===
                            active;


                        link.classList.toggle(
                            "active",
                            isActive
                        );


                        if (
                            isActive
                        ) {

                            link.setAttribute(
                                "aria-current",
                                "page"
                            );

                        }

                        else {

                            link.removeAttribute(
                                "aria-current"
                            );

                        }

                    }
                );

        },


        /* ============================================================
           DAILY NAVIGATION
        ============================================================ */

        openDailyRhythm(
            shift
        ) {

            const safeShift =
                [
                    "opening",
                    "closing"
                ]
                    .includes(
                        shift
                    )

                    ? shift

                    : "opening";


            HomeStore.setRhythmShift(
                safeShift
            );


            window.location.href =
                "daily.html";

        },


        /* ============================================================
           DASHBOARD EVENTS
        ============================================================ */

        bindEvents() {

            /*
               One click listener.

               Seasonal links do NOT need an event listener.
               They are real links now.
            */

            document.addEventListener(
                "click",
                event => {

                    /* -----------------------------------------
                       SELECT HOME ZONE
                    ----------------------------------------- */

                    const zone =
                        event.target.closest(
                            "[data-zone-id]"
                        );


                    if (
                        zone
                    ) {

                        this.selectedZoneId =
                            zone.dataset
                                .zoneId;


                        HomeStore.setSelectedZone(
                            this.selectedZoneId
                        );


                        return;

                    }


                    /* -----------------------------------------
                       SELECT OPENING / CLOSING
                    ----------------------------------------- */

                    const rhythm =
                        event.target.closest(
                            "[data-rhythm]"
                        );


                    if (
                        rhythm
                    ) {

                        const shift =
                            rhythm.dataset
                                .rhythm;


                        if (
                            ![
                                "opening",
                                "closing"
                            ]
                                .includes(
                                    shift
                                )
                        ) {

                            return;

                        }


                        this.selectedRhythm =
                            shift;


                        HomeStore.setRhythmShift(
                            shift
                        );


                        return;

                    }


                    /* -----------------------------------------
                       OPEN DAILY RHYTHM
                    ----------------------------------------- */

                    const openDaily =
                        event.target.closest(
                            "#openDailyRhythmButton"
                        );


                    if (
                        openDaily
                    ) {

                        this.openDailyRhythm(

                            openDaily.dataset
                                .openShift ||

                            this.selectedRhythm

                        );


                        return;

                    }


                    /* -----------------------------------------
                       START CLEANING
                    ----------------------------------------- */

                    if (
                        event.target.closest(
                            "#startCleaningButton"
                        ) ||

                        event.target.closest(
                            "#focusStartButton"
                        )
                    ) {

                        window.location.href =
                            `cleaning.html?zone=${encodeURIComponent(this.selectedZoneId)}`;


                        return;

                    }


                    /* -----------------------------------------
                       OPEN CLEANING / HOME MAP
                    ----------------------------------------- */

                    if (
                        event.target.closest(
                            "#selectZoneButton"
                        ) ||

                        event.target.closest(
                            "#chooseAnotherZoneButton"
                        ) ||

                        event.target.closest(
                            "#zoneNetworkSelect"
                        )
                    ) {

                        window.location.href =
                            "cleaning.html";

                    }

                }
            );


            /*
               Dashboard task checkboxes operate on the exact same
               Daily Rhythm arrays used by daily.html.
            */

            document.addEventListener(
                "change",
                event => {

                    const checkbox =
                        event.target.closest(
                            "[data-rhythm-task]"
                        );


                    if (
                        !checkbox
                    ) {

                        return;

                    }


                    const shift =
                        checkbox.dataset
                            .rhythmTaskShift ||

                        this.selectedRhythm;


                    HomeStore.toggleRhythmTask(

                        shift,

                        checkbox.dataset
                            .rhythmTask

                    );

                }
            );

        },


        /* ============================================================
           SMALL HELPERS
        ============================================================ */

        titleCase(
            value
        ) {

            const text =
                String(
                    value ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            return text

                ? text
                    .charAt(
                        0
                    )
                    .toUpperCase() +
                    text.slice(
                        1
                    )

                : "";

        },


        setText(
            id,
            value
        ) {

            const element =
                document.getElementById(
                    id
                );


            if (
                element
            ) {

                element.textContent =
                    value;

            }

        },


        setQueryText(
            selector,
            value
        ) {

            const element =
                document.querySelector(
                    selector
                );


            if (
                element
            ) {

                element.textContent =
                    value;

            }

        }

    };


    window.Dashboard =
        Dashboard;


    Dashboard.init();

});