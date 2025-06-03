const PayPal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypal');
const Payment = require('../models/Payment');

class PaymentService {
  async createPaymentOrder(options) {
    try {
      const { 
        userId, 
        itemId, 
        itemType,
        amount,
        description,
        metadata = {} 
      } = options;

      console.log("Creating PayPal payment:", { itemType, itemId, amount });

      // Validate amount - never allow zero or negative
      let validatedAmount = parseFloat(amount);
      if (isNaN(validatedAmount) || validatedAmount <= 0) {
        return {
          success: false,
          error: 'Invalid payment amount'
        };
      }
      
      // Convert LKR to USD - Approximately 1 USD = 303 LKR (update the rate as needed)
      const exchangeRate = 303; // LKR to USD
      const amountInUSD = (validatedAmount / exchangeRate).toFixed(2);
      
      console.log(`Converting ${validatedAmount} LKR to ${amountInUSD} USD (rate: 1 USD = ${exchangeRate} LKR)`);
      
      // Create PayPal order
      const request = new PayPal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      
      // Define frontend URLs
      const baseClientUrl = process.env.CLIENT_URL || 'http://localhost:8080';
      const successUrl = `${baseClientUrl}/payment/success?type=${itemType}&id=${itemId}`;
      const cancelUrl = `${baseClientUrl}/payment/cancel?type=${itemType}`;
      
      console.log("PayPal return URLs:", { successUrl, cancelUrl });
      
      // Create request body
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amountInUSD
          },
          description: description || `Payment for ${itemType}`
        }],
        application_context: {
          return_url: successUrl,
          cancel_url: cancelUrl,
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING'
        }
      });

      console.log(`Creating PayPal order for ${itemType} with amount ${amountInUSD} USD (${validatedAmount} LKR)`);
      
      // Call PayPal to create the order
      const order = await client.execute(request);
      console.log("PayPal order created:", order.result.id);
      
      // Extract approval URL for frontend redirect
      const links = order.result.links;
      const approvalUrl = links.find(link => link.rel === 'approve')?.href;
      
      if (!approvalUrl) {
        console.error("No approval URL found in PayPal response:", links);
        return {
          success: false,
          error: 'Failed to get approval URL from PayPal'
        };
      }
      
      // Save payment record in your database
      const payment = await Payment.create({
        user: userId,
        itemType: itemType,
        itemId: itemId,
        itemModelName: itemType === 'booking' ? 'Booking' : itemType === 'print' ? 'Print' : 'Preset',
        amount: validatedAmount,
        currency: 'LKR',
        paypalOrderId: order.result.id,
        status: 'pending',
        metadata: {
          ...metadata,
          amountUSD: amountInUSD,
          exchangeRate: exchangeRate
        }
      });

      console.log("Payment record created:", payment._id);

      // Return success with order details
      return {
        success: true,
        data: {
          orderId: order.result.id,
          status: order.result.status,
          approvalUrl: approvalUrl,
          paymentId: payment._id,
          amountLKR: validatedAmount,
          amountUSD: amountInUSD
        }
      };
    } catch (error) {
      console.error(`Payment order creation failed: ${error.message}`, error.stack);
      return {
        success: false,
        error: error.message || 'Payment order creation failed'
      };
    }
  }

  async capturePayment(orderId) {
    try {
      // Validate order ID
      if (!orderId) {
        return {
          success: false,
          error: 'Order ID is required'
        };
      }
      
      // Create capture request
      const request = new PayPal.orders.OrdersCaptureRequest(orderId);
      request.prefer("return=representation");
      request.requestBody({});
      
      // Call PayPal to capture the order
      const capture = await client.execute(request);
      
      // Check if capture successful
      if (capture.result.status !== 'COMPLETED') {
        return {
          success: false,
          error: 'Payment capture failed',
          details: capture.result
        };
      }
      
      // Return success with capture details
      return {
        success: true,
        data: {
          captureId: capture.result.purchase_units[0].payments.captures[0].id,
          status: capture.result.status,
          amount: capture.result.purchase_units[0].payments.captures[0].amount,
          payerId: capture.result.payer.payer_id,
          payerEmail: capture.result.payer.email_address
        }
      };
    } catch (error) {
      console.error(`Payment capture failed: ${error.message}`);
      return {
        success: false,
        error: error.message || 'Payment capture failed'
      };
    }
  }
}

module.exports = new PaymentService();