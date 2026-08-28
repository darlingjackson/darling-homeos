/* ================================================================
   DARLING HOMEOS
   SEASONAL HUB CONTROLLER

   FILE:
   assets/js/seasonal-hub.js

   LANDING PAGE ONLY.

   seasonal.js remains the shared Seasonal engine.
   This file adds calendar-cycle intelligence to seasonal.html.

   NO DIRECT localStorage.
   NO DUPLICATE SEASONAL MEMORY.
================================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        "use strict";


        const SeasonalHub = {

            SEASON_ORDER: [

                "spring",
                "summer",
                "fall",
                "winter"

            ],


            SEASONS: {

                spring: {

                    name:
                        "Spring Renewal",

                    short:
                        "SP",

                    range:
                        "MAR 01 — MAY 31",

                    accent:
                        "#65cf8c",

                    accentTwo:
                        "#b08cf3"

                },


                summer: {

                    name:
                        "Summer Reset",

                    short:
                        "SU",

                    range:
                        "JUN 01 — AUG 31",

                    accent:
                        "#2bc9d3",

                    accentTwo:
                        "#f0bd47"

                },


                fall: {

                    name:
                        "Fall Refresh",

                    short:
                        "FA",

                    range:
                        "SEP 01 — NOV 30",

                    accent:
                        "#dc7b3f",

                    accentTwo:
                        "#b6506c"

                },


                winter: {

                    name:
                        "Winter Reset",

                    short:
                        "WI",

                    range:
                        "DEC 01 — FEB 28/29",

                    accent:
                        "#72bde9",

                    accentTwo:
                        "#4fc7b0"

                }

            },


            clockTimer:
                null,


            currentSeason:
                null,


            nextSeason:
                null,


            /* ====================================================
               START
            ==================================================== */

            init() {

                if (
                    document.body
                        .dataset
                        .seasonalView !==
                    "hub"
                ) {

                    return;

                }


                this.renderClock();

                this.renderCalendarCycle();

                this.renderState();

                this.bindStateEvents();

                this.startClock();

            },


            /* ====================================================
               LIVE CLOCK
            ==================================================== */

            startClock() {

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

                            const before =
                                this.currentSeason;


                            this.renderClock();


                            const detected =
                                this.detectCalendarSeason(
                                    new Date()
                                );


                            /*
                               If midnight moves HomeOS into a new
                               season while this screen is open,
                               redraw automatically.
                            */

                            if (
                                detected !==
                                before
                            ) {

                                this.renderCalendarCycle();

                                this.renderState();

                            }

                        },
                        1000
                    );

            },


            renderClock() {

                const now =
                    new Date();


                this.setText(

                    "seasonalDateLarge",

                    now
                        .toLocaleDateString(
                            "en-US",
                            {
                                month:
                                    "short",

                                day:
                                    "2-digit",

                                year:
                                    "numeric"
                            }
                        )
                        .toUpperCase()

                );


                this.setText(

                    "seasonalDayLabel",

                    now
                        .toLocaleDateString(
                            "en-US",
                            {
                                weekday:
                                    "long"
                            }
                        )
                        .toUpperCase()

                );


                this.setText(

                    "seasonalTimeLarge",

                    now
                        .toLocaleTimeString(
                            "en-US",
                            {
                                hour:
                                    "numeric",

                                minute:
                                    "2-digit",

                                second:
                                    "2-digit"
                            }
                        )
                        .toUpperCase()

                );

            },


            /* ====================================================
               HOMEOS SEASON CALENDAR

               HOME CARE CYCLES:

               SPRING
               MAR 01 — MAY 31

               SUMMER
               JUN 01 — AUG 31

               FALL
               SEP 01 — NOV 30

               WINTER
               DEC 01 — FEB 28/29
            ==================================================== */

            detectCalendarSeason(
                date
            ) {

                const month =
                    date.getMonth() +
                    1;


                if (
                    month >=
                        3 &&

                    month <=
                        5
                ) {

                    return "spring";

                }


                if (
                    month >=
                        6 &&

                    month <=
                        8
                ) {

                    return "summer";

                }


                if (
                    month >=
                        9 &&

                    month <=
                        11
                ) {

                    return "fall";

                }


                return "winter";

            },


            getNextSeason(
                seasonId
            ) {

                const index =
                    this.SEASON_ORDER
                        .indexOf(
                            seasonId
                        );


                return this.SEASON_ORDER[

                    (
                        index +
                        1
                    ) %

                    this.SEASON_ORDER
                        .length

                ];

            },


            getNextSeasonStart(
                now,
                currentSeason
            ) {

                const year =
                    now.getFullYear();


                if (
                    currentSeason ===
                    "spring"
                ) {

                    return new Date(

                        year,
                        5,
                        1,
                        0,
                        0,
                        0,
                        0

                    );

                }


                if (
                    currentSeason ===
                    "summer"
                ) {

                    return new Date(

                        year,
                        8,
                        1,
                        0,
                        0,
                        0,
                        0

                    );

                }


                if (
                    currentSeason ===
                    "fall"
                ) {

                    return new Date(

                        year,
                        11,
                        1,
                        0,
                        0,
                        0,
                        0

                    );

                }


                /*
                   WINTER CROSSES THE YEAR.

                   JAN / FEB
                   → SPRING STARTS THIS YEAR.

                   DECEMBER
                   → SPRING STARTS NEXT YEAR.
                */

                const springYear =

                    now.getMonth() <=
                    1

                        ? year

                        : year +
                          1;


                return new Date(

                    springYear,
                    2,
                    1,
                    0,
                    0,
                    0,
                    0

                );

            },


            getDaysUntil(
                futureDate,
                now =
                    new Date()
            ) {

                const milliseconds =

                    futureDate
                        .getTime() -

                    now
                        .getTime();


                return Math.max(

                    0,

                    Math.ceil(

                        milliseconds /
                        86400000

                    )

                );

            },


            /* ====================================================
               CURRENT + NEXT SEASON
            ==================================================== */

            renderCalendarCycle() {

                const now =
                    new Date();


                const current =
                    this.detectCalendarSeason(
                        now
                    );


                const next =
                    this.getNextSeason(
                        current
                    );


                const currentIdentity =
                    this.SEASONS[
                        current
                    ];


                const nextIdentity =
                    this.SEASONS[
                        next
                    ];


                const nextStart =
                    this.getNextSeasonStart(
                        now,
                        current
                    );


                const daysUntilNext =
                    this.getDaysUntil(
                        nextStart,
                        now
                    );


                this.currentSeason =
                    current;


                this.nextSeason =
                    next;


                document.body
                    .dataset
                    .currentSeason =
                    current;


                /*
                   THE ENTIRE HUB ATMOSPHERE FOLLOWS
                   THE REAL CURRENT SEASON.
                */

                document.body
                    .style
                    .setProperty(

                        "--hub-current-accent",

                        currentIdentity
                            .accent

                    );


                document.body
                    .style
                    .setProperty(

                        "--hub-current-accent-two",

                        currentIdentity
                            .accentTwo

                    );


                this.setText(

                    "currentSeasonName",

                    currentIdentity.name

                );


                this.setText(

                    "currentSeasonSymbol",

                    currentIdentity.short

                );


                this.setText(

                    "currentSeasonRange",

                    currentIdentity.range

                );


                this.setText(

                    "nextSeasonName",

                    nextIdentity.name

                );


                this.setText(

                    "nextSeasonDate",

                    nextStart
                        .toLocaleDateString(
                            "en-US",
                            {
                                month:
                                    "short",

                                day:
                                    "2-digit"
                            }
                        )
                        .toUpperCase()

                );


                this.setText(

                    "currentSeasonDaysRemaining",

                    daysUntilNext ===
                    1

                        ? "1 DAY"

                        : `${daysUntilNext} DAYS`

                );


                const currentLink =
                    document.getElementById(
                        "currentSeasonOpenLink"
                    );


                if (
                    currentLink
                ) {

                    currentLink.href =
                        `seasons/${current}.html`;


                    currentLink.textContent =

                        `Open ${currentIdentity.name} →`;

                }


                this.renderNavigationState(

                    current,
                    next,
                    daysUntilNext

                );


                this.renderGuide(

                    current,
                    next,
                    daysUntilNext

                );

            },


            /* ====================================================
               LIVE HOMESTORE PROGRESS
            ==================================================== */

            bindStateEvents() {

                window.addEventListener(
                    "homeos:statechange",
                    () => {

                        this.renderState();

                        /*
                           The guide uses progress too.
                        */

                        if (
                            this.currentSeason &&
                            this.nextSeason
                        ) {

                            const now =
                                new Date();


                            const nextStart =
                                this.getNextSeasonStart(
                                    now,
                                    this.currentSeason
                                );


                            this.renderGuide(

                                this.currentSeason,

                                this.nextSeason,

                                this.getDaysUntil(
                                    nextStart,
                                    now
                                )

                            );

                        }

                    }
                );

            },


            renderState() {

                const state =
                    HomeStore.getState();


                const seasons =
                    state.seasonal
                        ?.seasons ||
                    {};


                /*
                   ALL FOUR NAVIGATION PROGRESS VALUES.
                */

                this.SEASON_ORDER
                    .forEach(
                        seasonId => {

                            const progress =
                                this.clampProgress(

                                    seasons[
                                        seasonId
                                    ]?.progress

                                );


                            this.setText(

                                `${seasonId}HubProgress`,

                                `${progress}%`

                            );


                            const bar =
                                document.querySelector(

                                    `[data-season-progress-bar="${seasonId}"]`

                                );


                            if (
                                bar
                            ) {

                                bar.style.width =
                                    `${progress}%`;

                            }

                        }
                    );


                /*
                   CURRENT SEASON CORE.
                */

                const currentProgress =
                    this.clampProgress(

                        seasons[
                            this.currentSeason
                        ]?.progress

                    );


                this.setText(

                    "currentSeasonProgress",

                    `${currentProgress}%`

                );


                const progressBar =
                    document.getElementById(
                        "currentSeasonProgressBar"
                    );


                if (
                    progressBar
                ) {

                    progressBar.style.width =
                        `${currentProgress}%`;

                }


                const ring =
                    document.getElementById(
                        "currentSeasonRing"
                    );


                if (
                    ring
                ) {

                    ring.style
                        .setProperty(

                            "--current-season-progress-angle",

                            `${Math.round(
                                currentProgress *
                                3.6
                            )}deg`

                        );

                }

            },


            /* ====================================================
               FOUR-SEASON NAV
            ==================================================== */

            renderNavigationState(
                current,
                next,
                daysUntilNext
            ) {

                document
                    .querySelectorAll(
                        "[data-hub-season]"
                    )
                    .forEach(
                        link => {

                            const seasonId =
                                link.dataset
                                    .hubSeason;


                            const isCurrent =

                                seasonId ===
                                current;


                            const isNext =

                                seasonId ===
                                next;


                            link.classList
                                .toggle(

                                    "is-current",

                                    isCurrent

                                );


                            link.classList
                                .toggle(

                                    "is-next",

                                    isNext &&
                                    !isCurrent

                                );


                            if (
                                isCurrent
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


                            const status =
                                document.querySelector(

                                    `[data-season-state="${seasonId}"]`

                                );


                            if (
                                !status
                            ) {

                                return;

                            }


                            if (
                                isCurrent
                            ) {

                                status.textContent =
                                    "CURRENT";

                            }


                            else if (
                                isNext
                            ) {

                                status.textContent =

                                    daysUntilNext <=
                                    14

                                        ? `UP NEXT · ${daysUntilNext}D`

                                        : "UP NEXT";

                            }


                            else {

                                status.textContent =
                                    "CYCLE";

                            }

                        }
                    );

            },


            /* ====================================================
               SEASONAL GUIDE
            ==================================================== */

            renderGuide(
                current,
                next,
                daysUntilNext
            ) {

                const state =
                    HomeStore.getState();


                const currentIdentity =
                    this.SEASONS[
                        current
                    ];


                const nextIdentity =
                    this.SEASONS[
                        next
                    ];


                const currentProgress =
                    this.clampProgress(

                        state.seasonal
                            ?.seasons
                            ?.[
                                current
                            ]
                            ?.progress

                    );


                const guideAction =
                    document.getElementById(
                        "seasonalGuideAction"
                    );


                /*
                   WHEN THE NEXT CYCLE IS WITHIN
                   TWO WEEKS, HOMEOS BECOMES PROACTIVE.

                   THIS MEANS FALL/WINTER PREP CAN BEGIN
                   BEFORE THE CALENDAR ACTUALLY FLIPS.
                */

                if (
                    daysUntilNext <=
                    14
                ) {

                    this.setText(

                        "seasonalGuideStatus",

                        "PREP WINDOW"

                    );


                    this.setText(

                        "seasonalGuideMessage",

                        `${nextIdentity.name} begins in ${daysUntilNext} day${daysUntilNext === 1 ? "" : "s"}. You can open it early and begin preparing the home before the cycle changes.`

                    );


                    if (
                        guideAction
                    ) {

                        guideAction.href =
                            `seasons/${next}.html`;


                        guideAction.textContent =

                            `PREP ${nextIdentity.name.toUpperCase()} →`;

                    }


                    return;

                }


                /*
                   CURRENT SEASON STILL HAS WORK.
                */

                if (
                    currentProgress <
                    100
                ) {

                    this.setText(

                        "seasonalGuideStatus",

                        "CURRENT CYCLE"

                    );


                    this.setText(

                        "seasonalGuideMessage",

                        `${currentIdentity.name} is ${currentProgress}% complete. HomeOS will keep your unfinished seasonal work waiting exactly where you left it.`

                    );


                    if (
                        guideAction
                    ) {

                        guideAction.href =
                            `seasons/${current}.html`;


                        guideAction.textContent =

                            `CONTINUE ${currentIdentity.name.toUpperCase()} →`;

                    }


                    return;

                }


                /*
                   CURRENT SEASON COMPLETE.
                */

                this.setText(

                    "seasonalGuideStatus",

                    "CYCLE COMPLETE"

                );


                this.setText(

                    "seasonalGuideMessage",

                    `${currentIdentity.name} is complete. The next HomeOS cycle is ${nextIdentity.name}.`

                );


                if (
                    guideAction
                ) {

                    guideAction.href =
                        `seasons/${next}.html`;


                    guideAction.textContent =

                        `VIEW ${nextIdentity.name.toUpperCase()} →`;

                }

            },


            /* ====================================================
               HELPERS
            ==================================================== */

            clampProgress(
                value
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

                    return 0;

                }


                return Math.max(

                    0,

                    Math.min(

                        100,

                        Math.round(
                            number
                        )

                    )

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


        window.SeasonalHub =
            SeasonalHub;


        SeasonalHub.init();

    }
);