import React from "react";

interface HojiBoboLogoProps {
  className?: string;
  size?: number;
}

export function HojiBoboLogo({ className = "", size = 48 }: HojiBoboLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Top curved path for BURGER */}
        <path
          id="hb-top-arc"
          d="M 50,150 A 100,100 0 0,1 250,150"
          fill="none"
        />
        {/* Bottom curved path for JOSPER GRILL, FRESH INGREDIENTS */}
        <path
          id="hb-bottom-arc"
          d="M 45,150 A 105,105 0 0,0 255,150"
          fill="none"
        />
      </defs>

      {/* Outer circular badge body */}
      <rect
        x="6"
        y="120"
        width="288"
        height="60"
        rx="14"
        fill="#1C1917"
      />
      <circle cx="150" cy="150" r="144" fill="#1C1917" />

      {/* Outer Double Rings */}
      <circle
        cx="150"
        cy="150"
        r="138"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeDasharray="900"
      />
      <circle
        cx="150"
        cy="150"
        r="132"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Side Stamp Ears / Tabs Borders */}
      <path
        d="M 12,122 L 32,122 M 12,178 L 32,178"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 268,122 L 288,122 M 268,178 L 288,178"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Top Arc Text: BURGER */}
      <text
        fill="#FFFFFF"
        fontSize="29"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        letterSpacing="8"
      >
        <textPath href="#hb-top-arc" startOffset="50%" textAnchor="middle">
          BURGER
        </textPath>
      </text>

      {/* Red Josper Grill & Fire Burger Icon in the center top */}
      <g transform="translate(150, 95)">
        {/* Red Bun Dome */}
        <path
          d="M -28,-2 C -28,-22 28,-22 28,-2 Z"
          fill="#DC2626"
        />
        {/* Fire Flames under the bun */}
        <path
          d="M -28,2 
             C -24,12 -22,6 -18,12 
             C -14,5 -10,13 -6,7 
             C -2,14 2,14 6,7 
             C 10,13 14,5 18,12 
             C 22,6 24,12 28,2 
             L 28,6 L -28,6 Z"
          fill="#DC2626"
        />
        {/* Grill bar silhouette line */}
        <line
          x1="-28"
          y1="8"
          x2="28"
          y2="8"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Center Main Bold Text: HOJI BOBO */}
      <text
        x="150"
        y="166"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="44"
        fontWeight="900"
        fontFamily="'Impact', 'Arial Black', sans-serif"
        letterSpacing="4"
      >
        HOJI BOBO
      </text>

      {/* Subtitle Under Brand: EST. 2017 | KOREA */}
      <text
        x="150"
        y="186"
        textAnchor="middle"
        fill="#D1D5DB"
        fontSize="11"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2"
      >
        EST. 2017 | KOREA
      </text>

      {/* Bottom Arc Text: JOSPER GRILL, FRESH INGREDIENTS */}
      <text
        fill="#E5E7EB"
        fontSize="11.5"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2.8"
      >
        <textPath href="#hb-bottom-arc" startOffset="50%" textAnchor="middle">
          JOSPER GRILL, FRESH INGREDIENTS
        </textPath>
      </text>
    </svg>
  );
}

