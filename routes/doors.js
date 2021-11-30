import express from 'express';
const router = express.Router();

// importar el modelo nota
import Tag from '../models/tag';
import User from '../models/user';
import Device from '../models/device';

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