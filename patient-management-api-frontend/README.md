# PatientApi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.It creates a new patient and fetches the newly created patient detail.




## Features

- **Responsive**:Responsiveness to adjust for variable screen sizes.

- **Collapsible Navbar**: The app features a collapsible navigation bar with links to "Add Patient" and "View Patient" for easy access.

- **Routing**: Implements Angular's router for navigation between pages and components, ensuring smooth transitions.

- **LazyLoading**: To improve performance.on-demand load.

- **CanDeactivate Guard**: Protects users from accidental navigation by warning them before leaving a form with unsaved changes.

- **Reactive Forms**: Utilizes Angular’s Reactive Forms for robust form management, including dynamic form building and handling.

- **Form Validation**: Implements strict form validation with Angular Material form controls to ensure the integrity of user input.

- **Error Handling**: Centralized error handling for HTTP requests, providing clear feedback to the user when something goes wrong.

- **Loading Spinner**: Displays a loading spinner to enhance the user experience by indicating when data is being fetched or submitted.

- **Fallback Message**: Shows a fallback message when there is no data or when a request fails, ensuring a clear UX even in edge cases.

- **Angular Material Styling**: The entire app is styled using Angular Material components, providing a modern and responsive design.

- **Property-binding && event-binding**: for cross component communication.

- **Form from Angular Material**: Utilizes Angular Material components for building the form UI, ensuring a consistent and sleek design.

- **HTTP Client Services**: Uses Angular’s `HttpClient` service to manage API requests, abstracted within services for code reuse and maintainability.

- **Pipes and Map Operator**: Angular pipes are used for formatting data in the template, while RxJS `map` operator is employed in services for data transformations.

- **Subject in Services**: Leverages `Subject` from RxJS to manage and share state between components in a reactive way.

- **Navigation After Form Submission**: After successfully submitting a form, the app automatically navigates the user to a
  different route (e.g., the "View Patient" page).

- **Strict Form Validation**: Ensures all forms have robust validation, including required fields, pattern matching, and custom validators to enforce data integrity.

## Installation Guide

- **make sure you are using angular older version(pre-standalone && without signal)**
- **make sure you using node version not greater than 16.10.0**
- **clone the repo in your local system**
- **npm install to install the dependecies**
- **npm start to start to trigger ng-serve**

## BaseUrl

- **baseurl**:https://dev-api.evitalrx.in/v1/fulfillment

## Endpoints

**Method**: POST  
 **Url**: {{BASE_URL}}patients/add  
 **Description**: create a new patient with entered details.

**Method**: POST  
 **Url**: {{BASE_URL}}patients/view
**Description**: create a new patient with entered details.


### Request & Response Body

```json
{
 "apikey": "xxxxx",
 "zipcode": 12345,
 "mobile": 9876543210,
 "first_name": "John",
 "last_name": "Doe",
 "dob": "1990-01-01",
 "gender": "male",
 "blood_group": "O+"
}



{
"status_code": "1",
"status_message": "Patient registered successfully.",
"datetime": "2022-12-06 18:07:04",
"data": {
       "patient_id": "qAj4hhwefVxwuZX9nFxHkQ=="
   }
}


{
    "apiKey": "xxxx",
    "patient_id" : "xxxx"
}

{
    "status_code": "1",
    "status_message": "Success",
    "datetime": "2022-12-06 18:11:54",
    "data": [
        {
            "firstname": "Manav",
            "lastname": "Patel",
            "zipcode": "380008",
            "mobile": "9787998785",
            "patient_id": "qAj4hhwefVxwuZX9nFxHkQ=="
        }
    ]
}



