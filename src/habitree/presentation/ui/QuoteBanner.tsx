import React from 'react';
import { ThemedText } from './ThemedText';
import { View } from 'react-native';
import { quoteBannerStyles } from '../../styles/quotebanner_style';
import { Quote } from '../../domain/entities/Quote';

type Props = {
  quote: Quote | null;
};

export const QuoteBanner: React.FC<Props> = ({ quote }) => {
  return (
    <View style={quoteBannerStyles.container}>
      <ThemedText style={quoteBannerStyles.text}>
        Tagesspruch: "{quote?.getFormattedQuote() || 'Lade Tagesspruch...'}"
      </ThemedText>
    </View>
  );
};

export default QuoteBanner;
