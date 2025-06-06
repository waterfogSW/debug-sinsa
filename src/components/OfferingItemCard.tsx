'use client';

import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import CountUp from 'react-countup';
import { useState, useEffect, useRef } from 'react';

interface OfferingItemCardProps {
  offering: Offering;
  onAddOffering: (id: OfferingId) => void;
}

export default function OfferingItemCard({ offering, onAddOffering }: OfferingItemCardProps) {
  const [displayCount, setDisplayCount] = useState(offering.count);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevServerCountRef = useRef(offering.count);

  useEffect(() => {
    // 서버에서 받은 offering.count가 변경되었을 때만 실행
    if (prevServerCountRef.current !== offering.count) {
      // 현재 화면에 표시된 값과 서버 값이 다르면 애니메이션 시작
      if (displayCount !== offering.count) {
        setIsAnimating(true);
      }
      prevServerCountRef.current = offering.count;
    }
  }, [offering.count, displayCount]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    // 애니메이션이 끝나면 화면 표시 값을 서버 값으로 동기화
    setDisplayCount(offering.count);
  };
  
  const handleCardClick = () => {
    // 클릭 시, 현재 화면 값에서 1을 더해 즉시 보여줌 (애니메이션 없음)
    setDisplayCount(current => current + 1);
    onAddOffering(offering.id);
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className="bg-dark-light p-3 rounded-lg flex flex-col items-center justify-center text-center shadow-md h-full transition-all duration-300 hover:shadow-primary/30 hover:scale-105 cursor-pointer"
    >
      <span className="text-4xl">{offering.icon}</span>
      <p className="font-semibold mt-2 text-gray-200">{offering.name}</p>
      <p className="text-2xl font-bold text-accent my-2">
        {isAnimating ? (
            <CountUp 
              start={displayCount} 
              end={offering.count} 
              duration={1.5} 
              separator=","
              onEnd={handleAnimationEnd}
            />
        ) : (
          displayCount
        )}
      </p>
    </div>
  );
} 
