import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const logSchema = new Schema({
    tag: {type: Object, required: [true, 'Host obligatorio.']},
    user: {type: Object, required: [true, 'ID obligatorio.']},
    device: {type: Object, required: [true, 'ID obligatorio.']},
    date:{type: Date, default: Date.now},
    action:{type: Array},
    logs:{type: String},
});

// Convertir a un modelo
const Log = mongoose.model('Log', logSchema, 'logs');

export default Log;