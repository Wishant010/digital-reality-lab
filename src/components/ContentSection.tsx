import React from "react";

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({ title, children, className = "" }) => (
  <section className={`my-8 p-6 bg-slate-800 rounded-2xl shadow-lg ${className}`}>
    <h2 className="text-2xl font-bold mb-4 text-emerald-300">{title}</h2>
    <div>{children}</div>
  </section>
);

export default ContentSection;
