Steps to Execute
  # to start bulding the services

npm install

  # to run the app
npm run start:dev

Use this access_token to get access to the application as an admin

curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "username" : "admin", "password" : "password"
}'

as an editor

curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "username" : "Anshuman", "password" : "password"
}'


Types of Users
Admin
This user can any operations in the application such as

Registering new user
CRUD of Document
Create and get details of an Ingestion


Editor
This typeof user can perform any operation on his/her document

CRUD of Document
Create and Details of ingestion
Viewer
This typeof user can perform any operation on the document

Details of ingestion
Read any document
NOTE
The swagger document can be accessible under http://localhost:3000/api

User Authentication
Once you get the access_token after the login of an user, then use that access_token to access the features


Ingestion : 
POST /ingestion/trigger

request body example
{
  "documentId": 123,
  "userId": 456
}


GET /ingestion/status/{documentId}

