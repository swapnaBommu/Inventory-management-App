import express from 'express';
import path from 'path';
import ProductController from './src/controllers/product.controller.js';
import ejsLayouts from 'express-ejs-layouts';
import validateRequest from './src/middlewares/addProductMiddleware.js';

const server = express();

//use the static js file in public folder for delete 
server.use(express.static("public"));

//create an instance of product controller
const productController = new ProductController();

//setup ejs layouts
server.use(ejsLayouts);
server.use(express.json());
//parse form data
server.use(express.urlencoded({extended : true}));

//setup view engine settings
server.set("view engine","ejs");
server.set("views",path.join(path.resolve(),"src","views"));





server.get("/",productController.getProducts);
server.get("/add-product",productController.getAddProduct);
server.post("/",validateRequest,productController.postAddProduct);
server.get("/update-product/:id",productController.getUpdateProductView);
server.post("/update-product",productController.postUpdateProduct);
server.post("/delete-product/:id",productController.deleteProduct);

server.use(express.static('src/views'));

server.listen(3200);
console.log('server is listening on 3200');