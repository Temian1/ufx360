import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { PromoOffer } from '../types';

interface PromotionsViewProps {
  promos: PromoOffer[];
  onClaim: (promoId: string) => void;
}

const PromotionsView: React.FC<PromotionsViewProps> = ({ promos, onClaim }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 space-y-3">
      <div className="bg-gradient-to-r from-primary to-green-800 text-white rounded-md p-3">
        <h2 className="text-lg font-bold">{t('promotions.title')}</h2>
        <p className="text-xs text-green-100">{t('promotions.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {promos.map((promo) => (
          <div key={promo.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold text-gray-800 dark:text-white">{promo.title}</h3>
              <span className="text-xxs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{promo.tag}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{promo.description}</p>
            <button
              onClick={() => onClaim(promo.id)}
              disabled={promo.claimed}
              className={`mt-3 px-4 py-2 rounded text-sm font-bold ${
                promo.claimed ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-bet-yellow text-black'
              }`}
            >
              {promo.claimed ? t('promotions.claimed') : t('promotions.claim_offer')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsView;
