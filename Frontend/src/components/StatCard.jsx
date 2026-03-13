import { C } from "../constants/theme";

export function StatCard({ label, value, sub, color, icon, delay=0 }) {
  return (
    <div className="card fade-up" style={{padding:"20px 22px",animationDelay:`${delay}ms`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:9,color:C.text3,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:10}}>{label}</div>
          <div style={{fontSize:24,color:color||C.text0,fontFamily:C.serif,fontWeight:400,lineHeight:1}}>{value}</div>
          {sub && <div style={{fontSize:10,color:C.text2,fontFamily:C.mono,marginTop:6,letterSpacing:".04em"}}>{sub}</div>}
        </div>
        {icon && <span style={{fontSize:20,opacity:.18,color:C.gold}}>{icon}</span>}
      </div>
    </div>
  );
}
