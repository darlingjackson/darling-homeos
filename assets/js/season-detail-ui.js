document.addEventListener("DOMContentLoaded", ()=>{
    "use strict";

    const SeasonDetailUI={

        selectedSeason:null,
        timer:null,
        lastDateKey:null,

        init(){
            if(
                document.body.dataset.seasonalView!==
                "detail"
            ){
                return;
            }

            if(
                !window.HomeStore||
                !window.SeasonalApp
            ){
                console.error(
                    "DARLING HomeOS Season Detail UI requires HomeStore and SeasonalApp."
                );

                return;
            }

            this.selectedSeason=
                window.SeasonalApp.selectedSeason||
                document.body.dataset.season||
                "fall";

            this.lastDateKey=
                this.getLocalDateKey();

            this.renderAll();
            this.bindStateEvents();
            this.startClock();
        },

        getEngine(){
            return window.SeasonalApp;
        },

        getIdentity(){
            return(
                this.getEngine()
                    ?.SEASONS
                    ?.[
                        this.selectedSeason
                    ]||
                null
            );
        },

        getSeasonState(){
            return(
                HomeStore
                    .getState()
                    .seasonal
                    ?.seasons
                    ?.[
                        this.selectedSeason
                    ]||
                null
            );
        },

        bindStateEvents(){
            window.addEventListener(
                "homeos:statechange",
                ()=>{
                    this.renderState();
                    this.renderGuide();
                }
            );
        },

        startClock(){
            this.renderClock();

            if(this.timer){
                clearInterval(
                    this.timer
                );
            }

            this.timer=
                setInterval(
                    ()=>{

                        this.renderClock();

                        const dateKey=
                            this.getLocalDateKey();

                        if(
                            dateKey!==
                            this.lastDateKey
                        ){
                            this.lastDateKey=
                                dateKey;

                            this.renderCycle();
                            this.renderGuide();
                        }
                    },
                    1000
                );
        },

        renderClock(){
            const now=
                new Date();

            const date=
                now
                    .toLocaleDateString(
                        "en-US",
                        {
                            month:"short",
                            day:"2-digit",
                            year:"numeric"
                        }
                    )
                    .toUpperCase();

            const day=
                now
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday:"long"
                        }
                    )
                    .toUpperCase();

            const time=
                now
                    .toLocaleTimeString(
                        "en-US",
                        {
                            hour:"numeric",
                            minute:"2-digit",
                            second:"2-digit"
                        }
                    )
                    .toUpperCase();

            this.setText(
                "seasonDetailDateLarge",
                date
            );

            this.setText(
                "seasonDetailDayLabel",
                day
            );

            this.setText(
                "seasonDetailTimeLarge",
                time
            );
        },

        renderAll(){
            this.renderClock();
            this.renderCycle();
            this.renderState();
            this.renderGuide();
        },

        getSelectedSeasonState(){
            const engine=
                this.getEngine();

            if(
                !engine||
                typeof engine.getSelectedSeasonCycle!==
                "function"
            ){
                return null;
            }

            return engine.getSelectedSeasonCycle(
                new Date()
            );
        },

        renderCycle(){
            const cycle=
                this.getSelectedSeasonState();

            if(!cycle){
                return;
            }

            document.body
                .dataset
                .seasonCycleState=
                cycle.state;

            this.setText(
                "seasonCycleState",
                cycle.label
            );

            this.setText(
                "seasonCycleCountdown",
                cycle.countdown
            );

            this.setText(
                "seasonCycleCountdownLabel",
                cycle.countdownLabel
            );

            this.setText(
                "seasonCycleWindow",
                cycle.range
            );
        },

        renderState(){
            const state=
                HomeStore.getState();

            const season=
                state.seasonal
                    ?.seasons
                    ?.[
                        this.selectedSeason
                    ];

            if(!season){
                return;
            }

            const engine=
                this.getEngine();

            const zones=
                Array.isArray(
                    season.zones
                )
                    ? season.zones
                    : [];

            const tasks=
                zones.flatMap(
                    zone=>
                        Array.isArray(
                            zone.tasks
                        )
                            ? zone.tasks
                            : []
                );

            const doneTasks=
                tasks.filter(
                    task=>
                        task.done
                )
                .length;

            const completedZones=
                zones.filter(
                    zone=>{

                        if(
                            engine&&
                            typeof engine.calculateZoneProgress===
                            "function"
                        ){
                            return(
                                engine.calculateZoneProgress(
                                    zone
                                )===
                                100
                            );
                        }

                        const zoneTasks=
                            Array.isArray(
                                zone.tasks
                            )
                                ? zone.tasks
                                : [];

                        return(
                            zoneTasks.length>
                                0&&
                            zoneTasks.every(
                                task=>
                                    task.done
                            )
                        );
                    }
                )
                .length;

            const shopping=
                (
                    state.inventory
                        ?.shoppingList||
                    []
                )
                .filter(
                    item=>
                        item.origin===
                            "seasonal"&&
                        item.season===
                            this.selectedSeason
                );

            const progress=
                this.clampProgress(
                    season.progress
                );

            this.setText(
                "seasonTasksMetric",
                `${doneTasks}/${tasks.length}`
            );

            this.setText(
                "seasonZonesMetric",
                `${completedZones}/${zones.length}`
            );

            this.setText(
                "seasonShoppingMetric",
                shopping.length
            );

            this.setText(
                "seasonProgressMetric",
                `${progress}%`
            );
        },

        renderGuide(){
            const season=
                this.getSeasonState();

            const identity=
                this.getIdentity();

            const cycle=
                this.getSelectedSeasonState();

            if(
                !identity||
                !cycle
            ){
                return;
            }

            const progress=
                this.clampProgress(
                    season?.progress
                );

            const action=
                document.getElementById(
                    "seasonGuideAction"
                );

            if(!action){
                return;
            }

            if(
                cycle.state===
                "prep"
            ){
                this.setText(
                    "seasonGuideStatus",
                    "PREP MODE"
                );

                this.setText(
                    "seasonGuideMessage",

                    identity.prepMessage||

                    `${identity.name} is approaching. You can begin preparing the home now.`
                );

                this.configureGuideAction(
                    action,
                    `BEGIN ${identity.name.toUpperCase()} →`,
                    "workspace"
                );

                return;
            }

            if(
                cycle.state===
                    "active"&&
                progress<
                    100
            ){
                this.setText(
                    "seasonGuideStatus",
                    "CYCLE ACTIVE"
                );

                this.setText(
                    "seasonGuideMessage",

                    `${identity.name} is ${progress}% complete. Continue with the next unfinished HomeOS zone, then stage decor and supplies as the house comes together.`
                );

                this.configureGuideAction(
                    action,
                    `CONTINUE ${identity.name.toUpperCase()} →`,
                    "workspace"
                );

                return;
            }

            if(
                progress>=
                100
            ){
                this.setText(
                    "seasonGuideStatus",
                    "RESET COMPLETE"
                );

                this.setText(
                    "seasonGuideMessage",

                    `${identity.name} is complete. HomeOS is holding the finished cycle in Home Memory until you need it again.`
                );

                this.configureGuideAction(
                    action,
                    "VIEW CYCLE STATUS →",
                    "completion"
                );

                return;
            }

            if(
                cycle.state===
                "up-next"
            ){
                this.setText(
                    "seasonGuideStatus",
                    "UP NEXT"
                );

                this.setText(
                    "seasonGuideMessage",

                    `${identity.name} is the next HomeOS seasonal cycle. The workspace is already available if you want to work ahead.`
                );

                this.configureGuideAction(
                    action,
                    `OPEN ${identity.name.toUpperCase()} →`,
                    "workspace"
                );

                return;
            }

            this.setText(
                "seasonGuideStatus",
                "WORKSPACE READY"
            );

            this.setText(
                "seasonGuideMessage",

                `${identity.name} is saved at ${progress}% complete. You can work ahead at any time without changing the real current home season.`
            );

            this.configureGuideAction(
                action,
                `OPEN ${identity.name.toUpperCase()} →`,
                "workspace"
            );
        },

        configureGuideAction(
            action,
            label,
            mode
        ){
            action.textContent=
                label;

            action.removeAttribute(
                "href"
            );

            if(
                mode===
                "completion"
            ){
                delete action.dataset
                    .beginSeason;

                action.dataset
                    .scrollTarget=
                    "seasonCompletion";

                return;
            }

            delete action.dataset
                .scrollTarget;

            action.dataset
                .beginSeason=
                "true";
        },

        clampProgress(value){
            const number=
                Number(
                    value
                );

            if(
                !Number.isFinite(
                    number
                )
            ){
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

        getLocalDateKey(){
            if(
                typeof HomeStore.getLocalDateKey===
                "function"
            ){
                return HomeStore
                    .getLocalDateKey();
            }

            const now=
                new Date();

            return(
                `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
            );
        },

        setText(
            id,
            value
        ){
            const element=
                document.getElementById(
                    id
                );

            if(element){
                element.textContent=
                    value;
            }
        }

    };

    window.SeasonDetailUI=
        SeasonDetailUI;

    SeasonDetailUI.init();

});