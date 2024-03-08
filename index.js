import express from 'express';
import path from 'path';
import ProductController from './src/controllers/product.controller.js';
import ejsLayouts from 'express-ejs-layouts';
import validateRequest from './src/middlewares/addProductMiddleware.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';
import { auth } from './src/middlewares/auth.middleware.js';
import UserController from './src/controllers/user.controller.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { setLastVisit } from './src/middlewares/lastvisit.middleware.js';

const server = express();

//use the static js file in public folder for delete 
server.use(express.static("public"));

//create an instance of product controller
const productController = new ProductController();
const usersController = new UserController();

//setup ejs layouts
server.use(ejsLayouts);
server.use(express.json());
//parse form data
server.use(express.urlencoded({extended : true}));
server.use(session({
    secret:'SecretKey',
    resave:false,
    saveUninitialized:true,
    cookie:{secure: false}
}))
server.use(cookieParser());
server.use(setLastVisit);

//setup view engine settings
server.set("view engine","ejs");
server.set("views",path.join(path.resolve(),"src","views"));




server.get('/register', usersController.getRegister);
server.post('/register', usersController.postRegister);
server.get('/login', usersController.getLogin);
server.post('/login', usersController.postLogin);
server.get("/",
        setLastVisit,
        auth, 
        productController.getProducts);
server.get("/add-product", auth,productController.getAddProduct);
server.post(
    "/",
    auth,
    uploadFile.single('imageUrl'),
    validateRequest,
    productController.postAddProduct
);
server.get("/update-product/:id", auth,productController.getUpdateProductView);
server.post("/update-product", auth,uploadFile.single('imageUrl'),productController.postUpdateProduct);
server.post("/delete-product/:id", auth,productController.deleteProduct);
server.get('/logout',usersController.logout);
server.use(express.static('src/views'));

server.listen(3200);
console.log('server is listening on 3200');