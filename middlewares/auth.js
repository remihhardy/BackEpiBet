let jwt = require("jsonwebtoken");
let auth =(req, res, next ) => {
    console.log("check token")
    verifyToken(req,res)
    jwt.verify(req.token,process.env.TOKEN_SECRET,(err)=>{
        if(err) {
          let  message=err.message
            console.log("not recognized");
           return res.status(403).json({"error": message});

        }
        else{
            console.log("user authenticated")
            req.body.user_id = jwt.verify(req.token, process.env.TOKEN_SECRET).user_id
            next()
        }
    })
};
verifyToken = (req,res)=>{
    let bearerString = req.headers['authorization'];
    if(typeof bearerString !== 'undefined'){
        let bearer = bearerString.split(' ');
        let bearerToken = bearer[1]
        req.token = bearerToken;
        return req
    }
}
module.exports = auth
