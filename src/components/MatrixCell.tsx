
import { cn } from '@/lib/utils';

interface MatrixCellProps {
  value: string;
  onClick: () => void;
  className?: string;
}

const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function MatrixCell({ value, onClick, className }: MatrixCellProps) {
  const displayValue = truncateText(value);
  const hasLongText = value.length > 50;

  return (
    <div
      onClick={onClick}
      className={cn(
        "min-h-[40px] p-2 border border-earth-200 cursor-pointer transition-all duration-200",
        "hover:bg-blue-50 hover:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-500",
        "flex items-center justify-center text-center bg-white",
        hasLongText && "text-earth-700",
        className
      )}
      tabIndex={0}
      role="button"
      aria-label={`Cell value: ${value || 'Empty'}`}
    >
      <span className="text-sm leading-tight">
        {displayValue || (
          <span className="text-earth-400 italic">Cliquer pour éditer</span>
        )}
      </span>
    </div>
  );
}
