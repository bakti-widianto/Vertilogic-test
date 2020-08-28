var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {

    //GET ALL DATA ORDER 
    router.get('/', function (req, res, next) {
        let sql = `
        SELECT orders.* , (tags.name) as tagname, (vendors.name) as vendorname, (users.name) as username FROM orders
        JOIN tags ON tags.id = orders.tag_id 
        JOIN vendors ON vendors.id = orders.vendor_id
        JOIN users ON users.id = orders.user_id`
        db.all(sql, (err, rows) => {
            if (err) res.status(500).json(err)
            res.json(rows)
        })
    });

    //GET DATA ORDERS BY USER_ID
    router.get('/:userid', function (req, res) {
        let sql = `
        SELECT orders.* , (tags.name) as tagname, (vendors.name) as vendorname, (users.name) as username FROM orders
        JOIN tags ON tags.id = orders.tag_id 
        JOIN vendors ON vendors.id = orders.vendor_id
        JOIN users ON users.id = orders.user_id WHERE user_id = ?`

        db.all(sql, [req.params.userid], (err, rows) => {
            if (err) res.status(500).json(err)
            res.json(rows)
        })
    })

    //POST NEW ORDER
    router.post('/', function (req, res) {
        db.serialize(() => {
            let { tagid, vendorid, userid, qty, note } = req.body
            let sql = (`
            INSERT INTO orders (tag_id, vendor_id, user_id, qty, note, created_at, updated_at) 
            VALUES( ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)
            console.log(tagid, vendorid, userid, qty, note)
            db.run(sql, [parseInt(tagid), parseInt(vendorid), parseInt(userid), parseInt(qty), note], (err) => {
                if (err) {
                    res.json({
                        error: true,
                        message: err
                    })
                }
                res.json({
                    error: false,
                    message: 'ADD ORDER COMPLETE'
                })
            })

        })

    })

    //DELETE TAGS
    router.delete('/:id', function (req, res) {
        let sql = 'DELETE FROM orders WHERE id = ?'
        db.run(sql, [req.params.id], (err) => {
            if (err) res.json({
                error: true,
                message: err
            })
            res.json({
                error: false,
                message: 'DELETE ORDER COMPLETE'
            })
        })
    })

    //EDIT TAGS
    router.put('/:id', function (req, res) {
        let sql = `UPDATE orders SET tag_id = ?, vendor_id = ?, user_id = ?, qty = ?, note = ?, updated_at = datetime('now') WHERE id = ?`
        let { tagid, vendorid, userid, qty, note } = req.body

        db.run(sql, [tagid, vendorid, userid, qty, note, req.params.id], (err) => {
            if (err) res.json({
                error: true,
                message: err
            })
            res.json({
                error: false,
                message: 'UPDATE ORDER COMPLETE'
            })
        })
    })



    return router;
}