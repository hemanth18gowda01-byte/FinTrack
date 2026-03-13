import { C, fmt } from "../constants/theme";

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{padding:"10px 14px",background:C.bg3,border:"1px solid "+C.border,fontFamily:C.mono,fontSize:10}}>
      <div style={{color:C.text3,marginBottom:4}}>{label}</div>
      {payload.map(p => <div key={p.name} style={{color:p.color||C.text1,marginBottom:2}}>{p.name}: {fmt(p.value)}</div>)}
    </div>
  );
}