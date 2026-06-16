# Solução Completa - Roteiro de SaaS GUI

Este documento contém a resolução detalhada de todas as questões do roteiro de exercícios sobre SaaS (Parte de GUI), da disciplina de Engenharia de Software e Sistemas (CIn/UFPE).

---

## Aula 1

### 1. Comportamento dos comandos `cat` e `touch`? Comportamento do comando `ls | wc`? Significado da barra `|` entre `ls` e `wc`?
* **`cat`** (catenate): Lê o conteúdo de um ou mais arquivos de texto e os exibe diretamente no terminal (saída padrão). Também pode ser usado para concatenar arquivos ou redirecionar a saída para criar novos arquivos.
* **`touch`**: Atualiza as datas de acesso e modificação de um arquivo para o horário atual. Se o arquivo especificado não existir, ele é criado como um arquivo vazio.
* **`ls | wc`**: O comando `ls` lista os arquivos do diretório atual. A saída dessa listagem é passada como entrada para o comando `wc` (word count). Sem parâmetros adicionais, o `wc` conta e exibe a quantidade de linhas, palavras e caracteres gerados pelo `ls`, indicando essencialmente quantos itens existem no diretório atual.
* **Barra vertical `|` (pipe)**: É o operador de redirecionamento que serve para canalizar dados entre processos, enviando a saída padrão (`stdout`) do comando à esquerda como entrada padrão (`stdin`) para o comando à direita.

### 2. O que são variáveis de ambiente e para que servem? Qual o propósito da variável `PATH`? Cole o valor atual de `PATH`. O que faz o comando `source`?
* **Variáveis de ambiente**: São variáveis globais dinâmicas mantidas pelo sistema operacional ou pela sessão do shell. Elas armazenam informações úteis que configuram o comportamento do ambiente do sistema e de processos ativos (ex: localização de arquivos temporários, idioma do sistema, usuário ativo).
* **Variável `PATH`**: Define os caminhos dos diretórios nos quais o sistema operacional buscará executáveis quando digitamos um comando no terminal (sem a necessidade de informar o caminho absoluto do binário).
* **Valor atual do `PATH`**:
  No Windows, o comando para visualizar é `echo %PATH%`. Em ambientes de contêineres Linux, exibe-se com `echo $PATH`.
* **Comando `source`**: Executa as instruções contidas em um script ou arquivo de configuração (como o `.bashrc`) diretamente no contexto e processo do shell ativo. Isso permite recarregar e aplicar configurações imediatamente sem precisar reiniciar o terminal.

### 3. Digitando `npm -version`, verifique se o Node.js está instalado. O que faz o comando `man` do Unix?
* **Comando `man`** (manual): Exibe a página de manual eletrônico (documentação técnica) de um comando Unix ou utilitário do sistema. Ao chamar `man npm`, abre-se o guia técnico detalhado explicando a sintaxe, opções e comandos do NPM.

### 4. Digitando `node --version`. Como realizar instalações locais do Node.js em ambientes com restrição de acesso?
* Em ambientes sem privilégios de superusuário (`sudo`), é possível baixar a versão binária compactada (`tar.xz`) do Node.js diretamente, descompactá-la em uma pasta no diretório pessoal do usuário (ex: `/home/aluno/node`) e atualizar a variável de ambiente `PATH` no arquivo `.bashrc` apontando para o diretório `/bin` da instalação local.

### 5. Digitando `ng version`. Como instalar o Angular CLI localmente e resolver incompatibilidades de versão com o Node.js?
* A instalação global é feita com `npm install -g @angular/cli`. Se não houver permissão, a instalação é local (sem `-g`), e o executável do CLI fica disponível em `node_modules/.bin/ng`.
* **Incompatibilidades**: Devem ser resolvidas consultando a tabela oficial de compatibilidade do Angular. A versão correspondente do Node.js pode ser facilmente instalada e gerenciada localmente usando a ferramenta `nvm` (Node Version Manager).

### 6. Execução dos comandos Git para criar e resetar a branch `SaaS1`:
```bash
git checkout -b SaaS1 e670da4c7dda011225d4a6942149cfdcde6e8667
git reset --hard e670da4c7dda011225d4a6942149cfdcde6e8667
```
* **Significado**: O primeiro comando cria uma nova branch local chamada `SaaS1` baseada no commit `e670da4...` e muda o ambiente ativo para ela. O segundo comando limpa a área de stage e o diretório de trabalho, restaurando o estado exato dos arquivos daquele commit e descartando qualquer modificação não salva.

