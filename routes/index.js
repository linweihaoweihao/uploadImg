var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var Request = Promise.promisify(require("request"));
var fs = Promise.promisifyAll(require("fs"));
var formidable = require('formidable');
var multiparty = require('multiparty')
var AVATAR_UPLOAD_FOLDER = '/Users/linweihao/Documents/uploads/'

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/u', function (req, res, next) {
    res.send('<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="text" name="title"><br>' +
    '<input type="file" name="upload" multiple="multiple"><br>' +
    '<input type="submit" value="Upload">' +
    '</form>');
})


// formidable
router.post('/upload', function (req, res, next) {
    //console.log('req....' + JSON.stringify(req.query))
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = AVATAR_UPLOAD_FOLDER;     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {
        console.log('fields....' + JSON.stringify(fields))
        console.log('files....' + JSON.stringify(files))
        if (err) {
            console.log('err....' + err)
            return;
        }
        console.log('type....' + files.image.type)
        var extName = '';  //后缀名
        switch (files.image.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        console.log(newPath);
        fs.renameSync(files.image.path, newPath);  //重命名

    });
    form.on('progress', function (bytesReceived, bytesExpected) {
        console.log('bytesReceived...' + bytesReceived)
    });
    form.on('end', function () {
        res.send('suceess')
    });


});

// multiparty
router.post('/upload2', function (req, res, next) {

    var form = new multiparty.Form();
// Errors may be emitted
// Note that if you are listening to 'part' events, the same error may be
// emitted from the `form` and the `part`.
    form.on('error', function (err) {
        console.log('Error parsing form: ' + err.stack);
    });

// Parts are emitted when parsing the form
    form.on('part', function (part) {
        // You *must* act on the part by reading it
        // NOTE: if you want to ignore it, just call "part.resume()"
        if (!part.filename || part.name !== 'image') {
            return part.resume()
        }

        Promise.resolve().then(function () {
            var ws = fs.createWriteStream(AVATAR_UPLOAD_FOLDER + part.filename)
            ws.on('close', function () {
            }).on('error', function () {
            })
            part.pipe(ws)
        }).catch(function () {
            next(err)
        })

        part.on('error', function (err) {
            next(err)
        });
    });

// Close emitted after form parsed
    form.on('close', function () {
        res.end('Upload completed!');
    });

// Parse req
    form.parse(req);
})

module.exports = router;
