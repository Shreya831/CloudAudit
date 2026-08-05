const supabaseUrl = "https://giokargxqyjraxitbehi.supabase.co";
const supabaseKey = "sb_publishable_LHNsm-LxWaN39CJa3_hcAA_jBdEgGrv";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

async function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value;

  if (!name || !email || !password) {
    alert("Please fill in all the fields.");
    return;
  }

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
    alert(error.message);
    return;
  }

  alert("Account created successfully! Please check your email to verify your account.");
}

