export const C = {
  bg:"#08090a", bg1:"#0f1012", bg2:"#151618", bg3:"#1c1e21",
  border:"rgba(200,169,110,0.12)", borderH:"rgba(200,169,110,0.30)",
  gold:"#c8a96e", goldL:"#e8d5b0", goldD:"#8a7040",
  text0:"#f5f0e8", text1:"#c8c0b0",
  text2:"rgba(200,192,176,0.5)", text3:"rgba(200,192,176,0.28)",
  green:"#4caf78", red:"#e05252", blue:"#5b8fd4",
  mono:"'IBM Plex Mono','Courier New',monospace",
  serif:"'Playfair Display',Georgia,serif",
  sans:"'DM Sans',system-ui,sans-serif",
};

export const fmt    = n => "₹" + Number(n).toLocaleString("en-IN", {maximumFractionDigits:0});
export const fmtDate = d => new Date(d).toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"});