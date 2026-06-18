Claro. Vou organizar como **guia de estudo para prova**, misturando os **slides do professor** com o **Capítulo 8 do SaaSBook**. A ideia central é: os slides dão os conceitos clássicos de teste; o livro aprofunda isso no contexto de **Agile, TDD, BDD, cobertura e tipos de teste**.

## 1. Ideia central de teste de software

Nos slides, a definição mais simples é:

> **Testar é comparar o que o sistema é com o que o sistema deveria ser.**

Ou seja, teste não é “provar que está tudo certo”. Teste é executar o software em situações escolhidas e comparar o comportamento observado com o comportamento esperado.

Os slides também enfatizam que o objetivo é **encontrar bugs**, encontrá-los **o mais cedo possível** e depois demonstrar que os bugs encontrados foram resolvidos. Isso conversa com a ideia do livro de que teste é uma técnica de **verificação**, isto é, ajuda a responder: **“Did you build the thing right?”**  

Uma frase de prova bem provável:

> **Teste pode mostrar a presença de bugs, mas não sua ausência.**

Essa ideia aparece tanto nos slides quanto no livro, inclusive com a citação clássica de Dijkstra: teste mostra presença de bugs, não ausência. 

---

## 2. Validação vs Verificação

Essa diferença é muito cobrável.

**Verificação** pergunta:

> O sistema está de acordo com requisitos, especificações e regras?

É mais objetiva. Você compara o que foi implementado com o que estava especificado. Exemplo: se o requisito dizia “o botão deve ficar vermelho ao ocorrer erro”, a verificação olha se isso realmente foi implementado.

**Validação** pergunta:

> O sistema atende às necessidades reais do usuário?

É mais ligada ao valor entregue. Um sistema pode passar na verificação, porque cumpre a especificação, mas falhar na validação, porque a especificação estava errada ou incompleta.

No livro, isso aparece como:

> **Validação:** “Did you build the right thing?”
> **Verificação:** “Did you build the thing right?”

Os slides usam exatamente essa distinção: validação está ligada à satisfação/necessidade do usuário; verificação está ligada a requisitos, especificações e código-fonte. 

Exemplo de prova:

**V/F:** “Se um software cumpre todos os requisitos escritos, então ele necessariamente foi validado com sucesso.”
**Resposta:** Falso. Ele pode ter sido verificado, mas não necessariamente validado. Talvez os requisitos não representem o que o usuário realmente precisava.

---

## 3. Erro, falta/defeito e falha

Essa parte dos slides é clássica.

**Erro** é humano. É a confusão, engano ou mal-entendido na mente do programador, analista ou projetista.

**Falta**, **defeito** ou **bug** é a manifestação desse erro no artefato de software: código, modelo, diagrama, configuração etc. Exemplo: escrever `result = x` quando deveria ser `result = z`.

**Falha** é quando o defeito aparece durante a execução e o sistema se comporta incorretamente. Exemplo: a função deveria retornar o maior entre 1, 2 e 3, mas retorna 1.

Então a cadeia é:

```text
erro humano → falta/defeito no software → falha observável em execução
```

No exercício dos slides da função `max3`, a falta está na linha errada do código; a falha só aparece quando usamos entradas que passam por aquele caminho defeituoso, por exemplo `max3(1, 2, 3)`.

Essa distinção é importante porque **um defeito pode existir sem nunca virar falha**, caso o caminho defeituoso nunca seja executado. É por isso que testar bem envolve escolher entradas que exercitem caminhos relevantes.

---

## 4. Ciclo de vida de um bug

Os slides mostram o ciclo de vida baseado na ideia de Voas:

```text
defeito é introduzido
→ execução toca o código defeituoso
→ estado interno fica infectado
→ infecção se propaga
→ falha é observada
```

O teste foca em provocar e observar falhas. O debugging foca em voltar da falha observada até a causa interna, isto é, encontrar o defeito.

Exemplo simples:

```ts
function max3(x, y, z) {
  if (x > y) {
    if (x > z) return x;
    else return z;
  } else {
    if (y > z) return y;
    else return x; // defeito: deveria retornar z
  }
}
```

Com `max3(10, 2, 3)`, o defeito nem é tocado.
Com `max3(1, 2, 3)`, o caminho defeituoso é executado e a falha aparece.

Frase de prova:

