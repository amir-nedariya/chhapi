import React from "react";
import Button from "./Button";
import { Folder, SearchX, CalendarX, ChevronLeft } from "lucide-react";

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const isToday = dateStr === todayStr;

  const day = date.toLocaleDateString("en-IN", { weekday: "long" });
  const formatted = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (isToday) return { day: "Today", formatted };
  return { day, formatted };
};

const todayStr = () => new Date().toISOString().split("T")[0];

const EmptyState = ({
  search = "",
  entityName = "Items",
  entityIcon = "Folder",
  onClearSearch,
  onAdd,
  addLabel,
  date = "",
  onChangeDate
}) => {
  const isDateFiltered = !search && !!date;
  const dateInfo = isDateFiltered ? formatDateDisplay(date) : null;

  // Icon mapping
  const IconMap = {
    Folder,
    SearchX,
    CalendarX
  };
  const IconComponent = search ? SearchX : isDateFiltered ? CalendarX : (IconMap[entityIcon] || Folder);

  return (
    <div className="flex flex-col items-center justify-center h-full mt-[10%] text-center p-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <IconComponent
          className="text-teal-700"
          size={28}
        />
      </div>

      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {search
          ? "No Results Found"
          : isDateFiltered
            ? `No records on ${dateInfo?.day}`
            : `No ${entityName} Yet`}
      </h3>

      <p className="text-sm text-gray-500 max-w-md mb-4">
        {search
          ? `No ${entityName.toLowerCase()} matched "${search}". Try a different keyword.`
          : isDateFiltered
            ? `There are no records scheduled for ${dateInfo?.formatted}.`
            : `Start by adding your first ${entityName.toLowerCase()}.`}
      </p>

      {search ? (
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      ) : isDateFiltered ? (
        <div className="flex items-center gap-2">
          {date !== todayStr() && (
            <Button variant="outline" onClick={onChangeDate}>
              <span className="flex items-center gap-1.5">
                <ChevronLeft size={15} />
                Change Date
              </span>
            </Button>
          )}
          {onAdd && (
            <Button variant="solid" onClick={onAdd}>
              {addLabel || `Add ${entityName}`}
            </Button>
          )}
        </div>
      ) : (
        onAdd && (
          <Button variant="solid" onClick={onAdd}>
            {addLabel || `Add ${entityName}`}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
