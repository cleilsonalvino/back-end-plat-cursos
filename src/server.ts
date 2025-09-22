import 'dotenv/config';
import { createApp } from './app.js';
import { logInfo } from './utils/logger.js';



const port = Number(process.env.PORT || 3000);
const app = createApp();


// 404 JSON (tem que ser o último)
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`
    }
  });
});

logInfo('Servidor iniciado na porta 3000');
logInfo(`AJAFS API DOCS rodando em http://localhost:${port}/v1/docs`);


app.listen(port, '0.0.0.0', () => 
  console.log(`AJAFS API rodando em http://192.168.80.112:${port}`)
);
