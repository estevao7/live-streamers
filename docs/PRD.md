# PRD — Live Streamers

## 1. Visão geral

O Live Streamers é uma aplicação web que apresenta os streamers listados pela API pública do Chess.com. A pessoa usuária deve conseguir identificar cada streamer, saber se está ao vivo e abrir seu canal na Twitch.

Este documento descreve o produto e serve de base para a criação posterior de um arquivo de tasks. Não especifica a implementação detalhada de cada task.

## 2. Objetivos e escopo

### Objetivos

- Buscar e exibir a lista de streamers do Chess.com ao abrir a aplicação.
- Apresentar nome, avatar, estado ao vivo/offline e link para a transmissão.
- Tratar campos ausentes sem interromper a exibição dos demais streamers.
- Manter a integração com a API isolada dos componentes de interface para facilitar uma eventual troca de provedor.

### Fora do escopo inicial

- Login, contas de usuário ou preferências persistidas.
- Busca, filtros, ordenação ou paginação controlados pela pessoa usuária.
- Atualização automática periódica do estado ao vivo.
- Cadastro ou gerenciamento de streamers.

## 3. Público e cenário principal

O público é qualquer pessoa que queira consultar os streamers associados ao Chess.com e acessar suas transmissões.

**Cenário principal:** a pessoa abre a aplicação, vê a lista carregada em cards, identifica quais streamers estão ao vivo e seleciona o link de um card para abrir a Twitch.

## 4. Requisitos funcionais

### RF-01 — Carregar a lista

- Ao abrir a tela, a aplicação deve solicitar a lista ao endpoint `https://api.chess.com/pub/streamers`.
- A solicitação deve ocorrer por meio de um módulo/serviço de API separado dos componentes de interface.
- Durante a solicitação, a interface deve comunicar que os dados estão sendo carregados.

### RF-02 — Exibir streamers

- Cada streamer recebido deve ser apresentado em um card discreto.
- O card deve exibir, quando disponíveis:
  - `username`: nome do streamer;
  - `avatar`: imagem de perfil;
  - `is_live`: indicação de que está ao vivo ou offline;
  - `twitch-url`: link para o canal/transmissão na Twitch.
- A ausência de um campo não deve impedir a exibição dos demais dados disponíveis nem causar falha na lista.
- Se não houver avatar, usar uma representação visual substituta acessível; se não houver nome, apresentar um texto substituto neutro.
- Se não houver `twitch-url`, não apresentar um link acionável.
- A ausência de `is_live` deve ser apresentada como **“Status indisponível”**, sem inferir que o streamer está offline ou ao vivo.

### RF-03 — Indicar o estado ao vivo

- Exibir claramente o estado ao vivo/offline junto ao nome ou em outra área visível do card.
- Usar um indicador visual circular. O estado ao vivo deve usar a cor vermelha indicada no brain dump.
- O estado também deve ser informado por texto ou nome acessível; a cor e a forma, sozinhas, não podem ser a única indicação.
- Quando o estado não for fornecido, apresentar **“Status indisponível”**, sem inferir atividade.

### RF-04 — Abrir o canal

- Quando houver um `twitch-url` válido, oferecer uma ação clara para abrir o canal.
- O link deve levar ao destino recebido da API; não montar o destino a partir de texto não validado.
- Abrir o canal sempre em uma nova aba usando `target="_blank"` e `rel="noopener noreferrer"` para proteger a página de origem.

### RF-05 — Estados da tela

- **Carregando:** mostrar uma indicação de carregamento enquanto a solicitação está pendente.
- **Sucesso com resultados:** renderizar os cards.
- **Sucesso sem resultados:** informar que não há streamers disponíveis no momento.
- **Falha:** informar que não foi possível carregar a lista e oferecer uma ação para tentar novamente.
- Erros da API não devem ser convertidos silenciosamente em uma lista vazia.

## 5. Requisitos não funcionais

- A interface deve funcionar em navegadores modernos de desktop e dispositivos móveis.
- As informações essenciais devem continuar compreensíveis com campos opcionais ausentes.
- A interface deve ser navegável por teclado, ter foco visível e nomes acessíveis para imagens, links e estados.
- A indicação de status não deve depender exclusivamente de cor.
- A aplicação deve evitar requisições duplicadas causadas por renderizações comuns do React e cancelar ou ignorar solicitações obsoletas quando necessário.
- Falhas de rede e respostas inesperadas devem ser tratadas sem derrubar a aplicação.

