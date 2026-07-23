import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  text = "",
  icon: Icon,
  iconLeft: LeftIcon, // to match chhapi
  iconRight: RightIcon, // to match chhapi
  leftIcon: ZentroLeftIcon,
  rightIcon: ZentroRightIcon,
  iconPosition = "left",
  className = "",
  disabled = false,
  loading = false, // chhapi specific
  fullWidth = false, // chhapi specific
  pulse = false, // chhapi specific
  ...props
}) => {
  // Determine which icons to use (support both chhapi and Zentro ERP prop names)
  const LIcon = LeftIcon || ZentroLeftIcon || (iconPosition === "left" ? Icon : null);
  const RIcon = RightIcon || ZentroRightIcon || (iconPosition === "right" ? Icon : null);

  const baseStyle =
    "flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 outline-none rounded-sm font-medium";

  const sizes = {
    xs: "h-7 text-xs px-2.5",
    sm: "h-8 text-xs px-3",
    md: "h-9 text-sm px-4",
    lg: "h-10 text-sm px-5",
    xl: "h-12 text-base px-6",
    square: "h-10 w-10 p-0",
  };

  const variants = {
    primary: "bg-teal-700 text-white border border-teal-700 hover:bg-teal-800 hover:text-white",
    secondary:
      "border-gray-300 text-gray-600 bg-white hover:bg-gray-100 border border-gray-300",
    third:
      "border-teal-700 text-teal-700 bg-teal-50 hover:bg-teal-100 hover:text-teal-800 border border-teal-700/20",
    solid:
      "bg-teal-700 text-white border-teal-700 hover:bg-teal-800 hover:text-white",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100",
    success:
      "bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white",
    danger:
      "bg-red-200 text-red-700 border-red-200 hover:bg-red-600 hover:text-white",
    warning: 
      "bg-amber-500 text-white border-amber-500 hover:bg-amber-600",
    info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white",
    ghost:
      "border-transparent text-gray-500 hover:text-teal-700 hover:bg-teal-50",
    gradient: 
      "bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white border-none",
  };

  const iconSize =
    size === "sm" || size === "xs" || size === "square" ? 14 : size === "lg" ? 20 : 18;

  const widthClass = fullWidth ? "w-full" : "";
  const pulseClass = pulse && !loading && !disabled ? "animate-pulse" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyle,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        widthClass,
        pulseClass,
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="flex items-center gap-2 leading-none whitespace-nowrap">
            Loading...
          </span>
        </>
      ) : (
        <>
          {LIcon && (
            <span className="inline-flex shrink-0">
              {React.isValidElement(LIcon) ? LIcon : <LIcon size={iconSize} />}
            </span>
          )}
          {(children || text) && (
            <span className="flex items-center gap-2 leading-none whitespace-nowrap">
              {children || text}
            </span>
          )}
          {RIcon && (
            <span className="inline-flex shrink-0">
              {React.isValidElement(RIcon) ? RIcon : <RIcon size={iconSize} />}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
