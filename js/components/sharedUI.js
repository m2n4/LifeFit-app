// ============================================================
// sharedUI.js — 공통 UI 컴포넌트: Modal, Btn, CircleGauge, RepeatPicker + 전역 Context/훅
// ============================================================
// SHARED UI
// ============================================================
const inp=(extra={})=>({width:'100%',padding:'10px 13px',border:`1.5px solid ${C.border2}`,borderRadius:11,fontSize:14,outline:'none',background:C.input,color:C.text,boxSizing:'border-box',...extra});

function Modal({title,sub,onClose,children,maxWidth=380}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:C.card,borderRadius:24,padding:'24px 22px',width:'100%',maxWidth,boxShadow:'0 24px 64px rgba(0,0,0,0.18)',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:C.text}}>{title}</div>
            {sub&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:'50%',border:`1.5px solid ${C.border2}`,background:C.card2,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.text3,fontSize:15,padding:0,margin:0,flexShrink:0}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Btn({onClick,children,variant='primary',size='md',style:s={}}) {
  const theme=useTheme();
  const base={border:'none',borderRadius:12,fontWeight:700,cursor:'pointer',transition:'all 0.15s',margin:0};
  const vars={
    primary:{background:theme.primary,color:C.card},
    green:{background:'#16a34a',color:'#fff'},
    outline:{background:C.card,color:theme.primary,border:`1.5px solid ${theme.mid}`},
    ghost:{background:'transparent',color:theme.primary,border:`2px dashed ${theme.border}`},
    danger:{background:'#fef2f2',color:'#ef4444',border:'1px solid #fecaca'},
  };
  const sizes={sm:{padding:'6px 12px',fontSize:12},md:{padding:'11px 18px',fontSize:14},lg:{padding:'14px',fontSize:14,width:'100%'}};
  return <button onClick={onClick} style={{...base,...vars[variant],...sizes[size],...s}}>{children}</button>;
}

function CircleGauge({pct,size=80,color='#7c3aed',label,sub}) {
  const r=(size-10)/2, circ=2*Math.PI*r, dash=circ*(pct/100);
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
      <div style={{position:'relative',width:size,height:size}}>
        <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={8}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{transition:'stroke-dasharray 0.6s ease'}}/>
        </svg>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:size>70?15:12,fontWeight:800,color:C.text}}>{pct}%</span>
        </div>
      </div>
      {label&&<div style={{fontSize:12,fontWeight:700,color:C.text2}}>{label}</div>}
      {sub&&<div style={{fontSize:11,color:C.muted}}>{sub}</div>}
    </div>
  );
}

function RepeatPicker({form,setForm}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:2}}>반복 설정</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))',gap:5}}>
        {REPEAT_TYPES.map(t=>(
          <button key={t.value} onClick={()=>setForm(p=>({...p,freq:t.value}))} style={{
            padding:'7px 5px',borderRadius:9,fontSize:11,fontWeight:form.freq===t.value?700:500,
            border:`1.5px solid ${form.freq===t.value?'#7c3aed':'#e5e7eb'}`,
            background:form.freq===t.value?'#ede9fe':'#fff',
            color:form.freq===t.value?'#7c3aed':'#6b7280',cursor:'pointer',width:'auto',margin:0,textAlign:'center',
          }}>{t.label}</button>
        ))}
      </div>
      {form.freq==='weekly'&&(
        <div>
          <div style={{fontSize:11,color:C.muted,marginBottom:5}}>요일 선택</div>
          <div style={{display:'flex',gap:5}}>
            {DAY_KR.map((d,i)=>{
              const sel=(form.freqDays||[]).includes(i);
              return <button key={i} onClick={()=>setForm(p=>({...p,freqDays:sel?p.freqDays.filter(x=>x!==i):[...(p.freqDays||[]),i]}))} style={{width:32,height:32,borderRadius:'50%',fontSize:11,fontWeight:700,border:`1.5px solid ${sel?'#7c3aed':'#e5e7eb'}`,background:sel?'#7c3aed':'#fff',color:sel?'#fff':i===0?'#ef4444':i===6?'#3b82f6':'#374151',cursor:'pointer',padding:0,margin:0,minWidth:32,display:'flex',alignItems:'center',justifyContent:'center'}}>{d}</button>;
            })}
          </div>
        </div>
      )}
      {form.freq==='interval'&&(
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:12,color:C.muted,whiteSpace:'nowrap'}}>매</span>
          <input type="number" min={1} max={90} value={form.intervalDays||2} onChange={e=>setForm(p=>({...p,intervalDays:Number(e.target.value)}))} style={{...inp(),width:80,textAlign:'center'}}/>
          <span style={{fontSize:12,color:C.muted,whiteSpace:'nowrap'}}>일마다</span>
        </div>
      )}
      {form.freq==='monthly'&&(
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:12,color:C.muted,whiteSpace:'nowrap'}}>매월</span>
          <input type="number" min={1} max={31} value={form.monthDay||1} onChange={e=>setForm(p=>({...p,monthDay:Number(e.target.value)}))} style={{...inp(),width:80,textAlign:'center'}}/>
          <span style={{fontSize:12,color:C.muted,whiteSpace:'nowrap'}}>일</span>
        </div>
      )}
      <div style={{fontSize:11,color:'#7c3aed',background:'#f5f3ff',padding:'6px 10px',borderRadius:8,border:'1px solid #ede9fe',fontWeight:600}}>
        🔄 {getRepeatLabel(form)}
      </div>
    </div>
  );
}

// ============================================================
