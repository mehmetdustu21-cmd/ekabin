// n8n webhook URL'ini buraya yapıştır
const API_URL = 'https://zvkqyeyc.rpcld.net/webhook/virtual-tryon'; // 

export interface VirtualTryOnResult {
  success: boolean;
  image?: string;
  error?: string;
}

export async function performVirtualTryOn(
  personImage: string,
  clothingImage: string
): Promise<VirtualTryOnResult> {
  
  console.log('🚀 Calling API:', API_URL);

  try {
    if (!personImage || !clothingImage) {
      throw new Error('Both images are required');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personImage,
        garmentImage: clothingImage
      }),
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('📦 Result:', result);

    if (!result || !result.success || !result.image) {
      throw new Error('Invalid response from API');
    }

    console.log('✅ Success!');
    
    return {
      success: true,
      image: result.image
    };

  } catch (error: any) {
    console.error('💥 Error:', error.message);
    return {
      success: false,
      error: error.message || 'An error occurred'
    };
  }
}