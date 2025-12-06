import { StyleSheet, Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const inventoryStyles = StyleSheet.create({
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

  // inventory specific (aus InventoryView.tsx übernommen)
  erfolgeTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
    marginTop: 90,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'rgb(25, 145, 137)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});