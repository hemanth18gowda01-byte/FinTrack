import { C } from "../constants/theme";

export function Toasts({ toasts }) {
  return (
    <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding:"12px 18px",borderRadius:2,fontFamily:C.mono,fontSize:11,letterSpacing:".05em",
          animation:"slideIn .3s ease",maxWidth:300,border:"1px solid",
          background:t.type==="error"?"#2d0a0a":t.type==="info"?"#0a1428":"#0a1f12",
          borderColor:t.type==="error"?"rgba(224,82,82,.3)":t.type==="info"?"rgba(91,143,212,.3)":"rgba(76,175,120,.3)",
          color:t.type==="error"?C.red:t.type==="info"?C.blue:C.green,
        }}>
          {t.type==="error"?"✗ ":t.type==="info"?"ℹ ":"✓ "}{t.msg}
        </div>
      ))}
    </div>
  );
}