---

## Aula 2

### 7. Criação do projeto Angular: `ng new ta-gui --no-standalone`
* O comando cria a estrutura de um projeto Angular clássico (usando `NgModules` em vez de standalone components), escolhendo **CSS** para estilização e **Yes** para habilitar SSR (Server-Side Rendering) e SSG (Static Site Generation/Prerendering) para melhor carregamento e SEO.

### 8. Executar o sistema com `npm start`
* O comando inicia o servidor de desenvolvimento do Angular (que executa `ng serve`), disponibilizando a aplicação por padrão no endereço local `http://localhost:4200`.

### 9. Qual a importância de commits frequentes e explicativos? Como evitar commitar a pasta `node_modules`?
* Commits pequenos e específicos dividem o desenvolvimento em etapas claras. Se uma alteração introduzir um bug, fica mais fácil rastrear qual commit causou o erro e revertê-lo (`git revert`).
* Evita-se commitar a pasta `node_modules` adicionando a linha `node_modules/` dentro do arquivo `.gitignore` na raiz do repositório, indicando ao Git que essa pasta de dependências externas não deve ser rastreada.

### 10. Uso do Plnkr/Stackblitz. Diferença de imports com `src/` versus `./`. Uso de "app-root" no `index.html`.
* **Diferença de caminhos**: `./` indica uma importação a partir de um caminho relativo (mesma pasta do arquivo atual). `src/` refere-se a caminhos a partir da pasta raiz do projeto.
* **`app-root`**: É o seletor padrão do componente raiz do Angular (`AppComponent`). Ele precisa estar no `index.html` para que o Angular saiba em qual elemento da página inicial a aplicação deve ser acoplada e renderizada.

### 11. Qual a função do plugin Octotree?
* Adiciona um painel lateral retrátil com a árvore de diretórios do repositório no GitHub, facilitando a navegação rápida e leitura de código sem a necessidade de clonar o projeto ou clicar em várias pastas.

### 12. No diretório `ta-gui/src/app`, que arquivos representam o componente e o módulo?
* **Componente**: `app.component.ts` (lógica/controlador), `app.component.html` (estrutura visual), `app.component.css` (estilos específicos) e `app.component.spec.ts` (testes).
* **Módulo**: `app.module.ts` (gerencia as dependências, declarações de componentes e injeção do bootstrap principal).

### 13. Qual a função da tag `h2`? E de `p`? Há no HTML? Função de `a`, `href` e `target`? Efeito de remover a `div` estrutural? Diferença de tags e atributos?
* **`h2`**: Título de nível secundário (Heading 2).
* **`p`**: Bloco de texto de parágrafo (Paragraph).
* **`a`**: Hiperlink de ancoragem (Anchor).
* **`href`**: Especifica o URL de destino para o qual o link direcionará o usuário.
* **`target`**: Define onde a página de destino será aberta (ex: `_blank` abre o link em uma nova aba).
* **Remoção da `div`**: As divs servem como containers estruturais. Removê-las (deixando apenas o conteúdo) rompe o alinhamento e as regras de espaçamento definidas pelo CSS, podendo quebrar o layout da página.
* **Tags vs Atributos**: As **tags** determinam a estrutura e os elementos do documento (o que é o elemento). Os **atributos** definem propriedades específicas ou comportamentos adicionais desses elementos (ex: cores, caminhos, identificadores).

### 14. Uso do Inspetor de Elementos do navegador. Como ele representa os elementos?
* O inspetor representa o DOM (Document Object Model) como uma árvore hierárquica viva dos elementos que formam a página. Ele exibe as propriedades dinâmicas, os estilos computados e as alterações efetuadas em tempo real na exibição.

### 15. A palavra "ta-gui" aparece na tela inicial por causa de `{{ title }}`. Onde essa propriedade está declarada?
* Está declarada e inicializada como um atributo da classe `AppComponent` no arquivo TypeScript `app.component.ts`.

### 16. Como `app.component.ts` referencia HTML e CSS? Qual o efeito de alterar a inicialização de `title`? O processo do `npm start` recompila automaticamente?
* **Referências**: Feitas dentro do decorador `@Component` pelas propriedades `templateUrl` e `styleUrls` (ou `styleUrl`).
* **Alterar `title`**: Modifica dinamicamente o texto exibido no HTML onde `{{ title }}` estiver mapeado (Data Binding).
* **Recompilação**: Sim, o `npm start` (rodando `ng serve`) monitora alterações de arquivos em tempo real e recompila e atualiza a página automaticamente no navegador (hot reloading). Se falhar, o `npm install` baixa as dependências e o `tsc` compila manualmente o TypeScript.

