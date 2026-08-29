/* ================================================================
   DARLING HOMEOS
   AUTHENTICATION PAGE UI

   Handles:
   - Login form
   - Signup form
   - Confirmation messages

   Supabase authentication itself remains inside auth.js.
================================================================ */

(function () {
    "use strict";


    /* ============================================================
       LOGIN
    ============================================================ */

    const loginForm =
        document.getElementById(
            "login-form"
        );


    if (loginForm) {

        const button =
            document.getElementById(
                "login-button"
            );

        const message =
            document.getElementById(
                "login-message"
            );


        const params =
            new URLSearchParams(
                window.location.search
            );


        if (
            params.get("confirmed") ===
            "true"
        ) {

            message.textContent =
                "Email confirmed. You can now sign in.";

            message.classList.add(
                "success"
            );

        }


        loginForm.addEventListener(
            "submit",

            async event => {

                event.preventDefault();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                button.disabled = true;

                button.textContent =
                    "Signing In...";


                message.textContent = "";

                message.classList.remove(
                    "error",
                    "success"
                );


                const { error } =
                    await window.HomeOS.auth.signIn(
                        email,
                        password
                    );


                if (error) {

                    message.textContent =
                        error.message;

                    message.classList.add(
                        "error"
                    );

                    button.disabled = false;

                    button.textContent =
                        "Sign In";

                    return;
                }


                window.location.replace(
                    "index.html"
                );

            }
        );

    }



    /* ============================================================
       SIGNUP
    ============================================================ */

    const signupForm =
        document.getElementById(
            "signup-form"
        );


    if (signupForm) {

        const button =
            document.getElementById(
                "signup-button"
            );

        const message =
            document.getElementById(
                "signup-message"
            );


        signupForm.addEventListener(
            "submit",

            async event => {

                event.preventDefault();


                const displayName =
                    document
                        .getElementById(
                            "display-name"
                        )
                        .value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "email"
                        )
                        .value
                        .trim();


                const password =
                    document
                        .getElementById(
                            "password"
                        )
                        .value;


                button.disabled = true;

                button.textContent =
                    "Creating Account...";


                message.textContent = "";

                message.classList.remove(
                    "error",
                    "success"
                );


                const { error } =
                    await window.HomeOS.auth.signUp(
                        email,
                        password,
                        displayName
                    );


                if (error) {

                    message.textContent =
                        error.message;

                    message.classList.add(
                        "error"
                    );

                    button.disabled = false;

                    button.textContent =
                        "Create Account";

                    return;
                }


                signupForm.reset();


                message.textContent =
                    "Account created. Check your email to confirm your account.";

                message.classList.add(
                    "success"
                );

            }
        );

    }

})();