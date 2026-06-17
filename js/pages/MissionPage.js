// ============================================================
// MissionPage.js — 미션 & 성장 페이지
// ============================================================
function MissionPage({streak, lifeItems, weeklyLog, animal, foods, fb, user}) {
  const theme = useTheme();
  const todayStr = getToday();
  const weekDates = getWeekDates(); // 일~토 (현재 주)
  const weekStart = getWeekStart();

  // 주간 다이어리 로드
  const [diaries, setDiaries] = React.useState([]);
  React.useEffect(()=>{
    if(!fb||!user) return;
    const unsub = fb.onSnapshot(fb.collection(fb.db,'users',user.uid,'diaries'), snap=>{
      setDiaries(snap.docs.map(d=>({...d.data(),id:d.id})));
    });
    return ()=>unsub();
  },[fb,user]);

  // 이번 주 달성 현황
  const weekActiveDays = weekDates.filter(d=>(weeklyLog||{})[d]>0).length;
  const weekPerfectDays = weekDates.filter(d=>(weeklyLog||{})[d]>=100).length;

  // 오늘 달성률
  const todayDue = lifeItems.filter(c=>isDueOn(c,todayStr));
  const todayDoneCount = todayDue.filter(c=>isDoneOn(c,todayStr)).length;
  const todayPct = todayDue.length ? Math.round(todayDoneCount/todayDue.length*100) : 0;

  const streakCount = (streak||{count:0}).count;
  const growth = getCharacterGrowth(streakCount);

  // 주간 XP 계산
  const weekXp = WEEKLY_MISSIONS
    .filter(m => m.check(weeklyLog||{}, weekDates, lifeItems, foods||[], diaries))
    .reduce((s,m) => s+m.xp, 0);
  const maxXp = WEEKLY_MISSIONS.reduce((s,m)=>s+m.xp,0);

  // 이번 주 시작일 표시
  const weekStartDate = new Date(weekStart+'T00:00:00');
  const weekLabel = `${weekStartDate.getMonth()+1}/${weekStartDate.getDate()} 주`;

  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:21,fontWeight:800,color:C.text}}>🎯 미션 & 성장</div>
          <PageHelp pageId="mission"/>
        </div>
        <div style={{fontSize:13,color:C.muted,marginTop:3}}>이번 주 미션을 완료하고 성장해요</div>
      </div>

      {/* 캐릭터 성장 카드 */}
      <div style={{background:`linear-gradient(135deg,${theme.primary},${theme.border})`,borderRadius:24,padding:'22px',marginBottom:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-10,top:-10,fontSize:80,opacity:0.1,fontFamily:"'Segoe UI Emoji','Apple Color Emoji',sans-serif"}}>{animal||'🐻'}</div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{position:'relative'}}>
            <div style={{fontSize:54,fontFamily:"'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif",lineHeight:1}}>{animal||'🐻'}</div>
            <div style={{position:'absolute',bottom:-6,right:-6,fontSize:20}}>{growth.badge}</div>
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{fontSize:11,color:'rgba(255,255,255,0.8)',fontWeight:600}}>Lv.{growth.level}</span>
              <span style={{fontSize:15,fontWeight:800,color:'#fff'}}>{growth.badge} {growth.name}</span>
            </div>
            <div style={{fontSize:13,color:'rgba(255,255,255,0.9)',marginBottom:6}}>🔥 {streakCount}일 연속 달성 중</div>
            <div style={{height:6,background:'rgba(255,255,255,0.2)',borderRadius:8,overflow:'hidden',marginBottom:3}}>
              <div style={{height:'100%',background:C.card,borderRadius:8,transition:'width 0.5s',
                width:`${Math.min(100,([3,7,14,30,30][growth.level-1]||30)>0?(streakCount%([3,7,14,30,30][growth.level-1]||30))/([3,7,14,30,30][growth.level-1]||30)*100:100)}%`
              }}/>
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>{growth.desc}</div>
          </div>
        </div>
        {/* 레벨 로드맵 */}
        <div style={{display:'flex',gap:4,marginTop:16,justifyContent:'center'}}>
          {[{b:'🥚',n:'시작'},{b:'🌱',n:'새싹'},{b:'⭐',n:'노력'},{b:'💎',n:'고수'},{b:'👑',n:'전설'}].map((item,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,flex:1}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:i<growth.level?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,transition:'all 0.3s',border:i===growth.level-1?'2.5px solid #fff':'none'}}>{item.b}</div>
              <div style={{fontSize:8,color:'rgba(255,255,255,0.65)',fontWeight:600}}>{item.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 이번 주 XP */}
      <div style={{background:C.card,borderRadius:18,padding:'16px 18px',marginBottom:14,border:`1.5px solid ${C.border}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text2}}>⚡ {weekLabel} 주간 XP</div>
          <div style={{fontSize:14,fontWeight:800,color:theme.primary}}>{weekXp} / {maxXp} XP</div>
        </div>
        <div style={{height:8,background:C.card3,borderRadius:8,overflow:'hidden'}}>
          <div style={{height:'100%',background:`linear-gradient(90deg,${theme.primary},${theme.border})`,borderRadius:8,width:`${maxXp?weekXp/maxXp*100:0}%`,transition:'width 0.6s ease'}}/>
        </div>
        <div style={{display:'flex',gap:12,marginTop:8}}>
          <span style={{fontSize:11,color:C.muted}}>📅 활동 {weekActiveDays}일</span>
          <span style={{fontSize:11,color:C.muted}}>🔥 완벽 {weekPerfectDays}일</span>
        </div>
      </div>

      {/* 주간 미션 */}
      <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:10}}>
        📋 이번 주 미션
        <span style={{marginLeft:8,fontSize:11,fontWeight:600,color:C.muted}}>매주 월요일 초기화</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:18}}>
        {WEEKLY_MISSIONS.map(m=>{
          const done = m.check(weeklyLog||{}, weekDates, lifeItems, foods||[], diaries);
          return (
            <div key={m.id} style={{
              background:done?'linear-gradient(135deg,#f0fdf4,#dcfce7)':'#fff',
              borderRadius:14,padding:'14px 16px',
              border:`1.5px solid ${done?'#86efac':'#f3f4f6'}`,
              display:'flex',alignItems:'center',gap:12,
              transition:'all 0.25s',
            }}>
              <div style={{width:42,height:42,borderRadius:12,background:done?'#16a34a':theme.light,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0,transition:'all 0.3s'}}>{m.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <span style={{fontSize:13,fontWeight:700,color:done?'#16a34a':C.text}}>{m.title}</span>
                  {done&&<span style={{fontSize:10,fontWeight:700,color:'#16a34a',background:'#dcfce7',padding:'1px 7px',borderRadius:20,border:'1px solid #86efac'}}>완료</span>}
                </div>
                <div style={{fontSize:11,color:C.muted}}>{m.desc}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,flexShrink:0}}>
                <span style={{fontSize:11,fontWeight:700,color:done?'#16a34a':theme.primary}}>{done?'✅':'+'+m.xp}</span>
                <span style={{fontSize:9,color:C.muted}}>XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 오늘 현황 */}
      <div style={{background:C.card,borderRadius:16,padding:'16px',border:`1.5px solid ${C.border}`}}>
        <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>📊 오늘 현황</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {[
            {label:'오늘 달성률',value:`${todayPct}%`,color:theme.primary},
            {label:'완료한 항목',value:`${todayDoneCount}개`,color:'#16a34a'},
            {label:'연속 스트릭',value:`${streakCount}일`,color:'#ea580c'},
          ].map(s=>(
            <div key={s.label} style={{textAlign:'center',padding:'10px 6px',background:C.card2,borderRadius:12}}>
              <div style={{fontSize:18,fontWeight:800,color:s.color}}>{s.value}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 공유 기능 (룸메이트)
// ============================================================
