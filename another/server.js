const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const PORT = process.env.PORT || 2000;
const api = require("./routes/api");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use("/",api);

db.sequelize.sync().then(() => {
    app.listen(PORT,() => {
        console.log(`server started on PORT ${PORT}`);
    })
})