const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(require('cors')());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use('/api/menu', require('./routes/menu')(supabase));
app.use('/api/orders', require('./routes/order')(supabase));

app.listen(5000, () => console.log('Server running on port 5000'));