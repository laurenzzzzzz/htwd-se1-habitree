import { StyleSheet, Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const treeviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  treeImage: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.35,
    alignSelf: 'center',
    marginVertical: 24,
  },
  growthInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  growthText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  growthPercentage: {
    fontSize: 14,
    opacity: 0.7,
  },
});
