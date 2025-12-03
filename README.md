# 💊 MedReminder – Sistema de Lembretes de Medicamentos  
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Acessibilidade](https://img.shields.io/badge/Acessibilidade-Alto%20Contraste-green)
![Tecnologia](https://img.shields.io/badge/Tecnologia-HTML%2FCSS%2FJS-orange)

## 📋 Visão Geral
O **MedReminder** é um aplicativo web criado especialmente para **idosos** e pessoas com dificuldade de memória, oferecendo uma interface **simples**, **visual**, **acessível** e extremamente intuitiva para lembretes de medicamentos.

O foco é garantir a adesão correta ao tratamento, oferecendo alarmes eficientes, registro de histórico, acessibilidade aprimorada e dados sempre salvos no dispositivo.

---

## ✨ Funcionalidades Principais

### 🚨 Sistema de Alarmes Inteligente
- Notificações visuais e sonoras no horário programado  
- Alarmes persistentes com confirmação manual  
- Teste de alarme para verificação do som  
- Verificação automática a cada 10 segundos  

### 📊 Gestão de Medicamentos
- Adição de medicamentos com **nome**, **dosagem** e **horário**  
- Lista organizada automaticamente pelo horário  
- Controle visual de status: **tomado / pendente**  
- Registro automático no histórico  

### 📈 Histórico Completo
- Registro de todas as ações realizadas  
- Filtros por tipo (adicionado, tomado, removido, alarme)  
- Exportação de dados em **JSON**  
- Limpeza seletiva do histórico  

### ♿ Recursos de Acessibilidade
- Modo **Alto Contraste**  
- Aumento/diminuição do tamanho da fonte com 1 clique  
- Design responsivo (480px → 1200px+)  
- Destaque de foco visual  
- Ícones intuitivos (Font Awesome)  

### 💾 Persistência de Dados
- Armazenamento local via **LocalStorage**  
- Dados salvos automaticamente  
- Funciona **offline** após o primeiro carregamento  

---

## 🛠 Tecnologias Utilizadas
- **HTML5** – Estrutura semântica  
- **CSS3** – Design responsivo com variáveis CSS  
- **JavaScript Vanilla** – Lógica da aplicação  
- **SweetAlert2** – Alertas e modais  
- **Font Awesome** – Ícones  
- **LocalStorage API** – Persistência  

---

## 📱 Interface do Usuário

### 🔹 Medicamentos Ativos
- Formulário simples de adição  
- Lista organizada por horário  
- Botões: **Tomei**, **Remover**  
- Contador visual de medicamentos pendentes  

### 🔹 Histórico de Atividades
- Tabela com data/hora  
- Cores de status  
- Exportar dados  
- Limpar histórico  

### 🔹 Fluxo Guiado (3 Passos)
1. Adicionar medicamento  
2. Aguardar o alarme  
3. Confirmar a tomada  

---

## 🚀 Como Usar

### 📌 Instalação Local
```bash
# Clone ou baixe o projeto
git clone https://github.com/AliceFerreira1/MedReminder-hackathon

# Entre no diretório
cd medreminder

# Abra o arquivo
index.html
```
✔ Não requer servidor  
✔ Funciona em qualquer navegador moderno  

### 🌐 Uso Online
- Compatível com Chrome, Firefox, Edge e Safari  
- Funciona **offline** após carregamento inicial  

---

## ⚙️ Funcionalidades Técnicas

### 🔔 Sistema de Alarmes
- Loop de verificação: **10 segundos**  
- Som pré-carregado para melhorar compatibilidade  
- Alarme desativa sozinho após **5 minutos**  

### 🗃 Estrutura dos Dados
```javascript
medications = [
  {
    id: Number,
    name: String,
    dosage: String,
    time: String, // HH:MM
    taken: Boolean,
    addedDate: ISOString
  }
];

history = [
  {
    type: String, // 'medication_added', 'medication_taken', etc.
    timestamp: ISOString,
    details: Object
  }
];
```

---

## 📁 Estrutura do Projeto
```
medreminder/
│
├── index.html          # Arquivo principal
├── assets/
│   └── sound.mp3       # Som do alarme
│
└── README.md           # Documentação
```

---

## 🎯 Público-Alvo
- Idosos em uso contínuo de medicamentos  
- Cuidadores  
- Pessoas com dificuldades de memória  
- Usuários que buscam simplicidade e acessibilidade  

---

## 🔒 Privacidade e Segurança
- Nenhuma informação é enviada para servidores  
- Dados 100% armazenados localmente  
- Sem login, sem cadastro  
- Exportação controlada pelo usuário  

---

## 🌐 Compatibilidade
- **Navegadores:** Chrome 60+, Firefox 55+, Safari 11+, Edge 79+  
- **Dispositivos:** Desktop, Tablet, Smartphone  
- **Sistemas:** Windows, macOS, Linux, Android, iOS  
- **Offline:** Funciona após o primeiro carregamento  

---

## 📊 Métricas de Usabilidade
- Tempo de aprendizado estimado: **< 5 min**  
- Passos para adicionar medicamento: **3**  
- Ações principais sempre visíveis  
- Resposta da interface **< 100ms**  

---

## 🚧 Limitações Conhecidas
- Limite de armazenamento do LocalStorage  
- Audio pode exigir interação inicial do usuário (política do navegador)  
- Sem notificações push fora da aba ativa  
- Sem sincronização entre dispositivos  

---

## 🔮 Roadmap Futuro
- Notificações push mobile  
- Sincronização em nuvem  
- Relatórios por e-mail  
- Modo noturno automático  
- Múltiplos idiomas  
- Backup automático  
- Integração com calendário  

---

## 🤝 Contribuição
Contribuições são bem-vindas para:
- Melhorias de acessibilidade  
- Correções de bugs  
- Novos recursos  
- Traduções  

Sinta-se livre para abrir **issues** ou enviar **pull requests**.

---

## 📜 Licença
Este projeto foi desenvolvido para um hackathon com foco em acessibilidade.  
Licença aberta para uso educacional e pessoal.
