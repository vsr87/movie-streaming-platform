# language: pt
Funcionalidade: Registo de Novos Utilizadores
    Como um visitante da plataforma
    Desejo poder escolher como realizarei o meu registo, via formulário padrão ou SSO do Google
    Para que eu tenha controlo sobre os dados associados à minha conta e flexibilidade no futuro login

@validacao @interface
Scenario: Tentativa de registo com formato de e-mail inválido
    Given que eu sou um visitante tentando criar uma conta
    And eu preencho o formulário com dados de perfil válidos
    When eu tento finalizar o registo introduzindo os seguintes dados:
        | Campo | Valor               |
        | Nome  | Luiz                |
        | Email | luiz_sem_arroba.com |
        | Senha | senha12345          |
    Then o meu registo deve ser recusado pelo sistema
    And o sistema deve exibir a mensagem de erro "formato de email inválido"

@validacao @interface
Scenario: Tentativa de registo com campos em branco
    Given que eu estou na página de registo de novos utilizadores
    And o formulário exige o preenchimento de todas as informações básicas
    When eu envio o formulário com as seguintes omissões:
        | Campo | Valor            |
        | Nome  |                  |
        | Email | luiz@exemplo.com |
        | Senha |                  |
    Then o sistema deve recusar o meu registo
    And uma mensagem deve informar que "Todos os campos são obrigatórios"

@seguranca @interface
Scenario: Tentativa de registo com senha excedendo o limite máximo 
    Given que o sistema impõe limites de segurança para a criação de credenciais
    And eu insiro um nome e um e-mail válidos no formulário
    When eu submeto o registo utilizando uma senha com "1000" caracteres
    Then o registo do utilizador não deve ser concluído
    And o sistema deve alertar que o "tamanho de senha excede o limite permitido"

@seguranca @api
Scenario: Proteção contra Injeção de NoSQL/SQL nos campos
    Given que a plataforma está com as defesas de segurança activas
    And o sistema valida rigorosamente todas as entradas de dados contra ameaças
    When um utilizador malicioso tenta registar-se preenchendo o campo de e-mail com o seguinte código:
        """
        {"$gt": ""}
        """
    Then o sistema deve bloquear a tentativa imediatamente com segurança
    And nenhuma informação ou estrutura interna da base de dados deve ser exposta

@sso @google @resiliencia
Scenario: Falha de comunicação com a API do Google
    Given que eu sou um utilizador que prefere a autenticação social
    And o serviço externo do Google está temporariamente indisponível
    When eu tento entrar na plataforma submetendo a autenticação com:
        | Provedor | Token        |
        | Google   | token_valido |
    Then a aplicação deve lidar com a falha externa de forma resiliente
    And eu devo ver a mensagem de erro "Erro ao autenticar com o Google"

@sso @google @seguranca
Scenario: Tentativa de login com token do Google expirado ou forjado
    Given que a plataforma valida rigorosamente os tokens de provedores externos
    And eu sou um utilizador tentando aceder a uma área restrita
    When eu tento fazer login fornecendo as seguintes credenciais adulteradas:
        | Provedor | Token             |
        | Google   | token_manipulado  |
    Then o sistema deve negar o meu acesso imediatamente
    And o erro apresentado deve indicar que o "Token do Google inválido"

@validacao @interface
Scenario Outline: Validação combinada de dados inválidos ou incompletos
    Given que eu sou um visitante tentando criar uma conta
    And eu estou a visualizar o formulário de novos utilizadores
    When eu tento registar-me fornecendo os dados de teste:
        | Campo | Valor     |
        | Nome  | <nome>    |
        | Email | <email>   |
        | Senha | <senha>   |
    Then o meu registo deve ser rejeitado pelo sistema
    And a mensagem de erro deve indicar "<mensagem_esperada>"

    Examples:
        | nome | email               | senha      | mensagem_esperada                          |
        | Luiz | luiz_sem_arroba.com | senha12345 | formato de email inválido                  |
        |      | luiz@exemplo.com    |            | Todos os campos são obrigatórios           |
        | Luiz | luiz@exemplo.com    | longa_1000 | tamanho de senha excede o limite permitido |