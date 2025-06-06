'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  fetchOfferings,
  incrementOfferingCount,
  selectAllOfferings,
  selectOfferingsStatus,
  selectOfferingsError,
  selectOfferingsUpdateStatus
} from '@/store/features/offerings/offeringsSlice';
import { OfferingId } from '@/common/enums/OfferingId';
import OfferingItemCard from './OfferingItemCard';

export default function OfferingsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const offerings = useSelector(selectAllOfferings);
  const offeringsStatus = useSelector(selectOfferingsStatus);
  const offeringsError = useSelector(selectOfferingsError);
  const offeringsUpdateStatus = useSelector(selectOfferingsUpdateStatus);

  useEffect(() => {
    if (offeringsStatus === 'idle') {
      dispatch(fetchOfferings());
    }

    const handleStatUpdate = () => {
      dispatch(fetchOfferings());
    };
    window.addEventListener('customStatUpdate', handleStatUpdate);

    return () => {
      window.removeEventListener('customStatUpdate', handleStatUpdate);
    };
  }, [dispatch, offeringsStatus]);

  const handleAddOffering = (id: OfferingId) => {
    dispatch(incrementOfferingCount(id));
  };

  let content;
  const isLoadingOrUpdating = offeringsStatus === 'loading' || offeringsUpdateStatus === 'loading';

  if (isLoadingOrUpdating && offerings.length === 0) {
    content = <div className="text-center py-10">공물 정보를 불러오는 중...</div>;
  } else if (offeringsStatus === 'failed' && offerings.length === 0) {
    content = <div className="text-center py-10 text-red-500">{offeringsError || '공물 정보를 불러오는데 실패했습니다.'}</div>;
  } else {
    const displayOfferings = offerings.length > 0 ? offerings : [];
    
    content = (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-opacity duration-300 ${isLoadingOrUpdating ? 'opacity-50' : 'opacity-100'}`}>
        {offeringsStatus === 'failed' && offeringsError && (
          <p className="col-span-full text-center text-red-500 text-sm">에러: {offeringsError}</p>
        )}
        {displayOfferings.length === 0 && offeringsStatus === 'succeeded' && (
          <p className="col-span-full text-center text-gray-400">받은 공물이 없습니다.</p>
        )}
        {displayOfferings.map((offering) => (
          <OfferingItemCard 
            key={offering.id} 
            offering={offering} 
            onAddOffering={handleAddOffering}
          />
        ))}
      </div>
    );
  }

  return <>{content}</>;
} 
