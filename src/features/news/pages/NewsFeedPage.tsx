import React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const NewsFeedPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. 상단 검색 및 필터 영역 */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">주요 뉴스</h1>
        
        <Input 
          placeholder="관심있는 키워드를 검색해보세요" 
          className="bg-slate-50"
        />

        {/* 가로 스크롤 메뉴 (index.css의 scrollbar-hide 적용됨) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="primary" className="whitespace-nowrap rounded-full px-6">전체</Button>
          <Button variant="outline" className="whitespace-nowrap rounded-full px-6">정치</Button>
          <Button variant="outline" className="whitespace-nowrap rounded-full px-6">경제</Button>
          <Button variant="outline" className="whitespace-nowrap rounded-full px-6">사회</Button>
          <Button variant="outline" className="whitespace-nowrap rounded-full px-6">IT/과학</Button>
        </div>
      </section>

      {/* 2. 뉴스 리스트 (Placeholder) */}
      <section className="grid gap-4">
        {/* 팀원이 여기에 실제 뉴스 카드 컴포넌트를 만들어서 넣으면 됩니다. */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition cursor-pointer bg-white">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-600">경제</span>
              <span className="text-xs text-slate-400">10분 전</span>
            </div>
            {/* line-clamp-2: 플러그인 설치 완료되어 정상 동작함 */}
            <h3 className="font-bold text-lg mb-1 line-clamp-2">
              [예시] 삼성전자, AI 반도체 시장 점유율 1위 탈환... 주가 5% 급등
            </h3>
            <p className="text-sm text-slate-500 line-clamp-2">
              삼성전자가 차세대 HBM 시장에서 엔비디아와의 대규모 계약을 체결하며...
            </p>
          </div>
        ))}
      </section>

      {/* 더보기 버튼 */}
      <Button variant="ghost" fullWidth className="text-slate-500">
        뉴스 더보기
      </Button>
    </div>
  )
}

export default NewsFeedPage