import express from 'express';
const router = express.Router();

// importar el modelo nota
import Group from '../models/group';

const {verificarAuth, verificarAdministrador} = require('../middlewares/autenticacion');

// Post una nota
router.post('/new-group', verificarAuth, async(req, res) => {
    //console.log(req.usuario._id);
    const body = req.body;
    body.creatorId = req.usuario._id;
    try {
      const groupDB = await Group.create(body);
      res.status(200).json(groupDB); 
    } catch (error) {
      return res.status(500).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Get con parámetros
router.get('/group/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const groupDB = await Group.findOne({_id});
      res.json(groupDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});
  
// Get con todos los documentos
router.get('/groups', verificarAuth, async(req, res) => {
    //const usuarioId = req.usuario._id;

    try {
      //const groupDb = await Group.find({usuarioId});
      const groupDb = await Group.find({});
      res.json(groupDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Delete eliminar una nota
router.delete('/group/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const groupDb = await Group.findByIdAndDelete({_id});
      if(!groupDb){
        return res.status(400).json({
          mensaje: 'No se encontró el id indicado',
          error
        })
      }
      res.json(groupDb);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Put actualizar una nota
router.put('/group/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
      const groupDb = await Group.findByIdAndUpdate(
        _id,
        body,
        {new: true});
      res.json(groupDb);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Exportamos la configuración de express app
module.exports = router;