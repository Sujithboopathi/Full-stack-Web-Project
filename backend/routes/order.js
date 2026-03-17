const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // POST new order
  router.post('/', async (req, res) => {
    try {
      console.log('POST /api/orders body:', JSON.stringify(req.body).slice(0, 2000));
      // basic validation
      const { user, items, total } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid items array' });
      }
      if (!user) {
        return res.status(400).json({ message: 'Missing user data' });
      }
      if (typeof total !== 'number' && typeof total !== 'string') {
        return res.status(400).json({ message: 'Invalid total' });
      }

      // Let Supabase auto-generate the ID
      // items is JSONB, so we pass it directly
      const orderToInsert = {
        items,
        total,
        user,
        date: req.body.date || new Date().toISOString()
      };
      
      console.log('Inserting into Supabase:', orderToInsert);
      const { data, error } = await supabase.from('orders').insert([orderToInsert]).select();

      if (error) {
        console.error('Supabase insert error details:', JSON.stringify(error, null, 2));
        return res.status(500).json({ message: 'DB insert failed', details: error });
      }

      console.log('Order successfully inserted into Supabase:', {
        count: data?.length,
        id: data?.[0]?.id
      });

      if (!data || data.length === 0) {
         console.warn('Supabase inserted but returned no data. Check table triggers.');
         return res.status(201).json({ success: true, message: 'Ordering completed (no return data)' });
      }

      res.status(201).json(data[0]);
    } catch (err) {
      console.error('Unexpected server error during order creation:', err);
      res.status(500).json({ 
        message: 'Server failed to process order', 
        error: err.message,
        stack: err.stack
      });
    }
  });

  // GET all orders
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) return res.status(500).json({ message: 'DB fetch failed', details: error });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message || err });
    }
  });

  return router;
};