/* =========================================================
   DARLING HomeOS
   Authentication Service
   ========================================================= */

(function () {
  "use strict";

  window.HomeOS = window.HomeOS || {};

  if (!window.HomeOS.supabase) {
    console.error(
      "DARLING HomeOS: Authentication could not start because Supabase is unavailable."
    );
    return;
  }

  const supabase = window.HomeOS.supabase;

  /* ---------------------------------------------------------
     Get the current authentication session
     --------------------------------------------------------- */

  async function getSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(
        "DARLING HomeOS: Unable to retrieve authentication session.",
        error
      );
    }

    return {
      session: data?.session || null,
      error
    };
  }

  /* ---------------------------------------------------------
     Get the currently authenticated user
     --------------------------------------------------------- */

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return {
        user: null,
        error
      };
    }

    return {
      user: data?.user || null,
      error: null
    };
  }

  /* ---------------------------------------------------------
     Create a HomeOS account
     --------------------------------------------------------- */

  async function signUp(email, password, displayName = "") {
    const redirectUrl =
      new URL("login.html?confirmed=true", window.location.href).href;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        emailRedirectTo: redirectUrl,

        data: {
          display_name: displayName
        }
      }
    });

    return {
      data,
      error
    };
  }

  /* ---------------------------------------------------------
     Sign into HomeOS
     --------------------------------------------------------- */

  async function signIn(email, password) {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    return {
      data,
      error
    };
  }

  /* ---------------------------------------------------------
     Sign out of HomeOS
     --------------------------------------------------------- */

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    return {
      error
    };
  }

  /* ---------------------------------------------------------
     Watch for authentication changes
     --------------------------------------------------------- */

  function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
  }

  /* ---------------------------------------------------------
     Make authentication available throughout HomeOS
     --------------------------------------------------------- */

  window.HomeOS.auth = {
    getSession,
    getUser,
    signUp,
    signIn,
    signOut,
    onAuthStateChange
  };

  console.log(
    "DARLING HomeOS: Authentication service initialized."
  );
})();