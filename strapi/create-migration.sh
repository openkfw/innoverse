#!/bin/bash

read -p "Enter the name for the migration file: " userFileName
currentDateTime=$(date +"%Y.%m.%dT%H.%M.%S")
fileName="${currentDateTime}.${userFileName}.js"

mkdir -p ./database/migrations
touch "./database/migrations/$fileName"

echo "Migration file created: ./database/migrations/$fileName"