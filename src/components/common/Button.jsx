import React from "react";

/**
 * A highly interactive, customizable, and premium Button component.
 * Supports loading states, custom icons, pulse animations, and click transformations.
 */
const Button = ({
  children,
  variant = "primary", // 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost' | 'gradient'
  size = "md", // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type = "button",
  loading = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  pulse = false,
  className = "",
  ...props
}) => {
  // Base classes for transition, focus, active press effect, and alignment
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white select-none";

  // Size variations
  const sizeClasses = {
    xs: "px-2.5 py-1 text-xs gap-1 rounded-lg",
    sm: "px-3.5 py-1.5 text-sm gap-1.5 rounded-lg",
    md: "px-5 py-2.5 text-sm gap-2 rounded-xl",
    lg: "px-6 py-3 text-base gap-2.5 rounded-xl",
    xl: "px-7 py-3.5 text-lg gap-3 rounded-2xl",
  };

  // Color & design variations utilizing project theme tokens
  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg hover:shadow-primary/15 focus:ring-primary",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 focus:ring-slate-400",
    success:
      "bg-success text-white hover:bg-emerald-600 shadow-md hover:shadow-success/15 focus:ring-success",
    danger:
      "bg-danger text-white hover:bg-red-600 shadow-md hover:shadow-danger/15 focus:ring-danger",
    warning:
      "bg-warning text-white hover:bg-amber-600 shadow-md hover:shadow-warning/15 focus:ring-warning",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary/5 focus:ring-primary",
    ghost:
      "text-primary bg-transparent hover:bg-primary/10 focus:ring-primary/50",
    gradient:
      "bg-gradient-to-r from-sidebar-from via-sidebar-via to-sidebar-to hover:from-sidebar-from/90 hover:to-sidebar-to/90 text-white shadow-md hover:shadow-lg hover:shadow-primary/20 focus:ring-primary",
  };

  // Width classes
  const widthClass = fullWidth ? "w-full" : "";

  // Pulse animation class (e.g. for key action prompt)
  const pulseClass = pulse && !loading && !disabled ? "animate-pulse" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${widthClass} ${pulseClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          {/* Elegant spinning wheel inside button */}
          <svg
            className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
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
          <span>Loading...</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
          {children}
          {iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