## 6. Requisitos do sistema e dados

### Integração

- **Endpoint:** `GET https://api.chess.com/pub/streamers`
- A integração deve ficar em um arquivo próprio de serviço/API para que a UI não faça requisições diretamente.
- O módulo de API é responsável por obter e validar/adaptar a resposta para o formato usado pela interface.
- Tratar como opcionais os campos que podem não vir na resposta; validar a estrutura antes de renderizar.
- O sistema deve considerar resposta sem dados, erro HTTP, falha de rede e resposta inválida.

### Modelo de exibição

```ts
type Streamer = {
  username?: string
  avatar?: string
  twitchUrl?: string
  isLive?: boolean
}
```

O formato acima representa os dados normalizados para a aplicação. O payload real usa os campos `username`, `avatar`, `twitch-url` e `is_live`; mapear `twitch-url` para um nome de propriedade apropriado em TypeScript, como `twitchUrl`.

## 7. Detalhes técnicos

- **Stack:** Vite, React e TypeScript.
- **Componentes:** componentes reutilizáveis de interface devem ficar em `src/components/`.
- **Estado e ciclo de vida:** usar `useState` para estado de dados/feedback e `useEffect` para carregar os dados, incluindo limpeza quando aplicável.
- **Separação de responsabilidades:** serviço de API separado; componentes recebem dados e callbacks por props, sem conhecer detalhes da requisição.
- **Tipos:** definir tipos para a resposta da API e para os dados normalizados apresentados na interface; não presumir que o payload externo é confiável ou completo.
- **Configuração visual:** centralizar estilos e variáveis de cor seguindo os padrões existentes no projeto.
- **Validação:** executar build/type-check e lint existentes após a implementação; adicionar testes para transformação de dados e estados de carregamento/erro/vazio conforme a estrutura de testes adotada.

## 8. Diretrizes visuais

### Direção visual

- Aparência simples, leve e discreta, com inspiração na paleta da Twitch, sem exigir reprodução exata de marca ou logotipo.
- Cores-base: cinza claro e branco; roxo claro para realces; vermelho para indicar que o streamer está ao vivo.
- Garantir contraste suficiente entre texto, fundo, bordas, links e estados.

### Composição

- Cabeçalho com o título **“Streamers do Chess.com”** e, opcionalmente, o subtítulo **“Veja quem está ao vivo agora”**. Esse título evita sugerir que todos os cards exibidos estão ao vivo.
- Exibir a lista em cards discretos, com avatar, nome, estado e ação/link da Twitch organizados com hierarquia visual clara.
- No desktop, buscar uma apresentação em que aproximadamente dois cards ocupem a área visível antes de a pessoa precisar rolar para ver os próximos, conforme o tamanho da janela.
- Em telas menores, adaptar largura, espaçamento e tamanho dos elementos para preservar legibilidade; a rolagem vertical deve continuar disponível.
- Não fixar dimensões que cortem conteúdo ou impeçam a rolagem.

### Interações e acessibilidade visual

- Links e ações devem parecer interativos, ter estados de hover e foco visível e ser acionáveis por teclado.
- O indicador de estado deve permanecer acompanhado de texto, por exemplo, “Ao vivo” ou “Offline”.
- Imagens de avatar devem ter texto alternativo apropriado; usar `alt=""` apenas para imagens estritamente decorativas.
- O estado de carregamento, vazio e erro deve seguir a mesma linguagem visual dos cards e da página.

## 9. Critérios de aceite

1. Ao abrir a aplicação, uma solicitação ao endpoint é iniciada e um estado de carregamento é visível enquanto ela não termina.
2. Para cada registro válido, a tela apresenta os campos disponíveis sem falhar quando campos opcionais estiverem ausentes.
3. O estado ao vivo e offline pode ser distinguido por texto e não apenas pela cor do indicador.
4. Um streamer com link válido possui uma ação que abre o destino recebido da API; sem link, nenhum link quebrado é exibido.
5. Uma resposta sem streamers apresenta o estado vazio; uma falha de rede/API apresenta erro e opção de nova tentativa.
6. A lista é legível em desktop e dispositivos móveis, com rolagem para acessar os cards seguintes.
7. A integração HTTP não está implementada diretamente nos componentes visuais.
8. A implementação passa pelo build/type-check e pelo lint configurados no projeto.
