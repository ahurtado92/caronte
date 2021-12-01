import express from 'express';
const router = express.Router();

// importar el modelo nota
import Tag from '../models/tag';
import User from '../models/user';
import Device from '../models/device';
import Log from '../models/log';

// Get con parámetros
router.get('/:host/:device/:tag', async(req, res) => {
    const _host = req.params.host;
    const _device = req.params.device;
    const _tag = req.params.tag;
    try {
      const tag = await Tag.findOne({tagId: _tag});
      const user = await User.findOne({tags: tag._id});
      const device = await Device.findOne({host: _host, devId: _device});
      let intersection = device.groups.filter(x => user.groups.includes(x));
      //const device = await Device.findOne({devId: _device});
      if ( device && tag && intersection.length>0 && device.activo && user.activo && tag.active){
        res.json({access: "granted"});
        const logDB = await Log.create(
          [
            tag,
            user,
            device,
            date = Date.now,
            action = {access: "granted"},
            logs = "El usuario " + user.name + "ha usado el dispositivo " + device.name + ".",
          ]
        );
        console.log(logDB);
      } else {
          return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
          })
        }
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

// Get con todos los documentos
router.get('/doors', async(req, res) => {
  //const usuarioId = req.usuario._id;

  try {
    //const doorDb = await door.find({usuarioId});
    const doorDb = await Device.find({});
    res.json(doorDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con parámetros
router.get('/door/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const doorDb = await Device.findOne({_id});
    res.json(doorDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Delete eliminar una nota
router.delete('/door/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const doorDb = await Device.findByIdAndDelete({_id});
    if(!doorDb){
      return res.status(400).json({
        mensaje: 'No se encontró el id indicado',
        error
      })
    }
    res.json(doorDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Put actualizar una nota
router.put('/door/:id', async(req, res) => {
  const _id = req.params.id;
  const body = req.body;
  console.log(body);
  try {
    const doorDb = await Device.findByIdAndUpdate(
      _id,
      body,
      {new: true});
    res.json(doorDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Exportamos la configuración de express app
module.exports = router;