let User = require("../model/User");
let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

exports.register =  async (req , res)=> {
    console.log("hello !")
    if (!(req.body.email || req.body.nickname || req.body.password || req.body.passwordConfirmation )) {
        res.status(422).send({"error":"All inputs are required"});
    }
    else if (req.body.password!==req.body.passwordConfirmation){
        res.status(422).send({"error":"Password and its confirmation doesn't match"});
    }
    else {

        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            "name": req.body.name,
            "email": req.body.email,
            "nickname": req.body.nickname,
            "password":hashedPassword
        });
        let accessToken = jwt.sign({ user_id: user._id}, process.env.TOKEN_SECRET)
        user.save()
            .then(()=> res.status(201).json({ "user_id": user._id,"token": accessToken}))
            .catch (error => res.status(400).json({error : error.message}))
    }
};
exports.login =  async (req, res)=>{
    console.log("login ..")
    if (!(req.body.email && req.body.password)) {
        return res.status(422).send({"error":"All inputs are required"});
    }
    let user = await User.findOne({ email: req.body.email })
    try{
        let match = await bcrypt.compare(req.body.password, user.password);
        if(match){
            let accessToken = jwt.sign({ user_id: user._id}, process.env.TOKEN_SECRET)
            res.json({
                accessToken: accessToken,
            });
        } else {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
    } catch(e) {
        console.log(e)
        return res.status(401).json({ message: "Invalid Credentials" });

    }
};


// TODO : READ
// exports.getUser =  async(req , res)=> {
//     let filter = {_id : req.body.user_id }
//     try{
//         let user = await User.find(filter,{password:0}).populate("widgets")
//         res.status(200).json(user)
//     }
//     catch (e) {
//         res.status(403).json({"error": e.message})
//     }
// };

// TODO : UPDATE
// exports.updateUser =  async(req , res)=> {
//     if (!(req.body.email || req.body.name || req.body.nickname || req.body.password )) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//     else {
//         let filter = {_id: req.body.user_id}
//         let newMail = req.body.email
//         let newName = req.body.name
//         let newNickname = req.body.nickname
//         let hashedPassword = await bcrypt.hash(req.body.password, 10);
//         User.findOneAndUpdate(filter,
//             {
//                 "name": newName,
//                 "nickname": newNickname,
//                 "password": hashedPassword,
//                 "email": newMail,
//             }
//         )
//             .then(() => res.status(201).json({"message": "user " + req.body.name + " updated"}))
//             .catch((error) => res.status(500).json({"error": error.message}))
//     }
// };

// TODO : DELETE
// exports.deleteUser =  async(req , res)=> {
//
//     let filter = {_id : req.body.user_id }
//     User.deleteOne(filter)
//         .then(
//             () => res.status(200).json({result: "user deleted"})
//         )
//         .catch(
//             (error) => res.status(400).json({error: error.message})
//         )
//
// };


