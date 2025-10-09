import { useRef, LucideIcon } from 'react';
import { X } from 'lucide-react';

interface ImageUploadCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onImageSelect: (image: string | null) => void;
  selectedImage: string | null;
}

function ImageUploadCard({
  title,
  description,
  icon: Icon,
  onImageSelect,
  selectedImage,
}: ImageUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>

        <div
          onClick={() => !selectedImage && fileInputRef.current?.click()}
          className={`
            relative aspect-[3/4] rounded-xl border-2 border-dashed
            transition-all duration-200
            ${selectedImage
              ? 'border-blue-300 bg-slate-50'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
            }
          `}
        >
          {selectedImage ? (
            <>
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <Icon className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium">Görsel yüklemek için tıklayın</p>
              <p className="text-xs mt-1">PNG, JPG veya WEBP</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default ImageUploadCard;
