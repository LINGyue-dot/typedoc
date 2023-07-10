#!/bin/bash
set -e

BRANCH=$1
APPNAME=bugbash

# 根据branch区分env
if [ ! -n "$BRANCH" ]
then
  echo "branch IS NULL"
  exit 1
fi

# 可以你的仓库分支名和这里的不一致，需要修改
if [ "$BRANCH" = "main" ]
then
  OSS_PATH=prod
  BUILD_ENVIRONMENT=build:prod
elif [ "$BRANCH" = "test" ]
then
  OSS_PATH=test
  BUILD_ENVIRONMENT=build:test
elif [ "$BRANCH" = "gen-dic" ]
then
  OSS_PATH=dev
  BUILD_ENVIRONMENT=build:dev
else
  echo "environment is invalid"
fi

FULL_PATH=/$APPNAME/$OSS_PATH

# 向外 export 出当前环境变量，后面在config文件中可以使用
export FULL_PATH

# dependencies config
npm config set registry https://artifactory.tusimple.ai/artifactory/api/npm/npm-infra-common/
npm install -g pnpm
pnpm config set registry https://artifactory.tusimple.ai/artifactory/api/npm/npm-infra-common/
pnpm install
pnpm add ali-oss -D # oss上传依赖这个包

# build 项目的打包脚本，每个项目都不一样，需要修改，这里注意区分环境
pnpm run $BUILD_ENVIRONMENT

# deploy 这是把当前build产物上传到oss。一般默认的打包产物都会放在'/dist'文件夹，这里可也以通过传入DIST_PATH='/folder'参数修改上传的默认文件夹为'/folder'
curl -s https://tusen-fe.oss-cn-beijing-internal.aliyuncs.com/fe-common/master/oss.js | OSS_PATH=$FULL_PATH TAG=$2 ACCESS_KEY_ID=$3 ACCESS_KEY_SECRET=$4 node
