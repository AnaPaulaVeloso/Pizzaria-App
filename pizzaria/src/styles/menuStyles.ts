import { StyleSheet } from 'react-native';

export const menuStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    cartButton: {
        backgroundColor: '#8c030e',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#e74c3c',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    cartItems: {
        flex: 1,
    },
    cartFooter: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    tableInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    tableLabel: {
        fontSize: 16,
        marginRight: 8,
        color: '#333',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        color: '#333',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8c030e',
    },
    confirmButton: {
        backgroundColor: '#8c030e',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmationContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    confirmationTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    confirmationMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 32,
        color: '#666',
    },
    newOrderButton: {
        backgroundColor: '#8c030e',
        padding: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    newOrderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    menuItemInfo: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cartItemInfo: {
        flex: 1,
    },
    cartItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartItemPrice: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    cartItemDescription: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    cartItemQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    cartContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    cartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cartItemsList: {
        flex: 1,
    },
    cartTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    finalizarButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    finalizarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    cartItemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
}); 