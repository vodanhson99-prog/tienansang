import express from 'express';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;
const localPath = path => fileURLToPath(new URL(path, import.meta.url));

app.use(express.static(localPath('./public/')));
app.use('/vendor/three/build', express.static(localPath('./node_modules/three/build/')));
app.use('/vendor/three/examples/jsm', express.static(localPath('./node_modules/three/examples/jsm/')));
app.disable('x-powered-by');

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
