cd ~/kibana-custom-dev-86

git clone -b 8.6 https://github.com/edmarmoretti/kibana.git

cd ~/kibana-custom-dev-86/kibana

git checkout -b v8.6.2-ms v8.6.2

git add .
git commit -m ""
git push origin v8.6.2-ms
