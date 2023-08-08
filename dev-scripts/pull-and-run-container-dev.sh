#!/bin/bash

# 도커허브 이미지 pull
sudo docker pull $DOCKERHUB_USERNAME / $DOCKERHUB_DEV_REPOSITORY:$DOCKER_TAG

# 도커 run
sudo docker run -d -p 8081:8081 --name my-car-deep-dive $DOCKERHUB_USERNAME / $DOCKERHUB_DEV_REPOSITORY:$DOCKER_TAG

# 사용하지 않는 불필요한 이미지 삭제 -> 현재 컨테이너가 물고 있는 이미지는 삭제 안됨
sudo docker rmi -f $(docker images -f "dangling=true" -q) || true