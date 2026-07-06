
export const HandDrawnHeart = ({ size = 24, strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
    <path 
      d="M51 86 C 51 86, 17 58, 20 34 C 23 15, 46 16, 53 36 C 63 13, 89 21, 83 41 C 78 61, 51 86, 51 86 Z" 
      stroke="currentColor" 
      strokeWidth={strokeWidth * 4} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const HandDrawnStar = ({ size = 24, strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
    <path 
      d="M50 12 C 55 38, 62 45, 88 48 C 62 52, 55 58, 50 88 C 45 58, 38 52, 12 48 C 38 45, 45 38, 50 12 Z" 
      stroke="currentColor" 
      strokeWidth={strokeWidth * 4} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const HandDrawnFrame = ({ strokeWidth = 2, className = '' }) => (
  <svg 
    className={className}
    width="100%" 
    height="100%" 
    viewBox="0 0 100 100" 
    preserveAspectRatio="none" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
  >
    {/* Top line */}
    <path d="M -2 1 L 102 1.5" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    <path d="M -1 2.5 L 101 2" stroke="currentColor" strokeWidth={strokeWidth * 0.7} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.6" />
    
    {/* Right line */}
    <path d="M 99 -2 L 98.5 102" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    <path d="M 97.5 -1 L 98 101" stroke="currentColor" strokeWidth={strokeWidth * 0.7} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.6" />
    
    {/* Bottom line */}
    <path d="M 102 99 L -2 98.5" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    <path d="M 101 97.5 L -1 98" stroke="currentColor" strokeWidth={strokeWidth * 0.7} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.6" />
    
    {/* Left line */}
    <path d="M 1 102 L 1.5 -2" stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    <path d="M 2.5 101 L 2 -1" stroke="currentColor" strokeWidth={strokeWidth * 0.7} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity="0.6" />
  </svg>
);
