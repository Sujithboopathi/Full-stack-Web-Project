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

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use('/api/menu', require('./routes/menu')(supabase));
app.use('/api/orders', require('./routes/order')(supabase));

app.listen(5000, () => console.log('Server running on port 5000'));