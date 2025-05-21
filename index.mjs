import Server from './src/server.mjs';
import https from 'https';
import fs from 'fs';

// Certificat SSL auto-signé
const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

// Crée le serveur Express
const server = new Server();

// Démarre l’app
await server.run(); // configure `server.app`

// Lance uniquement HTTPS sur le port 3002
https.createServer(options, server.app).listen(3000, () => {
  console.log('✅ HTTPS server running at https://localhost:3000');
});
