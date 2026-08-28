/* ================================================================
   DARLING HOMEOS
   SHARED APPLICATION SHELL

   OWNS:
   - HomeOS branding
   - Main navigation
   - Active navigation state
   - Theme control
   - Shared footer

   DOES NOT OWN:
   - Dashboard
   - Daily Rhythm
   - Cleaning
   - Laundry
   - Inventory
   - Seasonal

   ONE SHELL.
   ONE NAVIGATION.
   ONE HOMEOS IDENTITY.
================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const HomeShell = {
        BRAND_ICON:
            "assets/images/branding/homeos-icon.png",

        NAV_ITEMS: [
            {
                id: "dashboard",
                href: "index.html",
                label: "Dashboard"
            },
            {
                id: "daily",
                href: "daily.html",
                label: "Rhythm"
            },
            {
                id: "cleaning",
                href: "cleaning.html",
                label: "Cleaning"
            },
            {
                id: "laundry",
                href: "laundry.html",
                label: "Laundry"
            },
            {
                id: "inventory",
                href: "inventory.html",
                label: "Inventory"
            },
            {
                id: "seasonal",
                href: "seasonal.html",
                label: "Seasonal"
            }
        ],

        init() {
            if (!window.HomeStore) {
                console.error(
                    "DARLING HomeOS shell requires HomeStore."
                );

                return;
            }

            const state =
                HomeStore.getState();

            this.renderHeader();
            this.renderFooter();
            this.applyTheme(state);

            this.bindEvents();
            this.bindStateEvents();
        },

        /* ============================================================
           HEADER
        ============================================================ */

        renderHeader() {
            const header =
                document.getElementById(
                    "appHeader"
                );

            if (!header) {
                return;
            }

            const page =
                document.body.dataset.page ||
                "dashboard";

            header.className =
                "app-header";

            header.innerHTML = `
                <div class="app-header-inner">

                    <a
                        href="index.html"
                        class="app-brand"
                        aria-label="DARLING HomeOS Dashboard"
                    >
                        <span
                            class="brand-mark"
                            id="homeOSBrandMark"
                        >
                            <img
                                src="${this.BRAND_ICON}"
                                alt=""
                                class="brand-homeos-icon"
                                id="brandHomeOSIcon"
                            >

                            <span
                                class="brand-fallback"
                                id="brandFallback"
                                aria-hidden="true"
                            >
                                ⌂
                            </span>
                        </span>

                        <span class="brand-copy">
                            <span class="brand-name">
                                DARLING
                            </span>

                            <span class="brand-system">
                                HomeOS
                            </span>
                        </span>
                    </a>

                    <nav
                        class="app-nav"
                        aria-label="Main HomeOS navigation"
                    >
                        ${this.renderNavigation(page)}
                    </nav>

                    <div class="header-actions">

                        <span
                            class="homeos-online"
                            title="HomeOS local memory is online"
                        >
                            <span
                                class="homeos-online-dot"
                                aria-hidden="true"
                            ></span>

                            HomeOS Online
                        </span>

                        <button
                            class="icon-button"
                            id="themeToggle"
                            type="button"
                            aria-label="Toggle HomeOS appearance"
                            title="Toggle appearance"
                        >
                            ◐
                        </button>

                    </div>

                </div>
            `;

            this.bindBrandFallback();
        },

        /* ============================================================
           NAVIGATION
        ============================================================ */

        renderNavigation(currentPage) {
            return this.NAV_ITEMS
                .map(
                    item =>
                        this.navLink(
                            item,
                            currentPage
                        )
                )
                .join("");
        },

        navLink(item, currentPage) {
            const active =
                currentPage ===
                item.id;

            return `
                <a
                    href="${item.href}"
                    class="
                        app-nav-link
                        ${active ? "active" : ""}
                    "
                    ${
                        active
                            ? 'aria-current="page"'
                            : ""
                    }
                >
                    ${item.label}
                </a>
            `;
        },

        /* ============================================================
           BRAND FALLBACK
        ============================================================ */

        bindBrandFallback() {
            const image =
                document.getElementById(
                    "brandHomeOSIcon"
                );

            const fallback =
                document.getElementById(
                    "brandFallback"
                );

            const mark =
                document.getElementById(
                    "homeOSBrandMark"
                );

            if (
                !image ||
                !fallback
            ) {
                return;
            }

            const showBrand = () => {
                fallback.style
                    .removeProperty(
                        "display"
                    );

                mark?.classList.remove(
                    "brand-image-missing"
                );
            };

            const showFallback = () => {
                image.style.display =
                    "none";

                fallback.style.setProperty(
                    "display",
                    "grid",
                    "important"
                );

                mark?.classList.add(
                    "brand-image-missing"
                );

                console.warn(
                    `DARLING HomeOS could not load the brand icon at: ${this.BRAND_ICON}`
                );
            };

            image.addEventListener(
                "load",
                showBrand
            );

            image.addEventListener(
                "error",
                showFallback
            );

            /*
               Cached images may finish before the listeners
               are attached.
            */
            if (
                image.complete &&
                image.naturalWidth === 0
            ) {
                showFallback();
            }
        },

        /* ============================================================
           THEME
        ============================================================ */

        applyTheme(providedState = null) {
            const state =
                providedState ||
                HomeStore.getState();

            const dark =
                state.settings?.theme ===
                "dark";

            document.body.classList.toggle(
                "dark",
                dark
            );

            const button =
                document.getElementById(
                    "themeToggle"
                );

            if (!button) {
                return;
            }

            button.setAttribute(
                "aria-pressed",
                String(dark)
            );

            button.setAttribute(
                "aria-label",
                dark
                    ? "Switch to light appearance"
                    : "Switch to dark appearance"
            );

            button.title =
                dark
                    ? "Switch to light appearance"
                    : "Switch to dark appearance";
        },

        toggleTheme() {
            const state =
                HomeStore.getState();

            const current =
                state.settings?.theme ===
                    "dark"
                    ? "dark"
                    : "light";

            HomeStore.setTheme(
                current === "dark"
                    ? "light"
                    : "dark"
            );
        },

        /* ============================================================
           FOOTER
        ============================================================ */

        renderFooter() {
            const footer =
                document.getElementById(
                    "appFooter"
                );

            if (!footer) {
                return;
            }

            footer.className =
                "app-footer";

            footer.innerHTML = `
                <span>
                    DARLING // HOME INTELLIGENCE
                </span>

                <span>
                    LOCAL HOME MEMORY ONLINE
                </span>
            `;
        },

        /* ============================================================
           SHARED STATE
        ============================================================ */

        bindStateEvents() {
            window.addEventListener(
                "homeos:statechange",
                event => {
                    this.applyTheme(
                        event.detail ||
                        HomeStore.getState()
                    );
                }
            );
        },

        /* ============================================================
           SHARED EVENTS
        ============================================================ */

        bindEvents() {
            document.addEventListener(
                "click",
                event => {
                    if (
                        event.target.closest(
                            "#themeToggle"
                        )
                    ) {
                        this.toggleTheme();
                    }
                }
            );
        }
    };

    window.HomeShell =
        HomeShell;

    HomeShell.init();
});