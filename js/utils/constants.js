// ============================================================
// constants.js — 데이터 상수: 식재료 프리셋, 섹션 정의, 명언, 테마, CSS 변수
// ============================================================
// DATA PRESETS
// ============================================================
const FOOD_PRESETS={
  과일:[{emoji:'🍎',name:'사과',days:14,storage:'냉장'},{emoji:'🍌',name:'바나나',days:5,storage:'상온'},{emoji:'🍊',name:'귤',days:14,storage:'냉장'},{emoji:'🍇',name:'포도',days:7,storage:'냉장'},{emoji:'🍓',name:'딸기',days:4,storage:'냉장'},{emoji:'🫐',name:'블루베리',days:7,storage:'냉장'},{emoji:'🥝',name:'키위',days:10,storage:'냉장'},{emoji:'🍋',name:'레몬',days:14,storage:'냉장'}],
  채소:[{emoji:'🥬',name:'대파',days:7,storage:'냉장'},{emoji:'🥕',name:'당근',days:14,storage:'냉장'},{emoji:'🧅',name:'양파',days:30,storage:'상온'},{emoji:'🧄',name:'마늘',days:30,storage:'냉장'},{emoji:'🥦',name:'브로콜리',days:5,storage:'냉장'},{emoji:'🥒',name:'오이',days:5,storage:'냉장'},{emoji:'🍅',name:'토마토',days:5,storage:'냉장'},{emoji:'🥔',name:'감자',days:30,storage:'상온'},{emoji:'🍄',name:'버섯',days:5,storage:'냉장'}],
  정육:[{emoji:'🥩',name:'소고기',days:3,storage:'냉장'},{emoji:'🐷',name:'삼겹살',days:3,storage:'냉장'},{emoji:'🍗',name:'닭가슴살',days:2,storage:'냉장'},{emoji:'🥓',name:'베이컨',days:7,storage:'냉장'},{emoji:'🌭',name:'소시지',days:7,storage:'냉장'},{emoji:'🥚',name:'계란',days:14,storage:'냉장'},{emoji:'🦐',name:'새우',days:2,storage:'냉장'},{emoji:'🐟',name:'생선',days:2,storage:'냉장'}],
  유제품:[{emoji:'🥛',name:'우유',days:7,storage:'냉장'},{emoji:'🫙',name:'요거트',days:10,storage:'냉장'},{emoji:'🧀',name:'치즈',days:14,storage:'냉장'},{emoji:'🧈',name:'버터',days:30,storage:'냉장'},{emoji:'🫙',name:'두부',days:5,storage:'냉장'}],
  가공식품:[{emoji:'🥫',name:'참치캔',days:730,storage:'상온'},{emoji:'🍜',name:'라면',days:180,storage:'상온'},{emoji:'🥟',name:'만두',days:60,storage:'냉동'},{emoji:'🍱',name:'즉석밥',days:365,storage:'상온'},{emoji:'🥫',name:'스팸',days:730,storage:'상온'}],
  '양념·소스':[{emoji:'🧂',name:'소금',days:730,storage:'상온'},{emoji:'🫙',name:'된장',days:365,storage:'냉장'},{emoji:'🌶️',name:'고추장',days:365,storage:'냉장'},{emoji:'🫙',name:'간장',days:365,storage:'상온'},{emoji:'🍯',name:'꿀',days:730,storage:'상온'},{emoji:'🫒',name:'올리브오일',days:365,storage:'상온'}],
  '곡류·건식품':[{emoji:'🍚',name:'쌀',days:180,storage:'상온'},{emoji:'🍞',name:'식빵',days:5,storage:'상온'},{emoji:'🥜',name:'견과류',days:90,storage:'상온'},{emoji:'🍜',name:'파스타면',days:365,storage:'상온'}],
};
const QUICK_FOOD=[
  {emoji:'🥛',name:'우유',category:'유제품',days:7,storage:'냉장'},
  {emoji:'🥚',name:'계란',category:'정육',days:14,storage:'냉장'},
  {emoji:'🥬',name:'대파',category:'채소',days:7,storage:'냉장'},
  {emoji:'🫙',name:'두부',category:'유제품',days:5,storage:'냉장'},
  {emoji:'🍚',name:'쌀',category:'곡류·건식품',days:180,storage:'상온'},
  {emoji:'🍜',name:'라면',category:'가공식품',days:180,storage:'상온'},
  {emoji:'🐷',name:'삼겹살',category:'정육',days:3,storage:'냉장'},
  {emoji:'🥟',name:'만두',category:'가공식품',days:60,storage:'냉동'},
];
const CAT_THEME={
  과일:{bg:'#fff7ed',border:'#fed7aa',accent:'#ea580c',icon:'🍎'},
  채소:{bg:'#f0fdf4',border:'#bbf7d0',accent:'#16a34a',icon:'🥦'},
  정육:{bg:'#fef2f2',border:'#fecaca',accent:'#dc2626',icon:'🥩'},
  유제품:{bg:'#eff6ff',border:'#bfdbfe',accent:'#2563eb',icon:'🥛'},
  가공식품:{bg:'#f5f3ff',border:'#ddd6fe',accent:'#7c3aed',icon:'🥫'},
  '양념·소스':{bg:'#fefce8',border:'#fef08a',accent:'#ca8a04',icon:'🧂'},
  '곡류·건식품':{bg:'#fdf4ff',border:'#f0abfc',accent:'#a21caf',icon:'🍚'},
};

