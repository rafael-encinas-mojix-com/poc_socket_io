#!/bin/bash
VERSION="v45"
TAG=`uuid`
echo ${VERSION}
echo ${TAG}
docker build . -t socket:${VERSION}
docker tag ${TAG} encinas008/socketio:${VERSION}
docker push encinas008/socketio:${VERSION}