**V/F:** “Todo defeito sempre causa uma falha em qualquer execução.”
**Resposta:** Falso. O defeito precisa ser executado, infectar o estado, propagar essa infecção e se tornar observável.

---

## 5. Oráculo de teste

Um **oráculo de teste** é o mecanismo que decide se o teste passou ou falhou.

Nos slides:

> **Test Oracle:** mecanismo para determinar se um teste passou ou falhou.

Em testes automatizados, normalmente o oráculo aparece na forma de uma asserção. Exemplo:

```java
Assert.assertEquals(res, x);
```

Nesse caso, o teste executa uma operação e compara o resultado observado com o resultado esperado.

No livro, isso aparece dentro da ideia de **Self-checking**: o próprio teste deve saber se passou ou falhou, sem depender de uma pessoa olhando a saída manualmente.

Frase de prova:

**V/F:** “Um teste automatizado deve depender de inspeção humana para decidir se passou.”
**Resposta:** Falso. Bons testes devem ser self-checking.

---

## 6. Defeitos escapados

**Defeitos escapados** são bugs que os testes não encontraram. Eles podem ser descobertos por outra equipe depois da fase de testes ou, pior, pelo cliente em produção.

Nos slides, aparecem como:

> **Missed Bugs** ou **Escaped Defects**. 

Isso é importante porque a qualidade do processo de teste pode ser avaliada não só pelos testes que passam, mas também pelos defeitos que escapam.

Frase de prova:

**V/F:** “Defeito escapado é um defeito encontrado durante a execução normal dos testes planejados.”
**Resposta:** Falso. É justamente o defeito que escapou dos testes planejados.

---

## 7. Axiomas do teste

Os slides trazem vários “axiomas”. Eles são muito bons para V/F.

### 7.1 É impossível testar tudo

O domínio de entrada e os caminhos possíveis geralmente são enormes ou infinitos. O próprio SWEBOK, citado nos slides, define teste como verificação dinâmica em um **conjunto finito de casos de teste**, escolhido a partir de um domínio de execução normalmente infinito.

Logo, testar é sempre selecionar casos. Nunca é testar tudo.

**V/F:** “Um bom processo de teste exaustivo consegue testar todas as entradas possíveis de um programa real.”
**Resposta:** Falso.

### 7.2 Bugs andam em bando

Se você encontrou um bug em uma região, procure mais naquela região. Pode haver problema estrutural, hábito ruim do programador, má arquitetura ou lógica repetida incorretamente.

**V/F:** “Encontrar um bug em uma parte do sistema é evidência de que aquela região talvez mereça mais testes.”
**Resposta:** Verdadeiro.

### 7.3 Teste não atesta inexistência de bugs

Mesmo que 1000 testes passem, isso não prova ausência de defeitos. Só mostra que aqueles 1000 casos não revelaram falhas.

Isso aparece também no livro quando ele alerta contra a falácia de achar que **100% de cobertura com todos os testes passando significa ausência de bugs**. 

### 7.4 Paradoxo do pesticida

Rodar sempre os mesmos testes vai perdendo capacidade de encontrar novos bugs. Depois que os bugs que aqueles testes detectavam são corrigidos, eles continuam úteis para regressão, mas você precisa criar novos testes para encontrar novos tipos de defeito.

### 7.5 Nem todo bug será corrigido

Às vezes não há tempo, o risco de corrigir é alto, o custo não compensa ou a equipe decide que aquele comportamento é aceitável. Isso não significa ignorar qualidade; significa priorizar com responsabilidade.

### 7.6 Requisitos mudam

O mundo muda: leis, concorrentes, tecnologias e necessidades do usuário mudam. Testes e código precisam acompanhar.

### 7.7 Teste é atividade baseada em risco

Como não dá para testar tudo, precisamos decidir:

```text
o que testar?
quanto testar?
quando parar?
quais áreas são mais críticas?
quais falhas seriam mais caras?
```

---

# 8. TDD no livro: Test-Driven Development

O Capítulo 8 do livro é centrado em **TDD**.

A ideia principal é que, em desenvolvimento ágil, teste não vem só no final. O teste guia o desenvolvimento.

O livro diz que, no Agile, teste é em grande parte responsabilidade dos **desenvolvedores**, não apenas de uma equipe separada de QA. QA ainda existe, mas com foco em infraestrutura de testes, melhoria do processo, apoio à testabilidade e alguns tipos de teste difíceis de automatizar. 

