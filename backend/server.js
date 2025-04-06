const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get OAuth token
const getZoomAccessToken = async () => {
  try {
    const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=Wd_Hs_sTQKGXFmFWz-BFYA',
      null,
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
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
    const { topic, start_time, duration, timezone } = req.body;
    
    // Get access token
    const accessToken = await getZoomAccessToken();
    
    // Create meeting
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic,
        type: 2, // Scheduled meeting
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
          auto_recording: 'none'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      meetingId: response.data.id,
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url
    });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create Zoom meeting' });
  }
});

// Generate Zoom Meeting Signature
app.post('/api/zoom-signature', (req, res) => {
  try {
    const { meetingNumber, role } = req.body;
    
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(process.env.ZOOM_SDK_KEY + meetingNumber + timestamp + role).toString('base64');
    const hash = crypto.createHmac('sha256', process.env.ZOOM_SDK_SECRET).update(msg).digest('base64');
    const signature = Buffer.from(`${process.env.ZOOM_SDK_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

    res.json({ signature });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 