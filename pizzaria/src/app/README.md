# 📱 Rotas e Navegação

Este diretório contém todas as rotas e páginas do aplicativo Menu Digital para Pizzaria Boulevard, utilizando o sistema de roteamento do Expo Router.

## 🗂️ Estrutura de Rotas

### `/`
- **Arquivo**: `index.tsx`
- **Descrição**: Página inicial do aplicativo
- **Função**: Dashboard principal com acesso rápido às funcionalidades mais utilizadas

### `/(auth)`
- **Descrição**: Grupo de rotas relacionadas à autenticação
- **Rotas**:
  - Login
  - Registro
  - Recuperação de senha

### `/(drawer)`
- **Descrição**: Rotas acessíveis através do menu lateral
- **Rotas**:
  - Cardápio
  - Pedidos
  - Carrinho
  - Perfil
  - Configurações

## 🔄 Fluxo de Navegação

1. **Autenticação**
   - Usuário inicia no grupo `/(auth)`
   - Após login bem-sucedido, redireciona para `/(drawer)`

2. **Navegação Principal**
   - Acesso através do menu lateral
   - Navegação entre módulos mantendo o estado

## 🎨 Layout

- **Arquivo**: `_layout.tsx`
- **Função**: Define o layout base do aplicativo
- **Características**:
  - Menu lateral
  - Cabeçalho
  - Área de conteúdo principal

## 📱 Componentes de Navegação

1. **Drawer Navigator**
   - Menu lateral personalizado
   - Ícones e labels para cada rota

2. **Stack Navigator**
   - Navegação entre telas
   - Transições personalizadas

## 🔒 Proteção de Rotas

- Rotas autenticadas protegidas
- Redirecionamento automático para login
- Persistência de sessão

## 📝 Boas Práticas

1. **Organização**
   - Agrupar rotas relacionadas
   - Manter nomes de arquivos descritivos
   - Documentar parâmetros de rota

2. **Performance**
   - Lazy loading de rotas
   - Otimização de transições
   - Cache de navegação

3. **Manutenção**
   - Manter rotas organizadas
   - Documentar mudanças
   - Testar fluxos de navegação 