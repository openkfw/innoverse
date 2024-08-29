#!/bin/bash
set -ev

Help()
{
    # Display Help
    echo
    echo "Help"
    echo "This script builds a Docker image and pushes it to both a private and a public Docker registry."
    echo
    echo "Syntax: $(basename "$0") [option]"
    echo "Example: $(basename "$0") --build"
    echo "options:"

    echo "-h   | --help                 Print the help section"
    echo
}

docker_login() {
    local USERNAME="$1"
    local PASSWORD="$2"
    local REGISTRY_URL="$3"
    echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin "$REGISTRY_URL"
}

docker_tag_and_push() {
    local TEMP_TAG="$1"
    local TAG="$2"
    docker tag "$TEMP_TAG" "$TAG"
    docker push "$TAG"
}

# Parse command line arguments
while [ "$1" != "" ]; do
    case $1 in
        -h|--help)
            Help
            exit 1
        ;;
        *)    # unknown option
            echo "Unknown option: $1"
            Help
            exit 1
        ;;
    esac
done

# Check if required variables are set
if [ -z "$IMAGE_NAME" ] || [ -z "$PRIVATE_REGISTRY_URL" ] || [ -z "$PRIVATE_REGISTRY_PASSWORD" ] || [ -z "$PRIVATE_REGISTRY_USERNAME" ] \
|| [ -z "$PRIVATE_PROD_REGISTRY_URL" ] || [ -z "$PRIVATE_PROD_REGISTRY_PASSWORD" ] || [ -z "$PRIVATE_PROD_REGISTRY_USERNAME" ]  \
|| [ -z "$PUBLIC_REGISTRY_URL" ] || [ -z "$PUBLIC_REGISTRY_PASSWORD" ] || [ -z "$PUBLIC_REGISTRY_USERNAME" ]; then
    echo "Error: Missing required parameters."
    Help
    exit 1
fi

if [ "$GITHUB_EVENT_NAME" == "release" ] & [ -z "$RELEASE_VERSION" ]; then
  echo "Error: you are trying to create a release without a release version!"
  exit 1
fi

export BUILDTIMESTAMP=$(date -Iseconds)

# Get github branch value
# Value is found on different locations depending on the github event
if [ -n "$GITHUB_HEAD_REF" ]; then
    export GITHUB_BRANCH="$GITHUB_HEAD_REF"
else
    export GITHUB_BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

# set placeholder tag 
export TEMP_TAG="$IMAGE_NAME:$GITHUB_BRANCH"
if [[ "$GITHUB_EVENT_NAME" = "release" ]];
then
    # placeholder so docker build is working correctly
    TEMP_TAG="release"
fi
docker build --tag "$TEMP_TAG" -f Dockerfile .

# if a pull request is updated
if [[ "$GITHUB_EVENT_NAME" = "pull_request" ]];
then
    docker_login "$PRIVATE_REGISTRY_USERNAME" "$PRIVATE_REGISTRY_PASSWORD" "$PRIVATE_REGISTRY_URL"
    export TAG_BUILD_PRIVATE="$PRIVATE_REGISTRY_URL/$IMAGE_NAME:$GITHUB_BRANCH"
    docker_tag_and_push "$TAG_BUILD_PRIVATE"
fi

# if main branch is updated
if [[ "$GITHUB_BRANCH" = "main" ]] && [[ "$GITHUB_EVENT_NAME" = "push" ]];
then
    export TAG="main"
    docker_login "$PRIVATE_REGISTRY_USERNAME" "$PRIVATE_REGISTRY_PASSWORD" "$PRIVATE_REGISTRY_URL"
    docker_tag_and_push "$TEMP_TAG" "$TAG"

    docker_login "$PUBLIC_REGISTRY_USERNAME" "$PUBLIC_REGISTRY_PASSWORD" "$PUBLIC_REGISTRY_URL"
    docker_tag_and_push "$TEMP_TAG" "$TAG"

fi
 

# If release version is specified, push additional tags to both registries
if [[ "$GITHUB_EVENT_NAME" = "release" ]];
then
    # Push to the private prod registry
    export TAG_RELEASE_PRIVATE="$PRIVATE_PROD_REGISTRY_URL/$IMAGE_NAME:$RELEASE_VERSION"
    export TAG_LATEST_PRIVATE="$PRIVATE_PROD_REGISTRY_URL/$IMAGE_NAME:latest"
    docker_login "$PRIVATE_PROD_REGISTRY_USERNAME" "$PRIVATE_PROD_REGISTRY_PASSWORD" "$PRIVATE_PROD_REGISTRY_URL"
    docker_tag_and_push "$TEMP_TAG" "$TAG_LATEST_PRIVATE"
    docker_tag_and_push "$TEMP_TAG" "$TAG_RELEASE_PRIVATE"

    # Push to the public registry
    export TAG_RELEASE_PUBLIC="$PUBLIC_REGISTRY_URL/$IMAGE_NAME:$RELEASE_VERSION"
    export TAG_LATEST_PUBLIC="$PUBLIC_REGISTRY_URL/$IMAGE_NAME:latest"
    docker_login "$PUBLIC_REGISTRY_USERNAME" "$PUBLIC_REGISTRY_PASSWORD" "$PUBLIC_REGISTRY_URL"
    docker_tag_and_push "$TEMP_TAG" "$TAG_RELEASE_PUBLIC"
    docker_tag_and_push "$TEMP_TAG" "$TAG_LATEST_PUBLIC"

fi
