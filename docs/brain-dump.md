# Projeto Live-Streamers 

Este projeto vai pegar o nome do streamer, a foto e se tiver online ou não mostrar com uma bola vermelha ao lado e o link para ir para live

### Aspector Técnicos
O projeto vai ser em Vite, React e Typescript

### API que será usada no projeto é:
https://api.chess.com/pub/streamers


### Informações da API que precisamos:
- username 
- avatar
- twitch-url
- is_live (exibindo se está online ou não)

### Informações importantes
- As funções da API será criada em um arquivo diferente (facilitando a troca da API se for preciso e evitando que o projeto faça a requisição diretamente)

As informações de cada streamer vai ser separada em cards discreto, onde 2 cards vai preencher quase a tela toda e para ir para os próximos precisar rolar a tela.

As cores vão ser no padrão do twich  que é:
- cinza claro
- branco 
- roxo meio claro

- A API deve verificar se as informações vieram, caso não, age como se não tivesse vindo 

- Assim que abrir a tela já vai aparecer as telas com a lista de streamer 

- o Título da tela vai ser "Streamers Online agora" -> AGENTE VOCÊ PODE MELHORAR ESSE TÍTULO SE QUISER 

### No React
- use a pasta de components para criar os components gerais
- use useState, useEffect, cleanup quando necessário 


