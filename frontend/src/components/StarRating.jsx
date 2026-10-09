import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showText = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const currentDisplay = hoverValue || value || 0;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentDisplay;
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readonly && setHoverValue(star)}
              onMouseLeave={() => !readonly && setHoverValue(0)}
              className={`p-0.5 transition-transform ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
              }`}
              title={readonly ? `${value} stars` : `Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-sm font-semibold text-slate-700 ml-1">
          {value ? Number(value).toFixed(1) : 'No ratings'}
        </span>
      )}
    </div>
  );
};
