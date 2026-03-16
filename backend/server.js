const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// Allow requests from localhost (dev) and any Vercel deployment (production)
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      /^http:\/\/localhost(:\d+)?$/,
      /^https:\/\/.*\.vercel\.app$/
    ];
    if (!origin || allowed.some(r => r.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("WARNING: Supabase URL or Key is missing. Vercel environment variables are likely not set correctly.");
}
app.use('/api/*', (req, res, next) => {
  if (!supabase) {
    return res.status(500).json({ 
      error: "Supabase Environment Variables are missing!", 
      message: "Please add SUPABASE_URL and SUPABASE_ANON_KEY in your Vercel Dashboard under Settings -> Environment Variables, and then REDEPLOY the app."
    });
  }
  next();
});

app.use('/api/menu', require('./routes/menu')(supabase));
app.use('/api/orders', require('./routes/order')(supabase));

app.listen(5000, () => console.log('Server running on port 5000'));