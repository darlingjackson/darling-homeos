/* DARLING HomeOS
   assets/js/season-detail.js

   ONE SEASONAL DETAIL SKELETON.
   ONE VIEW CONFIG.
   FOUR SEASONAL PERSONALITIES.

   seasonal.js still owns:
   - HomeStore
   - tasks
   - progress
   - custom tasks
   - shopping
   - completion
*/

(() => {
    "use strict";

    const CONFIG = {

        spring: {
            pageName: "Spring Renewal",

            systemKicker:
                "SPRING HOME CARE // RENEWAL CYCLE ONLINE",

            headline:
                'Let the home<br>feel <em>new again.</em>',

            heroMessage:
                "Refresh, release and reset the home after winter.",

            guideLabel:
                "SPRING GUIDE // ACTIVE",

            guideMessage:
                "HomeOS is reading your Spring Renewal.",

            guideAction:
                "CONTINUE SPRING RENEWAL →",

            cycleLabel:
                "SPRING CYCLE",

            cycleWindowLabel:
                "HOMEOS SPRING WINDOW",

            cycleWindow:
                "MAR 01 — MAY 31",

            cycleRule:
                "Spring uses the same detailed HomeOS reset standard, then adds decluttering, lighter textiles, fresh-air preparation and warm-weather transitions.",

            shoppingMetric:
                "SPRING SHOPPING",

            progressMetric:
                "SPRING RENEWAL",

            designLabel:
                "SPRING DESIGN CODE",

            designCopy:
                "Fresh air. Soft petals. New growth. Clear spaces.",

            palette: [
                ["BLOSSOM", "#f6c9d9"],
                ["MINT", "#8fcab7"],
                ["DEW", "#b9dedf"],
                ["LILAC", "#eee7f5"],
                ["SAGE", "#a8ba8d"],
                ["IVORY", "#fffaf4"]
            ],

            topologyLabel:
                "SPRING TOPOLOGY // 09 HOME ZONES",

            topologyCopy:
                "Every Spring zone uses the same detailed HomeOS deep-reset standard. Spring then adds decluttering, lighter seasonal systems, fresh air and the transition out of winter.",

            workspaceNote:
                "Open one reset protocol at a time. Deep clean, declutter and organize first. Spring styling and lighter seasonal changes come after the room is functional again.",

            ruleLabel:
                "SPRING RULE",

            ruleTitle:
                "Release first. Clean deeply. Bring back only what belongs.",

            ruleCopy:
                "Spring is the season to remove buildup—physical and visual—before adding fresh textiles, greenery or seasonal decor.",

            shoppingKicker:
                "SPRING STYLING // SHARED HOMEOS SHOPPING",

            shoppingHeading:
                "Bring back only what makes the home lighter.",

            shoppingCopy:
                "Add lighter linens, storage solutions, curtains, organizers, outdoor-prep supplies and Spring decor. Everything joins the shared HomeOS Shopping List.",

            shoppingEntryTitle:
                "Spring Home + Renewal",

            shoppingEntryCopy:
                "Think fresh ivory, blossom pink, sage, soft greenery, glass, woven textures and only the organization the reset proves you need.",

            shoppingPlaceholder:
                "Example: Soft sage linen pillow covers",

            plannedLabel:
                "SPRING RENEWAL // PLANNED",

            plannedTitle:
                "Current Spring List",

            completionLabel:
                "HOME MEMORY // SPRING CYCLE",

            completionTitle:
                "Close the Spring Renewal.",

            completionMessage:
                "Finish the Spring Renewal checklist before completing this cycle.",

            completionButton:
                "Complete Spring Renewal",

            mascot:
                "assets/images/branding/spring-mascot.png",

            mascotAlt:
                "DARLING HomeOS Spring mascot"
        },


        summer: {
            pageName: "Summer Reset",

            systemKicker:
                "SUMMER HOME CARE // SUN CYCLE ONLINE",

            headline:
                'Let the home<br>breathe <em>summer.</em>',

            heroMessage:
                "Keep the home light, functional and ready for summer living.",

            guideLabel:
                "SUMMER GUIDE // ACTIVE",

            guideMessage:
                "HomeOS is reading your Summer Reset.",

            guideAction:
                "CONTINUE SUMMER RESET →",

            cycleLabel:
                "SUMMER CYCLE",

            cycleWindowLabel:
                "HOMEOS SUMMER WINDOW",

            cycleWindow:
                "JUN 01 — AUG 31",

            cycleRule:
                "Deep reset first. Then HomeOS shifts the house toward lighter routines, outdoor living, cool storage and easy summer hosting.",

            shoppingMetric:
                "SUMMER SHOPPING",

            progressMetric:
                "SUMMER RESET",

            designLabel:
                "SUMMER DESIGN CODE",

            designCopy:
                "Pool water. Pink resort towels. Citrus. Sunshine.",

            palette: [
                ["AQUA", "#56dce1"],
                ["RESORT PINK", "#ef73ba"],
                ["LEMON", "#f4d85b"],
                ["IVORY", "#fff9ef"],
                ["CORAL", "#f1a58f"],
                ["PALM", "#82ae83"]
            ],

            topologyLabel:
                "SUMMER TOPOLOGY // 09 HOME ZONES",

            topologyCopy:
                "The same detailed HomeOS reset lives underneath every season. Summer adds lighter textiles, warm-weather storage, outdoor living and easy entertaining after the functional reset.",

            workspaceNote:
                "Open one reset protocol at a time. Finish the real cleaning and organization first. Summer styling becomes the final light, colorful layer.",

            ruleLabel:
                "SUMMER RULE",

            ruleTitle:
                "Clear it. Cool it. Lighten it. Enjoy it.",

            ruleCopy:
                "Summer should make the home easier to live in: open surfaces, cold drinks, lighter textiles and outdoor spaces that are actually ready to use.",

            shoppingKicker:
                "SUMMER STYLING // SHARED HOMEOS SHOPPING",

            shoppingHeading:
                "Brighten the house without filling it up.",

            shoppingCopy:
                "Add summer linens, beverage supplies, outdoor pieces, coolers, storage and decor here. Everything still feeds the single shared HomeOS Shopping List.",

            shoppingEntryTitle:
                "Summer Home + Hosting",

            shoppingEntryCopy:
                "Think aqua glass, resort pink, citrus, beautiful woven textures, fresh greenery and useful warm-weather pieces.",

            shoppingPlaceholder:
                "Example: Aqua outdoor drink pitcher",

            plannedLabel:
                "SUMMER RESET // PLANNED",

            plannedTitle:
                "Current Summer List",

            completionLabel:
                "HOME MEMORY // SUMMER CYCLE",

            completionTitle:
                "Close the Summer Reset.",

            completionMessage:
                "Finish the Summer Reset checklist before completing this cycle.",

            completionButton:
                "Complete Summer Reset",

            mascot:
                "assets/images/branding/summer-mascot.png",

            mascotAlt:
                "DARLING HomeOS Summer mascot"
        },


        fall: {
            pageName: "Fall Refresh",

            systemKicker:
                "AUTUMN HOME CARE // FALL CYCLE ONLINE",

            headline:
                'Settle the home<br>into <em>fall.</em>',

            heroMessage:
                "Prepare the home for cooler weather, gathering and cozy living.",

            guideLabel:
                "FALL GUIDE // ACTIVE",

            guideMessage:
                "HomeOS is reading your Fall Refresh.",

            guideAction:
                "CONTINUE FALL REFRESH →",

            cycleLabel:
                "FALL CYCLE",

            cycleWindowLabel:
                "HOMEOS FALL WINDOW",

            cycleWindow:
                "SEP 01 — NOV 30",

            cycleRule:
                "Every season uses the same detailed HomeOS deep-reset standard. Fall adds its own cozy-home, hosting and decor protocol after the functional reset is complete.",

            shoppingMetric:
                "FALL SHOPPING",

            progressMetric:
                "FALL REFRESH",

            designLabel:
                "FALL DESIGN CODE",

            designCopy:
                "Cozy. Tailored. Warm. Never Halloween-store orange.",

            palette: [
                ["ESPRESSO", "#34231f"],
                ["BURGUNDY", "#6b3040"],
                ["CHESTNUT", "#74472f"],
                ["BURNT SIENNA", "#a7613d"],
                ["MUTED OLIVE", "#55604a"],
                ["WARM CREAM", "#eee4da"]
            ],

            topologyLabel:
                "AUTUMN TOPOLOGY // 09 HOME ZONES",

            topologyCopy:
                "Choose one HomeOS zone. Every zone uses the same detailed deep-reset standard every season, then receives a smaller Fall-specific layer.",

            workspaceNote:
                "Open one reset section at a time. The full list can be extremely detailed without becoming one overwhelming wall of checkboxes. Complete the deep reset first; Fall styling is the final layer.",

            ruleLabel:
                "FALL RULE",

            ruleTitle:
                "Clean first. Organize second. Style last.",

            ruleCopy:
                "Fall decor should finish the room—not hide unfinished cleaning or create another layer of clutter.",

            shoppingKicker:
                "FALL STYLING // SHARED HOMEOS SHOPPING",

            shoppingHeading:
                "Warm the home without creating clutter.",

            shoppingCopy:
                "Add Fall textiles, hosting pieces, storage and decor here. Everything still joins the single shared HomeOS Shopping List.",

            shoppingEntryTitle:
                "Fall Decor + Home Prep",

            shoppingEntryCopy:
                "Buy only what the reset proves the house needs. Keep the palette warm, sophisticated and useful beyond one holiday whenever possible.",

            shoppingPlaceholder:
                "Example: Burgundy velvet pillow covers",

            plannedLabel:
                "FALL REFRESH // PLANNED",

            plannedTitle:
                "Current Fall List",

            completionLabel:
                "HOME MEMORY // FALL CYCLE",

            completionTitle:
                "Close the Fall Refresh.",

            completionMessage:
                "Finish the Fall Refresh checklist before completing this cycle.",

            completionButton:
                "Complete Fall Refresh",

            mascot:
                "assets/images/branding/fall-mascot.png",

            mascotAlt:
                "DARLING HomeOS Fall mascot"
        },


        winter: {
            pageName: "Winter Reset",

            systemKicker:
                "WINTER HOME CARE // SNOW CYCLE ONLINE",

            headline:
                'Wrap the home<br>in <em>winter.</em>',

            heroMessage:
                "Protect, warm and prepare the home for winter and the Christmas season.",

            guideLabel:
                "WINTER GUIDE // ACTIVE",

            guideMessage:
                "HomeOS is reading your Winter Reset.",

            guideAction:
                "CONTINUE WINTER RESET →",

            cycleLabel:
                "WINTER CYCLE",

            cycleWindowLabel:
                "HOMEOS WINTER WINDOW",

            cycleWindow:
                "DEC 01 — FEB 28/29",

            cycleRule:
                "The shared HomeOS deep reset comes first. Winter then adds warmth, cold-weather preparation, hosting readiness and Christmas operations.",

            shoppingMetric:
                "WINTER SHOPPING",

            progressMetric:
                "WINTER RESET",

            designLabel:
                "WINTER DESIGN CODE",

            designCopy:
                "Cashmere. Snowfall. Candlelight. Christmas magic.",

            palette: [
                ["IVORY", "#fffaf2"],
                ["CASHMERE", "#e9dfd4"],
                ["SNOW", "#ffffff"],
                ["CHAMPAGNE", "#cbb9a3"],
                ["FROST", "#b8d7e7"],
                ["BLUSH", "#d8c5cd"]
            ],

            topologyLabel:
                "WINTER TOPOLOGY // 09 HOME ZONES",

            topologyCopy:
                "The same detailed HomeOS deep-reset standard remains underneath every season. Winter adds cold-weather preparation, comfort and Christmas protocols where they make sense.",

            workspaceNote:
                "Open one reset protocol at a time. Complete the functional deep clean first. Winter comfort, decorating and Christmas preparation come after the room is clean, organized and ready for daily life.",

            ruleLabel:
                "WINTER RULE",

            ruleTitle:
                "Reset first. Warm the room second. Add magic last.",

            ruleCopy:
                "Christmas and winter decor should make a finished room feel magical—not become a way to decorate around unfinished cleaning.",

            shoppingKicker:
                "WINTER STYLING // SHARED HOMEOS SHOPPING",

            shoppingHeading:
                "Warmth, wonder and what the home actually needs.",

            shoppingCopy:
                "Add winter textiles, holiday hosting pieces, Christmas decor, lighting, storage and home-care supplies here. Everything still joins the single HomeOS Shopping List.",

            shoppingEntryTitle:
                "Winter + Christmas",

            shoppingEntryCopy:
                "Keep it polished: snowy whites, creams, soft champagne metals, warm candlelight and just enough Christmas magic.",

            shoppingPlaceholder:
                "Example: Cream velvet Christmas stockings",

            plannedLabel:
                "WINTER RESET // PLANNED",

            plannedTitle:
                "Current Winter List",

            completionLabel:
                "HOME MEMORY // WINTER CYCLE",

            completionTitle:
                "Close the Winter Reset.",

            completionMessage:
                "Finish the Winter Reset checklist before completing this cycle.",

            completionButton:
                "Complete Winter Reset",

            mascot:
                "assets/images/branding/winter-mascot.png",

            mascotAlt:
                "DARLING HomeOS Winter mascot"
        }

    };


    const season =
        document.body.dataset.season;

    const config =
        CONFIG[season];

    const seasonLabel =
        season
            ? season.charAt(0).toUpperCase() +
              season.slice(1)
            : "";

    const root =
        document.getElementById(
            "seasonDetailRoot"
        );


    if (
        !root ||
        !config
    ) {
        return;
    }


    const particles =
        Array.from(
            { length: 16 },

            (_, index) => `
                <span
                    class="
                        season-particle
                        particle-${String(
                            index + 1
                        ).padStart(
                            2,
                            "0"
                        )}
                    "
                ></span>
            `
        )
        .join("");


    const palette =
        config.palette
            .map(
                ([label, color]) => `
                    <span
                        style="--swatch:${color};"
                    >
                        ${label}
                    </span>
                `
            )
            .join("");


    root.innerHTML = `

        <!-- =====================================================
             UNIVERSAL SEASON ATMOSPHERE
        ====================================================== -->

        <div
            class="season-atmosphere"
            aria-hidden="true"
        >

            <div
                class="
                    season-atmosphere-glow
                    season-atmosphere-glow-one
                "
            ></div>

            <div
                class="
                    season-atmosphere-glow
                    season-atmosphere-glow-two
                "
            ></div>

            <div class="season-particle-field">
                ${particles}
            </div>

        </div>


        <!-- =====================================================
             UNIVERSAL COMMAND DECK
        ====================================================== -->

        <section class="season-command-deck">


            <div class="season-command-copy">

                <div class="season-system-kicker">

                    <span class="season-live-dot"></span>

                    ${config.systemKicker}

                </div>


                <h1>
                    ${config.headline}
                </h1>


                <p
                    class="season-command-lead"
                    id="seasonHeroMessage"
                >
                    ${config.heroMessage}
                </p>


                <div class="season-identity-line">

                    <span id="seasonEyebrow">
                        DARLING // ${season.toUpperCase()} HOME CARE
                    </span>

                    <strong id="seasonHeroName">
                        ${config.pageName}
                    </strong>

                </div>


                <div class="season-live-datetime">

                    <article class="season-time-card">

                        <span>
                            CURRENT DATE
                        </span>

                        <strong id="seasonDetailDateLarge">
                            --- --, ----
                        </strong>

                        <small id="seasonDetailDayLabel">
                            ---------
                        </small>

                    </article>


                    <article
                        class="
                            season-time-card
                            season-clock-card
                        "
                    >

                        <span>
                            LOCAL HOME TIME
                        </span>

                        <strong id="seasonDetailTimeLarge">
                            --:--:-- --
                        </strong>

                        <small>
                            LIVE // HOMEOS CLOCK
                        </small>

                    </article>

                </div>


                <div class="season-command-actions">

                    <a
                        class="button button-secondary"
                        href="seasonal.html"
                    >
                        ← All Seasons
                    </a>


                    <button
                        class="button button-primary"
                        type="button"
                        data-begin-season
                    >
                        Enter ${seasonLabel} Workspace →
                    </button>

                </div>

            </div>


            <!-- MASCOT -->

            <aside class="season-mascot-stage">

                <div class="season-mascot-topline">

                    <span>
                        HOMEOS GUIDE
                    </span>

                    <strong id="seasonGuideStatus">
                        ONLINE
                    </strong>

                </div>


                <div
                    class="season-scan-line"
                    aria-hidden="true"
                ></div>


                <div
                    class="
                        season-orbit
                        season-orbit-outer
                    "
                    aria-hidden="true"
                ></div>


                <div
                    class="
                        season-orbit
                        season-orbit-inner
                    "
                    aria-hidden="true"
                ></div>


                <div
                    class="season-mascot-glow"
                    aria-hidden="true"
                ></div>


                <img
                    class="season-mascot"
                    src="${config.mascot}"
                    alt="${config.mascotAlt}"
                >


                <div class="season-guide-message">

                    <span>
                        ${config.guideLabel}
                    </span>

                    <p id="seasonGuideMessage">
                        ${config.guideMessage}
                    </p>

                </div>


                <button
                    class="season-guide-action"
                    id="seasonGuideAction"
                    type="button"
                    data-begin-season
                >
                    ${config.guideAction}
                </button>

            </aside>


            <!-- CYCLE -->

            <aside class="season-cycle-core">

                <div class="season-cycle-head">

                    <div>

                        <span class="ui-kicker">
                            ${config.cycleLabel}
                        </span>

                        <h2>
                            Home Readiness
                        </h2>

                    </div>


                    <span
                        class="season-cycle-state"
                        id="seasonCycleState"
                    >
                        CHECKING
                    </span>

                </div>


                <div class="season-cycle-orbit">

                    <div
                        class="season-progress-ring"
                        id="seasonProgressRing"
                    >

                        <div class="season-progress-ring-center">

                            <strong id="seasonProgressValue">
                                0%
                            </strong>

                            <span id="seasonProgressStatus">
                                READY
                            </span>

                        </div>

                    </div>

                </div>


                <div class="season-cycle-window">

                    <span>
                        ${config.cycleWindowLabel}
                    </span>

                    <strong id="seasonCycleWindow">
                        ${config.cycleWindow}
                    </strong>

                </div>


                <div
                    class="season-cycle-countdown"
                    data-saved-label="${season.toUpperCase()}"
                >

                    <strong id="seasonCycleCountdown">
                        --
                    </strong>

                    <span id="seasonCycleCountdownLabel">
                        CHECKING CYCLE
                    </span>

                </div>


                <div class="season-cycle-rule">
                    ${config.cycleRule}
                </div>

            </aside>

        </section>


        <!-- =====================================================
             TELEMETRY
        ====================================================== -->

        <section class="season-telemetry-grid">

            <article>

                <span>
                    RESET TASKS
                </span>

                <strong id="seasonTasksMetric">
                    0/0
                </strong>

                <small>
                    Completed across all zones
                </small>

            </article>


            <article>

                <span>
                    HOME ZONES
                </span>

                <strong id="seasonZonesMetric">
                    0/9
                </strong>

                <small>
                    Zones fully complete
                </small>

            </article>


            <article>

                <span>
                    ${config.shoppingMetric}
                </span>

                <strong id="seasonShoppingMetric">
                    0
                </strong>

                <small>
                    Seasonal home preparation
                </small>

            </article>


            <article>

                <span>
                    ${config.progressMetric}
                </span>

                <strong id="seasonProgressMetric">
                    0%
                </strong>

                <small>
                    Whole-home progress
                </small>

            </article>

        </section>


        <!-- =====================================================
             UNIVERSAL SEASON NAV
        ====================================================== -->

        <nav
            class="
                season-navigation
                season-detail-nav
            "
            aria-label="Season navigation"
        >

            <a
                href="seasons/spring.html"
                data-season-link="spring"
            >
                <span>01</span>
                <strong>Spring</strong>
                <small>Renewal</small>
            </a>


            <a
                href="seasons/summer.html"
                data-season-link="summer"
            >
                <span>02</span>
                <strong>Summer</strong>
                <small>Reset</small>
            </a>


            <a
                href="seasons/fall.html"
                data-season-link="fall"
            >
                <span>03</span>
                <strong>Fall</strong>
                <small>Refresh</small>
            </a>


            <a
                href="seasons/winter.html"
                data-season-link="winter"
            >
                <span>04</span>
                <strong>Winter</strong>
                <small>Reset</small>
            </a>

        </nav>


        <!-- =====================================================
             DESIGN LANGUAGE
        ====================================================== -->

        <section class="season-style-strip">

            <div>

                <span>
                    ${config.designLabel}
                </span>

                <strong>
                    ${config.designCopy}
                </strong>

            </div>


            <div class="season-palette">
                ${palette}
            </div>

        </section>


        <!-- =====================================================
             ZONES
        ====================================================== -->

        <section class="season-section">

            <div class="season-section-heading">

                <div>

                    <span class="ui-kicker">
                        ${config.topologyLabel}
                    </span>

                    <h2>
                        Reset the house in layers.
                    </h2>

                </div>


                <p>
                    ${config.topologyCopy}
                </p>

            </div>


            <div
                class="season-zone-grid"
                id="seasonZoneGrid"
            ></div>

        </section>


        <!-- =====================================================
             WORKSPACE
        ====================================================== -->

        <section
            class="
                season-section
                season-workspace
            "
            id="seasonChecklist"
        >


            <article class="season-checklist-panel">

                <div class="season-workspace-head">

                    <div>

                        <span
                            class="ui-kicker"
                            id="selectedSeasonZoneCode"
                        >
                            Z-01 // ${season.toUpperCase()}
                        </span>


                        <h2 id="selectedSeasonZoneName">
                            Master Suite
                        </h2>


                        <p id="selectedSeasonZoneDescription">
                            Detailed seasonal reset for this HomeOS zone.
                        </p>

                    </div>


                    <div class="season-zone-progress">

                        <span>
                            ZONE COMPLETE
                        </span>

                        <strong id="selectedSeasonZoneProgress">
                            0%
                        </strong>

                        <small id="selectedSeasonZoneTaskCount">
                            0/0
                        </small>

                    </div>

                </div>


                <div class="season-workspace-note">

                    <span>
                        HOW TO USE THIS
                    </span>

                    <p>
                        ${config.workspaceNote}
                    </p>

                </div>


                <div
                    class="season-task-list"
                    id="seasonTaskList"
                ></div>


                <div class="season-add-task">

                    <div>

                        <span>
                            MY TASK // THIS ZONE
                        </span>

                        <p>
                            Add something unique to your house without
                            touching the shared seasonal code.
                        </p>

                    </div>


                    <div class="season-add-task-controls">

                        <input
                            class="app-input"
                            id="newSeasonTask"
                            type="text"
                            placeholder="Add another task for this zone..."
                        >


                        <button
                            class="button button-secondary"
                            id="addSeasonTaskButton"
                            type="button"
                        >
                            + Add Task
                        </button>

                    </div>

                </div>

            </article>


            <!-- INTELLIGENCE -->

            <aside class="season-intelligence-panel">

                <div class="season-intelligence-line"></div>


                <span class="ui-kicker">
                    HOMEOS // ${season.toUpperCase()} INTELLIGENCE
                </span>


                <h3 id="seasonIntelligenceTitle">
                    Master Suite
                </h3>


                <p id="seasonIntelligenceDescription">
                    HomeOS is reading this zone.
                </p>


                <div class="season-stat-grid">

                    <div>
                        <span>TASKS</span>
                        <strong id="seasonZoneTasksDone">0/0</strong>
                    </div>


                    <div>
                        <span>ZONE STATE</span>
                        <strong id="seasonZoneState">READY</strong>
                    </div>


                    <div>
                        <span>${season.toUpperCase()}</span>
                        <strong id="seasonTotalProgress">0%</strong>
                    </div>


                    <div>
                        <span>SHOPPING</span>
                        <strong id="seasonShoppingCount">0</strong>
                    </div>

                </div>


                <div class="season-priority-card">

                    <span>
                        ${config.ruleLabel}
                    </span>

                    <strong>
                        ${config.ruleTitle}
                    </strong>

                    <p>
                        ${config.ruleCopy}
                    </p>

                </div>


                <button
                    class="button button-primary"
                    type="button"
                    data-scroll-target="seasonShoppingSection"
                >
                    Open ${seasonLabel} Shopping ↓
                </button>

            </aside>

        </section>


        <!-- =====================================================
             SHOPPING
        ====================================================== -->

        <section
            class="season-section"
            id="seasonShoppingSection"
        >

            <div class="season-section-heading">

                <div>

                    <span class="ui-kicker">
                        ${config.shoppingKicker}
                    </span>

                    <h2>
                        ${config.shoppingHeading}
                    </h2>

                </div>


                <p>
                    ${config.shoppingCopy}
                </p>

            </div>


            <div class="season-shopping-layout">


                <article class="season-shopping-entry">

                    <span class="ui-kicker">
                        ADD TO HOMEOS
                    </span>

                    <h3>
                        ${config.shoppingEntryTitle}
                    </h3>

                    <p>
                        ${config.shoppingEntryCopy}
                    </p>


                    <div class="season-shopping-form">

                        <input
                            class="app-input"
                            id="seasonShoppingName"
                            type="text"
                            placeholder="${config.shoppingPlaceholder}"
                        >


                        <input
                            class="app-input"
                            id="seasonShoppingQty"
                            type="number"
                            min="1"
                            value="1"
                            aria-label="Quantity"
                        >


                        <button
                            class="button button-primary"
                            id="addSeasonShoppingButton"
                            type="button"
                        >
                            Add To Shopping
                        </button>

                    </div>

                </article>


                <article class="season-shopping-list-card">

                    <div class="season-shopping-head">

                        <div>

                            <span class="ui-kicker">
                                ${config.plannedLabel}
                            </span>

                            <h3>
                                ${config.plannedTitle}
                            </h3>

                        </div>


                        <span id="seasonShoppingListCount">
                            0 ITEMS
                        </span>

                    </div>


                    <div
                        class="season-shopping-list"
                        id="seasonShoppingList"
                    ></div>


                    <a
                        class="button button-secondary"
                        href="inventory.html#shoppingSection"
                    >
                        Open Full HomeOS Shopping →
                    </a>

                </article>

            </div>

        </section>


        <!-- =====================================================
             COMPLETION
        ====================================================== -->

        <section
            class="
                season-section
                season-completion-section
            "
            id="seasonCompletion"
        >

            <article class="season-completion-card">

                <div class="season-completion-orbit">
                    <span>✦</span>
                </div>


                <span class="ui-kicker">
                    ${config.completionLabel}
                </span>


                <h2>
                    ${config.completionTitle}
                </h2>


                <p id="seasonCompletionMessage">
                    ${config.completionMessage}
                </p>


                <button
                    class="button button-primary"
                    id="completeSeasonButton"
                    type="button"
                    disabled
                >
                    ${config.completionButton}
                </button>

            </article>

        </section>
    `;

})();