# Document Management System

This is a document management system that allows users to upload, manage, and ingest documents. It has different user roles with specific permissions to access and modify the documents. This application supports multiple roles: Admin, Editor, and Viewer.

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Running the Application](#running-the-application)
3. [Authentication](#authentication)
4. [User Roles and Permissions](#user-roles-and-permissions)
5. [API Endpoints](#API-endpoints)
6. [Ingestion Process](#ingestion-process)

---

## Setup Instructions

To start building and running the application, follow these steps:

### 1. Install Dependencies

Run the following command to install all the required dependencies:

```bash
npm install


## to run the app
npm run start:dev

## Curl to get access to the application


### admin
curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "username" : "admin", "password" : "password"
}'



### editor
curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "username" : "Anshuman", "password" : "password"
}'

NOTE : - Using above API , it will return an access_token which will be valid for an hour , use that token to access the app

## Types of Users
Admin
This user can any operation in the application such as : 

Change the role of the user
Fetch all the users
Delete an existing user
CRUD of Document
Create and get details of an Ingestion


Editor
This type of user can perform these operations on their document : 
CRUD of Document / Create , Read , Update and Delete his/her document
Create and view View ingestion details


Viewer
Actions that can be performed : 

View ingestion details
Read documents


## NOTE
The Swagger document can be accessed under http://localhost:3000/API|

## API-Endpoints

BASE URI -> http://localhost:3000

## Anonymous APIs

### /auth/register 
any user can register himself with username

{ 
  "username" : "your_username_here",
  "password" : "your_password_here"
}
The user will be created with the role of an Viewer (default role)

### /auth/login
{ 
  "username" : "your_username_here",
  "password" : "your_password_here"
}

This will return the access_token using which one can access the app

### /auth/logout
Logout from the app

### /documents
List all the documents in the app

### /documents/{doc_id}
Get the specific document with the doc_id


## Below are the admin accessible API

### /admin/users/{user_id}/role 
METHOD : PUT
To update user role 


Just pass the userId in the params and role in the request body

{
  "role": "editor | viewer"
}


### admin/users/22
Method : DELETE
To delete the user , pass the userId

### admin/users
Method : GET
Fetch all user information


## The documents API , editor and admin only : 

### /documents
Method : POST
Pass the document title and upload the file

### /documents/{doc_id}
Method : PUT
update the existing document

### /documents/{doc_id}
Method : DELETE
Delete an existing document

Note : admin can edit/delete any doc but the editor can only edit/delete his/her document




1. Trigger Document Ingestion
Endpoint: /ingestion/trigger

Method: POST

Request Body Example:
{
  "documentId": 123,
  "userId": 456
}
Description: This API triggers the ingestion process for the document identified by documentId and associates it with the userId. The ingestion process is event-driven, meaning it will asynchronously process the ingestion via microservices, and the status will be updated once the processing is completed.

Note: The ingestion process is handled through an event-driven architecture where a message is emitted to a queue, which is consumed by the relevant microservices for processing. The status of the ingestion will be updated in real-time once the microservices complete the process.



2. Get Ingestion Status
Endpoint: /ingestion/status/{documentId}

Method: GET

Description: This API fetches the current status of the ingestion process for a specific document identified by documentId.

Note: The status is updated asynchronously after the ingestion process is completed. You can check the status at any point by calling this endpoint. The status will indicate whether the ingestion was successful, failed, or is still in progress.