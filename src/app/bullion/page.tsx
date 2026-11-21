'use client';

import React from 'react';
import { BullionShopView } from '@/components/bullion/BullionShopView';

export default function MasterBullionPage() {
  return (
    <BullionShopView
      defaultMetal="all"
      defaultCategory="All Bullion"
      pageTitle="Investment Bullion Desk"
      pageSubtitle="Physical investment-grade minted gold & silver bars and legal tender coins. Exempt from UK VAT on gold."
    />
  );
}
