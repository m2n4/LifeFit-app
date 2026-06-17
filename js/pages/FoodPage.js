// ============================================================
// FoodPage.js — 식재료 관리 페이지 (냉장고 현황 + 장보기 탭 포함)
// ============================================================
// FOOD PAGE
// ============================================================
function DateModal({food,onConfirm,onClose}) {
  const def=(()=>{const d=new Date();d.setDate(d.getDate()+(food?.days||7));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})();
  const [date,setDate]=React.useState(def);
  return (
    <Modal title={`${food?.emoji} ${food?.name} 추가`} sub="유통기한을 선택해 주세요" onClose={onClose}>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <input type="date" value={date} min={getToday()} onChange={e=>setDate(e.target.value)} style={inp()}/>
        <div style={{display:'flex',gap:8}}>
          <Btn onClick={()=>onConfirm(date)} style={{flex:1}}>추가하기</Btn>
          <Btn onClick={onClose} variant="outline" style={{flex:1}}>취소</Btn>
        </div>
      </div>
    </Modal>
  );
}

function FoodFormFields({form,setForm}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:11}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 64px',gap:7}}>
        <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>이름</div><input placeholder="식재료 이름" value={form.name||''} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={inp()} autoFocus/></div>
        <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>이모지</div><input placeholder="🍽️" value={form.emoji||''} onChange={e=>setForm(p=>({...p,emoji:e.target.value}))} maxLength={2} style={inp({textAlign:'center',fontSize:20})}/></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
        <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>보관</div>
          <select value={form.storage||'냉장'} onChange={e=>setForm(p=>({...p,storage:e.target.value}))} style={inp()}>
            <option value="냉장">🧊 냉장</option><option value="냉동">❄️ 냉동</option><option value="상온">🌡️ 상온</option>
          </select>
        </div>
        <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>구매일</div><input type="date" value={form.purchaseDate||getToday()} onChange={e=>setForm(p=>({...p,purchaseDate:e.target.value}))} style={inp()}/></div>
      </div>
      <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>유통기한 *</div><input type="date" value={form.expiryDate||''} onChange={e=>setForm(p=>({...p,expiryDate:e.target.value}))} style={inp()}/></div>
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'8px 11px',background:'#fdf4ff',borderRadius:9,border:'1px solid #e9d5ff'}}>
        <span style={{fontSize:13}}>💡</span>
        <span style={{fontSize:11,color:'#7e22ce',lineHeight:1.55}}>일반적인 보관 기준으로 유통기한이 자동 설정돼요. <span style={{fontWeight:700}}>제품 표기를 꼭 확인</span>하세요.</span>
      </div>
    </div>
  );
}

