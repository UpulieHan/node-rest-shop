## Things to follow when creating a node API
0.1. To run any of the scripts on package.json -> simply type 'npm run XXX' or 'npm XXX' (replace XXX by the script name)(scripts can do literally anything you want) (custom NPM scripts must be preceded by either run-script or run for them to be executed correctly)
0.2. to install a package 'npm install --save <package-name>' or yarn add --save <package-name>
0.3. to install a dev package 'npm install --save-dev <package-name>' or yarn add --save-dev <package-name>
1. Create a folder
2. git init
3. npm install --save express
4. add a new file called server.js
5. create a foldre (api)
6. inside it, create another folder (routes)
7. create the route files in here (express, routes)
8. You need to restart the server whenever you change the code (without installing nodemon)
9. npm insatll --save-dev nodemon
10. nodemon server.js wouldn't work (as nodemon isn't a globally installed package)
11. so, go to package.json and add "start": "nodemon server.js" under scripts
12. To log the incoming requests, install the morgan package, npm install --save morgan
13. npm i --save body-parser (to parse the body of incoming requests)
14. we need to install CORS to disable the Cross-Origin-Resource-Sharing mechanism (a security concern that disable from sending data from one port to another)
15. Use MongoDB as a DB and use Mongoose as a package to work with it
16. npm i --save mongoose
17. create a MongoDB Atlas (get the connection string)
18. To save the passwords as environment variables (create a file called nodemon.json)
19. in it {"env":{"MONGO_ATLAS_PW":"<put the password here>"}}
20. Make sure to pick "JSON" in Postmon ALWAYS (in POST,PUT,PATCH requests)
21. npm i dotenv --save (to use .env to store environment variables) (loads environment variables from a .env file into the process.env variable in Node.js)
21. exec() turns a call in to a promise
21. nesting should be avoided when using promises
21. To parse form data bodies use multer, npm install --save multer
22.
23.
24.
25.
26.
