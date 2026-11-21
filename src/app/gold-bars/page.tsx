'use client';

import React from 'react';
import { BullionShopView } from '@/components/bullion/BullionShopView';

export default function GoldBarsPage() {
  return (
    <BullionShopView
      defaultMetal="gold"
      defaultCategory="Gold Bars"
      pageTitle="Investment Gold Bars & Coins"
      pageSubtitle="Physical investment-grade minted bars and legal tender coins from PAMP Suisse, The Royal Mint, and Valcambi. Exempt from UK VAT."
    />
  );
}
