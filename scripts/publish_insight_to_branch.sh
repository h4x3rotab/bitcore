#!/bin/bash

REV=$(git rev-parse --short HEAD)
NODE_VER=$(node --version)

if [ $NODE_VER != "v11.15.0" ]; then
  echo "Node version must be v11.15.0, but you have ${NODE_VER}"
  exit -1
fi

pushd packages/insight
npm run build:prod
popd


DIR=$(mktemp -d -t insight-prod-XXXXXX)

cp -r ./packages/insight/www/* "$DIR/"
git checkout insight-prod
cp -r $DIR/* ./
echo "$REV" > REV

git add .
git commit -m "Publish ${REV}"

rm -rf "$DIR"

# push to github:
#   git push origin insight-prod:insight-prod
