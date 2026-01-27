import { ArrowRight } from "lucide-react";

interface CollectionCardProps {
  title: string;
  subtitle: string;
  itemCount: number;
  gradient: string;
  icon: string;
}

const CollectionCard = ({ title, subtitle, itemCount, gradient, icon }: CollectionCardProps) => {
  return (
    <a
      href={`#${title.toLowerCase()}`}
      className={`group relative overflow-hidden rounded-2xl ${gradient} p-6 md:p-8 min-h-[280px] flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}
    >
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <div className="w-full h-full border-[3px] border-current rounded-full transform translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>
      
      {/* Content */}
      <div>
        <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2 group-hover:translate-x-1 transition-transform">
          {title}
        </h3>
        <p className="font-body text-sm opacity-80 mb-4">{subtitle}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-body text-xs tracking-wide opacity-70">
            {itemCount} Items
          </span>
          <span className="flex items-center gap-2 font-body text-sm font-medium group-hover:gap-3 transition-all">
            Explore
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </a>
  );
};

export default CollectionCard;
