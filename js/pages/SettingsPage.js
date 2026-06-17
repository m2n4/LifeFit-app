// ============================================================
// SettingsPage.js — 설정 페이지
// ============================================================
// SETTINGS PAGE
// ============================================================
function SettingsPage({user, fb, userName, setUserName, animal, setAnimal, themeId, setThemeId, customSections, setCustomSections, darkMode, setDarkMode}) {
  const theme=useTheme();
  const [editName, setEditName] = React.useState(userName);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const SECTION_COLORS = [
    {id:'purple',label:'보라',primary:'#7c3aed',bg:'#f5f3ff',border:'#ddd6fe'},
    {id:'blue',label:'파랑',primary:'#2563eb',bg:'#eff6ff',border:'#bfdbfe'},
    {id:'green',label:'초록',primary:'#16a34a',bg:'#f0fdf4',border:'#bbf7d0'},
    {id:'rose',label:'로즈',primary:'#e11d48',bg:'#fff1f2',border:'#fda4af'},
    {id:'orange',label:'주황',primary:'#ea580c',bg:'#fff7ed',border:'#fed7aa'},
    {id:'teal',label:'청록',primary:'#0891b2',bg:'#ecfeff',border:'#a5f3fc'},
  ];

  async function saveProfile() {
    if(!fb||!user) return;
    setSaving(true);
    try {
      await fb.updateDoc(fb.doc(fb.db,'users',user.uid), {
        name: editName.trim(), animal, themeId,
        customSections: customSections||{},
      });
      if(editName.trim()) await fb.updateProfile(user, {displayName: editName.trim()});
      setUserName(editName.trim());
      setSaved(true);
      setTimeout(()=>setSaved(false), 2000);
    } catch(e) { console.error(e); }
    setSaving(false);
  }

  const sectionTitle = (t) => (
    <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10,marginTop:4}}>{t}</div>
  );

  return (
    <div>
      <div style={{marginBottom:22}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:21,fontWeight:800,color:C.text}}>⚙️ 설정</div>
          <PageHelp pageId="settings"/>
        </div>
        <div style={{fontSize:13,color:C.muted,marginTop:3}}>프로필과 앱 스타일을 바꿔요</div>
      </div>

      {/* 프로필 카드 */}
      <div style={{background:'linear-gradient('+theme.grad+')',borderRadius:20,padding:'20px 22px',marginBottom:20,border:'1.5px solid '+theme.mid}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{fontSize:44}}>{animal}</div>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:theme.primary}}>{editName||userName||'이름 없음'}님</div>
            <div style={{fontSize:12,color:user?.email||'#9ca3af',marginTop:2}}>{user?.email||''}</div>
          </div>
        </div>
      </div>

      {/* 이름 */}
      <div style={{background:C.card,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        {sectionTitle('👤 이름')}
        <input
          value={editName}
          onChange={e=>setEditName(e.target.value)}
          placeholder="이름 또는 닉네임"
          style={{width:'100%',padding:'11px 14px',border:`1.5px solid ${theme.mid}`,borderRadius:12,fontSize:14,outline:'none',background:C.input,boxSizing:'border-box'}}
          onFocus={e=>e.target.style.borderColor=theme.primary}
          onBlur={e=>e.target.style.borderColor=theme.mid}
        />
      </div>

      {/* 캐릭터 */}
      <div style={{background:C.card,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        {sectionTitle('🐾 나의 캐릭터')}
        <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:7}}>
          {ANIMALS.map(a=>(
            <button key={a} onClick={()=>{setAnimal(a);if(fb&&user)fb.updateDoc(fb.doc(fb.db,'users',user.uid),{animal:a}).catch(()=>{});}} style={{
              aspectRatio:'1',borderRadius:11,fontSize:20,width:'100%',
              border:`2px solid ${animal===a?theme.primary:'#f3f4f6'}`,
              background:animal===a?theme.light:C.card,
              cursor:'pointer',margin:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',
            }}>{a}</button>
          ))}
        </div>
      </div>

      {/* 테마 색상 */}
      <div style={{background:C.card,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        {sectionTitle('🎨 메인 색상')}
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
          {THEMES.map(t=>(
            <button key={t.id} onClick={()=>{setThemeId(t.id);if(fb&&user)fb.updateDoc(fb.doc(fb.db,'users',user.uid),{themeId:t.id}).catch(()=>{});}} style={{
              aspectRatio:'1',borderRadius:14,border:`3px solid ${themeId===t.id?t.primary:'transparent'}`,
              background:t.primary,cursor:'pointer',margin:0,
              boxShadow:themeId===t.id?`0 0 0 2px #fff, 0 0 0 4px ${t.primary}`:'none',
              transition:'all 0.15s',position:'relative',
            }}>
              {themeId===t.id&&<span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'#fff',fontWeight:800}}>✓</span>}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,marginTop:9}}>
          {THEMES.map(t=>(
            <div key={t.id} style={{flex:1,textAlign:'center',fontSize:10,color:themeId===t.id?t.primary:'#9ca3af',fontWeight:themeId===t.id?700:400}}>{t.name}</div>
          ))}
        </div>
      </div>

      {/* 다크모드 */}
      <div style={{background:C.card,borderRadius:18,padding:'18px 22px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        {sectionTitle('🌙 다크모드')}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:13,color:darkMode?'#94a3b8':'#6b7280'}}>어두운 화면으로 전환해요</div>
          </div>
          <button onClick={()=>{
            const next=!darkMode;
            setDarkMode(next);
            if(fb&&user) fb.updateDoc(fb.doc(fb.db,'users',user.uid),{darkMode:next}).catch(()=>{});
          }} style={{
            width:50,height:28,borderRadius:14,border:'none',cursor:'pointer',
            background:darkMode?theme.primary:'#e5e7eb',
            position:'relative',transition:'background 0.25s',margin:0,padding:0,flexShrink:0,
          }}>
            <div style={{
              width:22,height:22,borderRadius:'50%',background:C.card,
              position:'absolute',top:3,transition:'left 0.25s',
              left:darkMode?'25px':'3px',boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
            }}/>
          </button>
        </div>
      </div>

      {/* 섹션 색상 커스텀 */}
      <div style={{background:C.card,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        {sectionTitle('🎨 섹션 색상 커스텀')}
        <div style={{fontSize:12,color:C.muted,marginBottom:10}}>루틴·생활·청소 섹션 색을 바꿔요</div>
        {Object.entries({루틴:'🌀',생활:'🏠',청소:'🧹'}).map(([sec,icon])=>{
          const cur = (customSections||{})[sec] || SECTION_COLORS[0];
          const curId = typeof cur === 'string' ? cur : SECTION_COLORS[0].id;
          return (
            <div key={sec} style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text2,marginBottom:6}}>{icon} {sec}</div>
              <div style={{display:'flex',gap:6}}>
                {SECTION_COLORS.map(c=>(
                  <button key={c.id} onClick={()=>setCustomSections(p=>({...p,[sec]:c.id}))} style={{
                    width:28,height:28,borderRadius:8,border:`2.5px solid ${curId===c.id?c.primary:'transparent'}`,
                    background:c.primary,cursor:'pointer',margin:0,
                    boxShadow:curId===c.id?`0 0 0 2px #fff, 0 0 0 3.5px ${c.primary}`:'none',
                    transition:'all 0.15s',
                  }}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 계정 정보 */}
      <div style={{background:C.card,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        {sectionTitle('🔐 계정 정보')}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f9fafb'}}>
          <div style={{fontSize:13,color:C.text3}}>이메일</div>
          <div style={{fontSize:13,fontWeight:600,color:C.text}}>{user?.email||'-'}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0'}}>
          <div style={{fontSize:13,color:C.text3}}>가입 방법</div>
          <div style={{fontSize:13,fontWeight:600,color:C.text}}>
            {user?.providerData?.[0]?.providerId==='google.com'?'구글 로그인':'이메일'}
          </div>
        </div>
      </div>

      {/* 앱 정보 */}
      <div style={{background:C.card,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,marginBottom:20}}>
        {sectionTitle('ℹ️ 앱 정보')}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0'}}>
          <div style={{fontSize:13,color:C.text3}}>버전</div>
          <div style={{fontSize:13,color:C.muted}}>v3.0.0</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0'}}>
          <div style={{fontSize:13,color:C.text3}}>앱 이름</div>
          <div style={{fontSize:13,fontWeight:700,color:'#7c3aed'}}>LifeFit</div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button onClick={saveProfile} disabled={saving} style={{
        width:'100%',padding:'15px',borderRadius:16,border:'none',
        background:saved?'#16a34a':saving?theme.mid:theme.primary,
        color:'#fff',fontSize:15,fontWeight:700,cursor:saving?'default':'pointer',
        transition:'all 0.3s',marginBottom:10,
      }}>
        {saved?'✓ 저장됐어요!':saving?'저장 중...':'변경사항 저장'}
      </button>
    </div>
  );
}


// ============================================================
