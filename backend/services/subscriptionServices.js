const { Cashfree, CFEnvironment } = require('cashfree-pg');
const payment = require('../models/subscription');
const { user } = require('../models/index');

const uRL = process.env.CLIENT_BASE_URL || 'http://localhost:3000';

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

const createOrder = async (orderId, amount, customer) => {
  try {
    // Ensure customer_phone is always a valid 10-digit Indian number starting with 6-9
    const rawPhone = String(customer.phone || '').replace(/\D/g, '');
    const validPhone = (rawPhone.length === 10 && /^[6-9]/.test(rawPhone)) ? rawPhone : '9999999999';

    const request = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${customer.id}`,
        customer_phone: validPhone,
        customer_email: customer.email || 'test@example.com'
      },
      order_meta: {
        return_url: `${uRL}/expenses?order_id={order_id}`
      }
    };

    const response = await cashfree.PGCreateOrder(request);

    await payment.create({
      orderId: String(orderId),
      status: 'PENDING',
      userId: customer.id
    });

    const responseData = response.data || response;
    return responseData.payment_session_id;

  } catch (error) {
    console.error('Error creating Cashfree order:', error.response?.data?.message || error.message);
    throw error;
  }
};

const verifyOrder = async (orderId, userId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);

    // Safely extract transaction array from response
    const paymentsList = Array.isArray(response)
      ? response
      : (Array.isArray(response.data) ? response.data : []);

    const isSuccess = paymentsList.some(p => p.payment_status === 'SUCCESS');

    if (isSuccess) {
      await payment.update(
        { status: 'SUCCESS' },
        { where: { orderId: String(orderId), userId: userId } }
      );

      // Update user isPremium status in database
      await user.update(
        { isPremium: true },
        { where: { id: userId } }
      );

      return { status: 'SUCCESS', message: 'Payment successful! You are now a premium user.' };
    } else {
      await payment.update(
        { status: 'FAILED' },
        { where: { orderId: String(orderId), userId: userId } }
      );

      return { status: 'FAILED', message: 'Payment was not successful.' };
    }

  } catch (error) {
    console.error('Error verifying Cashfree order:', error.response?.data?.message || error.message);
    throw error;
  }
};

module.exports = {
  createOrder,
  verifyOrder
};