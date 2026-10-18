import { Router } from "express";
import { borrarServicioPorID, buscarServicioPorID, editarServicioPorID, crearServicio, listarServicio, prueba } from "../controllers/servicios.controllers.js";
import { validacionIDServicio, validacionServicio } from "../middlewares/validacionServicio.js";

const router = Router();
//http://localhost:3000/api/servcicios/
router.route('/test').get(prueba)
router.route('/').post(validacionServicio, crearServicio).get(listarServicio)
router.route('/:id').get(validacionIDServicio, buscarServicioPorID).delete(validacionIDServicio, borrarServicioPorID).put(validacionIDServicio, editarServicioPorID).patch(validacionIDServicio, editarServicioPorID)

export default router