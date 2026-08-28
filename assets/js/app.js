/* ================================================================
   DARLING HOMEOS
   UNIVERSAL APP UTILITIES
================================================================ */

(function () {

    const HomeApp = {

        toastTimer: null,


        /* ========================================================
           FORMAT DATE
        ======================================================== */

        formatDate(
            date = new Date()
        ) {

            return new Intl
                .DateTimeFormat(
                    "en-US",
                    {
                        weekday:
                            "long",

                        month:
                            "long",

                        day:
                            "numeric"
                    }
                )
                .format(date);

        },


        formatTime(
            date = new Date()
        ) {

            return new Intl
                .DateTimeFormat(
                    "en-US",
                    {
                        hour:
                            "numeric",

                        minute:
                            "2-digit"
                    }
                )
                .format(date);

        },


        getGreeting(
            date = new Date()
        ) {

            const hour =
                date.getHours();


            if (hour < 12) {
                return "Good morning";
            }


            if (hour < 17) {
                return "Good afternoon";
            }


            return "Good evening";

        },


        getDayCode(
            date = new Date()
        ) {

            return new Intl
                .DateTimeFormat(
                    "en-US",
                    {
                        weekday:
                            "short"
                    }
                )
                .format(date)
                .toUpperCase();

        },


        /* ========================================================
           STATUS
        ======================================================== */

        getHomeStatus(
            score
        ) {

            if (score >= 85) {
                return "SETTLED";
            }


            if (score >= 72) {
                return "STEADY";
            }


            if (score >= 55) {
                return "ACTIVE";
            }


            return "NEEDS ATTENTION";

        },


        getSuggestedCleaningLevel(
            zone
        ) {

            if (
                zone.progress <
                65
            ) {
                return "DEEP";
            }


            if (
                zone.progress <
                82
            ) {
                return "STANDARD";
            }


            return "QUICK";

        },


        /* ========================================================
           TIME AGO
        ======================================================== */

        formatLastCompleted(
            dateString
        ) {

            if (!dateString) {
                return "NOT TRACKED";
            }


            const days =
                HomeStore.daysSince(
                    dateString
                );


            if (days === 0) {
                return "TODAY";
            }


            if (days === 1) {
                return "YESTERDAY";
            }


            return `${days} DAYS AGO`;

        },


        /* ========================================================
           LAUNDRY
        ======================================================== */

        laundryStageLabel(
            stage
        ) {

            const labels = {

                wash:
                    "Wash",

                dry:
                    "Dry",

                fold:
                    "Fold",

                "put-away":
                    "Put Away"

            };


            return labels[
                stage
            ] || stage;

        },


        /* ========================================================
           TOAST
        ======================================================== */

        toast(message) {

            const toast =
                document.getElementById(
                    "appToast"
                );


            if (!toast) {
                return;
            }


            toast.textContent =
                message;


            toast.classList.add(
                "show"
            );


            clearTimeout(
                this.toastTimer
            );


            this.toastTimer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    3000
                );

        },


        /* ========================================================
           ESCAPE
        ======================================================== */

        escapeHtml(value) {

            return String(value)

                .replaceAll(
                    "&",
                    "&amp;"
                )

                .replaceAll(
                    "<",
                    "&lt;"
                )

                .replaceAll(
                    ">",
                    "&gt;"
                )

                .replaceAll(
                    '"',
                    "&quot;"
                )

                .replaceAll(
                    "'",
                    "&#039;"
                );

        }

    };


    window.HomeApp =
        HomeApp;

})();