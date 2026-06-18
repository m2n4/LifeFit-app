// ============================================================
// OnboardingPage.js — 온보딩 페이지
// ============================================================
// ONBOARDING
// ============================================================
function Onboarding({userName, onComplete}) {
  const [step, setStep] = React.useState(0);
  const [lifeChoice, setLifeChoice] = React.useState(null);
  const [selectedAnimal, setSelectedAnimal] = React.useState('🐻');
  const [selectedTheme, setSelectedTheme] = React.useState('purple');

  const TOTAL_STEPS = 3;
  const theme = getTheme(selectedTheme);

  const cardStyle = {background:C.card,borderRadius:28,padding:'30px 26px',width:'100%',maxWidth:420,boxShadow:'0 24px 64px rgba(0,0,0,0.12)'};
  const bgStyle = {minHeight:'100vh',background:'linear-gradient('+theme.grad+')',display:'flex',alignItems:'center',justifyContent:'center',padding:20,transition:'background 0.4s'};
  const nextBtn = (onClick, disabled, label='다음 →') => (
    <button onClick={onClick} disabled={disabled} style={{width:'100%',padding:'14px',borderRadius:16,border:'none',background:disabled?'#e5e7eb':theme.primary,color:disabled?'#9ca3af':'#fff',fontSize:15,fontWeight:700,cursor:disabled?'default':'pointer',transition:'all 0.2s',marginTop:6}}>
      {label}
    </button>
  );

  // Step 0: 웰컴
  if(step === 0) return (
    <div className="fade-in" style={bgStyle}>
      <div style={{...cardStyle,textAlign:'center'}}>
        <div style={{fontSize:52,marginBottom:12}}>{selectedAnimal}</div>
        <div style={{fontSize:21,fontWeight:800,color:C.text,marginBottom:6}}>
          {userName ? `${userName}님, 반가워요!` : '어서 오세요!'}
        </div>
        <div style={{fontSize:13,color:C.muted,marginBottom:28,lineHeight:1.7}}>
          딱 3단계만 설정하면<br/>나만의 생활 관리가 시작돼요
        </div>
        <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:24}}>
          {[0,1,2].map(i=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:8,background:i===step?theme.primary:theme.mid,transition:'all 0.3s'}}/>)}
        </div>
        <button onClick={()=>setStep(1)} style={{width:'100%',padding:'15px',borderRadius:16,border:'none',background:theme.primary,color:C.card,fontSize:16,fontWeight:700,cursor:'pointer'}}>
          시작하기 →
        </button>
      </div>
    </div>
  );

  // Step 1: 테마 색상 + 동물 선택
  if(step === 1) return (
    <div className="fade-in" style={bgStyle}>
      <div style={cardStyle}>
        <div style={{display:'flex',gap:6,marginBottom:18}}>
          {[0,1,2].map(i=><div key={i} style={{width:i===1?24:8,height:8,borderRadius:8,background:i===1?theme.primary:theme.mid,transition:'all 0.3s'}}/>)}
        </div>
        <div style={{fontSize:11,color:theme.border,fontWeight:700,marginBottom:5}}>STEP 1 / 3</div>
        <div style={{fontSize:19,fontWeight:800,color:C.text,marginBottom:3}}>나만의 스타일을 골라요</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:18}}>앱의 색상과 캐릭터를 선택해요</div>

        {/* 테마 색상 */}
        <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>🎨 메인 색상</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8,marginBottom:20}}>
          {THEMES.map(t=>(
            <button key={t.id} onClick={()=>setSelectedTheme(t.id)} style={{
              width:'100%',aspectRatio:'1',borderRadius:12,border:`3px solid ${selectedTheme===t.id?t.primary:'transparent'}`,
              background:t.primary,cursor:'pointer',margin:0,
              boxShadow:selectedTheme===t.id?`0 0 0 2px #fff, 0 0 0 4px ${t.primary}`:'none',
              transition:'all 0.15s',position:'relative',
            }}>
              {selectedTheme===t.id&&<span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#fff',fontWeight:800}}>✓</span>}
            </button>
          ))}
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>
          🐾 나의 캐릭터 <span style={{fontSize:11,color:C.muted,fontWeight:400}}>— 사이드바에 표시돼요</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:6,marginBottom:20}}>
          {ANIMALS.map(a=>(
            <button key={a} onClick={()=>setSelectedAnimal(a)} style={{
              width:'100%',aspectRatio:'1',borderRadius:10,fontSize:20,
              border:`2px solid ${selectedAnimal===a?theme.primary:'#f3f4f6'}`,
              background:selectedAnimal===a?theme.light:C.card,
              cursor:'pointer',margin:0,display:'flex',alignItems:'center',justifyContent:'center',
              transition:'all 0.15s',
            }}>{a}</button>
          ))}
        </div>
        {/* 미리보기 */}
        <div style={{background:theme.bg,borderRadius:14,padding:'12px 14px',border:`1.5px solid ${theme.mid}`,marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:24}}>{selectedAnimal}</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:theme.primary}}>{userName||'나'}님, 수고했어요!</div>
            <div style={{fontSize:11,color:theme.border}}>오늘의 명언이 여기 표시돼요</div>
          </div>
        </div>
        {nextBtn(()=>setStep(2), false)}
      </div>
    </div>
  );

  // Step 2: 자취 경력
  if(step === 2) {
    const options = ['방금 이사', '1년 이상', '오래됨'];
    const labels = ['방금 이사했어요', '자취한 지 1년 이상', '오래된 자취생이에요'];
    const icons = ['🏠', '🌱', '🌳'];
    const descs = ['기본 생활 루틴을 추천해드려요', '일반적인 생활 관리 세트를 설정해요', '전체 생활 관리 세트를 설정해요'];
    return (
      <div className="fade-in" style={bgStyle}>
        <div style={cardStyle}>
          <div style={{display:'flex',gap:6,marginBottom:18}}>
            {[0,1,2].map(i=><div key={i} style={{width:i===2?24:8,height:8,borderRadius:8,background:i===2?theme.primary:theme.mid,transition:'all 0.3s'}}/>)}
          </div>
          <div style={{fontSize:11,color:theme.border,fontWeight:700,marginBottom:5}}>STEP 2 / 3</div>
          <div style={{fontSize:19,fontWeight:800,color:C.text,marginBottom:4}}>자취한 지 얼마나 됐어요?</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:18}}>선택에 맞게 생활 관리 항목을 자동으로 설정해드려요</div>
          <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:18}}>
            {options.map((opt,i)=>(
              <button key={opt} onClick={()=>setLifeChoice(opt)} style={{padding:'14px 16px',borderRadius:15,border:`2px solid ${lifeChoice===opt?theme.primary:'#f3f4f6'}`,background:lifeChoice===opt?theme.bg:'#fafafa',cursor:'pointer',width:'100%',margin:0,textAlign:'left',transition:'all 0.15s',display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:22}}>{icons[i]}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:lifeChoice===opt?theme.primary:C.text}}>{labels[i]}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:1}}>{descs[i]}</div>
                </div>
                {lifeChoice===opt&&<span style={{fontSize:15,color:theme.primary}}>✓</span>}
              </button>
            ))}
          </div>
          {nextBtn(()=>{if(lifeChoice)onComplete(lifeChoice,selectedAnimal,selectedTheme);}, !lifeChoice, '완료 →')}
        </div>
      </div>
    );
  }
  return null;
}

// ============================================================
