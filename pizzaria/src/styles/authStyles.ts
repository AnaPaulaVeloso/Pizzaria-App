import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    logo: {
        width: 320,
        height: 100,
    },
    container: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    button: {
        backgroundColor: '#8C030E',
        width: '90%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#8C030E',
        fontSize: 16,
        marginTop: 10,
    },
}); 