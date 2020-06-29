#!/bin/bash
docker build -t choirchat . \
	&& docker tag choirchat maikm/choirchat \
	&& docker push maikm/choirchat
