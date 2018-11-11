const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const request = require('request-promise')
const parseString = require('xml2js').parseString
const cookieParser = require('cookie-parser')
const session = require('express-session')
const Redis = require('connect-redis')
const Path = require('path')
const cors = require('cors')
const fs = require('fs')

const AuthRoute = require('./routes/auth')
const ImageRoute = require('./routes/image')

const UserAPI = require('./api/user')
const ImageAPI = require('./api/image')

const app = express()
const RedisStore = Redis(session)

app.use(session({
  store: new RedisStore(),
  key: 'kdwkrkkukolove',
  secret: 'kdwkrkkuko',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  resave: false,
  saveUninitialized: true
}))

var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

app.use(morgan('tiny'))
app.use(helmet())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// const API_KEY = 'txBlRRYXtke30%2FkrbVG0e4hE9s0noQyTzFWbwqDewAntZATJETJKa5ELikOty%2B3Jn65%2FjTB80QolVWR3gPaW1A%3D%3D'
const API_KEY = '79E1WBI0%2BQz7gO1P7FxFKLrZShN2Dnh%2FvroCCFHUp6uRuCQARB6VAjdZ7VUefdbsDnWrR9ytlxZXlUxNo7KVCQ%3D%3D'

async function getSiDoCode() {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: `http://openapi.animal.go.kr/openapi/service/rest/abandonmentPublicSrvc/sido?ServiceKey=${API_KEY}&numOfRows=30`
    }).then(res => {
      parseString(res, (err, result) => {
        resolve(result.response.body[0].items[0].item)
      })
    }).catch(err => {
      
    })
  })
}

async function getSiGunGu(sidoCode) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: `http://openapi.animal.go.kr/openapi/service/rest/abandonmentPublicSrvc/sigungu?ServiceKey=${API_KEY}&upr_cd=${sidoCode}`
    }).then(res => {
      parseString(res, (err, result) => {
        resolve(result.response.body[0].items[0].item)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

async function getList(sidoCode, sigunguCode) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: `http://openapi.animal.go.kr/openapi/service/rest/abandonmentPublicSrvc/abandonmentPublic?upr_cd=${sidoCode}&org_cd=${sigunguCode}&state=protect&pageNo=1&numOfRows=30&ServiceKey=${API_KEY}`
    }).then(res => {
      parseString(res, (err, result) => {
        resolve(result.response.body[0].items[0].item)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

async function checkLogin (req, res, next) {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(401).send({msg: 'You should login before request.'})
  }
}

// getSiDoCode()
// getSiGunGu('6110000')
// getList('6110000','3130000')
const sidoList = [{"code":"6110000","name":"서울특별시"},{"code":"6260000","name":"부산광역시"},{"code":"6270000","name":"대구광역시"},{"code":"6280000","name":"인천광역시"},{"code":"6290000","name":"광주광역시"},{"code":"5690000","name":"세종특별자치시"},{"code":"6300000","name":"대전광역시"},{"code":"6310000","name":"울산광역시"},{"code":"6410000","name":"경기도"},{"code":"6420000","name":"강원도"},{"code":"6430000","name":"충청북도"},{"code":"6440000","name":"충청남도"},{"code":"6450000","name":"전라북도"},{"code":"6460000","name":"전라남도"},{"code":"6470000","name":"경상북도"},{"code":"6480000","name":"경상남도"},{"code":"6500000","name":"제주특별자치도"}]
app.get('/sido', async (req, res) => {
  res.send(sidoList)
})

app.get('/sigungu', async (req, res) => {
  const data = await getSiGunGu(req.query.sido)
  const result = []
  for(var i=0;i<data.length;i++) result.push({code: data[i].orgCd[0], name: data[i].orgdownNm[0]})
  res.send(result)
})

//age filename kind orgNm careAddr careNm sexCd

app.get('/list', async (req, res) => {
  //6110000 3240000
  function getData(obj) {
    console.log(obj)
    return {
      age: obj.age[0],
      thumbnail: obj.filename[0],
      image: obj.popfile[0],
      kind: obj.kindCd[0],
      orgNm: obj.orgNm[0],
      careNm: obj.careNm[0],
      careAddr: obj.careAddr[0],
      sex: obj.sexCd[0],
    }
  }
  const data = await getList(req.query.sido, req.query.sigungu)
  if(!data) return res.send([])
  const result = []
  for(var i=0;i<data.length;i++) result.push(getData(data[i]))
  res.send(result)
})

app.use('/auth', AuthRoute)
app.get('/image/:id', async (req, res) => {
  const file = await ImageAPI.getFile(req.params.id)
  if(!file) return res.status(404).send({msg: 'image not found.'})
  else if(req.query.size) return res.type(file.mimetype), res.setHeader('Content-Disposition', 'attachment; filename=' + file.org_filename), res.send(await ImageAPI.resizeImage(Path.resolve(__dirname, './uploads', './' + file.filename), parseInt(req.query.size)))
  else return res.setHeader('Content-Disposition', 'attachment; filename=' + file.org_filename), res.type(file.mimetype), res.sendFile(Path.resolve(__dirname, './uploads', './' + file.filename))
})
app.use('/image', ImageRoute)

app.listen(80)
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);