
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  center = false,
  className = ""
}: SectionTitleProps) => {
  return (
    <div className={`space-y-2 ${center ? 'text-center' : ''} ${className}`}>
      <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-3xl tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
