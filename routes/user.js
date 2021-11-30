import express from 'express';
import User from '../models/user';
const router = express.Router();

const {verificarAuth, verificarAdministrador} = require('../middlewares/autenticacion');

// Hash Contraseña
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Filtrar campos de PUT
const _ = require('underscore');

router.post('/nuevo-usuario', async(req, res) => {
    //const body = req.body;
    const body = {
        role: req.body.role,
        activo: req.body.activo,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        phone: req.body.phone,
        birth: req.body.birth,
        email: req.body.email,
        uname: req.body.uname,
        group: req.body.group,
        avatar: req.body.avatar,
    }

    body.pass = bcrypt.hashSync(req.body.pass, saltRounds);

    try {
        const usuarioDB = await User.create(body);
        res.json(usuarioDB);
    } catch (error){
        return res.status(500).json({
            mensaje: 'Ocurrió un error',
            error
        });
    }
});

// Get con parámetros
router.get('/usuario/:id', async(req, res) => {

  const _id = req.params.id;

  try {
    const userDb = await User.findOne({_id});
    res.json(userDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con todos los documentos
router.get('/usuarios', verificarAuth, async(req, res) => {
  const _id = req.usuario._id;
  const role = req.usuario.role;
  const dist = [];
  if(role == 'TEACHER'){
    dist.push('ADMIN')
  }
  try {
    const userDb = await User.find({ role: { $nin: dist } });
    res.json(userDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

//router.put('/usuario/:id', [verificarAuth, verificarAdministrador], async(req, res) => {
router.put('/usuario/:id', async(req, res) => {

    const _id = req.params.id;
    const body = req.body;
    if(body.pass){
      body.pass = bcrypt.hashSync(req.body.pass, saltRounds);
    }
  
    try {
      // {new:true} nos devuelve el usuario actualizado
      const usuarioDB = await User.findByIdAndUpdate(
        _id, 
        body, 
        {new: true}
      );
      return res.json(usuarioDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      });
    }
  
});

router.delete('/usuario/:id', async(req, res) => {

    let id = req.params.id;
  
    try {
  
      const usuarioDelete = await User.findByIdAndRemove(id);
  
      if(!usuarioDelete){
        return res.status(400).json({
          mensaje: 'Usuario no encontrado'
        })
      }
  
      return res.json(usuarioDelete);
      
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  
});

module.exports = router;