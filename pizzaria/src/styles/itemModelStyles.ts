import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    detalhesImagem: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    detalhesContainer: {
        padding: 16,
    },
    detalhesTitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    detalhesIngredientes: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    detalhesPreco: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8C030E',
        marginBottom: 24,
    },
    quantidadeContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    quantidadeBotoes: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantidadeBotao: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantidadeBotaoTexto: {
        fontSize: 20,
        color: '#333',
    },
    quantidadeTexto: {
        fontSize: 18,
        marginHorizontal: 16,
        color: '#333',
    },
    bordaContainer: {
        marginBottom: 24,
    },
    bordaBotoes: {
        flexDirection: 'row',
        marginTop: 8,
    },
    bordaBotao: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        alignItems: 'center',
    },
    bordaBotaoSelecionado: {
        backgroundColor: '#8C030E',
    },
    bordaBotaoTexto: {
        color: '#333',
    },
    observacaoContainer: {
        marginBottom: 24,
    },
    observacaoInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    botao: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        flex: 1,
        marginHorizontal: 5,
    },
    botaoTexto: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    botaoCancelar: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#8C030E',
    },
    botaoAdicionar: {
        backgroundColor: '#8C030E',
    },
});

export default styles;
