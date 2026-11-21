'use client';

import React from 'react';
import { BullionShopView } from '@/components/bullion/BullionShopView';

export default function SilverBullionPage() {
  return (
    <BullionShopView
      defaultMetal="silver"
      defaultCategory="Silver Bars"
      pageTitle="Silver Bullion Bars & Coins"
      pageSubtitle="Physical investment-grade fine silver bars and minted legal tender coins from LBMA good delivery refineries and The Royal Mint."
    />
  );
}
