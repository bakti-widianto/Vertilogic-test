var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {

  //GET ALL DATA VENDORS 
  router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM vendors`
    db.all(sql, (err, rows) => {
      if (err) res.status(500).json(err)
      res.json(rows)
    })
  });


  router.post('/', function (req, res) {
    db.serialize(() => {
      let sql = (`INSERT INTO vendors(name, logo, created_at, updated_at) VALUES(?, ?, datetime('now'), datetime('now'))`)
      db.run(sql, [req.body.name, req.body.logo], (err) => {
        if (err) {
          res.json({
            error: true,
            message: err
          })
        }
        res.json({
          error: false,
          message: 'ADD COMPLETE'
        })
      })

    })

  })

  router.get('/:id', function (req, res) {
    let sql = 'DELETE FROM vendors WHERE id = ?'
    db.run(sql, [req.params.id], (err) => {
      if (err) res.json({
        error: true,
        message: err
      })
      res.json({
        error: false,
        message: 'Delete Complete'
      })
    })
  })

  router.post('/:id', function (req, res) {
    let sql = `UPDATE vendors SET name = ?, logo = ?, updated_at = datetime('now') WHERE id = ?`
    let { name, logo } = req.body

    db.run(sql, [name, logo, req.params.id], (err) => {
      if (err) res.json({
        error: true,
        message: err
      })
      res.json({
        error: false,
        message: 'UPDATE COMPLETE'
      })
    })
  })


  return router;
}
