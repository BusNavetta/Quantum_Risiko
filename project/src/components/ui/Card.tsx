// Create reusable card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 ${className}`}>
      {children}
    </div>
  );
};