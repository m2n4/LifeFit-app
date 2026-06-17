// ============================================================
// ReportPage.js — 월간 리포트 페이지
// ============================================================
function ReportPage({weeklyLog, lifeItems, foods, streak}) {
  const theme = useTheme();
  const now = new Date();
  const [reportMonth, setReportMonth] = React.useState(now.getMonth());
  const [reportYear, setReportYear] = React.useState(now.getFullYear());

  const monthNames=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const daysInMonth = new Date(reportYear, reportMonth+1, 0).getDate();

  // 해당 월 로그 수집
  const monthDays = Array.from({length:daysInMonth},(_,i)=>{
    const d = i+1;
    const ds = `${reportYear}-${String(reportMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const log = (weeklyLog||{})[ds];
    return {d, ds, log};
  });

  const activeDays = monthDays.filter(d=>d.log>0).length;
  const perfectDays = monthDays.filter(d=>d.log>=100).length;
  const effortDays = monthDays.filter(d=>d.log>=50&&d.log<100).length;
  const startDays = monthDays.filter(d=>d.log>0&&d.log<50).length;
  const avgLog = activeDays ? Math.round(monthDays.filter(d=>d.log>0).reduce((s,d)=>s+(d.log||0),0)/activeDays) : 0;

  // 최장 연속 달성 계산
  let maxStreak=0, curStreak=0;
  monthDays.forEach(d=>{
    if(d.log>0) { curStreak++; maxStreak=Math.max(maxStreak,curStreak); }
    else curStreak=0;
  });

  // 가장 많이 완료된 루틴
  const routines = lifeItems.filter(c=>c.section==='루틴');

  // 식재료 낭비 추정 (기간 초과된 것)
  const expiredCount = foods.filter(f=>calcDaysLeft(f.expiryDate)<0).length;

  function prevMonth(){ if(reportMonth===0){setReportMonth(11);setReportYear(y=>y-1);}else setReportMonth(m=>m-1); }
  function nextMonth(){ if(reportMonth===11){setReportMonth(0);setReportYear(y=>y+1);}else setReportMonth(m=>m+1); }

  const getAchievBg=(log)=>{
    if(!log&&log!==0) return '#f9fafb';
    if(log>=100) return '#fff7ed';
    if(log>=50) return '#eff6ff';
    if(log>0) return '#f0fdf4';
    return '#f9fafb';
  };
  const getAchievColor=(log)=>{
    if(!log&&log!==0) return '#e5e7eb';
    if(log>=100) return '#f97316';
    if(log>=50) return '#3b82f6';
    if(log>0) return '#22c55e';
    return '#e5e7eb';
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18}}>
        <div>
          <div style={{fontSize:21,fontWeight:800,color:C.text,marginBottom:3}}>📊 월간 리포트</div>
          <div style={{fontSize:13,color:C.muted}}>한 달을 돌아봐요</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button onClick={prevMonth} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:theme.primary,padding:'2px 6px',width:'auto',margin:0}}>‹</button>
          <span style={{fontSize:13,fontWeight:700,color:C.text}}>{reportYear}년 {monthNames[reportMonth]}</span>
          <button onClick={nextMonth} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:theme.primary,padding:'2px 6px',width:'auto',margin:0}}>›</button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:16}}>
        {[
          {label:'활동한 날',value:`${activeDays}일`,sub:`${daysInMonth}일 중`,emoji:'📅',bg:'#f0fdf4',color:'#16a34a'},
          {label:'평균 달성률',value:`${avgLog}%`,sub:'활동한 날 기준',emoji:'📈',bg:theme.bg,color:theme.primary},
          {label:'이번 달 최장',value:`${maxStreak}일`,sub:'연속 달성',emoji:'🔥',bg:'#fff7ed',color:'#ea580c'},
          {label:'완벽 달성',value:`${perfectDays}일`,sub:'100% 완료한 날',emoji:'🌟',bg:'#fdf4ff',color:'#7c3aed'},
        ].map(s=>(
          <div key={s.label} style={{background:s.bg,borderRadius:16,padding:'14px 16px',border:'1.5px solid rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:10,color:C.muted,marginBottom:4,fontWeight:600}}>{s.label}</div>
            <div style={{fontSize:24,fontWeight:800,color:s.color,lineHeight:1}}>{s.value}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:3}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 달성 히트맵 */}
      <div style={{background:C.card,borderRadius:18,padding:'16px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>📆 일별 달성 현황</div>
        <div style={{display:'flex',gap:4,marginBottom:8,flexWrap:'wrap'}}>
          {[{color:'#f0fdf4',border:'#22c55e',label:'🌱 시작'},{color:'#eff6ff',border:'#3b82f6',label:'💪 노력'},{color:'#fff7ed',border:'#f97316',label:'🔥 완벽'},{color:'#f9fafb',border:'#e5e7eb',label:'기록없음'}].map(s=>(
            <div key={s.label} style={{display:'flex',alignItems:'center',gap:3}}>
              <div style={{width:12,height:12,borderRadius:3,background:s.color,border:`1.5px solid ${s.border}`}}/>
              <span style={{fontSize:10,color:C.text3}}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
          {['일','월','화','수','목','금','토'].map(d=>(<div key={d} style={{textAlign:'center',fontSize:9,color:C.muted,fontWeight:700,paddingBottom:3}}>{d}</div>))}
          {Array.from({length:new Date(reportYear,reportMonth,1).getDay()},(_,i)=><div key={`e${i}`}/>)}
          {monthDays.map(({d,log})=>(
            <div key={d} style={{aspectRatio:'1',borderRadius:5,background:getAchievBg(log),border:`1.5px solid ${getAchievColor(log)}22`,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:1}}>
              <span style={{fontSize:9,fontWeight:600,color:log>0?getAchievColor(log):'#d1d5db'}}>{d}</span>
              {log>=100&&<span style={{fontSize:7,lineHeight:1}}>🔥</span>}
              {log>=50&&log<100&&<span style={{fontSize:7,lineHeight:1}}>💪</span>}
              {log>0&&log<50&&<span style={{fontSize:7,lineHeight:1}}>🌱</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 달성 분포 */}
      <div style={{background:C.card,borderRadius:18,padding:'16px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:12}}>🎯 달성 분포</div>
        {[
          {label:'🔥 완벽 (100%)',count:perfectDays,color:'#f97316',bg:'#fff7ed'},
          {label:'💪 노력 (50~99%)',count:effortDays,color:'#3b82f6',bg:'#eff6ff'},
          {label:'🌱 시작 (1~49%)',count:startDays,color:'#22c55e',bg:'#f0fdf4'},
          {label:'⬜ 기록없음',count:daysInMonth-activeDays,color:C.muted,bg:'#f9fafb'},
        ].map(s=>(
          <div key={s.label} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{fontSize:12,color:C.text2,width:130,flexShrink:0}}>{s.label}</span>
            <div style={{flex:1,height:14,background:C.card3,borderRadius:7,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${daysInMonth?s.count/daysInMonth*100:0}%`,background:s.color,borderRadius:7,transition:'width 0.6s ease'}}/>
            </div>
            <span style={{fontSize:12,fontWeight:700,color:s.color,width:24,textAlign:'right'}}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* 현재 스트릭 */}
      <div style={{background:`linear-gradient(135deg,${theme.primary},${theme.border})`,borderRadius:18,padding:'18px 20px',color:'#fff',marginBottom:14}}>
        <div style={{fontSize:12,opacity:0.85,marginBottom:4}}>현재 연속 달성 스트릭</div>
        <div style={{fontSize:32,fontWeight:800,marginBottom:2}}>🔥 {(streak||{count:0}).count}일</div>
        <div style={{fontSize:12,opacity:0.75}}>{streak?.lastDate ? `마지막 달성: ${streak.lastDate}` : '아직 달성 기록이 없어요'}</div>
      </div>

      {/* 등록된 루틴 */}
      {routines.length>0&&(
        <div style={{background:C.card,borderRadius:18,padding:'16px',border:`1.5px solid ${C.border}`}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>🌀 등록된 루틴 ({routines.length}개)</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {routines.map(r=>(
              <div key={r.id} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:10,background:C.card2}}>
                <span style={{fontSize:16}}>{r.emoji||'💧'}</span>
                <span style={{flex:1,fontSize:13,color:C.text2}}>{r.text}</span>
                <span style={{fontSize:10,color:C.muted,background:C.card3,padding:'2px 7px',borderRadius:20}}>{getRepeatLabel(r)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메모/일기 페이지
// ============================================================
