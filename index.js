require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bot de Cumbres del Norte está corriendo 🏔️');
});

// Webhook verification
app.get('/webhook', (req, res) => {
  const verifyToken = req.query['hub.verify_token'];
  if (verifyToken === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Receive messages
app.post('/webhook', (req, res) => {
  const body = req.body;
  
  try {
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      
      if (message) {
        handleMessage(message);
      }
    }
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
  
  res.sendStatus(200);
});

async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: text }
      },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
      }
    );
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function handleMessage(message) {
  const from = message.from;
  const text = message.text?.body?.toLowerCase();

  if (!text) return;

  switch (text) {
    case 'hola':
      await sendMessage(from, '¡Hola! ¿Cómo estás? Soy el asistente de Cumbres del Norte 🏔️');
      break;
    case 'ayuda':
      await sendMessage(from, '¡Claro! ¿Con qué necesitas ayuda hoy?');
      break;
    default:
      await sendMessage(from, 'No entendí tu mensaje. Por favor, intenta de nuevo.');
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot corriendo en puerto ${PORT}`));

app.post('/webhook', (req, res) => {
  console.log('📨 Mensaje recibido:', JSON.stringify(req.body, null, 2));
  
  const body = req.body;
  
  try {
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      
      if (message) {
        handleMessage(message);
      }
    }
  } catch (error) {
    console.error('Error procesando mensaje:', error);
  }
  
  res.sendStatus(200);
});