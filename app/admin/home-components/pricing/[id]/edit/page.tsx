'use client';

import React from 'react';
import HomeComponentLegacyEditor from '../../../_shared/legacy/HomeComponentLegacyEditor';

export default function PricingEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <HomeComponentLegacyEditor params={params} />;
}
