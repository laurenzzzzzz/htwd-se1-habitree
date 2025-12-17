import React from 'react';
import { ThemedText } from './ThemedText';
import { View } from 'react-native';
import { quoteBannerStyles } from '../../styles/quotebanner_style';
import { Quote } from '../../domain/entities/Quote';

type Props = {
  quote: Quote | null;
};

export const QuoteBanner: React.FC<Props> = ({ quote }) => {
  const displayQuote = quote?.getFormattedQuote() || 'Lade Tagesspruch...';
  return (
    <View style={quoteBannerStyles.container}>
      <ThemedText style={quoteBannerStyles.text}>
        <ThemedText style={[quoteBannerStyles.text, { fontWeight: 'bold' }]}>Tagesspruch:</ThemedText> {displayQuote}
      </ThemedText>
    </View>
  );
};

export default QuoteBanner;
