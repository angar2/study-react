const { User } = require('../models/User');

// token 인증 처리를 하는 곳
let auth = (req, res, next) => {

    // clien cookie에 저장된 token을 가져옴.
    let token = req.cookies.x_auth;

    // 가져온 token이 유효한지 확인. 
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        // token이 유효하지 않아 user가 없을 경우,
        if(!user) return res.json({isAuth: false, error: true })
        // token이 유효하여 user가 있을 경우,    
        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth };