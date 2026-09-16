const router = require("express").Router();
const supabase = require("../config/supabaseClient");
const verifyToken = require("../middleware/auth");

router.get("/", async (req, res) => {
  let query = supabase.from("services").select("*");
  if (req.query.salon_id) query = query.eq("salon_id", req.query.salon_id);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabase.from("services").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Service not found" });
  res.json(data);
});

router.post("/", verifyToken, async (req, res) => {
  const { salon_id, name, price, duration_minutes } = req.body;
  if (!salon_id || !name) return res.status(400).json({ error: "salon_id and name are required" });

  const { data, error } = await supabase
    .from("services")
    .insert({ salon_id, name, price, duration_minutes })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/:id", verifyToken, async (req, res) => {
  const { name, price, duration_minutes } = req.body;
  const { data, error } = await supabase
    .from("services")
    .update({ name, price, duration_minutes })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { error } = await supabase.from("services").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
