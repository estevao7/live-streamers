# Tasks — Live Streamers

Este arquivo divide a implementação em entregas progressivas para execução por agentes de IA, uma task por vez. O [PRD](./PRD.md) é a fonte de verdade para os requisitos completos; cada task referencia as seções relevantes em vez de reproduzi-las.

## Instruções para os agentes

- Implementar somente uma task por execução. Não iniciar tasks seguintes nem ampliar o escopo.
- Antes de alterar arquivos, ler a task inteira e as seções do PRD referenciadas.
- Respeitar decisões e convenções já presentes no projeto; não reverter mudanças alheias.
- Ao concluir, rodar as validações definidas na task, informar arquivos alterados, resultados e eventuais bloqueios.
- Marcar a task como concluída somente quando todos os critérios de aceite forem atendidos.
- Tasks sem dependências listadas podem ser executadas independentemente, embora a ordem sugerida abaixo seja conveniente.

## Ordem sugerida

`T-01` → `T-02` → `T-03` → `T-04` → `T-05` → `T-06` → `T-07`

### T-01 — Preparar a infraestrutura de testes

- **Status:** Pendente
- **Depende de:** nenhuma
- **Referências:** PRD §7 (Validação)
- **Objetivo:** habilitar testes automatizados para as tarefas que verificam transformação de dados e estados da interface.
- **Escopo:** conferir se já existe uma infraestrutura de testes; se não existir, configurar a opção mínima compatível com React, TypeScript e Vite e adicionar um script de execução no `package.json`. Não implementar funcionalidade do produto nesta task.
- **Critérios de aceite:**
  1. Há um comando documentado e reproduzível para executar os testes.
  2. Um teste mínimo de exemplo passa com esse comando, sem depender de chamadas reais à API.
  3. A configuração funciona com o TypeScript e o Vite existentes e não altera os comandos atuais de build e lint.
  4. A instalação de dependências é limitada ao necessário para executar os testes.
- **Validação:** executar o novo comando de testes, `npm run build` e `npm run lint`.

### T-02 — Definir o contrato e normalizar dados da API

- **Status:** Pendente
- **Depende de:** T-01
- **Referências:** PRD §4 (RF-02, RF-03), §6 (Requisitos do sistema e dados)
- **Objetivo:** definir tipos para os dados externos e para o modelo de streamer usado pela interface, isolando as diferenças entre payload e modelo de exibição.
- **Escopo:** verificar a estrutura externa da resposta, tipar os campos `username`, `avatar`, `twitch-url` e `is_live`, e implementar uma transformação/validação para o modelo interno `Streamer`. Campos ausentes devem continuar opcionais; ausência de `is_live` corresponde a “Status indisponível” na apresentação.
- **Critérios de aceite:**
  1. O modelo interno é tipado e não expõe o nome com hífen `twitch-url` como propriedade TypeScript; o valor é mapeado, por exemplo, para `twitchUrl`.
  2. Dados válidos são convertidos sem perda dos valores recebidos.
  3. Campos opcionais ausentes não fazem a transformação falhar nem são convertidos em dados inventados.
  4. Uma estrutura inválida é identificada explicitamente, em vez de ser aceita como uma lista válida vazia.
  5. Testes automatizados cobrem payload válido, campos opcionais ausentes e estrutura inválida.
- **Validação:** executar os testes relacionados, `npm run build` e `npm run lint`.

### T-03 — Implementar o serviço de acesso à API

- **Status:** Pendente
- **Depende de:** T-02
- **Referências:** PRD §4 (RF-01, RF-05), §6 (Integração)
- **Objetivo:** disponibilizar a busca de streamers por um módulo de serviço separado da interface.
- **Escopo:** implementar a chamada `GET` ao endpoint do PRD, usando o contrato/transformação de T-02. O serviço deve tratar resposta HTTP não bem-sucedida, falha de rede, resposta inválida e cancelamento quando a camada chamadora for desmontada ou reexecutada.
- **Critérios de aceite:**
  1. A URL e o método correspondem aos definidos no PRD.
  2. O serviço retorna streamers normalizados e não depende de componentes React.
  3. Erros HTTP, de rede e de validação são propagados de forma explícita, não mascarados como lista vazia.
  4. A operação aceita sinal de cancelamento, sem transformar cancelamento em erro genérico de carregamento.
  5. Testes automatizados verificam resposta bem-sucedida, falha HTTP/rede e resposta inválida sem acessar a API real.
- **Validação:** executar os testes relacionados, `npm run build` e `npm run lint`.

### T-04 — Criar a estrutura visual e o tema da página

