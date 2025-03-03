#!/bin/bash

# Exit on error
set -e

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "AWS credentials are not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY."
    exit 1
fi

# Deploy DynamoDB tables
echo "Deploying DynamoDB tables..."
aws cloudformation deploy \
    --template-file infrastructure/dynamodb.yml \
    --stack-name deworm-dynamodb \
    --capabilities CAPABILITY_IAM

# Get the table names from CloudFormation outputs
USERS_TABLE=$(aws cloudformation describe-stacks \
    --stack-name deworm-dynamodb \
    --query 'Stacks[0].Outputs[?OutputKey==`UsersTableName`].OutputValue' \
    --output text)

SONGS_TABLE=$(aws cloudformation describe-stacks \
    --stack-name deworm-dynamodb \
    --query 'Stacks[0].Outputs[?OutputKey==`SongsTableName`].OutputValue' \
    --output text)

HISTORY_TABLE=$(aws cloudformation describe-stacks \
    --stack-name deworm-dynamodb \
    --query 'Stacks[0].Outputs[?OutputKey==`HistoryTableName`].OutputValue' \
    --output text)

# Deploy to AWS Amplify
echo "Deploying to AWS Amplify..."
amplify push

echo "Deployment complete!"
echo "Users Table: $USERS_TABLE"
echo "Songs Table: $SONGS_TABLE"
echo "History Table: $HISTORY_TABLE" 