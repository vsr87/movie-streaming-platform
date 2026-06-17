# Solução Completa - Roteiro de SaaS Serviços

Este documento contém a resolução detalhada de todas as questões do roteiro de exercícios sobre SaaS (Parte de Serviços), da disciplina de Engenharia de Software e Sistemas (CIn/UFPE).

---

## Aula 4

### 1. No projeto `teachingassistant`, analise o package.json e tsconfig.json. Qual o efeito de "devDependencies" e "dependencies"? Qual o efeito de "outDir":"compiledCode"?
* **`dependencies`**: Especifica os pacotes e bibliotecas de terceiros essenciais para a execução do servidor em produção (ex: Express, CORS, body-parser). Eles são instalados em qualquer ambiente.
* **`devDependencies`**: Especifica dependências necessárias apenas no ambiente de desenvolvimento para compilar, testar e rodar o projeto localmente (ex: compilador do TypeScript `tsc`, nodemon, tipos do express/node). Não são instalados em ambientes de produção limpos.
* **`"outDir": "compiledCode"`**: Indica ao compilador do TypeScript (`tsc`) em qual diretório os arquivos JavaScript compilados (arquivos `.js`) devem ser salvos. Nesse caso, a compilação gerará todos os arquivos em uma pasta chamada `compiledCode`.

### 2. O servidor Express simples `ta-server.ts`. Qual o efeito do script "start" no package.json? O que fazer em caso de "UNMET PEER DEPENDENCY"? Como tratar o caminho do tsc no Windows?
* **Script `"start"`**: O script `"npm run tsc && node compiledCode/ta-server.js"` compila os arquivos TypeScript (`npm run tsc`) e, se não houver erros de compilação, inicia o interpretador Node.js para executar o arquivo JavaScript compilado principal em `compiledCode/ta-server.js`.
* **UNMET PEER DEPENDENCY**: Indica que o npm instalou um pacote que exige uma versão específica de outro pacote como dependência "par", mas essa dependência está ausente ou incompatível. A resolução consiste em executar `npm install <nome-do-pacote-faltante>` com a versão recomendada antes de refazer o `npm install` geral.
* **Caminho do tsc no Windows**: Em sistemas Windows, o binário local do TypeScript fica na pasta `./node_modules/.bin/tsc`. O package.json deve ser ajustado para usar as barras invertidas locais ou adicionar o caminho de binários do npm global no `PATH` do sistema.

### 3. Testar o servidor em http://localhost:3000/. Qual o comportamento observado no browser? Que requisições/serviços ele recebe? O que representam os parâmetros `req` e `res` no código?
* **Comportamento no browser**: O navegador tentará acessar a rota raiz (`/`). Se não houver rota `/` configurada no Express, ele exibirá `Cannot GET /`. Se estiver configurado, exibirá o retorno definido (ex: texto ou JSON).
* **Requisições que recebe**: O servidor está apto a receber requisições nas rotas e métodos HTTP registrados no código (ex: `GET /alunos`, `POST /aluno`, `PUT /aluno`).
* **`req` (Request)**: Objeto que representa a requisição HTTP enviada pelo cliente. Por meio dele acessamos dados como parâmetros de URL (`req.params`), strings de consulta (`req.query`), cabeçalhos (headers) e o corpo de dados enviados no payload (`req.body`).
* **`res` (Response)**: Objeto que representa a resposta HTTP que o servidor devolverá ao cliente. É utilizado para enviar dados (ex: `res.send()`, `res.json()`) e definir o status HTTP da resposta (ex: `res.status(201)`).

### 4. Como depurar o código do servidor?
* Pode ser depurado utilizando ferramentas de depuração do editor de código (como configurar o launch program "Attach" ou "Launch" do VS Code usando mapeamento de sourcemaps), executando o Node com a flag de depuração (`node --inspect`) ou, em última hipótese, inserindo comandos `console.log()` no código para inspecionar variáveis no terminal do servidor.

### 5. Commit "versao inicial do servidor, após extracao de aluno para area comum". Por que mover a classe Aluno para `common/aluno.ts`? Por que a dependência do servidor na pasta do frontend seria um design ruim? As modificações alteraram o comportamento de clone?
* **Mover para `common/`**: Permite o compartilhamento do modelo de dados (`Aluno`) entre o cliente (Angular) e o servidor (Node.js/Express) de forma centralizada e sem duplicar código fisicamente nos dois projetos.
* **Design Ruim**: Fazer o servidor depender da pasta `ta-gui` (frontend) geraria um acoplamento cíclico indesejado. O backend deve ser isolado e independente de layouts gráficos e tecnologias de tela (como o framework do frontend), permitindo sua execução e implantação isoladas.
* **Método `clone`**: O método foi apenas adaptado para a sintaxe comum compartilhada. O comportamento semântico não foi alterado: ele continua retornando um novo objeto com exatamente o mesmo conteúdo e propriedades do objeto copiado.

