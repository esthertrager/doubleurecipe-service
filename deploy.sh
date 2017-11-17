#!/usr/bin/env bash

rm doubleurecipe-service.tar.gz
gtar -cvzf doubleurecipe-service.tar.gz *
scp doubleurecipe-service.tar.gz 192.34.60.247:/home/btrager/

ssh 192.34.60.247 "rm -rf /opt/doubleurecipe-service/*
tar xzf ~/doubleurecipe-service.tar.gz -C /opt/doubleurecipe-service/
rm ~/doubleurecipe-service.tar.gz"