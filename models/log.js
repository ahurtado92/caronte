import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const logSchema = new Schema({
    tag: {type: Object},
    user: {type: Object},
    device: {type: Object},
    date:{type: Date, default: Date.now},
    action:{type: Array},
    logs:{type: String},
});

// Convertir a un modelo
const Log = mongoose.model('Log', logSchema, 'logs');

export default Log;