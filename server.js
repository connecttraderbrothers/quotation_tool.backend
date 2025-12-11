require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate PDF endpoint
app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  
  try {
    const { htmlContent, filename } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Launch puppeteer with Railway-friendly settings
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set content with full HTML structure
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF with A4 format
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5cm',
        right: '0.5cm',
        bottom: '0.5cm',
        left: '0.5cm'
      }
    });

    await browser.close();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'quote.pdf'}"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      message: error.message 
    });
  }
});

// Get estimate number
app.get('/api/estimate-number', (req, res) => {
  // In production, this would come from a database
  // For now, return a simple counter
  const estimateNumber = Math.floor(Math.random() * 9000) + 1000;
  res.json({ estimateNumber });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