### 6. Diferenças entre a classe `CadastroDeAlunos` no servidor e a classe `AlunoService` no frontend.
* **`AlunoService` (GUI)**: Funciona como uma interface de comunicação que apenas encapsula as chamadas de rede HTTP (GET, POST, PUT) ao servidor real.
* **`CadastroDeAlunos` (Servidor)**: É a classe responsável por executar a lógica de negócios de verdade. Ela valida os dados (verificação de CPF duplicado, por exemplo) e os mantém persistidos (seja em um array em memória física no servidor, seja gravando em um banco de dados).
* **Versão Final**: A duplicação em memória no cliente deixa de existir. O frontend apenas consome a API do servidor e exibe os dados retornados, enquanto toda a lógica de consistência lógica permanece centralizada no backend.

### 7. O arquivo ta-server.ts mais elaborado. Que requisições ele recebe? O que justifica os métodos escolhidos? O que faz o pacote `body-parser`?
* **Serviços**:
  * `GET /alunos`: Retorna a lista completa de alunos.
  * `POST /aluno`: Cadastra um novo aluno no servidor.
  * `PUT /aluno`: Atualiza dados de um aluno já existente.
* **Métodos HTTP**:
  * **`GET`**: Usado para consulta segura e idempotente de informações.
  * **`POST`**: Usado para criar um novo recurso (adicionar novo aluno).
  * **`PUT`**: Usado para atualizar as informações de um recurso já existente (substituição total/parcial).
* **`body-parser`**: É um middleware do Express que analisa o corpo da requisição (request body) vinda do cliente e a converte em um objeto JSON utilizável em `req.body`.

### 8. Seria melhor uma solução sem a separação entre `CadastroDeAlunos` (serviço) e `ta-server.ts` (processamento de rotas/HTTP)? Por que?
* **Não**. A separação é essencial porque atende ao princípio de responsabilidade única. `ta-server.ts` cuida puramente do protocolo de comunicação HTTP, do parsing de parâmetros e das respostas. `CadastroDeAlunos` gerencia as regras de negócio de cadastro e consistência dos dados dos alunos de forma independente de transporte. Essa separação permite, por exemplo, mudar o banco de dados do sistema ou usar um protocolo diferente (como gRPC ou WebSockets) sem precisar reescrever as regras de validação.

### 9. Comandos `curl` para testar POST e PUT.
```bash
# Executa um POST para criar um aluno
curl -i -X POST -H 'Content-Type: application/json' -d '{"nome": "Mariana", "cpf":"683", "email":"mcb@cin", "metas":{}}' localhost:3000/aluno/

# Executa um PUT para atualizar o aluno com o conceito de metas
curl -i -X PUT -H 'Content-Type: application/json' -d '{"nome": "Pedro", "cpf":"684", "email":"pcb@ufpe", "metas":{"requisitos":"MA"}}' localhost:3000/aluno/
```

---

## Aula 5

### 10. Como rodar o cliente e o servidor de forma integrada?
* Roda-se `npm start` na pasta do frontend (geralmente escuta na porta 4200) e `npm start` na pasta do backend (geralmente escuta na porta 3000) em janelas ou abas de terminal distintas. As comunicações ocorrem pela rede local usando chamadas assíncronas do Angular para o Express.

### 11. Que parte do código indica que `AlunoService` no frontend acessa o servidor real?
* A injeção da dependência `HttpClient` no construtor da classe (`constructor(private http: HttpClient)`) e o uso de chamadas de rede explícitas como `this.http.get(...)` e `this.http.post(...)` contendo o URL da API do servidor.

### 12. O conceito de `Observable` do RxJS. Por que `getAlunos` retorna `Observable<Aluno[]>` em vez de `Aluno[]`? Efeito de retirar `.pipe(retry(2))`? Como o `Observable` apoia concorrência assíncrona?
* **`Observable<Aluno[]>`**: A requisição de rede leva tempo para ser resolvida. O `Observable` representa um fluxo de dados assíncrono que emitirá a lista de alunos quando a resposta do servidor chegar.
* **Efeito de tirar `.pipe(retry(2))`**: Se a rede oscilar ou o servidor falhar momentaneamente, a chamada falhará imediatamente. Com o `retry(2)`, se a chamada falhar, o Angular fará até duas tentativas adicionais automáticas de reconectar antes de acusar o erro na interface.
* **Concorrência/Não-bloqueio**: O `Observable` é assíncrono e não-bloqueante. A requisição HTTP é processada em segundo plano pelo navegador, permitindo que a interface gráfica continue responsiva a outras ações do usuário (como digitar dados de outro aluno ou navegar pelo menu) sem congelar a tela.

