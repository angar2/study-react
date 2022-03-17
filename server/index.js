const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// mongoDB 로그인정보를 github에 그대로 올릴 수 없으므로,
// config에 따로 나누고, config를 불러옴
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(() => 
console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요~')
})

// 회원가입 router
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  // 회원가입 시 client로부터 전달된 정보들을 mongoDB에 저장.
  // findOne: mongoDB의 method
  user.save((err, userInfo) => {
    if (err) return res.json({ registerSuccess: false, err })
    return res.status(200).json({ registerSuccess: true })
  })
})

// 로그인 router
app.post('/api/users/login', (req, res) => {
  // 요청된 email이 mongoDB에 있는지 찾음.
  // findOne: mongoDB의 method
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  // 요청된 email이 mongoDB에 있다면 password가 맞는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })
    // password가 맞다면 token 생성.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 생성된 token을 cookie에 저장.
        // cookie: cookie의 method
        res.cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id
        })
      })
    })
  })
})

// 회원정보 인증 router
app.get('/api/users/auth', auth, (req, res) => {
// auth: callback 전에 middleware가 먼저 실행됨.

  // 'auth' middleware를 통과경우 실행함(Authentication이 true라는 의미).
  res.status(200).json({
    isAuth: true,
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    isAdmin: req.user.role === 0 ? false : true,
    // role 0 (o) -> 일반유저  role 0 (x) -> 관리자
  })
})

// 로그아웃 router
app.get('/api/users/logout', auth, (req, res) => {
  // 'auth' middleware로 인증된 _id가 mongoDB에 있는지 찾은 후 token을 삭제("").
  // findOneAndUpdate: mongoDB의 method
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err,user) => {
    if (err) return res.json({ logoutSuccess: false, err });
    return res.status(200).send({
      logoutSuccess: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})