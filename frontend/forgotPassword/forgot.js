const form = document.getElementById("forgot-form");
const baseURL = "http://localhost:3000/password/forgotpassword"

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const response = await axios.post(baseURL, { email });
    alert(response.data.message || "Reset link sent to your email.");
    form.reset();
  } catch (err) {
    console.error("Forgot password error:", err);
    alert(err.response?.data?.message || "Failed to send reset link.");
  }
});
