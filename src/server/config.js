+19
Lines changed: 19 additions & 0 deletions
Original file line number	Original file line	Diff line number	Diff line change
@@ -0,0 +1,19 @@
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
export default class Server {
  constructor() {
    //inicializar las propiedades del futuro objeto
    this.app = express();
    this.PORT = process.env.PORT || 3000;
  }
  // definir metodos
  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Servidor activo en http://localhost:${this.PORT}`);
    });
  }
}