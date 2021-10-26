#!/bin/sh

source ./config

NAME=move-mongo-test

if [ -z "${PASS}" ]; then
	echo "Missing username or password!"
	exit 0
fi

if docker ps -a --format '{{.Names}}' | grep -Eq "^${NAME}\$"; then
  echo "Container: [${NAME}] exists! Database cannoot be created! Please remove container first!";
	exit 0;
fi

run() {
	docker run -d \
		--name ${NAME} \
		-p 27018:27017 \
		-e MONGO_INITDB_ROOT_USERNAME=${USER} \
		-e MONGO_INITDB_ROOT_PASSWORD=${PASS} \
		mongo:latest
}

reset() {
	docker stop ${NAME} && docker rm ${NAME}
}

importData() {
	docker cp data/sales.csv ${NAME}:/tmp/sales.csv
	docker exec -it ${NAME} bash -c "mongoimport --authenticationDatabase admin --username ${USER} --password ${PASS} -d move-db -c users --type csv --file /tmp/sales.csv --headerline"
}

{
	run 
	importData 
	echo "Completed!"
} || {
	echo "Error occurred!"
	reset
}

