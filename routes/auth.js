const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register", async (req, res)=> {
    
        const checkUser = await User.findOne({username:req.body.username});
        const checkEmail = await User.findOne({email:req.body.email});

        if(checkUser) {
          return res.status(400).json("Username already exists!");
        } 
        
        if(checkEmail) {
          return res.status(400).json("Email already exists!");
        } 

        if(req.body.username ==='' || req.body.email==='') {
            return res.status(400).json("Blank field supplied!");
        }
    
    
    try {

           
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const user = await newUser.save();
        res.status(200).json(user);

    }catch(err) {
        res.json({ message: err });
    }
});

//LOGIN
router.post("/login", async (req, res)=> {
    try{
         const user = await User.findOne({username: req.body.username});
         !user && res.status(400).json("Wrong credentials");

         const validated = await bcrypt.compare(req.body.password, user.password);
         !validated && res.status(400).json("Wrong credentials");

         const {password, ...others} = user._doc;
    
         res.status(200).json(others);

    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;