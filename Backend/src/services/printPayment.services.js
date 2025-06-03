const { client } = require('../config/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const Print = require('../models/Print');
const PrintPurchase = require('../models/PrintPurchase');
const crypto = require('crypto');

class PrintPaymentService {
  async createPaymentOrder(printId, userId, options = {}) {
    try {
      // Get print details
      const print = await Print.findById(printId);
      if (!print) {
        return {
          success: false,
          error: 'Print not found'
        };
      }
      
      // Check if print is in stock
      if (!print.inStock) {
        return {
          success: false,
          error: 'This print is currently out of stock'
        };
      }
      
      // Calculate amount based on size and frame
      const { size, frame, ipAddress, userAgent } = options;
      let amount = print.price;
      
      // Apply size multiplier if applicable
      if (size) {
        if (size === 'large' || size === '16x20' || size === '16*9' || size === '20x30') {
          amount = amount * 1.5;
        } else if (size === 'medium' || size === '11x14') {
          amount = amount * 1.2;
        }
      }
      
      // Add frame price if applicable
      if (frame) {
        if (frame === 'Wood Frame') {
          amount += 2500; // LKR 2,500
        } else if (frame === 'Metal Frame') {
          amount += 3500; // LKR 3,500
        } else if (frame === 'Minimalist Frame') {
          amount += 3000; // LKR 3,000
        }
      }
      
      // Convert LKR to USD for PayPal (approximate conversion)
      // Update this exchange rate as needed or use an API for real-time rates
      const exchangeRate = 0.0031; // 1 LKR = 0.0031 USD
      const amountUSD = (amount * exchangeRate).toFixed(2);
      
      // Create PayPal order
      const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amountUSD
          },
          description: `Print: ${print.name} - ${size || 'Standard'} ${frame ? `with ${frame}` : ''}`
        }],
        application_context: {
          brand_name: 'Lanka Photography',
          landing_page: 'BILLING',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.CLIENT_URL}/payment/success?type=print&id=${printId}`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
        }
      });
      
      // Execute the request
      const order = await client.execute(request);
      
      // Get approval URL
      const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
      
      // Create a print purchase record with PENDING status
      const purchase = await PrintPurchase.create({
        userId,
        printId,
        amount, // Save the original amount in LKR
        currency: 'LKR',
        paypalOrderId: order.result.id,
        status: 'PENDING',
        selectedSize: size || 'Standard',
        frameOption: frame || 'None',
        metadata: {
          ipAddress,
          userAgent,
          exchangeRate,
          amountUSD
        }
      });
      
      return {
        success: true,
        data: {
          orderId: order.result.id,
          approvalUrl,
          purchaseId: purchase._id
        }
      };
    } catch (error) {
      console.error('PrintPaymentService.createPaymentOrder error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async capturePayment(orderId) {
    try {
      const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
      request.prefer("return=representation");
      
      // Execute the capture request
      const capture = await client.execute(request);
      
      // Find the purchase record
      const purchase = await PrintPurchase.findOne({ paypalOrderId: orderId });
      if (!purchase) {
        return {
          success: false,
          error: 'Purchase record not found'
        };
      }
      
      // Update purchase status
      purchase.status = 'COMPLETED';
      purchase.paymentDetails = {
        captureId: capture.result.purchase_units[0].payments.captures[0].id,
        paymentMethod: 'PayPal',
        paymentTimestamp: new Date()
      };
      await purchase.save();
      
      // Increment print sales count
      await Print.findByIdAndUpdate(purchase.printId, {
        $inc: { salesCount: 1 }
      });
      
      // Generate download link if there's a high-res file
      const print = await Print.findById(purchase.printId);
      if (print && print.highResDownloadUrl) {
        // Generate a download token valid for 30 days
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry
        
        print.downloadTokens = print.downloadTokens || [];
        print.downloadTokens.push({
          token,
          userId: purchase.userId,
          expiresAt
        });
        await print.save();
        
        // Update purchase with download link
        purchase.downloadLink = `/api/prints/download/${token}`;
        purchase.downloadExpiry = expiresAt;
        await purchase.save();
      }
      
      return {
        success: true,
        data: {
          captureId: capture.result.purchase_units[0].payments.captures[0].id,
          purchaseId: purchase._id,
          downloadLink: purchase.downloadLink,
          downloadExpiry: purchase.downloadExpiry
        }
      };
    } catch (error) {
      console.error('PrintPaymentService.capturePayment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new PrintPaymentService();