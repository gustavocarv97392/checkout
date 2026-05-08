# Checkout Page - Ateliê Marisol

Uma página de checkout moderna e responsiva desenvolvida com HTML, CSS e JavaScript puro.

## 🚀 Funcionalidades

### ✅ Formulários Completos
- **Dados Pessoais**: Nome, e-mail, telefone, CPF e data de nascimento
- **Endereço de Entrega**: Busca automática de CEP via API ViaCEP
- **Forma de Entrega**: SEDEX, PAC e Entrega Expressa
- **Pagamento**: Cartão de crédito, PIX e Boleto

### 🎨 Design Moderno
- Interface limpa e profissional
- Gradientes e sombras suaves
- Ícones Font Awesome
- Totalmente responsivo (mobile, tablet e desktop)
- Animações e transições suaves

### 🔒 Validações
- **E-mail**: Formato válido
- **CPF**: Validação completa com algoritmo oficial
- **Telefone**: Formato brasileiro (10 ou 11 dígitos)
- **CEP**: 8 dígitos
- **Cartão de Crédito**: Número, validade e CVV
- Mensagens de erro em tempo real

### 💳 Máscaras de Entrada
- Telefone: (00) 00000-0000
- CPF: 000.000.000-00
- CEP: 00000-000
- Cartão: 0000 0000 0000 0000
- Validade: MM/AA

### 🎁 Sistema de Cupons
Cupons válidos para teste:
- **DESCONTO10**: 10% de desconto
- **PRIMEIRACOMPRA**: 15% de desconto
- **BEMVINDO**: 5% de desconto

### 📦 Resumo do Pedido
- Lista de produtos com imagens
- Cálculo automático de subtotal
- Seleção de frete
- Aplicação de descontos
- Total atualizado em tempo real

### 🎯 Recursos Adicionais
- Busca automática de endereço por CEP
- Múltiplas opções de pagamento
- Modal de confirmação de pedido
- Badges de segurança
- Barra de progresso do checkout

## 📁 Estrutura de Arquivos

```
checkout-page/
├── index.html      # Estrutura HTML
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Documentação
```

## 🌐 Como Usar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Preencha os dados do formulário
3. Teste a busca de CEP
4. Selecione a forma de entrega
5. Escolha o método de pagamento
6. Aplique um cupom (opcional)
7. Clique em "Finalizar Pedido"

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, animações
- **JavaScript ES6+**: Classes, async/await, fetch API
- **Font Awesome 6.4.0**: Ícones
- **ViaCEP API**: Busca de endereços

## 📱 Responsividade

O layout se adapta automaticamente para:
- **Desktop**: Layout em 2 colunas
- **Tablet**: Layout otimizado
- **Mobile**: Layout em 1 coluna

## 🎨 Paleta de Cores

- **Primary**: #FF69B4 (Rosa)
- **Secondary**: #4A90E2 (Azul)
- **Success**: #4CAF50 (Verde)
- **Error**: #F44336 (Vermelho)
- **Warning**: #FF9800 (Laranja)

## 🔧 Personalização

Para personalizar o checkout:

1. **Cores**: Edite as variáveis CSS em `:root` no `styles.css`
2. **Produtos**: Modifique a seção `.summary-products` no `index.html`
3. **Preços**: Ajuste o objeto `prices` no `script.js`
4. **Cupons**: Adicione/remova no objeto `validCoupons` no `script.js`

## 📝 Notas

- A validação de CPF usa o algoritmo oficial brasileiro
- A busca de CEP usa a API pública do ViaCEP
- Os cupons são apenas para demonstração
- O processamento de pagamento é simulado

## 🚀 Melhorias Futuras

- Integração com gateway de pagamento real
- Salvamento de dados no localStorage
- Múltiplos endereços de entrega
- Histórico de pedidos
- Integração com backend

---

Desenvolvido com ❤️ para demonstração de checkout e-commerce
