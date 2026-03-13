import { C } from "../constants/theme";

export function CornerAccents() {
  return [
    {top:-1,left:-1,  borderTop:`1px solid ${C.gold}`,borderLeft:`1px solid ${C.gold}`},
    {top:-1,right:-1, borderTop:`1px solid ${C.gold}`,borderRight:`1px solid ${C.gold}`},
    {bottom:-1,left:-1,  borderBottom:`1px solid ${C.gold}`,borderLeft:`1px solid ${C.gold}`},
    {bottom:-1,right:-1, borderBottom:`1px solid ${C.gold}`,borderRight:`1px solid ${C.gold}`},
  ].map((s,i) => <div key={i} style={{position:"absolute",width:12,height:12,...s}} />);
}