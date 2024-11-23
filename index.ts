import Stripe from "stripe";

const main = async () => {
  if (process.env.STRIPE_KEY) {


    const stripe = new Stripe(process.env.STRIPE_KEY, {
      apiVersion: "2024-11-20.acacia",
      appInfo: { // For sample support and debugging, not required for production:
        name: "stripe-samples/accept-a-payment",
        url: "https://github.com/stripe-samples",
        version: "0.0.2",
      },
      typescript: true,
    });



    let orderAmount = 1400;
    let params: Stripe.PaymentIntentCreateParams;
    let taxCalculation = await stripe.tax.calculations.create(
      {
        currency: "usd",
        customer_details: {
          address: {
            line1: "10709 Cleary Blvd",
            city: "Plantation",
            state: "FL",
            postal_code: "33322",
            country: "US",
          },
          address_source: "shipping",
        },
        line_items: [
          {
            amount: orderAmount,
            reference: "ProductRef",
            tax_behavior: "exclusive",
            tax_code: "txcd_30011000"
          }
        ],
      }
    )
    params = {
      payment_method_types: ['link', 'card'],
      amount: taxCalculation.amount_total,
      currency: 'usd',
      metadata: {tax_calculation: taxCalculation.id}
    }
    const paymentIntent = await stripe.paymentIntents.create(params);
    console.log(paymentIntent)
  }
}

main()
