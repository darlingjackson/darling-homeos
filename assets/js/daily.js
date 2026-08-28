/* ================================================================
   DARLING HOMEOS
   DAILY RHYTHM CONTROLLER

   FILE:
   assets/js/daily.js

   DAILY RHYTHM OWNS:
   - Opening Shift + Closing Shift
   - Upstairs + Downstairs daily task groups
   - Real-life household Daily template
   - One-time / repeating custom tasks
   - Quick Shopping List
   - Compact Laundry Flow quick controls

   SHARED RULES:
   - HomeStore is the only persistent memory.
   - shell.js owns navigation/footer/theme.
   - app.js owns shared helpers/toasts.
   - laundry.html remains the full Laundry workspace.
   - No direct localStorage.
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const DailyApp = {
        selectedShift: "opening",
        openAreas: new Set(),
        lastDateKey: null,
        clockTimer: null,

        DAILY_TEMPLATE_VERSION: 2,
        LAUNDRY_STAGES: ["wash", "dry", "fold", "put-away"],

        DAILY_TEMPLATE: {
            opening: [
                {
                    id: "opening-master-trash-pickup",
                    title: "Pick up trash in the master bedroom",
                    area: "upstairs",
                    room: "Master Suite"
                },
                {
                    id: "opening-master-bed",
                    title: "Make the master bed",
                    area: "upstairs",
                    room: "Master Suite",
                    aliases: ["opening-make-beds"]
                },
                {
                    id: "opening-nightstands",
                    title: "Reset the nightstands",
                    area: "upstairs",
                    room: "Master Suite"
                },
                {
                    id: "opening-shark-upstairs",
                    title: "Start the Shark vacuum upstairs",
                    area: "upstairs",
                    room: "Master Suite"
                },
                {
                    id: "opening-master-toys",
                    title: "Pick up toys in the master bedroom",
                    area: "upstairs",
                    room: "Master Suite"
                },
                {
                    id: "opening-dirty-clothes",
                    title: "Collect dirty clothes and put them in laundry",
                    area: "upstairs",
                    room: "Master Suite",
                    aliases: ["opening-laundry"]
                },
                {
                    id: "opening-master-bath",
                    title: "Wipe down the master bathroom",
                    area: "upstairs",
                    room: "Master Bathroom",
                    aliases: ["opening-bathrooms"]
                },
                {
                    id: "opening-kids-rooms",
                    title: "Quick pickup in the kids' rooms",
                    area: "upstairs",
                    room: "Kids Area"
                },
                {
                    id: "opening-kids-bath",
                    title: "Wipe down the kids' bathroom",
                    area: "upstairs",
                    room: "Kids Area"
                },
                {
                    id: "opening-start-laundry",
                    title: "Start one load of laundry",
                    area: "upstairs",
                    room: "Laundry",
                    aliases: ["opening-laundry-flow"]
                },
                {
                    id: "opening-master-trash-out",
                    title: "Take the master bedroom and bathroom trash out",
                    area: "upstairs",
                    room: "Master Suite"
                },
                {
                    id: "opening-unload-dishwasher",
                    title: "Unload the dishwasher",
                    area: "downstairs",
                    room: "Kitchen",
                    aliases: ["opening-dishwasher"]
                },
                {
                    id: "opening-dinner-thaw",
                    title: "Take dinner out to thaw",
                    area: "downstairs",
                    room: "Kitchen"
                }
            ],

            closing: [
                {
                    id: "closing-toys",
                    title: "Pick up toys downstairs",
                    area: "downstairs",
                    room: "Main Living"
                },
                {
                    id: "closing-shark-downstairs",
                    title: "Start the Shark vacuum downstairs",
                    area: "downstairs",
                    room: "Main Living"
                },
                {
                    id: "closing-living-pickup",
                    title: "Quick pickup of the living space",
                    area: "downstairs",
                    room: "Living Room",
                    aliases: ["closing-living", "opening-living"]
                },
                {
                    id: "closing-fold-blankets",
                    title: "Fold and reset the living-room blankets",
                    area: "downstairs",
                    room: "Living Room"
                },
                {
                    id: "closing-upstairs-baskets",
                    title: "Put anything that belongs upstairs into the return baskets",
                    area: "downstairs",
                    room: "Main Living",
                    aliases: ["closing-strays", "opening-strays"]
                },
                {
                    id: "closing-office-desk",
                    title: "Pick up and reset the office desk",
                    area: "upstairs",
                    room: "Office"
                },
                {
                    id: "closing-kitchen-reset",
                    title: "Clean up the kitchen",
                    area: "downstairs",
                    room: "Kitchen",
                    aliases: ["closing-sink", "closing-counters", "opening-kitchen"]
                },
                {
                    id: "closing-trash",
                    title: "Take out the garbage",
                    area: "downstairs",
                    room: "Kitchen",
                    aliases: ["closing-trash"]
                },
                {
                    id: "closing-cook-dinner",
                    title: "Cook dinner",
                    area: "downstairs",
                    room: "Kitchen"
                },
                {
                    id: "closing-load-dishwasher",
                    title: "Load the dishwasher",
                    area: "downstairs",
                    room: "Kitchen",
                    aliases: ["closing-dishwasher"]
                }
            ]
        },

        LEGACY_AREA_MAP: {
            "opening-make-beds": "upstairs",
            "opening-blinds": "downstairs",
            "opening-laundry": "upstairs",
            "opening-dishwasher": "downstairs",
            "opening-kitchen": "downstairs",
            "opening-bathrooms": "upstairs",
            "opening-laundry-flow": "upstairs",
            "opening-strays": "downstairs",
            "opening-living": "downstairs",
            "opening-plants": "downstairs",
            "closing-dishwasher": "downstairs",
            "closing-sink": "downstairs",
            "closing-counters": "downstairs",
            "closing-dining": "downstairs",
            "closing-living": "downstairs",
            "closing-strays": "downstairs",
            "closing-laundry": "upstairs",
            "closing-upstairs": "upstairs",
            "closing-trash": "downstairs",
            "closing-morning": "downstairs"
        },

        init() {
            if (!window.HomeStore || !window.HomeApp) {
                console.error("Daily Rhythm requires HomeStore and HomeApp.");
                return;
            }

            this.prepareDailyEnhancements();

            let state = HomeStore.getState();
            this.syncLaundryStartTask(state);
            state = HomeStore.getState();

            this.selectedShift = this.resolveSelectedShift(state);
            this.lastDateKey = HomeStore.getLocalDateKey();

            this.bindEvents();
            this.bindStateEvents();
            this.render(state);
            this.startClock();
        },

        /* ============================================================
           REAL-LIFE DAILY TEMPLATE + EXISTING DATA MIGRATION
        ============================================================ */

        prepareDailyEnhancements() {
            const state = HomeStore.getState();
            const today = HomeStore.getLocalDateKey();
            const rhythm = state.dailyRhythm || {};

            let needsUpdate =
                rhythm.dailyTemplateVersion !== this.DAILY_TEMPLATE_VERSION ||
                !Array.isArray(rhythm.shoppingList) ||
                rhythm.shoppingDate !== today;

            ["opening", "closing"].forEach(shift => {
                const tasks = Array.isArray(rhythm[shift]) ? rhythm[shift] : [];

                tasks.forEach(task => {
                    if (!["upstairs", "downstairs"].includes(task.area)) {
                        needsUpdate = true;
                    }

                    if (task.custom && typeof task.recurring !== "boolean") {
                        needsUpdate = true;
                    }

                    if (task.custom && !task.createdDate) {
                        needsUpdate = true;
                    }

                    if (
                        task.custom &&
                        task.recurring === false &&
                        task.createdDate &&
                        task.createdDate !== today
                    ) {
                        needsUpdate = true;
                    }
                });
            });

            if (!needsUpdate) {
                return;
            }

            HomeStore.update(current => {
                const daily = current.dailyRhythm;

                if (daily.dailyTemplateVersion !== this.DAILY_TEMPLATE_VERSION) {
                    daily.opening = this.buildTemplateShift(
                        "opening",
                        daily.opening,
                        today
                    );

                    daily.closing = this.buildTemplateShift(
                        "closing",
                        daily.closing,
                        today
                    );

                    daily.dailyTemplateVersion = this.DAILY_TEMPLATE_VERSION;
                }

                ["opening", "closing"].forEach(shift => {
                    const tasks = Array.isArray(daily[shift]) ? daily[shift] : [];

                    daily[shift] = tasks
                        .filter(task => {
                            if (!task.custom) {
                                return true;
                            }

                            const recurring = task.recurring !== false;
                            return recurring || !task.createdDate || task.createdDate === today;
                        })
                        .map(task => ({
                            ...task,
                            area: this.resolveTaskArea(task),
                            room: task.room || null,
                            recurring: task.custom ? task.recurring !== false : true,
                            createdDate: task.custom ? (task.createdDate || today) : null
                        }));
                });

                if (!Array.isArray(daily.shoppingList)) {
                    daily.shoppingList = [];
                }

                const previousDate = daily.shoppingDate || today;

                if (previousDate !== today) {
                    daily.shoppingList = daily.shoppingList
                        .filter(item => !item.done)
                        .map(item => ({
                            ...item,
                            done: false,
                            completedAt: null,
                            carriedFrom: item.carriedFrom || previousDate,
                            dayDate: today
                        }));
                }

                daily.shoppingDate = today;
            });
        },

        buildTemplateShift(shift, existingTasks, today) {
            const existing = Array.isArray(existingTasks) ? existingTasks : [];
            const template = this.DAILY_TEMPLATE[shift] || [];

            const built = template.map(starter => {
                const old = this.findTemplateMatch(starter, existing);

                return {
                    id: starter.id,
                    title: starter.title,
                    area: starter.area,
                    room: starter.room || null,
                    done: Boolean(old?.done),
                    completedAt: old?.completedAt || null,
                    custom: false,
                    recurring: true,
                    createdDate: null
                };
            });

            existing
                .filter(task => task.custom)
                .forEach(task => {
                    const recurring = task.recurring !== false;

                    if (!recurring && task.createdDate && task.createdDate !== today) {
                        return;
                    }

                    if (built.some(item => item.id === task.id)) {
                        return;
                    }

                    built.push({
                        ...task,
                        area: this.resolveTaskArea(task),
                        room: task.room || null,
                        custom: true,
                        recurring,
                        createdDate: task.createdDate || today
                    });
                });

            return built;
        },

        findTemplateMatch(starter, existing) {
            const ids = [starter.id, ...(starter.aliases || [])];

            const exact = existing.find(task => ids.includes(task.id));
            if (exact) {
                return exact;
            }

            const title = this.normalizeTitle(starter.title);
            return existing.find(task => this.normalizeTitle(task.title) === title);
        },

        normalizeTitle(value) {
            return String(value || "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .trim();
        },

        resolveTaskArea(task) {
            if (["upstairs", "downstairs"].includes(task?.area)) {
                return task.area;
            }

            return this.LEGACY_AREA_MAP[task?.id] || "downstairs";
        },

        /* ============================================================
           STATE + CLOCK
        ============================================================ */

        bindStateEvents() {
            window.addEventListener("homeos:statechange", event => {
                const state = event.detail || HomeStore.getState();

                if (this.syncLaundryStartTask(state)) {
                    return;
                }

                this.selectedShift = this.resolveSelectedShift(state);
                this.lastDateKey = HomeStore.getLocalDateKey();
                this.render(state);
            });
        },

        resolveSelectedShift(state) {
            const saved = state.dailyRhythm?.selectedShift;
            return ["opening", "closing"].includes(saved)
                ? saved
                : this.getRecommendedShift(state);
        },

        startClock() {
            this.renderClock();

            if (this.clockTimer) {
                clearInterval(this.clockTimer);
            }

            this.clockTimer = setInterval(() => {
                this.renderClock();
                this.checkForNewDay();
            }, 1000);
        },

        renderClock() {
            const now = new Date();
            const greeting = HomeApp.getGreeting(now);
            const greetingElement = document.getElementById("dailyGreeting");

            if (greetingElement) {
                greetingElement.innerHTML = `${greeting},<br><strong>Darling.</strong>`;
            }

            this.setText(
                "dailyDateTime",
                `${HomeApp.formatDate(now)} · ${HomeApp.formatTime(now)}`
            );

            this.setText("dailyClock", HomeApp.formatTime(now));

            this.setText(
                "dailyShortDate",
                new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }).format(now)
            );
        },

        checkForNewDay() {
            const today = HomeStore.getLocalDateKey();

            if (today === this.lastDateKey) {
                return;
            }

            HomeStore.getState();
            this.prepareDailyEnhancements();

            let freshState = HomeStore.getState();
            this.syncLaundryStartTask(freshState);
            freshState = HomeStore.getState();

            this.lastDateKey = today;
            this.selectedShift = this.resolveSelectedShift(freshState);
            this.openAreas.clear();
            this.render(freshState);

            HomeApp.toast("A new day has started. Unfinished shopping moved forward.");
        },

        /* ============================================================
           MASTER RENDER
        ============================================================ */

        render(providedState = null) {
            const state = providedState || HomeStore.getState();

            this.renderGuide(state);
            this.renderShiftConsole(state);
            this.renderLaundryFlow(state);
            this.renderAreas(state);
            this.renderShopping(state);
            this.renderAddTaskState();
        },

        calculateProgress(tasks) {
            const list = Array.isArray(tasks) ? tasks : [];
            const total = list.length;
            const completed = list.filter(task => task.done).length;

            return {
                total,
                completed,
                remaining: Math.max(0, total - completed),
                percent: total ? Math.round((completed / total) * 100) : 100
            };
        },

        calculateOverallProgress(state) {
            return this.calculateProgress([
                ...(state.dailyRhythm?.opening || []),
                ...(state.dailyRhythm?.closing || [])
            ]);
        },

        getRecommendedShift(state) {
            const opening = this.calculateProgress(state.dailyRhythm?.opening);
            const closing = this.calculateProgress(state.dailyRhythm?.closing);

            if (opening.percent === 100 && closing.percent < 100) {
                return "closing";
            }

            if (closing.percent === 100 && opening.percent < 100) {
                return "opening";
            }

            return new Date().getHours() < 15 ? "opening" : "closing";
        },

        renderGuide(state) {
            const recommended = this.getRecommendedShift(state);
            const current = this.calculateProgress(
                state.dailyRhythm?.[this.selectedShift]
            );
            const overall = this.calculateOverallProgress(state);
            let message;

            if (overall.percent === 100) {
                message = "Both shifts are complete. The house can settle until tomorrow.";
            } else if (current.percent === 100) {
                message = `${this.shiftName(this.selectedShift)} is complete. ${this.shiftName(recommended)} is the best next move when you are ready.`;
            } else if (this.selectedShift === recommended) {
                message = `${this.shiftName(this.selectedShift)} makes sense right now. ${current.remaining} task${current.remaining === 1 ? "" : "s"} remain, and you can work Upstairs or Downstairs in any order.`;
            } else {
                message = `You are viewing ${this.shiftName(this.selectedShift)}. HomeOS currently recommends ${this.shiftName(recommended)}, but your place is saved either way.`;
            }

            this.setText("dailyGuideMessage", message);
        },

        renderShiftConsole(state) {
            const opening = this.calculateProgress(state.dailyRhythm?.opening);
            const closing = this.calculateProgress(state.dailyRhythm?.closing);
            const selected = this.selectedShift === "opening" ? opening : closing;
            const overall = this.calculateOverallProgress(state);

            this.setText("openingShiftProgress", `${opening.percent}%`);
            this.setText("closingShiftProgress", `${closing.percent}%`);

            this.setText(
                "openingShiftRemaining",
                opening.remaining
                    ? `${opening.remaining} task${opening.remaining === 1 ? "" : "s"} left`
                    : "Opening complete"
            );

            this.setText(
                "closingShiftRemaining",
                closing.remaining
                    ? `${closing.remaining} task${closing.remaining === 1 ? "" : "s"} left`
                    : "Closing complete"
            );

            this.setBarWidth("openingShiftProgressBar", opening.percent);
            this.setBarWidth("closingShiftProgressBar", closing.percent);

            document.querySelectorAll("[data-daily-shift]").forEach(button => {
                button.classList.toggle(
                    "selected",
                    button.dataset.dailyShift === this.selectedShift
                );
            });

            this.setText(
                "selectedShiftLabel",
                this.selectedShift === "opening" ? "OPENING SHIFT" : "CLOSING SHIFT"
            );

            this.setText("selectedShiftProgress", `${selected.percent}%`);
            this.setText(
                "selectedShiftRemaining",
                `${selected.remaining} TASK${selected.remaining === 1 ? "" : "S"}`
            );

            this.setBarWidth("dailyOverallProgressBar", overall.percent);
            this.setText(
                "dailyOverallText",
                `${overall.completed} of ${overall.total} daily resets complete.`
            );

            this.setText("dailyWorkspaceTitle", this.shiftName(this.selectedShift));
            this.setText(
                "dailyWorkspaceDescription",
                selected.remaining
                    ? `Choose Upstairs or Downstairs when you are ready. ${selected.remaining} task${selected.remaining === 1 ? "" : "s"} remain in this shift.`
                    : "This shift is complete. You can still open either area if you want to review it."
            );

            this.setText("dailyShiftChip", this.selectedShift.toUpperCase());
        },

        /* ============================================================
           TASKS BY AREA
        ============================================================ */

        renderAreas(state) {
            const container = document.getElementById("dailyAreaList");
            if (!container) {
                return;
            }

            const tasks = Array.isArray(state.dailyRhythm?.[this.selectedShift])
                ? state.dailyRhythm[this.selectedShift]
                : [];

            const areas = [
                {
                    id: "upstairs",
                    label: "Upstairs",
                    icon: "⌂",
                    color: "var(--daily-opening)"
                },
                {
                    id: "downstairs",
                    label: "Downstairs",
                    icon: "⌂",
                    color: "var(--daily-closing)"
                }
            ];

            container.innerHTML = areas
                .map(area => {
                    const areaTasks = tasks.filter(
                        task => this.resolveTaskArea(task) === area.id
                    );
                    const progress = this.calculateProgress(areaTasks);
                    const open = this.openAreas.has(area.id);

                    return `
                        <article
                            class="daily-area ${open ? "open" : ""}"
                            style="--area-color:${area.color};"
                        >
                            <button
                                class="daily-area-toggle"
                                type="button"
                                data-area-toggle="${area.id}"
                                aria-expanded="${open}"
                            >
                                <span class="daily-area-icon">${area.icon}</span>

                                <span class="daily-area-copy">
                                    <strong>${area.label}</strong>
                                    <small>
                                        ${progress.completed}/${progress.total} complete ·
                                        ${progress.remaining} open
                                    </small>
                                </span>

                                <span class="daily-area-percent">${progress.percent}%</span>
                                <span class="daily-area-chevron">${open ? "⌃" : "⌄"}</span>

                                <span class="daily-area-progress">
                                    <span style="width:${progress.percent}%;"></span>
                                </span>
                            </button>

                            <div class="daily-area-body" ${open ? "" : "hidden"}>
                                ${
                                    areaTasks.length
                                        ? areaTasks.map(task => this.renderTaskRow(task)).join("")
                                        : `
                                            <div class="daily-area-empty">
                                                Nothing is assigned to ${area.label} in this shift.
                                            </div>
                                        `
                                }
                            </div>
                        </article>
                    `;
                })
                .join("");
        },

        renderTaskRow(task) {
            const safeId = HomeApp.escapeHtml(task.id);
            const safeTitle = HomeApp.escapeHtml(task.title);
            const room = task.room
                ? HomeApp.escapeHtml(task.room)
                : this.areaName(this.resolveTaskArea(task));

            let meta;

            if (task.done && task.completedAt) {
                meta = `Completed ${HomeApp.formatTime(new Date(task.completedAt))}`;
            } else if (task.custom) {
                meta = `${room} · ${task.recurring === false ? "TODAY ONLY" : "REPEATS"}`;
            } else {
                meta = `${room} · HOMEOS`;
            }

            return `
                <div class="daily-task-row ${task.done ? "done" : ""}">
                    <input
                        class="daily-task-checkbox"
                        id="daily-${safeId}"
                        type="checkbox"
                        data-daily-task="${safeId}"
                        ${task.done ? "checked" : ""}
                    >

                    <label class="daily-task-main" for="daily-${safeId}">
                        <strong>${safeTitle}</strong>
                        <span>${meta}</span>
                    </label>

                    ${
                        task.custom
                            ? `
                                <button
                                    class="daily-task-remove"
                                    type="button"
                                    data-remove-daily-task="${safeId}"
                                    aria-label="Remove ${safeTitle}"
                                >×</button>
                            `
                            : ""
                    }
                </div>
            `;
        },

        toggleTask(taskId) {
            const shift = this.selectedShift;
            const before = HomeStore.getState();
            const task = (before.dailyRhythm?.[shift] || []).find(
                item => item.id === taskId
            );

            if (!task) {
                return;
            }

            const wasDone = Boolean(task.done);
            HomeStore.toggleRhythmTask(shift, taskId);

            if (wasDone) {
                return;
            }

            const after = HomeStore.getState();
            const progress = this.calculateProgress(after.dailyRhythm?.[shift]);

            if (progress.percent === 100) {
                HomeApp.toast(`${this.shiftName(shift)} complete.`);
            }
        },

        addCustomTask() {
            const input = document.getElementById("newDailyTask");
            const areaInput = document.getElementById("newDailyTaskArea");
            const recurringInput = document.getElementById("newDailyTaskRecurring");

            if (!input || !areaInput || !recurringInput) {
                return;
            }

            const title = input.value.trim();
            const area = areaInput.value;
            const recurring = recurringInput.checked;

            if (!title) {
                HomeApp.toast("Type a task before adding it.");
                input.focus();
                return;
            }

            if (!["upstairs", "downstairs"].includes(area)) {
                HomeApp.toast("Choose Upstairs or Downstairs first.");
                return;
            }

            const shift = this.selectedShift;
            const today = HomeStore.getLocalDateKey();

            HomeStore.update(state => {
                const tasks = state.dailyRhythm?.[shift];

                if (!Array.isArray(tasks)) {
                    return;
                }

                tasks.push({
                    id: this.makeId(`daily-${shift}-custom`),
                    title,
                    area,
                    room: null,
                    done: false,
                    completedAt: null,
                    custom: true,
                    recurring,
                    createdDate: today
                });
            });

            input.value = "";
            recurringInput.checked = false;

            this.openAreas.add(area);
            this.renderAreas(HomeStore.getState());

            HomeApp.toast(
                recurring
                    ? `${title} will repeat in ${this.areaName(area)}.`
                    : `${title} added for today.`
            );
        },

        removeCustomTask(taskId) {
            const shift = this.selectedShift;

            HomeStore.update(state => {
                const tasks = state.dailyRhythm?.[shift];

                if (!Array.isArray(tasks)) {
                    return;
                }

                state.dailyRhythm[shift] = tasks.filter(
                    task => !(task.id === taskId && task.custom)
                );
            });

            HomeApp.toast("Custom Daily Rhythm task removed.");
        },

        /* ============================================================
           LAUNDRY FLOW QUICK CONTROL
        ============================================================ */

        renderLaundryFlow(state) {
            const card = document.getElementById("dailyLaundryFlow");
            const stageTrack = document.getElementById("dailyLaundryStageTrack");
            const action = document.getElementById("dailyLaundryActionButton");
            const newLoadButton = document.getElementById("dailyLaundryNewLoadButton");

            if (!card || !stageTrack || !action) {
                return;
            }

            const loads = Array.isArray(state.laundry?.activeLoads)
                ? state.laundry.activeLoads
                : [];

            if (!loads.length) {
                card.dataset.stage = "idle";

                this.setText("dailyLaundryState", "IDLE");
                this.setText("dailyLaundryCount", "0 ACTIVE");
                this.setText("dailyLaundryTitle", "No active loads");
                this.setText(
                    "dailyLaundryMessage",
                    "Laundry Flow is ready when you are."
                );

                stageTrack.innerHTML = this.renderLaundryStageMarkup(null);

                action.textContent = "+ Start A Load";
                action.dataset.laundryAction = "start";
                delete action.dataset.loadId;

                if (newLoadButton) {
                    newLoadButton.hidden = true;
                }

                return;
            }

            const load = loads[0];

            const stage = this.LAUNDRY_STAGES.includes(load.stage)
                ? load.stage
                : "wash";

            const currentIndex = this.LAUNDRY_STAGES.indexOf(stage);
            const nextStage = this.LAUNDRY_STAGES[currentIndex + 1] || null;
            const extra = Math.max(0, loads.length - 1);

            card.dataset.stage = stage;

            this.setText(
                "dailyLaundryState",
                this.laundryStageLabel(stage).toUpperCase()
            );

            this.setText(
                "dailyLaundryCount",
                `${loads.length} ACTIVE${loads.length === 1 ? "" : " LOADS"}`
            );

            this.setText(
                "dailyLaundryTitle",
                load.name || "Laundry Load"
            );

            const stageTime =
                load.stageUpdatedAt ||
                load.startedAt;

            const stageCopy =
                stage === "wash"
                    ? "Washer is running"
                    : stage === "dry"
                        ? "Dryer is running"
                        : stage === "fold"
                            ? "Ready to fold"
                            : "Ready to put away";

            this.setText(
                "dailyLaundryMessage",
                `${stageCopy}${
                    stageTime
                        ? ` · ${HomeApp.formatTime(new Date(stageTime))}`
                        : ""
                }${
                    extra
                        ? ` · +${extra} more active`
                        : ""
                }`
            );

            stageTrack.innerHTML =
                this.renderLaundryStageMarkup(stage);

            if (nextStage) {
                action.textContent =
                    `Move To ${this.laundryStageLabel(nextStage)} →`;

                action.dataset.laundryAction =
                    "advance";

                action.dataset.loadId =
                    load.id;
            } else {
                action.textContent =
                    "Finish + Put Away ✓";

                action.dataset.laundryAction =
                    "complete";

                action.dataset.loadId =
                    load.id;
            }

            if (newLoadButton) {
                newLoadButton.hidden = false;
            }
        },

        renderLaundryStageMarkup(activeStage) {
            const activeIndex =
                activeStage
                    ? this.LAUNDRY_STAGES.indexOf(activeStage)
                    : -1;

            return this.LAUNDRY_STAGES
                .map((stage, index) => {
                    const status =
                        activeIndex === -1
                            ? ""
                            : index < activeIndex
                                ? "complete"
                                : index === activeIndex
                                    ? "active"
                                    : "";

                    return `
                        <div class="daily-laundry-stage ${status}">
                            <span>
                                ${String(index + 1).padStart(2, "0")}
                            </span>

                            <strong>
                                ${this.laundryStageLabel(stage)}
                            </strong>
                        </div>
                    `;
                })
                .join("");
        },

        openLaundryDialog() {
            const dialog =
                document.getElementById(
                    "dailyLaundryDialog"
                );

            const input =
                document.getElementById(
                    "dailyLaundryName"
                );

            if (!dialog || !input) {
                return;
            }

            input.value = "";

            if (typeof dialog.showModal === "function") {
                dialog.showModal();
            } else {
                dialog.setAttribute("open", "");
            }

            requestAnimationFrame(
                () => input.focus()
            );
        },

        closeLaundryDialog() {
            const dialog =
                document.getElementById(
                    "dailyLaundryDialog"
                );

            if (!dialog) {
                return;
            }

            if (typeof dialog.close === "function") {
                dialog.close();
            } else {
                dialog.removeAttribute("open");
            }
        },

        startLaundryLoad() {
            const input =
                document.getElementById(
                    "dailyLaundryName"
                );

            const name =
                String(
                    input?.value ||
                    ""
                ).trim();

            if (!name) {
                HomeApp.toast(
                    "Name the laundry load first."
                );

                input?.focus();
                return;
            }

            const now =
                new Date().toISOString();

            HomeStore.update(state => {
                if (
                    !state.laundry ||
                    typeof state.laundry !== "object"
                ) {
                    state.laundry = {};
                }

                if (
                    !Array.isArray(
                        state.laundry.activeLoads
                    )
                ) {
                    state.laundry.activeLoads = [];
                }

                state.laundry.activeLoads.push({
                    id: `load-${Date.now()}`,
                    name,
                    scheduleId: null,
                    stage: "wash",
                    status: "ACTIVE",
                    startedAt: now,
                    stageUpdatedAt: now,
                    stageHistory: {
                        wash: now
                    }
                });

                const startTask =
                    (
                        state.dailyRhythm?.opening ||
                        []
                    ).find(
                        task =>
                            task.id ===
                            "opening-start-laundry"
                    );

                if (
                    startTask &&
                    !startTask.done
                ) {
                    startTask.done = true;
                    startTask.completedAt = now;
                }
            });

            this.closeLaundryDialog();

            HomeApp.toast(
                `${name} started in Wash.`
            );
        },

        advanceLaundryLoad(loadId) {
            let loadName = "";
            let nextLabel = "";

            HomeStore.update(state => {
                const load =
                    state.laundry
                        ?.activeLoads
                        ?.find(
                            item =>
                                item.id ===
                                loadId
                        );

                if (!load) {
                    return;
                }

                const currentIndex =
                    this.LAUNDRY_STAGES
                        .indexOf(
                            load.stage
                        );

                const nextStage =
                    this.LAUNDRY_STAGES[
                        currentIndex + 1
                    ];

                if (!nextStage) {
                    return;
                }

                const now =
                    new Date()
                        .toISOString();

                load.stage =
                    nextStage;

                load.stageUpdatedAt =
                    now;

                load.status =
                    [
                        "fold",
                        "put-away"
                    ]
                        .includes(
                            nextStage
                        )
                        ? "NEEDS YOU"
                        : "ACTIVE";

                if (
                    !load.stageHistory ||
                    typeof load.stageHistory !==
                        "object"
                ) {
                    load.stageHistory = {};
                }

                load.stageHistory[
                    nextStage
                ] = now;

                loadName =
                    load.name ||
                    "Laundry Load";

                nextLabel =
                    this.laundryStageLabel(
                        nextStage
                    );
            });

            if (loadName) {
                HomeApp.toast(
                    `${loadName} moved to ${nextLabel}.`
                );
            }
        },

        completeLaundryLoad(loadId) {
            let completedName = "";

            HomeStore.update(state => {
                const loads =
                    state.laundry
                        ?.activeLoads;

                if (!Array.isArray(loads)) {
                    return;
                }

                const index =
                    loads.findIndex(
                        load =>
                            load.id ===
                            loadId
                    );

                if (index === -1) {
                    return;
                }

                const load =
                    loads[index];

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

                load.durationMs =
                    new Date(
                        completedAt
                    ).getTime() -
                    new Date(
                        load.startedAt
                    ).getTime();

                if (
                    load.scheduleId &&
                    Array.isArray(
                        state.laundry.weeklySchedule
                    )
                ) {
                    const scheduled =
                        state.laundry
                            .weeklySchedule
                            .find(
                                item =>
                                    item.id ===
                                    load.scheduleId
                            );

                    if (scheduled) {
                        if (
                            !Array.isArray(
                                scheduled.completedWeeks
                            )
                        ) {
                            scheduled.completedWeeks = [];
                        }

                        if (
                            typeof HomeStore.getLaundryWeekKey ===
                            "function"
                        ) {
                            const weekKey =
                                HomeStore
                                    .getLaundryWeekKey();

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
                }

                if (
                    !Array.isArray(
                        state.laundry.history
                    )
                ) {
                    state.laundry.history = [];
                }

                state.laundry.history.unshift({
                    ...load
                });

                state.laundry.history =
                    state.laundry.history
                        .slice(
                            0,
                            100
                        );

                state.laundry.activeLoads.splice(
                    index,
                    1
                );

                if (
                    !Array.isArray(
                        state.activity
                    )
                ) {
                    state.activity = [];
                }

                state.activity.unshift({
                    id:
                        `activity-${Date.now()}`,

                    type:
                        "laundry",

                    title:
                        `${load.name} finished`,

                    description:
                        "Laundry was washed, dried, folded and put away.",

                    createdAt:
                        completedAt
                });

                state.activity =
                    state.activity.slice(
                        0,
                        200
                    );

                completedName =
                    load.name ||
                    "Laundry Load";
            });

            if (completedName) {
                HomeApp.toast(
                    `${completedName} is finished and put away.`
                );
            }
        },

        syncLaundryStartTask(state) {
            const task =
                (
                    state.dailyRhythm?.opening ||
                    []
                )
                .find(
                    item =>
                        item.id ===
                        "opening-start-laundry"
                );

            if (!task || task.done) {
                return false;
            }

            const today =
                HomeStore.getLocalDateKey();

            const loads = [
                ...(
                    state.laundry
                        ?.activeLoads ||
                    []
                ),

                ...(
                    state.laundry
                        ?.history ||
                    []
                )
            ];

            const startedToday =
                loads.some(
                    load =>
                        load.startedAt &&
                        this.localDateKeyFromDate(
                            load.startedAt
                        ) ===
                        today
                );

            if (!startedToday) {
                return false;
            }

            HomeStore.update(current => {
                const currentTask =
                    (
                        current.dailyRhythm
                            ?.opening ||
                        []
                    )
                    .find(
                        item =>
                            item.id ===
                            "opening-start-laundry"
                    );

                if (
                    currentTask &&
                    !currentTask.done
                ) {
                    currentTask.done =
                        true;

                    currentTask.completedAt =
                        new Date()
                            .toISOString();
                }
            });

            return true;
        },

        localDateKeyFromDate(value) {
            const date =
                new Date(value);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "";
            }

            return [
                date.getFullYear(),

                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                ),

                String(
                    date.getDate()
                ).padStart(
                    2,
                    "0"
                )
            ].join("-");
        },

        laundryStageLabel(stage) {
            if (
                typeof HomeApp.laundryStageLabel ===
                "function"
            ) {
                return HomeApp.laundryStageLabel(
                    stage
                );
            }

            return {
                wash: "Wash",
                dry: "Dry",
                fold: "Fold",
                "put-away": "Put Away"
            }[stage] || "Wash";
        },

        /* ============================================================
           TODAY SHOPPING
        ============================================================ */

        renderShopping(state) {
            const container =
                document.getElementById(
                    "dailyShoppingList"
                );

            if (!container) {
                return;
            }

            const list =
                Array.isArray(
                    state.dailyRhythm
                        ?.shoppingList
                )
                    ? state.dailyRhythm.shoppingList
                    : [];

            const openItems =
                list.filter(
                    item =>
                        !item.done
                );

            this.setText(
                "dailyShoppingCount",

                `${openItems.length} ITEM${
                    openItems.length === 1
                        ? ""
                        : "S"
                }`
            );

            if (!list.length) {
                container.innerHTML = `
                    <div class="daily-shopping-empty">
                        <span>◇</span>

                        <strong>
                            Nothing to pick up yet.
                        </strong>

                        <p>
                            Add something the moment you think of it.
                        </p>
                    </div>
                `;

                return;
            }

            const sorted = [
                ...list.filter(
                    item =>
                        !item.done
                ),

                ...list.filter(
                    item =>
                        item.done
                )
            ];

            container.innerHTML =
                sorted
                    .map(item => {
                        const safeId =
                            HomeApp.escapeHtml(
                                item.id
                            );

                        const safeTitle =
                            HomeApp.escapeHtml(
                                item.title
                            );

                        return `
                            <div
                                class="
                                    daily-shopping-row
                                    ${item.done ? "done" : ""}
                                "
                            >
                                <input
                                    type="checkbox"

                                    id="shopping-${safeId}"

                                    data-shopping-check="${safeId}"

                                    ${item.done ? "checked" : ""}
                                >

                                <label for="shopping-${safeId}">
                                    <strong>
                                        ${safeTitle}
                                    </strong>

                                    ${
                                        item.carriedFrom &&
                                        !item.done

                                            ? "<span>CARRIED FORWARD</span>"

                                            : ""
                                    }
                                </label>

                                <button
                                    type="button"

                                    data-remove-shopping="${safeId}"

                                    aria-label="Remove ${safeTitle}"
                                >
                                    ×
                                </button>
                            </div>
                        `;
                    })
                    .join("");
        },

        addShoppingItem() {
            const input =
                document.getElementById(
                    "newShoppingItem"
                );

            if (!input) {
                return;
            }

            const title =
                input.value.trim();

            if (!title) {
                HomeApp.toast(
                    "Type an item before adding it."
                );

                input.focus();
                return;
            }

            const today =
                HomeStore.getLocalDateKey();

            HomeStore.update(state => {
                if (
                    !Array.isArray(
                        state.dailyRhythm
                            .shoppingList
                    )
                ) {
                    state.dailyRhythm.shoppingList = [];
                }

                state.dailyRhythm.shoppingDate =
                    today;

                state.dailyRhythm.shoppingList.push({
                    id:
                        this.makeId(
                            "daily-shopping"
                        ),

                    title,

                    done:
                        false,

                    completedAt:
                        null,

                    createdDate:
                        today,

                    dayDate:
                        today,

                    carriedFrom:
                        null
                });
            });

            input.value = "";
            input.focus();

            HomeApp.toast(
                `${title} added to today's shopping list.`
            );
        },

        toggleShoppingItem(itemId) {
            HomeStore.update(state => {
                const item =
                    (
                        state.dailyRhythm
                            .shoppingList ||
                        []
                    )
                    .find(
                        value =>
                            value.id ===
                            itemId
                    );

                if (!item) {
                    return;
                }

                item.done =
                    !item.done;

                item.completedAt =
                    item.done
                        ? new Date()
                            .toISOString()
                        : null;
            });
        },

        removeShoppingItem(itemId) {
            HomeStore.update(state => {
                state.dailyRhythm.shoppingList =
                    (
                        state.dailyRhythm
                            .shoppingList ||
                        []
                    )
                    .filter(
                        item =>
                            item.id !==
                            itemId
                    );
            });

            HomeApp.toast(
                "Shopping item removed."
            );
        },

        /* ============================================================
           SHIFT + FORM STATE
        ============================================================ */

        selectShift(shift) {
            if (
                ![
                    "opening",
                    "closing"
                ].includes(
                    shift
                )
            ) {
                return;
            }

            this.selectedShift =
                shift;

            this.openAreas.clear();

            HomeStore.setRhythmShift(
                shift
            );
        },

        renderAddTaskState() {
            this.setText(
                "addTaskShiftLabel",

                this.selectedShift ===
                    "opening"

                    ? "Opening"

                    : "Closing"
            );
        },

        /* ============================================================
           EVENTS
        ============================================================ */

        bindEvents() {
            document.addEventListener(
                "click",
                event => {
                    const shiftButton =
                        event.target.closest(
                            "[data-daily-shift]"
                        );

                    if (shiftButton) {
                        this.selectShift(
                            shiftButton.dataset
                                .dailyShift
                        );

                        return;
                    }

                    const areaButton =
                        event.target.closest(
                            "[data-area-toggle]"
                        );

                    if (areaButton) {
                        const area =
                            areaButton.dataset
                                .areaToggle;

                        this.openAreas.has(
                            area
                        )
                            ? this.openAreas.delete(
                                area
                              )

                            : this.openAreas.add(
                                area
                              );

                        this.renderAreas(
                            HomeStore.getState()
                        );

                        return;
                    }

                    if (
                        event.target.closest(
                            "#addDailyTaskButton"
                        )
                    ) {
                        this.addCustomTask();
                        return;
                    }

                    const removeTask =
                        event.target.closest(
                            "[data-remove-daily-task]"
                        );

                    if (removeTask) {
                        this.removeCustomTask(
                            removeTask.dataset
                                .removeDailyTask
                        );

                        return;
                    }

                    const laundryAction =
                        event.target.closest(
                            "#dailyLaundryActionButton"
                        );

                    if (laundryAction) {
                        const action =
                            laundryAction.dataset
                                .laundryAction;

                        const loadId =
                            laundryAction.dataset
                                .loadId;

                        if (
                            action ===
                            "start"
                        ) {
                            this.openLaundryDialog();
                        }

                        else if (
                            action ===
                                "advance" &&
                            loadId
                        ) {
                            this.advanceLaundryLoad(
                                loadId
                            );
                        }

                        else if (
                            action ===
                                "complete" &&
                            loadId
                        ) {
                            this.completeLaundryLoad(
                                loadId
                            );
                        }

                        return;
                    }

                    if (
                        event.target.closest(
                            "#dailyLaundryNewLoadButton"
                        )
                    ) {
                        this.openLaundryDialog();
                        return;
                    }

                    if (
                        event.target.closest(
                            "#dailyLaundryStartButton"
                        )
                    ) {
                        this.startLaundryLoad();
                        return;
                    }

                    if (
                        event.target.closest(
                            "#dailyLaundryCancelButton"
                        ) ||

                        event.target.closest(
                            "#dailyLaundryCancelButtonSecondary"
                        )
                    ) {
                        this.closeLaundryDialog();
                        return;
                    }

                    if (
                        event.target.closest(
                            "#addShoppingItemButton"
                        )
                    ) {
                        this.addShoppingItem();
                        return;
                    }

                    const removeShopping =
                        event.target.closest(
                            "[data-remove-shopping]"
                        );

                    if (removeShopping) {
                        this.removeShoppingItem(
                            removeShopping.dataset
                                .removeShopping
                        );
                    }
                }
            );

            document.addEventListener(
                "change",
                event => {
                    const taskCheckbox =
                        event.target.closest(
                            "[data-daily-task]"
                        );

                    if (taskCheckbox) {
                        this.toggleTask(
                            taskCheckbox.dataset
                                .dailyTask
                        );

                        return;
                    }

                    const shoppingCheckbox =
                        event.target.closest(
                            "[data-shopping-check]"
                        );

                    if (shoppingCheckbox) {
                        this.toggleShoppingItem(
                            shoppingCheckbox.dataset
                                .shoppingCheck
                        );
                    }
                }
            );

            document
                .getElementById(
                    "newDailyTask"
                )
                ?.addEventListener(
                    "keydown",
                    event => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            event.preventDefault();

                            this.addCustomTask();
                        }
                    }
                );

            document
                .getElementById(
                    "newShoppingItem"
                )
                ?.addEventListener(
                    "keydown",
                    event => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            event.preventDefault();

                            this.addShoppingItem();
                        }
                    }
                );

            document
                .getElementById(
                    "dailyLaundryName"
                )
                ?.addEventListener(
                    "keydown",
                    event => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            event.preventDefault();

                            this.startLaundryLoad();
                        }
                    }
                );

            document
                .getElementById(
                    "dailyLaundryDialog"
                )
                ?.addEventListener(
                    "click",
                    event => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            this.closeLaundryDialog();
                        }
                    }
                );
        },

        /* ============================================================
           HELPERS
        ============================================================ */

        shiftName(shift) {
            return shift ===
                "closing"
                ? "Closing Shift"
                : "Opening Shift";
        },

        areaName(area) {
            return area ===
                "upstairs"
                ? "Upstairs"
                : "Downstairs";
        },

        setText(id, value) {
            const element =
                document.getElementById(
                    id
                );

            if (element) {
                element.textContent =
                    value;
            }
        },

        setBarWidth(id, percent) {
            const bar =
                document.getElementById(
                    id
                );

            if (!bar) {
                return;
            }

            const value =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(percent) ||
                        0
                    )
                );

            bar.style.width =
                `${value}%`;
        },

        makeId(prefix) {
            if (
                typeof crypto !==
                    "undefined" &&
                typeof crypto.randomUUID ===
                    "function"
            ) {
                return(
                    `${prefix}-${crypto.randomUUID()}`
                );
            }

            return(
                `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
            );
        }
    };

    window.DailyApp =
        DailyApp;

    DailyApp.init();
});