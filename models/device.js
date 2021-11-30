import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name: {type: String},
    description: {type: String},
    host: {type: String, required: [true, 'Host obligatorio.']},
    devId: {type: String, required: [true, 'ID obligatorio.']},
    date:{type: Date, default: Date.now},
    activo: {type: Boolean, default: true},
    groups: {type: Array},
});

// Convertir a un modelo
const Device = mongoose.model('Device', deviceSchema, 'devices');

export default Device;