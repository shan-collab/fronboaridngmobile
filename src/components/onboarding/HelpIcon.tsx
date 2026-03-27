import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HelpIconProps {
  content: string;
}

const HelpIcon = ({ content }: HelpIconProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-muted transition-colors">
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </button>
    </PopoverTrigger>
    <PopoverContent side="top" className="w-64 p-3 text-xs text-muted-foreground leading-relaxed">
      {content}
    </PopoverContent>
  </Popover>
);

export default HelpIcon;