### 17. Como o módulo (`app.module.ts`) e o `index.html` referenciam o componente?
* **No Módulo**: O `AppComponent` é importado e adicionado nos metadados `declarations` e `bootstrap` do decorador `@NgModule`.
* **No `index.html`**: É incluído a tag customizada do seletor do componente (`<app-root></app-root>`) dentro da tag `<body>`.

---

## Aula 3

### 18. Para que serve a opção `"strictPropertyInitialization": false` no `tsconfig.json`?
* Desativa a verificação estrita do compilador TypeScript que exige que toda propriedade de uma classe seja obrigatoriamente inicializada em sua declaração ou no construtor. Isso permite declarar propriedades sem valores padrão (que iniciam implicitamente como `undefined`).

### 19. Propósito de comentar `provideClientHydration()` no `app.module.ts`?
* Desativa o processo de hidratação do Angular no cliente. A hidratação reaproveita o HTML gerado via SSR pelo servidor. Sem ela, o Angular descarta o HTML vindo do servidor e renderiza a aplicação toda do zero no navegador, provocando oscilações visuais e perda de desempenho.

### 20. Para que serve a opção `"noImplicitAny": false` no `tsconfig.json`?
* Impede que o compilador acuse erro caso alguma variável ou parâmetro não tenha um tipo explícito e acabe recebendo o tipo genérico `any` de forma implícita. Reduz o rigor da tipagem do TypeScript.

### 21. O que é e para que serve o `git cherry-pick <hash>`?
* Permite copiar um commit específico de uma branch qualquer e aplicá-lo como um novo commit diretamente na branch atual em que você se encontra. É útil para trazer correções ou recursos isolados sem precisar fazer o merge da branch inteira.

### 22. O que representa a notação `{nome: "", cpf: "", email: ""}` em JavaScript/TypeScript?
* Representa a criação de um objeto literal (object literal) com as chaves `nome`, `cpf` e `email` inicializadas com strings vazias.

### 23. Efeito de remover um label vs input? Efeito de `[(ngModel)]="aluno.cpf"`? Efeito de modificar `aluno` no componente? Diferença de `[(ngModel)]` e `{{ title }}`?
* **Remover `<label>`**: Apenas apaga a etiqueta de identificação visual textual do campo, mantendo o funcionamento do input (mas quebra a acessibilidade).
* **Remover `<input>`**: Remove o campo de entrada de texto da tela, impedindo que o usuário envie ou modifique o valor correspondente.
* **`[(ngModel)]="aluno.cpf"`**: Estabelece o two-way data binding (vinculação de dados bidirecional), de modo que atualizações feitas na tela modificam a variável no TypeScript e vice-versa.
* **Modificar `aluno` no TS**: Atualiza automaticamente os valores pré-preenchidos nos campos do formulário na tela.
* **Diferença**: `[(ngModel)]` é bidirecional (via dupla), enquanto `{{ title }}` (interpolação) é unidirecional (one-way data binding, apenas exibe o valor do TypeScript na tela).

### 24. Modificação para incluir login do GitHub do Aluno.
* Exige a criação do campo `githubLogin` no modelo de dados do Aluno, a inclusão do input `<input [(ngModel)]="aluno.githubLogin">` e sua exibição correspondente nas listagens no HTML.

### 25. O que é um Stub de serviço? Por que mover a classe `Aluno` do componente para um novo arquivo próprio?
* **Stub**: Uma implementação simulada estática temporária de um serviço de backend, permitindo testar a interface do usuário com dados falsos em memória antes do servidor real estar funcional.
* **Isolar a classe `Aluno`**: Melhora a modularização, evita duplicação de definições e permite que múltiplos componentes (cadastro, listagem, relatórios) e serviços compartilhem o mesmo modelo de dados de forma padronizada.

### 26. Vantagem do componente manter um array de alunos? Significado de `*ngFor`? Sem chaves em `{{a.nome}}`? Vantagem de commits pequenos?
* **Vantagem do array local**: Permite exibição e manipulação rápida dos dados em tela (cache na memória local) sem precisar consultar o banco de dados via requisição a cada alteração.
* **`*ngFor`**: Diretiva estrutural do Angular que atua como um laço de repetição, replicando a tag HTML para cada item de uma lista.
* **Sem chaves**: A expressão deixa de ser interpretada como interpolação e o navegador exibe a string de texto estática `"a.nome"` na tela.
* **Vantagem de commits curtos**: Facilita a localização de bugs, simplifica as revisões de pull request e permite reverter alterações pontuais sem descartar outros trabalhos.

