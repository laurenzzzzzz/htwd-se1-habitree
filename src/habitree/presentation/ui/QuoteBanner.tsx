import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';

type Props = {
  quote: { id: number; quote: string } | null;
};

export const QuoteBanner: React.FC<Props> = ({ quote }) => {
  return (
    <View style={{ marginVertical: 8 }}>
      <ThemedText style={{ fontStyle: 'italic', opacity: 0.9 }}>
        Tagesspruch: "{quote?.quote || 'Lade Tagesspruch...'}"
      </ThemedText>
    </View>
  );
};

export default QuoteBanner;
