const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: {
      bg: "#0a96f4",
      text: "white",
      hover: "hover:opacity-90 hover:shadow-lg",
      focus: "focus:ring-blue-200",
    },
    secondary: {
      bg: "transparent",
      text: "#4b5563",
      hover: "hover:bg-gray-50 hover:text-gray-900",
      focus: "focus:ring-gray-200",
    },
    outline: {
      bg: "white",
      text: "#374151",
      hover: "hover:bg-gray-50 hover:border-gray-300",
      focus: "focus:ring-gray-200",
    },
    ghost: {
      bg: "transparent",
      text: "#6b7280",
      hover: "hover:bg-gray-100 hover:text-gray-900",
      focus: "focus:ring-gray-200",
    },
  };

  const sizes = {
    sm: "px-3 py-1.5 rounded-lg text-xs gap-1.5",
    md: "px-4 py-2.5 rounded-xl text-sm gap-2",
    lg: "px-6 py-3 rounded-xl text-base gap-2.5",
  };

  const v = variants[variant];
  const s = sizes[size];

  const style = {
    backgroundColor: v.bg,
    color: v.text,
    ...(variant === "outline" && { border: "1px solid #e5e7eb" }),
  };

  return (
    <button
      className={`${baseStyles} ${v.hover} ${v.focus} ${s} ${className}`}
      style={style}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
