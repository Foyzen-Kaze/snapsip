import { app } from "./app";
import { abrirBd } from "./db/conexion";
import { ejecutarSeed } from "./db/seed";

const puerto = Number(process.env.PORT) || 3000;

abrirBd();
ejecutarSeed();

app.listen(puerto, () => {
  console.log(`SnapSip ejecutándose en http://localhost:${puerto}`);
});
