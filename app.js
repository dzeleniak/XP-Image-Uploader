const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req,file,cb) {
        checkFileType(file,cb);
    }
}).single('myImage');

//file type validation
function checkFileType(file, cb) {
    //allowed extensions
    const fileTypes = /jpeg|jpg|png|gif/;
    
    //Check ext
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    //Check mimetype
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extName) {
        return cb(null, true);
    } else {
        cb('Error: images only');
    }
}

//Init app
const app = express()

// EJS
app.set('view engine', 'ejs');

//Public folder
app.use(express.static('./public'));

app.get('/', (req,res) => res.render('index'));

app.post('/upload', (req,res) => {
    upload(req,res,(err)=>{
        if(err) {
            res.render('index', {
                msg: err
            })
        } else {
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: no file selected',
                })
            } else {
                res.render('index', {
                    msg: 'File uploaded...',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000;

app.listen(port, () => console.log(`Server started on ${port}`));