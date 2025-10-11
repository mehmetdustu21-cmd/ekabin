export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { personImage, clothingImage } = req.body;

    if (!personImage || !clothingImage) {
      return res.status(400).json({ 
        error: 'Both person and clothing images are required' 
      });
    }

    // Google Cloud Vertex AI endpoint
    const PROJECT_ID = 'vton-474715';
    const LOCATION = 'us-central1';
    const MODEL_ID = 'virtual-try-on-preview-08-04';
    
    const endpoint = https://-aiplatform.googleapis.com/v1/projects//locations//publishers/google/models/:recontextImage;
    
    // Service Account Key'den access token al
    const accessToken = await getAccessToken();

    const requestBody = {
      source: {
        personImage: {
          inlineData: {
            data: personImage,
            mimeType: 'image/jpeg'
          }
        },
        productImages: [
          {
            productImage: {
              inlineData: {
                data: clothingImage,
                mimeType: 'image/jpeg'
              }
            }
          }
        ]
      },
      config: {
        baseSteps: 32,
        numberOfImages: 1,
        safetyFilterLevel: 'BLOCK_LOW_AND_ABOVE',
        personGeneration: 'ALLOW_ADULT'
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': Bearer ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(API returned : );
    }

    const data = await response.json();

    if (data.generatedImages && data.generatedImages.length > 0) {
      const resultImage = data.generatedImages[0].image;
      return res.status(200).json({
        success: true,
        resultImage: resultImage.inlineData?.data || resultImage,
        message: 'Virtual try-on completed successfully'
      });
    } else {
      return res.status(500).json({ 
        error: 'No images generated' 
      });
    }

  } catch (error) {
    console.error('Virtual try-on error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// Service Account Key'den access token al
async function getAccessToken() {
  const serviceAccountKey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
  
  // JWT token oluÅŸtur
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccountKey.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: serviceAccountKey.token_uri,
    exp: now + 3600,
    iat: now
  };

  // JWT oluÅŸtur (basitleÅŸtirilmiÅŸ)
  const jwt = btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload)) + '.signature';
  
  // Access token al
  const tokenResponse = await fetch(serviceAccountKey.token_uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to get access token');
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}
import { createClient } from '@google-cloud/vertexai';
import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { personImage, clothingImage } = req.body;

    if (!personImage || !clothingImage) {
      return res.status(400).json({ 
        error: 'Both person and clothing images are required' 
      });
    }

    // Service Account Key'den client oluÅŸtur
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
    
    const client = new createClient({
      project: 'vton-474715',
      location: 'us-central1',
      credentials: serviceAccountKey,
    });

    const model = 'virtual-try-on-preview-08-04';

    const request = {
      model: model,
      source: {
        personImage: {
          inlineData: {
            data: personImage,
            mimeType: 'image/jpeg'
          }
        },
        productImages: [
          {
            productImage: {
              inlineData: {
                data: clothingImage,
                mimeType: 'image/jpeg'
              }
            }
          }
        ]
      },
      config: {
        baseSteps: 32,
        numberOfImages: 1,
        safetyFilterLevel: 'BLOCK_LOW_AND_ABOVE',
        personGeneration: 'ALLOW_ADULT'
      }
    };

    console.log('Sending request to Vertex AI...');

    const response = await client.models.recontextImage(request);

    if (response.generatedImages && response.generatedImages.length > 0) {
      const resultImage = response.generatedImages[0].image;
      return res.status(200).json({
        success: true,
        resultImage: resultImage.inlineData?.data || resultImage,
        message: 'Virtual try-on completed successfully'
      });
    } else {
      return res.status(500).json({ 
        error: 'No images generated' 
      });
    }

  } catch (error) {
    console.error('Virtual try-on error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
