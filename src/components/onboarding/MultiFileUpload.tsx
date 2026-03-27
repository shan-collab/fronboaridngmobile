import { useState, useRef, useEffect } from "react";
import { Upload, X, Eye, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";

interface MultiFileUploadProps {
  label: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  hint?: string;
  error?: string;
  sampleImage?: React.ReactNode;
}

const MultiFileUpload = ({ label, files, onFilesChange, accept = "image/*,.pdf", hint, error, sampleImage }: MultiFileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const { t } = useLanguage();

  useEffect(() => {
    const urls: Record<number, string> = {};
    files.forEach((file, i) => {
      if (file.type.startsWith("image/")) {
        urls[i] = URL.createObjectURL(file);
      }
    });
    setPreviews(urls);
    return () => Object.values(urls).forEach(URL.revokeObjectURL);
  }, [files]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length > 0) onFilesChange([...files, ...newFiles]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => onFilesChange(files.filter((_, i) => i !== index));

  const handleView = (file: File, index: number) => {
    const url = previews[index] || URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-card-foreground">{label}</label>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <input ref={inputRef} type="file" accept={accept} onChange={handleAdd} className="hidden" multiple capture="environment" />

      {sampleImage && files.length === 0 && sampleImage}

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-xl p-2.5">
              {previews[i] ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
                      <img src={previews[i]} alt="" className="w-full h-full object-cover" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm"><img src={previews[i]} alt="Preview" className="w-full rounded-lg" /></DialogContent>
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
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleView(file, i)}><Eye className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemove(i)}><X className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-1.5 hover:border-primary/50 transition-colors bg-muted/20"
      >
        <div className="flex gap-3">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <Camera className="w-5 h-5 text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">
          {files.length > 0 ? t("add_more_files") : t("upload_or_photo")}
        </span>
      </button>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
};

export default MultiFileUpload;
