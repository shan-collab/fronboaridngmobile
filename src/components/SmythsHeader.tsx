import smythsLogo from "@/assets/smyths-logo.png";

interface SmythsHeaderProps {
  subtitle?: string;
}

const SmythsHeader = ({ subtitle }: SmythsHeaderProps) => (
  <div className="flex flex-col items-center pt-12 pb-6">
    <img src={smythsLogo} alt="Smyths 360" className="w-36 h-36 object-contain mb-4 drop-shadow-lg" />
    {subtitle && (
      <p className="text-primary-foreground/90 text-lg font-medium tracking-wide">{subtitle}</p>
    )}
  </div>
);

export default SmythsHeader;
