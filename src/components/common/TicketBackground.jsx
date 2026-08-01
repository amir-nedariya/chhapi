import React, { useRef, useEffect, useState } from 'react';

const TicketBackground = ({ status = 'default', className = '' }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  let bg = "#f8fafc";
  let borderColor = "#cbd5e1";

  if (status === 'paid') {
    bg = "#f0fdf4";
    borderColor = "#22c55e";
  } else if (status === 'missed') {
    bg = "#fef2f2";
    borderColor = "#ef4444"; // Red border for failed/missed
  } else if (status === 'pending') {
    bg = "#fffbeb";
    borderColor = "#f59e0b"; // Orange border for pending
  } else if (status === 'current') {
    bg = "#f0f9ff";
    borderColor = "#0ea5e9"; // Blue border for current
  }

  const getTicketPath = (W, H, offset) => {
    if (W <= 0 || H <= 0) return '';
    
    const O = offset;
    
    // Base radii of the cutouts exactly matching Image 2
    const baseRc = 6;  // Corner cutouts
    const baseRs = 5;  // Small side cutouts
    const baseRb = 16; // Big side cutouts
    
    const Rc = baseRc + O;
    const Rs = baseRs + O;
    const Rb = baseRb + O;
    
    // Intersection offsets along the straight lines
    const dRc = Math.sqrt(Rc * Rc - O * O) || 0;
    const dRs = Math.sqrt(Rs * Rs - O * O) || 0;
    const dRb = Math.sqrt(Rb * Rb - O * O) || 0;
  
    // Vertical centers of the side cutouts
    const cyCenter = H / 2;
    const cyTop = H * 0.25;
    const cyBottom = H * 0.75;
    
    return `
      M ${dRc} ${O}
      L ${W - dRc} ${O}
      A ${Rc} ${Rc} 0 0 0 ${W - O} ${dRc}
      
      L ${W - O} ${cyTop - dRs}
      A ${Rs} ${Rs} 0 0 0 ${W - O} ${cyTop + dRs}
      
      L ${W - O} ${cyCenter - dRb}
      A ${Rb} ${Rb} 0 0 0 ${W - O} ${cyCenter + dRb}
      
      L ${W - O} ${cyBottom - dRs}
      A ${Rs} ${Rs} 0 0 0 ${W - O} ${cyBottom + dRs}
      
      L ${W - O} ${H - dRc}
      A ${Rc} ${Rc} 0 0 0 ${W - dRc} ${H - O}
      
      L ${dRc} ${H - O}
      A ${Rc} ${Rc} 0 0 0 ${O} ${H - dRc}
      
      L ${O} ${cyBottom + dRs}
      A ${Rs} ${Rs} 0 0 0 ${O} ${cyBottom - dRs}
      
      L ${O} ${cyCenter + dRb}
      A ${Rb} ${Rb} 0 0 0 ${O} ${cyCenter - dRb}
      
      L ${O} ${cyTop + dRs}
      A ${Rs} ${Rs} 0 0 0 ${O} ${cyTop - dRs}
      
      L ${O} ${dRc}
      A ${Rc} ${Rc} 0 0 0 ${dRc} ${O}
      Z
    `;
  };

  const outerPath = getTicketPath(size.width, size.height, 1); // 1px offset to prevent border clipping

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] ${className}`}>
      {size.width > 0 && size.height > 0 && (
        <svg width={size.width} height={size.height} style={{ overflow: 'visible' }}>
          {/* Main filled ticket body + outer thick border */}
          <path 
            d={outerPath} 
            fill={bg} 
            stroke={borderColor} 
            strokeWidth="2" 
          />
        </svg>
      )}
    </div>
  );
};

export default TicketBackground;