// 생활 관리 섹션 정의
const LIFE_SECTIONS_BASE={
  루틴:{icon:'🌀',color:'#7c3aed',bg:'#f5f3ff',border:'#ddd6fe',label:'생활 루틴'},
  생활:{icon:'🏠',color:'#2563eb',bg:'#eff6ff',border:'#bfdbfe',label:'생활 관리'},
  청소:{icon:'🧹',color:'#16a34a',bg:'#f0fdf4',border:'#bbf7d0',label:'청소 관리'},
};
const SECTION_COLOR_MAP={
  purple:{color:'#7c3aed',bg:'#f5f3ff',border:'#ddd6fe'},
  blue:  {color:'#2563eb',bg:'#eff6ff',border:'#bfdbfe'},
  green: {color:'#16a34a',bg:'#f0fdf4',border:'#bbf7d0'},
  rose:  {color:'#e11d48',bg:'#fff1f2',border:'#fda4af'},
  orange:{color:'#ea580c',bg:'#fff7ed',border:'#fed7aa'},
  teal:  {color:'#0891b2',bg:'#ecfeff',border:'#a5f3fc'},
};
// customSections는 App에서 전달받아 useCustomSections()로 접근
const CustomSectionsCtx = React.createContext({});
function useLifeSections() {
  const custom = React.useContext(CustomSectionsCtx);
  const result = {};
  Object.entries(LIFE_SECTIONS_BASE).forEach(([k,v]) => {
    const colorId = custom[k];
    result[k] = colorId && SECTION_COLOR_MAP[colorId]
      ? {...v, ...SECTION_COLOR_MAP[colorId]}
      : v;
  });
  return result;
}
// 하위 호환을 위해 LIFE_SECTIONS도 유지
const LIFE_SECTIONS = LIFE_SECTIONS_BASE;

// 온보딩 프리셋
const ONBOARDING_PRESETS={
  '방금 이사':[ 
    {section:'청소',emoji:'🚽',text:'화장실 청소',freq:'interval',intervalDays:7,guide:'변기·세면대·바닥 순서로'},
    {section:'청소',emoji:'🧹',text:'바닥 청소기',freq:'interval',intervalDays:3,guide:'가구 아래까지 꼼꼼히'},
    {section:'생활',emoji:'🧺',text:'빨래 돌리기',freq:'interval',intervalDays:4,guide:'세탁망 활용 추천'},
    {section:'생활',emoji:'🗑️',text:'쓰레기 분리수거',freq:'interval',intervalDays:3,guide:'플라스틱·캔·종이 분리'},
    {section:'루틴',emoji:'💧',text:'물 2잔 마시기',freq:'daily',guide:''},
    {section:'루틴',emoji:'🪟',text:'환기하기',freq:'daily',guide:'하루 2번 이상'},
  ],
  '1년 이상':[
    {section:'청소',emoji:'🚽',text:'화장실 청소',freq:'interval',intervalDays:7,guide:'변기·세면대·바닥 순서로'},
    {section:'청소',emoji:'❄️',text:'냉장고 정리',freq:'interval',intervalDays:30,guide:'유통기한 지난 것 먼저'},
    {section:'청소',emoji:'🌀',text:'배수구 청소',freq:'interval',intervalDays:14,guide:'베이킹소다+뜨거운 물'},
    {section:'생활',emoji:'🧺',text:'빨래 돌리기',freq:'interval',intervalDays:3,guide:''},
    {section:'생활',emoji:'🛏️',text:'침구 세탁',freq:'interval',intervalDays:14,guide:'40도 이하 세탁'},
    {section:'생활',emoji:'🗑️',text:'쓰레기 분리수거',freq:'interval',intervalDays:3,guide:''},
    {section:'루틴',emoji:'💧',text:'물 마시기',freq:'daily',guide:''},
    {section:'루틴',emoji:'🪟',text:'환기하기',freq:'daily',guide:''},
  ],
  '오래됨':[
    {section:'청소',emoji:'🚽',text:'화장실 청소',freq:'interval',intervalDays:7,guide:''},
    {section:'청소',emoji:'🔥',text:'가스레인지 청소',freq:'interval',intervalDays:7,guide:'베이킹소다로 기름때 제거'},
    {section:'청소',emoji:'❄️',text:'냉장고 정리',freq:'interval',intervalDays:30,guide:''},
    {section:'청소',emoji:'🌀',text:'배수구 청소',freq:'interval',intervalDays:14,guide:''},
    {section:'청소',emoji:'🪟',text:'창문 닦기',freq:'interval',intervalDays:30,guide:'신문지+세정제'},
    {section:'생활',emoji:'🧺',text:'빨래 돌리기',freq:'interval',intervalDays:3,guide:''},
    {section:'생활',emoji:'🛏️',text:'침구 세탁',freq:'interval',intervalDays:14,guide:''},
    {section:'생활',emoji:'🗑️',text:'분리수거',freq:'interval',intervalDays:3,guide:''},
    {section:'루틴',emoji:'💧',text:'물 마시기',freq:'daily',guide:''},
    {section:'루틴',emoji:'🪟',text:'환기하기',freq:'daily',guide:''},
    {section:'루틴',emoji:'💊',text:'비타민 챙기기',freq:'daily',guide:''},
  ],
};

