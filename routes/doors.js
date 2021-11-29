import express from 'express';
const router = express.Router();

// importar el modelo nota
import Device from '../models/device';
import Tag from '../models/tag';

// Get con parámetros
router.get('/:host/:device/:tag', async(req, res) => {
  console.log('inside!!!')
    const _host = req.params.host;
    const _device = req.params.device;
    const _tag = req.params.tag;
    try {
      const host = await Device.findOne({host: _host});
      const device = await Device.findOne({devId: _device});
      const tag = await Tag.findOne({tagId: _tag});
      if (host && device && tag){
        res.json({access: "granted"});
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

// Exportamos la configuración de express app
module.exports = router;