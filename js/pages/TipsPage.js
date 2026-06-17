// ============================================================
// TipsPage.js — 생활 팁 페이지
// ============================================================
// ============================================================
// TIPS PAGE
// ============================================================
function TipsPage() {
  const theme=useTheme();
  const [activeCat,setActiveCat]=React.useState('전체');
  const [search,setSearch]=React.useState('');
  const [openId,setOpenId]=React.useState(null);
  const [showModal,setShowModal]=React.useState(false);
  const [editTarget,setEditTarget]=React.useState(null);
  const [myTips,setMyTips]=useLocalStorage('mylife_v3_mytips',[]);
  const [form,setForm]=React.useState({emoji:'✏️',title:'',category:'나만의팁',summary:'',content:'',time:''});
  const ALL=['전체','청소','세탁','식재료','자취팁','나만의팁'];
  const allGuides=[...LIFE_GUIDES,...myTips.map((t,i)=>({...t,...MY_TIP_COLORS[i%MY_TIP_COLORS.length],isMine:true}))];
  const filtered=allGuides.filter(g=>{
    const matchCat=activeCat==='전체'||g.category===activeCat;
    const q=search.trim().toLowerCase();
    const matchSearch=!q||(g.title+g.summary+g.content+g.category).toLowerCase().includes(q);
    return matchCat&&matchSearch;
  });
  function openAdd(){setEditTarget(null);setForm({emoji:'✏️',title:'',category:'나만의팁',summary:'',content:'',time:''});setShowModal(true);}
  function openEdit(g,e){e.stopPropagation();setEditTarget(g);setForm({emoji:g.emoji,title:g.title,category:g.category,summary:g.summary||'',content:g.content||'',time:g.time||''});setShowModal(true);}
  function submitForm(){if(!form.title.trim())return;editTarget?setMyTips(p=>p.map(t=>t.id===editTarget.id?{...t,...form}:t)):setMyTips(p=>[...p,{id:Date.now(),...form}]);setShowModal(false);}
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:16}}>
        <div><div style={{fontSize:21,fontWeight:800,color:C.text,marginBottom:3}}>💡 생활 가이드</div><div style={{fontSize:13,color:C.muted}}>자취 초보를 위한 생활 꿀팁</div></div>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <PageHelp pageId="tips"/>
          <Btn size="sm" onClick={openAdd}>+ 나만의 팁</Btn>
        </div>
      </div>
      <div style={{position:'relative',marginBottom:12}}>
        <span style={{position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:14,color:C.muted,pointerEvents:'none'}}>🔍</span>
        <input type="text" placeholder="팁 검색..." value={search} onChange={e=>setSearch(e.target.value)} style={inp({paddingLeft:38,borderRadius:14,background:C.card})}
          onFocus={e=>e.target.style.borderColor='#7c3aed'} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/>
        {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.muted,fontSize:15,padding:0,width:'auto',margin:0}}>✕</button>}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
        {ALL.map(c=><button key={c} onClick={()=>setActiveCat(c)} style={{padding:'5px 13px',borderRadius:20,border:`1.5px solid ${activeCat===c?'#7c3aed':'#e5e7eb'}`,background:activeCat===c?'#ede9fe':'#fff',color:activeCat===c?'#7c3aed':'#6b7280',fontSize:12,fontWeight:activeCat===c?700:500,cursor:'pointer',width:'auto',margin:0,display:'flex',alignItems:'center',gap:4}}>
          {c}{c==='나만의팁'&&myTips.length>0&&<span style={{fontSize:10,fontWeight:700,color:'#fff',background:'#7c3aed',padding:'0 5px',borderRadius:10}}>{myTips.length}</span>}
        </button>)}
      </div>
      {filtered.length===0&&<div style={{textAlign:'center',padding:'40px 0',color:C.muted}}><div style={{fontSize:32,marginBottom:8}}>{search?'🔍':'📭'}</div><div style={{fontSize:14,fontWeight:600}}>{search?`"${search}" 결과가 없어요`:'팁이 없어요'}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:13}}>
        {filtered.map(g=>(
          <div key={g.id} style={{background:g.color,borderRadius:18,padding:'19px',border:`1.5px solid ${g.isMine?'#ddd6fe':`${g.textColor}22`}`,cursor:'pointer',transition:'transform 0.15s',position:'relative'}} onClick={()=>setOpenId(openId===g.id?null:g.id)} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
            {g.isMine&&(
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                <span style={{fontSize:10,fontWeight:700,color:'#7c3aed',background:'#ede9fe',padding:'2px 7px',borderRadius:20,border:'1px solid #ddd6fe'}}>✏️ 나만의 팁</span>
                <div style={{display:'flex',gap:4}} onClick={e=>e.stopPropagation()}>
                  <button onClick={e=>openEdit(g,e)} style={{fontSize:10,color:'#7c3aed',background:'#f5f3ff',border:'1px solid #ddd6fe',borderRadius:7,padding:'2px 7px',cursor:'pointer',width:'auto',margin:0}}>수정</button>
                  <button onClick={e=>{e.stopPropagation();setMyTips(p=>p.filter(t=>t.id!==g.id));}} style={{fontSize:10,color:'#ef4444',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:7,padding:'2px 7px',cursor:'pointer',width:'auto',margin:0}}>삭제</button>
                </div>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:7}}>
              <div style={{fontSize:26}}>{g.emoji}</div>
              {!g.isMine&&<div style={{fontSize:10,fontWeight:700,color:g.textColor,opacity:0.7,background:`${g.textColor}15`,padding:'2px 8px',borderRadius:20}}>{g.category}</div>}
            </div>
            <div style={{fontSize:14,fontWeight:800,color:g.textColor,marginBottom:3}}>{g.title}</div>
            {g.summary&&<div style={{fontSize:12,color:g.textColor,opacity:0.75,marginBottom:9}}>{g.summary}</div>}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              {g.time?<div style={{fontSize:10,color:g.textColor,opacity:0.6}}>🕐 {g.time}</div>:<div/>}
              <div style={{fontSize:10,color:g.textColor,fontWeight:700}}>{openId===g.id?'접기 ↑':'더보기 ↓'}</div>
            </div>
            {openId===g.id&&g.content&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${g.textColor}22`,fontSize:12,color:g.textColor,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{g.content}</div>}
          </div>
        ))}
      </div>
      {showModal&&(
        <Modal title={editTarget?'팁 수정':'✏️ 나만의 팁 추가'} sub="나만의 생활 노하우를 기록해보세요" onClose={()=>setShowModal(false)} maxWidth={420}>
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            <div style={{display:'grid',gridTemplateColumns:'54px 1fr',gap:7}}>
              <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>이모지</div><input placeholder="✏️" value={form.emoji} onChange={e=>setForm(p=>({...p,emoji:e.target.value}))} maxLength={2} style={inp({textAlign:'center',fontSize:22})}/></div>
              <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>제목 *</div><input placeholder="팁 제목" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={inp()} autoFocus/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
              <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>카테고리</div>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} style={inp()}>
                  {['나만의팁','청소','세탁','식재료','자취팁'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>주기</div><input placeholder="예: 주 1회" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} style={inp()}/></div>
            </div>
            <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>한 줄 요약</div><input placeholder="짧게 요약해주세요" value={form.summary} onChange={e=>setForm(p=>({...p,summary:e.target.value}))} style={inp()}/></div>
            <div><div style={{fontSize:11,color:C.muted,marginBottom:3}}>내용</div><textarea placeholder="자유롭게 작성하세요" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} rows={4} style={inp({resize:'vertical',lineHeight:1.6})}/></div>
            <div style={{display:'flex',gap:8,marginTop:2}}>
              <Btn onClick={submitForm} style={{flex:1}}>{editTarget?'수정하기':'추가하기'}</Btn>
              <Btn onClick={()=>setShowModal(false)} variant="outline" style={{flex:1}}>취소</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// 장보기 목록 페이지
// ============================================================
const SHOP_CATEGORIES = ['과일/채소','정육/수산','유제품','가공식품','양념/소스','생활용품','기타'];

