const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize WhatsApp Client with phone number authentication
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  }
});

// Phone number linking (instead of QR code)
const PHONE_NUMBER = process.env.PHONE_NUMBER;

client.on('loading', () => {
  console.log('WhatsApp client is loading...');
});

client.on('authenticated', () => {
  console.log('✓ WhatsApp authenticated successfully');
});

client.on('auth_failure', (msg) => {
  console.error('✗ Authentication failed:', msg);
});

client.on('ready', () => {
  console.log('✓ WhatsApp client is ready!');
});

// Handle incoming messages
client.on('message', async (message) => {
  console.log(`[${new Date().toLocaleTimeString()}] Message from ${message.from}: ${message.body}`);

  // Simple command handling
  if (message.body === '/help') {
    await message.reply('Available commands:\n/help - Show this message\n/ping - Test bot');
  } else if (message.body === '/ping') {
    await message.reply('Pong! 🤖');
  } else {
    await message.reply('Echo: ' + message.body);
  }
});

client.on('disconnected', (reason) => {
  console.log('WhatsApp disconnected:', reason);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', bot_ready: client.info ? true : false });
});

// Send message endpoint
app.post('/send-message', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'phoneNumber and message required' });
  }

  try {
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    const chatId = formattedNumber + '@c.us';
    await client.sendMessage(chatId, message);
    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

client.initialize();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
