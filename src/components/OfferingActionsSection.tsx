'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { incrementOfferingCount } from '@/store/features/offerings/offeringsSlice';
import { DEFAULT_OFFERINGS } from '@/common/constants/defaultValues';
import { OfferingId } from '@/common/enums/OfferingId';
// import { incrementOfferingCount as incrementOfferingAPI } from '@/services/api'; // Redux thunk 사용으로 대체

export default function OfferingActionsSectionContent() {
  const dispatch = useDispatch<AppDispatch>();
  // 각 버튼의 개별적인 제출 상태를 관리하기 위해 로컬 상태 유지
  const [isSubmitting, setIsSubmitting] = useState<OfferingId | null>(null);

  const handleOffer = async (offeringId: OfferingId) => {
    setIsSubmitting(offeringId);
    try {
      // Redux thunk 디스패치, unwrap()으로 프로미스 결과 처리 및 에러 핸들링 가능
      await dispatch(incrementOfferingCount(offeringId)).unwrap();
      // 성공 시 로직 (예: 알림)은 thunk 내부 또는 fulfilled 리듀서에서 처리될 수 있음
      // offeringsSlice의 incrementOfferingCount는 성공 시 fetchOfferings를 호출하고 customStatUpdate 이벤트를 발생시킴
      // 따라서 여기서 window.dispatchEvent는 제거
    } catch (error) {
      // unwrap() 사용 시 thunk에서 reject된 경우 여기로 에러가 전달됨
      console.error(`Error offering ${offeringId} via Redux:`, error);
      // 사용자에게 실패 알림 (예: 토스트 메시지)
      // alert 창은 그대로 두거나, 좀 더 나은 UI 피드백 방식으로 변경 고려
      alert(`오류 발생: ${offeringId} 공물 바치기 실패 (Redux)`); 
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3 items-center">
      {DEFAULT_OFFERINGS.map((offering) => (
        <motion.button
          key={offering.id}
          onClick={() => handleOffer(offering.id)}
          disabled={isSubmitting === offering.id} // 로컬 isSubmitting 상태 사용
          title={offering.name}
          className="p-2 sm:p-3 bg-dark-lighter/70 hover:bg-primary/30 border border-primary/20 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center aspect-square"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-2xl sm:text-3xl">{offering.icon}</span>
          {isSubmitting === offering.id && 
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <span className="animate-spin text-xl">🌀</span>
            </div>
          }
        </motion.button>
      ))}
    </div>
  );
} 