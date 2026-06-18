// ============================================================
// HomePage.js — 홈 페이지: 알림카드, 생활 요약, 빠른 실행, 이번주 현황
// ============================================================
// HOME PAGE — 전면 개편
// ============================================================
function getGreeting() {
  const h = new Date().getHours();
  if(h < 6)  return {msg:'아직 늦은 시간이에요 🌙', sub:'충분한 휴식도 생활 관리예요'};
  if(h < 12) return {msg:'좋은 아침이에요 ☀️', sub:'오늘도 상쾌하게 시작해봐요'};
  if(h < 18) return {msg:'오후도 잘 보내고 있죠? 🌤️', sub:'오늘 할 일을 하나씩 정리해봐요'};
  if(h < 22) return {msg:'오늘 하루도 수고했어요 🌇', sub:'저녁 루틴을 챙겨봐요'};
  return {msg:'오늘도 고생했어요 🌙', sub:'내일을 위해 미리 준비해요'};
}

// ── 페이지별 사용법 배너 ──
const PAGE_HELP = {
  home: {
    title:'홈 화면 사용법',
    items:[
      {icon:'🔔', text:'알림 카드 — 유통기한 임박·밀린 관리 항목이 자동으로 표시돼요. 탭하면 해당 페이지로 이동해요.'},
      {icon:'📊', text:'생활 달성 — 오늘 완료한 항목 비율을 원형 게이지로 확인해요.'},
      {icon:'⚡', text:'빠른 실행 — 자주 쓰는 기능을 버튼 한 번으로 바로 실행해요.'},
      {icon:'📅', text:'이번 주 — 요일별 달성 현황을 한눈에 봐요. 🌱 1개↑ 💪 50%↑ 🔥 100%'},
    ]
  },
  food: {
    title:'식재료 사용법',
    items:[
      {icon:'➕', text:'+ 추가 버튼 — 직접 이름·유통기한을 입력해서 추가해요.'},
      {icon:'⭐', text:'빠른 추가 — 자주 쓰는 재료를 탭 한 번으로 바로 넣어요.'},
      {icon:'🟢🟡🔴', text:'색상 상태 — 초록(여유) → 노랑(주의) → 주황(임박) → 빨강(위험·초과) 순이에요.'},
      {icon:'✕', text:'삭제 — 카드 오른쪽 ✕ 를 탭해서 먹었거나 버린 재료를 지워요.'},
      {icon:'🛒', text:'장보기 탭 — 필요한 것들을 카테고리별로 정리하고 체크해요.'},
    ]
  },
  life: {
    title:'생활 관리 사용법',
    items:[
      {icon:'✅', text:'체크 — 항목 왼쪽 네모를 탭하면 완료 처리돼요. 다음날 자동 초기화.'},
      {icon:'🌀 🏠 🧹', text:'섹션 구분 — 루틴(매일/주기 반복) · 생활(빨래 등) · 청소(화장실 등) 로 나뉘어요.'},
      {icon:'< >', text:'날짜 이동 — 과거 기록 확인 및 미래 루틴 미리보기가 가능해요.'},
      {icon:'⇅', text:'순서 편집 — 미완료 2개 이상이면 ⇅ 버튼으로 순서를 바꿀 수 있어요.'},
      {icon:'✨', text:'추천 팩 — ✨ 버튼으로 자취 경력에 맞는 항목 세트를 한 번에 추가해요.'},
      {icon:'📊', text:'📊 버튼 — 월간 달성 히트맵과 최장 연속 기록을 확인해요.'},
    ]
  },
  tips: {
    title:'생활 팁 사용법',
    items:[
      {icon:'📂', text:'카테고리 — 청소·세탁·식재료·자취팁·나만의팁으로 필터링해요.'},
      {icon:'🔍', text:'검색 — 원하는 키워드로 팁을 바로 찾아요.'},
      {icon:'✏️', text:'나만의 팁 — + 나만의 팁 버튼으로 직접 노하우를 기록해요.'},
      {icon:'↓', text:'카드 탭 — 탭하면 상세 내용이 펼쳐져요.'},
    ]
  },
  hub: {
    title:'추천 사용법',
    items:[
      {icon:'🎯', text:'상황별 추천 — 내 식재료·루틴 상태에 따라 지금 필요한 것을 자동 추천해요.'},
      {icon:'📱', text:'앱 추천 — 자취 생활에 유용한 앱을 카테고리별로 모아뒀어요.'},
      {icon:'🌐', text:'웹사이트 — 분리수거·공과금·날씨 등 유용한 사이트 모음이에요.'},
      {icon:'💬', text:'커뮤니티 — 자취 꿀팁 커뮤니티로 바로 이동해요.'},
    ]
  },
  mission: {
    title:'미션 & 성장 사용법',
    items:[
      {icon:'🥚→👑', text:'캐릭터 성장 — 스트릭(연속 달성)이 쌓이면 🥚→🌱→⭐→💎→👑 순서로 성장해요.'},
      {icon:'📋', text:'주간 미션 — 매주 월요일 초기화돼요. 완료하면 XP를 획득해요.'},
      {icon:'⚡', text:'XP 획득 — 3일 달성 30XP, 5일 달성 60XP, 완벽한 하루 40XP 등.'},
    ]
  },
  share: {
    title:'공유 사용법',
    items:[
      {icon:'🔑', text:'코드 생성 — 공유 코드 생성 버튼으로 6자리 코드를 만들어요.'},
      {icon:'📥', text:'연결 — 룸메이트의 코드를 입력하면 서로의 현황을 볼 수 있어요.'},
      {icon:'📊', text:'현황 비교 — 나와 룸메이트의 오늘 달성률을 나란히 확인해요.'},
    ]
  },
  settings: {
    title:'설정 사용법',
    items:[
      {icon:'🐾', text:'캐릭터 — 이모지를 선택하면 사이드바에 바로 반영돼요.'},
      {icon:'🎨', text:'색상 — 메인 색상 & 섹션별 색상을 자유롭게 바꿔요.'},
      {icon:'🌙', text:'다크모드 — 토글로 어두운 화면을 켜고 꺼요.'},
      {icon:'💾', text:'변경사항 저장 — 이름 수정 후 하단 버튼을 꼭 눌러야 저장돼요.'},
    ]
  },
};

