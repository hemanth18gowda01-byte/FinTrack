import { C } from "../constants/theme";
import { NAV_ITEMS } from "../constants/nav";

export function Sidebar({ page, setPage, user, onLogout }) {
  return (
    <aside style={{width:210,minHeight:"100vh",background:C.bg1,borderRight:"1px solid "+C.border,display:"flex",flexDirection:"column",padding:"20px 10px",flexShrink:0}}>
      <div style={{padding:"6px 14px 22px",borderBottom:"1px solid "+C.border,marginBottom:16}}>
        <div style={{fontFamily:C.serif,fontSize:20,color:C.text0,fontWeight:600,letterSpacing:"-.02em"}}>
          Fin<em style={{color:C.gold,fontStyle:"italic"}}>Track</em>
        </div>
        <div style={{fontSize:8,color:C.text3,letterSpacing:".2em",fontFamily:C.mono,marginTop:3}}>FINANCIAL OS 2.0</div>
      </div>
      <div style={{height:1,background:`linear-gradient(90deg,${C.gold},transparent)`,opacity:.35,marginBottom:14,marginLeft:14}} />
      <div style={{fontSize:8,color:C.text3,letterSpacing:".15em",padding:"0 14px",marginBottom:8,fontFamily:C.mono}}>NAVIGATE</div>
      <nav style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
        {NAV_ITEMS.map((n,i) => (
          <button key={n.id} className={`nav-link${page===n.id?" active":""}`} onClick={() => setPage(n.id)} style={{animationDelay:`${i*50}ms`}}>
            <span style={{fontSize:13,opacity:.7}}>{n.icon}</span>
            <span>{n.label}</span>
            {n.id==="ai" && <span style={{marginLeft:"auto",background:"rgba(200,169,110,.15)",color:C.gold,fontSize:8,padding:"1px 5px",borderRadius:1,fontFamily:C.mono,letterSpacing:".08em"}}>AI</span>}
            {n.badge && n.id!=="ai" && <span style={{marginLeft:"auto",background:"rgba(91,143,212,.15)",color:C.blue,fontSize:8,padding:"1px 5px",borderRadius:1,fontFamily:C.mono}}>{n.badge}</span>}
          </button>
        ))}
      </nav>
      <div style={{borderTop:"1px solid "+C.border,paddingTop:14,marginTop:8}}>
        {user && (
          <div style={{padding:"6px 14px",marginBottom:8}}>
            <div style={{fontSize:12,color:C.text1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
            <div style={{fontSize:9,color:C.text3,fontFamily:C.mono,marginTop:2}}>{user.email}</div>
          </div>
        )}
        <button className="nav-link" onClick={onLogout} style={{color:C.red}}><span>⎋</span><span>Sign Out</span></button>
      </div>
    </aside>
  );
}
