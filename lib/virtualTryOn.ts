// lib/virtualTryOn.ts
// Google Cloud Vertex AI Virtual Try-On - Pages API

export interface VirtualTryOnResult {
  success: boolean;
  image?: string;
  error?: string;
}

export async function performVirtualTryOn(
  personImage: string,
  clothingImage: string
): Promise<VirtualTryOnResult> {
  
  console.log('Calling Google Cloud Vertex AI API...');

  try {
    if (!personImage || !clothingImage) {
      throw new Error('Both images are required');
    }

    // Base64 stringleri hazÄ±rla
    const personBase64 = personImage.split(',')[1];
    const clothingBase64 = clothingImage.split(',')[1];

    const response = await fetch('/api/virtual-try-on', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personImage: personBase64,
        clothingImage: clothingBase64
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error('API returned ' + response.status + ': ' + errorText);
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (data.success && data.resultImage) {
      return {
        success: true,
        image: 'data:image/jpeg;base64,' + data.resultImage
      };
    } else {
      throw new Error(data.error || 'No image generated');
    }

  } catch (error: any) {
    console.error('Virtual Try-On Error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred'
    };
  }
}
