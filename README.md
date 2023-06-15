# Pingway App

The purpose of this backend is to provide an API for the UI which allows users to enter the things they want to be reminded of (pinged with) on a defined basis.

# Architecture

The UI is deployed to AWS Amplify. API is built with Lambdas, SQS, SES, API Gateway, Cognito, Event Bridge.

AWS Lambda PowerTools are used to adopt best practices.
