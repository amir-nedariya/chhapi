import React from "react";


const StatsCards = ({ cards }) => {
  const gridColsClass = 
    cards.length === 1 ? "lg:grid-cols-1" :
    cards.length === 2 ? "lg:grid-cols-2" :
    cards.length === 3 ? "lg:grid-cols-3" :
    cards.length === 4 ? "lg:grid-cols-4" :
    "lg:grid-cols-5";

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-4`}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 p-3 lg:p-4 rounded-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-[12px] lg:text-[14px] text-gray-800 mb-1 lg:mb-[8px] break-words">
                {card.title}
              </p>
              <p className={`text-[17px] lg:text-[22px] font-semibold ${card.valueColor || "text-gray-900"} leading-none`}>
                {card.value}
              </p>
              {(card.date || card.change) && (
                <p
                  className={`text-[11px] lg:text-[13px] mt-1 lg:mt-2 flex items-center gap-1.5 ${
                    card.changeColor || "text-gray-500"
                  }`}
                >
                  {card.date || card.change}
                </p>
              )}
            </div>
            {card.image && (
              <div className="w-7 h-7 lg:w-9 lg:h-9 flex-shrink-0 ml-2">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {card.icon && !card.image && (
               <div className="flex-shrink-0 ml-2">
                 {card.icon}
               </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
