# Live Streamers

Aplicação web que lista os streamers do Chess.com em cards. Projeto feito com React, TypeScript e Vite, com deploy automático no GitHub Pages via GitHub Actions.

🔗 **Demo:** [https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/](https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/)

---

## Sobre o projeto

O Live Streamers foi desenvolvido a partir de um PRD (documento de requisitos) e tem um objetivo simples: buscar a lista de streamers do Chess.com e mostrá-la na tela, cada um em um card.

Além de mostrar os dados, o projeto trata os diferentes momentos da requisição:

- **Carregando:** enquanto os dados não chegaram.
- **Sucesso com dados:** exibe a lista de cards.
- **Sucesso sem dados:** exibe a mensagem "Não há streamers disponíveis no momento."
- **Erro:** informa que algo deu errado na busca.

## Tecnologias

- [React](https://react.dev/): construção da interface com componentes
- [TypeScript](https://www.typescriptlang.org/): tipagem para evitar erros e deixar o código mais claro
- [Vite](https://vite.dev/): servidor de desenvolvimento e build
- [Node.js](https://nodejs.org/): ambiente para rodar as ferramentas do projeto
- [GitHub Actions](https://docs.github.com/actions) + [GitHub Pages](https://pages.github.com/): CI/CD e hospedagem

## Funcionalidades

- Lista de streamers do Chess.com exibida em cards
- Estado único (`streamersState`) que guarda `status` e `streamers` juntos, evitando telas inconsistentes
- Busca de dados com `useEffect` e `fetch`
- Cancelamento da requisição com `AbortController` quando o componente é desmontado
- Renderização condicional para os estados de carregamento, erro, sucesso e lista vazia
- Uso de `key` única (`username`) em cada item da lista
- Acessibilidade: `aria-label` na lista e `role="status"` nas mensagens de feedback

## Como o dado chega na tela

1. `fetchStreamers` busca a lista de streamers e devolve uma promise.
2. O `.then` recebe a lista e chama `setStreamersState({ status: 'success', streamers })`.
3. O React redesenha a tela com o novo estado.
4. O `.map` percorre `streamersState.streamers` e renderiza um `<StreamerCard />` para cada streamer.

```tsx
{streamersState.status === 'success' &&
  (streamersState.streamers.length > 0 ? (
    <ul className="streamers-list" aria-label="Lista de streamers">
      {streamersState.streamers.map((streamer) => (
        <li key={streamer.username}>
          <StreamerCard streamer={streamer} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="streamers-feedback" role="status">
      Não há streamers disponíveis no momento.
    </p>
  ))}
```

## Como rodar localmente

**Pré-requisitos:** Node.js (versão LTS) e npm instalados.

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git

# 2. Entre na pasta do projeto
cd NOME-DO-REPOSITORIO

# 3. Instale as dependências
npm install

# 4. Rode em modo de desenvolvimento
npm run dev
```

Depois, abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

### Outros comandos

```bash
npm run build     # gera a versão de produção na pasta dist
npm run preview   # visualiza localmente a versão de produção
```

## Deploy

O deploy é feito no **GitHub Pages** com um workflow de **CI/CD** no GitHub Actions. A cada push na branch principal, o workflow:

1. Instala as dependências
2. Gera o build com o Vite
3. Publica a pasta `dist` no GitHub Pages

O arquivo do workflow fica em `.github/workflows/`.

> **Atenção:** como o GitHub Pages serve o projeto em um subcaminho (`/NOME-DO-REPOSITORIO/`), o `vite.config.ts` precisa ter o `base` configurado:
>
> ```ts
> export default defineConfig({
>   base: '/NOME-DO-REPOSITORIO/',
>   // ...
> })
> ```

## Estrutura do projeto

```
├── .github/workflows/   # workflow de CI/CD
├── public/              # arquivos estáticos
├── src/
│   ├── App.tsx          # header e main da aplicação
│   ├── components/      # StreamerCard e afins
│   └── ...
├── index.html
├── package.json
└── vite.config.ts
```

> Ajuste essa árvore conforme a estrutura real do seu projeto.

## Próximos passos

- [ ] Estado de carregamento com visual mais elaborado
- [ ] Busca ou filtro de streamers
- [ ] Testes automatizados

## Autor

**Estêvão**
Estudante de Análise e Desenvolvimento de Sistemas (UNIFOR)

- GitHub: [github.com/estevao7](https://github.com/estevao7)
- LinkedIn: [linkedin.com/in/estevãoperez-508ba1229](https://linkedin.com/in/estevãoperez-508ba1229)
