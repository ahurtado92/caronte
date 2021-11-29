import mongoose from 'mongoose';

const uniqueValidator = require('mongoose-unique-validator');

// Roles
const roles = {
  values: ['ADMIN', 'USER', 'TEACHER'],
  message: '{VALUE} is not a valid role'
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
  role: { type: String, default: 'USER', enum: roles, required: [true, 'El rol es necesario'] },
  activo: { type: Boolean, default: true },
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  apellidos: {type: String},
  phone: {type: String},
  birth: {type: String},
  email: { type: String, unique: true, required: [true, 'Email es necesario'] },
  uname: {type: String, unique: true, required: [true, 'El nombre de usuario es necesario'] },
  pass: { type: String, required: [true, 'Pass es necesario'] },
  group: {type: String},
  avatar: {type: String, default: '/public/img/avatar/default.jpg',},
  date: { type: Date, default: Date.now },
});

// Validator
userSchema.plugin(uniqueValidator, { message: 'Error, esperaba {PATH} único.' });

// Eliminar pass de respuesta JSON
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.pass;
  return obj;
 }

// Convertir a modelo
const User = mongoose.model('User', userSchema);

export default User;