const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url} - ${res.statusCode}`);
  });
  next();
});

// Permissive CORS to resolve local/production blockers
app.use(cors({
  origin: true,
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

// Only listen on port 5000 if running locally (not in Vercel)
if (require.main === module) {
  app.listen(5000, () => console.log('Server running on port 5000'));
}

// Export for Vercel serverless functions
module.exports = app;