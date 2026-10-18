import { Router } from "express";
import { borrarServicioPorID, buscarServicioPorID, editarServicioPorID, crearServicio, listarServicio, prueba } from "../controllers/servicios.controllers.js";
import { validacionServicio } from "../middlewares/validacionServicio.js";

const router = Router();
//http://localhost:3000/api/servcicios/
router.route('/test').get(prueba)
router.route('/').post(validacionServicio, crearServicio).get(listarServicio)
router.route('/:id').get(buscarServicioPorID).delete(borrarServicioPorID).put(editarServicioPorID).patch(editarServicioPorID)

export default router