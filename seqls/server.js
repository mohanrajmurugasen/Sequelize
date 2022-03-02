const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const apiroutes = require("./routes/apiroutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/',apiroutes);

db.sequelize.sync().then(() => {
    app.listen(PORT,() => {
        console.log(`Port started on ${PORT}`);
    });
});