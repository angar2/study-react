if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); // deploy 배포한 이후 일 경우,
} else {
    module.exports = require('./dev');  // local 환경일 경우
}

// process.env.NODE.ENV(환경변수): development(로컬) or production(배포 후)