const LIFE_GUIDES=[
  {id:1,category:'청소',emoji:'🚿',title:'화장실 청소 꿀팁',summary:'5분만 투자하면 반짝반짝',content:'변기: 세제 붓고 5분 후 솔로 닦기\n세면대: 치약으로 닦으면 광택 효과\n거울: 신문지로 닦으면 얼룩 없이 깨끗\n바닥: 욕실 전용 세제 + 솔로 구석까지',time:'주 1~2회',color:'#e0f2fe',textColor:'#0369a1'},
  {id:2,category:'세탁',emoji:'👕',title:'세탁 방법 기초',summary:'옷감별 올바른 세탁법',content:'면: 30~40도 일반 세탁\n니트/울: 30도 이하 손세탁\n청바지: 뒤집어서 30도 세탁\n흰옷: 60도 이상 살균 세탁 가능',time:'주 1~2회',color:'#f0fdf4',textColor:'#166534'},
  {id:3,category:'식재료',emoji:'🥬',title:'채소 신선하게 보관하기',summary:'오래 두고 먹는 보관 비법',content:'대파: 키친타올에 싸서 냉장\n시금치: 세워서 보관하면 오래가요\n당근: 신문지에 싸서 냉장 보관\n마늘: 껍질 벗겨 냉동하면 편리',time:'구매 후 바로',color:'#fefce8',textColor:'#854d0e'},
  {id:4,category:'자취팁',emoji:'💡',title:'자취 필수 생활 팁',summary:'알아두면 진짜 편한 꿀팁',content:'전기요금: 대기전력 차단 멀티탭\n냄새: 베이킹소다로 냄새 제거\n결로: 환기 하루 2회로 곰팡이 예방\n배수구: 주 1회 뜨거운 물로 청소',time:'수시로',color:'#fdf4ff',textColor:'#7e22ce'},
  {id:5,category:'청소',emoji:'🧹',title:'방 청소 루틴 만들기',summary:'15분이면 깔끔해지는 순서',content:'1. 물건 제자리 정리 (5분)\n2. 먼지 털기 위에서 아래로 (3분)\n3. 바닥 청소기 또는 물걸레 (5분)\n4. 쓰레기통 비우기 (2분)',time:'주 2~3회',color:'#fff1f2',textColor:'#be123c'},
  {id:6,category:'식재료',emoji:'🍳',title:'냉장고 정리 원칙',summary:'넣기 전에 먼저 정리!',content:'위 칸: 바로 먹을 것\n중간 칸: 유제품, 계란\n아래 칸: 고기, 생선 (밀봉 필수)\n서랍: 채소, 과일 분리 보관',time:'장 보기 전',color:'#f0fdf4',textColor:'#14532d'},
];

