// ============================================================
// DiaryPage.js — 메모·일기 페이지
// ============================================================
function DiaryPage({fb, user}) {
  const theme = useTheme();
  const [memos, setMemos] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(getToday());
  const [content, setContent] = React.useState('');
  const [mood, setMood] = React.useState('😊');
  const [saving, setSaving] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('write'); // 'write' | 'list'

  const MOODS = ['😊','😄','😐','😔','😴','🔥','💪','🥺','😤','🌟'];

  React.useEffect(()=>{
    if(!fb||!user) return;
    const unsub = fb.onSnapshot(fb.collection(fb.db,'users',user.uid,'diaries'), snap=>{
      setMemos(snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>b.date.localeCompare(a.date)));
    });
    return ()=>unsub();
  },[fb,user]);

  // 날짜 바꾸면 기존 메모 불러오기
  React.useEffect(()=>{
    const existing = memos.find(m=>m.date===selectedDate);
    setContent(existing?.content||'');
    setMood(existing?.mood||'😊');
  },[selectedDate, memos]);

  async function saveMemo() {
    if(!fb||!user||!content.trim()) return;
    setSaving(true);
    const existing = memos.find(m=>m.date===selectedDate);
    if(existing) {
      await fb.updateDoc(fb.doc(fb.db,'users',user.uid,'diaries',existing.id), {content:content.trim(),mood,updatedAt:new Date().toISOString()});
    } else {
      await fb.addDoc(fb.collection(fb.db,'users',user.uid,'diaries'), {date:selectedDate,content:content.trim(),mood,createdAt:new Date().toISOString()});
    }
    setSaving(false);
  }

  async function deleteMemo(id) {
    if(!fb||!user) return;
    await fb.deleteDoc(fb.doc(fb.db,'users',user.uid,'diaries',id));
  }

  function dateLabel2(ds) {
    const d=new Date(ds+'T00:00:00');
    const days=['일','월','화','수','목','금','토'];
    return `${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  }

  const hasMemo = memos.some(m=>m.date===selectedDate);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18}}>
        <div>
          <div style={{fontSize:21,fontWeight:800,color:C.text,marginBottom:3}}>📔 하루 기록</div>
          <div style={{fontSize:13,color:C.muted}}>오늘을 기억해요 ✍️</div>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={()=>setViewMode('write')} style={{padding:'6px 12px',borderRadius:20,border:`1.5px solid ${viewMode==='write'?theme.primary:'#e5e7eb'}`,background:viewMode==='write'?theme.light:'#fff',color:viewMode==='write'?theme.primary:'#9ca3af',fontSize:12,fontWeight:700,cursor:'pointer',width:'auto',margin:0}}>✏️ 쓰기</button>
          <button onClick={()=>setViewMode('list')} style={{padding:'6px 12px',borderRadius:20,border:`1.5px solid ${viewMode==='list'?theme.primary:'#e5e7eb'}`,background:viewMode==='list'?theme.light:'#fff',color:viewMode==='list'?theme.primary:'#9ca3af',fontSize:12,fontWeight:700,cursor:'pointer',width:'auto',margin:0}}>📖 목록</button>
        </div>
      </div>

      {viewMode==='write'&&(
        <div>
          {/* 날짜 선택 */}
          <div style={{background:C.card,borderRadius:16,padding:'12px 16px',marginBottom:12,border:`1.5px solid ${C.border}`,display:'flex',alignItems:'center',gap:10}}>
            <input type="date" value={selectedDate} max={getToday()} onChange={e=>setSelectedDate(e.target.value)}
              style={{border:'none',background:'transparent',fontSize:14,fontWeight:700,color:C.text,outline:'none',cursor:'pointer'}}/>
            {hasMemo&&<span style={{fontSize:11,color:theme.primary,background:theme.light,padding:'2px 8px',borderRadius:20,fontWeight:700}}>기록 있음</span>}
          </div>

          {/* 기분 선택 */}
          <div style={{background:C.card,borderRadius:16,padding:'14px 16px',marginBottom:12,border:`1.5px solid ${C.border}`}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>오늘 기분은?</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {MOODS.map(m=>(
                <button key={m} onClick={()=>setMood(m)} style={{
                  width:38,height:38,borderRadius:10,fontSize:20,border:`2px solid ${mood===m?theme.primary:'#f3f4f6'}`,
                  background:mood===m?theme.light:C.card,cursor:'pointer',margin:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'
                }}>{m}</button>
              ))}
            </div>
          </div>

          {/* 텍스트 입력 */}
          <div style={{background:C.card,borderRadius:16,padding:'14px 16px',marginBottom:12,border:`1.5px solid ${C.border}`}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <span style={{fontSize:20}}>{mood}</span>
              <span style={{fontSize:13,fontWeight:700,color:C.text2}}>{dateLabel2(selectedDate)}</span>
            </div>
            <textarea value={content} onChange={e=>setContent(e.target.value)}
              placeholder="오늘 어땠나요? 자유롭게 기록해보세요 ✍️"
              rows={6}
              style={{width:'100%',border:'none',resize:'none',fontSize:14,color:C.text,lineHeight:1.7,outline:'none',background:'transparent',fontFamily:'inherit'}}
            />
          </div>

          <button onClick={saveMemo} disabled={saving||!content.trim()} style={{
            width:'100%',padding:'14px',borderRadius:14,border:'none',
            background:content.trim()?(saving?theme.mid:theme.primary):'#f3f4f6',
            color:content.trim()?'#fff':'#9ca3af',fontSize:15,fontWeight:700,cursor:content.trim()?'pointer':'default',marginBottom:10,
          }}>{saving?'저장 중...':'저장하기'}</button>
        </div>
      )}

      {viewMode==='list'&&(
        <div>
          {memos.length===0?(
            <div style={{background:C.card,borderRadius:16,padding:'40px',textAlign:'center',color:C.muted,border:`1.5px solid ${C.border}`}}>
              <div style={{fontSize:36,marginBottom:8}}>📔</div>
              <div style={{fontSize:14,fontWeight:600}}>아직 기록이 없어요</div>
            </div>
          ):memos.map(m=>(
            <div key={m.id} style={{background:C.card,borderRadius:16,padding:'16px',marginBottom:10,border:`1.5px solid ${C.border}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:18}}>{m.mood}</span>
                  <span style={{fontSize:13,fontWeight:700,color:C.text2}}>{dateLabel2(m.date)}</span>
                </div>
                <button onClick={()=>deleteMemo(m.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#d1d5db',fontSize:14,padding:0,width:'auto',margin:0}} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='#d1d5db'}>✕</button>
              </div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{m.content}</div>
              <button onClick={()=>{setSelectedDate(m.date);setViewMode('write');}} style={{marginTop:8,fontSize:11,color:theme.primary,background:'none',border:'none',cursor:'pointer',padding:0,fontWeight:600,width:'auto'}}>수정하기 →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 주간 미션 & 캐릭터 성장
// ============================================================

// 이번 주 월요일 날짜 구하기
function getWeekStart() {
  const today = new Date(); today.setHours(0,0,0,0);
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return monday.getFullYear()+'-'+String(monday.getMonth()+1).padStart(2,'0')+'-'+String(monday.getDate()).padStart(2,'0');
}

// 주간 미션 정의 — 매주 리셋
const WEEKLY_MISSIONS = [
  {
    id:'wm1', emoji:'🌅', title:'이번 주 3일 달성',
    desc:'월~일 중 3일 이상 루틴 1개 이상 완료',
    check:(weekLog, weekDates) => weekDates.filter(d => (weekLog[d]||0) > 0).length >= 3,
    xp: 30,
  },
  {
    id:'wm2', emoji:'🔥', title:'이번 주 5일 달성',
    desc:'월~일 중 5일 이상 루틴 1개 이상 완료',
    check:(weekLog, weekDates) => weekDates.filter(d => (weekLog[d]||0) > 0).length >= 5,
    xp: 60,
  },
  {
    id:'wm3', emoji:'💯', title:'완벽한 하루 1번',
    desc:'이번 주 달성률 100% 하루 이상',
    check:(weekLog, weekDates) => weekDates.some(d => (weekLog[d]||0) >= 100),
    xp: 40,
  },
  {
    id:'wm4', emoji:'🧹', title:'청소 항목 완료',
    desc:'이번 주 청소 항목 1개 이상 완료',
    check:(weekLog, weekDates, lifeItems) => lifeItems.filter(c=>c.section==='청소'&&weekDates.some(d=>c.lastDone===d)).length >= 1,
    xp: 25,
  },
  {
    id:'wm5', emoji:'🥗', title:'식재료 관리',
    desc:'이번 주 유통기한 내에 식재료 0개 폐기 (등록 기준)',
    check:(weekLog, weekDates, lifeItems, foods) => foods.filter(f=>calcDaysLeft(f.expiryDate)<0).length === 0 && foods.length > 0,
    xp: 35,
  },
  {
    id:'wm6', emoji:'📔', title:'하루기록 작성',
    desc:'이번 주 하루기록(일기) 1건 이상 작성',
    check:(weekLog, weekDates, lifeItems, foods, diaries) => (diaries||[]).some(d=>weekDates.includes(d.date)),
    xp: 20,
  },
];

// 캐릭터 성장 단계 (스트릭 기반)

