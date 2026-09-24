import React from 'react';

interface ProduceArtProps {
  type: 'cabbage' | 'kale' | 'broccoli' | 'celery' | 'carrot' | 'tomato' | 'pepper' | 'mushroom';
  className?: string;
}

export const ProduceArt: React.FC<ProduceArtProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'cabbage':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#eaf0eb] flex items-center justify-center ${className}`}>
          {/* Savoy Cabbage photo-realistic illustration */}
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="cabbageBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#435248" />
                <stop offset="60%" stopColor="#697a6d" />
                <stop offset="100%" stopColor="#96a397" />
              </linearGradient>
              <radialGradient id="cabbageLeafOuter" cx="45%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#559948" />
                <stop offset="70%" stopColor="#2e6328" />
                <stop offset="100%" stopColor="#1b4117" />
              </radialGradient>
              <radialGradient id="cabbageCut" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#f3f8e5" />
                <stop offset="75%" stopColor="#c5e396" />
                <stop offset="100%" stopColor="#76a84f" />
              </radialGradient>
              <linearGradient id="woodSurface" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8d6e53" />
                <stop offset="100%" stopColor="#5c4431" />
              </linearGradient>
            </defs>
            {/* Dark rustic textured backdrop */}
            <rect width="240" height="180" fill="url(#cabbageBg)" />
            {/* Wooden board in foreground */}
            <path d="M -10,130 Q 80,115 170,125 L 250,140 L 250,190 L -10,190 Z" fill="url(#woodSurface)" opacity="0.85" />
            <path d="M 0,135 Q 120,120 240,135" stroke="#463121" strokeWidth="1.5" opacity="0.6" fill="none" />

            {/* Background cabbage head */}
            <g transform="translate(45, 90)">
              <circle cx="0" cy="0" r="38" fill="url(#cabbageLeafOuter)" />
              {/* Crinkled savoy leaf ribs */}
              <path d="M -25,-20 Q -5,-35 25,-15 Q 35,15 20,30 Q -15,35 -30,10 Z" fill="#3d7d34" opacity="0.7" />
              <path d="M -10,-10 Q 5,-20 15,-5" stroke="#7ac46b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M -15,5 Q 0,0 20,10" stroke="#7ac46b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Halved Cabbage foreground with sliced leaf interior */}
            <g transform="translate(145, 110)">
              {/* Outer ruffled leaves */}
              <ellipse cx="0" cy="5" rx="46" ry="38" fill="#2d6627" />
              <path d="M -42,-10 C -45,15 -30,42 5,42 C 40,42 50,15 44,-10 C 38,-30 -10,-32 -42,-10 Z" fill="url(#cabbageCut)" />
              
              {/* Core & concentric leaf folds */}
              <path d="M -4,28 Q 0,10 5,28" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M -4,28 Q 0,10 5,28" stroke="#e0eec4" strokeWidth="4" strokeLinecap="round" fill="none" />
              
              {/* Curved sliced veins */}
              <path d="M -22,12 C -18,-8 15,-10 25,10" stroke="#eef7da" strokeWidth="2.5" fill="none" />
              <path d="M -32,-2 C -24,-20 22,-20 34,2" stroke="#d5ecae" strokeWidth="2" fill="none" />
              <path d="M -15,22 C -10,2 10,2 18,20" stroke="#ffffff" strokeWidth="2" fill="none" />
              <path d="M -38,-15 C -25,-32 25,-30 40,-12" stroke="#87be58" strokeWidth="2" fill="none" />

              {/* Ruffled leaf bits falling on table */}
              <ellipse cx="-45" cy="30" rx="8" ry="4" fill="#6ba74b" transform="rotate(-15 -45 30)" />
              <ellipse cx="48" cy="24" rx="7" ry="3.5" fill="#4d8b33" transform="rotate(25 48 24)" />
            </g>
          </svg>
        </div>
      );

    case 'kale':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#24422c] flex items-center justify-center ${className}`}>
          {/* Fresh lush Kale vegetables illustration */}
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="kaleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#459d47" />
                <stop offset="50%" stopColor="#2c7932" />
                <stop offset="100%" stopColor="#144b1c" />
              </linearGradient>
              <linearGradient id="kaleLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6fd673" />
                <stop offset="100%" stopColor="#308a38" />
              </linearGradient>
            </defs>
            {/* Background rich organic dark green */}
            <rect width="240" height="180" fill="#183b1e" />

            {/* Dense bunches of curly kale leaves */}
            {/* Layer 1 - back */}
            <g fill="#1d5023" opacity="0.8">
              <path d="M 20,40 Q 40,10 70,30 Q 90,15 120,35 Q 160,10 190,40 Q 220,30 230,70 L 230,180 L 10,180 Z" />
            </g>

            {/* Layer 2 - middle frilly bunches */}
            <g fill="url(#kaleGradient1)">
              <circle cx="50" cy="90" r="35" />
              <circle cx="95" cy="80" r="42" />
              <circle cx="150" cy="85" r="40" />
              <circle cx="195" cy="95" r="32" />
              <circle cx="120" cy="120" r="45" />
              <circle cx="65" cy="130" r="38" />
              <circle cx="175" cy="130" r="36" />
            </g>

            {/* Frilly leaf edges and vein ridges */}
            <g fill="none" stroke="#68ce6e" strokeWidth="2" strokeLinecap="round" opacity="0.85">
              {/* Curly kale crests */}
              <path d="M 35,70 C 45,55 55,65 65,55 C 75,65 85,50 100,60 C 115,50 130,65 145,55 C 160,65 175,55 185,70" />
              <path d="M 45,100 C 60,85 75,95 90,85 C 105,95 125,80 140,95 C 160,85 175,100 190,90" />
              <path d="M 30,120 C 50,110 65,125 85,115 C 105,125 120,110 140,125 C 160,115 180,128 200,118" />
            </g>

            {/* Pale leaf stems / central ribs */}
            <g fill="none" stroke="#bdf1bf" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
              <path d="M 120,170 Q 115,130 110,90" />
              <path d="M 115,130 Q 80,115 60,95" />
              <path d="M 118,140 Q 155,120 170,105" />
              <path d="M 70,170 Q 65,140 50,125" />
              <path d="M 165,170 Q 170,140 185,115" />
            </g>

            {/* Crisp curly leaf highlights */}
            <g fill="url(#kaleLight)" opacity="0.6">
              <ellipse cx="110" cy="75" rx="14" ry="7" transform="rotate(-20 110 75)" />
              <ellipse cx="145" cy="85" rx="16" ry="8" transform="rotate(30 145 85)" />
              <ellipse cx="75" cy="95" rx="12" ry="6" transform="rotate(15 75 95)" />
              <ellipse cx="125" cy="115" rx="15" ry="7" transform="rotate(-10 125 115)" />
            </g>
          </svg>
        </div>
      );

    case 'broccoli':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#e0d6c3] flex items-center justify-center ${className}`}>
          {/* Fresh vibrant green Broccoli head */}
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="brocBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d8c5aa" />
                <stop offset="100%" stopColor="#b49d82" />
              </linearGradient>
              <radialGradient id="brocCrown" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#4bb343" />
                <stop offset="50%" stopColor="#2c7827" />
                <stop offset="100%" stopColor="#174714" />
              </radialGradient>
              <linearGradient id="brocStalk" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78b86d" />
                <stop offset="40%" stopColor="#a3da97" />
                <stop offset="100%" stopColor="#55914a" />
              </linearGradient>
            </defs>
            <rect width="240" height="180" fill="url(#brocBg)" />

            {/* Soft shadow */}
            <ellipse cx="120" cy="160" rx="60" ry="12" fill="#695744" opacity="0.4" />

            {/* Stalk */}
            <g transform="translate(120, 130)">
              <path d="M -18,-20 L -22,25 C -22,32 22,32 22,25 L 18,-20 Z" fill="url(#brocStalk)" />
              <path d="M -12,-5 L -26,10" stroke="#78b86d" strokeWidth="4" strokeLinecap="round" />
              <circle cx="-28" cy="11" r="6" fill="#36832e" />
            </g>

            {/* Broccoli head florets */}
            <g transform="translate(120, 85)">
              {/* Back floret clusters */}
              <circle cx="-38" cy="-15" r="26" fill="#1b4d17" />
              <circle cx="38" cy="-15" r="26" fill="#1b4d17" />
              <circle cx="0" cy="-35" r="28" fill="#1f581b" />
              
              {/* Main crown cluster */}
              <circle cx="-28" cy="5" r="28" fill="url(#brocCrown)" />
              <circle cx="28" cy="5" r="28" fill="url(#brocCrown)" />
              <circle cx="0" cy="-10" r="32" fill="url(#brocCrown)" />
              <circle cx="-16" cy="-22" r="22" fill="url(#brocCrown)" />
              <circle cx="16" cy="-22" r="22" fill="url(#brocCrown)" />

              {/* Texture stippling / floret beads */}
              <g fill="#7ad972" opacity="0.65">
                <circle cx="-10" cy="-15" r="3" />
                <circle cx="-3" cy="-20" r="2.5" />
                <circle cx="8" cy="-14" r="3.2" />
                <circle cx="-22" cy="0" r="2.8" />
                <circle cx="20" cy="2" r="3" />
                <circle cx="0" cy="-5" r="3.5" />
                <circle cx="-15" cy="12" r="3" />
                <circle cx="12" cy="15" r="3" />
                <circle cx="-35" cy="-8" r="2.5" />
                <circle cx="32" cy="-6" r="2.5" />
              </g>

              {/* Natural highlights on crown */}
              <ellipse cx="-8" cy="-25" rx="8" ry="4" fill="#a5f39e" opacity="0.4" />
              <ellipse cx="14" cy="-22" rx="7" ry="3.5" fill="#a5f39e" opacity="0.35" />
            </g>
          </svg>
        </div>
      );

    case 'celery':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#dbe8d8] flex items-center justify-center ${className}`}>
          {/* Fresh Celery stalks bunch */}
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="celeryStalk1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ca347" />
                <stop offset="35%" stopColor="#8be284" />
                <stop offset="70%" stopColor="#57aa52" />
                <stop offset="100%" stopColor="#3b7e36" />
              </linearGradient>
              <linearGradient id="celeryStalk2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3d8f37" />
                <stop offset="40%" stopColor="#b4f4af" />
                <stop offset="80%" stopColor="#67bf61" />
                <stop offset="100%" stopColor="#2c6928" />
              </linearGradient>
              <linearGradient id="celeryBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0f5ec" />
                <stop offset="100%" stopColor="#cddbc7" />
              </linearGradient>
            </defs>
            <rect width="240" height="180" fill="url(#celeryBg)" />

            {/* Shadow under bunch */}
            <ellipse cx="120" cy="148" rx="80" ry="14" fill="#889c83" opacity="0.35" />

            {/* Celery leafy tops on the left */}
            <g transform="translate(45, 60)" fill="#3d8f38">
              <ellipse cx="-10" cy="-10" rx="16" ry="8" transform="rotate(-30 -10 -10)" />
              <ellipse cx="5" cy="-20" rx="18" ry="9" transform="rotate(10 5 -20)" />
              <ellipse cx="-15" cy="10" rx="14" ry="7" transform="rotate(-45 -15 10)" />
              <ellipse cx="12" cy="-5" rx="16" ry="8" transform="rotate(25 12 -5)" />
              <path d="M -15,10 Q 15,-10 35,5" stroke="#5fb459" strokeWidth="2" fill="none" />
            </g>

            {/* Crisp celery stalks diagonally laid out */}
            <g transform="translate(20, 20)">
              {/* Stalk 1 */}
              <path d="M 40,65 L 180,120 L 175,138 L 35,83 Z" fill="url(#celeryStalk1)" rx="4" />
              <path d="M 42,73 L 178,128" stroke="#a4f49e" strokeWidth="2.5" fill="none" />
              <path d="M 38,78 L 176,133" stroke="#2a6626" strokeWidth="1.5" fill="none" />

              {/* Stalk 2 */}
              <path d="M 50,45 L 195,105 L 190,124 L 45,64 Z" fill="url(#celeryStalk2)" rx="4" />
              <path d="M 52,53 L 193,113" stroke="#d5fed1" strokeWidth="2.5" fill="none" />
              <path d="M 48,59 L 190,119" stroke="#367e32" strokeWidth="1.5" fill="none" />

              {/* Stalk 3 */}
              <path d="M 60,30 L 210,90 L 205,108 L 55,48 Z" fill="url(#celeryStalk1)" rx="4" />
              <path d="M 62,38 L 208,98" stroke="#96ea90" strokeWidth="2.5" fill="none" />

              {/* Stalk 4 (bottom) */}
              <path d="M 45,85 L 170,135 L 165,150 L 40,100 Z" fill="url(#celeryStalk2)" rx="4" />
              <path d="M 46,92 L 168,142" stroke="#bdf8b8" strokeWidth="2" fill="none" />

              {/* Sliced base ends on right */}
              <ellipse cx="180" cy="130" rx="5" ry="10" fill="#e8fae4" stroke="#4ca347" strokeWidth="1.5" />
              <ellipse cx="195" cy="115" rx="5" ry="10" fill="#f2fcf0" stroke="#4ca347" strokeWidth="1.5" />
              <ellipse cx="210" cy="100" rx="5" ry="10" fill="#e8fae4" stroke="#4ca347" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      );

    case 'carrot':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#fff0e6] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover">
            <rect width="240" height="180" fill="#fdf3eb" />
            <ellipse cx="130" cy="130" rx="60" ry="10" fill="#d9c2b0" opacity="0.4" />
            {/* Green top leaves */}
            <path d="M 60,50 Q 80,70 100,85" stroke="#3a8f33" strokeWidth="3" strokeLinecap="round" />
            <path d="M 45,65 Q 75,75 95,88" stroke="#5cb854" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 70,35 Q 85,60 102,82" stroke="#2d7327" strokeWidth="2.5" strokeLinecap="round" />
            {/* Carrot body */}
            <path d="M 100,80 Q 150,100 195,115 Q 150,118 105,102 Q 95,90 100,80 Z" fill="#ff7324" />
            <path d="M 102,84 Q 150,102 190,114" stroke="#ffa366" strokeWidth="3" strokeLinecap="round" />
            {/* Ridge rings */}
            <path d="M 120,87 Q 123,96 120,101" stroke="#e05509" strokeWidth="1.5" fill="none" />
            <path d="M 140,94 Q 143,103 140,108" stroke="#e05509" strokeWidth="1.5" fill="none" />
            <path d="M 160,102 Q 163,109 160,113" stroke="#e05509" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      );

    case 'tomato':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#ffebeb] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover">
            <rect width="240" height="180" fill="#fae8e8" />
            <ellipse cx="120" cy="140" rx="45" ry="10" fill="#bfa3a3" opacity="0.4" />
            <circle cx="120" cy="100" r="38" fill="#e53935" />
            <ellipse cx="108" cy="85" rx="14" ry="7" fill="#ff7373" transform="rotate(-30 108 85)" opacity="0.7" />
            {/* Stem and sepals */}
            <path d="M 120,62 L 120,50 Q 125,45 130,46" stroke="#2e7d32" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <polygon points="120,62 110,68 116,60 106,55 120,62 130,55 124,60 134,66 120,62" fill="#388e3c" />
          </svg>
        </div>
      );

    case 'pepper':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#fffbe6] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover">
            <rect width="240" height="180" fill="#f8f4db" />
            <ellipse cx="120" cy="145" rx="40" ry="9" fill="#c4be9f" opacity="0.4" />
            {/* Yellow/Orange Bell pepper lobes */}
            <path d="M 95,80 C 85,95 85,125 105,135 C 120,140 135,135 145,125 C 155,110 150,85 135,78 C 125,72 105,72 95,80 Z" fill="#ffb300" />
            <path d="M 105,80 C 115,90 115,125 105,135" stroke="#ffa000" strokeWidth="3" fill="none" />
            <path d="M 130,78 C 132,95 132,120 128,133" stroke="#ffa000" strokeWidth="3" fill="none" />
            <ellipse cx="102" cy="95" rx="6" ry="14" fill="#ffe082" opacity="0.6" transform="rotate(-15 102 95)" />
            {/* Stem */}
            <path d="M 120,74 Q 118,58 126,52" stroke="#43a047" strokeWidth="5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'mushroom':
      return (
        <div className={`w-full h-full relative overflow-hidden bg-[#f5f5f5] flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 240 180" className="w-full h-full object-cover">
            <rect width="240" height="180" fill="#edeae6" />
            <ellipse cx="120" cy="142" rx="40" ry="8" fill="#bcaba0" opacity="0.4" />
            {/* Stem */}
            <path d="M 112,105 L 110,135 C 110,140 130,140 130,135 L 128,105 Z" fill="#ded5cb" />
            {/* Mushroom Cap */}
            <path d="M 85,105 C 80,75 160,75 155,105 C 145,110 95,110 85,105 Z" fill="#fcf9f5" />
            <ellipse cx="120" cy="104" rx="35" ry="8" fill="#c8b8a8" />
            <path d="M 90,102 C 85,82 155,82 150,102" stroke="#ffffff" strokeWidth="3" fill="none" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};

/**
 * Category icons with precise geometry matching the screenshot:
 * 1. Veggies: broccoli crown
 * 2. Tubers: onion/root bulb with sprouted tip
 * 3. Fish: sleek fish outline
 * 4. Fruits: pear/apple with leaf
 * 5. Meat: chicken drumstick
 */
export const CategoryIcon: React.FC<{
  type: 'veggies' | 'tubers' | 'fish' | 'fruits' | 'meat';
  active?: boolean;
  className?: string;
}> = ({ type, active = false, className = '' }) => {
  const strokeColor = active ? '#ffffff' : 'var(--color-primary, #22c55e)';
  const fillColor = active ? '#ffffff' : 'var(--color-primary, #22c55e)';

  switch (type) {
    case 'veggies':
      return (
        <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`} fill="none">
          {/* Broccoli tree / crown */}
          <path
            d="M16 26V20M13 26H19"
            stroke={strokeColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M16 20C14 20 12 18.5 11 16.5C8.8 16.5 7 14.7 7 12.5C7 10.3 8.8 8.5 11 8.5C11.5 8.5 12 8.6 12.4 8.8C13.2 6.5 15.4 5 18 5C21.3 5 24 7.7 24 11C24.6 11.3 25 12 25 12.8C25 14 24 15 22.8 15C22.2 17.8 19.4 20 16 20Z"
            fill={active ? '#ffffff' : 'none'}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'tubers':
      return (
        <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`} fill="none">
          {/* Onion / Tuber root with sprout */}
          <path
            d="M16 4V9M16 4C14 6 12 6.5 12 9M16 4C18 6 20 6.5 20 9"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 9C10.5 9 7 14 7 19C7 24 11 27 16 27C21 27 25 24 25 19C25 14 21.5 9 16 9Z"
            fill={active ? '#ffffff' : 'none'}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M16 11C13 14 13 22 16 25M16 11C19 14 19 22 16 25"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'fish':
      return (
        <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`} fill="none">
          {/* Fish */}
          <path
            d="M6 16C10 11 18 10 25 16C18 22 10 21 6 16ZM25 16L29 12V20L25 16Z"
            fill={active ? '#ffffff' : 'none'}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="15" r="1.5" fill={strokeColor} />
          <path
            d="M16 14C17 15.5 17 16.5 16 18"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'fruits':
      return (
        <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`} fill="none">
          {/* Pear with leaf */}
          <path
            d="M16 5V8M16 5C18 4 21 5 21 7C21 9 18 9 16 8"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 9C13 9 12 12 11 15C9.5 17 8 19 8 22C8 25.5 11.5 28 16 28C20.5 28 24 25.5 24 22C24 19 22.5 17 21 15C20 12 19 9 16 9Z"
            fill={active ? '#ffffff' : 'none'}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'meat':
      return (
        <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`} fill="none">
          {/* Chicken drumstick */}
          <path
            d="M19 7C14 7 10 11 10 16C10 18.5 11 20 12.5 21.5L8 26M8 26C7 25 6 25 5 26C4 27 4 28 5 29C6 30 7 30 8 29C9 30 10 30 11 29C12 28 12 27 11 26M8 26L12.5 21.5"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 7C23.5 7 27 10.5 27 15C27 19.5 23.5 23 19 23C16.5 23 14 21.5 12.5 19.5C11 17.5 11 14.5 13 11C14.5 8.5 16.5 7 19 7Z"
            fill={active ? '#ffffff' : 'none'}
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * Avatar for Angie Howell matching screenshot
 */
export const UserAvatar: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  return (
    <div className={`relative rounded-full overflow-hidden border border-emerald-100 bg-[#fde9df] flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* Soft studio background */}
        <circle cx="32" cy="32" r="32" fill="#fdebe2" />
        
        {/* Hair - back layer */}
        <path d="M 18,30 C 14,45 15,55 18,60 C 22,60 42,60 46,60 C 49,55 50,45 46,30 Z" fill="#3b2314" />
        
        {/* Neck */}
        <rect x="27" y="38" width="10" height="9" fill="#f5c2a8" />
        
        {/* Blouse / suit collar */}
        <path d="M 16,64 L 24,46 L 32,54 L 40,46 L 48,64 Z" fill="#2d3748" />
        <polygon points="32,46 27,41 37,41" fill="#ffffff" />
        
        {/* Head / face */}
        <ellipse cx="32" cy="30" rx="14" ry="16" fill="#ffd1bc" />
        
        {/* Brunette hair parted style */}
        <path d="M 18,30 C 18,17 46,17 46,30 C 46,23 40,16 32,16 C 24,16 18,23 18,30 Z" fill="#4a2c19" />
        <path d="M 18,28 C 22,34 26,24 34,22 C 42,20 46,27 46,30 C 47,20 40,14 32,14 C 23,14 17,21 18,28 Z" fill="#382010" />

        {/* Eyes & gentle smile */}
        <circle cx="27" cy="29" r="1.8" fill="#2b1810" />
        <circle cx="37" cy="29" r="1.8" fill="#2b1810" />
        <path d="M 29,36 Q 32,39 35,36" stroke="#c45d47" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <ellipse cx="24" cy="33" rx="2.5" ry="1.2" fill="#f89e87" opacity="0.6" />
        <ellipse cx="40" cy="33" rx="2.5" ry="1.2" fill="#f89e87" opacity="0.6" />
      </svg>
    </div>
  );
};
