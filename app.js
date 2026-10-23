const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const FOOD = require("./models/FOOD");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI);

app.get("/", async (req, res) => {
   const food = await FOOD.find();
   res.render("index", { food });
});

app.get("/register-food", (req, res) => {
   res.render("registerB");
});

app.post("/registerB-food", async (req, res) => {
   const {
      bildeurl,
      tittel,
      beskrivelse,
      ingridienser,
      kategori,
      pris
   } = req.body;

   const food = new FOOD({
      bildeurl,
      tittel,
      beskrivelse,
      ingridienser,
      kategori,
      pris
   });

   await food.save();

   res.redirect("/register-food");
});

app.listen(process.env.PORT);