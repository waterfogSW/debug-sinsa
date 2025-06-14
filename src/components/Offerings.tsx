'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchOfferings,
  incrementOfferingCount,
  selectAllOfferings,
  selectOfferingsStatus,
  selectOfferingsError,
  selectOfferingsUpdateStatus
} from '@/store/features/offerings/offeringsSlice';
import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import OfferingItemCard from './OfferingItemCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfferingsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const offerings = useSelector((state: RootState) => state.offerings.items);
  const offeringsStatus = useSelector((state: RootState) => state.offerings.status);
  const offeringsError = useSelector((state: RootState) => state.offerings.error);

  const isLoadingOrUpdating = offeringsStatus === 'loading';

  useEffect(() => {
    if (offeringsStatus === 'idle') {
      dispatch(fetchOfferings());
    }
  }, [dispatch, offeringsStatus]);

  // 주기적인 데이터 갱신을 위한 useEffect
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchOfferings());
    }, 30000); // 30초마다 갱신

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleAddOffering = async (offeringId: OfferingId) => {
    try {
      await dispatch(incrementOfferingCount(offeringId)).unwrap();
    } catch (error) {
      console.error('Failed to add offering:', error);
    }
  };

  let content;

  if (isLoadingOrUpdating && offerings.length === 0) {
    content = <div className="text-center py-10">공물 정보를 불러오는 중...</div>;
  } else if (offeringsStatus === 'failed' && offerings.length === 0) {
    content = <div className="text-center py-10 text-red-500">{offeringsError || '공물 정보를 불러오는데 실패했습니다.'}</div>;
  } else {
    const sortedOfferings = [...offerings].sort((a, b) => a.name.localeCompare(b.name));
    
    content = (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 transition-opacity duration-300 ${isLoadingOrUpdating ? 'opacity-50' : 'opacity-100'}`}>
        {offeringsStatus === 'failed' && offeringsError && (
          <p className="col-span-full text-center text-red-500 text-sm">에러: {offeringsError}</p>
        )}
        {sortedOfferings.length === 0 && offeringsStatus === 'succeeded' && (
          <p className="col-span-full text-center text-gray-400">받은 공물이 없습니다.</p>
        )}
        {sortedOfferings.map((offering) => (
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
