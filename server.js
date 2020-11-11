const express = require('express')
const app = express()
const multer = require('multer')
const cors = require('cors')

app.use(cors())

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        const date = new Date().toISOString()
        cb(null, date.replace(/:/g, "-") + file.originalname)
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})

const upload = multer({storage: storage}).single('file')

app.post('/upload', (req, res) => {

    upload(req, res, (err) => {
        if(err) {
            throw err
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })

})

app.listen(8000, () => {
    console.log('App start')
})