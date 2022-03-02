const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

router.use(cors());

process.env.SECRET_KEY = "secret";

router.post('/register', (req, res) => {
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    db.register.findOne({
        where: {
            email: req.body.email
         }
    })
        .then(user => {
            if(!user){
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    db.register.create(userData)
                        .then(user => {
                            res.json(user.email + ' registered')
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })  
            }   else {
                res.json("User already exists")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

router.post('/login',async (req,res) => {
    await db.register.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if(user) {
            if(bcrypt.compareSync(req.body.password,user.password)) {
                let token = jwt.sign(user.name,process.env.SECRET_KEY);
                res.send(token);
            }
            else{
                res.send("Password mismatch");
            }
        }
        else {
            res.status(400).json("Email does not exist");
        }
    }).catch(err => {
        res.status(400).json({error: err});
    })
})

const valid = (req,res,next) => {
    const token = req.header("auth");
    req.token = token;
    next();
}

router.get("/getall",valid,async (req,res) => {
    jwt.verify(req.token,"secret",async (err,data) => {
        if(err) {
            res.sendStatus(403);
        }
        else{
            const user = await db.register.findAll();
            res.send(user);
        }
    })
})

router.delete("/delete/:id",valid,async (req,res) => {
    jwt.verify(req.token,"secret",async (err,data) => {
        if(err) {
            res.sendStatus(403);
        }
        else{
            const user = await db.register.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.send("deleted");
        }
    })
})

module.exports = router;