import express from 'express';
const router = express.Router();

// importar el modelo nota
import Tag from '../models/tag';
import User from '../models/user';
import Device from '../models/device';
import Log from '../models/log';
import Group from '../models/group';

// Get con parámetros
router.get('/:host/:device/:tag', async(req, res) => {
    const _host = req.params.host;
    const _device = req.params.device;
    const _tag = req.params.tag;
    let userAction = null;
    try {
      const tag = await Tag.findOne({tagId: _tag});
      const user = await User.findOne({tags: tag._id});
      const device = await Device.findOne({host: _host, devId: _device});
      let intersection = device.groups.filter(x => user.groups.includes(x));
      //const device = await Device.findOne({devId: _device});
      if ( device && tag && intersection.length>0 && device.activo && user.activo && tag.active){
        res.json({access: "granted"});
        // call the first chunk of code right away
        device.locked = false;
        console.log(device);
        // call the rest of the code and have it execute after 3 seconds
        const unlockedDevice = await Device.findByIdAndUpdate(device._id,device,{new: true});
        setTimeout(async()=>{
          device.locked = true;
          console.log(device);
          console.log('Se espera 3 segundos');
          const lockedDevice = await Device.findByIdAndUpdate(device._id,device,{new: true});
        }, 2000);

        const log = {};
        log.device = device;
        log.tag = tag;
        log.user = user;
        log.action = {access: "granted"};
        if(!device.outdoor){
          userAction = "acceder a la sala";
        }else{
          if(user.status){
            user.status = false;
            userAction = "salir";
          }else{
            user.status = true;
            userAction = "entrar";
          }
        }
        const usuarioDB = await User.findByIdAndUpdate(user._id,user,{new: true});
        log.logs = "El usuario " + user.uname + " ha usado el dispositivo " + device.host + " para "+userAction+".";
        const logDB = await Log.create(log);
      } else {
          responseError = {
            mensaje: 'Ocurrio un error',
            error: 'No se permite el acceso',
          }
          return res.status(400).json(responseError)
        }
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
});

router.get('/open/:host', async(req, res) => {
  const _device = req.params.device;
  try {
    const device = await Device.findOne({host: _host, devId: _device});
    if(device.openRequest){
      res.json({open: "true"});
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
  try {
    const doorDb = await Device.find({});
    const groupDB = await Group.find({});
    /*doorDb.forEach(async door=>{
      //let intersection = device.groups.filter(x => user.groups.includes(x));
      let intersection = await door.groups.filter(x => groups.includes(x));
      console.log(intersection);
    });*/
      const resp = [];
      doorDb.forEach(async door=>{
        let intersection = groupDB.filter(x => door.groups.includes(x._id)); //OK!!!!!
        //console.log(intersection);
        //doorDb.push(intersection.pop());
        resp.push({
          activo: door.activo,
          groups: door.groups,
          outdoor: door.outdoor,
          locked: door.locked,
          _id: door._id,
          host: door.host,
          devId: door.devId,
          date: door.date,
          description: door.description,
          name: door.name,
          inGroups: intersection
        })
      });
      console.log(resp);
      res.json(resp);
    
    
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