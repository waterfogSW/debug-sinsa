'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { incrementOfferingCount } from '@/store/features/offerings/offeringsSlice';
import { DEFAULT_OFFERINGS } from '@/common/constants/defaultValues';
import { OfferingId } from '@/common/enums/OfferingId';

export default function OfferingActionsSectionContent() {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState<OfferingId | null>(null);

  const handleOffer = async (offeringId: OfferingId) => {
    setIsSubmitting(offeringId);
    try {
      await dispatch(incrementOfferingCount(offeringId)).unwrap();
    } catch (error) {
      console.error(`Error offering ${offeringId} via Redux:`, error);
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
          disabled={isSubmitting === offering.id}
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