# Military WhatsApp Bot

WhatsApp bot deployed on Pella with phone number authentication (no QR code required).

## Features

- ✅ Phone number authentication instead of QR code
- ✅ Session persistence for Pella deployment
- ✅ REST API for sending messages
- ✅ Command handling
- ✅ Headless mode for server deployment

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your WhatsApp phone number:

```
PHONE_NUMBER=1234567890  # Without + or -
PORT=3000
NODE_ENV=production
```

### 3. Run Locally

```bash
npm start
```

## Pella Deployment

### 1. Push to Repository

```bash
git add .
git commit -m "WhatsApp bot ready for Pella"
git push origin main
```

### 2. Deploy on Pella

```bash
pella deploy peacemoreservice-svg/Militarybot
```

Or use the deployment configuration:

```bash
pella deploy -f pella-deploy.yml
```

### 3. Set Environment Variables on Pella

```bash
pella env:set PHONE_NUMBER=your_number
```

## API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "bot_ready": true
}
```

### Send Message

```bash
POST /send-message
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "message": "Hello from bot!"
}
```

## Bot Commands

- `/help` - Show available commands
- `/ping` - Test bot response

## Phone Number Authentication

Instead of scanning a QR code:

1. The bot uses your phone number to authenticate
2. Session is saved in `.wwebjs_auth/phone_session.json`
3. On Pella, the session persists across deployments
4. First run will link your WhatsApp account

## Troubleshooting

### Session Issues

If you need to re-authenticate, remove the session file:

```bash
rm -rf .wwebjs_auth/
```

### Port Already in Use

```bash
PORT=3001 npm start
```

### Connection Issues

Check that your phone:
- Has an active internet connection
- Is not using WhatsApp Web on another device
- Has the latest WhatsApp version

## License

MIT
