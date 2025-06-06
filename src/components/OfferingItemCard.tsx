'use client';

import { motion } from 'framer-motion';
import { Offering } from '@/domain/Offering';
import { OfferingId } from '@/common/enums/OfferingId';
import { formatNumber } from '@/common/utils/formatters';

interface OfferingItemCardProps {
  offering: Offering;
  onAddOffering: (id: OfferingId) => void;
}

const OfferingItemCard: React.FC<OfferingItemCardProps> = ({ offering, onAddOffering }) => (
  <motion.div
    className="bg-dark-lighter/50 p-4 rounded-lg border border-primary/20 text-center cursor-pointer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onAddOffering(offering.id)}
  >
    <span className="text-4xl mb-2 block">{offering.icon}</span>
    <div className="text-gray-200 font-bold text-xl mb-1">
      {formatNumber(offering.count)}
    </div>
    <div className="text-gray-400 text-sm">{offering.name}</div>
  </motion.div>
);

export default OfferingItemCard; 
