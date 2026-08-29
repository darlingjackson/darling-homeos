/* ================================================================
   DARLING HOMEOS
   LAUNDRY FLOW CONTROLLER

   FILE:
   assets/js/laundry.js

   ONE FLOW.
   ONE HOME MEMORY.
   NO REFRESH REQUIRED.
================================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        "use strict";


        const LaundryApp = {

            DAYS: [

                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"

            ],


            STAGES: [

                "wash",
                "dry",
                "fold",
                "put-away"

            ],


            /*
             * Old Laundry builds auto-created a full Monday-Sunday
             * demonstration schedule. Those IDs are kept only so the
             * cleanup migration can remove that fake data from homes
             * that already saved it.
             */
            LEGACY_STARTER_SCHEDULE_IDS: [

                "schedule-mon-kids",
                "schedule-tue-towels",
                "schedule-wed-adults",
                "schedule-thu-bedding",
                "schedule-fri-kids",
                "schedule-sat-delicates",
                "schedule-sun-linens"

            ],


            /*
             * Older dashboard skeletons also shipped with two fake
             * active loads. They should never survive into real home
             * memory.
             */
            LEGACY_DEMO_LOAD_IDS: [

                "load-1",
                "load-2"

            ],



            STARTER_MAINTENANCE: [

                {
                    id:
                        "maint-machine-exterior",

                    name:
                        "Wipe Washer + Dryer",

                    frequencyDays:
                        7,

                    lastCompletedAt:
                        null
                },


                {
                    id:
                        "maint-room-floor",

                    name:
                        "Sweep + Mop Laundry Room",

                    frequencyDays:
                        7,

                    lastCompletedAt:
                        null
                },


                {
                    id:
                        "maint-gasket",

                    name:
                        "Clean Washer Gasket",

                    frequencyDays:
                        14,

                    lastCompletedAt:
                        null
                },


                {
                    id:
                        "maint-detergent-tray",

                    name:
                        "Clean Detergent Trays",

                    frequencyDays:
                        30,

                    lastCompletedAt:
                        null
                },


                {
                    id:
                        "maint-washer-cycle",

                    name:
                        "Run Washer Cleaning Cycle",

                    frequencyDays:
                        30,

                    lastCompletedAt:
                        null
                },


                {
                    id:
                        "maint-dryer-area",

                    name:
                        "Vacuum Dryer Lint Area",

                    frequencyDays:
                        30,

                    lastCompletedAt:
                        null
                },


                {
                    id:
                        "maint-dryer-vent",

                    name:
                        "Inspect Dryer Vent",

                    frequencyDays:
                        90,

                    lastCompletedAt:
                        null
                }

            ],



            selectedDay:
                null,

            lastDateKey:
                null,

            timer:
                null,



            /* ====================================================
               START
            ==================================================== */

            init() {

                this.ensureLaundrySetup();


                this.selectedDay =
                    this.getTodayDay();


                this.lastDateKey =
                    this.getLocalDateKey();


                this.bindEvents();

                this.bindStateEvents();

                this.render();

                this.startTimer();

            },



            /* ====================================================
               SAFE SETUP + LEGACY LAUNDRY MIGRATION

               HomeStore owns the schema.
               Laundry only cleans old Laundry-specific demo data and
               normalizes records it actually owns.

               IMPORTANT:
               An empty weekly schedule stays empty.
            ==================================================== */

            ensureLaundrySetup() {

                const state =
                    HomeStore.getState();


                const laundry =
                    state.laundry;


                let changed =
                    false;


                /* ------------------------------------------------
                   REMOVE OLD FAKE WEEKLY SCHEDULE
                ------------------------------------------------ */

                const cleanedSchedule =
                    laundry.weeklySchedule
                        .filter(
                            item =>
                                item &&
                                typeof item ===
                                    "object"
                        )
                        .filter(
                            item =>
                                !this.LEGACY_STARTER_SCHEDULE_IDS
                                    .includes(
                                        String(
                                            item.id ||
                                            ""
                                        )
                                    )
                        )
                        .map(
                            (
                                item,
                                index
                            ) => {

                                const day =
                                    String(
                                        item.day ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase();


                                const name =
                                    String(
                                        item.name ||
                                        ""
                                    )
                                        .trim();


                                if (
                                    !this.DAYS
                                        .includes(
                                            day
                                        ) ||
                                    !name
                                ) {

                                    return null;

                                }


                                const time =

                                    /^([01]\d|2[0-3]):[0-5]\d$/
                                        .test(
                                            String(
                                                item.time ||
                                                ""
                                            )
                                        )

                                        ? String(
                                            item.time
                                        )

                                        : "09:00";


                                const id =
                                    String(
                                        item.id ||
                                        `schedule-recovered-${Date.now()}-${index}`
                                    );


                                const completedWeeks =
                                    Array.from(
                                        new Set(

                                            (
                                                Array.isArray(
                                                    item.completedWeeks
                                                )

                                                    ? item.completedWeeks

                                                    : []
                                            )
                                                .map(
                                                    value =>
                                                        String(
                                                            value ||
                                                            ""
                                                        )
                                                )
                                                .filter(
                                                    Boolean
                                                )

                                        )
                                    );


                                return {

                                    ...item,

                                    id,

                                    day,

                                    time,

                                    name,

                                    completedWeeks

                                };

                            }
                        )
                        .filter(
                            Boolean
                        );


                if (
                    JSON.stringify(
                        cleanedSchedule
                    ) !==
                    JSON.stringify(
                        laundry.weeklySchedule
                    )
                ) {

                    laundry.weeklySchedule =
                        cleanedSchedule;


                    changed =
                        true;

                }


                /* ------------------------------------------------
                   CLEAN OLD DEMO LOADS + NORMALIZE ACTIVE FLOW
                ------------------------------------------------ */

                const cleanedLoads =
                    laundry.activeLoads
                        .filter(
                            load =>
                                load &&
                                typeof load ===
                                    "object"
                        )
                        .filter(
                            load =>
                                !this.LEGACY_DEMO_LOAD_IDS
                                    .includes(
                                        String(
                                            load.id ||
                                            ""
                                        )
                                    )
                        )
                        .map(
                            (
                                load,
                                index
                            ) => {

                                const stage =
                                    this.STAGES
                                        .includes(
                                            load.stage
                                        )

                                        ? load.stage

                                        : "wash";


                                const status =

                                    stage ===
                                        "fold" ||

                                    stage ===
                                        "put-away"

                                        ? "NEEDS YOU"

                                        : "ACTIVE";


                                return {

                                    ...load,

                                    id:
                                        String(
                                            load.id ||
                                            `load-recovered-${Date.now()}-${index}`
                                        ),

                                    name:
                                        String(
                                            load.name ||
                                            "Laundry Load"
                                        )
                                            .trim() ||
                                        "Laundry Load",

                                    scheduleId:
                                        load.scheduleId ||
                                        null,

                                    stage,

                                    status,

                                    stageHistory:

                                        load.stageHistory &&
                                        typeof load.stageHistory ===
                                            "object"

                                            ? load.stageHistory

                                            : {}

                                };

                            }
                        );


                if (
                    JSON.stringify(
                        cleanedLoads
                    ) !==
                    JSON.stringify(
                        laundry.activeLoads
                    )
                ) {

                    laundry.activeLoads =
                        cleanedLoads;


                    changed =
                        true;

                }


                /* ------------------------------------------------
                   MAINTENANCE DEFINITIONS

                   These are care definitions, not fake completed
                   activity. They start without a baseline date.
                ------------------------------------------------ */

                if (
                    !laundry.maintenance
                        .length
                ) {

                    laundry.maintenance =
                        JSON.parse(
                            JSON.stringify(
                                this.STARTER_MAINTENANCE
                            )
                        );


                    changed =
                        true;

                }


                /*
                 * setupComplete only means the Laundry controller has
                 * performed its one-time compatibility cleanup.
                 */

                if (
                    laundry.setupComplete !==
                    true
                ) {

                    laundry.setupComplete =
                        true;


                    changed =
                        true;

                }


                if (
                    changed
                ) {

                    HomeStore.saveState(
                        state
                    );

                }

            },



            /* ====================================================
               LIVE HOMEOS STATE
            ==================================================== */

            bindStateEvents() {

                window.addEventListener(
                    "homeos:statechange",
                    event => {

                        this.render(

                            event.detail ||
                            HomeStore.getState()

                        );

                    }
                );

            },



            /* ====================================================
               RENDER
            ==================================================== */

            render(
                providedState =
                    null
            ) {

                const state =
                    providedState ||
                    HomeStore.getState();


                this.renderDate();

                this.renderHealth(
                    state
                );

                this.renderGuide(
                    state
                );

                this.renderMetrics(
                    state
                );

                this.renderActiveLoads(
                    state
                );

                this.renderDayTabs(
                    state
                );

                this.renderSchedule(
                    state
                );

                this.renderMaintenance(
                    state
                );

                this.renderHistory(
                    state
                );

            },



            /* ====================================================
               DATE
            ==================================================== */

            renderDate() {

                const now =
                    new Date();


                this.setText(

                    "laundryDateTime",

                    `${HomeApp.formatDate(now)} · ${HomeApp.formatTime(now)}`

                );

            },



            checkForNewDay() {

                const currentDateKey =
                    this.getLocalDateKey();


                if (
                    this.lastDateKey &&
                    currentDateKey !==
                        this.lastDateKey
                ) {

                    this.lastDateKey =
                        currentDateKey;


                    this.selectedDay =
                        this.getTodayDay();


                    this.render();


                    HomeApp.toast(

                        `It is now ${this.titleCase(this.selectedDay)}. Laundry Flow moved to today's schedule.`

                    );


                    return;

                }


                this.lastDateKey =
                    currentDateKey;

            },



            /* ====================================================
               HEALTH
            ==================================================== */

            renderHealth(
                state
            ) {

                const health =
                    HomeStore.getLaundryScore(
                        state
                    );


                const status =
                    HomeApp.getHomeStatus(
                        health
                    );


                const weekly =
                    this.getWeeklyCompletion(
                        state
                    );


                const hasSchedule =
                    state.laundry
                        .weeklySchedule
                        .length >
                    0;


                const due =
                    this.getMaintenanceAttention(
                        state
                    );


                this.setText(
                    "laundryHealthValue",
                    `${health}%`
                );


                this.setText(
                    "laundryHealthStatus",
                    status
                );


                this.setText(

                    "heroActiveLoads",

                    state.laundry
                        .activeLoads
                        .length

                );


                this.setText(

                    "heroWeekProgress",

                    hasSchedule

                        ? `${weekly}%`

                        : "—"

                );


                this.setText(

                    "heroMaintenanceStatus",

                    due.length

                        ? "Attention"

                        : "Current"

                );


                const ring =
                    document.getElementById(
                        "laundryHealthRing"
                    );


                if (
                    ring
                ) {

                    ring.style
                        .setProperty(

                            "--laundry-health",

                            `${Math.round(
                                health *
                                3.6
                            )}deg`

                        );

                }

            },



            /* ====================================================
               LAUNDRY GUIDE
            ==================================================== */

            renderGuide(
                state
            ) {

                const button =
                    document.getElementById(
                        "laundryGuideAction"
                    );


                const active =
                    state.laundry
                        .activeLoads ||
                    [];


                const waiting =
                    active
                        .find(
                            load =>

                                load.stage ===
                                    "fold" ||

                                load.stage ===
                                    "put-away"
                        );


                const today =
                    this.getTodayDay();


                const scheduled =
                    state.laundry
                        .weeklySchedule
                        .filter(
                            item =>
                                item.day ===
                                today
                        )
                        .find(
                            item =>

                                !this.isCompletedThisWeek(
                                    item
                                ) &&

                                !active.some(
                                    load =>
                                        load.scheduleId ===
                                        item.id
                                )
                        );


                const maintenance =
                    this.getMaintenanceAttention(
                        state
                    )[
                        0
                    ] ||
                    null;



                if (
                    waiting
                ) {

                    this.setText(
                        "laundryGuideStatus",
                        "NEEDS YOU"
                    );


                    this.setText(

                        "laundryGuideMessage",

                        `${waiting.name} is waiting at ${HomeApp.laundryStageLabel(waiting.stage)}. HomeOS recommends finishing this load before starting another.`

                    );


                    this.configureGuideButton(

                        button,

                        "jump",

                        "CONTINUE ACTIVE LOAD →",

                        waiting.id

                    );


                    return;

                }



                if (
                    active.length
                ) {

                    const first =
                        active[
                            0
                        ];


                    this.setText(
                        "laundryGuideStatus",
                        "FLOW ACTIVE"
                    );


                    this.setText(

                        "laundryGuideMessage",

                        `${active.length} load${active.length === 1 ? " is" : "s are"} moving. ${first.name} is currently in ${HomeApp.laundryStageLabel(first.stage)}.`

                    );


                    this.configureGuideButton(

                        button,

                        "jump",

                        "VIEW ACTIVE FLOW →",

                        first.id

                    );


                    return;

                }



                if (
                    scheduled
                ) {

                    this.setText(
                        "laundryGuideStatus",
                        "TODAY'S RHYTHM"
                    );


                    this.setText(

                        "laundryGuideMessage",

                        `${scheduled.name} is scheduled for today at ${this.formatScheduleTime(scheduled.time)}. Laundry Flow is clear and ready.`

                    );


                    this.configureGuideButton(

                        button,

                        "scheduled",

                        `START ${scheduled.name.toUpperCase()} →`,

                        scheduled.id

                    );


                    return;

                }



                if (
                    maintenance
                ) {

                    this.setText(
                        "laundryGuideStatus",
                        "ROOM CARE"
                    );


                    this.setText(

                        "laundryGuideMessage",

                        `${maintenance.name} needs attention. Your active Laundry Flow is otherwise clear.`

                    );


                    this.configureGuideButton(

                        button,

                        "maintenance",

                        "OPEN ROOM CARE →",

                        maintenance.id

                    );


                    return;

                }



                this.setText(
                    "laundryGuideStatus",
                    "SYSTEM CLEAR"
                );


                this.setText(

                    "laundryGuideMessage",

                    "Laundry Flow is clear. Start a load whenever something needs washing, or review the weekly rhythm below."

                );


                this.configureGuideButton(

                    button,

                    "quick",

                    "START A LOAD →",

                    ""

                );

            },



            configureGuideButton(
                button,
                action,
                label,
                id
            ) {

                if (
                    !button
                ) {

                    return;

                }


                button.textContent =
                    label;


                button.dataset
                    .laundryGuideAction =
                    action;


                button.dataset
                    .targetId =
                    id ||
                    "";

            },



            /* ====================================================
               METRICS
            ==================================================== */

            renderMetrics(
                state
            ) {

                const active =
                    state.laundry
                        .activeLoads;


                const schedule =
                    state.laundry
                        .weeklySchedule;


                const today =
                    this.getTodayDay();


                const todaysSchedule =
                    schedule
                        .filter(
                            item =>
                                item.day ===
                                today
                        );


                const completedToday =
                    todaysSchedule
                        .filter(
                            item =>
                                this.isCompletedThisWeek(
                                    item
                                )
                        )
                        .length;


                const weekProgress =
                    this.getWeeklyCompletion(
                        state
                    );


                const completedWeek =
                    schedule
                        .filter(
                            item =>
                                this.isCompletedThisWeek(
                                    item
                                )
                        )
                        .length;


                const maintenance =
                    this.getMaintenanceAttention(
                        state
                    );


                this.setText(
                    "activeLoadsMetric",
                    active.length
                );


                this.setText(

                    "activeLoadsMetricDetail",

                    active.length

                        ? `${active.length} load${active.length === 1 ? " is" : "s are"} currently moving.`

                        : "Laundry Flow is clear."

                );


                this.setText(
                    "todayLoadsMetric",
                    todaysSchedule.length
                );


                this.setText(

                    "todayLoadsMetricDetail",

                    todaysSchedule.length

                        ? `${completedToday} of ${todaysSchedule.length} complete for today's rhythm.`

                        : "Nothing recurring is scheduled today."

                );


                this.setText(

                    "weekProgressMetric",

                    schedule.length

                        ? `${weekProgress}%`

                        : "—"

                );


                this.setText(

                    "weekProgressMetricDetail",

                    schedule.length

                        ? `${completedWeek} of ${schedule.length} recurring loads are complete this week.`

                        : "No recurring loads are scheduled yet."

                );


                this.setText(
                    "maintenanceMetric",
                    maintenance.length
                );


                this.setText(

                    "maintenanceMetricDetail",

                    maintenance.length

                        ? `${maintenance.length} task${maintenance.length === 1 ? " needs" : "s need"} attention.`

                        : "Laundry-room maintenance is current."

                );

            },



            /* ====================================================
               ACTIVE LOADS
            ==================================================== */

            renderActiveLoads(
                state
            ) {

                const container =
                    document.getElementById(
                        "activeLoadsGrid"
                    );


                if (
                    !container
                ) {

                    return;

                }


                const loads =
                    state.laundry
                        .activeLoads;


                if (
                    !loads.length
                ) {

                    container.innerHTML = `

                        <div class="empty-state laundry-empty-flow">

                            <div class="empty-state-icon">
                                ◌
                            </div>

                            <div>

                                <h3>
                                    Laundry Flow is clear.
                                </h3>

                                <p>
                                    Start today's scheduled laundry or add
                                    a load whenever something unexpected
                                    needs washing.
                                </p>

                            </div>

                        </div>

                    `;


                    return;

                }


                container.innerHTML =
                    loads
                        .map(
                            load => {

                                const rawStageIndex =
                                    this.STAGES
                                        .indexOf(
                                            load.stage
                                        );


                                const stageIndex =

                                    rawStageIndex >=
                                    0

                                        ? rawStageIndex

                                        : 0;


                                const currentStage =
                                    this.STAGES[
                                        stageIndex
                                    ];


                                const nextStage =
                                    this.STAGES[
                                        stageIndex +
                                        1
                                    ];


                                const stageMarkup =
                                    this.STAGES
                                        .map(
                                            (
                                                stage,
                                                index
                                            ) => {

                                                let className =
                                                    "";


                                                if (
                                                    index <
                                                    stageIndex
                                                ) {

                                                    className =
                                                        "passed";

                                                }


                                                if (
                                                    index ===
                                                    stageIndex
                                                ) {

                                                    className =
                                                        `current ${stage}`;

                                                }


                                                return `

                                                    <div
                                                        class="
                                                            load-stage
                                                            ${className}
                                                        "
                                                    >

                                                        <span>
                                                            ${String(index + 1).padStart(2, "0")}
                                                        </span>

                                                        <strong>
                                                            ${HomeApp.laundryStageLabel(stage)}
                                                        </strong>

                                                    </div>

                                                `;

                                            }
                                        )
                                        .join("");


                                const actionButton =

                                    nextStage

                                        ? `

                                            <button
                                                class="button button-primary"
                                                type="button"
                                                data-next-stage="${load.id}"
                                            >
                                                Move To
                                                ${HomeApp.laundryStageLabel(nextStage)}
                                                →
                                            </button>

                                        `

                                        : `

                                            <button
                                                class="button button-primary"
                                                type="button"
                                                data-complete-load="${load.id}"
                                            >
                                                Finish + Put Away ✓
                                            </button>

                                        `;


                                const status =

                                    load.stage ===
                                        "fold" ||

                                    load.stage ===
                                        "put-away"

                                        ? "NEEDS YOU"

                                        : "MOVING";


                                return `

                                    <article
                                        class="active-load-card"
                                        id="active-load-${load.id}"
                                    >

                                        <div class="active-load-heading">

                                            <div>

                                                <span class="ui-kicker">
                                                    ACTIVE LOAD // ${status}
                                                </span>

                                                <h3>
                                                    ${HomeApp.escapeHtml(load.name)}
                                                </h3>

                                                <p>
                                                    Started
                                                    ${this.formatDateTime(load.startedAt)}
                                                </p>

                                            </div>


                                            <div class="load-elapsed">

                                                <span>
                                                    Elapsed
                                                </span>

                                                <strong
                                                    data-load-timer="${load.id}"
                                                >
                                                    ${this.formatElapsed(load.startedAt)}
                                                </strong>

                                            </div>

                                        </div>


                                        <div class="load-stage-track">
                                            ${stageMarkup}
                                        </div>


                                        <div class="active-load-footer">

                                            <div class="current-stage-copy">

                                                <span>
                                                    Current Stage
                                                </span>

                                                <strong>
                                                    ${HomeApp.laundryStageLabel(currentStage)}
                                                </strong>

                                            </div>


                                            <div class="load-action-group">

                                                ${actionButton}


                                                <button
                                                    class="remove-load-button"
                                                    type="button"
                                                    title="Remove load"
                                                    data-remove-load="${load.id}"
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("");


                this.updateTimers();

            },



            /* ====================================================
               START LOAD
            ==================================================== */

            startLoad(
                name,
                scheduleId =
                    null
            ) {

                const cleanName =
                    String(
                        name ||
                        ""
                    )
                        .trim();


                if (
                    !cleanName
                ) {

                    return;

                }


                const now =
                    new Date()
                        .toISOString();


                HomeStore.update(
                    state => {

                        state.laundry
                            .activeLoads
                            .push({

                                id:
                                    `load-${Date.now()}`,

                                name:
                                    cleanName,

                                scheduleId,

                                stage:
                                    "wash",

                                status:
                                    "ACTIVE",

                                startedAt:
                                    now,

                                stageUpdatedAt:
                                    now,

                                stageHistory: {

                                    wash:
                                        now

                                }

                            });

                    }
                );


                HomeApp.toast(

                    `${cleanName} started in Wash.`

                );

            },



            /* ====================================================
               MOVE TO NEXT STAGE
            ==================================================== */

            moveToNextStage(
                loadId
            ) {

                let name =
                    "";

                let nextLabel =
                    "";


                HomeStore.update(
                    state => {

                        const load =
                            state.laundry
                                .activeLoads
                                .find(
                                    item =>
                                        item.id ===
                                        loadId
                                );


                        if (
                            !load
                        ) {

                            return;

                        }


                        const currentIndex =
                            this.STAGES
                                .indexOf(
                                    load.stage
                                );


                        const next =
                            this.STAGES[
                                currentIndex +
                                1
                            ];


                        if (
                            !next
                        ) {

                            return;

                        }


                        const now =
                            new Date()
                                .toISOString();


                        load.stage =
                            next;


                        load.stageUpdatedAt =
                            now;


                        load.status =

                            next ===
                                "fold" ||

                            next ===
                                "put-away"

                                ? "NEEDS YOU"

                                : "ACTIVE";


                        load.stageHistory =
                            load.stageHistory ||
                            {};


                        load.stageHistory[
                            next
                        ] =
                            now;


                        name =
                            load.name;


                        nextLabel =
                            HomeApp
                                .laundryStageLabel(
                                    next
                                );

                    }
                );


                if (
                    name
                ) {

                    HomeApp.toast(

                        `${name} moved to ${nextLabel}.`

                    );

                }

            },



            /* ====================================================
               COMPLETE LOAD
            ==================================================== */

            completeLoad(
                loadId
            ) {

                let completedName =
                    "";


                HomeStore.update(
                    state => {

                        const index =
                            state.laundry
                                .activeLoads
                                .findIndex(
                                    load =>
                                        load.id ===
                                        loadId
                                );


                        if (
                            index ===
                            -1
                        ) {

                            return;

                        }


                        const load =
                            state.laundry
                                .activeLoads[
                                    index
                                ];


                        if (
                            load.stage !==
                            "put-away"
                        ) {

                            return;

                        }


                        const completedAt =
                            new Date()
                                .toISOString();


                        load.completedAt =
                            completedAt;


                        const startedTime =
                            new Date(
                                load.startedAt
                            )
                                .getTime();


                        load.durationMs =

                            Number.isFinite(
                                startedTime
                            )

                                ? new Date(
                                    completedAt
                                )
                                    .getTime() -
                                  startedTime

                                : null;



                        if (
                            load.scheduleId
                        ) {

                            const scheduled =
                                state.laundry
                                    .weeklySchedule
                                    .find(
                                        item =>
                                            item.id ===
                                            load.scheduleId
                                    );


                            if (
                                scheduled
                            ) {

                                scheduled.completedWeeks =

                                    Array.isArray(
                                        scheduled.completedWeeks
                                    )

                                        ? scheduled.completedWeeks

                                        : [];


                                const weekKey =
                                    this.getWeekKey();


                                if (
                                    !scheduled
                                        .completedWeeks
                                        .includes(
                                            weekKey
                                        )
                                ) {

                                    scheduled
                                        .completedWeeks
                                        .push(
                                            weekKey
                                        );

                                }

                            }

                        }



                        state.laundry
                            .history
                            .unshift({

                                ...load

                            });


                        state.laundry.history =
                            state.laundry
                                .history
                                .slice(
                                    0,
                                    100
                                );


                        state.laundry
                            .activeLoads
                            .splice(
                                index,
                                1
                            );


                        state.activity =
                            Array.isArray(
                                state.activity
                            )

                                ? state.activity

                                : [];


                        state.activity
                            .unshift({

                                id:
                                    `activity-${Date.now()}`,

                                type:
                                    "laundry",

                                title:
                                    `${load.name} put away`,

                                description:
                                    "Laundry Flow completed from Wash through Put Away.",

                                createdAt:
                                    completedAt

                            });


                        completedName =
                            load.name;

                    }
                );


                if (
                    completedName
                ) {

                    HomeApp.toast(

                        `${completedName} is fully put away.`

                    );

                }

            },



            /* ====================================================
               REMOVE ACTIVE LOAD
            ==================================================== */

            removeLoad(
                loadId
            ) {

                const state =
                    HomeStore.getState();


                const load =
                    state.laundry
                        .activeLoads
                        .find(
                            item =>
                                item.id ===
                                loadId
                        );


                if (
                    !load
                ) {

                    return;

                }


                if (
                    !window.confirm(

                        `Remove ${load.name} from Active Laundry?`

                    )
                ) {

                    return;

                }


                HomeStore.update(
                    store => {

                        store.laundry.activeLoads =
                            store.laundry
                                .activeLoads
                                .filter(
                                    item =>
                                        item.id !==
                                        loadId
                                );

                    }
                );


                HomeApp.toast(

                    `${load.name} removed from Active Laundry.`

                );

            },



            /* ====================================================
               DAY TABS
            ==================================================== */

            renderDayTabs(
                state
            ) {

                const container =
                    document.getElementById(
                        "laundryDayTabs"
                    );


                if (
                    !container
                ) {

                    return;

                }


                const today =
                    this.getTodayDay();


                if (
                    !this.DAYS
                        .includes(
                            this.selectedDay
                        )
                ) {

                    this.selectedDay =
                        today;

                }


                container.innerHTML =
                    this.DAYS
                        .map(
                            (
                                day,
                                index
                            ) => {

                                const schedule =
                                    state.laundry
                                        .weeklySchedule
                                        .filter(
                                            item =>
                                                item.day ===
                                                day
                                        );


                                const complete =
                                    schedule
                                        .filter(
                                            item =>
                                                this.isCompletedThisWeek(
                                                    item
                                                )
                                        )
                                        .length;


                                return `

                                    <button
                                        class="
                                            laundry-day-tab
                                            ${day === today ? "today" : ""}
                                            ${day === this.selectedDay ? "active" : ""}
                                        "
                                        type="button"
                                        data-laundry-day="${day}"
                                    >

                                        <span>
                                            ${String(index + 1).padStart(2, "0")}
                                        </span>

                                        <strong>
                                            ${this.titleCase(day)}
                                        </strong>

                                        <small>
                                            ${schedule.length ? complete + "/" + schedule.length : "—"}
                                        </small>

                                    </button>

                                `;

                            }
                        )
                        .join("");

            },



            /* ====================================================
               WEEKLY SCHEDULE
            ==================================================== */

            renderSchedule(
                state
            ) {

                this.setText(

                    "selectedDayTitle",

                    this.titleCase(
                        this.selectedDay
                    )

                );


                const schedule =
                    state.laundry
                        .weeklySchedule
                        .filter(
                            item =>
                                item.day ===
                                this.selectedDay
                        )
                        .sort(
                            (
                                first,
                                second
                            ) =>

                                String(
                                    first.time ||
                                    ""
                                )
                                    .localeCompare(

                                        String(
                                            second.time ||
                                            ""
                                        )

                                    )
                        );


                this.setText(

                    "selectedDayCount",

                    `${schedule.length} LOAD${schedule.length === 1 ? "" : "S"}`

                );


                const container =
                    document.getElementById(
                        "weeklyScheduleList"
                    );


                if (
                    !container
                ) {

                    return;

                }


                if (
                    !schedule.length
                ) {

                    container.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                +
                            </div>

                            <div>

                                <h3>
                                    Nothing recurring on
                                    ${this.titleCase(this.selectedDay)}.
                                </h3>

                                <p>
                                    Add a recurring load if you want one
                                    to come back here every week.
                                </p>

                            </div>

                        </div>

                    `;


                    return;

                }


                container.innerHTML =
                    schedule
                        .map(
                            item => {

                                const complete =
                                    this.isCompletedThisWeek(
                                        item
                                    );


                                const active =
                                    state.laundry
                                        .activeLoads
                                        .find(
                                            load =>
                                                load.scheduleId ===
                                                item.id
                                        );


                                let stateLabel =
                                    "READY";


                                let stateClass =
                                    "";


                                let primaryAction =
                                    "";


                                if (
                                    complete
                                ) {

                                    stateLabel =
                                        "COMPLETE";


                                    stateClass =
                                        "success";


                                    primaryAction = `

                                        <span class="status-pill success">
                                            ✓ Complete
                                        </span>

                                    `;

                                }


                                else if (
                                    active
                                ) {

                                    stateLabel =
                                        HomeApp
                                            .laundryStageLabel(
                                                active.stage
                                            )
                                            .toUpperCase();


                                    primaryAction = `

                                        <button
                                            class="button button-secondary"
                                            type="button"
                                            data-jump-load="${active.id}"
                                        >
                                            View Active Load
                                        </button>

                                    `;

                                }


                                else {

                                    primaryAction = `

                                        <button
                                            class="button button-primary"
                                            type="button"
                                            data-start-scheduled="${item.id}"
                                        >
                                            Start Load
                                        </button>

                                    `;

                                }


                                return `

                                    <article
                                        class="
                                            schedule-row
                                            ${complete ? "complete" : ""}
                                        "
                                    >

                                        <div class="schedule-time">
                                            ${this.formatScheduleTime(item.time)}
                                        </div>


                                        <div class="schedule-main">

                                            <h4>
                                                ${HomeApp.escapeHtml(item.name)}
                                            </h4>

                                            <p>
                                                Recurs every
                                                ${this.titleCase(item.day)}
                                            </p>

                                        </div>


                                        <span
                                            class="
                                                status-pill
                                                ${stateClass}
                                            "
                                        >
                                            ${stateLabel}
                                        </span>


                                        <div class="schedule-actions">

                                            ${primaryAction}


                                            <button
                                                class="schedule-icon-button"
                                                type="button"
                                                data-edit-schedule="${item.id}"
                                                title="Edit recurring load"
                                            >
                                                ✎
                                            </button>


                                            <button
                                                class="schedule-icon-button"
                                                type="button"
                                                data-delete-schedule="${item.id}"
                                                title="Delete recurring load"
                                            >
                                                ×
                                            </button>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("");

            },



            /* ====================================================
               START SCHEDULED LOAD
            ==================================================== */

            startScheduledLoad(
                scheduleId
            ) {

                const state =
                    HomeStore.getState();


                const item =
                    state.laundry
                        .weeklySchedule
                        .find(
                            entry =>
                                entry.id ===
                                scheduleId
                        );


                if (
                    !item
                ) {

                    return;

                }


                if (
                    this.isCompletedThisWeek(
                        item
                    )
                ) {

                    HomeApp.toast(

                        `${item.name} is already complete this week.`

                    );


                    return;

                }


                const active =
                    state.laundry
                        .activeLoads
                        .find(
                            load =>
                                load.scheduleId ===
                                scheduleId
                        );


                if (
                    active
                ) {

                    document
                        .getElementById(
                            `active-load-${active.id}`
                        )
                        ?.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "center"

                        });


                    return;

                }


                this.startLoad(
                    item.name,
                    item.id
                );

            },



            /* ====================================================
               SAVE SCHEDULE
            ==================================================== */

            saveSchedule() {

                const id =
                    document
                        .getElementById(
                            "scheduleIdInput"
                        )
                        ?.value ||
                    "";


                const name =
                    document
                        .getElementById(
                            "scheduleNameInput"
                        )
                        ?.value
                        .trim() ||
                    "";


                const day =
                    document
                        .getElementById(
                            "scheduleDayInput"
                        )
                        ?.value ||
                    this.getTodayDay();


                const time =
                    document
                        .getElementById(
                            "scheduleTimeInput"
                        )
                        ?.value ||
                    "09:00";


                if (
                    !name ||
                    !this.DAYS
                        .includes(
                            day
                        )
                ) {

                    return;

                }


                /*
                   Change the visible day BEFORE HomeStore broadcasts.
                   This keeps the screen on the day we just edited.
                */

                this.selectedDay =
                    day;


                HomeStore.update(
                    state => {

                        if (
                            id
                        ) {

                            const item =
                                state.laundry
                                    .weeklySchedule
                                    .find(
                                        entry =>
                                            entry.id ===
                                            id
                                    );


                            if (
                                !item
                            ) {

                                return;

                            }


                            item.name =
                                name;


                            item.day =
                                day;


                            item.time =
                                time;

                        }


                        else {

                            state.laundry
                                .weeklySchedule
                                .push({

                                    id:
                                        `schedule-${Date.now()}`,

                                    day,

                                    time,

                                    name,

                                    completedWeeks:
                                        []

                                });

                        }

                    }
                );


                HomeApp.toast(

                    id

                        ? "Recurring load updated."

                        : `${name} added to the weekly laundry rhythm.`

                );

            },



            /* ====================================================
               OPEN SCHEDULE DIALOG
            ==================================================== */

            openScheduleDialog(
                scheduleId =
                    null
            ) {

                const state =
                    HomeStore.getState();


                const item =

                    scheduleId

                        ? state.laundry
                            .weeklySchedule
                            .find(
                                entry =>
                                    entry.id ===
                                    scheduleId
                            )

                        : null;


                const idInput =
                    document.getElementById(
                        "scheduleIdInput"
                    );


                const nameInput =
                    document.getElementById(
                        "scheduleNameInput"
                    );


                const dayInput =
                    document.getElementById(
                        "scheduleDayInput"
                    );


                const timeInput =
                    document.getElementById(
                        "scheduleTimeInput"
                    );


                if (
                    idInput
                ) {

                    idInput.value =
                        item?.id ||
                        "";

                }


                if (
                    nameInput
                ) {

                    nameInput.value =
                        item?.name ||
                        "";

                }


                if (
                    dayInput
                ) {

                    dayInput.value =

                        item?.day ||

                        this.selectedDay ||

                        this.getTodayDay();

                }


                if (
                    timeInput
                ) {

                    timeInput.value =
                        item?.time ||
                        "09:00";

                }


                this.setText(

                    "scheduleDialogTitle",

                    item

                        ? "Edit recurring load"

                        : "Add recurring load"

                );


                document
                    .getElementById(
                        "scheduleDialog"
                    )
                    ?.showModal();


                requestAnimationFrame(
                    () => {

                        nameInput
                            ?.focus();

                    }
                );

            },



            /* ====================================================
               DELETE SCHEDULE
            ==================================================== */

            deleteSchedule(
                scheduleId
            ) {

                const state =
                    HomeStore.getState();


                const item =
                    state.laundry
                        .weeklySchedule
                        .find(
                            entry =>
                                entry.id ===
                                scheduleId
                        );


                if (
                    !item
                ) {

                    return;

                }


                if (
                    !window.confirm(

                        `Delete ${item.name} from the weekly schedule?`

                    )
                ) {

                    return;

                }


                HomeStore.update(
                    store => {

                        store.laundry
                            .weeklySchedule =
                            store.laundry
                                .weeklySchedule
                                .filter(
                                    entry =>
                                        entry.id !==
                                        scheduleId
                                );

                    }
                );


                HomeApp.toast(

                    `${item.name} removed from the weekly schedule.`

                );

            },



            /* ====================================================
               MAINTENANCE
            ==================================================== */

            renderMaintenance(
                state
            ) {

                const container =
                    document.getElementById(
                        "maintenanceGrid"
                    );


                if (
                    !container
                ) {

                    return;

                }


                const tasks =
                    [
                        ...state.laundry
                            .maintenance
                    ]
                        .sort(
                            (
                                first,
                                second
                            ) =>

                                this.getMaintenanceSortValue(
                                    second
                                ) -

                                this.getMaintenanceSortValue(
                                    first
                                )
                        );


                if (
                    !tasks.length
                ) {

                    container.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                +
                            </div>

                            <div>

                                <h3>
                                    No laundry-room maintenance is tracked.
                                </h3>

                                <p>
                                    Add recurring care for the washer,
                                    dryer or laundry room.
                                </p>

                            </div>

                        </div>

                    `;


                    return;

                }


                container.innerHTML =
                    tasks
                        .map(
                            task => {

                                const status =
                                    this.getMaintenanceStatus(
                                        task
                                    );


                                const actionLabel =

                                    status.isBaseline

                                        ? "Complete + Start Tracking"

                                        : "Mark Complete";


                                return `

                                    <article
                                        class="
                                            maintenance-card
                                            ${status.className}
                                        "
                                    >

                                        <div class="maintenance-card-top">

                                            <span class="maintenance-symbol">
                                                ${status.symbol}
                                            </span>

                                            <span
                                                class="
                                                    status-pill
                                                    ${status.pillClass}
                                                "
                                            >
                                                ${status.label}
                                            </span>

                                        </div>


                                        <h3>
                                            ${HomeApp.escapeHtml(task.name)}
                                        </h3>


                                        <div class="maintenance-care-status">

                                            <span class="maintenance-frequency">
                                                ${this.formatFrequency(task.frequencyDays)}
                                            </span>


                                            <strong class="maintenance-countdown">
                                                ${status.countdown}
                                            </strong>


                                            <span class="maintenance-next-date">
                                                ${status.detail}
                                            </span>

                                        </div>


                                        <div
                                            class="maintenance-cycle-track"
                                            aria-hidden="true"
                                        >

                                            <span
                                                style="
                                                    --maintenance-progress:
                                                    ${status.progressPercent}%;
                                                "
                                            ></span>

                                        </div>


                                        <p class="maintenance-last-done">
                                            ${this.formatMaintenanceLastDone(task.lastCompletedAt)}
                                        </p>


                                        <div class="maintenance-card-footer">

                                            <button
                                                class="button button-secondary"
                                                type="button"
                                                data-complete-maintenance="${task.id}"
                                            >
                                                ${actionLabel}
                                            </button>


                                            <button
                                                class="remove-load-button"
                                                type="button"
                                                title="Delete maintenance task"
                                                data-delete-maintenance="${task.id}"
                                            >
                                                ×
                                            </button>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("");

            },


            saveMaintenance() {

                const name =
                    document
                        .getElementById(
                            "maintenanceNameInput"
                        )
                        ?.value
                        .trim() ||
                    "";


                const frequency =
                    Number(

                        document
                            .getElementById(
                                "maintenanceFrequencyInput"
                            )
                            ?.value ||

                        30

                    );


                if (
                    !name
                ) {

                    return;

                }


                HomeStore.update(
                    state => {

                        state.laundry
                            .maintenance
                            .push({

                                id:
                                    `maintenance-${Date.now()}`,

                                name,

                                frequencyDays:
                                    frequency,

                                lastCompletedAt:
                                    null

                            });

                    }
                );


                HomeApp.toast(

                    `${name} added to Laundry Room Maintenance.`

                );

            },



            completeMaintenance(
                taskId
            ) {

                let taskName =
                    "";

                let nextCareMessage =
                    "";


                HomeStore.update(
                    state => {

                        const task =
                            state.laundry
                                .maintenance
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


                        task.lastCompletedAt =
                            new Date()
                                .toISOString();


                        taskName =
                            task.name;


                        const status =
                            this.getMaintenanceStatus(
                                task
                            );


                        nextCareMessage =
                            status.countdown;

                    }
                );


                if (
                    taskName
                ) {

                    HomeApp.toast(

                        `${taskName} completed. ${nextCareMessage}.`

                    );

                }

            },


            deleteMaintenance(
                taskId
            ) {

                const state =
                    HomeStore.getState();


                const task =
                    state.laundry
                        .maintenance
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


                if (
                    !window.confirm(

                        `Delete ${task.name}?`

                    )
                ) {

                    return;

                }


                HomeStore.update(
                    store => {

                        store.laundry
                            .maintenance =
                            store.laundry
                                .maintenance
                                .filter(
                                    item =>
                                        item.id !==
                                        taskId
                                );

                    }
                );


                HomeApp.toast(
                    "Maintenance task removed."
                );

            },



            /* ====================================================
               HISTORY
            ==================================================== */

            renderHistory(
                state
            ) {

                const container =
                    document.getElementById(
                        "laundryHistoryList"
                    );


                if (
                    !container
                ) {

                    return;

                }


                const history =
                    state.laundry
                        .history
                        .slice(
                            0,
                            8
                        );


                if (
                    !history.length
                ) {

                    container.innerHTML = `

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                ✓
                            </div>

                            <div>

                                <h3>
                                    Your laundry history starts here.
                                </h3>

                                <p>
                                    The first load you completely put away
                                    will appear here with its date and
                                    total duration.
                                </p>

                            </div>

                        </div>

                    `;


                    return;

                }


                container.innerHTML =
                    history
                        .map(
                            load => `

                                <article class="laundry-history-row">

                                    <span class="history-check">
                                        ✓
                                    </span>


                                    <div class="laundry-history-main">

                                        <h3>
                                            ${HomeApp.escapeHtml(load.name)}
                                        </h3>

                                        <p>

                                            ${
                                                load.scheduleId

                                                    ? "Recurring weekly load"

                                                    : "Unscheduled load"
                                            }

                                        </p>

                                    </div>


                                    <div class="history-meta">

                                        <span>
                                            Finished
                                        </span>

                                        <strong>
                                            ${this.formatDateTime(load.completedAt)}
                                        </strong>

                                    </div>


                                    <div class="history-meta">

                                        <span>
                                            Duration
                                        </span>

                                        <strong>
                                            ${this.formatDuration(load.durationMs)}
                                        </strong>

                                    </div>

                                </article>

                            `
                        )
                        .join("");

            },



            /* ====================================================
               WEEK HELPERS

               HomeStore owns local date + week calculations.
               Laundry only asks for those shared values.
            ==================================================== */

            getWeeklyCompletion(
                state
            ) {

                const schedule =
                    Array.isArray(
                        state.laundry
                            ?.weeklySchedule
                    )

                        ? state.laundry
                            .weeklySchedule

                        : [];


                if (
                    !schedule.length
                ) {

                    /*
                     * No schedule is not failure.
                     * The UI displays an em dash instead of pretending
                     * the user completed a nonexistent plan.
                     *
                     * Returning 100 keeps health neutral.
                     */
                    return 100;

                }


                const weekKey =
                    HomeStore.getLaundryWeekKey();


                const complete =
                    schedule
                        .filter(
                            item =>

                                Array.isArray(
                                    item.completedWeeks
                                ) &&

                                item.completedWeeks
                                    .includes(
                                        weekKey
                                    )
                        )
                        .length;


                return Math.round(

                    (
                        complete /
                        schedule.length
                    ) *
                    100

                );

            },



            getTodayDay() {

                return HomeStore
                    .getLaundryToday();

            },



            getLocalDateKey() {

                return HomeStore
                    .getLocalDateKey();

            },



            getWeekKey() {

                return HomeStore
                    .getLaundryWeekKey();

            },



            isCompletedThisWeek(
                item
            ) {

                return (

                    Array.isArray(
                        item?.completedWeeks
                    ) &&

                    item.completedWeeks
                        .includes(
                            HomeStore
                                .getLaundryWeekKey()
                        )

                );

            },



            /* ====================================================
               MAINTENANCE INTELLIGENCE
            ==================================================== */

            getMaintenanceAttention(
                state
            ) {

                return state.laundry
                    .maintenance
                    .filter(
                        task =>
                            this.getMaintenanceStatus(
                                task
                            )
                                .needsAttention
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>

                            this.getMaintenanceSortValue(
                                second
                            ) -

                            this.getMaintenanceSortValue(
                                first
                            )
                    );

            },



            getMaintenanceStatus(
                task
            ) {

                const rawFrequency =
                    Number(
                        task.frequencyDays
                    );


                const frequency =

                    Number.isFinite(
                        rawFrequency
                    ) &&

                    rawFrequency >
                    0

                        ? rawFrequency

                        : 30;


                /*
                 * No completion date yet.
                 *
                 * This is not a warning.
                 * HomeOS needs one completion
                 * to begin the care clock.
                 */

                if (
                    !task.lastCompletedAt
                ) {

                    return {

                        label:
                            "START TRACKING",

                        className:
                            "baseline",

                        pillClass:
                            "baseline",

                        symbol:
                            "○",

                        needsAttention:
                            false,

                        isBaseline:
                            true,

                        daysRemaining:
                            null,

                        overdueDays:
                            0,

                        progressPercent:
                            0,

                        countdown:
                            "Complete once to start tracking",

                        detail:
                            "HomeOS will begin the care clock from that completion date."

                    };

                }


                const completedAt =
                    new Date(
                        task.lastCompletedAt
                    );


                /*
                 * Protect the maintenance clock
                 * from an invalid saved date.
                 */

                if (
                    Number.isNaN(
                        completedAt.getTime()
                    )
                ) {

                    return {

                        label:
                            "START TRACKING",

                        className:
                            "baseline",

                        pillClass:
                            "baseline",

                        symbol:
                            "○",

                        needsAttention:
                            false,

                        isBaseline:
                            true,

                        daysRemaining:
                            null,

                        overdueDays:
                            0,

                        progressPercent:
                            0,

                        countdown:
                            "Complete once to start tracking",

                        detail:
                            "HomeOS needs a valid completion date to begin the care clock."

                    };

                }


                /*
                 * Build the next due date from
                 * the last completion date.
                 */

                const dueDate =
                    new Date(

                        completedAt.getFullYear(),

                        completedAt.getMonth(),

                        completedAt.getDate()

                    );


                dueDate.setDate(

                    dueDate.getDate() +
                    frequency

                );


                /*
                 * Compare calendar days rather
                 * than elapsed hours.
                 */

                const today =
                    new Date();


                const todayUtc =
                    Date.UTC(

                        today.getFullYear(),

                        today.getMonth(),

                        today.getDate()

                    );


                const dueUtc =
                    Date.UTC(

                        dueDate.getFullYear(),

                        dueDate.getMonth(),

                        dueDate.getDate()

                    );


                const daysRemaining =
                    Math.round(

                        (
                            dueUtc -
                            todayUtc
                        ) /

                        86400000

                    );


                const daysSinceCompleted =
                    frequency -
                    daysRemaining;


                const progressPercent =
                    Math.max(

                        0,

                        Math.min(

                            100,

                            Math.round(

                                (
                                    daysSinceCompleted /
                                    frequency
                                ) *

                                100

                            )

                        )

                    );


                const dueDateLabel =
                    this.formatMaintenanceDate(
                        dueDate
                    );


                /*
                 * OVERDUE
                 */

                if (
                    daysRemaining <
                    0
                ) {

                    const overdueDays =
                        Math.abs(
                            daysRemaining
                        );


                    return {

                        label:
                            "OVERDUE",

                        className:
                            "overdue",

                        pillClass:
                            "danger",

                        symbol:
                            "×",

                        needsAttention:
                            true,

                        isBaseline:
                            false,

                        daysRemaining,

                        overdueDays,

                        progressPercent:
                            100,

                        countdown:

                            overdueDays ===
                            1

                                ? "1 day overdue"

                                : `${overdueDays} days overdue`,

                        detail:
                            `Was due ${dueDateLabel}`

                    };

                }


                /*
                 * DUE TODAY
                 */

                if (
                    daysRemaining ===
                    0
                ) {

                    return {

                        label:
                            "DUE TODAY",

                        className:
                            "attention",

                        pillClass:
                            "warning",

                        symbol:
                            "!",

                        needsAttention:
                            true,

                        isBaseline:
                            false,

                        daysRemaining:
                            0,

                        overdueDays:
                            0,

                        progressPercent:
                            100,

                        countdown:
                            "Needs care today",

                        detail:
                            `Due ${dueDateLabel}`

                    };

                }


                /*
                 * HEALTHY
                 *
                 * Upcoming care remains healthy,
                 * including when it is due tomorrow.
                 */

                return {

                    label:
                        "HEALTHY",

                    className:
                        "current",

                    pillClass:
                        "success",

                    symbol:
                        "✓",

                    needsAttention:
                        false,

                    isBaseline:
                        false,

                    daysRemaining,

                    overdueDays:
                        0,

                    progressPercent,

                    countdown:

                        daysRemaining ===
                        1

                            ? "Due tomorrow"

                            : `Due in ${daysRemaining} days`,

                    detail:
                        `Next care ${dueDateLabel}`

                };

            },


            getMaintenanceSortValue(
                task
            ) {

                const status =
                    this.getMaintenanceStatus(
                        task
                    );


                /*
                 * Baseline tasks stay below
                 * active maintenance clocks.
                 */

                if (
                    status.isBaseline
                ) {

                    return -1;

                }


                /*
                 * Overdue tasks rise to the top.
                 */

                if (
                    status.overdueDays >
                    0
                ) {

                    return (

                        200000 +
                        status.overdueDays

                    );

                }


                /*
                 * Due-today tasks come next.
                 */

                if (
                    status.daysRemaining ===
                    0
                ) {

                    return 100000;

                }


                /*
                 * Healthy tasks are ordered by
                 * whichever one is due soonest.
                 */

                return (

                    10000 -
                    status.daysRemaining

                );

            },


            /* ====================================================
               LIVE TIMERS
            ==================================================== */

            startTimer() {

                if (
                    this.timer
                ) {

                    clearInterval(
                        this.timer
                    );

                }


                this.timer =
                    setInterval(
                        () => {

                            this.checkForNewDay();

                            this.renderDate();

                            this.updateTimers();

                        },
                        1000
                    );

            },



            updateTimers() {

                const state =
                    HomeStore.getState();


                document
                    .querySelectorAll(
                        "[data-load-timer]"
                    )
                    .forEach(
                        element => {

                            const load =
                                state.laundry
                                    .activeLoads
                                    .find(
                                        item =>
                                            item.id ===
                                            element.dataset
                                                .loadTimer
                                    );


                            if (
                                load
                            ) {

                                element.textContent =
                                    this.formatElapsed(
                                        load.startedAt
                                    );

                            }

                        }
                    );

            },



            /* ====================================================
               EVENTS
            ==================================================== */

            bindEvents() {

                document.addEventListener(
                    "click",
                    event => {


                        /* START LOAD */

                        if (
                            event.target.closest(
                                "#quickLoadButton"
                            ) ||

                            event.target.closest(
                                "#quickLoadButtonTwo"
                            )
                        ) {

                            const input =
                                document.getElementById(
                                    "loadNameInput"
                                );


                            if (
                                input
                            ) {

                                input.value =
                                    "";

                            }


                            document
                                .getElementById(
                                    "loadDialog"
                                )
                                ?.showModal();


                            requestAnimationFrame(
                                () => {

                                    input
                                        ?.focus();

                                }
                            );


                            return;

                        }



                        /* ADD SCHEDULE */

                        if (
                            event.target.closest(
                                "#addScheduleButton"
                            ) ||

                            event.target.closest(
                                "#addScheduleButtonTwo"
                            )
                        ) {

                            this.openScheduleDialog();

                            return;

                        }



                        /* ADD MAINTENANCE */

                        if (
                            event.target.closest(
                                "#addMaintenanceButton"
                            )
                        ) {

                            const name =
                                document.getElementById(
                                    "maintenanceNameInput"
                                );


                            const frequency =
                                document.getElementById(
                                    "maintenanceFrequencyInput"
                                );


                            if (
                                name
                            ) {

                                name.value =
                                    "";

                            }


                            if (
                                frequency
                            ) {

                                frequency.value =
                                    "30";

                            }


                            document
                                .getElementById(
                                    "maintenanceDialog"
                                )
                                ?.showModal();


                            requestAnimationFrame(
                                () => {

                                    name
                                        ?.focus();

                                }
                            );


                            return;

                        }



                        /* GUIDE */

                        const guide =
                            event.target.closest(
                                "#laundryGuideAction"
                            );


                        if (
                            guide
                        ) {

                            const action =
                                guide.dataset
                                    .laundryGuideAction;


                            const targetId =
                                guide.dataset
                                    .targetId;


                            if (
                                action ===
                                "jump"
                            ) {

                                document
                                    .getElementById(
                                        `active-load-${targetId}`
                                    )
                                    ?.scrollIntoView({

                                        behavior:
                                            "smooth",

                                        block:
                                            "center"

                                    });

                            }


                            else if (
                                action ===
                                "scheduled"
                            ) {

                                this.startScheduledLoad(
                                    targetId
                                );

                            }


                            else if (
                                action ===
                                "maintenance"
                            ) {

                                document
                                    .getElementById(
                                        "maintenanceSection"
                                    )
                                    ?.scrollIntoView({

                                        behavior:
                                            "smooth",

                                        block:
                                            "start"

                                    });

                            }


                            else {

                                document
                                    .getElementById(
                                        "loadDialog"
                                    )
                                    ?.showModal();

                            }


                            return;

                        }



                        /* CLOSE DIALOG */

                        const close =
                            event.target.closest(
                                "[data-close-dialog]"
                            );


                        if (
                            close
                        ) {

                            document
                                .getElementById(
                                    close.dataset
                                        .closeDialog
                                )
                                ?.close();


                            return;

                        }



                        /* DAY */

                        const day =
                            event.target.closest(
                                "[data-laundry-day]"
                            );


                        if (
                            day
                        ) {

                            this.selectedDay =
                                day.dataset
                                    .laundryDay;


                            this.render();


                            return;

                        }



                        /* NEXT STAGE */

                        const next =
                            event.target.closest(
                                "[data-next-stage]"
                            );


                        if (
                            next
                        ) {

                            this.moveToNextStage(

                                next.dataset
                                    .nextStage

                            );


                            return;

                        }



                        /* COMPLETE LOAD */

                        const complete =
                            event.target.closest(
                                "[data-complete-load]"
                            );


                        if (
                            complete
                        ) {

                            this.completeLoad(

                                complete.dataset
                                    .completeLoad

                            );


                            return;

                        }



                        /* REMOVE LOAD */

                        const remove =
                            event.target.closest(
                                "[data-remove-load]"
                            );


                        if (
                            remove
                        ) {

                            this.removeLoad(

                                remove.dataset
                                    .removeLoad

                            );


                            return;

                        }



                        /* START SCHEDULED */

                        const scheduled =
                            event.target.closest(
                                "[data-start-scheduled]"
                            );


                        if (
                            scheduled
                        ) {

                            this.startScheduledLoad(

                                scheduled.dataset
                                    .startScheduled

                            );


                            return;

                        }



                        /* EDIT SCHEDULE */

                        const editSchedule =
                            event.target.closest(
                                "[data-edit-schedule]"
                            );


                        if (
                            editSchedule
                        ) {

                            this.openScheduleDialog(

                                editSchedule.dataset
                                    .editSchedule

                            );


                            return;

                        }



                        /* DELETE SCHEDULE */

                        const deleteSchedule =
                            event.target.closest(
                                "[data-delete-schedule]"
                            );


                        if (
                            deleteSchedule
                        ) {

                            this.deleteSchedule(

                                deleteSchedule.dataset
                                    .deleteSchedule

                            );


                            return;

                        }



                        /* JUMP TO ACTIVE */

                        const jump =
                            event.target.closest(
                                "[data-jump-load]"
                            );


                        if (
                            jump
                        ) {

                            document
                                .getElementById(

                                    `active-load-${jump.dataset.jumpLoad}`

                                )
                                ?.scrollIntoView({

                                    behavior:
                                        "smooth",

                                    block:
                                        "center"

                                });


                            return;

                        }



                        /* COMPLETE MAINTENANCE */

                        const completeMaintenance =
                            event.target.closest(
                                "[data-complete-maintenance]"
                            );


                        if (
                            completeMaintenance
                        ) {

                            this.completeMaintenance(

                                completeMaintenance
                                    .dataset
                                    .completeMaintenance

                            );


                            return;

                        }



                        /* DELETE MAINTENANCE */

                        const deleteMaintenance =
                            event.target.closest(
                                "[data-delete-maintenance]"
                            );


                        if (
                            deleteMaintenance
                        ) {

                            this.deleteMaintenance(

                                deleteMaintenance
                                    .dataset
                                    .deleteMaintenance

                            );

                        }

                    }
                );



                /* QUICK LOAD FORM */

                document
                    .getElementById(
                        "loadForm"
                    )
                    ?.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();


                            const name =
                                document
                                    .getElementById(
                                        "loadNameInput"
                                    )
                                    ?.value
                                    .trim() ||
                                "";


                            if (
                                !name
                            ) {

                                return;

                            }


                            this.startLoad(
                                name
                            );


                            document
                                .getElementById(
                                    "loadDialog"
                                )
                                ?.close();

                        }
                    );



                /* SCHEDULE FORM */

                document
                    .getElementById(
                        "scheduleForm"
                    )
                    ?.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();


                            this.saveSchedule();


                            document
                                .getElementById(
                                    "scheduleDialog"
                                )
                                ?.close();

                        }
                    );



                /* MAINTENANCE FORM */

                document
                    .getElementById(
                        "maintenanceForm"
                    )
                    ?.addEventListener(
                        "submit",
                        event => {

                            event.preventDefault();


                            this.saveMaintenance();


                            document
                                .getElementById(
                                    "maintenanceDialog"
                                )
                                ?.close();

                        }
                    );

            },



            /* ====================================================
               FORMATTERS
            ==================================================== */


            titleCase(
                value
            ) {

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



            formatScheduleTime(
                value
            ) {

                if (
                    !value
                ) {

                    return "Any time";

                }


                const [
                    hoursText,
                    minutesText
                ] =
                    String(
                        value
                    )
                        .split(
                            ":"
                        );


                const hours =
                    Number(
                        hoursText
                    );


                const minutes =
                    Number(
                        minutesText ||
                        0
                    );


                if (
                    !Number.isFinite(
                        hours
                    )
                ) {

                    return value;

                }


                const suffix =

                    hours >=
                    12

                        ? "PM"

                        : "AM";


                const displayHours =
                    hours %
                    12 ||
                    12;


                return (

                    `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`

                );

            },



            formatDateTime(
                value
            ) {

                if (
                    !value
                ) {

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



            formatElapsed(
                startedAt
            ) {

                if (
                    !startedAt
                ) {

                    return "0 min";

                }


                const start =
                    new Date(
                        startedAt
                    )
                        .getTime();


                if (
                    !Number.isFinite(
                        start
                    )
                ) {

                    return "0 min";

                }


                const minutes =
                    Math.max(

                        0,

                        Math.floor(

                            (
                                Date.now() -
                                start
                            ) /

                            60000

                        )

                    );


                if (
                    minutes <
                    60
                ) {

                    return `${minutes} min`;

                }


                const hours =
                    Math.floor(
                        minutes /
                        60
                    );


                const remaining =
                    minutes %
                    60;


                return (

                    `${hours}h ${remaining}m`

                );

            },



            formatDuration(
                durationMs
            ) {

                const ms =
                    Number(
                        durationMs ||
                        0
                    );


                if (
                    !ms ||
                    ms <
                    0
                ) {

                    return "Not tracked";

                }


                const minutes =
                    Math.max(

                        1,

                        Math.round(
                            ms /
                            60000
                        )

                    );


                if (
                    minutes <
                    60
                ) {

                    return `${minutes} min`;

                }


                const hours =
                    Math.floor(
                        minutes /
                        60
                    );


                const remaining =
                    minutes %
                    60;


                return (

                    `${hours}h ${remaining}m`

                );

            },



            formatFrequency(
                days
            ) {

                const number =
                    Number(
                        days
                    );


                const labels = {

                    7:
                        "Every week",

                    14:
                        "Every 2 weeks",

                    30:
                        "Every month",

                    60:
                        "Every 2 months",

                    90:
                        "Every 3 months",

                    180:
                        "Every 6 months"

                };


                return (

                    labels[
                        number
                    ] ||

                    `Every ${number} days`

                );

            },



            formatMaintenanceDate(
                date
            ) {

                if (
                    !(date instanceof Date) ||

                    Number.isNaN(
                        date.getTime()
                    )
                ) {

                    return "Unknown date";

                }


                return new Intl.DateTimeFormat(

                    undefined,

                    {

                        month:
                            "short",

                        day:
                            "numeric",

                        year:
                            "numeric"

                    }

                )
                    .format(
                        date
                    );

            },


            formatMaintenanceLastDone(
                dateString
            ) {

                if (
                    !dateString
                ) {

                    return "No baseline yet";

                }


                const days =
                    HomeStore.daysSince(
                        dateString
                    );


                if (
                    days ===
                    null
                ) {

                    return "Last completion unavailable";

                }


                if (
                    days ===
                    0
                ) {

                    return "Done today";

                }


                if (
                    days ===
                    1
                ) {

                    return "Done yesterday";

                }


                return (

                    `Last done ${days} days ago`

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


                if (
                    element
                ) {

                    element.textContent =
                        value;

                }

            }

        };


        window.LaundryApp =
            LaundryApp;


        LaundryApp.init();

    }
);