/* ================================================================
   DARLING HOMEOS
   HOME INVENTORY CONTROLLER

   ONE INVENTORY.
   ONE SHOPPING LIST.
   ONE SOURCE OF TRUTH: HOMESTORE.
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    const InventoryApp = {

        /* ========================================================
           STORAGE NODES
        ======================================================== */

        ZONES: [

            {
                id: "pantry",
                code: "ST-01",
                name: "Walk-In Pantry",
                icon: "PN",
                color: "#8e63ff",
                description:
                    "Dry goods, snacks, food backstock and pantry staples."
            },

            {
                id: "refrigerator",
                code: "ST-02",
                name: "Kitchen Refrigerator",
                icon: "RF",
                color: "#22c7e9",
                description:
                    "Fresh food, dairy, produce and everyday refrigerated items."
            },

            {
                id: "kitchen-freezer",
                code: "ST-03",
                name: "Kitchen Freezer",
                icon: "KF",
                color: "#5487ff",
                description:
                    "Frequently used frozen foods and quick-access freezer storage."
            },

            {
                id: "deep-freezer",
                code: "ST-04",
                name: "Deep Freezer",
                icon: "DF",
                color: "#28d4c2",
                description:
                    "Bulk frozen meats, meals and longer-term freezer storage."
            },

            {
                id: "mini-fridge",
                code: "ST-05",
                name: "Beverage Mini Fridge",
                icon: "BF",
                color: "#f15fa9",
                description:
                    "Drinks, special beverages and hosting stock inside the pantry."
            },

            {
                id: "household",
                code: "ST-06",
                name: "Household Supplies",
                icon: "HS",
                color: "#f0b23f",
                description:
                    "Paper goods, cleaning supplies, laundry products and household essentials."
            }

        ],


        /* ========================================================
           INVENTORY CLEANUP

           HomeOS does not seed fake household stock.

           These IDs belong to the old demo inventory only.
           Cleanup version 1 removes them one time from saved state.
        ======================================================== */

        INVENTORY_CLEANUP_VERSION:
            1,


        LEGACY_STARTER_ITEM_IDS: [

            "item-rice",
            "item-pasta",
            "item-cereal",
            "item-canned-tomatoes",
            "item-milk",
            "item-eggs",
            "item-cheese",
            "item-frozen-veg",
            "item-chicken-breast",
            "item-family-chicken",
            "item-ground-beef",
            "item-kids-drinks",
            "item-water",
            "item-sparkling",
            "item-paper-towels",
            "item-toilet-paper",
            "item-dishwasher-pods",
            "item-laundry-detergent",
            "item-trash-bags"

        ],


        selectedZone:
            "pantry",

        searchTerm:
            "",

        clockTimer:
            null,


        /* ========================================================
           STARTUP
        ======================================================== */

        init() {

            this.ensureInventorySetup();

            this.bindEvents();

            this.bindStateEvents();


            const state =
                HomeStore.getState();


            this.syncSelectedZone(
                state
            );


            this.render(
                state
            );


            this.startClock();

        },


        /* ========================================================
           SAFE INVENTORY SETUP
        ======================================================== */

        ensureInventorySetup() {

            const state =
                HomeStore.getState();


            if (
                !state.inventory ||
                typeof state.inventory !==
                    "object"
            ) {

                state.inventory =
                    {};

            }


            const inventory =
                state.inventory;


            const savedZones =
                Array.isArray(
                    inventory.zones
                )
                    ? inventory.zones
                    : [];


            inventory.zones =
                this.ZONES.map(
                    official => {

                        const saved =
                            savedZones.find(
                                zone =>
                                    zone.id ===
                                    official.id
                            ) ||
                            {};


                        return {

                            ...saved,
                            ...official

                        };

                    }
                );


            if (
                !Array.isArray(
                    inventory.items
                )
            ) {

                inventory.items =
                    [];

            }


            if (
                !Array.isArray(
                    inventory.shoppingList
                )
            ) {

                inventory.shoppingList =
                    [];

            }


            if (
                typeof inventory
                    .autoAddShortages !==
                "boolean"
            ) {

                inventory.autoAddShortages =
                    false;

            }


            if (
                !Array.isArray(
                    state.activity
                )
            ) {

                state.activity =
                    [];

            }


            /*
               ------------------------------------------------------
               LEGACY DEMO CLEANUP

               Older Inventory builds inserted example household
               stock automatically. Those records were never real
               HomeOS data, so remove them once by their old IDs.

               User-created items use generated IDs and are preserved.
               ------------------------------------------------------
            */

            const cleanupVersion =
                Number(
                    inventory.cleanupVersion
                ) ||
                0;


            if (
                cleanupVersion <
                this.INVENTORY_CLEANUP_VERSION
            ) {

                const legacyIds =
                    new Set(
                        this.LEGACY_STARTER_ITEM_IDS
                    );


                inventory.items =
                    inventory.items
                        .filter(
                            item =>
                                !legacyIds.has(
                                    item?.id
                                )
                        );


                inventory.shoppingList =
                    inventory.shoppingList
                        .filter(
                            entry =>

                                !(
                                    entry?.sourceType ===
                                        "inventory" &&

                                    legacyIds.has(
                                        entry?.inventoryItemId
                                    )
                                )
                        );


                inventory.cleanupVersion =
                    this.INVENTORY_CLEANUP_VERSION;

            }


            /*
               ------------------------------------------------------
               NORMALIZE REAL INVENTORY

               Do not invent items. Only repair the shape of records
               that already exist.
               ------------------------------------------------------
            */

            inventory.items =
                inventory.items
                    .filter(
                        item =>
                            item &&
                            typeof item ===
                                "object"
                    )
                    .map(
                        item => {

                            const validZone =
                                inventory.zones.some(
                                    zone =>
                                        zone.id ===
                                        item.zoneId
                                );


                            return {

                                ...item,

                                id:
                                    item.id ||
                                    this.makeId(
                                        "inventory"
                                    ),

                                zoneId:
                                    validZone

                                        ? item.zoneId

                                        : "pantry",

                                name:
                                    String(
                                        item.name ||
                                        "Inventory Item"
                                    )
                                        .trim(),

                                category:
                                    String(
                                        item.category ||
                                        ""
                                    )
                                        .trim(),

                                current:
                                    Math.max(
                                        0,
                                        Number(
                                            item.current
                                        ) ||
                                        0
                                    ),

                                target:
                                    Math.max(
                                        1,
                                        Number(
                                            item.target
                                        ) ||
                                        1
                                    ),

                                unit:
                                    String(
                                        item.unit ||
                                        ""
                                    )
                                        .trim()

                            };

                        }
                    );


            /*
               Keep only one live Inventory-linked shopping entry
               per tracked item. Seasonal and custom entries remain
               separate because they may represent different needs.
            */

            const seenInventoryLinks =
                new Set();


            inventory.shoppingList =
                inventory.shoppingList
                    .filter(
                        entry => {

                            if (
                                !entry ||
                                typeof entry !==
                                    "object"
                            ) {

                                return false;

                            }


                            if (
                                entry.sourceType !==
                                "inventory"
                            ) {

                                return true;

                            }


                            const itemId =
                                entry.inventoryItemId;


                            if (
                                !itemId ||
                                seenInventoryLinks.has(
                                    itemId
                                )
                            ) {

                                return false;

                            }


                            seenInventoryLinks.add(
                                itemId
                            );


                            return true;

                        }
                    );


            const selectedExists =
                inventory.zones.some(
                    zone =>
                        zone.id ===
                        inventory.selectedZone
                );


            if (
                !selectedExists
            ) {

                inventory.selectedZone =
                    inventory.zones[0]?.id ||
                    "pantry";

            }


            this.selectedZone =
                inventory.selectedZone;


            inventory.setupComplete =
                true;


            this.syncDerivedState(
                state
            );


            HomeStore.saveState(
                state
            );

        },


        /* ========================================================
           LIVE HOMESTORE
        ======================================================== */

        bindStateEvents() {

            window.addEventListener(
                "homeos:statechange",
                event => {

                    const state =
                        event.detail ||
                        HomeStore.getState();


                    this.syncSelectedZone(
                        state
                    );


                    this.render(
                        state
                    );

                }
            );

        },


        syncSelectedZone(
            state
        ) {

            const zones =
                state.inventory?.zones ||
                [];


            const saved =
                state.inventory
                    ?.selectedZone;


            if (
                zones.some(
                    zone =>
                        zone.id ===
                        saved
                )
            ) {

                this.selectedZone =
                    saved;


                return;

            }


            if (
                !zones.some(
                    zone =>
                        zone.id ===
                        this.selectedZone
                )
            ) {

                this.selectedZone =
                    zones[0]?.id ||
                    "pantry";

            }

        },


        /* ========================================================
           DERIVED STOCK STATE
        ======================================================== */

        syncDerivedState(
            state
        ) {

            const inventory =
                state.inventory;


            const items =
                Array.isArray(
                    inventory.items
                )
                    ? inventory.items
                    : [];


            inventory.health =
                this.calculateInventoryHealth(
                    items
                );


            inventory.lowItems =
                items

                    .filter(
                        item =>

                            Number(
                                item.current
                            ) <

                            Number(
                                item.target
                            )
                    )

                    .map(
                        item => ({

                            id:
                                item.id,

                            name:
                                item.name,

                            current:
                                Math.max(
                                    0,
                                    Number(
                                        item.current
                                    ) ||
                                    0
                                ),

                            target:
                                Math.max(
                                    1,
                                    Number(
                                        item.target
                                    ) ||
                                    1
                                ),

                            zoneId:
                                item.zoneId,

                            unit:
                                item.unit ||
                                ""

                        })
                    );


            this.syncShoppingEntries(
                state
            );

        },


        /* ========================================================
           SHOPPING LIST SYNCHRONIZATION
        ======================================================== */

        syncShoppingEntries(
            state
        ) {

            const inventory =
                state.inventory;


            if (
                !Array.isArray(
                    inventory.shoppingList
                )
            ) {

                inventory.shoppingList =
                    [];

            }


            /*
               Remove only broken Inventory links.
               Seasonal + custom entries stay.
            */

            inventory.shoppingList =
                inventory.shoppingList
                    .filter(
                        entry => {

                            if (
                                entry.sourceType !==
                                "inventory"
                            ) {

                                return true;

                            }


                            return inventory.items
                                .some(
                                    item =>
                                        item.id ===
                                        entry.inventoryItemId
                                );

                        }
                    );


            /*
               Keep one Inventory-linked shopping row per tracked item.
               This prevents old duplicate shortage rows from surviving.
            */

            const seenInventoryEntries =
                new Set();


            inventory.shoppingList =
                inventory.shoppingList
                    .filter(
                        entry => {

                            if (
                                entry.sourceType !==
                                "inventory"
                            ) {

                                return true;

                            }


                            const itemId =
                                entry.inventoryItemId;


                            if (
                                seenInventoryEntries.has(
                                    itemId
                                )
                            ) {

                                return false;

                            }


                            seenInventoryEntries.add(
                                itemId
                            );


                            return true;

                        }
                    );


            /*
               Automatic Inventory entries follow live shortage math.
            */

            inventory.shoppingList
                .forEach(
                    entry => {

                        if (
                            entry.sourceType !==
                                "inventory" ||

                            entry.quantityMode ===
                                "manual"
                        ) {

                            return;

                        }


                        const item =
                            inventory.items
                                .find(
                                    value =>
                                        value.id ===
                                        entry.inventoryItemId
                                );


                        if (
                            !item
                        ) {

                            return;

                        }


                        const needed =
                            Math.max(
                                0,

                                Number(
                                    item.target
                                ) -

                                Number(
                                    item.current
                                )
                            );


                        entry.name =
                            item.name;


                        entry.unit =
                            item.unit ||
                            "";


                        entry.quantity =
                            needed;

                    }
                );


            /*
               If an automatic shortage is satisfied,
               remove that automatic list entry.
            */

            inventory.shoppingList =
                inventory.shoppingList
                    .filter(
                        entry => {

                            if (
                                entry.sourceType !==
                                    "inventory" ||

                                entry.quantityMode ===
                                    "manual"
                            ) {

                                return true;

                            }


                            return (
                                Number(
                                    entry.quantity
                                ) >
                                0
                            );

                        }
                    );


            /*
               Auto Restock creates missing shortage entries.
            */

            if (
                inventory.autoAddShortages
            ) {

                inventory.lowItems
                    .forEach(
                        lowItem => {

                            const exists =
                                inventory.shoppingList
                                    .some(
                                        entry =>

                                            entry.sourceType ===
                                                "inventory" &&

                                            entry.inventoryItemId ===
                                                lowItem.id
                                    );


                            if (
                                !exists
                            ) {

                                inventory.shoppingList
                                    .push(
                                        this.createInventoryShoppingEntry(
                                            lowItem
                                        )
                                    );

                            }

                        }
                    );

            }

        },


        /* ========================================================
           MASTER RENDER
        ======================================================== */

        render(
            providedState = null
        ) {

            const state =
                providedState ||
                HomeStore.getState();


            this.renderHero(
                state
            );


            this.renderGuide(
                state
            );


            this.renderMetrics(
                state
            );


            this.renderZones(
                state
            );


            this.renderSelectedZone(
                state
            );


            this.renderItems(
                state
            );


            this.renderShortages(
                state
            );


            this.renderShoppingList(
                state
            );


            this.renderDialogZones(
                state
            );

        },


        /* ========================================================
           CLOCK
        ======================================================== */

        startClock() {

            this.renderDate();


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

                        this.renderDate();

                    },
                    1000
                );

        },


        renderDate() {

            const now =
                new Date();


            this.setText(

                "inventoryDateTime",

                `${HomeApp.formatDate(now)} · ${HomeApp.formatTime(now)}`

            );

        },


        /* ========================================================
           INVENTORY CORE
        ======================================================== */

        renderHero(
            state
        ) {

            const inventory =
                state.inventory;


            const hasTrackedItems =
                Array.isArray(
                    inventory.items
                ) &&
                inventory.items.length >
                    0;


            const health =
                this.calculateInventoryHealth(
                    inventory.items
                );


            const low =
                inventory.lowItems
                    .length;


            const shopping =
                inventory.shoppingList
                    .length;


            this.setText(

                "inventoryHealthValue",

                hasTrackedItems
                    ? `${health}%`
                    : "—"

            );


            this.setText(

                "inventoryHealthStatus",

                !hasTrackedItems

                    ? "START TRACKING"

                    : health >=
                        90

                        ? "WELL STOCKED"

                        : health >=
                            75

                            ? "MOSTLY STOCKED"

                            : health >=
                                55

                                ? "RESTOCKING"

                                : "NEEDS ATTENTION"

            );


            this.setText(
                "heroLowCount",
                low
            );


            this.setText(
                "heroShoppingCount",
                shopping
            );


            this.setText(

                "heroAutoStatus",

                inventory.autoAddShortages
                    ? "On"
                    : "Off"

            );


            const ring =
                document.getElementById(
                    "inventoryHealthRing"
                );


            if (
                ring
            ) {

                ring.style.setProperty(

                    "--inventory-health",

                    `${
                        hasTrackedItems

                            ? Math.round(
                                health *
                                3.6
                            )

                            : 0
                    }deg`

                );

            }

        },


        /* ========================================================
           INVENTORY GUIDE
        ======================================================== */

        renderGuide(
            state
        ) {

            const inventory =
                state.inventory;


            const button =
                document.getElementById(
                    "inventoryGuideAction"
                );


            if (
                !Array.isArray(
                    inventory.items
                ) ||
                !inventory.items.length
            ) {

                this.setText(

                    "inventoryGuideStatus",

                    "READY TO TRACK"

                );


                this.setText(

                    "inventoryGuideMessage",

                    "Inventory is ready. Add the first real item from your home and HomeOS will begin building stock health and shortage intelligence."

                );


                this.configureGuideButton(

                    button,

                    "add-item",

                    "ADD FIRST ITEM →"

                );


                return;

            }


            const checkedCount =
                inventory.shoppingList
                    .filter(
                        item =>
                            item.checked
                    )
                    .length;


            const lowItems =
                [
                    ...inventory.lowItems
                ]
                    .sort(
                        (
                            first,
                            second
                        ) => {

                            const firstRatio =
                                Number(
                                    first.target
                                )

                                    ? Number(
                                        first.current
                                    ) /
                                    Number(
                                        first.target
                                    )

                                    : 1;


                            const secondRatio =
                                Number(
                                    second.target
                                )

                                    ? Number(
                                        second.current
                                    ) /
                                    Number(
                                        second.target
                                    )

                                    : 1;


                            return (
                                firstRatio -
                                secondRatio
                            );

                        }
                    );


            /*
               FIRST PRIORITY:
               checked shopping items are ready to finish.
            */

            if (
                checkedCount
            ) {

                this.setText(

                    "inventoryGuideStatus",

                    "PURCHASE READY"

                );


                this.setText(

                    "inventoryGuideMessage",

                    `${checkedCount} shopping item${checkedCount === 1 ? " is" : "s are"} checked. Mark them purchased and HomeOS will update linked stock automatically.`

                );


                this.configureGuideButton(

                    button,

                    "purchase",

                    `MARK PURCHASED (${checkedCount}) →`

                );


                return;

            }


            /*
               SECOND PRIORITY:
               strongest stock shortage.
            */

            if (
                lowItems.length
            ) {

                const priority =
                    lowItems[
                        0
                    ];


                const zone =
                    inventory.zones
                        .find(
                            item =>
                                item.id ===
                                priority.zoneId
                        );


                const needed =
                    Math.max(

                        0,

                        Number(
                            priority.target
                        ) -

                        Number(
                            priority.current
                        )

                    );


                this.setText(

                    "inventoryGuideStatus",

                    "RESTOCK SIGNAL"

                );


                this.setText(

                    "inventoryGuideMessage",

                    `${priority.name} is one of the strongest shortages${zone ? ` in ${zone.name}` : ""}. HomeOS shows ${needed} ${priority.unit || "needed"} to reach your preferred stock.`

                );


                this.configureGuideButton(

                    button,

                    "shortages",

                    "OPEN RESTOCK CENTER →"

                );


                return;

            }


            /*
               THIRD PRIORITY:
               list already has shopping on it.
            */

            if (
                inventory.shoppingList
                    .length
            ) {

                this.setText(

                    "inventoryGuideStatus",

                    "SHOPPING ACTIVE"

                );


                this.setText(

                    "inventoryGuideMessage",

                    `${inventory.shoppingList.length} item${inventory.shoppingList.length === 1 ? " is" : "s are"} waiting on the shared HomeOS Shopping List.`

                );


                this.configureGuideButton(

                    button,

                    "shopping",

                    "OPEN SHOPPING LIST →"

                );


                return;

            }


            /*
               EVERYTHING IS HEALTHY.
            */

            this.setText(

                "inventoryGuideStatus",

                "STOCK STABLE"

            );


            this.setText(

                "inventoryGuideMessage",

                "Your tracked inventory is at target. HomeOS will keep watching Current versus Preferred quantities."

            );


            this.configureGuideButton(

                button,

                "add-item",

                "ADD INVENTORY ITEM →"

            );

        },


        configureGuideButton(
            button,
            action,
            label
        ) {

            if (
                !button
            ) {

                return;

            }


            button.dataset
                .inventoryGuideAction =
                action;


            button.textContent =
                label;

        },


        /* ========================================================
           METRICS
        ======================================================== */

        renderMetrics(
            state
        ) {

            const inventory =
                state.inventory;


            const items =
                inventory.items;


            const low =
                inventory.lowItems;


            const shopping =
                inventory.shoppingList;


            this.setText(
                "trackedItemsMetric",
                items.length
            );


            this.setText(

                "trackedItemsDetail",

                items.length

                    ? `${items.length} household item${items.length === 1 ? "" : "s"} currently tracked.`

                    : "Add your first real household item to begin tracking."

            );


            this.setText(
                "lowStockMetric",
                low.length
            );


            this.setText(

                "lowStockDetail",

                low.length

                    ? `${low.length} item${low.length === 1 ? " is" : "s are"} below preferred stock.`

                    : items.length
                        ? "Everything is currently at target."
                        : "No stock levels are being tracked yet."

            );


            this.setText(
                "shoppingMetric",
                shopping.length
            );


            this.setText(

                "shoppingMetricDetail",

                shopping.length

                    ? `${shopping.length} item${shopping.length === 1 ? "" : "s"} currently on the shopping list.`

                    : "Your shopping list is clear."

            );


            this.setText(

                "storageZonesMetric",

                String(
                    inventory.zones
                        .length
                )
                    .padStart(
                        2,
                        "0"
                    )

            );

        },


        /* ========================================================
           STORAGE NODE CARDS
        ======================================================== */

        renderZones(
            state
        ) {

            const container =
                document.getElementById(
                    "inventoryZoneGrid"
                );


            if (
                !container
            ) {

                return;

            }


            container.innerHTML =
                state.inventory
                    .zones
                    .map(
                        zone => {

                            const items =
                                state.inventory
                                    .items
                                    .filter(
                                        item =>
                                            item.zoneId ===
                                            zone.id
                                    );


                            const lowCount =
                                items
                                    .filter(
                                        item =>

                                            Number(
                                                item.current
                                            ) <

                                            Number(
                                                item.target
                                            )
                                    )
                                    .length;


                            const health =
                                this.calculateZoneHealth(
                                    items
                                );


                            return `

                                <button
                                    class="
                                        inventory-zone-card
                                        ${zone.id === this.selectedZone ? "selected" : ""}
                                        ${items.length ? "" : "empty"}
                                    "

                                    type="button"

                                    data-inventory-zone="${HomeApp.escapeHtml(zone.id)}"

                                    style="
                                        --zone-color:
                                            ${zone.color};
                                    "
                                >

                                    <div class="inventory-zone-top">

                                        <span class="inventory-zone-icon">
                                            ${HomeApp.escapeHtml(zone.icon)}
                                        </span>

                                        <span class="inventory-zone-code">
                                            ${HomeApp.escapeHtml(zone.code)}
                                        </span>

                                    </div>


                                    <h3>
                                        ${HomeApp.escapeHtml(zone.name)}
                                    </h3>


                                    <p>
                                        ${HomeApp.escapeHtml(zone.description)}
                                    </p>


                                    <div class="inventory-zone-signal">

                                        <span>
                                            ${
                                                !items.length

                                                    ? "EMPTY"

                                                    : lowCount

                                                        ? `${lowCount} LOW`

                                                        : "STABLE"
                                            }
                                        </span>


                                        <strong>
                                            ${items.length ? `${health}%` : "—"}
                                        </strong>

                                    </div>


                                    <div class="inventory-zone-track">

                                        <span
                                            style="
                                                width:
                                                    ${items.length ? health : 0}%;
                                            "
                                        ></span>

                                    </div>


                                    <div class="inventory-zone-footer">

                                        ${items.length}
                                        item${items.length === 1 ? "" : "s"}
                                        tracked

                                    </div>

                                </button>

                            `;

                        }
                    )
                    .join("");

        },


        /* ========================================================
           SELECTED STORAGE NODE
        ======================================================== */

        renderSelectedZone(
            state
        ) {

            const zone =
                state.inventory
                    .zones
                    .find(
                        item =>
                            item.id ===
                            this.selectedZone
                    );


            if (
                !zone
            ) {

                return;

            }


            const items =
                state.inventory
                    .items
                    .filter(
                        item =>
                            item.zoneId ===
                            zone.id
                    );


            const health =
                this.calculateZoneHealth(
                    items
                );


            const low =
                items
                    .filter(
                        item =>

                            Number(
                                item.current
                            ) <

                            Number(
                                item.target
                            )
                    )
                    .length;


            this.setText(
                "selectedInventoryZoneCode",
                zone.code
            );


            this.setText(
                "selectedInventoryZoneName",
                zone.name
            );


            this.setText(

                "selectedInventoryZoneDescription",

                zone.description

            );


            this.setText(

                "selectedInventoryZoneHealth",

                items.length
                    ? `${health}%`
                    : "—"

            );


            this.setText(

                "selectedInventoryZoneState",

                !items.length

                    ? "EMPTY"

                    : health >=
                        90

                        ? "STABLE"

                        : health >=
                            70

                            ? "WATCH"

                            : "RESTOCK"

            );


            this.setText(

                "selectedInventoryZoneCount",

                `${items.length} ITEM${items.length === 1 ? "" : "S"}`

            );


            this.setText(

                "selectedInventoryZoneLow",

                `${low} LOW`

            );


            const accent =
                document.getElementById(
                    "selectedInventoryZoneAccent"
                );


            if (
                accent
            ) {

                accent.style.background =
                    zone.color;


                accent.style.boxShadow =
                    `0 0 16px ${zone.color}`;

            }

        },


        /* ========================================================
           INVENTORY ITEMS
        ======================================================== */

        renderItems(
            state
        ) {

            const container =
                document.getElementById(
                    "inventoryItemList"
                );


            if (
                !container
            ) {

                return;

            }


            let items =
                state.inventory
                    .items
                    .filter(
                        item =>
                            item.zoneId ===
                            this.selectedZone
                    );


            if (
                this.searchTerm
            ) {

                const term =
                    this.searchTerm
                        .toLowerCase();


                items =
                    items
                        .filter(
                            item =>

                                String(
                                    item.name ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        term
                                    ) ||

                                String(
                                    item.category ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        term
                                    )
                        );

            }


            if (
                !items.length
            ) {

                const zone =
                    state.inventory
                        .zones
                        .find(
                            item =>
                                item.id ===
                                this.selectedZone
                        );


                const zoneName =
                    zone?.name ||
                    "this storage zone";


                container.innerHTML = `

                    <div class="inventory-empty">

                        <div class="inventory-empty-visual">

                            <span class="inventory-empty-orbit"></span>

                            <strong>
                                ${
                                    this.searchTerm
                                        ? "0"
                                        : "+"
                                }
                            </strong>

                        </div>


                        <div class="inventory-empty-copy">

                            <span class="ui-kicker">

                                ${
                                    this.searchTerm
                                        ? "SEARCH RESULT // CLEAR"
                                        : "STOCK NODE // READY TO TRACK"
                                }

                            </span>


                            <h3>

                                ${
                                    this.searchTerm

                                        ? `No matches in ${HomeApp.escapeHtml(zoneName)}.`

                                        : `Nothing is tracked in ${HomeApp.escapeHtml(zoneName)} yet.`
                                }

                            </h3>


                            <p>

                                ${
                                    this.searchTerm

                                        ? "Try another item name or category. Your saved Inventory has not been changed."

                                        : "Add a real item from your home, then enter its Current and Preferred quantities. HomeOS will calculate stock health and shortages from those numbers."
                                }

                            </p>


                            ${
                                this.searchTerm

                                    ? ""

                                    : `

                                        <button
                                            class="button button-primary inventory-empty-action"
                                            type="button"
                                            data-open-inventory-item
                                        >
                                            Track First Item →
                                        </button>

                                    `
                            }

                        </div>

                    </div>

                `;


                return;

            }


            container.innerHTML =
                items

                    .slice()

                    .sort(
                        (
                            first,
                            second
                        ) =>

                            String(
                                first.name ||
                                ""
                            )
                                .localeCompare(
                                    String(
                                        second.name ||
                                        ""
                                    )
                                )
                    )

                    .map(
                        item => {

                            const current =
                                Math.max(
                                    0,

                                    Number(
                                        item.current
                                    ) ||
                                    0
                                );


                            const target =
                                Math.max(
                                    1,

                                    Number(
                                        item.target
                                    ) ||
                                    1
                                );


                            const needed =
                                Math.max(
                                    0,

                                    target -
                                    current
                                );


                            const stock =
                                this.getStockState(
                                    item
                                );


                            const onList =
                                state.inventory
                                    .shoppingList
                                    .some(
                                        entry =>

                                            entry.sourceType ===
                                                "inventory" &&

                                            entry.inventoryItemId ===
                                                item.id
                                    );


                            const safeId =
                                HomeApp.escapeHtml(
                                    item.id
                                );


                            return `

                                <article
                                    class="
                                        inventory-item-row
                                        ${stock.className}
                                    "
                                >

                                    <div class="inventory-item-main">

                                        <span
                                            class="
                                                inventory-item-signal
                                                ${stock.className}
                                            "
                                        ></span>


                                        <div>

                                            <strong>
                                                ${HomeApp.escapeHtml(item.name)}
                                            </strong>

                                            <span>

                                                ${HomeApp.escapeHtml(item.category || "Uncategorized")}

                                                ${
                                                    item.unit

                                                        ? ` · ${HomeApp.escapeHtml(item.unit)}`

                                                        : ""
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    <span
                                        class="
                                            inventory-value
                                            inventory-current
                                        "
                                    >
                                        ${current}
                                    </span>


                                    <span class="inventory-value">
                                        ${target}
                                    </span>


                                    <span
                                        class="
                                            inventory-value
                                            inventory-need
                                            ${needed === 0 ? "none" : ""}
                                        "
                                    >

                                        ${
                                            needed

                                                ? `+${needed}`

                                                : "—"
                                        }

                                    </span>


                                    <span
                                        class="
                                            stock-state
                                            ${stock.className}
                                        "
                                    >
                                        ${stock.label}
                                    </span>


                                    <div class="inventory-controls">

                                        <button
                                            class="quantity-button"
                                            type="button"
                                            data-adjust-item="${safeId}"
                                            data-adjust-value="-1"
                                            aria-label="Decrease ${HomeApp.escapeHtml(item.name)}"
                                        >
                                            −
                                        </button>


                                        <button
                                            class="quantity-button"
                                            type="button"
                                            data-adjust-item="${safeId}"
                                            data-adjust-value="1"
                                            aria-label="Increase ${HomeApp.escapeHtml(item.name)}"
                                        >
                                            +
                                        </button>


                                        ${
                                            needed

                                                ? `

                                                    <button
                                                        class="
                                                            inventory-row-action
                                                            add-need
                                                            ${onList ? "in-list" : ""}
                                                        "

                                                        type="button"

                                                        data-add-shortage="${safeId}"
                                                    >

                                                        ${
                                                            onList

                                                                ? "In List ✓"

                                                                : `Add +${needed}`
                                                        }

                                                    </button>

                                                `

                                                : ""
                                        }


                                        <button
                                            class="inventory-row-action"
                                            type="button"
                                            data-edit-item="${safeId}"
                                        >
                                            Edit
                                        </button>


                                        <button
                                            class="inventory-row-action danger"
                                            type="button"
                                            data-delete-item="${safeId}"
                                            aria-label="Delete ${HomeApp.escapeHtml(item.name)}"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </article>

                            `;

                        }
                    )
                    .join("");

        },


        getStockState(
            item
        ) {

            const current =
                Math.max(
                    0,

                    Number(
                        item.current
                    ) ||
                    0
                );


            const target =
                Math.max(
                    1,

                    Number(
                        item.target
                    ) ||
                    1
                );


            if (
                current ===
                0
            ) {

                return {

                    label:
                        "OUT",

                    className:
                        "out"

                };

            }


            if (
                current <
                target
            ) {

                return {

                    label:
                        "LOW",

                    className:
                        "low"

                };

            }


            return {

                label:
                    "STOCKED",

                className:
                    "stocked"

            };

        },


        /* ========================================================
           CURRENT QUANTITY + / -
        ======================================================== */

        adjustItem(
            itemId,
            amount
        ) {

            HomeStore.update(
                state => {

                    const item =
                        state.inventory
                            .items
                            .find(
                                value =>
                                    value.id ===
                                    itemId
                            );


                    if (
                        !item
                    ) {

                        return;

                    }


                    item.current =
                        Math.max(

                            0,

                            Number(
                                item.current ||
                                0
                            ) +

                            Number(
                                amount ||
                                0
                            )

                        );


                    item.updatedAt =
                        new Date()
                            .toISOString();


                    this.syncDerivedState(
                        state
                    );

                }
            );

        },


        /* ========================================================
           SHORTAGES
        ======================================================== */

        renderShortages(
            state
        ) {

            const container =
                document.getElementById(
                    "shortageList"
                );


            const toggle =
                document.getElementById(
                    "autoRestockToggle"
                );


            if (
                toggle
            ) {

                toggle.checked =
                    Boolean(
                        state.inventory
                            .autoAddShortages
                    );

            }


            if (
                !container
            ) {

                return;

            }


            const lowItems =
                state.inventory
                    .lowItems

                    .slice()

                    .sort(
                        (
                            first,
                            second
                        ) =>

                            (
                                second.target -
                                second.current
                            ) -

                            (
                                first.target -
                                first.current
                            )
                    );


            this.setText(

                "shortageCountPill",

                `${lowItems.length} SHORTAGE${lowItems.length === 1 ? "" : "S"}`

            );


            const addAllButton =
                document.getElementById(
                    "addAllShortagesButton"
                );


            if (
                addAllButton
            ) {

                addAllButton.disabled =
                    lowItems.length ===
                    0;

            }


            if (
                !lowItems.length
            ) {

                const hasTrackedItems =
                    Array.isArray(
                        state.inventory.items
                    ) &&
                    state.inventory.items.length >
                        0;


                container.innerHTML = `

                    <div class="inventory-restock-empty">

                        <div class="inventory-restock-empty-icon">

                            ${
                                hasTrackedItems
                                    ? "✓"
                                    : "+"
                            }

                        </div>


                        <div>

                            <span class="ui-kicker">

                                ${
                                    hasTrackedItems
                                        ? "RESTOCK STATUS // HEALTHY"
                                        : "RESTOCK STATUS // WAITING FOR INVENTORY"
                                }

                            </span>


                            <h3>

                                ${
                                    hasTrackedItems
                                        ? "Nothing needs restocking."
                                        : "Inventory tracking has not started yet."
                                }

                            </h3>


                            <p>

                                ${
                                    hasTrackedItems

                                        ? "Every tracked item is currently at or above its Preferred quantity. HomeOS will create a shortage here as soon as Current stock drops below Target."

                                        : "Shopping-list items can still exist, but HomeOS cannot calculate Inventory shortages until you track real household stock with Current and Preferred quantities."
                                }

                            </p>


                            ${
                                hasTrackedItems

                                    ? ""

                                    : `

                                        <button
                                            class="button button-secondary inventory-restock-start"
                                            type="button"
                                            data-open-inventory-item
                                        >
                                            Start Tracking Inventory
                                        </button>

                                    `
                            }

                        </div>

                    </div>

                `;


                return;

            }


            container.innerHTML =
                lowItems
                    .map(
                        item => {

                            const zone =
                                state.inventory
                                    .zones
                                    .find(
                                        value =>
                                            value.id ===
                                            item.zoneId
                                    );


                            const needed =
                                Math.max(

                                    0,

                                    item.target -
                                    item.current

                                );


                            const onList =
                                state.inventory
                                    .shoppingList
                                    .some(
                                        entry =>

                                            entry.sourceType ===
                                                "inventory" &&

                                            entry.inventoryItemId ===
                                                item.id
                                    );


                            return `

                                <div class="shortage-row">

                                    <div class="shortage-main">

                                        <span
                                            class="shortage-zone-dot"

                                            style="
                                                --shortage-color:
                                                    ${zone?.color || "#f15fa9"};
                                            "
                                        ></span>


                                        <div>

                                            <strong>
                                                ${HomeApp.escapeHtml(item.name)}
                                            </strong>

                                            <span>

                                                ${HomeApp.escapeHtml(zone?.name || "Home Inventory")}
                                                · Have ${item.current}
                                                / Target ${item.target}

                                            </span>

                                        </div>

                                    </div>


                                    <div class="shortage-action">

                                        <strong class="shortage-need">
                                            +${needed}
                                        </strong>


                                        <button
                                            class="
                                                shortage-add-button
                                                ${onList ? "added" : ""}
                                            "

                                            type="button"

                                            data-add-shortage="${HomeApp.escapeHtml(item.id)}"
                                        >

                                            ${
                                                onList

                                                    ? "On List ✓"

                                                    : `Add +${needed}`
                                            }

                                        </button>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("");

        },


        addShortage(
            itemId
        ) {

            let itemName =
                "";


            let existed =
                false;


            HomeStore.update(
                state => {

                    const item =
                        state.inventory
                            .items
                            .find(
                                value =>
                                    value.id ===
                                    itemId
                            );


                    if (
                        !item
                    ) {

                        return;

                    }


                    const needed =
                        Math.max(

                            0,

                            Number(
                                item.target
                            ) -

                            Number(
                                item.current
                            )

                        );


                    if (
                        !needed
                    ) {

                        return;

                    }


                    itemName =
                        item.name;


                    const existing =
                        state.inventory
                            .shoppingList
                            .find(
                                entry =>

                                    entry.sourceType ===
                                        "inventory" &&

                                    entry.inventoryItemId ===
                                        item.id
                            );


                    if (
                        existing
                    ) {

                        existed =
                            true;


                        existing.name =
                            item.name;


                        existing.quantity =
                            needed;


                        existing.quantityMode =
                            "needed";


                        existing.unit =
                            item.unit ||
                            "";


                        existing.checked =
                            false;


                        return;

                    }


                    state.inventory
                        .shoppingList
                        .push(
                            this.createInventoryShoppingEntry(
                                item
                            )
                        );

                }
            );


            if (
                itemName
            ) {

                HomeApp.toast(

                    existed

                        ? `${itemName} reset to the current shortage.`

                        : `${itemName} added to the shopping list.`

                );

            }

        },


        addAllShortages() {

            let added =
                0;


            let refreshed =
                0;


            HomeStore.update(
                state => {

                    state.inventory
                        .lowItems
                        .forEach(
                            lowItem => {

                                const needed =
                                    Math.max(

                                        1,

                                        lowItem.target -
                                        lowItem.current

                                    );


                                const existing =
                                    state.inventory
                                        .shoppingList
                                        .find(
                                            entry =>

                                                entry.sourceType ===
                                                    "inventory" &&

                                                entry.inventoryItemId ===
                                                    lowItem.id
                                        );


                                if (
                                    existing
                                ) {

                                    existing.quantity =
                                        needed;


                                    existing.quantityMode =
                                        "needed";


                                    existing.checked =
                                        false;


                                    refreshed +=
                                        1;


                                    return;

                                }


                                state.inventory
                                    .shoppingList
                                    .push(
                                        this.createInventoryShoppingEntry(
                                            lowItem
                                        )
                                    );


                                added +=
                                    1;

                            }
                        );

                }
            );


            if (
                added
            ) {

                HomeApp.toast(

                    `${added} shortage${added === 1 ? "" : "s"} added to the shopping list.`

                );


                return;

            }


            if (
                refreshed
            ) {

                HomeApp.toast(
                    "Your shortage quantities are up to date."
                );


                return;

            }


            HomeApp.toast(
                "Nothing currently needs restocking."
            );

        },


        createInventoryShoppingEntry(
            item
        ) {

            const needed =
                Math.max(

                    1,

                    Number(
                        item.target
                    ) -

                    Number(
                        item.current
                    )

                );


            return {

                id:
                    this.makeId(
                        "shopping"
                    ),

                sourceType:
                    "inventory",

                origin:
                    "inventory",

                inventoryItemId:
                    item.id,

                name:
                    item.name,

                quantity:
                    needed,

                quantityMode:
                    "needed",

                unit:
                    item.unit ||
                    "",

                checked:
                    false,

                addedAt:
                    new Date()
                        .toISOString()

            };

        },


        /* ========================================================
           CUSTOM SHOPPING
        ======================================================== */

        addCustomShoppingItem() {

            const nameInput =
                document.getElementById(
                    "customShoppingName"
                );


            const quantityInput =
                document.getElementById(
                    "customShoppingQty"
                );


            if (
                !nameInput ||
                !quantityInput
            ) {

                return;

            }


            const name =
                nameInput.value
                    .trim();


            const quantity =
                Math.max(

                    1,

                    Number(
                        quantityInput.value
                    ) ||
                    1

                );


            if (
                !name
            ) {

                HomeApp.toast(
                    "Type an item before adding it."
                );


                nameInput.focus();


                return;

            }


            let merged =
                false;


            HomeStore.update(
                state => {

                    const normalizedName =
                        name
                            .toLowerCase();


                    const existing =
                        state.inventory
                            .shoppingList
                            .find(
                                entry =>

                                    entry.sourceType ===
                                        "custom" &&

                                    String(
                                        entry.name ||
                                        ""
                                    )
                                        .trim()
                                        .toLowerCase() ===
                                        normalizedName
                            );


                    if (
                        existing
                    ) {

                        existing.quantity =
                            Math.max(
                                1,
                                Number(
                                    existing.quantity
                                ) ||
                                1
                            ) +
                            quantity;


                        existing.quantityMode =
                            "manual";


                        existing.checked =
                            false;


                        merged =
                            true;


                        return;

                    }


                    state.inventory
                        .shoppingList
                        .push({

                            id:
                                this.makeId(
                                    "shopping-custom"
                                ),

                            sourceType:
                                "custom",

                            origin:
                                "inventory-custom",

                            inventoryItemId:
                                null,

                            name,

                            quantity,

                            quantityMode:
                                "manual",

                            unit:
                                "",

                            checked:
                                false,

                            addedAt:
                                new Date()
                                    .toISOString()

                        });

                }
            );


            nameInput.value =
                "";


            quantityInput.value =
                1;


            HomeApp.toast(

                merged

                    ? `${name} was already on the list, so HomeOS increased the quantity.`

                    : `${name} added to the shopping list.`

            );

        },


        /* ========================================================
           SHOPPING LIST
        ======================================================== */

        renderShoppingList(
            state
        ) {

            const container =
                document.getElementById(
                    "shoppingList"
                );


            if (
                !container
            ) {

                return;

            }


            const list =
                state.inventory
                    .shoppingList;


            this.setText(

                "shoppingCountPill",

                `${list.length} ITEM${list.length === 1 ? "" : "S"}`

            );


            const checkedCount =
                list
                    .filter(
                        item =>
                            item.checked
                    )
                    .length;


            const purchaseButton =
                document.getElementById(
                    "markPurchasedButton"
                );


            if (
                purchaseButton
            ) {

                purchaseButton.disabled =
                    checkedCount ===
                    0;


                purchaseButton.textContent =
                    checkedCount

                        ? `Mark Purchased (${checkedCount})`

                        : "Mark Purchased";

            }


            if (
                !list.length
            ) {

                container.innerHTML = `

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            ♡
                        </div>

                        <div>

                            <h3>
                                Your shopping list is clear.
                            </h3>

                            <p>
                                Add shortages from the left or type
                                anything else you need above.
                            </p>

                        </div>

                    </div>

                `;


                return;

            }


            container.innerHTML =
                list
                    .map(
                        entry => {

                            const source =
                                this.getShoppingSourceLabel(
                                    entry,
                                    state
                                );


                            const safeId =
                                HomeApp.escapeHtml(
                                    entry.id
                                );


                            return `

                                <div
                                    class="
                                        shopping-row
                                        ${entry.checked ? "checked" : ""}
                                    "
                                >

                                    <input
                                        class="shopping-check"

                                        type="checkbox"

                                        data-shopping-check="${safeId}"

                                        ${entry.checked ? "checked" : ""}

                                        aria-label="Mark ${HomeApp.escapeHtml(entry.name)} as purchased"
                                    >


                                    <div class="shopping-item-main">

                                        <strong>
                                            ${HomeApp.escapeHtml(entry.name)}
                                        </strong>

                                        <span>

                                            ${HomeApp.escapeHtml(source)}

                                            ${
                                                entry.unit

                                                    ? ` · ${HomeApp.escapeHtml(entry.unit)}`

                                                    : ""
                                            }

                                        </span>

                                    </div>


                                    <div class="shopping-quantity-control">

                                        <button
                                            type="button"

                                            data-shopping-adjust="${safeId}"

                                            data-shopping-value="-1"

                                            aria-label="Decrease shopping quantity"
                                        >
                                            −
                                        </button>


                                        <strong>

                                            ${
                                                Math.max(

                                                    1,

                                                    Number(
                                                        entry.quantity
                                                    ) ||
                                                    1

                                                )
                                            }

                                        </strong>


                                        <button
                                            type="button"

                                            data-shopping-adjust="${safeId}"

                                            data-shopping-value="1"

                                            aria-label="Increase shopping quantity"
                                        >
                                            +
                                        </button>

                                    </div>


                                    <button
                                        class="shopping-remove"

                                        type="button"

                                        data-remove-shopping="${safeId}"

                                        aria-label="Remove ${HomeApp.escapeHtml(entry.name)}"
                                    >
                                        ×
                                    </button>

                                </div>

                            `;

                        }
                    )
                    .join("");

        },


        /* ========================================================
           SHOPPING SOURCE

           Seasonal must stay Seasonal.
        ======================================================== */

        getShoppingSourceLabel(
            entry,
            state
        ) {

            if (
                entry.origin ===
                "seasonal"
            ) {

                if (
                    entry.sourceLabel
                ) {

                    return entry.sourceLabel;

                }


                const seasonNames = {

                    spring:
                        "Spring Renewal",

                    summer:
                        "Summer Reset",

                    fall:
                        "Fall Refresh",

                    winter:
                        "Winter Reset"

                };


                return (

                    seasonNames[
                        entry.season
                    ] ||

                    "Seasonal Home Care"

                );

            }


            if (
                entry.sourceType ===
                "custom"
            ) {

                return "Other";

            }


            const item =
                state.inventory
                    .items
                    .find(
                        value =>
                            value.id ===
                            entry.inventoryItemId
                    );


            const zone =
                state.inventory
                    .zones
                    .find(
                        value =>
                            value.id ===
                            item?.zoneId
                    );


            return (

                zone?.name ||
                "Home Inventory"

            );

        },


        adjustShoppingQuantity(
            entryId,
            amount
        ) {

            HomeStore.update(
                state => {

                    const entry =
                        state.inventory
                            .shoppingList
                            .find(
                                item =>
                                    item.id ===
                                    entryId
                            );


                    if (
                        !entry
                    ) {

                        return;

                    }


                    entry.quantity =
                        Math.max(

                            1,

                            Number(
                                entry.quantity ||
                                1
                            ) +

                            Number(
                                amount ||
                                0
                            )

                        );


                    /*
                       A manual quantity override is intentional.
                    */

                    entry.quantityMode =
                        "manual";

                }
            );

        },


        toggleShoppingCheck(
            entryId
        ) {

            HomeStore.update(
                state => {

                    const entry =
                        state.inventory
                            .shoppingList
                            .find(
                                item =>
                                    item.id ===
                                    entryId
                            );


                    if (
                        !entry
                    ) {

                        return;

                    }


                    entry.checked =
                        !entry.checked;

                }
            );

        },


        /* ========================================================
           MARK PURCHASED

           Inventory-linked:
           purchase qty goes back into Current stock.

           Seasonal/custom:
           purchase removes it from the list.
        ======================================================== */

        markPurchased() {

            let purchasedCount =
                0;


            HomeStore.update(
                state => {

                    const purchased =
                        state.inventory
                            .shoppingList
                            .filter(
                                entry =>
                                    entry.checked
                            );


                    purchasedCount =
                        purchased.length;


                    if (
                        !purchasedCount
                    ) {

                        return;

                    }


                    purchased
                        .forEach(
                            entry => {

                                if (
                                    entry.sourceType !==
                                    "inventory"
                                ) {

                                    return;

                                }


                                const item =
                                    state.inventory
                                        .items
                                        .find(
                                            value =>
                                                value.id ===
                                                entry.inventoryItemId
                                        );


                                if (
                                    !item
                                ) {

                                    return;

                                }


                                item.current =

                                    Math.max(

                                        0,

                                        Number(
                                            item.current
                                        ) ||
                                        0

                                    ) +

                                    Math.max(

                                        1,

                                        Number(
                                            entry.quantity
                                        ) ||
                                        1

                                    );


                                item.updatedAt =
                                    new Date()
                                        .toISOString();

                            }
                        );


                    const purchasedIds =
                        new Set(

                            purchased.map(
                                entry =>
                                    entry.id
                            )

                        );


                    state.inventory
                        .shoppingList =

                        state.inventory
                            .shoppingList
                            .filter(
                                entry =>

                                    !purchasedIds
                                        .has(
                                            entry.id
                                        )
                            );


                    this.syncDerivedState(
                        state
                    );


                    if (
                        !Array.isArray(
                            state.activity
                        )
                    ) {

                        state.activity =
                            [];

                    }


                    state.activity
                        .unshift({

                            id:
                                this.makeId(
                                    "activity"
                                ),

                            type:
                                "inventory",

                            title:
                                `${purchasedCount} shopping item${purchasedCount === 1 ? "" : "s"} purchased`,

                            description:
                                "Home Inventory was updated from the shopping list.",

                            createdAt:
                                new Date()
                                    .toISOString()

                        });


                    state.activity =
                        state.activity
                            .slice(
                                0,
                                200
                            );

                }
            );


            if (
                purchasedCount
            ) {

                HomeApp.toast(

                    `${purchasedCount} item${purchasedCount === 1 ? "" : "s"} purchased. Inventory updated.`

                );

            }

        },


        removeShoppingItem(
            entryId
        ) {

            HomeStore.update(
                state => {

                    state.inventory
                        .shoppingList =

                        state.inventory
                            .shoppingList
                            .filter(
                                item =>
                                    item.id !==
                                    entryId
                            );

                }
            );


            HomeApp.toast(
                "Item removed from shopping list."
            );

        },


        setAutoRestock(
            enabled
        ) {

            HomeStore.update(
                state => {

                    state.inventory
                        .autoAddShortages =
                        Boolean(
                            enabled
                        );


                    this.syncDerivedState(
                        state
                    );

                }
            );


            HomeApp.toast(

                enabled

                    ? "HomeOS will automatically add shortages."

                    : "Automatic shortage adding is off."

            );

        },


        /* ========================================================
           ADD / EDIT INVENTORY ITEM
        ======================================================== */

        openItemDialog(
            itemId = null
        ) {

            const state =
                HomeStore.getState();


            const dialog =
                document.getElementById(
                    "inventoryItemDialog"
                );


            if (
                !dialog
            ) {

                return;

            }


            this.renderDialogZones(
                state
            );


            const idInput =
                document.getElementById(
                    "inventoryItemId"
                );


            const nameInput =
                document.getElementById(
                    "inventoryNameInput"
                );


            const zoneInput =
                document.getElementById(
                    "inventoryZoneInput"
                );


            const currentInput =
                document.getElementById(
                    "inventoryCurrentInput"
                );


            const targetInput =
                document.getElementById(
                    "inventoryTargetInput"
                );


            const unitInput =
                document.getElementById(
                    "inventoryUnitInput"
                );


            const categoryInput =
                document.getElementById(
                    "inventoryCategoryInput"
                );


            if (
                !idInput ||
                !nameInput ||
                !zoneInput ||
                !currentInput ||
                !targetInput ||
                !unitInput ||
                !categoryInput
            ) {

                return;

            }


            idInput.value =
                "";


            nameInput.value =
                "";


            zoneInput.value =
                this.selectedZone;


            currentInput.value =
                0;


            targetInput.value =
                1;


            unitInput.value =
                "";


            categoryInput.value =
                "";


            this.setText(

                "inventoryDialogTitle",

                "Add inventory item"

            );


            if (
                itemId
            ) {

                const item =
                    state.inventory
                        .items
                        .find(
                            value =>
                                value.id ===
                                itemId
                        );


                if (
                    item
                ) {

                    idInput.value =
                        item.id;


                    nameInput.value =
                        item.name;


                    zoneInput.value =
                        item.zoneId;


                    currentInput.value =
                        item.current;


                    targetInput.value =
                        item.target;


                    unitInput.value =
                        item.unit ||
                        "";


                    categoryInput.value =
                        item.category ||
                        "";


                    this.setText(

                        "inventoryDialogTitle",

                        "Edit inventory item"

                    );

                }

            }


            dialog.showModal();


            requestAnimationFrame(
                () => {

                    nameInput.focus();

                }
            );

        },


        saveItem() {

            const idInput =
                document.getElementById(
                    "inventoryItemId"
                );


            const nameInput =
                document.getElementById(
                    "inventoryNameInput"
                );


            const zoneInput =
                document.getElementById(
                    "inventoryZoneInput"
                );


            const currentInput =
                document.getElementById(
                    "inventoryCurrentInput"
                );


            const targetInput =
                document.getElementById(
                    "inventoryTargetInput"
                );


            const unitInput =
                document.getElementById(
                    "inventoryUnitInput"
                );


            const categoryInput =
                document.getElementById(
                    "inventoryCategoryInput"
                );


            if (
                !idInput ||
                !nameInput ||
                !zoneInput ||
                !currentInput ||
                !targetInput ||
                !unitInput ||
                !categoryInput
            ) {

                return false;

            }


            const id =
                idInput.value;


            const name =
                nameInput.value
                    .trim();


            const zoneId =
                zoneInput.value;


            const current =
                Math.max(

                    0,

                    Number(
                        currentInput.value
                    ) ||
                    0

                );


            const target =
                Math.max(

                    1,

                    Number(
                        targetInput.value
                    ) ||
                    1

                );


            const unit =
                unitInput.value
                    .trim();


            const category =
                categoryInput.value
                    .trim();


            if (
                !name
            ) {

                HomeApp.toast(
                    "Give the inventory item a name first."
                );


                nameInput.focus();


                return false;

            }


            if (
                !this.ZONES.some(
                    zone =>
                        zone.id ===
                        zoneId
                )
            ) {

                HomeApp.toast(
                    "Choose a valid storage zone."
                );


                return false;

            }


            const duplicate =
                HomeStore.getState()
                    .inventory
                    .items
                    .find(
                        item =>

                            item.id !==
                                id &&

                            item.zoneId ===
                                zoneId &&

                            String(
                                item.name ||
                                ""
                            )
                                .trim()
                                .toLowerCase() ===

                            name
                                .toLowerCase()
                    );


            if (
                duplicate
            ) {

                HomeApp.toast(
                    `${name} is already tracked in this storage zone.`
                );


                nameInput.focus();


                return false;

            }


            this.selectedZone =
                zoneId;


            this.searchTerm =
                "";


            const search =
                document.getElementById(
                    "inventorySearch"
                );


            if (
                search
            ) {

                search.value =
                    "";

            }


            HomeStore.update(
                state => {

                    if (
                        id
                    ) {

                        const item =
                            state.inventory
                                .items
                                .find(
                                    value =>
                                        value.id ===
                                        id
                                );


                        if (
                            item
                        ) {

                            item.name =
                                name;


                            item.zoneId =
                                zoneId;


                            item.current =
                                current;


                            item.target =
                                target;


                            item.unit =
                                unit;


                            item.category =
                                category;


                            item.updatedAt =
                                new Date()
                                    .toISOString();

                        }

                    }


                    else {

                        state.inventory
                            .items
                            .push({

                                id:
                                    this.makeId(
                                        "inventory"
                                    ),

                                zoneId,

                                name,

                                category,

                                current,

                                target,

                                unit,

                                createdAt:
                                    new Date()
                                        .toISOString(),

                                updatedAt:
                                    new Date()
                                        .toISOString()

                            });

                    }


                    state.inventory
                        .selectedZone =
                        zoneId;


                    this.syncDerivedState(
                        state
                    );

                }
            );


            HomeApp.toast(

                id

                    ? `${name} updated.`

                    : `${name} added to Home Inventory.`

            );


            return true;

        },


        deleteItem(
            itemId
        ) {

            const state =
                HomeStore.getState();


            const item =
                state.inventory
                    .items
                    .find(
                        value =>
                            value.id ===
                            itemId
                    );


            if (
                !item
            ) {

                return;

            }


            if (
                !window.confirm(

                    `Delete ${item.name} from Home Inventory?`

                )
            ) {

                return;

            }


            HomeStore.update(
                store => {

                    store.inventory.items =
                        store.inventory
                            .items
                            .filter(
                                value =>
                                    value.id !==
                                    itemId
                            );


                    this.syncDerivedState(
                        store
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
                                this.makeId(
                                    "activity"
                                ),

                            type:
                                "inventory",

                            title:
                                `${item.name} removed from inventory`,

                            description:
                                "A tracked Home Inventory item was removed.",

                            createdAt:
                                new Date()
                                    .toISOString()

                        });


                    store.activity =
                        store.activity
                            .slice(
                                0,
                                200
                            );

                }
            );


            HomeApp.toast(

                `${item.name} removed from Home Inventory.`

            );

        },


        /* ========================================================
           HEALTH MATH
        ======================================================== */

        calculateZoneHealth(
            items
        ) {

            if (
                !Array.isArray(
                    items
                ) ||
                !items.length
            ) {

                return 100;

            }


            return this.calculateInventoryHealth(
                items
            );

        },


        calculateInventoryHealth(
            items
        ) {

            const tracked =
                (
                    Array.isArray(
                        items
                    )

                        ? items

                        : []
                )
                    .filter(
                        item =>

                            Number(
                                item.target
                            ) >
                            0
                    );


            if (
                !tracked.length
            ) {

                return 100;

            }


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

        },


        /* ========================================================
           DIALOG STORAGE NODES
        ======================================================== */

        renderDialogZones(
            state
        ) {

            const select =
                document.getElementById(
                    "inventoryZoneInput"
                );


            if (
                !select
            ) {

                return;

            }


            const previousValue =
                select.value;


            select.innerHTML =
                state.inventory
                    .zones
                    .map(
                        zone => `

                            <option
                                value="${HomeApp.escapeHtml(zone.id)}"
                            >
                                ${HomeApp.escapeHtml(zone.name)}
                            </option>

                        `
                    )
                    .join("");


            if (
                previousValue &&
                state.inventory
                    .zones
                    .some(
                        zone =>
                            zone.id ===
                            previousValue
                    )
            ) {

                select.value =
                    previousValue;

            }


            else if (
                state.inventory
                    .zones
                    .some(
                        zone =>
                            zone.id ===
                            this.selectedZone
                    )
            ) {

                select.value =
                    this.selectedZone;

            }

        },


        /* ========================================================
           COPY SHOPPING LIST
        ======================================================== */

        async copyShoppingList() {

            const state =
                HomeStore.getState();


            const list =
                state.inventory
                    .shoppingList;


            if (
                !list.length
            ) {

                HomeApp.toast(
                    "There is nothing on the shopping list yet."
                );


                return;

            }


            const grouped =
                {};


            list.forEach(
                entry => {

                    const group =
                        this.getShoppingSourceLabel(
                            entry,
                            state
                        );


                    if (
                        !grouped[
                            group
                        ]
                    ) {

                        grouped[
                            group
                        ] =
                            [];

                    }


                    grouped[
                        group
                    ]
                        .push(
                            entry
                        );

                }
            );


            const lines = [

                "DARLING HomeOS Shopping List",

                ""

            ];


            Object.entries(
                grouped
            )
                .forEach(
                    (
                        [
                            group,
                            items
                        ]
                    ) => {

                        lines.push(
                            group.toUpperCase()
                        );


                        items.forEach(
                            item => {

                                lines.push(

                                    `- ${item.name} × ${Math.max(1, Number(item.quantity) || 1)}${item.unit ? ` ${item.unit}` : ""}`

                                );

                            }
                        );


                        lines.push(
                            ""
                        );

                    }
                );


            const copied =
                await this.copyText(

                    lines.join(
                        "\n"
                    )

                );


            HomeApp.toast(

                copied

                    ? "Shopping list copied."

                    : "Your browser did not allow automatic copying."

            );

        },


        async copyText(
            text
        ) {

            try {

                if (
                    navigator.clipboard
                        ?.writeText
                ) {

                    await navigator.clipboard
                        .writeText(
                            text
                        );


                    return true;

                }

            }


            catch (
                error
            ) {

                console.warn(

                    "DARLING HomeOS clipboard API unavailable:",

                    error

                );

            }


            try {

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    text;


                textarea.setAttribute(
                    "readonly",
                    ""
                );


                textarea.style.position =
                    "fixed";


                textarea.style.opacity =
                    "0";


                document.body
                    .appendChild(
                        textarea
                    );


                textarea.select();


                const copied =
                    document.execCommand(
                        "copy"
                    );


                textarea.remove();


                return copied;

            }


            catch (
                error
            ) {

                console.warn(

                    "DARLING HomeOS clipboard fallback error:",

                    error

                );


                return false;

            }

        },


        /* ========================================================
           EVENTS
        ======================================================== */

        bindEvents() {

            document.addEventListener(
                "click",
                event => {

                    /* SELECT NODE */

                    const zone =
                        event.target.closest(
                            "[data-inventory-zone]"
                        );


                    if (
                        zone
                    ) {

                        const zoneId =
                            zone.dataset
                                .inventoryZone;


                        this.selectedZone =
                            zoneId;


                        this.searchTerm =
                            "";


                        const search =
                            document.getElementById(
                                "inventorySearch"
                            );


                        if (
                            search
                        ) {

                            search.value =
                                "";

                        }


                        HomeStore.update(
                            state => {

                                state.inventory
                                    .selectedZone =
                                    zoneId;

                            }
                        );


                        requestAnimationFrame(
                            () => {

                                document
                                    .getElementById(
                                        "inventoryWorkspace"
                                    )
                                    ?.scrollIntoView({

                                        behavior:
                                            "smooth",

                                        block:
                                            "start"

                                    });

                            }
                        );


                        return;

                    }


                    /* ADD INVENTORY ITEM */

                    if (
                        event.target.closest(
                            "#heroAddItemButton"
                        ) ||

                        event.target.closest(
                            "#addInventoryItemButton"
                        ) ||

                        event.target.closest(
                            "[data-open-inventory-item]"
                        )
                    ) {

                        this.openItemDialog();


                        return;

                    }


                    /* HERO SHOPPING */

                    if (
                        event.target.closest(
                            "#heroShoppingButton"
                        )
                    ) {

                        this.scrollToShopping();


                        return;

                    }


                    /* INVENTORY GUIDE */

                    const guide =
                        event.target.closest(
                            "#inventoryGuideAction"
                        );


                    if (
                        guide
                    ) {

                        const action =
                            guide.dataset
                                .inventoryGuideAction;


                        if (
                            action ===
                            "purchase"
                        ) {

                            this.markPurchased();

                        }


                        else if (
                            action ===
                                "shortages" ||

                            action ===
                                "shopping"
                        ) {

                            this.scrollToShopping();

                        }


                        else {

                            this.openItemDialog();

                        }


                        return;

                    }


                    /* CURRENT QUANTITY */

                    const adjustment =
                        event.target.closest(
                            "[data-adjust-item]"
                        );


                    if (
                        adjustment
                    ) {

                        this.adjustItem(

                            adjustment.dataset
                                .adjustItem,

                            Number(
                                adjustment.dataset
                                    .adjustValue
                            )

                        );


                        return;

                    }


                    /* ADD SHORTAGE */

                    const shortage =
                        event.target.closest(
                            "[data-add-shortage]"
                        );


                    if (
                        shortage
                    ) {

                        this.addShortage(

                            shortage.dataset
                                .addShortage

                        );


                        return;

                    }


                    /* EDIT ITEM */

                    const edit =
                        event.target.closest(
                            "[data-edit-item]"
                        );


                    if (
                        edit
                    ) {

                        this.openItemDialog(

                            edit.dataset
                                .editItem

                        );


                        return;

                    }


                    /* DELETE ITEM */

                    const deleteItem =
                        event.target.closest(
                            "[data-delete-item]"
                        );


                    if (
                        deleteItem
                    ) {

                        this.deleteItem(

                            deleteItem.dataset
                                .deleteItem

                        );


                        return;

                    }


                    /* ADD ALL SHORTAGES */

                    if (
                        event.target.closest(
                            "#addAllShortagesButton"
                        )
                    ) {

                        this.addAllShortages();


                        return;

                    }


                    /* ADD CUSTOM SHOPPING */

                    if (
                        event.target.closest(
                            "#addCustomShoppingButton"
                        )
                    ) {

                        this.addCustomShoppingItem();


                        return;

                    }


                    /* SHOPPING QTY */

                    const shoppingAdjust =
                        event.target.closest(
                            "[data-shopping-adjust]"
                        );


                    if (
                        shoppingAdjust
                    ) {

                        this.adjustShoppingQuantity(

                            shoppingAdjust.dataset
                                .shoppingAdjust,

                            Number(
                                shoppingAdjust.dataset
                                    .shoppingValue
                            )

                        );


                        return;

                    }


                    /* REMOVE SHOPPING */

                    const remove =
                        event.target.closest(
                            "[data-remove-shopping]"
                        );


                    if (
                        remove
                    ) {

                        this.removeShoppingItem(

                            remove.dataset
                                .removeShopping

                        );


                        return;

                    }


                    /* PURCHASE */

                    if (
                        event.target.closest(
                            "#markPurchasedButton"
                        )
                    ) {

                        this.markPurchased();


                        return;

                    }


                    /* COPY LIST */

                    if (
                        event.target.closest(
                            "#copyShoppingListButton"
                        )
                    ) {

                        this.copyShoppingList();


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

                    }

                }
            );


            /* SEARCH */

            document
                .getElementById(
                    "inventorySearch"
                )
                ?.addEventListener(
                    "input",
                    event => {

                        this.searchTerm =
                            event.target
                                .value
                                .trim();


                        this.renderItems(
                            HomeStore.getState()
                        );

                    }
                );


            /* AUTO RESTOCK */

            document
                .getElementById(
                    "autoRestockToggle"
                )
                ?.addEventListener(
                    "change",
                    event => {

                        this.setAutoRestock(

                            event.target
                                .checked

                        );

                    }
                );


            /* SHOPPING CHECKS */

            document.addEventListener(
                "change",
                event => {

                    const checkbox =
                        event.target.closest(
                            "[data-shopping-check]"
                        );


                    if (
                        checkbox
                    ) {

                        this.toggleShoppingCheck(

                            checkbox.dataset
                                .shoppingCheck

                        );

                    }

                }
            );


            /* SAVE INVENTORY ITEM */

            document
                .getElementById(
                    "inventoryItemForm"
                )
                ?.addEventListener(
                    "submit",
                    event => {

                        event.preventDefault();


                        if (
                            this.saveItem()
                        ) {

                            document
                                .getElementById(
                                    "inventoryItemDialog"
                                )
                                ?.close();

                        }

                    }
                );


            /* ENTER = ADD CUSTOM SHOPPING */

            document
                .getElementById(
                    "customShoppingName"
                )
                ?.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            event.preventDefault();


                            this.addCustomShoppingItem();

                        }

                    }
                );

        },


        scrollToShopping() {

            document
                .getElementById(
                    "shoppingSection"
                )
                ?.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });

        },


        makeId(
            prefix
        ) {

            if (
                typeof crypto !==
                    "undefined" &&

                typeof crypto.randomUUID ===
                    "function"
            ) {

                return (

                    `${prefix}-${crypto.randomUUID()}`

                );

            }


            return (

                `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

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


    window.InventoryApp =
        InventoryApp;


    InventoryApp.init();

});