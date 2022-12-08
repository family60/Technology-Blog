//important express imports
const path = require("path");
const express = require("express");
const expressHandleBars = require("express-handlebars");
//important db and routing imports
const routes = require("./controllers");
const sequelize = require("./config/connection");
const helpers = require("./utils/helpers");
const session = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
//initialize app and setup port
const app = express();
const PORT = process.env.PORT || 3001;
// Set up sessions
const sess = {
    secret: 'Super secret secret',
    resave: false,
    saveUninitialized: true,
    cookie: { originalMaxAge: 600000 },
    Store: new sequelizeStore({
        db: sequelize
    })
  };
//start handle-bars engine
const handleBars = expressHandleBars.create({helpers});
//set handle bars as the template engine
app.engine("handlebars", handleBars.engine);
app.set("view engine", "handlebars");
//setting up server
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
//turning on routes
app.use(routes);
//turning on db connection and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });