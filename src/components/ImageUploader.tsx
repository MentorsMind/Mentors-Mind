import { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
  onCancel: () => void;
}

export function ImageUploader({ onUpload, onCancel }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string>('');
  
  // Crop state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [compressedBase64, setCompressedBase64] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError('');
    setFile(file);
    setOriginalSize(file.size);
    setPosition({ x: 0, y: 0 });
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    generatePreview();
  };

  const generatePreview = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const canvas = document.createElement('canvas');
    const MAX_SIZE = 400;
    canvas.width = MAX_SIZE;
    canvas.height = MAX_SIZE;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background white (for transparent images like PNG)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, MAX_SIZE, MAX_SIZE);

    const img = imageRef.current;
    const container = containerRef.current;
    
    const containerSize = container.offsetWidth;
    const scale = MAX_SIZE / containerSize;
    
    // The image's natural dimensions vs displayed dimensions
    const displayWidth = img.offsetWidth;
    const displayHeight = img.offsetHeight;
    
    const imgRatio = img.naturalWidth / displayWidth;
    
    // Determine bounds and draw
    const drawX = position.x * scale;
    const drawY = position.y * scale;
    const drawW = displayWidth * scale;
    const drawH = displayHeight * scale;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Compress to <= 50KB
    let quality = 0.9;
    let base64 = canvas.toDataURL('image/jpeg', quality);
    let size = Math.round((base64.length * 3) / 4);

    while (size > 50 * 1024 && quality > 0.1) {
      quality -= 0.1;
      base64 = canvas.toDataURL('image/jpeg', quality);
      size = Math.round((base64.length * 3) / 4);
    }

    setCompressedBase64(base64);
    setCompressedSize(size);
  };

  useEffect(() => {
    if (imageSrc) {
        // slight delay to allow image to render before first crop
        setTimeout(generatePreview, 100);
    }
  }, [imageSrc]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {!imageSrc ? (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer relative"
        >
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drag & drop an image here</p>
          <p className="text-xs text-gray-400 mt-1">or click to browse</p>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            
            {/* Crop Area */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drag to Pan</p>
              <div 
                ref={containerRef}
                className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 dark:border-gray-700 shadow-inner cursor-move touch-none"
                style={{ clipPath: 'circle(50% at 50% 50%)' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                <img 
                  ref={imageRef}
                  src={imageSrc} 
                  alt="Upload preview" 
                  className="absolute max-w-none pointer-events-none"
                  style={{ 
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    minWidth: '100%',
                    minHeight: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>

            {/* Live Preview Area */}
            {compressedBase64 && (
              <div className="flex flex-col items-center gap-2">
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Live Preview</p>
                 <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary shadow-lg">
                    <img src={compressedBase64} alt="Compressed preview" className="w-full h-full object-cover" />
                 </div>
                 <div className="text-xs text-center mt-2 px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full font-medium">
                   {formatSize(originalSize)} &rarr; {formatSize(compressedSize)}
                 </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => {
                setFile(null);
                setImageSrc('');
                setCompressedBase64('');
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => onUpload(compressedBase64)}
              disabled={!compressedBase64}
              className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
