import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "../database/db.js";
import cookieParser from "cookie-parser";

export default class Server {
  constructor() {
    
    this.app = express();
    this.PORT = process.env.PORT || 3000;
    this.middlewares();
  }
  
  middlewares() {
    this.app.use(cors({
        // Lee la variable del .env, si no existe usa localhost por defecto
        origin: process.env.FRONTEND_URL || "http://localhost:5173", 
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }));
    this.app.use(express.json()); 
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());
    const __dirname = dirname(fileURLToPath(import.meta.url));
    
    this.app.use(express.static(__dirname + "/../../public"));
  }

  listen() {
    this.app.listen(this.PORT, () => {
       console.info(`Servidor activo en http://localhost:${this.PORT}`);
    });
  }
}