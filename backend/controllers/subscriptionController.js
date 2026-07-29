const purchaseService = require('../services/subscriptionServices');
const payment = require('../models/subscription');
const { user } = require('../models/index');

const initiatePayment = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const loggedInUser = req.user;

        // Default to fixed amount (e.g. 1000) if not sent in request body
        const orderAmount = amount && amount > 0 ? amount : 1200;
        const orderId = `ord_${Date.now()}_u${loggedInUser.id}`;

        const sessionId = await purchaseService.createOrder(orderId, orderAmount, loggedInUser);

        return res.status(201).json({
            message: "Payment order initiated successfully",
            order_id: orderId,
            payment_session_id: sessionId
        });
    } catch (err) {
        console.error('--- CASHFREE INITIATE ERROR ---', err.response?.data || err.message);
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id || req.user;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const result = await purchaseService.verifyOrder(orderId, userId);

        if (result.status === 'SUCCESS' || result.status === 'SUCCESSFUL') {
            return res.status(200).json({
                message: "Transaction successful!",
                isPremiumUser: true,
                status: "SUCCESSFUL"
            });
        }

        return res.status(400).json({
            message: "Transaction failed.",
            isPremiumUser: false
        });

    } catch (err) {
        console.error('--- CASHFREE VERIFICATION ERROR ---', err.response?.data || err.message);
        return res.status(500).json({ isPremiumUser: false, error: err.message });
    }
};

module.exports = {
    initiatePayment,
    verifyPayment
};