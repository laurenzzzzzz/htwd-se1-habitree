import { StyleSheet, Dimensions } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerImage: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    height: windowHeight * 0.3,
  },
  sectionContainer: {
    marginVertical: 20,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingRowButton: {
    paddingVertical: 12,
  },
  settingRowTopBorder: {
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  authButtonsContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 12,
    paddingBottom: 40,
  },
  authButton: {
    backgroundColor: 'rgb(25, 145, 137)',
    paddingVertical: windowHeight * 0.012,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: windowWidth * 0.7,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  friendImage: {
    width: windowWidth * 0.12,  // statt: 50
    height: windowWidth * 0.12,
    borderRadius: 25,
  },
  memberSince: {
    fontSize: 14,
    color: '#888',
  },
});
