var fs = require('fs')
    , Promise = require('bluebird')
    , util = require('util')
    , request = require('request')

//, imageType = 'url'
//, files = ['https://ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/image/h%3D200/sign=9ec7470f9a16fdfac76cc1ee848f8cea/738b4710b912c8fcfae64ae9fb039245d68821f8.jpg']

    , imageType = 'image'
    , files = ['/Users/linweihao/Documents/aaa/14509432943070.9484949668403715.jpg','/Users/linweihao/Documents/aaa/14509432943060.42040413548238575.jpg']
    , url = 'http://127.0.0.1:3000/upload'


Promise.resolve().then(function () {
    var req = request.post(url, function (err, httpResponse, body) {
        console.log((new Date()).getSeconds())
        if (err) {
            return console.log(err.stack)
        }
        console.log("body....." + body)
    })
    var form = req.form();

    files.forEach(function (file) {
        if (imageType == 'url') {
            form.append('image', file)
        } else {
            form.append('image', fs.createReadStream(file))
        }
    })
    return req

}).catch(function (err) {
    console.log(err.stack)
})
