const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/todo",(req,res) => {
    db.Todo.findAll().then(data => res.send(data));
});

router.get("/todo/:id",(req,res) => {
    db.Todo.findOne({
        where: {
            id: req.params.id
        }
    }).then(data => res.send(data));
}); 

router.post("/todo",(req,res) => {
    db.Todo.create({
        text: req.body.text
    }).then(data => res.send(data));
});

router.put("/todo/:id",(req,res) => {
    db.Todo.update({
        text: req.body.text
    },{
        where: {
            id: req.params.id
        }
    }).then(() => res.send("update"));
});

router.delete("/todo/:id",(req,res) => {
    db.Todo.destroy({
        where:{
            id: req.params.id
        }
    }).then(() => res.send("daleted"));
});

module.exports = router;