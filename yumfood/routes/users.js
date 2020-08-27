var express = require('express');
var router = express.Router();

/* GET users listing. */
module.exports = (db) => {

  //GET ALL USERS
  router.get('/', function (req, res, next) {
    let sql = `SELECT * FROM users`
    db.all(sql, (err, data) => {
      if (err) res.json(err)
      res.json(data)
    })
  });

  //POST NEW USER
  router.post('/', function (req, res) {
    db.serialize(() => {
      let { name, email, password } = req.body
      let sql = `INSERT INTO users(name, email, password, created_at, updated_at) 
      VALUES( ?, ?, ?, datetime('now'), datetime('now'))`
      db.run(sql, [name, email, password], (err) => {
        if (err) {
          res.json({
            error: true,
            message: err
          })
        }
        res.json({
          error: false,
          message: 'ADD USER COMPLETE'
        })
      })

    })
  })

  //UPDATE USERS
  router.put('/:id', function (req, res) {
    let { name, email, password } = req.body
    let sql = `UPDATE users SET name = ? , email = ?, password = ?, updated_at = datetime('now') WHERE id = ?`

    db.run(sql, [name, email, password, req.params.id], (err) => {
      if (err) res.json({
        error: true,
        message: err
      })
      res.json({
        error: false,
        message: 'EDIT USER COMPLETE'
      })
    })
  })

  //DELETE USERS
  router.delete('/:id', function (req, res) {
    let sql = `DELETE FROM users WHERE id = ?`

    db.run(sql, [req.params.id], (err) => {
      if (err) res.json({
        error: true,
        message: err
      })
      res.json({
        error: false,
        message: 'DELETE USER COMPLETE'
      })
    })
  })

  return router;
}
