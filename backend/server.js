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

// Hardcoding for immediate Vercel deployment
const supabaseUrl = process.env.SUPABASE_URL || 'https://svgtsdrdcyoezvkvsctb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_O_YAfdjYdvgAUd4m6MXltw_VM4leBWc';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use('/api/*', (req, res, next) => {
  if (!supabase) {
    return res.status(500).json({ error: "Supabase client failed to initialize" });
  }
  next();
});
app.use('/api/menu', require('./routes/menu')(supabase));
app.use('/api/orders', require('./routes/order')(supabase));

app.listen(5000, () => console.log('Server running on port 5000'));