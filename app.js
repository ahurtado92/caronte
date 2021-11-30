import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import moment from 'moment';
moment().format(); 

//console.log(moment().weekday(15));

const app = express();

// Conexión a DB
import mongoose from 'mongoose';
// Mongoose uri
//const uri = 'mongodb://localhost:27017/proyecto1';
const uri = "mongodb+srv://caronte:563412@cluster0.9vmw6.mongodb.net/caronte?retryWrites=true&w=majority";
// Mongoose options 
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  };
// Mongoose using promises
mongoose.connect(uri, options).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */ 
        console.log('DB connected');
    },
    err => { 
        /** handle initial connection error */ 
        err
    }
  ) 

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/doors/', require('./routes/doors'));
app.use('/api/groups/', require('./routes/group'));
app.use('/api/users/', require('./routes/user'));
app.use('/api', require('./routes/user'));
app.use('/api/login', require('./routes/login'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('Example app listening on port: ', app.get('puerto'));
});