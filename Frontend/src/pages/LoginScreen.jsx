import { useState } from "react";
import { C } from "../constants/theme";
import { DEMO_TOKEN } from "../api";
import { CornerAccents } from "../components/CornerAccents";

export function LoginScreen({ onLogin, toast }) {
  const [loading, setLoading] = useState(false);
  const demoLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onLogin({name:"Arjun Sharma", email:"arjun@fintrack.app"}, DEMO_TOKEN);
    toast.show("Signed in with demo account", "success");
  };
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(ellipse 800px 600px at 70% 40%,rgba(200,169,110,.045) 0%,transparent 70%),radial-gradient(ellipse 500px 400px at 20% 80%,rgba(200,169,110,.03) 0%,transparent 60%)`}} />
      {[15,35,55,75].map(p => <div key={p} style={{position:"absolute",top:0,bottom:0,left:`${p}%`,width:1,background:"rgba(200,169,110,.03)"}} />)}
      {[20,40,60,80].map(p => <div key={p} style={{position:"absolute",left:0,right:0,top:`${p}%`,height:1,background:"rgba(200,169,110,.03)"}} />)}
      <div style={{position:"absolute",top:28,left:32,fontFamily:C.serif,fontSize:18,color:C.gold,fontWeight:600}}>Fin<em style={{fontStyle:"italic"}}>Track</em></div>
      <div style={{position:"absolute",top:33,right:32,fontFamily:C.mono,fontSize:9,color:C.text3,letterSpacing:".15em"}}>FINANCIAL OS 2.0</div>
      <div style={{position:"absolute",bottom:28,left:32,fontFamily:C.mono,fontSize:8,color:C.text3,letterSpacing:".1em"}}>POWERED BY AI · AES-256 · JWT</div>
      <div style={{position:"absolute",bottom:28,right:32,fontFamily:C.mono,fontSize:8,color:C.text3,letterSpacing:".1em"}}>RENDER · MONGODB ATLAS</div>
      <div className="fade-up" style={{width:"100%",maxWidth:400,padding:"44px 40px",background:C.bg2,border:"1px solid "+C.border,borderRadius:2,position:"relative"}}>
        <CornerAccents />
        <div className="tag tag-gold" style={{marginBottom:20}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:C.gold,animation:"pulse 2s infinite",display:"inline-block"}} />
          Secure Login
        </div>
        <div style={{fontFamily:C.serif,fontSize:72,fontWeight:600,color:C.text0,lineHeight:1,letterSpacing:"-.02em",marginBottom:18}}>
          Log<em style={{fontStyle:"italic",color:C.gold}}>in</em>
        </div>
        <h2 style={{fontFamily:C.serif,fontSize:18,fontWeight:400,color:C.text1,lineHeight:1.4,marginBottom:8}}>
          As you manage your money,<br/><em style={{fontStyle:"italic",color:C.gold}}>you manage your life.</em>
        </h2>
        <p style={{color:C.text3,fontSize:12,fontFamily:C.mono,letterSpacing:".04em",marginBottom:32,lineHeight:1.7}}>
          AI-powered personal finance intelligence.<br/>Track, analyze, and grow your wealth.
        </p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:32}}>
          {["AI Insights","Loan Planner","EMI Calculator","Smart Analytics"].map(f => (
            <span key={f} style={{fontSize:9,color:C.text3,background:"rgba(200,169,110,.05)",border:"1px solid rgba(200,169,110,.1)",padding:"3px 8px",fontFamily:C.mono,letterSpacing:".06em",borderRadius:1}}>{f}</span>
          ))}
        </div>
        <button className="btn-ghost" style={{width:"100%",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:13}} onClick={() => toast.show("Configure Google OAuth client ID to enable","info")}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <div style={{textAlign:"center",color:C.text3,fontSize:10,fontFamily:C.mono,letterSpacing:".08em",margin:"10px 0"}}>— OR —</div>
        <button className="btn-primary" style={{width:"100%",padding:13}} onClick={demoLogin} disabled={loading}>
          {loading ? <><span className="spinner"/> &nbsp;Loading…</> : "▶  Demo — Explore the App"}
        </button>
        <p style={{textAlign:"center",marginTop:16,color:C.text3,fontSize:10,fontFamily:C.mono,letterSpacing:".05em"}}>Demo uses sample Indian financial data</p>
      </div>
    </div>
  );
}
