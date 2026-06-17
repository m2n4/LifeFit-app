// ============================================================
// ShoppingPage.js — 장보기 목록 페이지
// ============================================================
function ShoppingPage({foods, fb, user}) {
  const theme = useTheme();
  const [items, setItems] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [category, setCategory] = React.useState('기타');
  const [filterDone, setFilterDone] = React.useState(false);

  // Firestore 실시간
  React.useEffect(() => {
    if(!fb||!user) return;
    const unsub = fb.onSnapshot(fb.collection(fb.db,'users',user.uid,'shoppingItems'), snap => {
      setItems(snap.docs.map(d => ({...d.data(), id:d.id})));
    });
    return () => unsub();
  }, [fb, user]);

  async function addItem() {
    if(!input.trim()||!fb||!user) return;
    await fb.addDoc(fb.collection(fb.db,'users',user.uid,'shoppingItems'), {
      text: input.trim(), category, done: false, createdAt: new Date().toISOString()
    });
    setInput('');
  }
  async function toggleItem(id, done) {
    if(!fb||!user) return;
    await fb.updateDoc(fb.doc(fb.db,'users',user.uid,'shoppingItems',id), {done:!done});
  }
  async function deleteItem(id) {
    if(!fb||!user) return;
    await fb.deleteDoc(fb.doc(fb.db,'users',user.uid,'shoppingItems',id));
  }
  async function clearDone() {
    if(!fb||!user) return;
    const done = items.filter(i=>i.done);
    await Promise.all(done.map(i => fb.deleteDoc(fb.doc(fb.db,'users',user.uid,'shoppingItems',i.id))));
  }

  // 임박 식재료 → 자동 제안
  const suggestions = foods
    .map(f=>({...f, dl:calcDaysLeft(f.expiryDate)}))
    .filter(f=>f.dl<=2&&f.dl>=0)
    .filter(f=>!items.some(i=>i.text.includes(f.name)));

  const undone = items.filter(i=>!i.done).sort((a,b)=>SHOP_CATEGORIES.indexOf(a.category)-SHOP_CATEGORIES.indexOf(b.category));
  const done = items.filter(i=>i.done);
  const byCategory = SHOP_CATEGORIES.map(cat=>({cat, items: undone.filter(i=>i.category===cat)})).filter(g=>g.items.length>0);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18}}>
        <div>
          <div style={{fontSize:21,fontWeight:800,color:C.text,marginBottom:3}}>🛒 장보기 목록</div>
          <div style={{fontSize:13,color:C.muted}}>필요한 것들을 미리 정리해요</div>
        </div>
        {done.length>0&&<button onClick={clearDone} style={{fontSize:12,color:C.muted,background:'none',border:'none',cursor:'pointer',fontWeight:600,width:'auto',margin:0}}>완료 항목 삭제</button>}
      </div>

      {/* 임박 식재료 자동 제안 */}
      {suggestions.length>0&&(
        <div style={{background:'linear-gradient(135deg,#fff7ed,#ffedd5)',borderRadius:16,padding:'14px 16px',marginBottom:14,border:'1.5px solid #fed7aa'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#ea580c',marginBottom:8}}>🔔 곧 떨어질 것들이에요</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {suggestions.map(f=>(
              <button key={f.id} onClick={async()=>{
                if(!fb||!user) return;
                await fb.addDoc(fb.collection(fb.db,'users',user.uid,'shoppingItems'), {
                  text:f.name, category:'기타', done:false, createdAt:new Date().toISOString(), emoji:f.emoji
                });
              }} style={{display:'flex',alignItems:'center',gap:4,padding:'5px 11px',borderRadius:20,border:'1.5px solid #fed7aa',background:C.card,cursor:'pointer',fontSize:12,fontWeight:600,color:'#ea580c',width:'auto',margin:0}}>
                {f.emoji} {f.name} <span style={{fontSize:10,opacity:0.7}}>D-{f.dl}</span> +
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 */}
      <div style={{background:C.card,borderRadius:16,padding:'14px 16px',marginBottom:14,border:`1.5px solid ${C.border}`}}>
        <div style={{display:'flex',gap:7,marginBottom:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&addItem()}
            placeholder="항목 입력 후 Enter"
            style={{flex:1,padding:'10px 13px',border:`1.5px solid ${theme.mid}`,borderRadius:11,fontSize:14,outline:'none',background:C.input}}
            onFocus={e=>e.target.style.borderColor=theme.primary}
            onBlur={e=>e.target.style.borderColor=theme.mid}
          />
          <button onClick={addItem} style={{padding:'10px 16px',borderRadius:11,border:'none',background:theme.primary,color:C.card,fontSize:14,fontWeight:700,cursor:'pointer',width:'auto',margin:0}}>추가</button>
        </div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {SHOP_CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCategory(c)} style={{padding:'4px 10px',borderRadius:20,border:`1.5px solid ${category===c?theme.primary:'#e5e7eb'}`,background:category===c?theme.light:C.card,color:category===c?theme.primary:'#6b7280',fontSize:11,fontWeight:category===c?700:400,cursor:'pointer',width:'auto',margin:0}}>{c}</button>
          ))}
        </div>
      </div>

      {/* 미완료 — 카테고리별 */}
      {undone.length===0&&done.length===0&&(
        <div style={{background:C.card,borderRadius:16,padding:'32px',textAlign:'center',color:C.muted,border:`1.5px solid ${C.border}`}}>
          <div style={{fontSize:36,marginBottom:8}}>🛒</div>
          <div style={{fontSize:14,fontWeight:600}}>장보기 목록이 비어있어요</div>
          <div style={{fontSize:12,marginTop:4}}>필요한 것들을 추가해봐요</div>
        </div>
      )}
      {byCategory.map(({cat,items:catItems})=>(
        <div key={cat} style={{background:C.card,borderRadius:16,padding:'14px 16px',marginBottom:10,border:`1.5px solid ${C.border}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text2,marginBottom:8}}>{cat} <span style={{color:C.muted,fontWeight:400}}>({catItems.length})</span></div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {catItems.map(item=>(
              <div key={item.id} style={{display:'flex',alignItems:'center',gap:10}}>
                <div onClick={()=>toggleItem(item.id,item.done)} style={{width:20,height:20,borderRadius:5,flexShrink:0,cursor:'pointer',background:item.done?theme.primary:'transparent',border:`2px solid ${item.done?theme.primary:'#d1d5db'}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s'}}>
                  {item.done&&<span style={{color:'#fff',fontSize:10,fontWeight:700}}>✓</span>}
                </div>
                <span style={{flex:1,fontSize:14,color:item.done?C.muted:C.text,textDecoration:item.done?'line-through':'none'}}>{item.emoji||''} {item.text}</span>
                <button onClick={()=>deleteItem(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#d1d5db',fontSize:14,padding:0,width:'auto',margin:0}} onMouseEnter={e=>e.currentTarget.style.color='#ef4444'} onMouseLeave={e=>e.currentTarget.style.color='#d1d5db'}>✕</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 완료된 항목 */}
      {done.length>0&&(
        <div style={{background:C.card2,borderRadius:16,padding:'14px 16px',border:`1.5px solid ${C.border}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,marginBottom:8}}>✓ 완료 ({done.length})</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {done.map(item=>(
              <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,opacity:0.6}}>
                <div onClick={()=>toggleItem(item.id,item.done)} style={{width:20,height:20,borderRadius:5,flexShrink:0,cursor:'pointer',background:theme.primary,border:`2px solid ${theme.primary}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{color:'#fff',fontSize:10,fontWeight:700}}>✓</span>
                </div>
                <span style={{flex:1,fontSize:14,color:C.muted,textDecoration:'line-through'}}>{item.text}</span>
                <button onClick={()=>deleteItem(item.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#d1d5db',fontSize:14,padding:0,width:'auto',margin:0}}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 월간 리포트 페이지
// ============================================================
