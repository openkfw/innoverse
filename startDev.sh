#!/bin/bash

# Load the .env file and export the required environment variables
if [ -f "./app/.env" ]; then
  export $(grep -E '^(POSTGRES_USER|POSTGRES_PASSWORD)=' ./app/.env | xargs)
else
  echo ".env file not found in ./app directory"
  exit 1
fi


# Check if POSTGRES_USER and POSTGRES_PASSWORD are set
if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_PASSWORD" ]; then
  echo "POSTGRES_USER or POSTGRES_PASSWORD not set. Please check your .env file."
  exit 1
fi

# Start or shut down the docker compose
if [ "$1" == "--down" ]; then
  echo "Stopping Docker Compose..."
  docker compose down
else
  echo "Starting Docker Compose..."
  docker compose up
fi