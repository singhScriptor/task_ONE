const User = require("../models/users");
const { BrevoClient } = require("@getbrevo/brevo");

exports.forgotPassword = async (email) => {
  // Check if user exists in database
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    const error = new Error("User with this email does not exist");
    error.statusCode = 404;
    throw error;
  }

  // Create brevo client instance inside function
  const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
  });

  try {
    // Send reset email
    await brevo.transactionalEmails.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL },
      to: [{ email: email }],
      subject: "Reset Password Link",
      htmlContent: `<p>Click here to reset your password: <a href="http://localhost:3000/signin">Reset Password</a></p>`
    });

    return { message: "Password reset mail sent successfully!" };
  } catch (err) {
    const error = new Error("Failed to send reset link");
    error.statusCode = 500;
    throw error;
  }
};