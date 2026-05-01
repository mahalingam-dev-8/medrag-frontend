import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload } from 'lucide-react';

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  uploading: boolean;
}

export function DropZone({ onDrop, uploading }: DropZoneProps) {
  const handleDrop = useCallback((files: File[]) => onDrop(files), [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: uploading,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all ${
        isDragActive
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
      } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {uploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        ) : (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Upload className="h-6 w-6" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-700">
            {uploading ? 'Uploading…' : isDragActive ? 'Release to upload' : 'Drop PDFs here, or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-400">PDF files only · Multiple supported</p>
        </div>
      </div>
    </div>
  );
}
