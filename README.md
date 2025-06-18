# Menu Digital para Pizzaria Boulevard 🍕

## 📱 Sobre o Projeto
O Menu Digital para Pizzaria Boulevard é uma solução completa desenvolvida para otimizar o processo de pedidos e gestão da pizzaria. O sistema visa eliminar problemas com pedidos manuais, reduzir filas de espera e melhorar a comunicação entre os diferentes setores do estabelecimento.

## 🎯 Funcionalidades Principais
- Registro digital de pedidos pelos garçons
- Envio automático de pedidos para caixa e cozinha
- Acompanhamento em tempo real dos pedidos
- Análise de dados com machine learning para previsão de demanda
- Compatibilidade com Android e iOS

## 🏗️ Arquitetura do Sistema

### Páginas Principais
- **Home**: Tela inicial do aplicativo
- **Cardápio**: Visualização do menu completo
- **Pedidos**: Gerenciamento de pedidos ativos
- **Carrinho**: Gestão dos itens selecionados
- **Perfil**: Configurações e informações do usuário

### Fluxo de Navegação
1. Login/Autenticação
2. Dashboard específico por perfil
3. Navegação entre módulos do sistema

## 🛠️ Tecnologias Utilizadas
- **Frontend**: React Native com Expo
- **Backend**: Node.js
- **Banco de Dados**: PostgreSQL
- **Machine Learning**: Python com TensorFlow
- **Gerenciamento de Estado**: Context API

## 👥 Equipe de Desenvolvimento
- **Iago Correia de Lima**: Requisitos e Gestão do Projeto 
- **Ana Paula Veloso**: Front-end (React Native)
- **Pérsio de Souza Lima**: Back-end (Node.js e PostgreSQL)
- **Leonardo Renner**: Machine Learning e Back-end (Python, TensorFlow)

## 📁 Estrutura do Projeto
```
pizzaria/
├── src/
│   ├── app/         # Rotas e navegação
│   ├── assets/      # Recursos estáticos
│   ├── components/  # Componentes reutilizáveis
│   ├── context/     # Gerenciamento de estado
│   ├── model/       # Definições de tipos e interfaces
│   ├── service/     # Serviços e integrações
│   └── styles/      # Estilos globais
├── .expo/           # Configurações do Expo
└── node_modules/    # Dependências
```

## 🚀 Como Executar
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm start`
4. Escaneie o QR Code com o aplicativo Expo Go

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.