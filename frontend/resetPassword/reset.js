// const reset_URL = 'http://localhost:3000'

const reset_URL = ""

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("reset-form");

    // Extract token from URL
    const requestId = window.location.pathname.split("/").pop();

    if (!requestId) {
        alert("Invalid reset link.");
        form.style.display = "none";
        return;
    }

    // Verify link status on page load
    try {
        await axios.get(`${reset_URL}/password/resetpassword/${requestId}`);
    } catch (err) {
        alert(err.response?.data?.message || "Link is invalid or expired.");
        form.style.display = "none";
        return;
    }

    // Submit new password
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${reset_URL}/password/updatepassword/${requestId}`, {
                password: newPassword
            });

            alert("Password reset successfully");
            window.location.href = "/signin";
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update password.");
        }
    });
});