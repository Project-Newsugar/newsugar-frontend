import type { LocalNewsItem } from '../types/news';

export const CATEGORIES = ['정치', '경제', '과학/기술', '스포츠', '문화', '국제'] as const;

export const CATEGORY_SUMMARIES: Record<string, string> = {
  '경제': '경제 분야 주요 소식입니다. 글로벌 경제가 예상을 뛰어넘는 회복세를 보이고 있으며, 소비자 신뢰지수가 크게 상승했습니다. 기업들의 투자도 증가세를 보이며 올해 경제 성장률이 당초 전망치를 상회할 것으로 예측됩니다.',
  '과학/기술': '과학/기술 분야의 혁신이 계속되고 있습니다. 국내 연구진이 개발한 차세대 AI 알고리즘이 기존 대비 획기적인 성능 개선을 이루며 업계의 주목을 받고 있습니다. 에너지 효율성 개선으로 실용화 가능성도 크게 높아졌습니다.',
  '스포츠': '스포츠 분야에서 흥미진진한 경기들이 펼쳐지고 있습니다. 프리미어리그에서는 극적인 역전승이 나오며 우승 경쟁이 더욱 치열해지고 있으며, 국내외 주요 리그에서도 예측 불가능한 명승부가 이어지고 있습니다.',
  '정치': '정치 분야의 주요 동향입니다. 국회에서 중요 법안들이 논의되고 있으며, 여야 간 협상이 활발히 진행되고 있습니다.',
  '문화': '문화 분야의 다양한 소식들입니다. 새로운 전시와 공연이 관객들의 큰 호응을 얻고 있으며, K-문화의 글로벌 확산이 계속되고 있습니다.',
  '국제': '국제 무대의 주요 소식입니다. 주요국들 간의 외교 회담이 진행되며 국제 협력 강화 방안이 논의되고 있습니다.'
};

export const NEWS_DATA: LocalNewsItem[] = [
  {
    id: 1,
    title: '국회 예산안 처리 막바지 협상',
    content: '내년도 예산안 처리를 앞두고 여야 간 막바지 협상이 진행되고 있습니다. 주요 쟁점 사업들에 대한 조율이 이뤄지고 있습니다.',
    date: '2024-12-08T09:00:00Z',
    source: '정치뉴스',
    author: '홍길동 기자',
    imageUrl: 'https://example.com/news/1.jpg',
    summary: '내년도 예산안 협상이 막바지에 다다랐습니다.',
    tags: '정치',
    originalUrl: 'https://example.com/news/1'
  },
  {
    id: 2,
    title: '지방자치법 개정안 본회의 통과',
    content: '지방자치단체의 자율성을 강화하는 내용의 지방자치법 개정안이 국회 본회의를 통과했습니다.',
    date: '2024-12-07T14:30:00Z',
    source: '연합뉴스',
    author: '김철수 기자',
    imageUrl: 'https://example.com/news/2.jpg',
    summary: '지방자치법 개정안이 국회 본회의를 통과했습니다.',
    tags: '정치',
    originalUrl: 'https://example.com/news/2'
  },
  {
    id: 3,
    title: '소비자 신뢰지수 5년 만에 최고치 기록',
    content: '국내 소비자 신뢰지수가 5년 만에 최고치를 기록하며 경제 회복세가 가시화되고 있습니다. 한국은행이 발표한 12월 소비자심리지수는 108.5를 기록했습니다.',
    date: '2024-12-08T10:23:00Z',
    source: '경제일보',
    author: '이경제 기자',
    imageUrl: 'https://example.com/news/3.jpg',
    summary: '소비자 신뢰지수가 5년 만에 최고치를 기록했습니다.',
    tags: '경제',
    originalUrl: 'https://example.com/news/3'
  },
  {
    id: 4,
    title: '대기업 투자 확대, 올해 목표치 초과 달성',
    content: '국내 주요 대기업들이 올해 투자 목표치를 조기 달성하며 적극적인 투자 행보를 이어가고 있습니다. 10대 그룹의 투자액이 계획 대비 15% 이상 증가했습니다.',
    date: '2024-12-08T11:00:00Z',
    source: '비즈니스포스트',
    author: '박영수 기자',
    imageUrl: 'https://example.com/news/4.jpg',
    summary: '대기업 투자가 계획 대비 15% 증가했습니다.',
    tags: '경제',
    originalUrl: 'https://example.com/news/4'
  },
  {
    id: 5,
    title: '반도체 수출 3개월 연속 증가세',
    content: '반도체 수출이 3개월 연속 증가세를 보이며 수출 회복을 주도하고 있습니다. 전년 동기 대비 25% 증가한 것으로 나타났습니다.',
    date: '2024-12-07T08:45:00Z',
    source: '한국경제',
    author: '최민호 기자',
    imageUrl: 'https://example.com/news/5.jpg',
    summary: '반도체 수출이 3개월 연속 증가했습니다.',
    tags: '경제',
    originalUrl: 'https://example.com/news/5'
  },
  {
    id: 6,
    title: '국내 연구진, 차세대 AI 알고리즘 개발',
    content: '국내 연구진이 기존 AI 알고리즘 대비 성능이 획기적으로 향상된 차세대 AI 알고리즘을 개발했습니다. 이 알고리즘은 다양한 산업 분야에 적용될 전망입니다.',
    date: '2024-12-08T12:15:00Z',
    source: '과학기술뉴스',
    author: '정다은 기자',
    imageUrl: 'https://example.com/news/6.jpg',
    summary: '국내 연구진이 차세대 AI 알고리즘을 개발했습니다.',
    tags: '과학/기술',
    originalUrl: 'https://example.com/news/6'
  },
  {
    id: 7,
    title: '신재생에너지 효율성 대폭 개선',
    content: '신재생에너지의 효율성이 대폭 개선되면서 상용화 가능성이 높아지고 있습니다. 특히 태양광 패널의 발전 효율이 30% 이상 향상되었습니다.',
    date: '2024-12-07T16:00:00Z',
    source: '에너지뉴스',
    author: '이수진 기자',
    imageUrl: 'https://example.com/news/7.jpg',
    summary: '신재생에너지 효율성이 크게 개선되었습니다.',
    tags: '과학/기술',
    originalUrl: 'https://example.com/news/7'
  },
  {
    id: 8,
    title: '프리미어리그, 극적인 역전승으로 우승 경쟁 치열',
    content: '프리미어리그에서 극적인 역전승이 이어지며 우승 경쟁이 더욱 치열해지고 있습니다. 최근 경기에서는 리버풀이 후반 추가 시간에 결승골을 터뜨렸습니다.',
    date: '2024-12-08T20:30:00Z',
    source: '스포츠뉴스',
    author: '김영호 기자',
    imageUrl: 'https://example.com/news/8.jpg',
    summary: '프리미어리그에서 극적인 역전승이 이어지고 있습니다.',
    tags: '스포츠',
    originalUrl: 'https://example.com/news/8'
  },
  {
    id: 9,
    title: '국내 야구팀, 아시아 시리즈 우승 차지',
    content: '국내 프로야구팀이 아시아 시리즈에서 우승을 차지하며 국제 무대에서의 위상을 높였습니다. 결승전에서 일본 팀을 상대로 승리를 거뒀습니다.',
    date: '2024-12-07T19:00:00Z',
    source: '야구뉴스',
    author: '최지훈 기자',
    imageUrl: 'https://example.com/news/9.jpg',
    summary: '국내 야구팀이 아시아 시리즈에서 우승을 차지했습니다.',
    tags: '스포츠',
    originalUrl: 'https://example.com/news/9'
  }
];