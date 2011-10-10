#!/usr/bin/env sh

rsync -avz --exclude='.DS_Store' --delete --delete-excluded public/ k20e:~/halloween
