#!/bin/bash
docker build -t choirchat .
docker rm -f choirchat
docker run \
	-dp 8081:8081 \
	-e "URL_PREFIX=" \
	-e "SOCKET_URL=http://localhost:8081" \
	-e "ADMIN_SECRET=8hAKgUpqdCFAjPpzsbsvt3" \
	--name choirchat \
	choirchat
