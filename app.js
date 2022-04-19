const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const expresshb = require('express-handlebars')
var multer  = require('multer') // for uploading files to server
var speechToText = require('./speech')

dotenv.config({path: './config/config.env'})

const app = express()

// customizing how multer stores files
const storage = multer.diskStorage({
    destination: __dirname + '/uploads/',
    filename: (req, file, cb) => {
        cb(null, "upload.wav");
    }
})

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

app.engine('.hbs', expresshb({defaultlayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs')


//Static folder
app.use(express.static(path.join(__dirname='public')))

// uploaded file destination
var upload = multer({ storage });

// processing file upload
app.post('/api/test', upload.single('upl'), (req, res, /*next - will need this later*/) => {
    console.log("Post:")
    console.log(req.body);
    console.log(req.file);
    // next();
});

// returning the result to the user
app.get('/api/transcribe', async(req, res) => {
    // speech to text is asynchronous, waiting for it to finish before sending response
    const result = await speechToText();
    res.json(result);
});

//routes
app.use('/', require('./routes/index'))

app.listen(PORT, console.log(`server on ${process.env.NODE_ENV} mode on ${PORT}`))