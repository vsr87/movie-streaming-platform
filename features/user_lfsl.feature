Feature: Cadastro de Usuário
    Como um visitante da plataforma
    Eu desejo poder escolher como realizarei meu cadastro, via formulário padrão ou SSO do Google
    Para que eu tenha controle sobre os dados associados à minha conta e flexibilidade no futuro login

Scenario: Cadastro bem sucedido via SSO
    Given eu estou na página de "Cadastro"
    And o email "exemplo@test.com" do Google não possui cadastro no sistema
    When eu realizo o cadastro utilizando minha conta Google com email "exemplo@test.com"
    And eu defino o nome de usuário "João"
    Then uma nova conta de usuário deve ser criada para "exemplo@test.com"
    And eu devo ser autenticado automaticamente no sistema
    And deve aparecer uma mensagem de sucesso

Scenario: Cadastro mal sucedido via SSO
    Given eu estou na página de "Cadastro"
    And o email "exemplo@test.com" do Google possui cadastro no sistema
    When eu tento realizar o cadastro utilizando minha conta Google com o email "exemplo@test.com"
    And eu defino o nome de usuário "João"
    Then deve aparecer uma mensagem de aviso "conta já está vinculada"
    And eu devo ser direcionado a página de "Login"

Scenario: Cadastro bem sucedido via formulário
    Given eu estou na página de "Cadastro"
    And o email "exemplo@test.com" não possui cadastro no sistema
    When eu realizo o cadastro com o email "exemplo@test.com" e senha "12345@aM"
    And eu defino o nome de usuário "João"
    Then uma nova conta de usuário deve ser criada para "exemplo@test.com"
    And eu devo ser autenticado automaticamente no sistema
    And deve aparecer uma mensagem de sucesso

Scenario: Cadastro mal sucedido via formulário
    Given eu estou na página de "Cadastro"
    And o email "exemplo@test.com" possui cadastro no sistema
    When eu tento realizar o cadastro com o email "exemplo@test.com" e senha "12345@aM"
    And eu defino o nome de usuário "João"
    Then deve aparecer uma mensagem de aviso "conta já está vinculada"
    And eu devo ser direcionado a página de "Login"

Scenario: Cadastro mal sucedido via formulário devido a senha inválida por tamanho
    Given eu estou na página de "Cadastro"
    And o email "exemplo@test.com" não possui cadastro no sistema
    When eu tento realizar o cadastro com o email "exemplo@test.com" e senha "1234@aM"
    And eu defino o nome de usuário "João"
    Then deve aparecer uma mensagem de aviso "tamanho de senha inválida"
    And eu devo permanecer na página de "Cadastro"