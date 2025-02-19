interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({
  children,
  className = "",
}: ResponsiveContainerProps) {
  return (
    <div
      className={`
      w-full 
      px-4 
      sm:px-6 
      lg:px-8 
      mx-auto 
      max-w-screen-xl 
      ${className}
    `}
    >
      {children}
    </div>
  );
}
