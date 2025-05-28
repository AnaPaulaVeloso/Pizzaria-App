import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { API_BASE_URL_ML } from '../../service/config';
import { styles } from '../../styles/pedidoStyles';
import { usePedidoInfo } from '../../context/pedidoInfoContext';
import { useCarrinho } from '../../context/CarrinhoContext';

export default function PedidoScreen() {
  const { salvarPedidoInfo, atendenteLogado } = usePedidoInfo();
  const { pedidosPendentes, carregarPedidosPendentes } = useCarrinho();
  const [mesa, setMesa] = useState('');
  const [quantidadePessoas, setQuantidadePessoas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarPedidosPendentes();
  }, []);

  const validarCampos = () => {
    if (!mesa.trim()) {
      Alert.alert('Erro', 'Por favor, informe o número da mesa.');
      return false;
    }

    if (!quantidadePessoas.trim()) {
      Alert.alert('Erro', 'Por favor, informe a quantidade de pessoas.');
      return false;
    }

    const qtdPessoas = parseInt(quantidadePessoas);
    if (isNaN(qtdPessoas) || qtdPessoas <= 0) {
      Alert.alert('Erro', 'A quantidade de pessoas deve ser um número maior que zero.');
      return false;
    }

    return true;
  };

  const handleIniciarAtendimento = async () => {
    if (!validarCampos()) return;

    if (!atendenteLogado) {
      Alert.alert('Erro', 'Nenhum atendente logado. Por favor, faça login novamente.');
      router.replace('/');
      return;
    }

    // Verifica se a mesa já está ocupada
    const mesaOcupada = pedidosPendentes.some(
      pedido => pedido.mesa === mesa && 
      (pedido.status === 'pendente' || pedido.status === 'em preparo')
    );

    if (mesaOcupada) {
      Alert.alert(
        'Mesa Ocupada',
        'Esta mesa já está em atendimento. Deseja adicionar itens ao pedido existente?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Adicionar Itens',
            onPress: async () => {
              setIsLoading(true);
              try {
                const pedidoExistente = pedidosPendentes.find(
                  p => p.mesa === mesa && 
                  (p.status === 'pendente' || p.status === 'em preparo')
                );

                if (pedidoExistente) {
                  await salvarPedidoInfo({
                    mesa: pedidoExistente.mesa,
                    n_cracha_atendente: atendenteLogado.n_cracha,
                    nome_atendente: atendenteLogado.nome,
                    quantidadePessoas: pedidoExistente.quantidadePessoas,
                    dataInicio: pedidoExistente.dataInicio,
                    itens: pedidoExistente.itens,
                    valorTotal: pedidoExistente.valorTotal
                  });
                  router.push('/(tabs)');
                }
              } catch (error) {
                console.error('Erro ao adicionar itens:', error);
                Alert.alert('Erro', 'Não foi possível adicionar itens ao pedido.');
              } finally {
                setIsLoading(false);
              }
            }
          }
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const dataAtual = new Date().toISOString();
      await salvarPedidoInfo({
        mesa,
        n_cracha_atendente: atendenteLogado.n_cracha,
        nome_atendente: atendenteLogado.nome,
        quantidadePessoas: parseInt(quantidadePessoas),
        dataInicio: dataAtual,
        itens: [],
        valorTotal: 0
      });
      router.push('/(tabs)');
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o atendimento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <View style={styles.containerLogo}>
        <Image source={require("../../assets/B1.png")} style={styles.logo} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Número da Mesa</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o número da mesa"
            value={mesa}
            onChangeText={setMesa}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Quantidade de Pessoas</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a quantidade de pessoas"
            value={quantidadePessoas}
            onChangeText={setQuantidadePessoas}
            keyboardType="numeric"
            maxLength={2}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleIniciarAtendimento}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Atendimento</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

