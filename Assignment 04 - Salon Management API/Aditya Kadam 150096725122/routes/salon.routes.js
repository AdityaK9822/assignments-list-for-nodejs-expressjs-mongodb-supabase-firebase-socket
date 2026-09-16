const router = require("express").Router();
const supabase = require("../config/supabaseClient");
const verifyToken = require("../middleware/auth");

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("salons").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { data, error } = await supabase.from("salons").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Salon not found" });
  res.json(data);
});

router.post("/", verifyToken, async (req, res) => {
  const { name, address, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const { data, error } = await supabase
    .from("salons")
    .insert({ name, address, phone, owner_id: req.user.id })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/:id", verifyToken, async (req, res) => {
  const { name, address, phone } = req.body;
  const { data, error } = await supabase
    .from("salons")
    .update({ name, address, phone })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { error } = await supabase.from("salons").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
