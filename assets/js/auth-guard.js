/* =========================================================
   DARLING HomeOS
   Authentication Guard
   ========================================================= */

/*
  PURPOSE
  ---------------------------------------------------------

  This file protects HomeOS pages that should only be
  available to authenticated users.

  The flow is:

      Protected Page
           ↓
      auth-guard.js
           ↓
      Check Supabase session
           ↓
       Session exists?
         ↓         ↓
        YES       NO
         ↓         ↓
      Continue   login.html

  IMPORTANT:

  This protects the USER EXPERIENCE by preventing logged-out
  users from remaining inside application pages.

  Later, PostgreSQL Row Level Security (RLS) will provide
  the REAL database security.

  Even if someone bypassed this JavaScript guard manually,
  RLS will prevent them from accessing household data.
*/


(function () {
  "use strict";


  /* ---------------------------------------------------------
     MAKE SURE AUTHENTICATION SERVICE EXISTS
     --------------------------------------------------------- */

  if (!window.HomeOS?.auth) {

    console.error(
      "DARLING HomeOS: Auth guard could not start because the authentication service is unavailable."
    );

    return;
  }


  /* ---------------------------------------------------------
     CHECK WHETHER USER IS AUTHENTICATED
     --------------------------------------------------------- */

  async function protectPage() {

    /*
      Ask our shared authentication service whether the
      browser currently has a Supabase session.
    */

    const { session, error } =
      await window.HomeOS.auth.getSession();


    /* -------------------------------------------------------
       HANDLE AUTH CHECK ERROR
       ------------------------------------------------------- */

    if (error) {

      console.error(
        "DARLING HomeOS: Unable to verify authentication.",
        error
      );

      /*
        If we cannot safely determine whether someone is
        authenticated, send them back to login.

        This gives us a safer "deny by default" behavior.
      */

     window.location.replace(LOGIN_URL);

      return;
    }

    /* ---------------------------------------------------------
        FIND THE HOMEOS ROOT URL
        --------------------------------------------------------- */

    /*
        auth-guard.js always lives here:

            assets/js/auth-guard.js

        document.currentScript.src gives us the full URL
        of THIS JavaScript file.

        From there, ../../ takes us back to the HomeOS root.

        This works whether HomeOS is running from:

            localhost

        or:

            GitHub Pages

        and it also works regardless of which HTML folder
        loaded the guard.
    */

    const HOMEOS_ROOT =
        new URL("../../", document.currentScript.src);

    const LOGIN_URL =
        new URL("login.html", HOMEOS_ROOT).href;


    /* -------------------------------------------------------
       NO SESSION = NOT LOGGED IN
       ------------------------------------------------------- */

    if (!session) {

      console.log(
        "DARLING HomeOS: No active session. Redirecting to login."
      );


      /*
        location.replace() is intentional.

        replace() removes the protected page from this point
        in browser history.

        This is better than:

            window.location.href = "login.html";

        because pressing the browser Back button should not
        simply return a logged-out user to the protected page.
      */

      window.location.replace(LOGIN_URL);

      return;
    }


    /* -------------------------------------------------------
       SESSION EXISTS
       ------------------------------------------------------- */

    console.log(
      "DARLING HomeOS: Authenticated session verified."
    );

  }


  /* ---------------------------------------------------------
     RUN THE AUTHENTICATION CHECK
     --------------------------------------------------------- */

  protectPage();

})();