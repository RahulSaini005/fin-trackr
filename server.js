require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');





// ✅ Routes


const dashboardRoute = require('./routes/dashboard');
const transactionRoute = require('./routes/transactions'); 
const categoryRoute = require('./routes/categories');
const reportRoutes = require('./routes/report');
const reminderRoute = require('./routes/reminder');
const authRoute = require('./routes/auth');





// ✅ MongoDB URL


const MONGO_URL = process.env.MONGO_URL;




// ✅ Connect to MongoDB


mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));





// ✅ View Engine & Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));




// ✅ Session Setup with Async Store Creation
(async () => {
  const store = await MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
      secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
  });





  app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  }));




  // ✅ Global Variables
  app.use((req, res, next) => {
    res.locals.title = "FinTrackr";
    res.locals.session = req.session;
    res.locals.userName = req.session.userName || null;
    next();
  });





  // ✅ Routes
  app.use('/dashboard', dashboardRoute);
  app.use('/transactions', transactionRoute);
  app.use('/categories', categoryRoute);
  app.use('/report', reportRoutes);
  app.use('/reminders', reminderRoute);
  app.use('/auth', authRoute);




  app.get('/', (req, res) => {
    res.redirect('/dashboard');
  });





  app.use((req, res) => {
    res.status(404).render('404');
  });




  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500');
  });




  // ✅ Start Server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 FinTrackr server running at: http://localhost:${PORT}`);
  });
})();



