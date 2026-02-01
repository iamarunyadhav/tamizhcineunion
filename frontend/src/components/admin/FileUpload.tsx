import { useState, useCallback } from 'react';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { apiClient } from '@/api/client';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  folder = 'uploads',
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
   const [useUrl, setUseUrl] = useState(false);
   const [urlInput, setUrlInput] = useState('');

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data } = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onChange(data.url);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    onChange('');
  };

  const handleUrlSubmit = async () => {
    if (!urlInput) return;
    try {
      setIsUploading(true);
      const { data } = await apiClient.post('/upload', { url: urlInput, folder });
      onChange(data.url);
      toast.success('URL saved');
      setUrlInput('');
    } catch (error) {
      console.error('URL save error:', error);
      toast.error('Failed to save URL');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              className={cn(
                "px-3 py-1 rounded-md border transition-colors",
                !useUrl ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground"
              )}
              onClick={() => setUseUrl(false)}
            >
              Upload File
            </button>
            <button
              type="button"
              className={cn(
                "px-3 py-1 rounded-md border transition-colors",
                useUrl ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground"
              )}
              onClick={() => setUseUrl(true)}
            >
              Use URL
            </button>
          </div>

          {!useUrl ? (
            <label
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                isUploading && "pointer-events-none"
              )}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-center px-4">
                    Drag & drop or click to upload
                  </span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleChange}
                disabled={isUploading}
              />
            </label>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <LinkIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/media.mp4"
                  className="pl-9 pr-3 py-2 w-full rounded-lg border bg-secondary"
                  disabled={isUploading}
                />
              </div>
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                disabled={isUploading || !urlInput}
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