### 13. Parâmetros extras no `put` e `post`. O que assumir sobre `Observable<any>`? Uso do `map` e verificação do atributo `success`.
* **Parâmetros**: `put` e `post` recebem o objeto do payload a ser criado/atualizado como segundo argumento, enquanto o `get` não possui payload.
* **`Observable<any>`**: Indica que o tipo retornado não foi definido previamente e pode conter qualquer estrutura JSON enviada pelo backend.
* **Uso do `map`**: Serve para transformar o objeto cru de resposta (`any`) no tipo de modelo de domínio específico (`Aluno`) antes de enviar o dado final para o componente.
* **Condição `res.success`**: Verifica se as validações lógicas no servidor passaram (ex: CPF não era duplicado). É usado o termo genérico e comum `success` nas respostas de APIs HTTP REST como uma convenção padrão para indicar o sucesso ou fracasso da operação lógica executada no servidor.

### 14. Por que a classe de serviço prepara as requisições, mas a observação e tratamento de erros é feita no Componente da GUI?
* Mantém as camadas isoladas. O serviço cuida apenas da infraestrutura de rede e formatação de dados. O componente da interface é o único que sabe como se comunicar com o usuário, decidindo como exibir o erro na tela (ex: se deve exibir um banner vermelho de alerta, se deve abrir um popup, ou se deve limpar o input do formulário).

### 15. Método `subscribe` no Angular. Quantos argumentos recebe e qual o efeito de cada um?
* Recebe callbacks, comumente organizados em um objeto observer ou argumentos separados:
  1. O primeiro argumento (`next`): É executado quando o Observable retorna os dados com sucesso. Efeito esperado: Atualiza a lista de alunos exibida na tela.
  2. O segundo argumento (`error`): É executado caso ocorra uma falha de comunicação ou de processamento no servidor. Efeito esperado: Exibe uma mensagem de erro de rede ou validação para o usuário.

### 16. O propósito do `if` no método `criarAluno` de `AlunosComponent`. Efeito do comando `alert`. O que aparece primeiro na tela e o que isso indica?
* **Propósito do `if`**: Impede o envio de requisições de cadastro para o servidor caso os campos básicos estejam vazios no formulário do frontend.
* **Ordem de exibição**: O `alert("Já executei o criar e o subscribe!")` aparece **primeiro**, antes do novo aluno ser listado na tabela.
* **Significado**: Mostra a natureza assíncrona da comunicação no Angular. O método `criarAluno` faz a chamada HTTP em segundo plano e registra o callback de retorno, mas a execução do código síncrono no JavaScript continua imediatamente até a última linha (mostrando o alerta). O aluno só entra na lista quando a resposta de rede do backend é recebida no callback do `subscribe`.

### 17. Na classe `MetasComponent`, qual o propósito do condicional `if` utilizado no método `atualizarAluno`?
* Garante que o envio das metas alteradas na interface de notas só ocorra se houver um aluno válido selecionado, evitando enviar requisições nulas ou quebradas para a API.

### 18. Cadastro de conceitos para as metas "Gerência de Projetos" e "Testes".
* Requer a adição destas metas na lista de propriedades e conceitos associada ao modelo comum de `Aluno` e a criação de campos de input específicos no HTML de edição do componente de metas do frontend.

---

## Aula 6

### 19. Como incluir login GitHub do aluno e validar para não ser duplicado assim como o CPF?
* Requer adicionar a propriedade `githubLogin` na classe `Aluno` (na pasta comum). No backend (`CadastroDeAlunos`), deve-se incluir uma verificação que utilize `find` para garantir que nenhum aluno existente tenha o mesmo login de GitHub fornecido no cadastro. O backend retorna erro caso exista, e o frontend exibe o erro correspondente.

### 20. Como remover um aluno cadastrado no backend usando requisições `DELETE`? Como funciona o uso de parâmetros na URL?
* **No Servidor (Backend Express)**:
  Mapeia-se a rota do Express definindo parâmetros variáveis precedidos por dois pontos, como `app.delete('/aluno/:cpf', ...)`. O Express extrai o valor correspondente inserido na URL e o disponibiliza na propriedade `req.params.cpf`. O servidor localiza o aluno com este CPF e o remove da classe `CadastroDeAlunos`.
* **No Frontend (Angular)**:
  Chama-se o método de deleção do `HttpClient`, passando o CPF no final do caminho: `this.http.delete('http://localhost:3000/aluno/' + cpf)`. O componente subscreve a essa requisição e, obtendo o sucesso, retira o aluno do array local que renderiza a interface.
