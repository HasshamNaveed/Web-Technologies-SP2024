const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const { getFeaturedProducts } = require('./controllers/product.controller.js');

app.use(express.json({ limit: '16mb' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
    secret: 'web',
    resave: false,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes import
const userRouter = require('./routes/user.routes.js');
const adminRouter = require('./routes/admin.routes.js');
const productRouter = require('./routes/product.routes.js');

// Routes declaration
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/', productRouter);

// Home route
app.get('/', getFeaturedProducts); // Use the getFeaturedProducts controller

module.exports = app;