## 8.1 Red–Green–Refactor

O ciclo TDD é:

```text
Red → Green → Refactor
```

**Red:** escreva um teste para um comportamento que ainda não existe. O teste deve falhar.

**Green:** escreva o código mais simples possível para fazer aquele teste passar.

**Refactor:** melhore a estrutura do código e dos testes sem alterar o comportamento.

A ideia do livro é “exercitar o código que você gostaria de ter”. Ou seja, antes de implementar, você escreve o teste como se a função ideal já existisse.

Frases de prova:

**V/F:** “No TDD, primeiro escrevemos todo o código e depois criamos testes para confirmar que ele funciona.”
**Resposta:** Falso. Isso é o fluxo convencional. No TDD, o teste vem antes do código correspondente.

**V/F:** “No passo Green, o objetivo é escrever a solução mais geral e completa possível.”
**Resposta:** Falso. O objetivo é escrever o mínimo necessário para passar o teste atual.

**V/F:** “A etapa Refactor pode alterar a estrutura interna do código, mas não deve alterar seu comportamento observável.”
**Resposta:** Verdadeiro.

---

## 8.2 FIRST: características de bons testes

O livro usa o acrônimo **FIRST**:

```text
F - Fast
I - Independent
R - Repeatable
S - Self-checking
T - Timely
```

**Fast:** testes devem rodar rápido. Se forem lentos, os desenvolvedores evitam rodá-los.

**Independent:** a ordem dos testes não deve importar. Um teste não deve depender do estado deixado por outro.

**Repeatable:** o resultado deve ser repetível. Não deve depender de data atual, internet instável, ordem aleatória ou estado externo incontrolável.

**Self-checking:** o próprio teste decide se passou ou falhou.

**Timely:** o teste deve ser escrito no momento certo. Em TDD, imediatamente antes do código que ele testa.

Frase curtinha do livro muito importante:

> “testable code tends to be clear code”

Ou seja, código testável tende a ser código mais claro e modular.

---

# 9. Anatomia de um teste: Arrange, Act, Assert

O livro apresenta a estrutura:

```text
Arrange → Act → Assert
```

**Arrange:** prepara o cenário. Cria objetos, define entradas, configura estado inicial.

**Act:** executa o sistema sob teste.

**Assert:** verifica se o resultado observado bate com o esperado.

Exemplo:

```ts
// Arrange
const user = new User("Victoria", "vpbm@cin.ufpe.br");

// Act
const result = user.getEmailDomain();

// Assert
expect(result).toBe("cin.ufpe.br");
```

O livro também usa a expressão **System Under Test (SUT)**. O SUT é aquilo que está sendo testado. Pode ser uma função, método, classe, módulo ou até a aplicação inteira.

Uma **test suite** é o conjunto de casos de teste.

Frases de prova:

**V/F:** “O SUT é sempre a aplicação inteira.”
**Resposta:** Falso. O SUT é definido do ponto de vista do teste; pode ser desde um método até o sistema completo.

**V/F:** “A fase Assert torna o teste self-checking.”
**Resposta:** Verdadeiro.

---

# 10. Testes de unidade e funções puras

No livro, os testes mais simples são para **pure leaf functions**.

Uma função é “pure” quando:

```text
mesma entrada → mesma saída
sem efeitos colaterais
sem depender de estado externo
```

Uma função é “leaf” quando não chama outras funções auxiliares/collaborators para fazer seu trabalho.

Essas funções são fáceis de testar porque basta escolher entradas e verificar saídas.

Exemplo:

```ts
function isLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}
```

O livro usa o exemplo de ano bissexto. Os casos relevantes são categorias:

```text
não múltiplo de 4 → não bissexto
múltiplo de 4, mas não de 100 → bissexto
múltiplo de 100, mas não de 400 → não bissexto
múltiplo de 400 → bissexto
```

A moral é: não escolha entradas aleatórias sem pensar. Escolha valores que exercitem caminhos diferentes do código.

Frase de prova:

**V/F:** “Em testes de unidade, uma boa estratégia é escolher valores que façam o método seguir caminhos de código diferentes.”
**Resposta:** Verdadeiro.

---

# 11. Test doubles, stubs, mocks, spies e seams

Essa é uma das partes mais importantes do Capítulo 8.

Às vezes o SUT depende de outras coisas:

```text
banco de dados
API externa
relógio do sistema
gerador aleatório
outro módulo
outro objeto
```

