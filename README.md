cd ~/kibana-custom-dev-86

git clone -b 8.6 https://github.com/edmarmoretti/kibana.git

cd ~/kibana-custom-dev-86/kibana

git checkout -b v8.6.2-ms v8.6.2


//atualização do repositório

git add .

git commit -m ""

git push origin v8.6.2-ms


//para rodar o Kibana

nvm use

yarn install

yarn kbn bootstrap --no-validate

yarn es snapshot -E path.data=../data

yarn start
