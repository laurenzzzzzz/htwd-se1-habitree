import { StyleSheet, Dimensions } from 'react-native';const { width: windowWidth, height: windowHeight } = Dimensions.get('window');export const calendarStyles = StyleSheet.create({  // shared / standard  container: {    flex: 1,    padding: 16,    backgroundColor: 'transparent',  },  contentContainer: {    padding: 16,  },  loadingContainer: {    flex: 1,    justifyContent: 'center',    alignItems: 'center',    backgroundColor: 'white',  },  modalBackdrop: {    flex: 1,    backgroundColor: '#00000088',    justifyContent: 'center',    alignItems: 'center',  },  modalContent: {    backgroundColor: 'white',    padding: 24,    borderRadius: 12,    width: '85%',    shadowColor: '#000',    shadowOpacity: 0.2,    shadowRadius: 8,    elevation: 5,    alignItems: 'center',  },  textInput: {    borderWidth: 1,    borderColor: '#ccc',    borderRadius: 8,    padding: 8,    fontSize: 16,    marginBottom: 10,    backgroundColor: 'white',  },  sectionTitle: {    marginBottom: 12,    fontSize: 20,    fontWeight: '600',  },  titleContainer: {    flexDirection: 'row',    alignItems: 'center',    gap: 8,    marginBottom: 12,  },  greetingText: {    fontSize: 20,  },  noItemsText: {    color: '#888',    fontStyle: 'italic',    textAlign: 'center',    marginVertical: 16,  },  fab: {    position: 'absolute',    bottom: windowHeight * 0.02,    right: 20,    width: 56,    height: 56,    borderRadius: 28,    backgroundColor: 'rgb(25, 145, 137)',    alignItems: 'center',    justifyContent: 'center',    elevation: 6,    shadowColor: '#000',    shadowOpacity: 0.3,    shadowRadius: 6,  },  fabText: {    color: 'white',    fontSize: 32,    fontWeight: '600',    lineHeight: 40,  },  // calendar specific
  calendarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  calendarDay: {
    width: (windowWidth - 64) / 7,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  calendarDayText: {
    fontSize: 12,
    color: '#222',
  },
  calendarEventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgb(25, 145, 137)',
    marginTop: 4,
  },
});