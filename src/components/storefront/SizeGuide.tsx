import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

const SizeGuide = () => {
  const sizes = [
    { size: 'XS', chest: '32-34', waist: '24-26', hip: '34-36', length: '36' },
    { size: 'S', chest: '34-36', waist: '26-28', hip: '36-38', length: '37' },
    { size: 'M', chest: '36-38', waist: '28-30', hip: '38-40', length: '38' },
    { size: 'L', chest: '38-40', waist: '30-32', hip: '40-42', length: '39' },
    { size: 'XL', chest: '40-42', waist: '32-34', hip: '42-44', length: '40' },
    { size: 'XXL', chest: '42-44', waist: '34-36', hip: '44-46', length: '41' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary p-0 h-auto font-body text-sm">
          <Ruler className="h-4 w-4 mr-1" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Size Guide</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="font-body text-sm text-muted-foreground mb-4">
            All measurements are in inches. For the best fit, measure yourself and compare with the chart below.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-body font-semibold text-foreground">Size</th>
                  <th className="text-center py-3 px-2 font-body font-semibold text-foreground">Chest</th>
                  <th className="text-center py-3 px-2 font-body font-semibold text-foreground">Waist</th>
                  <th className="text-center py-3 px-2 font-body font-semibold text-foreground">Hip</th>
                  <th className="text-center py-3 px-2 font-body font-semibold text-foreground">Length</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((row) => (
                  <tr key={row.size} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2 font-body font-medium text-foreground">{row.size}</td>
                    <td className="py-3 px-2 font-body text-center text-muted-foreground">{row.chest}</td>
                    <td className="py-3 px-2 font-body text-center text-muted-foreground">{row.waist}</td>
                    <td className="py-3 px-2 font-body text-center text-muted-foreground">{row.hip}</td>
                    <td className="py-3 px-2 font-body text-center text-muted-foreground">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 bg-muted/50 rounded-lg p-4">
            <h4 className="font-display text-sm font-semibold text-foreground">How to Measure</h4>
            <ul className="font-body text-xs text-muted-foreground space-y-2">
              <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
              <li><strong>Length:</strong> Measure from shoulder to hem</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