function FoodPage({foods,onAdd,onDelete,onEdit,fb,user}) {
  const theme=useTheme();
  const [activeCat,setActiveCat]=React.useState('과일');
  const [filterStorage,setFilterStorage]=React.useState('전체');
  const [pending,setPending]=React.useState(null);
  const [editTarget,setEditTarget]=React.useState(null);
  const [showAdd,setShowAdd]=React.useState(false);
  const [addForm,setAddForm]=React.useState({name:'',emoji:'',storage:'냉장',expiryDate:'',purchaseDate:getToday()});
  const [editForm,setEditForm]=React.useState({});
  const [search,setSearch]=React.useState('');
  const [quickList,setQuickList]=React.useState(QUICK_FOOD);
  const [showQuickEdit,setShowQuickEdit]=React.useState(false);
  const [editingQuick,setEditingQuick]=React.useState(null);
  const [quickForm,setQuickForm]=React.useState({});
  const [foodTab, setFoodTab] = React.useState('fridge'); // 'fridge' | 'shop'


  const SICONS={냉장:'🧊',냉동:'❄️',상온:'🌡️'};
  const withStatus=foods.map(f=>({...f,dl:calcDaysLeft(f.expiryDate),status:getFoodStatus(calcDaysLeft(f.expiryDate))})).sort((a,b)=>a.dl-b.dl);
  const filtered=withStatus.filter(f=>{
    if(filterStorage!=='전체'&&f.storage!==filterStorage)return false;
    if(search&&!f.name.includes(search))return false;
    return true;
  });
  const alreadyAdded=(name,cat)=>foods.some(f=>f.name===name&&f.category===cat);

  return (
    <div>
      {/* ── 헤더 ── */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14}}>
        <div>
          <div style={{fontSize:21,fontWeight:800,color:C.text,marginBottom:3}}>🥕 식재료</div>
          <div style={{fontSize:13,color:C.muted}}>{foodTab==='fridge'?'유통기한을 한눈에 확인하세요':'필요한 것들을 미리 정리해요'}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <PageHelp pageId="food"/>
          {foodTab==='fridge'&&<Btn onClick={()=>{setAddForm({name:'',emoji:'',storage:'냉장',expiryDate:'',purchaseDate:getToday()});setShowAdd(true);}}>+ 추가</Btn>}
        </div>
      </div>

      {/* ── 탭 ── */}
      <div style={{display:'flex',gap:6,marginBottom:16}}>
        {[{id:'fridge',emoji:'🧊',label:'냉장고 현황'},{id:'shop',emoji:'🛒',label:'장보기 목록'}].map(t=>(
          <button key={t.id} onClick={()=>setFoodTab(t.id)} style={{
            flex:1,padding:'10px 8px',borderRadius:14,border:`2px solid ${foodTab===t.id?theme.primary:theme.mid}`,
            background:foodTab===t.id?theme.primary:theme.bg,
            cursor:'pointer',width:'auto',margin:0,transition:'all 0.15s',
            display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            boxShadow:foodTab===t.id?`0 3px 12px ${theme.primary}44`:'none',
          }}>
            <span style={{fontSize:18}}>{t.emoji}</span>
            <span style={{fontSize:13,fontWeight:700,color:foodTab===t.id?'#fff':theme.primary}}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── 장보기 탭 ── */}
      {foodTab==='shop'&&<ShoppingPage foods={foods} fb={fb} user={user}/>}

      {/* ── 냉장고 탭 ── */}
      {foodTab==='fridge'&&<div>

      <div style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',background:'linear-gradient(135deg,#fdf4ff,#ede9fe)',borderRadius:13,border:'1.5px solid #d8b4fe',marginBottom:16}}>
        <span style={{fontSize:17}}>💡</span>
        <div><div style={{fontSize:12,fontWeight:700,color:'#6d28d9',marginBottom:1}}>유통기한 자동 설정 안내</div><div style={{fontSize:11,color:'#7c3aed'}}>일반적인 보관 기준으로 자동 설정돼요. <span style={{fontWeight:700}}>제품 표기를 꼭 확인</span>하세요.</div></div>
      </div>

      {/* 현황 */}
      <div style={{background:C.card,borderRadius:18,padding:'17px 19px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,flexWrap:'wrap',gap:7}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>냉장고 현황 <span style={{fontSize:12,color:C.muted,fontWeight:400}}>({foods.length}개)</span></div>
          <input type="text" placeholder="검색..." value={search} onChange={e=>setSearch(e.target.value)} style={inp({width:120,padding:'6px 10px',fontSize:12,borderRadius:20})}/>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
          {['전체','냉장','냉동','상온'].map(c=><button key={c} onClick={()=>setFilterStorage(c)} style={{padding:'4px 13px',borderRadius:20,border:'none',background:filterStorage===c?theme.primary:'#f3f4f6',color:filterStorage===c?'#fff':'#6b7280',fontSize:12,fontWeight:filterStorage===c?700:500,cursor:'pointer',width:'auto',margin:0}}>{c}</button>)}
        </div>
        {/* 색상 범례 */}
        <div style={{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:11,color:C.muted,fontWeight:600}}>색상</span>
          {[{color:'#22c55e',bg:'#f0fdf4',border:'#bbf7d0',label:'여유'},{color:'#eab308',bg:'#fefce8',border:'#fef08a',label:'주의'},{color:'#f97316',bg:'#fff7ed',border:'#fed7aa',label:'임박'},{color:'#ef4444',bg:'#fef2f2',border:'#fecaca',label:'위험'}].map(s=>(
            <div key={s.label} style={{display:'flex',alignItems:'center',gap:4}}><div style={{width:9,height:9,borderRadius:2,background:s.bg,border:`1.5px solid ${s.border}`}}/><span style={{fontSize:11,color:s.color,fontWeight:600}}>{s.label}</span></div>
          ))}
        </div>
        {filtered.length===0?<div style={{textAlign:'center',padding:'22px 0',color:C.muted,fontSize:13}}><div style={{fontSize:28,marginBottom:6}}>📭</div>식재료가 없어요!</div>:(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7}}>
            {filtered.map(f=>(
              <div key={f.id} style={{background:f.status.bg,border:`1.5px solid ${f.status.border}`,borderRadius:12,padding:'9px 10px',display:'flex',flexDirection:'column',gap:2,position:'relative'}}>
                <button onClick={()=>onDelete(f.id)} style={{position:'absolute',top:6,right:6,background:'none',border:'none',cursor:'pointer',color:'#d1d5db',fontSize:11,padding:2,width:'auto',margin:0,lineHeight:1}} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='#d1d5db'}>✕</button>
                <div style={{fontSize:18,marginBottom:1}}>{f.emoji}</div>
                <div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.3,paddingRight:14}}>{f.name}</div>
                <div style={{fontSize:10,color:C.muted}}>{SICONS[f.storage]} {f.storage}</div>
                <div style={{marginTop:3,fontSize:10,fontWeight:700,color:f.status.color,background:C.card,padding:'1px 6px',borderRadius:20,border:`1px solid ${f.status.border}`,display:'inline-block',width:'fit-content'}}>{f.status.label}</div>
                <button onClick={()=>{setEditTarget(f);setEditForm({name:f.name,emoji:f.emoji,storage:f.storage||'냉장',expiryDate:f.expiryDate,purchaseDate:f.purchaseDate});}} style={{marginTop:2,padding:'3px',borderRadius:6,border:`1px solid ${C.border2}`,background:C.card,color:C.text3,fontSize:10,cursor:'pointer',width:'100%'}}>수정</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 자주 추가 */}
      <div style={{background:C.card,borderRadius:18,padding:'17px 19px',border:`1.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>⭐ 자주 추가하는 식재료</div>
          <button onClick={()=>setShowQuickEdit(!showQuickEdit)} style={{fontSize:11,fontWeight:700,padding:'4px 11px',borderRadius:20,border:`1.5px solid ${showQuickEdit?'#7c3aed':'#e5e7eb'}`,background:showQuickEdit?'#ede9fe':'#fff',color:showQuickEdit?'#7c3aed':'#9ca3af',cursor:'pointer',width:'auto',margin:0}}>{showQuickEdit?'완료':'편집'}</button>
        </div>
        <div style={{fontSize:12,color:C.muted,marginBottom:11}}>탭 하면 바로 추가돼요</div>
        {showQuickEdit?(
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {quickList.map((p,idx)=>(
              <div key={idx} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 10px',borderRadius:10,background:C.input,border:`1.5px solid ${C.border}`}}>
                {editingQuick===idx?(
                  <div style={{flex:1,display:'grid',gridTemplateColumns:'42px 1fr 74px 50px',gap:5,alignItems:'center'}}>
                    <input value={quickForm.emoji||''} onChange={e=>setQuickForm(p=>({...p,emoji:e.target.value}))} maxLength={2} style={inp({padding:'5px',textAlign:'center',fontSize:17,background:C.card})}/>
                    <input value={quickForm.name||''} onChange={e=>setQuickForm(p=>({...p,name:e.target.value}))} style={inp({padding:'6px 9px',background:C.card})}/>
                    <select value={quickForm.category||'냉장'} onChange={e=>setQuickForm(p=>({...p,category:e.target.value}))} style={inp({padding:'6px 4px',background:C.card,fontSize:11})}>
                      <option value="냉장">🧊냉장</option><option value="냉동">❄️냉동</option><option value="상온">🌡️상온</option>
                    </select>
                    <button onClick={()=>{const n=[...quickList];n[idx]={...quickForm};setQuickList(n);setEditingQuick(null);}} style={{padding:'6px',borderRadius:7,border:'none',background:'#7c3aed',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer',width:'auto',margin:0}}>저장</button>
                  </div>
                ):(
                  <><span style={{fontSize:17}}>{p.emoji}</span><span style={{flex:1,fontSize:13,fontWeight:600,color:C.text2}}>{p.name}</span>
                  <span style={{fontSize:10,color:C.muted,background:C.card3,padding:'1px 6px',borderRadius:20}}>{p.category}</span>
                  <button onClick={()=>{setEditingQuick(idx);setQuickForm({...p});}} style={{padding:'3px 8px',borderRadius:7,border:`1px solid ${C.border2}`,background:C.card,color:C.text3,fontSize:11,cursor:'pointer',width:'auto',margin:0}}>수정</button>
                  <button onClick={()=>setQuickList(quickList.filter((_,i)=>i!==idx))} style={{padding:'3px 6px',borderRadius:7,border:'none',background:'none',color:'#d1d5db',fontSize:13,cursor:'pointer',width:'auto',margin:0}} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='#d1d5db'}>✕</button></>
                )}
              </div>
            ))}
            <Btn variant="ghost" size="sm" onClick={()=>{setQuickList([...quickList,{emoji:'🍽️',name:'새 항목',category:'냉장',days:7}]);setEditingQuick(quickList.length);setQuickForm({emoji:'🍽️',name:'새 항목',category:'냉장',days:7});}}>+ 항목 추가</Btn>
          </div>
        ):(
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {quickList.map((p,idx)=>{
              const added=alreadyAdded(p.name,p.category);
              return <button key={idx} onClick={()=>!added&&setPending({...p})} style={{display:'flex',alignItems:'center',gap:5,padding:'6px 13px',borderRadius:30,border:`1.5px solid ${added?'#7c3aed':'#e5e7eb'}`,background:added?'#ede9fe':'#fff',color:added?'#7c3aed':'#374151',fontSize:13,fontWeight:500,cursor:added?'default':'pointer',width:'auto',margin:0}}>
                <span style={{fontSize:14}}>{p.emoji}</span>{p.name}{added&&<span style={{fontSize:10}}>✓</span>}
              </button>;
            })}
          </div>
        )}
      </div>

      {/* 카테고리별 */}
      <div style={{background:C.card,borderRadius:18,padding:'17px 19px',border:`1.5px solid ${C.border}`}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:12}}>📂 카테고리별 추가</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(76px,1fr))',gap:6,marginBottom:12}}>
          {Object.keys(CAT_THEME).map(c=>{
            const t=CAT_THEME[c],isA=activeCat===c;
            return <button key={c} onClick={()=>setActiveCat(c)} style={{padding:'10px 4px',borderRadius:12,border:`2px solid ${isA?t.accent:t.border}`,background:isA?t.bg:'#fafafa',cursor:'pointer',width:'auto',margin:0,textAlign:'center',transition:'all 0.15s'}} onMouseEnter={e=>{if(!isA){e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.background=t.bg;}}} onMouseLeave={e=>{if(!isA){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background='#fafafa';}}}>
              <div style={{fontSize:17,marginBottom:2}}>{t.icon}</div>
              <div style={{fontSize:11,fontWeight:700,color:isA?t.accent:C.text2,lineHeight:1.2}}>{c}</div>
            </button>;
          })}
        </div>
        <div style={{background:CAT_THEME[activeCat].bg,borderRadius:12,padding:'12px',border:`1px solid ${CAT_THEME[activeCat].border}`}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:7}}>
            {(FOOD_PRESETS[activeCat]||[]).map(p=>{
              const added=alreadyAdded(p.name,activeCat);
              return <button key={p.name} onClick={()=>!added&&setPending({...p,category:activeCat})} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'11px 5px',borderRadius:12,border:`1.5px solid ${added?CAT_THEME[activeCat].accent:'#e5e7eb'}`,background:added?`${CAT_THEME[activeCat].accent}18`:C.card,cursor:added?'default':'pointer',position:'relative',width:'auto',margin:0,transition:'all 0.15s'}} onMouseEnter={e=>{if(!added){e.currentTarget.style.borderColor=CAT_THEME[activeCat].accent;e.currentTarget.style.background=`${CAT_THEME[activeCat].accent}0d`;}}} onMouseLeave={e=>{if(!added){e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.background='#fff';}}}>
                {added&&<div style={{position:'absolute',top:4,right:4,width:13,height:13,borderRadius:'50%',background:CAT_THEME[activeCat].accent,color:C.card,fontSize:8,display:'flex',alignItems:'center',justifyContent:'center'}}>✓</div>}
                <span style={{fontSize:22}}>{p.emoji}</span>
                <span style={{fontSize:11,fontWeight:600,color:added?CAT_THEME[activeCat].accent:C.text2,textAlign:'center'}}>{p.name}</span>
                <div style={{display:'flex',gap:2,alignItems:'center'}}>
                  <span style={{fontSize:9,color:C.muted}}>{p.days}일</span>
                  <span style={{fontSize:9,fontWeight:700,padding:'1px 4px',borderRadius:5,color:p.storage==='냉장'?'#2563eb':p.storage==='냉동'?'#0891b2':'#d97706',background:p.storage==='냉장'?'#dbeafe':p.storage==='냉동'?'#cffafe':'#fef3c7'}}>{p.storage}</span>
                </div>
              </button>;
            })}
          </div>
        </div>
      </div>

      {pending&&<DateModal food={pending} onConfirm={date=>{onAdd({id:Date.now(),emoji:pending.emoji,name:pending.name,category:pending.category,storage:pending.storage||'냉장',expiryDate:date,purchaseDate:getToday()});setPending(null);}} onClose={()=>setPending(null)}/>}
      {showAdd&&(
        <Modal title="✏️ 직접 추가" onClose={()=>setShowAdd(false)}>
          <FoodFormFields form={addForm} setForm={setAddForm}/>
          <div style={{display:'flex',gap:8,marginTop:14}}>
            <Btn onClick={()=>{if(!addForm.name.trim()||!addForm.expiryDate)return;onAdd({id:Date.now(),...addForm,emoji:addForm.emoji||'🍽️'});setShowAdd(false);}} style={{flex:1}}>추가하기</Btn>
            <Btn onClick={()=>setShowAdd(false)} variant="outline" style={{flex:1}}>취소</Btn>
          </div>
        </Modal>
      )}
      {editTarget&&(
        <Modal title={`${editTarget.emoji} ${editTarget.name} 수정`} sub="식재료 수정" onClose={()=>setEditTarget(null)}>
          <FoodFormFields form={editForm} setForm={setEditForm}/>
          <div style={{display:'flex',gap:8,marginTop:14}}>
            <Btn onClick={()=>{if(!editForm.name.trim()||!editForm.expiryDate)return;onEdit(editTarget.id,{...editForm,emoji:editForm.emoji||'🍽️'});setEditTarget(null);}} style={{flex:1}}>수정하기</Btn>
            <Btn onClick={()=>setEditTarget(null)} variant="outline" style={{flex:1}}>취소</Btn>
          </div>
        </Modal>
      )}
      </div>} {/* end fridge tab */}
    </div>
  );
}


// ============================================================