const MY_TIP_COLORS=[
  {color:'#fdf4ff',textColor:'#7e22ce'},{color:'#fefce8',textColor:'#854d0e'},
  {color:'#f0fdf4',textColor:'#14532d'},{color:'#eff6ff',textColor:'#1e3a8a'},
  {color:'#fff7ed',textColor:'#7c2d12'},{color:'#fef2f2',textColor:'#7f1d1d'},
];
// ─── 명언 ───
const QUOTES=[
  {text:"작은 습관이 큰 변화를 만들어요.",author:"제임스 클리어"},
  {text:"오늘 하루도 스스로를 위한 선택을 해요.",author:"LifeFit"},
  {text:"완벽하지 않아도 괜찮아, 오늘도 해냈으니까.",author:"LifeFit"},
  {text:"정리된 공간은 정리된 마음을 만들어요.",author:""},
  {text:"매일 1%씩 나아지면, 1년 후엔 37배 성장해요.",author:""},
  {text:"혼자 살아가는 것도 배움이에요.",author:"LifeFit"},
  {text:"작은 루틴이 쌓이면 인생이 달라져요.",author:""},
  {text:"오늘 냉장고 정리만 해도 충분해요 💜",author:"LifeFit"},
  {text:"나를 챙기는 것도 중요한 일이에요.",author:""},
  {text:"하루에 한 가지만 잘해도 성공이에요.",author:"LifeFit"},
  {text:"좋은 습관은 좋은 삶의 시작이에요.",author:""},
  {text:"지금 이 순간도 잘 하고 있어요.",author:"LifeFit"},
];
function getTodayQuote() {
  const idx = new Date().getDate() % QUOTES.length;
  return QUOTES[idx];
}

// ─── 테마 색상 팔레트 ───
const THEMES = [
  {id:'purple', name:'보라', primary:'#7c3aed', light:'#ede9fe', mid:'#ddd6fe', border:'#c4b5fd', bg:'#f5f3ff', grad:'135deg,#f5f3ff,#ede9fe'},
  {id:'rose',   name:'로즈', primary:'#e11d48', light:'#ffe4e6', mid:'#fecdd3', border:'#fda4af', bg:'#fff1f2', grad:'135deg,#fff1f2,#ffe4e6'},
  {id:'sky',    name:'하늘', primary:'#0284c7', light:'#e0f2fe', mid:'#bae6fd', border:'#7dd3fc', bg:'#f0f9ff', grad:'135deg,#f0f9ff,#e0f2fe'},
  {id:'green',  name:'연두', primary:'#16a34a', light:'#dcfce7', mid:'#bbf7d0', border:'#86efac', bg:'#f0fdf4', grad:'135deg,#f0fdf4,#dcfce7'},
  {id:'orange', name:'오렌지',primary:'#ea580c', light:'#ffedd5', mid:'#fed7aa', border:'#fdba74', bg:'#fff7ed', grad:'135deg,#fff7ed,#ffedd5'},
  {id:'slate',  name:'슬레이트',primary:'#475569',light:'#f1f5f9',mid:'#e2e8f0',border:'#cbd5e1', bg:'#f8fafc', grad:'135deg,#f8fafc,#f1f5f9'},
];
function getTheme(id) { return THEMES.find(t=>t.id===id) || THEMES[0]; }

// 다크모드 컨텍스트
const DarkCtx = React.createContext(false);
function useDark() { return React.useContext(DarkCtx); }

// 다크 어웨어 색상 헬퍼 — dc(light, dark)
function dc(light, dark) {
  // This is called inside components, use hook result
  // Usage: dc('#fff','#1e293b') — but requires isDark in scope
  // Instead we use CSS variables directly
  return light; // fallback
}
// CSS 변수 단축어 (JSX style에서 사용)
const C = {
  card:     'var(--bg-card)',
  card2:    'var(--bg-card2)',
  card3:    'var(--bg-card3)',
  input:    'var(--bg-input)',
  text:     'var(--text-primary)',
  text2:    'var(--text-secondary)',
  text3:    'var(--text-tertiary)',
  muted:    'var(--text-muted)',
  border:   'var(--border)',
  border2:  'var(--border2)',
  border3:  'var(--border3)',
  divider:  'var(--divider)',
  page:     'var(--bg-page)',
};

// ─── 전역 테마 컨텍스트 ───
const ThemeCtx = React.createContext(THEMES[0]);
function useTheme() { return React.useContext(ThemeCtx); }

// ─── 반응형 훅 ───
function useResponsive() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return { isMob: width < 768, isTablet: width >= 768 && width < 1024, isDesktop: width >= 1024, width };
}

// ─── 동물 이모지 ───
const ANIMALS = ['🐻','🐱','🐶','🐰','🦊','🐼','🐨','🐸','🐧','🦝','🐺','🦁','🐮','🐹','🦔','🐻‍❄️'];


// ============================================================
