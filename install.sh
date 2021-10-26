#!/bin/bash

APP="move-app"

prebuild() {
	CONFIG=${1}
	echo "loading configuration from ${CONFIG}..."
	source ${CONFIG}
}

build() {
	echo "Docker build now..."
	docker build \
		--build-arg	DB_USER=${USER} \
		--build-arg DB_PASS=${PASS} \
		-t ${APP}:latest \
		. 
}

install() {
	BUILD_ENV="${1}"
	echo "Install database for ${BUILD_ENV}..."
	source ./scripts/db
	if [ -z "${1}" ]; then
		BUILD_ENV=production
	fi
	# production db
	createDB "${APP}-mongo-${BUILD_ENV}" ${USER} ${PASS} ${PORT}
}

run() {
	NAME=${APP}
	echo "run application..."
	docker run -d \
		--name ${NAME} \
		-p 4000:3000 \
		${APP}:latest
}

main() {

	# run production args
	prebuild ./scripts/config
	
	install production
	
	build

	run

	# build e2e testing db
	prebuild ./scripts/test/config
	
	install ese

	echo "done"
}

main
