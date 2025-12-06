import { StyleSheet, Dimensions } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

export const calendarViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    marginVertical: 20,
    borderRadius: 10,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
});
