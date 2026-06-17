// ============================================================
// Sidebar.js — 데스크탑 사이드바 & 모바일 드로어 컴포넌트
// ============================================================
// SIDEBAR
// ============================================================
const NAV=[
  {id:'home',    emoji:'🏠',label:'홈'},
  {id:'food',    emoji:'🥕',label:'식재료'},
  {id:'life',    emoji:'🌀',label:'생활 관리'},
  {id:'hub',     emoji:'🔖',label:'추천'},
  {id:'tips',    emoji:'💡',label:'생활 팁'},
  {id:'share',   emoji:'👥',label:'공유'},
  {id:'settings',emoji:'⚙️',label:'설정'},
];

// 캐릭터 성장 단계 — Sidebar보다 먼저 정의
function getCharacterGrowth(streak) {
  if(streak>=30) return {level:5,name:'전설',desc:'30일↑ 달성',color:'#f97316',bg:'#fff7ed',badge:'👑'};
  if(streak>=14) return {level:4,name:'고수',desc:'14일↑ 달성',color:'#7c3aed',bg:'#f5f3ff',badge:'💎'};
  if(streak>=7)  return {level:3,name:'노력가',desc:'7일↑ 달성',color:'#2563eb',bg:'#eff6ff',badge:'⭐'};
  if(streak>=3)  return {level:2,name:'새싹',desc:'3일↑ 달성',color:'#16a34a',bg:'#f0fdf4',badge:'🌱'};
  return              {level:1,name:'시작',desc:'첫걸음',color:C.muted,bg:'#f9fafb',badge:'🥚'};
}

