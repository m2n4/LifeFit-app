// ============================================================
// repeatUtils.js — 달성 레벨, 반복 주기 관련 유틸리티
// ============================================================

// ── 달성 레벨 (3단계) ──
function getAchievLevel(done, total) {
  if(total === 0) return null;
  if(done === total) return {level:'perfect', emoji:'🔥', label:'완벽', cardBg:'linear-gradient(135deg,#fff7ed,#ffedd5)', gaugeBg:'#fed7aa', gaugeStroke:'#f97316', badgeBg:'#fff7ed', badgeColor:'#ea580c', badgeBorder:'#fed7aa'};
  if(done / total >= 0.5) return {level:'effort', emoji:'💪', label:'노력', cardBg:'linear-gradient(135deg,#eff6ff,#dbeafe)', gaugeBg:'#bfdbfe', gaugeStroke:'#3b82f6', badgeBg:'#eff6ff', badgeColor:'#2563eb', badgeBorder:'#bfdbfe'};
  if(done >= 1) return {level:'start', emoji:'🌱', label:'시작', cardBg:'linear-gradient(135deg,#f0fdf4,#dcfce7)', gaugeBg:'#bbf7d0', gaugeStroke:'#22c55e', badgeBg:'#f0fdf4', badgeColor:'#16a34a', badgeBorder:'#bbf7d0'};
  return null;
}

// ── 반복 유형 상수 ──
const REPEAT_TYPES=[
  {value:'daily',label:'매일'},
  {value:'weekdays',label:'평일마다'},
  {value:'weekend',label:'주말마다'},
  {value:'weekly',label:'매주 특정 요일'},
  {value:'interval',label:'N일마다'},
  {value:'monthly',label:'매월 특정 날'},
  {value:'none',label:'한 번만'},
];
const DAY_KR=['일','월','화','수','목','금','토'];

function getRepeatLabel(r) {
  if(!r) return '';
  if(r.freq==='daily')    return '매일';
  if(r.freq==='weekdays') return '평일 (월~금)';
  if(r.freq==='weekend')  return '주말 (토·일)';
  if(r.freq==='weekly')   return r.freqDays?.length?`매주 ${r.freqDays.map(d=>DAY_KR[d]).join('·')}요일`:'매주';
  if(r.freq==='interval') return r.intervalDays?`${r.intervalDays}일마다`:'N일마다';
  if(r.freq==='monthly')  return r.monthDay?`매월 ${r.monthDay}일`:'매월';
  return '한 번만';
}

function isTodayItem(r, dateStr) {
  const ref = dateStr ? new Date(dateStr+'T00:00:00') : new Date();
  ref.setHours(0,0,0,0);

  // 루틴이 추가된 날(createdAt) 이전 날짜에는 표시하지 않음
  if(r.createdAt) {
    const created = new Date(r.createdAt); created.setHours(0,0,0,0);
    if(ref < created) return false;
  }

  const d = ref.getDay();
  if(r.freq==='daily')    return true;
  if(r.freq==='weekdays') return d>=1&&d<=5;
  if(r.freq==='weekend')  return d===0||d===6;
  if(r.freq==='weekly')   return (r.freqDays||[]).includes(d);
  if(r.freq==='interval') {
    if(!r.createdAt||!r.intervalDays) return false;
    const c=new Date(r.createdAt); c.setHours(0,0,0,0);
    return Math.floor((ref-c)/864e5)%r.intervalDays===0;
  }
  if(r.freq==='monthly') return ref.getDate()===(r.monthDay||1);
  return true;
}

// 날짜 기반 완료 여부 — lastDone 날짜로만 판단
function isDoneOn(item, dateStr) {
  return item.lastDone === dateStr;
}

// 생활/청소 항목이 해당 날짜 기준으로 "할 때가 됐는지"
function isDueOn(item, viewDate) {
  if(item.section === '루틴') return isTodayItem(item, viewDate);
  if(!item.lastDone) return true;
  const sinceMs = new Date(viewDate+'T00:00:00') - new Date(item.lastDone+'T00:00:00');
  const sinceDays = Math.floor(sinceMs / 864e5);
  return sinceDays >= (item.intervalDays || 7);
}

function getNextItemDate(r) {
  const today=new Date(); today.setHours(0,0,0,0);
  const d=today.getDay();
  if(isTodayItem(r)) return null;
  if(r.freq==='weekdays') { const n=new Date(today); n.setDate(today.getDate()+(d===0?1:2)); return n; }
  if(r.freq==='weekend')  { const n=new Date(today); n.setDate(today.getDate()+(6-d||7)); return n; }
  if(r.freq==='weekly'&&r.freqDays?.length) {
    let min=7;
    r.freqDays.forEach(fd=>{ let diff=fd-d; if(diff<=0)diff+=7; if(diff<min)min=diff; });
    const n=new Date(today); n.setDate(today.getDate()+min); return n;
  }
  if(r.freq==='interval'&&r.intervalDays) {
    const c=new Date(r.createdAt||today); c.setHours(0,0,0,0);
    const diff=Math.floor((today-c)/864e5);
    const rem=r.intervalDays-(diff%r.intervalDays);
    const n=new Date(today); n.setDate(today.getDate()+rem); return n;
  }
  if(r.freq==='monthly'&&r.monthDay) {
    const n=new Date(today); n.setDate(r.monthDay);
    if(n<=today) n.setMonth(n.getMonth()+1); return n;
  }
  return null;
}

function formatNextDate(nd) {
  if(!nd) return null;
  const today=new Date(); today.setHours(0,0,0,0);
  const diff=Math.ceil((nd-today)/864e5);
  if(diff===1) return '내일';
  if(diff===2) return '모레';
  if(diff<=7)  return `${diff}일 후`;
  return `${nd.getMonth()+1}/${nd.getDate()}`;
}
