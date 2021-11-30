import express from 'express';
const router = express.Router();

// importar el modelo nota
import Tag from '../models/tag';

const {verificarAuth, verificarAdministrador} = require('../middlewares/autenticacion');

// Post una nota
router.post('/new-tag', verificarAuth, async(req, res) => {
    //console.log(req.usuario._id);
    const body = req.body;
    body.creatorId = req.usuario._id;
    try {
      const tagDB = await Tag.create(body);
      res.status(200).json(tagpDB); 
    } catch (error) {
      return res.status(500).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Get con parámetros
router.get('/tag/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const tagDB = await Tag.findOne({_id});
      res.json(tagDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});
  
// Get con todos los documentos
router.get('/tags', verificarAuth, async(req, res) => {
    //const usuarioId = req.usuario._id;

    try {
      //const tagDb = await Tag.find({usuarioId});
      const tagDb = await Tag.find({});
      res.json(tagDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Delete eliminar una nota
router.delete('/tag/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const tagDb = await Tag.findByIdAndDelete({_id});
      if(!tagDb){
        return res.status(400).json({
          mensaje: 'No se encontró el id indicado',
          error
        })
      }
      res.json(tagDb);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Put actualizar una nota
router.put('/tag/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
      const tagDb = await Tag.findByIdAndUpdate(
        _id,
        body,
        {new: true});
      res.json(tagDb);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Exportamos la configuración de express app
module.exports = router;