var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {

  //GET ALL DATA RESTO 
  router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM vendors`
    db.all(sql, (err, rows) => {
      if (err) res.status(500).json(err)
      res.json(rows)
    })
  });

  //GET ALL MENU BY ID RESTO
  router.get('/:restoid', function (req, res) {
    let restoid = req.params.restoid
    let sql = `SELECT tags.*, (vendors.name) as resto FROM taggables 
    LEFT JOIN tags on tags.id = taggables.tag_id 
    LEFT JOIN vendors on vendors.id = taggables.taggable_id 
    WHERE taggable_id = ?`

    db.all(sql, [restoid], (err, rows) => {
      if (err) res.status(500).json(err)
      res.json(rows)
    })
  })

  return router;
}
