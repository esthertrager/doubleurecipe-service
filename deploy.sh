#!/usr/bin/env bash

rm -rf dist
mkdir dist
cp -r server package.json dist/
cp .kukezerc-prod	dist/.kukezerc
cd dist
npm install --production
gtar -cvzf doubleurecipe-service.tar.gz .
scp doubleurecipe-service.tar.gz 192.34.60.247:/home/btrager/

ssh 192.34.60.247 "rm -rf /opt/doubleurecipe-service/*
tar xzf ~/doubleurecipe-service.tar.gz -C /opt/doubleurecipe-service/
pm2 restart kukeze-api
rm ~/doubleurecipe-service.tar.gz"