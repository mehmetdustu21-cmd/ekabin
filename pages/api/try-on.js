export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  console.log('🔥 API Route Called');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { personImage, garmentImage } = req.body;

    if (!personImage || !garmentImage) {
      return res.status(400).json({ 
        success: false,
        error: 'Both images required' 
      });
    }

    console.log('📡 Calling Hugging Face...');

    const hfResponse = await fetch(
      'https://kwai-kolors-kolors-virtual-try-on.hf.space/api/predict',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [personImage, garmentImage]
        }),
      }
    );

    console.log('📡 HF Status:', hfResponse.status);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('❌ HF Error:', errorText);
      return res.status(500).json({ 
        success: false,
        error: 'HF API error',
        details: errorText.substring(0, 200)
      });
    }

    const result = await hfResponse.json();
    console.log('✅ Success');

    if (!result?.data?.[0]) {
      return res.status(500).json({ 
        success: false,
        error: 'Invalid response' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      image: result.data[0]
    });

  } catch (error) {
    console.error('💥 Error:', error.message);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}