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
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  fullscreenContent: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  betweenContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 20,
  },
  /* dialog box that sits between header and tabbar
     don't stretch to fill the area; size to content and center */
  betweenContent: {
    alignSelf: 'center',
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#000',
    elevation: 3,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  scrollView: {
    /* allow content to size naturally */
  },
  /* Keep the custom form scroll area bounded so it doesn't collapse
     when the parent dialog sizes to content. */
  scrollViewCustom: {
    marginBottom: 12,
  },
  subtitle: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconButtonText: {
    fontSize: 20,
  },
  /* new: input container that holds an icon inside the text field */
  inputWithIcon: {
    width: '100%',
    position: 'relative',
  },
  inputInner: {
    flex: 1,
    paddingRight: 56,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  iconInside: {
    position: 'absolute',
    right: 8,
    top: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
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
    marginTop: 12,
  },
  fullButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(25, 145, 137)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgb(25, 145, 137)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  marginTop: {
    marginTop: 12,
  },
});
