import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PartyPopper, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "@/lib/confetti";

const SuccessBanner = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    confetti();
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center smyths-gradient transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="text-center px-8 space-y-6">
        <div className="w-24 h-24 mx-auto bg-primary-foreground/20 rounded-full flex items-center justify-center animate-bounce">
          <PartyPopper className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground">🎉 Congratulations!</h1>
        <p className="text-primary-foreground/90 text-lg">
          You have been successfully onboarded to<br />
          <span className="font-bold text-smyths-yellow">Smyths Toys!</span>
        </p>
        <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm">All stages completed</span>
        </div>
        <Button
          onClick={() => navigate("/dashboard")}
          className="h-12 px-8 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground font-semibold border border-primary-foreground/30"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SuccessBanner;
