import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaskedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  visibleChars?: number;
}

const MaskedInput = ({ value, onChange, placeholder, className = "", visibleChars = 4 }: MaskedInputProps) => {
  const [isEditing, setIsEditing] = useState(!value);
  const [isVisible, setIsVisible] = useState(false);

  const maskedValue = value.length > visibleChars
    ? "•".repeat(value.length - visibleChars) + value.slice(-visibleChars)
    : value;

  if (isEditing || !value) {
    return (
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-10 ${className}`}
        autoFocus={!!value}
        onBlur={() => value && setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex-1 h-10 px-3 flex items-center rounded-md border border-input bg-muted/50 text-sm font-mono tracking-wider ${className}`}>
        {isVisible ? value : maskedValue}
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setIsEditing(true)}>
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MaskedInput;
