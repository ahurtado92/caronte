import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tagSchema = new Schema({

    userId: {type: String, required: [true, 'Host obligatorio.']},
    tagId: {type: String, required: [true, 'ID obligatorio.']},
    date:{type: Date, default: Date.now},
    active: {type: Boolean, default: true},

});

// Convertir a un modelo
const Tag = mongoose.model('Tag', tagSchema);

export default Tag;