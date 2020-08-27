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
    db.run(sql, [req.params.id], (err)=>{
      if(err) res.json({
        error: true,
        message: err
      })
      res.json({
        error: false,
        message: 'Delete Complete'
      })
    })
  })











  // //GET ALL MENU BY ID RESTO
  // router.get('/:restoid', function (req, res) {
  //   let restoid = req.params.restoid
  //   let sql = `SELECT tags.*, (vendors.id) as restoid, (vendors.name) as resto FROM taggables 
  //   LEFT JOIN tags on tags.id = taggables.tag_id 
  //   LEFT JOIN vendors on vendors.id = taggables.taggable_id 
  //   WHERE taggable_id = ?`

  //   db.all(sql, [restoid], (err, rows) => {
  //     if (err) res.status(500).json(err)
  //     res.json(rows)
  //   })
  // })

  return router;
}
