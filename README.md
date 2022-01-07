# azure

[zimekk.github.io/azure](https://zimekk.github.io/azure)

## env

```sh
node -v
# v12.22.6
npm -v
# 8.3.0
yarn -v
# 1.22.17
```

## install

```sh
brew install azure-cli
brew install pulumi
```

## upgrade

```sh
brew upgrade pulumi
az upgrade
```

## azure

```sh
az login --use-device-code
az account show
```

## create project

```sh
pulumi login --local
pulumi stack init dev
pulumi config set azure-native:location westeurope
pulumi new azure-typescript -f -y
pulumi stack
export PULUMI_CONFIG_PASSPHRASE=...
```

## env

```sh
npm i --save-dev commitlint @commitlint/cli @commitlint/config-conventional husky prettier pretty-quick
npx husky add .husky/pre-commit "npx pretty-quick --staged"
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
npx husky install
```

## git

```sh
git commit -m "chore: initial commit"
```

## create resources

```sh
pulumi up
```

## output

```sh
pulumi stack output --show-secrets
```

## exec

```sh
az container list
az container exec --ids /subscriptions/... --exec-command sh
netstat -ant
```

## fix pending operations

```sh
pulumi stack export > stack.json
pulumi stack import --file stack.json
```

## destroy resources

```sh
pulumi destroy
pulumi stack rm
```
