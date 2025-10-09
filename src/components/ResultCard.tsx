import { Download, RotateCcw } from 'lucide-react';

interface ResultCardProps {
  image: string;
  onReset: () => void;
}

function ResultCard({ image, onReset }: ResultCardProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'virtual-tryon-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-semibold text-white">Sonuç</h3>
        <p className="text-blue-100 text-sm">Sanal deneme tamamlandı</p>
      </div>

      <div className="p-6">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 mb-6">
          <img
            src={image}
            alt="Try-on result"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            İndir
          </button>
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Yeni Deneme
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
