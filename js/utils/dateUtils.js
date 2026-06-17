// ============================================================
// dateUtils.js — 날짜·상태 관련 순수 유틸리티 함수
// ============================================================

function useLocalStorage(key, init) {
  const [val, setVal] = React.useState(() => {
    try { const s=localStorage.getItem(key); return s?JSON.parse(s):init; } catch { return init; }
  });
  React.useEffect(() => { try { localStorage.setItem(key,JSON.stringify(val)); } catch{} }, [key,val]);
  return [val, setVal];
}

function calcDaysLeft(d) {
  const t=new Date(); t.setHours(0,0,0,0);
  const e=new Date(d); e.setHours(0,0,0,0);
  return Math.ceil((e-t)/(864e5));
}

function getFoodStatus(dl) {
  if(dl<0)  return {label:'기간 초과',color:'#ef4444',bg:'#fef2f2',border:'#fecaca'};
  if(dl===0)return {label:'오늘 마감',color:'#ef4444',bg:'#fef2f2',border:'#fecaca'};
  if(dl<=3) return {label:`D-${dl}`,color:'#f97316',bg:'#fff7ed',border:'#fed7aa'};
  if(dl<=7) return {label:`D-${dl}`,color:'#eab308',bg:'#fefce8',border:'#fef08a'};
  return      {label:`D-${dl}`,color:'#22c55e',bg:'#f0fdf4',border:'#bbf7d0'};
}

function getToday() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function todayLabel() {
  const d=new Date(), days=['일','월','화','수','목','금','토'];
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} (${days[d.getDay()]})`;
}

function daysSince(s) {
  if(!s) return null;
  const t=new Date(); t.setHours(0,0,0,0);
  const d=new Date(s); d.setHours(0,0,0,0);
  return Math.floor((t-d)/(864e5));
}

function addDays(s,n) {
  const d=new Date(s+'T00:00:00'); d.setDate(d.getDate()+n);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function dateStrToObj(s) { return new Date(s+'T00:00:00'); }

function getWeekDates() {
  const today = new Date(); today.setHours(0,0,0,0);
  const dow = today.getDay();
  return Array.from({length:7}, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - dow + i);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  });
}
