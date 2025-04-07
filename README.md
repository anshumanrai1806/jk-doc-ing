# Document Management System

This is a document management system that allows users to upload, manage, and ingest documents. It has different user roles with specific permissions to access and modify the documents. This application supports multiple roles: Admin, Editor, and Viewer.

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Running the Application](#running-the-application)
3. [Authentication](#authentication)
4. [User Roles and Permissions](#user-roles-and-permissions)
5. [API Endpoints](#api-endpoints)
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

NOTE : - Using abover API , it will return an access_token which wil be valid for an hour , use that token to access the app

## Types of Users
Admin
This user can any operations in the application such as : 

Change the role of the user
Fetch all the users
Delete an existing user
CRUD of Document
Create and get details of an Ingestion


Editor
This typeof user can perform these operations on their document : 
CRUD of Document / Create , Read , Update and Delete his/her document
Create and Details of ingestion


Viewer
Actions that can be performed : 

Details of ingestion
Read any document


## NOTE
The swagger document can be accessible under http://localhost:3000/api|

## API-Endpoints

BASE URI -> http://localhost:3000

## Anonymous API's

### /auth/register 
any user can register himself with username

{ 
  "username" : "your_username_here",
  "password" : "your_password_here"
}
The user will be created with the role of an viewer(default role)

### /auth/login
{ 
  "username" : "your_username_here",
  "password" : "your_password_here"
}

This will return the access_token usign which one can access the app

### /auth/logout
Logout from the app

### /documents
List all the documents in the app

### /documents/{doc_id}
Get the specific document with the doc_id


## Below are the admin accessable api

### /admin/users/{user_id}/role 
METHOD : PUT
To update user role 


just pass the userId in the params and role in the request body

{
  "role": "editor | viewer"
}


### admin/users/22
Method : DELETE
To delete the user , pass the userId

### admin/users
Method : GET
Fetch all the users info


## The documents api , editor and admin only : 

### /documents
Method : POST
Pass the document title and upload the file

### /documents/{doc_id}
Method : PUT
update the exisitng document

### /documents/{doc_id}
Method : DELETE
Delete and existing document

Note : admin can edit/delete any doc but the editor can only edit/delete his/her document




### Ingestion : 
POST /ingestion/trigger

request body example
{
  "documentId": 123,
  "userId": 456
}


GET /ingestion/status/{documentId}

