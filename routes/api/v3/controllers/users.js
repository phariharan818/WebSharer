import express from 'express'
let router = express.Router()
import session from 'express-session'


router.get("/myIdentity", function (req, res, next) {
    try {
        if (req.session.isAuthenticated) {
            res.json({
                "status": "loggedin", 
                "userInfo": {
                   "name": req.session.account.name, 
                   "username": req.session.account.username
                }
            })
            res.status(200).json({"status": "loggedin"})
        } else {
            res.status(401).json({"status": "loggedout"})
        }
    } catch(error) {
        console.log("error: ", error)
        res.status(500).json({"status": "error"})
    }
})

export default router;