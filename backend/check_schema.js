const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://svgtsdrdcyoezvkvsctb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_O_YAfdjYdvgAUd4m6MXltw_VM4leBWc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking "orders" table schema...');
  // Since we can't easily query information_schema via anon key easily, 
  // we'll just try to fetch one row and look at the structure.
  const { data, error } = await supabase.from('orders').select('*').limit(1);

  if (error) {
    console.error('Error fetching from orders:', error);
  } else {
    console.log('Sample row structure:', JSON.stringify(data[0], null, 2));
  }
}

checkSchema();
