'use client'

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export default function PageLayout({ 
  children, 
  title, 
  subtitle, 
  className = '' 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className={`w-full max-w-md ${className}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-gray-600 text-lg">
            {subtitle}
          </p>
        </div>
        
        {children}
      </div>
    </div>
  );
}