Se o teste chamar tudo isso de verdade, ele pode ficar lento, instável e difícil de controlar. Para isolar o SUT, usamos **test doubles**.

**Test double** é o termo genérico para objetos/métodos falsos usados no teste.

## Stub

Um **stub** substitui uma chamada real por uma resposta controlada.

Exemplo:

```ts
movieApi.search = () => [];
```

Você está dizendo: “quando o código chamar `movieApi.search`, finja que a API retornou lista vazia”.

## Mock

Um **mock** é um objeto falso que imita alguns comportamentos do objeto real. Ele pode ser usado para verificar se certa interação aconteceu.

Exemplo:

```ts
expect(emailService.send).toHaveBeenCalled();
```

## Spy

Um **spy** observa chamadas: registra argumentos, quantas vezes foi chamado e valores retornados, geralmente permitindo que o método real ainda seja executado.

## Seam

Um **seam** é um ponto onde você consegue alterar o comportamento do programa durante o teste sem modificar o código de produção naquele ponto.

O livro usa a definição de Michael Feathers: seam é um local em que você pode alterar o comportamento sem editar diretamente aquele trecho.

Frases de prova:

**V/F:** “Test doubles ajudam a isolar o código testado de suas dependências.”
**Resposta:** Verdadeiro.

**V/F:** “Stubs são usados para tornar testes mais lentos e mais parecidos com produção.”
**Resposta:** Falso. Eles geralmente tornam testes mais rápidos, controláveis e repetíveis.

**V/F:** “O uso excessivo de stubs pode esconder problemas de integração.”
**Resposta:** Verdadeiro. Esse é um dos pitfalls do livro. 

---

# 12. Stubbing the Internet

Quando o código chama uma API externa, o livro recomenda não depender da chamada real em testes comuns.

Motivos:

```text
a API pode estar fora do ar
a resposta pode mudar
o teste fica lento
pode violar termos de uso
pode depender da internet
pode deixar o teste não repetível
```

Para testes que envolvem serviço externo, o livro discute ferramentas como **Webmock** e **VCR**.

**Webmock:** intercepta chamadas HTTP e retorna respostas controladas.

**VCR:** grava uma resposta real uma vez e depois “reproduz” essa resposta nos testes.

A diferença importante:

```text
stub perto do código → mais comum em teste de unidade
stub longe, perto da API externa → mais realista para integração/funcional
```

O livro diz que, para testes de integração com serviço externo, stubbing “far away” com Webmock é mais realista; para teste unitário, stubbing “close by” costuma ser suficiente. 

Frase de prova:

**V/F:** “Em testes de unidade, chamar uma API externa real ajuda a manter os testes FIRST.”
**Resposta:** Falso. Pode violar Fast e Repeatable.

---

# 13. Fixtures e Factories

Essa parte também é muito cobrável.

## Factory

Uma **factory** cria objetos reais para testes, geralmente com valores padrão válidos e possibilidade de sobrescrever alguns campos.

Exemplo conceitual:

```ts
const movie = MovieFactory.build({
  title: "Milk",
  rating: "R"
});
```

A factory é útil quando o objeto tem muitos campos obrigatórios ou relações com outros objetos.

## Fixture

Uma **fixture** é um conjunto fixo de dados carregado antes dos testes.

Exemplo: um arquivo YAML com filmes previamente cadastrados no banco de teste.

O problema é que fixtures podem quebrar a independência dos testes, porque vários testes passam a depender de um estado global fixo. Se alguém muda a fixture, testes aparentemente não relacionados podem quebrar.

O livro recomenda usar fixtures com cuidado, principalmente para dados realmente fixos, e preferir factories para dados que normalmente mudam durante a execução da aplicação. 

Frases de prova:

**V/F:** “Factories tendem a preservar melhor a independência dos testes do que fixtures globais.”
**Resposta:** Verdadeiro.

**V/F:** “Fixtures nunca devem ser usadas.”
**Resposta:** Falso. Elas podem ser úteis para dados fixos necessários ao funcionamento da aplicação.

---

# 14. Cobertura de testes

Cobertura mede quanto do código foi exercitado pelos testes. Mas atenção: cobertura alta não significa que os testes são bons.

O livro diz que cobertura ajuda a encontrar partes pouco testadas, mas não deve ser tratada como prova de ausência de bugs. 

## Tipos de cobertura

