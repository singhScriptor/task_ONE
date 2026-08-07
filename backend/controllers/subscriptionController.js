const purchaseService = require('../services/subscriptionServices');

const initiatePayment = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const loggedInUser = req.user;

        // Default amount if not provided
        const orderAmount = amount > 0 ? amount : 1200;
        const orderId = `ord_${Date.now()}_u${loggedInUser.id}`;

        const sessionId = await purchaseService.createOrder(orderId, orderAmount, loggedInUser);

        return res.status(201).json({
            message: "Payment initiated successfully",
            order_id: orderId,
            payment_session_id: sessionId
        });
    } catch (err) {
        console.error('Error initiating payment:', err.message);
        next(err);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const result = await purchaseService.verifyOrder(orderId, userId);

        if (result.status === 'SUCCESS') {
            return res.status(200).json({
                message: "Transaction successful!",
                isPremiumUser: true
            });
        }

        return res.status(400).json({
            message: "Transaction failed.",
            isPremiumUser: false
        });

    } catch (err) {
        console.error('Error verifying payment:', err.message);
        next(err);
    }
};

module.exports = {
    initiatePayment,
    verifyPayment
};