function PageHelp({pageId}) {
  const theme = useTheme();
  const help = PAGE_HELP[pageId];
  const [open, setOpen] = React.useState(false);
  if(!help) return null;
  return (
    <>
      {/* 고정 ? 버튼 — 항상 화면 우상단 */}
      <button
        onClick={()=>setOpen(v=>!v)}
        title={help.title}
        style={{
          position:'fixed', top:60, right:14, zIndex:1000,
          width:32,height:32,borderRadius:'50%',
          border:`1.5px solid ${open?theme.primary:theme.mid}`,
          background:open?theme.primary:C.card,
          color:open?'#fff':theme.primary,
          fontSize:14,fontWeight:800,cursor:'pointer',margin:0,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 2px 10px rgba(0,0,0,0.12)',
          transition:'all 0.15s',
        }}
      >?</button>

      {/* 드롭다운 패널 */}
      {open&&(
        <>
          <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:998}}/>
          <div style={{
            position:'fixed', top:98, right:14, zIndex:999,
            background:C.card, borderRadius:16,
            border:`1.5px solid ${theme.mid}`,
            boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
            padding:'14px 16px',
            width:270,
            maxHeight:'70vh',
            overflowY:'auto',
            display:'flex',flexDirection:'column',gap:9,
          }}>
            <div style={{fontSize:13,fontWeight:800,color:theme.primary,paddingBottom:8,borderBottom:`1px solid ${theme.mid}`}}>{help.title}</div>
            {help.items.map((item,i)=>(
              <div key={i} style={{display:'flex',gap:9,alignItems:'flex-start'}}>
                <span style={{fontSize:13,flexShrink:0,lineHeight:1.5}}>{item.icon}</span>
                <span style={{fontSize:12,color:C.text2,lineHeight:1.6}}>{item.text}</span>
              </div>
            ))}
            <button onClick={()=>setOpen(false)} style={{marginTop:4,padding:'8px',borderRadius:10,border:`1.5px solid ${theme.mid}`,background:theme.light,color:theme.primary,fontSize:12,fontWeight:700,cursor:'pointer',width:'100%',margin:0}}>닫기</button>
          </div>
        </>
      )}
    </>
  );
}

