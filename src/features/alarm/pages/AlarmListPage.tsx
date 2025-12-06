import React from 'react'
import { Button } from '@/components/ui/Button'

const AlarmListPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-slate-900">알림</h1>
        <Button variant="ghost" className="text-xs h-8">모두 읽음</Button>
      </div>

      {/* 알림 리스트 (Placeholder) */}
      <div className="space-y-3">
        {/* 읽지 않은 알림 (파란 배경) */}
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl relative">
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="font-bold text-sm text-slate-800 mb-1">🕗 아침 뉴스 요약이 도착했습니다.</h3>
          <p className="text-xs text-slate-500">간밤에 있었던 주요 뉴스를 3분 만에 확인해보세요.</p>
          <p className="text-xs text-slate-400 mt-2">방금 전</p>
        </div>

        {/* 읽은 알림 (흰 배경) */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <h3 className="font-bold text-sm text-slate-800 mb-1">🎁 퀴즈 보상이 지급되었습니다.</h3>
          <p className="text-xs text-slate-500">어제 퀴즈 정답을 맞추셨네요! 포인트가 적립되었습니다.</p>
          <p className="text-xs text-slate-400 mt-2">12시간 전</p>
        </div>
      </div>
    </div>
  )
}

export default AlarmListPage