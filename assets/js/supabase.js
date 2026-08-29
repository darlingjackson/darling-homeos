/* ======================================================
DARLING HomeOS
Supabase Client
======================================================== */

(function () {
    "use strick";

    const SUPABASE_URL =
        "https://rlkkvtudsteditljgnpw.supabase.co";

        const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_X5fiwltI6lso9sJGYYz2TA_ElUAg5ab";
    if (!window.supabase) {
        console.error(
        "DARLING HomeOS: Supabase library was not loaded."
        );
        return;
    }

    window.HomeOS = window.HomeOS || {};

    window.HomeOS.supabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    console.log(
        "DARLING HomeOS: Supabase client initialized."
    );
})();