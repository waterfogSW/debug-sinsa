import React from 'react';

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`bg-dark-light/80 p-6 rounded-xl border-2 border-primary/30 backdrop-blur-md flex flex-col ${className || ''}`}
    >
      {title && (
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">{title}</h2>
      )}
      {children}
    </div>
  );
};

export default SectionCard; 