**S0 / Method coverage:** cada método foi executado pelo menos uma vez?

**S1 / Call coverage:** cada método foi chamado a partir de cada lugar possível?

**C0 / Statement coverage:** cada comando/statement foi executado pelo menos uma vez?

**C1 / Branch coverage:** cada ramo de decisão foi tomado pelo menos uma vez em cada direção?

**C2 / Path coverage:** todo caminho possível pelo código foi executado?

**MCDC:** cada condição de uma decisão precisa demonstrar que consegue afetar independentemente o resultado da decisão.

Ordem intuitiva de força:

```text
S0 < S1 < C0 < C1 < C2
```

C0 é mais fácil. C1 é mais difícil. C2 pode explodir combinatoriamente.

Frases de prova:

**V/F:** “100% de C0 garante que todos os caminhos possíveis foram executados.”
**Resposta:** Falso. C0 cobre statements, não todos os caminhos.

**V/F:** “Cobertura alta não garante qualidade dos testes.”
**Resposta:** Verdadeiro.

**V/F:** “Cobertura baixa é forte indício de aplicação mal testada.”
**Resposta:** Verdadeiro. O livro diz que cobertura alta não prova bons testes, mas cobertura baixa indica problema. 

---

# 15. Tipos de teste por alvo: unidade, integração e sistema

Os slides classificam testes pelo objeto testado:

```text
unidade
integração
sistema
```

O livro também compara esses tipos.

## Teste de unidade

Testa uma unidade pequena: função, método, classe ou componente.

Características:

```text
rápido
boa localização de erro
muitas vezes usa doubles
boa cobertura de caminhos internos
geralmente feito pelo programador
```

Nos slides, teste de unidade verifica componentes individuais, interfaces da unidade, dados impróprios, inicialização de variáveis, condições limite e caminhos importantes. 

## Teste de integração

Testa se partes diferentes funcionam juntas.

A frase mais importante dos slides:

> **Teste de integração testa as interfaces e não o funcionamento interno dos módulos.**

Se módulo A e módulo B funcionam isoladamente, ainda pode haver erro na comunicação entre eles.

Abordagens dos slides:

```text
Big Bang
Incremental
```

**Big Bang:** espera tudo ficar pronto e integra tudo de uma vez. Problema: é otimista demais; se falhar, é difícil localizar a causa.

**Incremental:** integra aos poucos. Problema: pode ser caro; exige stubs e drivers quando algumas partes ainda não existem.

A recomendação dos slides é equilibrar por risco: fazer incremental nas integrações mais perigosas, equilibrando custo, tempo e qualidade. 

O livro usa outra classificação em Plan-and-Document:

```text
top-down
bottom-up
sandwich
```

**Top-down:** começa de cima, por exemplo UI e funções de alto nível. Vantagem: feedback cedo. Desvantagem: precisa de muitos stubs.

**Bottom-up:** começa pelos módulos inferiores. Vantagem: menos stubs. Desvantagem: demora para ver a aplicação funcionando.

**Sandwich:** mistura as duas ideias. 

## Teste de sistema

Testa o sistema como um todo, do ponto de vista observável.

Nos slides, teste de sistema é independente de detalhes de implementação e costuma usar abordagem funcional. Também pode avaliar propriedades globais, como performance e confiabilidade, em ambiente parecido com produção. 

No livro, testes de sistema em SaaS podem ser chamados de **full-stack tests**, porque exercitam tudo: UI, servidor, banco etc. 

---

# 16. Unit vs Functional vs System/Integration no livro

O livro compara:

```text
Unidade:
- testa método/classe
- muito rápido
- excelente localização de erro
- excelente cobertura
- usa doubles frequentemente

Funcional:
- testa vários métodos/classes
- razoavelmente rápido
- localização de erro moderada
- cobertura moderada
- usa doubles ocasionalmente

Sistema/Integração:
- testa grandes partes do sistema
- lento
- localização de erro pobre
- cobertura pobre
- raramente usa doubles
```

A moral é: nenhum tipo sozinho é suficiente. Testes de sistema parecem mais realistas, mas quando falham é difícil saber onde está o erro. Testes unitários são precisos, mas podem esconder problemas de integração por usarem objetos falsos. O livro resume: alta confiança exige boa cobertura e mistura dos três tipos. 

Frase de prova:

**V/F:** “Como testes de sistema exercitam o sistema inteiro, eles tornam testes de unidade desnecessários.”
**Resposta:** Falso.

