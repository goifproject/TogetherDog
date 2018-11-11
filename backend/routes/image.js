const express = require('express')
const multer = require('multer')
const ImageAPI = require('../api/image')
const Path = require('path')

const router = express.Router()
const upload = multer({ dest: Path.resolve(__dirname, '../uploads'), limits: { fileSize: 1024*1024*20 } })

router.post('/upload', upload.array('photos', 30), async (req, res) => {
  const list = []
  for(var i=0;i<req.files.length;i++) {
    const file = req.files[i]
    if(file.mimetype.indexOf('image') == -1) continue
    list.push((await ImageAPI.upload(file)).get('id'))
  }
  res.status(200).send(list)
})
router.get('/', async (req, res) => {
  ImageAPI.getList().then(data => {
    res.status(200).send(data)
  }).catch(err => {
    res.status(404).send({msg: err})
  })
})
router.delete('/:id', async (req, res) => {
  ImageAPI.delete(req.params.id).then(data => {
    res.status(200).send({msg: 'success'})
  }).catch(err => {
    res.status(404).send({msg: err})
  })
})
module.exports = router