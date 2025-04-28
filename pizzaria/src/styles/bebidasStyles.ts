import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4b5563',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#8C030E',
    width: '48%',
    marginHorizontal: 2,
  },
  unselectedButton: {
    backgroundColor: '#e5e7eb',
    width: '48%',
    marginHorizontal: 2,
  },
}); 