---

# 17. Black-box vs White-box

Os slides classificam testes pela visibilidade do código.

**Black-box testing:** os testes são projetados sem conhecimento da estrutura interna, design ou implementação. Você testa pelo comportamento esperado.

**White-box testing:** os testes são projetados com conhecimento da estrutura interna do sistema. Você usa detalhes de implementação para escolher casos, como caminhos, branches e condições limite. 

O livro também usa black-box e white-box/glass-box. Exemplo: em uma tabela hash, um teste black-box testa se inserir e buscar uma chave funciona; um teste white-box pode usar conhecimento da função hash para criar muitas colisões. 

Frases de prova:

**V/F:** “Teste black-box exige conhecimento da implementação.”
**Resposta:** Falso.

**V/F:** “Teste white-box pode explorar valores de fronteira e caminhos internos do código.”
**Resposta:** Verdadeiro.

---

# 18. Testes funcionais e não funcionais

Pelos slides, também podemos classificar pelo objetivo:

```text
funcional
carga
performance
segurança
usabilidade
```

O livro acrescenta exemplos importantes:

**Smoke test:** teste mínimo para ver se algo básico está quebrado antes de rodar o resto. Exemplo: a aplicação abre? login funciona minimamente?

**Compatibility testing:** testa compatibilidade com browsers, sistemas operacionais etc.

**Regression testing:** garante que bugs corrigidos não voltaram.

**Performance, stress e security testing:** verificam requisitos operacionais.

**Accessibility testing:** verifica se pessoas com deficiência conseguem usar o sistema. 

Frase de prova:

**V/F:** “Teste funcional verifica apenas requisitos de performance, segurança e carga.”
**Resposta:** Falso. Isso é não funcional. Funcional testa comportamento/funcionalidades.

---

# 19. Outras abordagens do livro

## DU-coverage

**Define-use coverage** olha pares entre onde uma variável é definida e onde ela é usada. Pode encontrar problemas que cobertura de fluxo de controle não encontra.

## Mutation testing

A ferramenta cria pequenas alterações no código, como trocar `+` por `-` ou `if (c)` por `if (!c)`. Se nenhum teste falhar, talvez a suíte esteja fraca.

Ideia:

```text
mutação no código deveria matar algum teste
se a mutação sobrevive, falta teste ou o programa é estranho
```

## Fuzz testing

Consiste em jogar dados aleatórios ou semi-aleatórios no sistema para ver o que quebra. É útil principalmente para robustez e segurança.

Tipos:

```text
random/black-box fuzzing
smart fuzzing
white-box fuzzing
```

O livro cita que fuzz testing é útil para encontrar vulnerabilidades que inspeção manual e análise formal podem perder. 

Frase de prova:

**V/F:** “Fuzz testing consiste em fornecer dados aleatórios ou mutados ao programa para observar falhas.”
**Resposta:** Verdadeiro.

---

# 20. Agile/TDD vs Plan-and-Document

Essa comparação é muito importante no livro.

## No Agile/TDD

A ordem tende a ser:

```text
história de usuário
teste de aceitação
teste de integração
teste de unidade
código
```

Na prática BDD/TDD:

```text
escreve cenário Cucumber
passo falha
escreve teste unitário
teste unitário falha
implementa código mínimo
teste passa
refatora
repete
```

## No Plan-and-Document

A ordem tradicional é:

```text
requisitos
design
código
teste de unidade
teste de módulo
teste de integração
teste de sistema
teste de aceitação
```

Também há mais documentação formal, como planos de teste no padrão IEEE 829-2008. 

Diferença central:

```text
Agile: teste guia o desenvolvimento.
Plan-and-Document: teste vem depois do código, em fases.
```

Frase de prova:

**V/F:** “No processo Plan-and-Document, os testes de unidade começam antes da escrita do código.”
**Resposta:** Falso. O livro diz que, nesse processo, desenvolvedores escrevem código e depois fazem testes de unidade.

---

# 21. Fallacies e pitfalls do Capítulo 8

## Falácia: 100% de cobertura + testes verdes = sem bugs

Falso. Cobertura mede execução, não qualidade das asserções. Você pode executar uma linha sem verificar corretamente o resultado. Também pode haver bugs em valores específicos, interações externas ou integrações não testadas.

## Pitfall: exigir dogmaticamente 100% de cobertura antes de entregar

