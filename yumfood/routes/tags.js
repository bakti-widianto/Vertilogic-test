var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {

    //GET ALL DATA TAGS 
    router.get('/', function (req, res, next) {
        let sql = `SELECT * FROM tags`
        db.all(sql, (err, rows) => {
            if (err) res.status(500).json(err)
            res.json(rows)
        })
    });

    //POST NEW TAGS
    router.post('/', function (req, res) {
        db.serialize(() => {
            let sql = (`INSERT INTO tags(name, created_at, updated_at) VALUES(?, datetime('now'), datetime('now'))`)
            db.run(sql, [req.body.name], (err) => {
                if (err) {
                    res.json({
                        error: true,
                        message: err
                    })
                }
                res.json({
                    error: false,
                    message: 'ADD TAGS COMPLETE'
                })
            })

        })

    })

    //DELETE TAGS
    router.delete('/:id', function (req, res) {
        let sql = 'DELETE FROM tags WHERE id = ?'
        db.run(sql, [req.params.id], (err) => {
            if (err) res.json({
                error: true,
                message: err
            })
            res.json({
                error: false,
                message: 'DELETE TAGS COMPLETE'
            })
        })
    })

    //EDIT TAGS
    router.put('/:id', function (req, res) {
        let sql = `UPDATE tags SET name = ?, updated_at = datetime('now') WHERE id = ?`
        let { name } = req.body

        db.run(sql, [name, req.params.id], (err) => {
            if (err) res.json({
                error: true,
                message: err
            })
            res.json({
                error: false,
                message: 'UPDATE TAGS COMPLETE'
            })
        })
    })

    //GET ALL DISHES BY ID VENDOR
    router.get('/dishes/:vendorid', function (req, res) {
        let id = req.params.vendorid
        let sqlvendor = `SELECT * FROM vendors WHERE id = ?`

        db.all(sqlvendor, [id], (err, rows) => {
            if (err) res.json(err)

            let sqltags = `SELECT tags.* FROM taggables 
            LEFT JOIN tags on tags.id = taggables.tag_id 
            WHERE taggable_id = ?`

            db.all(sqltags, [id], (err, data) => {
                if (err) res.json(err)
                res.json({
                    vendor: rows,
                    dishes: data
                })
            })
        })
    })

    return router;
}