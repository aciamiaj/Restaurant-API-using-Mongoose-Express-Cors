/********************************************************************************* * 
 * ITE5315 – Project * 
 * I declare that this assignment is my own work in accordance with Humber Academic Policy* .
  * No part of this assignment has been copied manually or electronically from any other source * 
  * (including web sites) or distributed to other students. *
  *  * 
    Name: Sarath Chandran Student ID: n01580673
    Name: Jaimaica Daisy Eugenio Student ID: n01516797
Date: April 22, 2023 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const Handlebars = handlebars.create({});

const app = express();
app.use(cors());
app.set('view engine','hbs');
app.use(methodOverride('_method'));

app.use(express.static('public'))
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  }));

app.get('/', (req, res) => {
    res.render('main',{layout : 'index'});
});

const uri = 'mongodb+srv://sckanna:Password1234@expressjs.iyqpzlt.mongodb.net/sample_restaurants?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');

  const restaurantSchema = new mongoose.Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [{
        date: Date,
        grade: String,
        score: Number
    }],
    name: String,
    restaurant_id: String
    });

  

    const Restaurant = mongoose.model('restaurants', restaurantSchema);

// a page to pass id to search a restaurant
    app.get('/searchrestaurants', async (req, res) => {
      res.render('partials/searchrestaurantsbyID');  
                     
      });


    app.get('/api/getRestaurantById', async (req, res) => {
      
    try {      
        const search  = req.query.restid ;
        console.log(search);
        const restaurants = await Restaurant.find({restaurant_id:search}).lean().exec();
        if(restaurants.length>0){ 
        res.render('partials/AllRestaurants', { restaurants:restaurants })  
        }
        else
        {
          res.render('partials/AllRestaurants', { successMsg: "No results found" })
        }
        console.log(restaurants) ;   
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });

    async function updateRestaurantById(data, Id) {
      try {
        
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
          { restaurant_id: Id },
          data,
          { new: true }
        );
        //console.log(updatedRestaurant);
        return updatedRestaurant;
      } catch (error) {
        throw error;
      }
    }
    
    app.get('/api/updateRestaurantById/:id', async (req, res) => {
      const restaurantId = req.params.id; 
      const restaurants = await Restaurant.find({restaurant_id:restaurantId}).lean().exec();
      
      res.render('partials/updateRestaurantById', { restaurants:restaurants });  
                     
      });

    app.put('/api/updateRestaurantById', async (req, res) => {
          
      const restaurantId = req.body.restaurant_id;
      console.log('i am in put method with id',  restaurantId );  
      const restaurantData = req.body;
      try {
        const updatedRestaurant = await updateRestaurantById(restaurantData, restaurantId);
        console.log('back here to render',updatedRestaurant);
        res.render('partials/updateRestaurantById', { restaurants:updatedRestaurant, successMsg: "Successfully updated" });
      } catch (error) {
        res.status(500).send(error);
      }
    }); 

    async function deleteRestaurantById(Id) {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(Id);
      return deletedRestaurant;
    }

    app.get('/api/deleteRestaurantById/:id', async (req, res) => {
      const restaurantId = req.params.id; 
      const restaurants = await Restaurant.find({restaurant_id:restaurantId}).lean().exec();
      
      res.render('partials/deleteRestaurantById', { restaurants:restaurants });  
                     
      });
    
    app.delete('/api/deleteRestaurantById', async (req, res) => {
      const restaurantId = req.body.restaurant_id;
      const restaurants = await Restaurant.find({restaurant_id:restaurantId}).lean().exec();
      try {
        console.log('inside delete with',restaurantId,restaurants[0]._id);
        const deletedRestaurant = await deleteRestaurantById(restaurants[0]._id);
        res.render('main',  { successMsg: 'Restaurant Deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting restaurant');
      }
    });

    app.get('/api/addNewRestaurant', (req, res) => {
      res.render('partials/addNewRestaurant', { layout: 'index' });
    });
    app.post('/api/addNewRestaurant', async (req, res) => {
      try {
        // create a new Restaurant instance with the data from the request body
        const newRestaurant = new Restaurant({
          restaurant_id: req.body.restaurant_id,
          name: req.body.name,
          cuisine: req.body.cuisine,
          borough: req.body.borough,
          address: {
            street: req.body.street,
            building: req.body.building,
            zipcode: req.body.zipcode,
            coord: []
          },
          grades: [{
            date: new Date(req.body.date),
            grade: req.body.grade,
            score: Number(req.body.score)
          }]
        });
        // save the new restaurant to the database
        await newRestaurant.save();
        // send a success response
        res.render('partials/addNewRestaurant', { layout: 'index', successMsg: 'Restaurant added successfully' });
      } catch (err) {
        console.error(err);
        res.render('partials/addNewRestaurant', { layout: 'index', errorMsg: 'Server error' });
      }
    });

   app.get('/allrestaurants', async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10 ;  // number of results per page
    const borough= req.query.borough;
    const currentPage = Number(req.query.page) || 1 ; // current page number, defaults to 1 if not provided
 
    const restaurantsCount = await Restaurant.countDocuments(); // total number of restaurants
    const pageCount = Math.ceil(restaurantsCount / pageSize); // total number of pages
  
    // calculate skip and limit based on current page and page size
    const skip = (currentPage - 1) * pageSize;
    const limit = pageSize;
    var restaurants = await Restaurant.find().skip(skip).limit(limit).lean().exec();
    
    if(borough){
      restaurants = await Restaurant.find({borough:borough}).skip(skip).limit(limit).lean().exec();
    }
   
  
    let start = currentPage - 5;
    let end = currentPage + 4;
    if (start < 1) {
      start = 1;
      end = Math.min(pageCount, 10);
    }
    if (end > pageCount) {
      end = pageCount;
      start = Math.max(1, end - 9);
    }
  
    // generate array of pages within range
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push({
        page: i,
        isActive: i === currentPage
      });
    }
  
    // set prevPage and nextPage variables
    let prevPage, nextPage;
    if (currentPage > 1) {
      prevPage = currentPage - 1;
    }
    if (currentPage < pageCount) {
      nextPage = currentPage + 1;
    }
  
    res.render('partials/AllRestaurants', { 
      restaurants: restaurants,
      pages: pages,
      prevPage: prevPage,
      nextPage: nextPage
    });
  });
  
  });
const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

