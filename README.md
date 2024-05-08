### Iniciando a aplicação

1. Clonar: http://tfs.crptecnologia.com.br/tfs/CRPTecnologia/TRE-MT.FolgasCompesatorias/_git/TRE-MT.FolgasCompensatorias.Front
2. Na pasta raiz, executar o comando `npm install`
3. Executar a aplicação `npm run start`
4. Acessar aplicação: http://localhost:4201

### Formatação e verificação do código

O projeto utiliza o ESLint:https://eslint.org/ para verificação das regras do TypeScript e o
https://prettier.io/ para deixar o código organizado.

1. Para verificar se o existe algum problema com o código, executar `ng lint`
2. Para verificar e corrigir problemas apontados pelo prettier, executar `ng lint --fix`
3. Outra opção para formatar todo o código é executar `prettier --write .`

### Configurando o .env

Para o ambiente de desenvolvimento, basta acessar a pasta src/assets/config/envs e substituir
o `environment.dev.json` para `environment.json`

### Compilando arquivos scss

1. Instale o sass globalmente: `npm install -g sass`
2. Escolha o tema que deseja alterar e recompile utilizando o comando:
   `sass src/assets/theme/mytheme/theme.scss src/assets/theme/mytheme/theme.css`
3. Caso deseje ficar escutando de e compilando de forma automatica, basta executar o comando:
   `sass --watch src/:src/ --no-source-map`

### Docker de release

O projeto contém uma pasta chamada docker, onde está configurado o docker, docker-compose, envs e o arquivo de configuração
do nginx para a publicação de produção para o TRE-SC, onde o context path está como portal-mesario.

### Utilizando o replace de version

Para realizar o replace da versão de forma dinamica, basta executar o comando:

npm run replace-version --build_version=1.1.0 --env_file="./src/environments/environment.\*"

### Template e UI Lib

O projeto utiliza a biblioteca primeng e o template atlantis.

As documentações destes respectivos pacotes se encontram:

1. https://primeng.org/
2. https://www.primefaces.org/atlantis-ng/


### Build do Docker
* Gerar imagem
````
docker login -u douglaseleuterioferreira -p Fox789789@!
````
````
docker build -t crm-app-v2:v2.0.0 --build-arg VERSION=2.0.0 .
````
````
docker tag crm-app-v2:v2.0.0 douglaseleuterioferreira/apps:crm-app-v2
````
````
docker push douglaseleuterioferreira/apps:crm-app-v2
````
