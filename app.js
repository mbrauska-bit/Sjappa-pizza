const express = require("express");

require("dotenv").config();
const argon2 = require("argon2");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
 
const Food = require("./models/FOOD");
const User = require("./models/user");
 
const app = express();
 
app.set("view engine", "ejs");
 
app.use(express.urlencoded({ extended: true }));
 
app.use(express.static("public"));
app.use(cookieParser());
 
app.get("/", async (req, res) => {
  const food = await Food.find();
  console.log(food);
 
  res.render("index", { food });
});
 
mongoose.connect(process.env.MONGODB_URI);

app.get("/register-food", async (req, res) => {
   console.log(req.cookies);
   const token = req.cookies.jwt;
   if (!token) return res.redirect("/login");
   const cookie = jwt.verify(token,process.env.SECRET_JWT);
   console.log(cookie);
   let userId = cookie.userId;
   const user = await User.findById(userId);
   console.log(user);

  res.render("registerB");
});
 
app.get("/profile", (req, res) => {
  res.render("profile");
});
 
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register-user", (req, res) => {
  res.render("registeruser");
});
 
app.get("/forgot-password",(req,res)=>{
   res.render("forgottenpassword");
})
  
app.get("/reset-password",(req,res)=>{
   res.render("reset");
})

app.post("/forgot-password",async(req,res)=>{
const{email}=req.body

const user = await User.findOne({email});
if (!user) {
  return res.send("Hvis brukeren finnes, sender vi en e-post.");
}

console.log(user);
if(user){
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'troy.towne@ethereal.email',
        pass: '1cs8zU2KBNCTpAYTmK'
    }
    
});

const jwtEmail = jwt.sign({email: user.email},process.env.SECRET_JWT);
const resetUrl = `http://localhost:${process.env.PORT}/reset-password?email=${encodeURIComponent(jwtEmail)}`;
const info = await transporter.sendMail({
  from: '"Example Team" <team@example.com>',
  to: user.email,
  subject: "Glemt passord",
  text: `Her er din nye reset passord lenke: ${resetUrl}`,
  html: `<p>Her er din nye reset passord lenke: <a href="${resetUrl}">Tilbakestill passord</a></p>`,
});
console.log("Se e-posten:", nodemailer.getTestMessageUrl(info));
res.send("E-posten er sendt til Ethereal.");

}
});
app.post("/reset-password",async(req,res)=>{
   const {password,repeatPassword}=req.body;
})
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
 
  const user = await User.findOne({ email });
  console.log(user);
 
  if (!user) {
    return res.status(404).send("bruker eksisterer ikke");
  }
 
  const isPassword = await argon2.verify(user.password, password);
  if (isPassword) {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_JWT);
    console.log("token:", token);
 
    res.cookie("jwt", token);
 
    if (user.role === "admin") {
      res.redirect("/register-food");
    } else {
      res.redirect("/profile");
    }
  } else {
    res.send("email eller passord stemmr ikke");
  }
});
 
app.post("/register-user", async (req, res) => {
  console.log(req.body);
  const { email, password, repeatPassword } = req.body;
  if (password === repeatPassword) {
    const hash = await argon2.hash(password);
    console.log(hash);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).redirect("/login");
  } else {
    alert("no");
  }
});
 
app.post("/registerB-food", async (req, res) => {
  const { bildeurl, tittel, beskrivelse, ingridienser, kategori, pris } =
    req.body;
  console.log(req.body);
 
  const food = new Food({
    bildeurl,
    tittel,
    beskrivelse,
    ingridienser,
    kategori,
    pris,
  });
  food.save();
  res.status(200).redirect("/register-food");
});
 
app.listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});
 
 
