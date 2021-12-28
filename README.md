# scrap

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

## create project

```sh
pulumi new azure-typescript -f -y
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

## destroy resources

```sh
pulumi destroy
```
