# 🏋️ PowerTable – Painel Interativo para Campeonatos de Powerlifting

**PowerTable** é uma aplicação em tempo real para a gestão visual de tentativas em campeonatos de powerlifting. Desenvolvido com foco em **eficiência operacional para juízes e organizadores**, o sistema exibe tentativas, cargas e resultados com uma interface clara, moderna e responsiva.

---

## 📸 Demonstração

[Demonstração da aplicação](https://github.com/user-attachments/assets/021898a6-a1ea-4662-9c00-ff76d8fa0421)

---

## 🚀 Tecnologias Utilizadas

- **Next.js (App Router)** – SSR/SSG + renderização híbrida
- **React + Tailwind CSS** – UI reativa e estilização moderna
- **Socket.IO** – Comunicação em tempo real entre operador e painel
- **Express.js** – Backend simples e escalável
- **Node.js** – Servidor HTTP e manipulação de dados
- **CSV Parsing (em progresso)** – Importação de competidores para automação das tentativas

---

## ✨ Funcionalidades

- Exibição em **tempo real** dos dados do atleta: nome, categoria, peso corporal e tentativa atual
- Atualização instantânea de resultados: **LIFT VÁLIDO** ou **NO LIFT**
- **Ranking dinâmico** baseado nas melhores tentativas válidas por movimento
- Importação de dados via CSV (em desenvolvimento)
- UI adaptada para **telões ou TVs** em eventos esportivos

---

## 🧠 Lógica do Ranking

Cada competidor tem armazenado:
- Até 3 tentativas por movimento (`squat`, `bench`, `deadlift`)
- Apenas os **maiores valores válidos** de cada movimento são considerados
- O **total** é a soma dos maiores valores válidos
- O ranking é ordenado de forma decrescente por total

---

## 🧪 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/power-table.git

# Acesse a pasta
cd power-table

# Instale as dependências
npm install

# Rode o servidor em modo desenvolvimento
npm run dev
```
> A aplicação ficará disponível em http://localhost:3000/

---

## 💼 Casos de Uso

- Campeonatos de Powerlifting locais e regionais

- Exibições públicas de desempenho em telões/monitores/transmissões

---

## 🛠️ Próximos Passos

1. Tela de Operador com formulário para envio das informações ✅

2. Importação de competidores via Excel/CSV ✅

3. Painel de acompanhamento interativo dos competidores ✅

4. Visualização de ranking com ordenação ✅

5. Ordenação de ranking por categorias 🚧

6. Histórico de tentativas por atleta 🚧

7. Exportação de dados via Excel/CSV 🚧

8. Acessibilidade a vários idiomas 🚧

9. 🚧
