// ============================================================
// HubPage.js — 추천 허브 페이지
// ============================================================
// HUB PAGE — 추천 허브
// ============================================================
const HUB_APPS = [
  {id:1, emoji:'🏠', name:'오늘의집', cat:'인테리어', desc:'자취방 꾸미기 아이디어 & 가구 쇼핑', tag:['인테리어','홈데코'], url:'https://ohou.se'},
  {id:2, emoji:'🥕', name:'당근마켓', cat:'중고거래', desc:'동네에서 저렴하게 생활용품 구하기', tag:['절약','중고'], url:'https://www.daangn.com'},
  {id:3, emoji:'🍳', name:'만개의레시피', cat:'요리', desc:'냉장고 재료로 만드는 간단 레시피', tag:['요리','식재료'], url:'https://www.10000recipe.com'},
  {id:4, emoji:'📦', name:'번개장터', cat:'중고거래', desc:'전자기기·가전 중고 거래', tag:['절약','중고'], url:'https://m.bunjang.co.kr'},
  {id:5, emoji:'🌿', name:'Forest', cat:'집중', desc:'공부할 때 폰 내려놓게 도와주는 앱', tag:['공부','집중'], url:'https://www.forestapp.cc'},
  {id:6, emoji:'💰', name:'뱅크샐러드', cat:'가계부', desc:'지출 자동 분석 & 절약 추천', tag:['가계부','절약'], url:'https://banksalad.com'},
  {id:7, emoji:'🚚', name:'배달의민족', cat:'배달', desc:'자취생 필수 배달 앱', tag:['배달','음식'], url:'https://www.baemin.com'},
  {id:8, emoji:'💊', name:'필라이즈', cat:'건강', desc:'나에게 맞는 영양제 추천', tag:['건강','영양제'], url:'https://pillize.co.kr'},
  {id:9, emoji:'📚', name:'밀리의서재', cat:'독서', desc:'월정액 전자책 & 오디오북', tag:['독서','공부'], url:'https://www.millie.co.kr'},
  {id:10,emoji:'🧹', name:'청소연구소', cat:'청소', desc:'전문 청소 서비스 예약', tag:['청소','생활'], url:'https://www.cleaninglab.co.kr'},
];

const HUB_SITES = [
  {id:1, emoji:'🗑️', name:'내손안의 분리배출', cat:'분리수거', desc:'품목별 올바른 분리배출 방법 검색', tag:['분리수거','환경'], url:'https://www.recycleinfo.or.kr'},
  {id:2, emoji:'🍱', name:'식품안전나라', cat:'식재료', desc:'식품 유통기한 & 안전 정보', tag:['식재료','안전'], url:'https://www.foodsafetykorea.go.kr'},
  {id:3, emoji:'⚡', name:'한국전력 요금계산기', cat:'공과금', desc:'전기요금 미리 계산하기', tag:['절약','공과금'], url:'https://cyber.kepco.co.kr'},
  {id:4, emoji:'🏥', name:'공공의료포털', cat:'건강', desc:'가까운 병원·약국 찾기', tag:['건강','병원'], url:'https://www.e-gen.or.kr'},
  {id:5, emoji:'🌦️', name:'기상청 날씨', cat:'생활', desc:'오늘 날씨 확인 & 빨래 타이밍 파악', tag:['날씨','생활'], url:'https://www.weather.go.kr'},
  {id:6, emoji:'🚌', name:'카카오맵', cat:'교통', desc:'대중교통 · 자전거 길찾기', tag:['교통','생활'], url:'https://map.kakao.com'},
];

