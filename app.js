// ===============================
// CloudLens - Supabase Connection
// ===============================

console.log("App.js loaded");

// Check if Supabase SDK is loaded
console.log("window.supabase =", window.supabase);

if (!window.supabase) {
    alert("❌ Supabase library did not load.");

    throw new Error("Supabase SDK not loaded");
}

// ===============================
// Supabase Configuration
// ===============================

const supabaseUrl = "https://moznduclvknvvjcaehps.supabase.co";

const supabaseKey =
"sb_publishable_3HWPGbgcy2GuqglpOpAk0A_5niK2XWd";

const supabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("Supabase client =", supabase);
console.log("Supabase auth =", supabase.auth);

// ===============================
// Register
// ===============================

async function doRegister() {

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-pass").value;

    if (!name || !email || !password) {
        alert("Please fill in all the fields.");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    try {

        const { data, error } = await supabase.auth.signUp({

            email: email,
            password: password,

            options: {
                data: {
                    full_name: name
                }
            }

        });

        if (error) {
            throw error;
        }

        console.log(data);

        alert("✅ Registration successful!");

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

// ===============================
// Login
// ===============================

async function doLogin() {

    const email = document.getElementById("login-email").value.trim();

    const password = document.getElementById("login-pass").value;

    try {

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email,
                password

            });

        if (error) throw error;

        console.log(data);

        alert("✅ Login Successful!");

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}

// ===============================
// Logout
// ===============================

async function logout() {

    await supabase.auth.signOut();

    alert("Logged Out");

}
