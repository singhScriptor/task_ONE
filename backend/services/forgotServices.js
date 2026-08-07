const {user : User} = require("../models/index");
const forgotPasswordRequest = require("../models/forgotPasswordReset");
const { BrevoClient } = require("@getbrevo/brevo");

exports.forgotPassword = async (email) => {
  // check if user exists
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    const error = new Error("User with this email does not exist");
    error.statusCode = 404;
    throw error;
  }

  // create db request record where sequelize generates the uuid automatically
  const resetReq = await forgotPasswordRequest.create({
    userId: user.id,
    isActive: true
  });

  const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
  });

  // full URL sent to user
  const resetUrl = `http://localhost:3000/password/resetpassword/${resetReq.id}`;

  try {
    // send email using template
    await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email: email }],
      templateId: Number(process.env.BREVO_TEMPLATE_ID),
      params: {
        resetLink: resetUrl // url from template saved inside brevo
      }
    });

    return { message: "Password reset mail sent successfully!" };
  } catch (err) {
    // deactivate request if mailing fails
    await resetReq.update({ isactive: false });

    const error = new Error("Failed to send reset link");
    error.statusCode = 500;
    throw error;
  }
};