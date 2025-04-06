const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the StudyBuddy Connect API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      createZoomMeeting: '/api/create-zoom-meeting',
      zoomSignature: '/api/zoom-signature'
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});

// Get OAuth token
const getZoomAccessToken = async () => {
  try {
    const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      'https://zoom.us/oauth/token',
      new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID
      }).toString(),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom access token:', error.response?.data || error.message);
    throw error;
  }
};

// Create a Zoom Meeting
app.post('/api/create-zoom-meeting', async (req, res) => {
  try {
    console.log('Received request to create Zoom meeting:', req.body);
    const { topic, start_time, duration, timezone } = req.body;
    
    const accessToken = await getZoomAccessToken();
    
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 1,
        start_time,
        duration,
        timezone,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: false,
          watermark: false,
          audio: 'both',
          auto_recording: 'none',
          waiting_room: false,
          allow_multiple_devices: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Successfully created Zoom meeting:', response.data);
    res.json({
      meetingId: response.data.id,
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url
    });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create Zoom meeting',
      details: error.response?.data || error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('\n==========================================');
  console.log('🚀 Server is running!');
  console.log(`📡 Listening on port ${PORT}`);
  console.log('------------------------------------------');
  console.log('Available endpoints:');
  console.log(`- GET  http://localhost:${PORT}/`);
  console.log(`- GET  http://localhost:${PORT}/api/test`);
  console.log(`- POST http://localhost:${PORT}/api/create-zoom-meeting`);
  console.log('==========================================\n');
}); 