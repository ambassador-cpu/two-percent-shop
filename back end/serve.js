const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Database Connection
mongoose.connect('mongodb://localhost/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Routes
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('YOUR_STRIPE_SECRET_KEY');  // Use your real Stripe secret key here
const app = express();

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Product Name', // Replace with your product name
            },
            unit_amount: 10000, // $100.00 (in cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://yourwebsite.com/success',  // Redirect after success
      cancel_url: 'https://yourwebsite.com/cancel',    // Redirect after cancel
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).send('Error creating checkout session');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
