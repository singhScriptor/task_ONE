const { Cashfree, CFEnvironment } = require('cashfree-pg');
const payment = require('../models/subscription');
const { user } = require('../models/index');

const clientUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

const createOrder = async (orderId, amount, customer) => {
  try {
    let phone = String(customer.phone || '');

    // check fallback for sandbox testing
    if (phone.length !== 10) {
      phone = '9999999999';
    }

    const request = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${customer.id}`,
        customer_phone: phone,
        customer_email: customer.email || 'test@example.com'
      },
      order_meta: {
        return_url: `${clientUrl}/expenses?order_id={order_id}`
      }
    };

    const response = await cashfree.PGCreateOrder(request);

    await payment.create({
      orderId: String(orderId),
      status: 'PENDING',
      userId: customer.id
    });

    return response.data?.payment_session_id || response.payment_session_id;
  } catch (error) {
    console.error('Cashfree createOrder error:', error.response?.data?.message || error.message);
    throw error;
  }
};

const verifyOrder = async (orderId, userId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data || response;

    const isSuccess = Array.isArray(payments) && payments.some(p => p.payment_status === 'SUCCESS');

    if (isSuccess) {
      await payment.update(
        { status: 'SUCCESS' },
        { where: { orderId: String(orderId), userId } }
      );

      await user.update(
        { isPremium: true },
        { where: { id: userId } }
      );

      return { status: 'SUCCESS', message: 'Payment successful! You are now a premium user.' };
    }

    await payment.update(
      { status: 'FAILED' },
      { where: { orderId: String(orderId), userId } }
    );

    return { status: 'FAILED', message: 'Payment was not successful.' };
  } catch (error) {
    console.error('Cashfree verifyOrder error:', error.response?.data?.message || error.message);
    throw error;
  }
};

module.exports = {
  createOrder,
  verifyOrder
};