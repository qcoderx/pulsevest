import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Project = {
  title: string;
};

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function InvestmentModal({
  isOpen,
  onClose,
  project,
}: InvestmentModalProps) {
  const [amount, setAmount] = useState(50000);

  const equity = (amount / 2500000) * 100; // Example calculation based on a fictional valuation

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-8 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="font-satoshi text-3xl font-bold mb-2">
          Invest in <span className="text-primary">{project.title}</span>
        </h3>
        <p className="text-muted mb-8">Select your investment amount.</p>

        <div className="text-center mb-6">
          <span className="font-satoshi text-6xl font-extrabold">
            ₦{amount.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="10000"
          max="1000000"
          step="5000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
        />

        <div className="mt-8 p-4 bg-background rounded-lg text-sm space-y-2">
          <div className="flex justify-between">
            <span>Your Investment:</span>
            <span className="font-bold">₦{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Potential Equity:</span>
            <span className="font-bold">{equity.toFixed(3)}%</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Processing Fee:</span>
            <span>₦250</span>
          </div>
        </div>

        <Button size="lg" className="mt-8 w-full !text-lg">
          Confirm Investment
        </Button>
      </div>
    </div>
  );
}
