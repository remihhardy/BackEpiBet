const Bet = require("../model/Bet");
const Room = require("../model/Room");
const Pronostic = require("../model/Pronostic");
const Epicoin = require("../model/Epicoin");


exports.addBet =  async (req , res)=> {

    if (!(req.body.title && req.body.options && req.body.deadline && req.body.room_id )) {
        res.status(422).send({"error":"All inputs are required"});
    }
    else {
        let bet = new Bet({
            "title": req.body.title,
            "options": req.body.options,
            "deadline": req.body.category,
            "score_bet": req.body.score_bet,
            "status": "open",
        });
        bet.save()
            .then(()=>Room.updateOne({"_id": req.body.room_id},{ $push:{bets: bet._id}}))
            .then(()=> res.status(201).json({ "bet_id": bet._id}))
            .catch (error => res.status(500).json({error : error.message}))

    }
};
exports.getBet =  async(req , res)=> {
    let filter = {}
    if (req.params.id) {
        filter = {_id:req.params.id}}
    let bets= await Bet.find(filter)
        .populate("pronostics")
        .catch((e) => {
            res.status(400).json({"error": e.message})
        })

    res.status(200).json(bets)
};

exports.addResult =  async(req , res)=> {
    const enterResult = async (won, points,pronostic)=>{
        Pronostic.findOneAndUpdate({_id: pronostic._id},
            {
                "won": won,
                "points_earned": points
            })
            .catch((err) => console.log(err))
        Epicoin.findOneAndUpdate({user: pronostic.user, room: req.body.room_id},
            {
                $inc: {"epicount": points}
            },
            {new: true, upsert: true},
            function (err, doc) {
                if (err) {
                    console.log(err.message)
                }
                console.log(doc);
            })
    }

    if (!(req.body.result  && req.body.bet_id && req.body.user_id && req.body.room_id )) {
        res.status(422).send({"error":"All inputs are required"});
    }
    else {
        let bet = await Bet.findOne({_id:req.body.bet_id})
        console.log(bet)
        if (bet.status==="closed"){
            return res.status(403).json({"error":"score already set"})
        }
        else {
           await Bet.updateOne({_id:req.body.bet_id}, {"status": "closed"})
        }
        if (bet.options.length !== req.body.result.length)
        {
            return res.status(422).json({error:"wrong guess, bad number of options"})
        }
        if (!bet.score_bet){
            const sum = req.body.result.reduce((partialSum, a) => partialSum + a, 0);
            if (sum !== 1)
            {return res.status(422).json({error:"wrong guess, not 1 or 0 value"})}

            let allPronostics= await Pronostic.find({bet:req.body.bet_id})
            allPronostics.map(pronostic=>{
                let points
                let won
                if (JSON.stringify(pronostic.pronostic)===JSON.stringify( req.body.result)){
                    points = 1;
                    won = true;
                }

                else{
                    points = 0;
                    won = false;
                }
                enterResult(won,points,pronostic)
            })
        }
        else{
            let allPronostics= await Pronostic.find({bet:req.body.bet_id})

            allPronostics.map(pronostic=>{
                let points
                let won
                if (JSON.stringify(pronostic.pronostic)===JSON.stringify( req.body.result)) {
                    points = 3;
                    won = true;
                }
                else if (
                    (pronostic.pronostic[0] > pronostic.pronostic[1] && req.body.result[0] > req.body.result[1])
                    ||
                    (pronostic.pronostic[0] < pronostic.pronostic[1] && req.body.result[0] < req.body.result[1])
                ) {
                    points = 1
                    won = true;
                } else if (
                    ((pronostic.pronostic[0] - pronostic.pronostic[1]) === (req.body.result[0] - req.body.result[1]))

                ) {
                    points = 2
                    won = true;
                } else {
                    points = 0
                    won = false;
                }
                enterResult(won,points,pronostic)
            })
        }
    }
    res.status(200).json({"message": "end of function"})
};

// TODO : update bet
// exports.updateBet =  async(req , res)=> {
//     if (!(req.body.title && req.params.id&& req.body.releaseDate&& req.body.genre&& req.body.image && req.body.plot && req.body.director )) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//
//     else {
//         let filter = {_id: req.params.id}
//
//         Bet.findOneAndUpdate(filter,
//             {
//                 "title": req.body.title,
//                 "releaseDate": req.body.genre,
//                 "image": req.body.image,
//                 "plot": req.body.plot,
//                 "director": req.body.director,
//             }
//         )
//             .then(() => res.status(201).json({"message": "bet " + req.body.title + " updated"}))
//             .catch((error) => res.status(500).json({"error": error.message}))
//     }
// };
// exports.deleteBet =  async(req , res)=> {
//     if (!(req.params.id)) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//     let filter = {_id : req.params.id }
//     Bet.deleteOne(filter)
//         .then(
//             () => res.status(200).json({result: "bet deleted"})
//         )
//         .catch(
//             (error) => res.status(400).json({error: error.message})
//         )
//
// };

