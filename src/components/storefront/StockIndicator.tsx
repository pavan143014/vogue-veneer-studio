import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface StockIndicatorProps {
  availableForSale: boolean;
  quantityAvailable?: number | null;
}

const StockIndicator = ({ availableForSale, quantityAvailable }: StockIndicatorProps) => {
  if (!availableForSale) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-destructive"
      >
        <AlertCircle className="h-4 w-4" />
        <span className="font-body text-sm font-medium">Out of Stock</span>
      </motion.div>
    );
  }

  if (quantityAvailable !== null && quantityAvailable !== undefined) {
    if (quantityAvailable <= 5) {
      return (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-amber-600"
        >
          <Clock className="h-4 w-4" />
          <span className="font-body text-sm font-medium">
            Only {quantityAvailable} left in stock!
          </span>
        </motion.div>
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-green-600"
    >
      <CheckCircle className="h-4 w-4" />
      <span className="font-body text-sm font-medium">In Stock</span>
    </motion.div>
  );
};

export default StockIndicator;
