const express = require('express');
const router = express.Router();

module.exports = (supabase) => {
  // GET all menu items
  router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('menu').select('*');
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  // POST new menu item
  router.post('/', async (req, res) => {
    const { data, error } = await supabase.from('menu').insert([req.body]);
    if (error) return res.status(500).json(error);
    res.json(data);
  });
  // PUT update menu item
  router.put('/:id', async (req, res) => {
    const { data, error } = await supabase.from('menu').update(req.body).eq('id', req.params.id);
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  // DELETE menu item
  router.delete('/:id', async (req, res) => {
    const { error } = await supabase.from('menu').delete().eq('id', req.params.id);
    if (error) return res.status(500).json(error);
    res.json({ message: 'Deleted' });
  });

  return router;
};