- **Status:** Pendente
- **Depende de:** nenhuma
- **Referências:** PRD §8 (Diretrizes visuais)
- **Objetivo:** substituir a estrutura de demonstração inicial por uma base visual adequada à página de streamers.
- **Escopo:** criar o cabeçalho com “Streamers do Chess.com”, a área principal para o conteúdo e estilos/variáveis visuais coerentes com a direção do PRD. Não implementar chamadas à API nem estado de carregamento.
- **Critérios de aceite:**
  1. A página não apresenta conteúdo de demonstração do template inicial.
  2. O título definido no PRD aparece como título principal.
  3. Branco, cinza claro e roxo claro compõem a base visual, com contraste legível.
  4. A estrutura adapta-se a telas estreitas sem criar rolagem horizontal ou cortar conteúdo.
  5. Os estilos mantêm a rolagem vertical natural da página.
- **Validação:** executar `npm run build` e `npm run lint`; verificar visualmente em largura desktop e mobile.

### T-05 — Implementar o card de streamer

- **Status:** Pendente
- **Depende de:** T-02 e T-04
- **Referências:** PRD §4 (RF-02, RF-03, RF-04), §8 (Composição e Interações e acessibilidade visual)
- **Objetivo:** criar um componente reutilizável em `src/components/` para exibir um streamer.
- **Escopo:** exibir avatar, nome, estado e ação/link usando o modelo interno. Tratar campos ausentes e implementar semântica, acessibilidade e estilo responsivo descritos no PRD.
- **Critérios de aceite:**
  1. O card exibe os campos disponíveis; avatar ou nome ausentes recebem alternativas neutras e acessíveis.
  2. `isLive === true` apresenta “Ao vivo” e indicador circular vermelho; `false` apresenta “Offline”; valor ausente apresenta “Status indisponível”.
  3. Estado é distinguível por texto além de cor/forma.
  4. Um link só é exibido quando existe `twitchUrl`; aponta para o destino recebido e abre em nova aba com `target="_blank"` e `rel="noopener noreferrer"`.
  5. Link e demais controles são utilizáveis por teclado e têm foco visível; avatar tem texto alternativo apropriado.
  6. O componente recebe dados por props e não faz chamadas à API.
- **Validação:** executar testes do componente, se configurados, `npm run build` e `npm run lint`; verificar layout em desktop e mobile.

### T-06 — Integrar carregamento, lista e estados da página

- **Status:** Pendente
- **Depende de:** T-03, T-04 e T-05
- **Referências:** PRD §4 (RF-01 a RF-05), §5 (Requisitos não funcionais), §7 (Estado e ciclo de vida)
- **Objetivo:** conectar a página ao serviço e apresentar os estados de carregamento, sucesso, lista vazia e falha.
- **Escopo:** carregar os dados ao abrir a tela, renderizar os cards, expor nova tentativa após falha e aplicar limpeza/cancelamento apropriado ao ciclo de vida React.
- **Critérios de aceite:**
  1. A abertura da tela solicita os dados pelo serviço, sem requisição HTTP dentro dos componentes visuais.
  2. Enquanto a solicitação está pendente, a interface comunica o carregamento.
  3. Uma resposta com itens renderiza um card por streamer; uma lista vazia mostra a mensagem de estado vazio do PRD.
  4. Uma falha apresenta mensagem compreensível e ação funcional de tentar novamente; não aparece como lista vazia.
  5. A limpeza do efeito cancela ou ignora resultados obsoletos, sem atualizar estado após desmontagem.
  6. Testes automatizados cobrem estados de carregamento, sucesso, vazio, falha e nova tentativa.
- **Validação:** executar os testes relacionados, `npm run build` e `npm run lint`.

### T-07 — Fazer a verificação final de aceite

- **Status:** Pendente
- **Depende de:** T-06
- **Referências:** PRD §5, §8 e §9 (Critérios de aceite)
- **Objetivo:** conferir a experiência implementada ponta a ponta e corrigir somente problemas dentro do escopo do PRD.
- **Escopo:** validar os critérios aplicáveis do PRD em desktop e mobile, revisar acessibilidade básica e rodar todas as verificações disponíveis. Não adicionar funcionalidades fora do escopo.
- **Critérios de aceite:**
  1. Todos os oito critérios de aceite do PRD §9 foram verificados; qualquer critério não atendido é corrigido ou registrado como bloqueio concreto.
  2. Build/type-check, lint e testes automatizados passam.
  3. A página permanece utilizável em telas desktop e mobile, sem conteúdo cortado nem rolagem horizontal indevida.
  4. Loading, vazio, erro, retry, campos ausentes, status e link externo foram verificados.
  5. O relatório final lista as validações executadas e eventuais limitações restantes.
- **Validação:** `npm run build`, `npm run lint` e o comando de testes configurado em T-01.
