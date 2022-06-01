let Room = require("../model/Room");


exports.addRoom =  async (req , res)=> {
    if (!(req.body.name && req.body.category )) {
        res.status(422).send({"error":"All inputs are required"});
    }
    else {
        let room = new Room({
            "name": req.body.name,
            "private": req.body.private,
            "category": req.body.category,
            "admin": req.body.user_id,
            "participants": [req.body.user_id],
        });
        room.save()
            .then(()=> res.status(201).json({ "room_id": room._id}))
            .catch (error => res.status(500).json({error : error.message}))
    }
};
exports.getRoom =  async(req , res)=> {
    let filter = {}
    if (req.params.id) {
        filter = {_id:req.params.id}}
   let rooms= await Room.find(filter)
        .populate({path:"bets",populate:{path:"pronostics"}})
        .populate("invited")
        .populate("participants")
        .catch((e) => {
            res.status(403).json({"error": e.message})
        })

    res.status(200).json(rooms)
};
// TODO : update room
// exports.updateRoom =  async(req , res)=> {
//     if (!(req.body.title && req.params.id&& req.body.releaseDate&& req.body.genre&& req.body.image && req.body.plot && req.body.director )) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//
//     else {
//         let filter = {_id: req.params.id}
//
//         Room.findOneAndUpdate(filter,
//             {
//                 "title": req.body.title,
//                 "releaseDate": req.body.genre,
//                 "image": req.body.image,
//                 "plot": req.body.plot,
//                 "director": req.body.director,
//             }
//         )
//             .then(() => res.status(201).json({"message": "room " + req.body.title + " updated"}))
//             .catch((error) => res.status(500).json({"error": error.message}))
//     }
// };
// exports.deleteRoom =  async(req , res)=> {
//     if (!(req.params.id)) {
//         res.status(422).send({"error":"All inputs are required"});
//     }
//     let filter = {_id : req.params.id }
//     Room.deleteOne(filter)
//         .then(
//             () => res.status(200).json({result: "room deleted"})
//         )
//         .catch(
//             (error) => res.status(400).json({error: error.message})
//         )
//
// };

