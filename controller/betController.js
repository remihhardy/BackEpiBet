let Bet = require("../model/Bet");
const Room = require("../model/Room");


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

