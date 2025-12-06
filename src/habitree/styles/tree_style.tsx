import { StyleSheet, Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const treeStyles = StyleSheet.create({
  // shared / standard
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  noItemsText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    bottom: windowHeight * 0.02,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgb(25, 145, 137)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
  },

  // tree specific (aus TreeView.tsx übernommen)
  treeImage: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.35,
    alignSelf: 'center',
    marginVertical: 24,
  },
  treeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  treeHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  treeCanvas: {
    width: windowWidth * 0.95,
    height: windowHeight * 0.45,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    padding: 12,
  },
});