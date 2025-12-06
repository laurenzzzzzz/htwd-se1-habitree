import { StyleSheet } from 'react-native';

export const habitModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  scrollView: {
    maxHeight: 300,
  },
  subtitle: {
    marginBottom: 12,
  },
  predefinedItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  predefinedLabel: {
    fontWeight: '500',
  },
  predefinedDescription: {
    opacity: 0.7,
    marginTop: 4,
  },
  spacer: {
    height: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  marginTop: {
    marginTop: 12,
  },
});
