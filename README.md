# Voting-Prototype

solidityコードの動かし方

contracts > Voting.sol

と移動し、出てきたコードをコピー。

https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js
に移動し、適当な場所にVoting.solファイルを作り、そこにコピーしたコードをコピー。

左のメニューバーから"solidity compiler"ボタンを押し、remixの最新版のバージョンを確認した上で、コード18行目のバージョンを最新版のバージョンに変更する。

青色のコンパイルボタンを押し、左メニューバーに緑のチェックマークが出たら、その下の"Deploy & run transactions"ボタンを押す

すると、オレンジ色のデプロイボタンが出るので、そのボタンの右側に候補者名を配列形式([Alice,Bob]のような形)で入れて、デプロイボタンを押す。

そうすると、Deployed contractsが下に出現するので、>を押し、開く。そうするとさまざまなボタンが出てくるので自由に押してみる(上の"ACCOUNT"でアカウントを変えられる)
