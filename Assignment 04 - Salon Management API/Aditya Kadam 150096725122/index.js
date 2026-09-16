require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/auth.routes");
const salonRoutes = require("./routes/salon.routes");
const serviceRoutes = require("./routes/service.routes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Salon Management API listening on port ${PORT}`));
