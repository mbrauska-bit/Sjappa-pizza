const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    bildeurl: String,
    tittel: String,
    beskrivelse: String,
    ingridienser: String,
    kategori: String,
    pris: Number
});

module.exports = mongoose.model("food", foodSchema);