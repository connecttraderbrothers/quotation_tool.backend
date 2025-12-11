# Trader Brothers Quotation Tool - Backend

Backend service for generating professional PDF quotations using Puppeteer and Express.js.

## Features

- PDF generation from HTML templates
- RESTful API endpoints
- Railway deployment ready
- CORS enabled for frontend integration
- Helmet security middleware
- Response compression

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
```

## Development

Run the development server with auto-reload:

```bash
npm run dev
```

## Production

Start the production server:

```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Generate PDF
```
POST /api/generate-pdf
Content-Type: application/json

{
  "htmlContent": "<html>...</html>",
  "filename": "quote-0001.pdf"
}
```
Returns a PDF file as binary data.

### Get Estimate Number
```
GET /api/estimate-number
```
Returns the next available estimate number.

## Deployment to Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Railway will automatically detect the configuration from `railway.json`
4. Set environment variables in Railway dashboard if needed
5. Deploy!

### Railway Configuration

The `railway.json` file is pre-configured with:
- Nixpacks builder
- Auto-restart on failure
- Optimized for Node.js applications

## Frontend Integration

Update your frontend code to point to the backend URL:

```javascript
const API_URL = 'https://your-railway-app.railway.app';

async function downloadQuote() {
  const response = await fetch(`${API_URL}/api/generate-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      htmlContent: generateFullHTML(),
      filename: `estimate-${estimateNumber}.pdf`
    })
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estimate-${estimateNumber}.pdf`;
  a.click();
}
```

## Project Structure

```
.
├── server.js           # Main Express server
├── package.json        # Dependencies and scripts
├── railway.json        # Railway deployment config
├── .env               # Environment variables (not in git)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Security

- Helmet.js for security headers
- CORS configured for cross-origin requests
- Input validation on API endpoints
- Rate limiting recommended for production

## Performance

- Response compression enabled
- Puppeteer optimized for serverless environments
- Browser instances properly closed after use

## Troubleshooting

### Puppeteer fails to launch
Ensure Railway has enough memory allocated. Puppeteer requires at least 512MB RAM.

### PDF generation timeout
Increase the timeout in the Puppeteer configuration if dealing with complex pages.

### CORS errors
Verify your frontend URL is allowed in the CORS configuration.

## License

ISC

## Support

For issues or questions, contact Trader Brothers LTD at traderbrotherslimited@gmail.com
