const app = require("express")();
const consign = require("consign");
const PORT = process.env.PORT || 5000;

const db = require("./config/db");

consign()
    .then('./config/passport.js')
    .then("./config/middlewares.js")
    .then("/api")
    .then("./config/routes.js")
    .into(app);

app.db = db;

app.listen(PORT, () => {
    console.log("Server On");
});
