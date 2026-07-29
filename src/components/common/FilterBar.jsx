import React from "react";
import Input from "./Input";
import Icons from "./Icons";

const FilterBar = ({ filters, params = {}, onChange }) => {
  return (
    <div className="bg-white rounded-sm p-3 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 m-0">
        {filters.map((filter, index) => {
          if (filter.type === "search") {
            return (
              <div key={index} className="flex flex-col gap-2 lg:col-span-2">
                <Input
                  id={filter.name}
                  name={filter.name}
                  placeholder={filter.placeholder || "Search..."}
                  value={params[filter.name] || ""}
                  onChange={onChange}
                  endIcon={
                    <Icons name="Search" size={16} className="text-gray-400" />
                  }
                />
              </div>
            );
          }

          if (filter.type === "select") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <Input
                  type="select"
                  name={filter.name}
                  label={filter.label}
                  options={filter.options}
                  value={params[filter.name] || ""}
                  onChange={onChange}
                  hideDefaultOption={true}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default FilterBar;
