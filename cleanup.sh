#!/bin/bash

APP="move-app"

stopAndRemove() {
	NAME=${1}

	docker stop ${NAME} && docker rm ${NAME}
}

main() {

	echo "clearn up all resources..."

	stopAndRemove ${APP}
	stopAndRemove ${APP}-mongo-production
	stopAndRemove ${APP}-mongo-e2e

	echo "done"
}

main