const HUB_COMMUNITIES = [
  {id:1, emoji:'🏫', name:'에브리타임 자취방', cat:'커뮤니티', desc:'대학생 자취 정보 공유 커뮤니티', tag:['자취초보','대학생'], url:'https://everytime.kr'},
  {id:2, emoji:'🏘️', name:'자취생 커뮤니티', cat:'커뮤니티', desc:'자취 꿀팁·생활용품 후기 공유', tag:['자취팁','생활'], url:'https://cafe.naver.com/1004living'},
  {id:3, emoji:'🛒', name:'알뜰살뜰', cat:'절약', desc:'생활비 절약 정보 & 공동구매', tag:['절약','공동구매'], url:'https://cafe.naver.com/moneyplan'},
  {id:4, emoji:'🍳', name:'자취생 레시피', cat:'요리', desc:'간단한 혼밥 레시피 모음', tag:['요리','혼밥'], url:'https://cafe.naver.com/jacheesik'},
];

// 상황별 추천 — 정교화된 알고리즘
function getSituationalRecs(foods, lifeItems) {
  const recs = [];
  const today = new Date(); today.setHours(0,0,0,0);

  // ── 식재료 분석 ──
  const withDl = foods.map(f => ({...f, dl: calcDaysLeft(f.expiryDate)}));
  const expiredFoods = withDl.filter(f => f.dl < 0);
  const todayFoods = withDl.filter(f => f.dl === 0);
  const urgentFoods = withDl.filter(f => f.dl >= 1 && f.dl <= 2);
  const soonFoods = withDl.filter(f => f.dl >= 1 && f.dl <= 5);
  const fridgeFoods = withDl.filter(f => f.storage === '냉장');

  // ── 생활 항목 분석 ──
  const todayStr2 = getToday();
  const routines = lifeItems.filter(c => c.section === '루틴');
  const todayRoutines = routines.filter(c => isTodayItem(c));
  const doneToday = todayRoutines.filter(c => isDoneOn(c, todayStr2)).length;
  const totalToday = todayRoutines.length;
  const routinePct = totalToday ? doneToday / totalToday : 0;

  const cleanItems = lifeItems.filter(c => c.section === '청소');
  const lifeManageItems = lifeItems.filter(c => c.section === '생활');

  // 주기 초과 항목
  const overdueClean = cleanItems.filter(c => c.lastDone && daysSince(c.lastDone) > c.intervalDays);
  const overdueLife = lifeManageItems.filter(c => c.lastDone && daysSince(c.lastDone) > c.intervalDays);
  const overdueAll = [...overdueClean, ...overdueLife].sort((a,b) => {
    const aDays = daysSince(a.lastDone) - a.intervalDays;
    const bDays = daysSince(b.lastDone) - b.intervalDays;
    return bDays - aDays; // 가장 오래된 것 먼저
  });

  // 오늘 할 빨래/특정 항목
  const laundryItem = lifeManageItems.find(c => c.text.includes('빨래'));
  const laundryOverdue = laundryItem && laundryItem.lastDone && daysSince(laundryItem.lastDone) >= (laundryItem.intervalDays || 4);
  const bedItem = lifeManageItems.find(c => c.text.includes('침구'));
  const bedOverdue = bedItem && bedItem.lastDone && daysSince(bedItem.lastDone) >= (bedItem.intervalDays || 14);

  // ── 우선순위별 추천 생성 ──

  // P1: 오늘 마감/기간초과 식재료
  if(expiredFoods.length > 0) recs.push({
    priority: 1, emoji: '⚠️', type: 'food',
    title: `기간 초과 식재료가 ${expiredFoods.length}개 있어요`,
    desc: `${expiredFoods.slice(0,2).map(f=>f.name).join(', ')} 등 — 지금 바로 확인해요`,
    action: 'food', actionLabel: '확인하기',
    bg: '#fef2f2', border: '#fecaca', accent: '#ef4444'
  });
  if(todayFoods.length > 0) recs.push({
    priority: 1, emoji: '🚨', type: 'food',
    title: `오늘 마감 식재료 ${todayFoods.length}개`,
    desc: `${todayFoods.map(f=>f.name).join(', ')} — 오늘 꼭 드세요`,
    action: 'food', actionLabel: '확인하기',
    bg: '#fef2f2', border: '#fecaca', accent: '#ef4444'
  });

  // P2: 내일/모레 마감 → 요리 추천
  if(urgentFoods.length >= 1) recs.push({
    priority: 2, emoji: '🍳', type: 'cook',
    title: `${urgentFoods[0].name}${urgentFoods.length > 1 ? ` 등 ${urgentFoods.length}개` : ''} 곧 마감돼요`,
    desc: `D-${urgentFoods[0].dl} · 지금 요리하면 딱 좋아요 → 만개의레시피`,
    appId: 3, action: 'hub', actionLabel: '레시피 보기',
    bg: '#fff7ed', border: '#fed7aa', accent: '#f97316'
  });

  // P3: 주기 초과 생활관리 (가장 오래된 것)
  if(overdueAll.length > 0) {
    const worst = overdueAll[0];
    const overDays = daysSince(worst.lastDone) - worst.intervalDays;
    recs.push({
      priority: 2, emoji: worst.emoji || '🧹', type: 'life',
      title: `${worst.text} ${overDays}일 지났어요`,
      desc: `${worst.intervalDays}일 주기 · 마지막: ${daysSince(worst.lastDone)}일 전`,
      action: 'life', actionLabel: '하러가기',
      bg: '#fefce8', border: '#fef08a', accent: '#ca8a04'
    });
  }
  if(overdueAll.length >= 3) recs.push({
    priority: 2, emoji: '🧹', type: 'clean',
    title: `청소/관리 항목 ${overdueAll.length}개가 밀렸어요`,
    desc: '청소연구소 서비스를 이용해보는 건 어때요?',
    appId: 10, action: 'hub', actionLabel: '알아보기',
    bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a'
  });

  // P4: 빨래/침구
  if(laundryOverdue) recs.push({
    priority: 3, emoji: '🧺', type: 'laundry',
    title: `빨래 미룬 지 ${daysSince(laundryItem.lastDone)}일 됐어요`,
    desc: '날씨 확인하고 지금 돌려요 → 기상청',
    siteId: 5, action: 'hub', actionLabel: '날씨 확인',
    bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb'
  });
  if(bedOverdue) recs.push({
    priority: 3, emoji: '🛏️', type: 'bed',
    title: `침구 세탁 ${daysSince(bedItem.lastDone)}일 됐어요`,
    desc: `${bedItem.intervalDays}일 주기 · 슬슬 세탁할 때예요`,
    action: 'life', actionLabel: '하러가기',
    bg: '#fdf4ff', border: '#e9d5ff', accent: '#7c3aed'
  });

  // P5: 루틴 달성 상태
  if(totalToday > 0 && routinePct === 1) recs.push({
    priority: 4, emoji: '🔥', type: 'cheer',
    title: '오늘 루틴 모두 완료!',
    desc: '정말 대단해요! 내일도 이 기세로 💪',
    action: null, actionLabel: null,
    bg: '#fff7ed', border: '#fed7aa', accent: '#ea580c'
  });
  else if(totalToday > 0 && doneToday === 0 && new Date().getHours() >= 20) recs.push({
    priority: 3, emoji: '🌙', type: 'routine',
    title: '저녁인데 오늘 루틴을 아직 안 했어요',
    desc: `${totalToday}개 남았어요 — 자기 전에 하나라도 해봐요`,
    action: 'life', actionLabel: '하러가기',
    bg: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed'
  });
  else if(totalToday > 0 && routinePct > 0 && routinePct < 1) recs.push({
    priority: 4, emoji: '🌱', type: 'routine',
    title: `루틴 ${doneToday}/${totalToday} 진행 중이에요`,
    desc: `${totalToday - doneToday}개 남았어요 — 조금만 더!`,
    action: 'life', actionLabel: '계속하기',
    bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a'
  });

  // P6: 냉장고 식재료 없을 때
  if(fridgeFoods.length === 0 && foods.length === 0) recs.push({
    priority: 4, emoji: '🛒', type: 'shop',
    title: '냉장고가 비어있어요',
    desc: '장보기 전에 유통기한 관리도 시작해봐요',
    action: 'food', actionLabel: '식재료 추가',
    bg: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed'
  });

  // P7: 가계부/절약 — 항목 없으면 앱 추천
  if(lifeItems.length === 0) recs.push({
    priority: 5, emoji: '💰', type: 'finance',
    title: '생활비도 관리해봐요',
    desc: '뱅크샐러드로 지출 자동 분석하기',
    appId: 6, action: 'hub', actionLabel: '알아보기',
    bg: '#fefce8', border: '#fef08a', accent: '#ca8a04'
  });

  // 기본 — 아무것도 없으면
  if(recs.length === 0) {
    const hour = new Date().getHours();
    const cheerMsgs = [
      {emoji:'✨', title:'생활 완벽하게 유지 중이에요!', desc:'오늘도 멋진 하루 보내세요 💜'},
      {emoji:'🏠', title:'집도 생활도 깔끔하네요', desc:'이번 주도 잘 하고 있어요 👍'},
      {emoji:'🌟', title:'식재료도 루틴도 완벽해요', desc:'자취 고수 인증! 🎉'},
    ];
    const msg = cheerMsgs[new Date().getDate() % cheerMsgs.length];
    recs.push({priority: 5, ...msg, type: 'cheer', action: null, actionLabel: null, bg: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed'});
  }

  // 우선순위 정렬 후 최대 4개
  return recs.sort((a,b) => a.priority - b.priority).slice(0, 4);
}

function HubPage({foods, lifeItems, onNav}) {
  const theme=useTheme();
  const [activeTab, setActiveTab] = React.useState('situation');
  const [activeCat, setActiveCat] = React.useState('전체');
  const tabs = [
    {id:'situation', label:'🎯 상황별 추천'},
    {id:'apps',      label:'📱 앱 추천'},
    {id:'sites',     label:'🌐 웹사이트'},
    {id:'community', label:'💬 커뮤니티'},
  ];
  const situRecs = getSituationalRecs(foods, lifeItems);
  const allAppCats = ['전체', ...new Set(HUB_APPS.map(a=>a.cat))];
  const filteredApps = activeCat==='전체' ? HUB_APPS : HUB_APPS.filter(a=>a.cat===activeCat);

  function LinkCard({item}) {
    return (
      <div style={{background:C.card,borderRadius:16,padding:'16px 18px',border:`1.5px solid ${C.border}`,display:'flex',alignItems:'flex-start',gap:14,transition:'transform 0.15s'}}
        onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
        onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
        <div style={{width:44,height:44,borderRadius:12,background:'#f5f3ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{item.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
            <span style={{fontSize:14,fontWeight:700,color:C.text}}>{item.name}</span>
            <span style={{fontSize:10,color:'#7c3aed',background:'#ede9fe',padding:'1px 7px',borderRadius:20,fontWeight:600}}>{item.cat}</span>
          </div>
          <div style={{fontSize:12,color:C.text3,marginBottom:8,lineHeight:1.5}}>{item.desc}</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {item.tag.map(t=><span key={t} style={{fontSize:10,color:C.muted,background:C.card2,padding:'2px 7px',borderRadius:20,border:`1px solid ${C.border}`}}>#{t}</span>)}
          </div>
        </div>
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{flexShrink:0,padding:'7px 12px',borderRadius:10,background:'#7c3aed',color:'#fff',fontSize:11,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap'}}>바로가기</a>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:21,fontWeight:800,color:C.text}}>🔖 추천</div>
          <PageHelp pageId="hub"/>
        </div>
        <div style={{fontSize:13,color:C.muted,marginTop:3}}>자취 생활에 필요한 것들을 모았어요</div>
      </div>

      {/* 탭 */}
      <div style={{display:'flex',gap:6,marginBottom:18,overflowX:'auto',paddingBottom:2}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            padding:'8px 14px',borderRadius:20,border:'none',whiteSpace:'nowrap',
            background:activeTab===t.id?theme.primary:'#f3f4f6',
            color:activeTab===t.id?'#fff':'#6b7280',
            fontSize:13,fontWeight:activeTab===t.id?700:500,cursor:'pointer',width:'auto',margin:0,
          }}>{t.label}</button>
        ))}
      </div>

      {/* 상황별 추천 */}
      {activeTab==='situation'&&(
        <div>
          <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:12}}>지금 나에게 필요한 것들이에요</div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            {situRecs.map((r,i)=>{
              const app = r.appId ? HUB_APPS.find(a=>a.id===r.appId) : null;
              const site = r.siteId ? HUB_SITES.find(s=>s.id===r.siteId) : null;
              const linkTarget = app || site;
              return (
                <div key={i} style={{background:r.bg||C.card,borderRadius:16,padding:'16px 18px',border:`1.5px solid ${r.border||'#f3f4f6'}`,display:'flex',alignItems:'center',gap:14,transition:'transform 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                  <div style={{width:44,height:44,borderRadius:14,background:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{r.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:r.accent||C.text,marginBottom:3}}>{r.title}</div>
                    <div style={{fontSize:12,color:C.text3,lineHeight:1.5}}>{r.desc}</div>
                  </div>
                  {r.actionLabel&&linkTarget&&(
                    <a href={linkTarget.url} target="_blank" rel="noopener noreferrer" style={{flexShrink:0,padding:'7px 12px',borderRadius:10,background:r.accent||'#7c3aed',color:'#fff',fontSize:11,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap'}}>{r.actionLabel}</a>
                  )}
                  {r.actionLabel&&!linkTarget&&r.action&&(
                    <button onClick={()=>onNav(r.action)} style={{flexShrink:0,padding:'7px 12px',borderRadius:10,background:r.accent||'#7c3aed',color:'#fff',fontSize:11,fontWeight:700,border:'none',cursor:'pointer',width:'auto',margin:0,whiteSpace:'nowrap'}}>{r.actionLabel}</button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 전체 앱 빠른 보기 */}
          <div style={{fontSize:13,fontWeight:700,color:C.text2,marginBottom:10}}>인기 추천 앱</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:9}}>
            {HUB_APPS.slice(0,6).map(a=>(
              <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" style={{background:C.card,borderRadius:14,padding:'14px 12px',border:`1.5px solid ${C.border}`,display:'flex',flexDirection:'column',alignItems:'center',gap:6,textDecoration:'none',textAlign:'center',transition:'transform 0.15s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <div style={{fontSize:28}}>{a.emoji}</div>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{a.name}</div>
                <div style={{fontSize:10,color:C.muted,lineHeight:1.4}}>{a.desc.slice(0,18)}...</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 앱 추천 */}
      {activeTab==='apps'&&(
        <div>
          <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
            {allAppCats.map(c=><button key={c} onClick={()=>setActiveCat(c)} style={{padding:'5px 12px',borderRadius:20,border:'none',background:activeCat===c?theme.primary:'#f3f4f6',color:activeCat===c?'#fff':'#6b7280',fontSize:12,fontWeight:activeCat===c?700:500,cursor:'pointer',width:'auto',margin:0}}>{c}</button>)}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {filteredApps.map(a=><LinkCard key={a.id} item={a}/>)}
          </div>
        </div>
      )}

      {/* 웹사이트 */}
      {activeTab==='sites'&&(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {HUB_SITES.map(s=><LinkCard key={s.id} item={s}/>)}
        </div>
      )}

      {/* 커뮤니티 */}
      {activeTab==='community'&&(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {HUB_COMMUNITIES.map(c=><LinkCard key={c.id} item={c}/>)}
        </div>
      )}
    </div>
  );
}

// ============================================================
