#!/bin/sh

source ./config

if [ -z "${PASS}" ]; then
	echo "Missing username or password!"
	exit 0
fi

docker run -d \
 	--name mongo \
	-p 27017:27017 \
	-e MONGO_INITDB_ROOT_USERNAME=${USER} \
	-e MONGO_INITDB_ROOT_PASSWORD=${PASS} \
	mongo:latest