### 27. Efeito de `class` no HTML e `button:hover` no CSS?
* **`class`**: Associa estilos e regras de formatação pré-definidos em seletores CSS à tag HTML.
* **`button:hover`**: Aplica regras visuais específicas ao botão somente quando o cursor do mouse estiver posicionado sobre ele.

### 28. Como depurar código no cliente?
* Abrindo as ferramentas de desenvolvedor do navegador (`F12`), acessando a aba "Sources" (ou "Fontes") para navegar pelos arquivos do projeto e inserindo *breakpoints* para pausar a execução da página e inspecionar variáveis.

### 29. Método `find` de arrays? Sintaxe `=>`? Por que validar CPF duplicado no componente e no serviço? Por que limpar apenas o `cpf` no formulário após erro?
* **`find`**: Retorna o primeiro elemento do array que atenda à condição passada na função de callback.
* **`=>`**: Define uma *arrow function* (expressão lambda). O lado esquerdo são os parâmetros e o direito o corpo/retorno da função.
* **Dupla validação**: A validação no componente melhora a UX (fornece feedback imediato sem tráfego de rede). A validação no serviço assegura a consistência e integridade das regras de negócio (crucial no backend).
* **Limpar apenas o CPF**: Permite que o usuário saiba qual campo gerou o erro de duplicidade, evitando que ele perca os demais dados já digitados (como nome ou email) e precise redigitar tudo de novo.

### 30. Por que refatorar o método `gravar`? Houve alteração funcional?
* A refatoração visa melhorar a legibilidade e organização interna do código (Clean Code). O comportamento externo do sistema permanece rigorosamente idêntico.

### 31. Qual o comportamento de `alert`?
* Abre uma caixa de diálogo nativa síncrona do navegador que exibe um alerta textual e bloqueia qualquer interação na página até que o usuário clique em "OK".

### 32. Diretiva `ngIf`? Atributo `cpfduplicado`? Lógica de tratamento de erro e uso de `mousemove`?
* **`ngIf`**: Adiciona ou remove condicionalmente elementos no DOM.
* **`cpfduplicado`**: Variável de controle de estado no componente que ativa a visibilidade da mensagem de erro na interface.
* **`mousemove` / interações**: O binding de interações limpa o estado de erro assim que o usuário faz movimentos ou digita no formulário, impedindo que a mensagem de erro fique eternamente visível na tela e melhorando a fluidez visual do aplicativo.

### 33. O que é Injeção de Dependência de serviço e por que é interessante? O comportamento observável muda?
* É um padrão de design no qual o framework Angular gerencia a criação, instanciação e injeção do serviço nos componentes que o solicitam. É interessante para desacoplar as classes, facilitar testes unitários (utilizando dublês de testes) e garantir o compartilhamento de um estado singleton único.
* O comportamento observável externo da aplicação não é alterado.

### 34. Quinta coluna da tabela? Inicialização por construtores? Por que clonar objetos antes de cadastrar?
* **Quinta coluna**: Exibe e permite editar os conceitos atribuídos às metas associadas ao aluno.
* **Construtor**: Garante a consistência dos objetos instanciados, obrigando o preenchimento de parâmetros cruciais e evitando propriedades nulas ou indefinidas indesejadas.
* **Clonagem de objetos**: Evita problemas de passagem de objetos por referência em JS/TS. Ao clonar, alterações no formulário não são refletidas na lista armazenada antes que a ação de salvar seja formalizada, permitindo cancelamentos seguros.

### 35. Modularização do componente principal em componentes filhos. O que é `routerLink`? Comportamento de Aluno, Metas e binding `change`?
* Os novos componentes são identificados por suas tags de seletor customizadas nos templates HTML.
* **`routerLink`**: Diretiva que mapeia o link a rotas SPA internas configuradas em `app-routing.module.ts`. O link `"/metas"` renderizará a tela de gerenciamento de conceitos.
* **`change`**: Escuta alterações no input (como seleção de dropdown) e dispara a respectiva lógica de salvamento e atualização das notas no TypeScript.

### 36. Tutorial do Angular.
* Serve para fixação de conceitos práticos do framework como encadeamento de rotas, pipes assíncronos e submissão de formulários reativos.
