const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://svgtsdrdcyoezvkvsctb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_O_YAfdjYdvgAUd4m6MXltw_VM4leBWc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing insertion into "orders" table...');
  const testOrder = {
    items: [{ id: 1, name: 'Test Item', price: 10, quantity: 1 }],
    total: 10,
    user: { name: 'Test User', phone: '1234567890' }
  };

  const { data, error } = await supabase.from('orders').insert([testOrder]).select();

  if (error) {
    console.error('Error inserting order:', error);
  } else {
    console.log('Order inserted successfully:', data);
  }
}

testInsert();
