// =========================
// Supabase Configuration
// =========================
const supabaseUrl = "https://moznduclvknvvjcaehps.supabase.co";
const supabaseKey = "sb_publishable_3HWPGbgcy2GuqglpOpAk0A_5niK2XWd";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// Check if Supabase loaded correctly
console.log("window.supabase =", window.supabase);
console.log("supabase client =", supabase);
console.log("supabase.auth =", supabase.auth);

// =========================
// Register User
// =========================
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

    alert("✅ Account created successfully!");

    console.log(data);

  } catch (err) {

    console.error(err);
    alert(err.message);

  }

}

// =========================
// Login User
// =========================
async function doLogin() {

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-pass").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email: email,
        password: password

      });

    if (error) {
      throw error;
    }

    alert("✅ Login Successful!");

    console.log(data);

  } catch (err) {

    console.error(err);
    alert(err.message);

  }

}

// =========================
// Logout
// =========================
async function logout() {

  await supabase.auth.signOut();

  alert("Logged out.");

}
