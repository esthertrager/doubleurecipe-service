#!/usr/bin/env bash

rm -rf dist
mkdir dist
cp -r server scripts package.json dist/
cp .kukezerc-prod	dist/.kukezerc
cd dist
npm install --production
gtar -cvzf doubleurecipe-service.tar.gz .
scp doubleurecipe-service.tar.gz kukeze.com:/home/btrager/

ssh kukeze.com "rm -rf /opt/doubleurecipe-service/*
tar xzf ~/doubleurecipe-service.tar.gz -C /opt/doubleurecipe-service/
pm2 restart kukeze-api
rm ~/doubleurecipe-service.tar.gz"