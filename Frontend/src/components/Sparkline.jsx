export function Sparkline({ data, color, w=80, h=30 }) {
  if (!data || data.length < 2) return null;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts=data.map((v,i)=>`${((i/(data.length-1))*w).toFixed(1)},${(h-((v-mn)/rng)*h).toFixed(1)}`).join(" ");
  const last=pts.split(" ").slice(-1)[0].split(",");
  return (
    <svg width={w} height={h} style={{overflow:"visible",flexShrink:0}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.9"/>
      <circle cx={last[0]} cy={last[1]} r="2.8" fill={color}/>
    </svg>
  );
}
