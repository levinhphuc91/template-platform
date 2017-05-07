#!/bin/bash

gulp build
cd ..
cp -rf template-platform/dist/* template-platform-deploy/
cd template-platform-deploy
git add .
git commit -m 'make it better'
git push heroku master
