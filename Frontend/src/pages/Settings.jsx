import { useState } from "react";
import { C } from "../constants/theme";
import { DEMO_TOKEN } from "../api";

function Settings({token, toast}) {
  const [notifs, setNotifs] = useState({email:true, sms:false, push:true});
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState("dark");

  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:22}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:8}}>PREFERENCES</div>
        <h1 style={{fontFamily:C.serif,fontSize:28,fontWeight:400,color:C.text0}}>App <em style={{fontStyle:"italic",color:C.gold}}>Settings</em></h1>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card fade-up" style={{padding:"24px 26px",animationDelay:"60ms"}}>
          <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:18}}>Notifications</div>
          {[{key:"email",label:"Email Alerts",desc:"Weekly spending summary & insights"},{key:"sms",label:"SMS Alerts",desc:"Transaction notifications via SMS"},{key:"push",label:"Push Notifications",desc:"Real-time budget breach alerts"}].map(item=>(
            <div key={item.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+C.border}}>
              <div><div style={{fontSize:13,color:C.text1,marginBottom:2}}>{item.label}</div><div style={{fontSize:10,color:C.text3,fontFamily:C.mono}}>{item.desc}</div></div>
              <div onClick={()=>setNotifs(p=>({...p,[item.key]:!p[item.key]}))} style={{width:40,height:22,borderRadius:11,background:notifs[item.key]?C.gold:"rgba(200,192,176,.15)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:notifs[item.key]?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
              </div>
            </div>
          ))}
        </div>

        <div className="card fade-up" style={{padding:"24px 26px",animationDelay:"120ms"}}>
          <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:18}}>Preferences</div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:10,color:C.text3,fontFamily:C.mono,letterSpacing:".08em",display:"block",marginBottom:8}}>DEFAULT CURRENCY</label>
            <select className="app-input" value={currency} onChange={e=>setCurrency(e.target.value)}>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </div>
          <div>
            <label style={{fontSize:10,color:C.text3,fontFamily:C.mono,letterSpacing:".08em",display:"block",marginBottom:8}}>THEME</label>
            <div style={{display:"flex",gap:6}}>
              {["dark","darker","oled"].map(t=>(
                <button key={t} onClick={()=>{setTheme(t);toast.show(`Theme: ${t}`,"success");}} style={{flex:1,padding:"9px",border:`1px solid ${theme===t?C.gold:C.border}`,background:theme===t?"rgba(200,169,110,.1)":"transparent",color:theme===t?C.gold:C.text3,fontFamily:C.mono,fontSize:9,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",borderRadius:1,transition:"all .18s"}}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card fade-up" style={{padding:"24px 26px",animationDelay:"180ms"}}>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:18}}>Account</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[{label:"Account Type",value:"Demo Account"},{label:"Data Source",value:"Mock Data"},{label:"API Status",value:token===DEMO_TOKEN?"Demo Mode":"Connected",color:token===DEMO_TOKEN?C.gold:C.green},{label:"Version",value:"FinTrack 2.0"}].map(s=>(
            <div key={s.label} style={{padding:"12px 14px",background:C.bg3,border:"1px solid "+C.border,borderRadius:1}}>
              <div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:6}}>{s.label.toUpperCase()}</div>
              <div style={{fontSize:14,color:s.color||C.text1,fontFamily:C.mono}}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:18,display:"flex",gap:10}}>
          <button className="btn-ghost" onClick={()=>toast.show("Data export coming soon","info")}>Export Data</button>
          <button className="btn-ghost" style={{color:C.red,borderColor:"rgba(224,82,82,.2)"}} onClick={()=>toast.show("Account cleared","success")}>Clear Data</button>
        </div>
      </div>
    </div>
  );
}


export { Settings };
