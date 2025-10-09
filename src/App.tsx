import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import ImageUploadCard from './components/ImageUploadCard';
import { performVirtualTryOn } from '../lib/virtualTryOn';

function App() {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = async (person?: string, clothing?: string) => {
    const personImg = person || personImage;
    const clothingImg = clothing || clothingImage;

    if (!personImg || !clothingImg) return '';

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Calling Hugging Face API...');
      const result = await performVirtualTryOn(personImg, clothingImg);

      if (result.success && result.image) {
        if (!person && !clothing) {
          setResultImage(result.image);
        }
        setIsProcessing(false);
        return result.image;
      } else {
        setError(result.error || 'Virtual try-on failed');
        setIsProcessing(false);
        return '';
      }
    } catch (err) {
      console.error('Error in handleTryOn:', err);
      setError('An unexpected error occurred');
      setIsProcessing(false);
      return '';
    }
  };

  const canTryOn = personImage && clothingImage && !isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Virtual Try-On</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kıyafetleri sanal olarak deneyin. Fotoğraflarınızı yükleyin ve sonucu anında görün.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ImageUploadCard
              title="Kişi Görseli"
              description="Kıyafeti deneyecek kişinin fotoğrafını yükleyin"
              icon={Sparkles}
              onImageSelect={setPersonImage}
              selectedImage={personImage}
            />
            <ImageUploadCard
              title="Kıyafet Görseli"
              description="Denemek istediğiniz kıyafetin fotoğrafını yükleyin"
              icon={Sparkles}
              onImageSelect={setClothingImage}
              selectedImage={clothingImage}
            />
          </div>

          {/* Try On Button */}
          <div className="flex justify-center">
            <button
              onClick={() => handleTryOn()}
              disabled={!canTryOn}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg
                transition-all duration-200 transform
                ${
                  canTryOn
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  AI Bağlanıyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI ile Dene
                </span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto mt-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-red-800 font-semibold">AI Hatası</h3>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setError(null)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      setError(null);
                      handleTryOn();
                    }}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section with Split Screen */}
        {resultImage && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-xl font-semibold text-white">Sonuç - Önce/Sonra Karşılaştırması</h3>
                <p className="text-blue-100 text-sm">Sürgüyü hareket ettirerek karşılaştırın</p>
              </div>

              <div className="p-6">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-6">
                  {/* Before Image */}
                  <img
                    src={personImage!}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* After Image with Slider */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={resultImage}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Slider Control */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-10 opacity-0 cursor-ew-resize"
                  />
                  
                  {/* Slider Line and Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resultImage;
                      link.download = 'virtual-tryon-result.png';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    İndir
                  </button>
                  <button
                    onClick={() => {
                      setResultImage(null);
                      setPersonImage(null);
                      setClothingImage(null);
                      setSliderPosition(50);
                      setError(null);
                    }}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Yeni Deneme
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
