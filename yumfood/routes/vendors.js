var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {

  //GET ALL DATA VENDORS 
  router.get('/', function (req, res, next) {
    // console.log(req.query.tag)
    let serach = ''

    if (req.query.tag) {
      let result = []
      req.query.tag.forEach((item) => {

        if (item == "promo") {
          result.push(`vendors.promo LIKE '%promo%'`)
        }

        if (item == "featured") {
          result.push(`vendors.featured LIKE '%featured%'`)
        }
      })

      if (result.length > 0) {
        serach += ` WHERE ${result.join(" AND ")}`
      }
    }

    console.log(serach)

    let data = [];
    const maxLength = 128;
    let sql = `SELECT * FROM vendors ${serach}`

    db.all(sql, (err, rows) => {
      if (err) res.status(500).json(err)
      //console.log(rows)
      rows.map((item) => {
        if (item.name.length <= maxLength) {
          // console.log(item.name)
          // console.log(item.name.length)
          data.push(item)
        }
      })

      res.json(data)
    })
  });

  //POST NEW VENDOR
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

  //DELETE VENDOR
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

  //EDIT VENDOR
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