function Sidebar({page,onNav,mobileOpen,onClose,userName,onLogout,animal,themeId,streak}) {
  const {isMob}=useResponsive();
  const theme=getTheme(themeId);
  const quote=getTodayQuote();
  const streakCount = (streak||{count:0}).count;
  const growth = getCharacterGrowth(streakCount);
  const isDark = useDark();
  const nextLevelDays = [3,7,14,30,30][growth.level-1] || 30;
  const progressPct = Math.min(100, nextLevelDays > 0 ? (streakCount % nextLevelDays) / nextLevelDays * 100 : 100);

  return (
    <>
      {mobileOpen&&<div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:40}}/>}

      {/* ── 데스크탑 사이드바 ── */}
      <aside className="desktop-sidebar" style={{width:224,minWidth:224,background:C.card,borderRight:`1px solid ${isDark?'#334155':'#f0edf8'}`,display:'flex',flexDirection:'column',padding:'22px 14px',position:'sticky',top:0,height:'100vh',overflowY:'auto',zIndex:50}}>
        <div style={{padding:'4px 10px 16px',borderBottom:`1px solid ${C.divider}`,marginBottom:8}}>
          <div onClick={()=>{onNav('home');}} style={{fontSize:20,fontWeight:900,color:theme.primary,letterSpacing:'-0.5px',cursor:'pointer'}}>🏠 LifeFit</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2,fontWeight:600}}>나를 위한 작은 습관</div>
        </div>
        <nav style={{flex:1}}>
          {NAV.map((n,idx)=>(
            <React.Fragment key={n.id}>
              {idx===3&&<div style={{height:1,background:C.divider,margin:'6px 4px 8px'}}/>}
              <button onClick={()=>{onNav(n.id);}} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'11px 13px',borderRadius:12,border:'none',background:page===n.id?theme.light:'transparent',color:page===n.id?theme.primary:C.text3,fontWeight:page===n.id?700:500,fontSize:14,cursor:'pointer',textAlign:'left',marginBottom:3,transition:'background 0.15s'}}>
                <span style={{fontSize:16}}>{n.emoji}</span>{n.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
        {/* ── 캐릭터 카드 ── */}
        <div style={{background:`linear-gradient(135deg,${theme.bg},${theme.light})`,borderRadius:18,padding:'16px',border:`1.5px solid ${theme.mid}`}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
            <div style={{position:'relative',flexShrink:0}}>
              <div style={{fontSize:38,fontFamily:"'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif",lineHeight:1}}>{animal||'🐻'}</div>
              <div style={{position:'absolute',bottom:-4,right:-6,fontSize:16,lineHeight:1}}>{growth.badge}</div>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:800,color:theme.primary,lineHeight:1.2}}>{userName?`${userName}님`:'LifeFit'}</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:3,background:growth.bg,borderRadius:20,padding:'2px 8px',border:`1px solid ${growth.color}44`}}>
                <span style={{fontSize:11}}>{growth.badge}</span>
                <span style={{fontSize:11,fontWeight:700,color:growth.color}}>{growth.name}</span>
              </div>
            </div>
          </div>
          <div style={{background:'rgba(255,255,255,0.6)',borderRadius:10,padding:'8px 10px',marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:700,color:C.text2}}>🔥 {streakCount}일 연속</span>
              <span style={{fontSize:10,color:C.muted}}>{growth.desc}</span>
            </div>
            <div style={{height:5,background:C.border2,borderRadius:8,overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:8,background:`linear-gradient(90deg,${theme.primary},${theme.border})`,width:`${progressPct}%`,transition:'width 0.5s ease'}}/>
            </div>
          </div>
          <button onClick={()=>onNav('mission')} style={{
            width:'100%',padding:'9px 12px',borderRadius:11,border:'none',
            background:`linear-gradient(135deg,${theme.primary},${theme.border})`,
            color:C.card,fontSize:12,fontWeight:700,cursor:'pointer',
            margin:'0 0 8px 0',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            boxShadow:`0 3px 10px ${theme.primary}55`,
          }}>
            <span style={{fontSize:14}}>🎯</span> 미션 &amp; 성장
          </button>
          <div style={{borderTop:`1px solid ${theme.mid}`,paddingTop:8,marginBottom:8}}>
            <div style={{fontSize:11,color:theme.primary,lineHeight:1.6,fontStyle:'italic'}}>"{quote.text}"</div>
            {quote.author&&<div style={{fontSize:10,color:theme.border,marginTop:2,textAlign:'right'}}>— {quote.author}</div>}
          </div>
          {onLogout&&<button onClick={onLogout} style={{width:'100%',padding:'7px',borderRadius:9,border:`1px solid ${theme.mid}`,background:C.card,color:C.muted,fontSize:11,cursor:'pointer',margin:0,fontWeight:600}}>로그아웃</button>}
        </div>
      </aside>

      {/* ── 모바일 드로어 ── */}
      {mobileOpen&&(
        <aside style={{position:'fixed',left:0,top:0,width:270,height:'100vh',background:C.card,zIndex:50,display:'flex',flexDirection:'column',padding:'22px 14px',overflowY:'auto',boxShadow:'4px 0 24px rgba(0,0,0,0.12)',animation:'slideUp 0.2s ease'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 6px 16px',borderBottom:`1px solid ${C.divider}`,marginBottom:8}}>
            <div onClick={()=>{onNav('home');onClose();}} style={{fontSize:19,fontWeight:900,color:theme.primary,letterSpacing:'-0.5px',cursor:'pointer'}}>🏠 LifeFit</div>
            <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:C.muted,padding:4,width:'auto',margin:0}}>✕</button>
          </div>
          <nav style={{flex:1}}>
            {NAV.map((n,idx)=>(
              <React.Fragment key={n.id}>
                {idx===3&&<div style={{height:1,background:C.divider,margin:'6px 4px 8px'}}/>}
                <button onClick={()=>{onNav(n.id);onClose();}} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:13,border:'none',background:page===n.id?theme.light:'transparent',color:page===n.id?theme.primary:'#6b7280',fontWeight:page===n.id?700:500,fontSize:15,cursor:'pointer',textAlign:'left',marginBottom:4,transition:'background 0.15s'}}>
                  <span style={{fontSize:18}}>{n.emoji}</span>{n.label}
                </button>
              </React.Fragment>
            ))}
          </nav>
          <div style={{background:`linear-gradient(135deg,${theme.bg},${theme.light})`,borderRadius:18,padding:'16px',border:`1.5px solid ${theme.mid}`}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
              <div style={{position:'relative',flexShrink:0}}>
                <div style={{fontSize:42,fontFamily:"'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif",lineHeight:1}}>{animal||'🐻'}</div>
                <div style={{position:'absolute',bottom:-4,right:-6,fontSize:18,lineHeight:1}}>{growth.badge}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:800,color:theme.primary,lineHeight:1.2}}>{userName?`${userName}님`:'LifeFit'}</div>
                <div style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:4,background:growth.bg,borderRadius:20,padding:'3px 9px',border:`1px solid ${growth.color}44`}}>
                  <span style={{fontSize:12}}>{growth.badge}</span>
                  <span style={{fontSize:12,fontWeight:700,color:growth.color}}>{growth.name}</span>
                </div>
              </div>
            </div>
            <div style={{background:'rgba(255,255,255,0.6)',borderRadius:10,padding:'8px 10px',marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,color:C.text2}}>🔥 {streakCount}일 연속</span>
                <span style={{fontSize:11,color:C.muted}}>{growth.desc}</span>
              </div>
              <div style={{height:5,background:C.border2,borderRadius:8,overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:8,background:`linear-gradient(90deg,${theme.primary},${theme.border})`,width:`${progressPct}%`,transition:'width 0.5s'}}/>
              </div>
            </div>
            <button onClick={()=>{onNav('mission');onClose();}} style={{
              width:'100%',padding:'10px 12px',borderRadius:11,border:'none',
              background:`linear-gradient(135deg,${theme.primary},${theme.border})`,
              color:C.card,fontSize:13,fontWeight:700,cursor:'pointer',
              margin:'0 0 8px 0',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
              boxShadow:`0 3px 10px ${theme.primary}55`,
            }}>
              <span style={{fontSize:15}}>🎯</span> 미션 &amp; 성장
            </button>
            <div style={{borderTop:`1px solid ${theme.mid}`,paddingTop:8,marginBottom:8}}>
              <div style={{fontSize:11,color:theme.primary,lineHeight:1.6,fontStyle:'italic'}}>"{quote.text}"</div>
              {quote.author&&<div style={{fontSize:10,color:theme.border,marginTop:2,textAlign:'right'}}>— {quote.author}</div>}
            </div>
            {onLogout&&<button onClick={onLogout} style={{width:'100%',padding:'8px',borderRadius:9,border:`1px solid ${theme.mid}`,background:C.card,color:C.muted,fontSize:12,cursor:'pointer',margin:0,fontWeight:600}}>로그아웃</button>}
          </div>
        </aside>
      )}
    </>
  );
}


// ============================================================
