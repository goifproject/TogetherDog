const express = require('express')
const UserAPI = require('../api/user')

const router = express.Router()

router.post('/login', (req, res) => {
  UserAPI.login(req.body.username, req.body.password).then(data => {
    req.session.user = data
    res.status(200).send({msg: 'success'})
  }).catch(err => {
    res.status(404).send({msg: err})
  })
})

router.post('/logout', (req, res) => {
  req.session.destroy(err => err?res.status(200).send({msg: 'success'}):res.status(200).send({msg: 'success'}))
})

router.post('/signup', (req, res) => {
  UserAPI.signup(req.body).then(data => {
    req.session.user = data
    res.status(200).send({msg: 'success'})
  }).catch(err => {
    res.status(400).send({msg: err})
  })
  
})

router.get('/check/username', (req, res) => {
  UserAPI.checkAvailability('username', req.query.val).then(data => {
    res.status(200).send({msg: 'success'})
  }).catch(err => {
    res.status(400).send({msg: err})
  })
})

router.post('/check/phone', (req, res) => {
  UserAPI.checkAvailability('phone', req.query.val).then(data => {
    res.status(200).send({msg: 'success'})
  }).catch(err => {
    res.status(400).send({msg: err})
  })
})
module.exports = router