function QuickActionBtn({emoji, label, onClick}) {
  const theme = useTheme();
  return (
    <button onClick={onClick} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'12px 6px',borderRadius:14,border:'1.5px solid '+theme.mid,background:C.card,cursor:'pointer',width:'auto',margin:0,flex:1,transition:'all 0.15s',minWidth:0}}
      onMouseEnter={e=>{e.currentTarget.style.background=theme.light;e.currentTarget.style.borderColor=theme.primary;}}
      onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor=theme.mid;}}>
      <span style={{fontSize:22}}>{emoji}</span>
      <span style={{fontSize:10,fontWeight:600,color:C.text3,textAlign:'center',lineHeight:1.3,wordBreak:'keep-all'}}>{label}</span>
    </button>
  );
}

function HomePage({foods,lifeItems,streak,weeklyLog,onNav,userName,onQuickAdd,onQuickCheck}) {
  const theme = useTheme();
  const todayDay = new Date().getDay();
  const greeting = getGreeting();

  // ── 우선순위 알림 생성 (최대 3개) ──
  const alerts = [];
  const allFoodsWithDl = foods.map(f=>({...f,dl:calcDaysLeft(f.expiryDate)}));
  const expiredFoods = allFoodsWithDl.filter(f=>f.dl<0);
  const todayDeadline = allFoodsWithDl.filter(f=>f.dl===0);
  const urgentFoods2 = allFoodsWithDl.filter(f=>f.dl===1).sort((a,b)=>a.dl-b.dl);

  // 기간 초과
  if(expiredFoods.length > 0) alerts.push({
    id:'expired', emoji:'⚠️', level:'danger',
    title: `기간 초과 식재료 ${expiredFoods.length}개`,
    sub: expiredFoods.slice(0,2).map(f=>f.name).join(', ') + (expiredFoods.length>2?` 외 ${expiredFoods.length-2}개`:''),
    action:()=>onNav('food'),
    bg:'#fef2f2', border:'#fecaca', accent:'#ef4444', btnLabel:'확인'
  });
  // 오늘 마감
  if(alerts.length < 3 && todayDeadline.length > 0) alerts.push({
    id:'today-food', emoji:todayDeadline[0].emoji, level:'danger',
    title: todayDeadline.length===1?`${todayDeadline[0].name} 오늘이 마감이에요`:`오늘 마감 ${todayDeadline.length}개`,
    sub: '냉장고에서 먼저 꺼내요',
    action:()=>onNav('food'),
    bg:'#fef2f2', border:'#fecaca', accent:'#ef4444', btnLabel:'확인'
  });
  // 내일 마감
  if(alerts.length < 3 && urgentFoods2.length > 0 && expiredFoods.length === 0) alerts.push({
    id:`food-tmr`, emoji:urgentFoods2[0].emoji, level:'warn',
    title:`${urgentFoods2[0].name}${urgentFoods2.length>1?` 등 ${urgentFoods2.length}개`:''}가 내일까지예요`,
    sub:'먼저 드세요!', action:()=>onNav('food'),
    bg:'#fff7ed', border:'#fed7aa', accent:'#f97316', btnLabel:'확인'
  });

  // 가장 오래 밀린 생활 항목
  const overdueItems = lifeItems.filter(c=>c.section!=='루틴'&&c.lastDone&&daysSince(c.lastDone)>c.intervalDays&&!isDoneOn(c,getToday()))
    .sort((a,b)=>(daysSince(b.lastDone)-b.intervalDays)-(daysSince(a.lastDone)-a.intervalDays));
  if(alerts.length < 3 && overdueItems.length > 0) {
    const worst = overdueItems[0];
    alerts.push({
      id:`life-${worst.id}`, emoji:worst.emoji, level:'warn',
      title:`${worst.text} ${daysSince(worst.lastDone)-worst.intervalDays}일 지났어요`,
      sub:`마지막: ${daysSince(worst.lastDone)}일 전 · ${worst.intervalDays}일 주기${overdueItems.length>1?` · 외 ${overdueItems.length-1}개 더`:''}`,
      action:()=>onNav('life'),
      bg:'#fefce8', border:'#fef08a', accent:'#ca8a04', btnLabel:'하러가기'
    });
  }

  // 오늘 루틴 미완료
  const todayRoutines = lifeItems.filter(c=>c.section==='루틴'&&isTodayItem(c, getToday()));
  const undoneRoutines = todayRoutines.filter(c=>!isDoneOn(c,getToday()));
  const doneRoutines = todayRoutines.filter(c=>isDoneOn(c,getToday()));
  if(alerts.length < 3 && undoneRoutines.length > 0) alerts.push({
    id:'routine', emoji:'🌀', level:'info',
    title:`오늘 루틴 ${undoneRoutines.length}개 남았어요`,
    sub:`${doneRoutines.length}/${todayRoutines.length} 완료${doneRoutines.length>0?' · 잘 하고 있어요 👍':''}`,
    action:()=>onNav('life'),
    bg:theme.bg, border:theme.mid, accent:theme.primary, btnLabel:'하러가기'
  });

  const allDone = alerts.length===0;

  // ── 임박 식재료 (D-5 이하) ──
  const urgentList = foods.map(f=>({...f,dl:calcDaysLeft(f.expiryDate)})).filter(f=>f.dl<=5&&f.dl>=0).sort((a,b)=>a.dl-b.dl).slice(0,4);

  // ── 생활 상태 요약 ──
  const todayStr = getToday();
  const todayDueItems = lifeItems.filter(c => isDueOn(c, todayStr));
  const doneLife = todayDueItems.filter(c => isDoneOn(c, todayStr)).length;
  const totalLife = todayDueItems.length;
  const lifePct = totalLife ? Math.round(doneLife/totalLife*100) : 0;
  const streakCount = (streak||{count:0}).count;
  const urgentCount = foods.filter(f=>calcDaysLeft(f.expiryDate)<=3&&calcDaysLeft(f.expiryDate)>=0).length;
  const lifeAchiev = getAchievLevel(doneLife, totalLife);

  // ── 상황별 추천 ──
  const situRecs = getSituationalRecs(foods, lifeItems).filter(r=>r.type!=='cheer').slice(0,2);

  return (
    <div style={{paddingBottom:80}}>

      <PageHelp pageId="home"/>
      {/* ① 환영 헤더 */}
      <div style={{background:'linear-gradient(135deg,'+theme.primary+','+theme.border+')',borderRadius:24,padding:'22px 22px 18px',marginBottom:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-10,top:-10,fontSize:80,opacity:0.08,lineHeight:1}}>🏠</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.75)',fontWeight:600,marginBottom:4}}>{todayLabel()}</div>
        <div style={{fontSize:20,fontWeight:800,color:'#fff',marginBottom:4}}>
          {userName?`${userName}님, ${greeting.msg}`:`${greeting.msg}`}
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.8)'}}>{greeting.sub}</div>

        {/* 스트릭 */}
        {streakCount>0&&(
          <div style={{marginTop:14,display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.2)',borderRadius:20,padding:'5px 12px'}}>
            <span style={{fontSize:14}}>🔥</span>
            <span style={{fontSize:12,color:'#fff',fontWeight:700}}>{streakCount}일 연속 달성 중</span>
          </div>
        )}
      </div>

      {/* ② 오늘 핵심 알림 (최대 3개) */}
      <div style={{marginBottom:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{fontSize:15,fontWeight:800,color:C.text}}>
            오늘 챙길 것들
            {alerts.length>0&&<span style={{marginLeft:7,fontSize:11,fontWeight:700,color:'#fff',background:theme.primary,padding:'2px 8px',borderRadius:20}}>{alerts.length}</span>}
          </div>
        </div>

        {allDone?(
          <div style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',borderRadius:20,padding:'24px',textAlign:'center',border:'1.5px solid #bbf7d0'}}>
            <div style={{fontSize:40,marginBottom:8}}>🎉</div>
            <div style={{fontSize:16,fontWeight:800,color:'#16a34a',marginBottom:4}}>오늘 할 일 다 했어요!</div>
            <div style={{fontSize:13,color:'#4ade80'}}>정말 대단해요 {userName?`, ${userName}님`:''}! 💚</div>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {alerts.map(a=>(
              <div key={a.id} onClick={a.action} style={{background:a.bg,border:`1.5px solid ${a.border}`,borderRadius:18,padding:'15px 16px',display:'flex',alignItems:'center',gap:13,cursor:'pointer',transition:'transform 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <div style={{width:44,height:44,borderRadius:14,background:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{a.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:a.accent}}>{a.title}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{a.sub}</div>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:a.accent,background:'rgba(255,255,255,0.8)',padding:'4px 10px',borderRadius:20,whiteSpace:'nowrap',flexShrink:0}}>{a.btnLabel} ›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ③ 생활 상태 요약 — 3개 카드 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
        <div style={{background:lifeAchiev?lifeAchiev.cardBg:C.card,borderRadius:16,padding:'14px 10px',textAlign:'center',border:`1.5px solid ${lifeAchiev?lifeAchiev.badgeBorder:'#f3f4f6'}`}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:600}}>생활 달성</div>
          <div style={{position:'relative',width:52,height:52,margin:'0 auto 6px'}}>
            <svg width={52} height={52} style={{transform:'rotate(-90deg)'}}>
              <circle cx={26} cy={26} r={20} fill="none" stroke={lifeAchiev?lifeAchiev.gaugeBg:'#f3f4f6'} strokeWidth={6}/>
              <circle cx={26} cy={26} r={20} fill="none" stroke={lifeAchiev?lifeAchiev.gaugeStroke:theme.primary} strokeWidth={6}
                strokeDasharray={`${2*Math.PI*20*lifePct/100} ${2*Math.PI*20}`} strokeLinecap="round"
                style={{transition:'stroke-dasharray 0.6s ease'}}/>
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:lifeAchiev?lifeAchiev.badgeColor:'#1f2937'}}>{lifePct}%</div>
          </div>
          <div style={{fontSize:11,color:C.muted}}>{doneLife}/{totalLife}</div>
          {lifeAchiev&&<div style={{fontSize:10,fontWeight:700,color:lifeAchiev.badgeColor,marginTop:2}}>{lifeAchiev.emoji} {lifeAchiev.label}</div>}
        </div>
        <div style={{background:C.card,borderRadius:16,padding:'14px 10px',textAlign:'center',border:`1.5px solid ${C.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:600}}>연속 달성</div>
          <div style={{fontSize:30,marginBottom:2}}>🔥</div>
          <div style={{fontSize:20,fontWeight:800,color:'#ea580c',lineHeight:1}}>{streakCount}일</div>
        </div>
        <div style={{background:C.card,borderRadius:16,padding:'14px 10px',textAlign:'center',border:`1.5px solid ${urgentCount>0?'#fecaca':'#f3f4f6'}`,cursor:'pointer'}} onClick={()=>onNav('food')}>
          <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:600}}>유통 임박</div>
          <div style={{fontSize:30,marginBottom:2}}>🚨</div>
          <div style={{fontSize:20,fontWeight:800,color:urgentCount>0?'#ef4444':'#22c55e',lineHeight:1}}>{urgentCount}개</div>
        </div>
      </div>

      {/* ④ 유통기한 임박 식재료 */}
      {urgentList.length>0&&(
        <div style={{background:C.card,borderRadius:18,padding:'16px 18px',border:`1.5px solid ${C.border}`,marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>🍱 먼저 먹어야 해요</div>
            <button onClick={()=>onNav('food')} style={{fontSize:12,color:theme.primary,background:'none',border:'none',cursor:'pointer',fontWeight:700,width:'auto',margin:0}}>전체 보기 →</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {urgentList.map(f=>{
              const s=getFoodStatus(f.dl);
              return (
                <div key={f.id} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 12px',borderRadius:12,background:s.bg,border:`1px solid ${s.border}`}}>
                  <span style={{fontSize:20}}>{f.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.text}}>{f.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{f.storage} 보관</div>
                  </div>
                  <div style={{fontSize:12,fontWeight:800,color:s.color,background:C.card,padding:'3px 10px',borderRadius:20,border:`1px solid ${s.border}`}}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ⑤ 상황별 추천 */}
      {situRecs.length>0&&(
        <div style={{background:C.card,borderRadius:18,padding:'16px 18px',border:`1.5px solid ${C.border}`,marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>✨ {userName?`${userName}님을 위한 추천`:'지금 필요한 것들'}</div>
            <button onClick={()=>onNav('hub')} style={{fontSize:12,color:theme.primary,background:'none',border:'none',cursor:'pointer',fontWeight:700,width:'auto',margin:0}}>더보기 →</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {situRecs.filter(r=>r.type!=='cheer').slice(0,2).map((r,i)=>(
              <div key={i} onClick={()=>r.action?onNav(r.action):onNav('hub')} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 13px',borderRadius:12,background:r.bg||theme.bg,border:`1px solid ${r.border||theme.mid}`,cursor:'pointer',transition:'transform 0.12s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <span style={{fontSize:20}}>{r.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:r.accent||theme.primary,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.desc}</div>
                </div>
                <span style={{color:r.accent||theme.primary,fontSize:14,opacity:0.6,flexShrink:0}}>›</span>
              </div>
            ))}
            {situRecs.filter(r=>r.type==='cheer').length>0&&situRecs.filter(r=>r.type!=='cheer').length===0&&(
              <div style={{textAlign:'center',padding:'12px',fontSize:13,color:theme.primary,fontWeight:600}}>
                {situRecs.find(r=>r.type==='cheer').emoji} {situRecs.find(r=>r.type==='cheer').title}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ⑥ 빠른 실행 — 고정 4개 */}
      <div style={{marginBottom:18}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>⚡ 빠른 실행</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:10}}>자주 쓰는 기능을 바로 실행해요</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
          <QuickActionBtn emoji="🥕" label="식재료 추가" onClick={()=>onNav('food')}/>
          <QuickActionBtn emoji="🌀" label="생활 관리" onClick={()=>onNav('life')}/>
          <QuickActionBtn emoji="🛒" label="장보기" onClick={()=>onNav('food')}/>
          <QuickActionBtn emoji="💡" label="생활 팁" onClick={()=>onNav('tips')}/>
        </div>
      </div>

      {/* ⑦ 이번 주 */}
      <div style={{background:C.card,borderRadius:18,padding:'16px 18px',border:`1.5px solid ${C.border}`}}>
        <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>이번 주 달성 현황</div>
        <div style={{display:'flex',gap:5}}>
          {['일','월','화','수','목','금','토'].map((d,i)=>{
            const dateObj=new Date(); dateObj.setDate(dateObj.getDate()-(new Date().getDay()-i));
            const dateStr=dateObj.getFullYear()+'-'+String(dateObj.getMonth()+1).padStart(2,'0')+'-'+String(dateObj.getDate()).padStart(2,'0');
            const isCurrentDay=i===todayDay;
            const logVal=(weeklyLog||{})[dateStr];
            const dayAchiev = logVal>=100?{bg:'#fff7ed',border:'#fed7aa',color:'#ea580c',emoji:'🔥'}
              : logVal>=50?{bg:'#eff6ff',border:'#bfdbfe',color:'#2563eb',emoji:'💪'}
              : logVal>0?{bg:'#f0fdf4',border:'#bbf7d0',color:'#16a34a',emoji:'🌱'}
              : null;
            return (
              <div key={i} style={{flex:1,height:42,borderRadius:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,gap:1,
                background:isCurrentDay?theme.primary:dayAchiev?.bg||'#f9fafb',
                color:isCurrentDay?'#fff':dayAchiev?.color||'#9ca3af',
                border:isCurrentDay?'none':dayAchiev?`1.5px solid ${dayAchiev.border}`:`1px solid #f3f4f6`}}>
                {d}
                {dayAchiev&&!isCurrentDay&&<span style={{fontSize:9,lineHeight:1}}>{dayAchiev.emoji}</span>}
                {isCurrentDay&&<div style={{width:4,height:4,borderRadius:'50%',background:'rgba(255,255,255,0.7)',marginTop:1}}/>}
              </div>
            );
          })}
        </div>
        <div style={{fontSize:11,color:C.muted,marginTop:8,textAlign:'center'}}>연속 {streakCount}일째 생활 관리 중 🔥</div>
      </div>
    </div>
  );
}

// ============================================================