Cobertura é útil, mas não é garantia. O ideal é usá-la para encontrar áreas subtestadas.

## Pitfall: over-stubbing

Stubs e mocks ajudam, mas se você falsifica tudo, pode não testar se os módulos realmente conversam corretamente. Isso cria integração fraca.

## Pitfall: escrever testes depois do código

O livro alerta que escrever testes antes ajuda a criar código testável. Escrever código primeiro pode gerar código difícil de testar.

Frase de prova:

**V/F:** “Over-stubbing pode esconder problemas em pontos de integração.”
**Resposta:** Verdadeiro. 

---

# 22. Frases estilo V/F para treinar

1. **Teste de software compara o comportamento observado com o comportamento esperado.**
   Verdadeiro.

2. **Teste exaustivo é normalmente viável em sistemas reais.**
   Falso.

3. **Validação pergunta se estamos construindo o produto certo.**
   Verdadeiro.

4. **Verificação pergunta se estamos construindo o produto corretamente.**
   Verdadeiro.

5. **Erro, falta e falha são sinônimos perfeitos.**
   Falso.

6. **Uma falta pode existir sem causar falha em uma execução específica.**
   Verdadeiro.

7. **O oráculo de teste decide se o teste passou ou falhou.**
   Verdadeiro.

8. **Defeitos escapados são defeitos não encontrados pelos testes planejados.**
   Verdadeiro.

9. **No TDD, o teste deve falhar antes de o código ser implementado.**
   Verdadeiro.

10. **Red–Green–Refactor significa: escrever código, rodar testes, apagar testes.**
    Falso.

11. **FIRST significa Fast, Independent, Repeatable, Self-checking e Timely.**
    Verdadeiro.

12. **Um teste self-checking depende de uma pessoa analisando a saída.**
    Falso.

13. **Arrange prepara, Act executa e Assert verifica.**
    Verdadeiro.

14. **SUT é aquilo que está sendo testado.**
    Verdadeiro.

15. **Test doubles ajudam a isolar dependências.**
    Verdadeiro.

16. **Stubs são úteis para controlar respostas de colaboradores.**
    Verdadeiro.

17. **Mocks nunca devem ser usados.**
    Falso.

18. **Fixtures podem criar dependências implícitas entre testes.**
    Verdadeiro.

19. **Factories são úteis para criar objetos válidos sob demanda.**
    Verdadeiro.

20. **100% de cobertura garante ausência de bugs.**
    Falso.

21. **C0 é cobertura de statements.**
    Verdadeiro.

22. **C1 é cobertura de branches.**
    Verdadeiro.

23. **C2 é cobertura de caminhos.**
    Verdadeiro.

24. **Teste de integração testa principalmente interfaces entre componentes.**
    Verdadeiro.

25. **Teste de sistema deve depender de detalhes internos de implementação.**
    Falso.

26. **Black-box é projetado sem conhecimento da implementação interna.**
    Verdadeiro.

27. **White-box usa conhecimento da implementação.**
    Verdadeiro.

28. **Fuzz testing usa entradas aleatórias ou mutadas para revelar falhas.**
    Verdadeiro.

29. **Mutation testing altera o código para avaliar se os testes detectam mudanças.**
    Verdadeiro.

30. **No Plan-and-Document, aceitação vem tipicamente antes de unidade.**
    Falso.

---

## Resumo final para decorar

```text
Teste = comparar observado vs esperado.
Objetivo = encontrar bugs cedo e demonstrar correção.
Validação = produto certo.
Verificação = produto corretamente construído.
Erro = humano.
Falta/defeito = erro materializado no artefato.
Falha = comportamento incorreto observado.
Oráculo = decide passou/falhou.
TDD = Red → Green → Refactor.
FIRST = Fast, Independent, Repeatable, Self-checking, Timely.
AAA = Arrange, Act, Assert.
SUT = sistema sob teste.
Double = substituto controlado.
Stub = resposta falsa controlada.
Mock = objeto falso/interação esperada.
Factory = cria objeto real sob demanda.
Fixture = dado fixo carregado no teste.
Cobertura alta ≠ ausência de bugs.
Unidade = pequeno, rápido, preciso.
Integração = interfaces entre partes.
Sistema = comportamento global observável.
Black-box = sem conhecer implementação.
White-box = conhecendo implementação.
Teste nunca prova ausência de bugs.
```
