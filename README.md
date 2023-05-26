# Restaurant-API

This repository contains the code for Restaurant API  developed by Sarath Chandran and Jaimaica Daisy Eugenio. The project is a web application built using Express.js and MongoDB.

## Installation
To run the project, follow these steps:

Clone the repository or download the source code files.
Install the required dependencies by running the following command in the project directory:
npm install
Make sure you have MongoDB installed and running on your system.
Update the MongoDB connection URI in the code to your own database.
Start the application by running the following command:
npm start
Open your web browser and access the application at http://localhost:3000.

## Project Structure
index.js: The main entry point of the application.
public/: Contains static assets such as CSS and client-side JavaScript files.
views/: Contains the views/templates used by the application.
models/: Contains the Mongoose models for interacting with the MongoDB database.
partials/: Contains partial views used for rendering specific sections of the application.

## Routes and Functionality
The application provides the following routes and corresponding functionality:
/: Renders the main view.
/allrestaurants: Retrieves a paginated list of all restaurants from the MongoDB database and renders the "AllRestaurants" view.
/searchrestaurants: Renders the search form to search for a specific restaurant by ID.
/api/getRestaurantById: Retrieves a restaurant from the MongoDB database based on the provided restaurant ID and renders the "AllRestaurants" view with the result.
/api/updateRestaurantById/:id: Renders the form to update a specific restaurant by ID.
/api/updateRestaurantById: Updates a restaurant in the MongoDB database based on the provided data and restaurant ID, then renders the "updateRestaurantById" view with the updated restaurant.
/api/deleteRestaurantById/:id: Renders the confirmation view to delete a specific restaurant by ID.
/api/deleteRestaurantById: Deletes a restaurant from the MongoDB database based on the provided restaurant ID, then renders the main view.
/api/addNewRestaurant: Renders the form to add a new restaurant.
/api/addNewRestaurant: Adds a new restaurant to the MongoDB database based on the provided data, then renders the "addNewRestaurant" view with a success message.

## Contributing
Contributions to this project are welcome. If you find any issues or have suggestions for improvements, feel free to create a pull request or submit an issue in the repository.
