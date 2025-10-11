import { createClient } from '@google-cloud/vertexai';

export async function POST(request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { personImage, clothingImage } = await request.json();

    if (!personImage || !clothingImage) {
      return Response.json(
        { error: 'Both person and clothing images are required' },
        { status: 400, headers }
      );
    }

    // Service Account Key'den client oluÅŸtur
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
    
    const client = new createClient({
      project: 'vton-474715',
      location: 'us-central1',
      credentials: serviceAccountKey,
    });

    const model = 'virtual-try-on-preview-08-04';

    const requestBody = {
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

    const response = await client.models.recontextImage(requestBody);

    if (response.generatedImages && response.generatedImages.length > 0) {
      const resultImage = response.generatedImages[0].image;
      return Response.json({
        success: true,
        resultImage: resultImage.inlineData?.data || resultImage,
        message: 'Virtual try-on completed successfully'
      }, { headers });
    } else {
      return Response.json(
        { error: 'No images generated' },
        { status: 500, headers }
      );
    }

  } catch (error) {
    console.error('Virtual try-on error:', error);
    return Response.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
