import { useState, useRef, useEffect } from "react";
import { Upload, X, Eye, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface FileUploadProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  hint?: string;
  error?: string;
  sampleImage?: React.ReactNode;
}

const FileUpload = ({ label, file, onFileChange, accept = "image/*,.pdf", hint, error, sampleImage }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      if (file.type.startsWith("image/")) {
        setPreview(url);
      } else {
        setPreview(null);
      }
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
      setFileUrl(null);
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onFileChange(f);
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleView = () => {
    if (fileUrl) window.open(fileUrl, "_blank");
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-card-foreground">{label}</label>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" capture="environment" />

      {sampleImage && !file && sampleImage}

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-primary/50 transition-colors bg-muted/20"
        >
          <div className="flex gap-3">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <Camera className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Upload or take a photo</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-2.5">
          {preview ? (
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm"><img src={preview} alt="Preview" className="w-full rounded-lg" /></DialogContent>
            </Dialog>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate text-card-foreground">{file.name}</p>
            <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleView}><Eye className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemove}><X className="w-3.5 h-3.5" /></Button>
        </div>
      )}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
};

export default FileUpload;
