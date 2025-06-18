# 📁 Estrutura do Código Fonte

Este diretório contém todo o código fonte principal do aplicativo Menu Digital para Pizzaria Boulevard.

## 🗂️ Organização das Pastas

### `/app`
Contém as rotas e a configuração de navegação do aplicativo. Aqui estão definidas todas as telas e suas relações de navegação.

### `/assets`
Recursos estáticos como imagens, ícones, fontes e outros arquivos multimídia utilizados no aplicativo.

### `/components`
Componentes React Native reutilizáveis em todo o aplicativo. Cada componente deve ser independente e seguir o princípio de responsabilidade única.

### `/context`
Implementações do Context API do React para gerenciamento de estado global. Inclui:
- Autenticação
- Carrinho de compras
- Estado do pedido
- Configurações do usuário

### `/model`
Definições de tipos TypeScript, interfaces e modelos de dados utilizados em todo o aplicativo.

### `/service`
Serviços e integrações com APIs externas, incluindo:
- Autenticação
- Gerenciamento de pedidos
- Integração com backend
- Serviços de pagamento

### `/styles`
Estilos globais, temas e configurações de UI compartilhadas em todo o aplicativo.

## 📝 Convenções de Código

1. **Nomenclatura de Arquivos**
   - Componentes: PascalCase (ex: `Button.tsx`)
   - Utilitários: camelCase (ex: `formatPrice.ts`)
   - Estilos: camelCase (ex: `buttonStyles.ts`)

2. **Organização de Componentes**
   - Cada componente deve ter seu próprio diretório
   - Incluir arquivos de teste junto ao componente
   - Documentar props e tipos

3. **Estilização**
   - Utilizar Tailwind CSS para estilos
   - Manter consistência com o design system
   - Evitar estilos inline

## 🔄 Fluxo de Dados

1. **Estado Global**
   - Utilizar Context API para estado compartilhado
   - Manter estados locais em componentes quando apropriado

2. **Comunicação com Backend**
   - Centralizar chamadas de API em serviços
   - Implementar tratamento de erros consistente
   - Utilizar tipos TypeScript para respostas da API

## 🧪 Testes

- Implementar testes unitários para componentes
- Testar integrações com serviços externos
- Manter cobertura de testes adequada

## 📚 Documentação

- Documentar componentes complexos
- Manter READMEs atualizados
- Incluir exemplos de uso quando necessário 