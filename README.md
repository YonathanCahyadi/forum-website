# Forum Website
This is project made by Yonathan Cahyadi. This project goal is to make a Simple Forum Website, like Reddit. This is a **Full Stack Project** with the stack/technologies used are:
- **Client**:
    - React (**specifically NextJS**)
    - Apollo Client
    - Scss/Sass (for styling popular alternative to css)
- **Server**:
  - Express
  - Apollo Server
  - Type-graphql
  - Mikro-orm
  - JWT
- **Database**:
  - Postgres

# Implemented Feature
- [x] Register new user
- [x] Login for registered user
- [x] Add new Thread
- [x] Delete Thread
- [x] Edit Thread
- [x] View Current User Profile
- [x] View Other User Profile
- [x] Add Comments
- [x] Delete Comments
- [x] Edit Comments 

# How to Run
## Running the Server
First we need to start the **Server**, to do this we can go to the server directory and follow the following steps:

1. Make a **.env** file on root dir of the server dir or set an **environment variable** containing.
      - **NODE_ENV** (set the value to either **production** or **development**)
      - **PORT**
      - **DATABASE_NAME**
      - **DATABASE_USER**
      - **DATABASE_PASSWORD**
      - **JWT_SECRET**
2. Install all the required dependency, by running the following command:
        
    Using yarn
    
        yarn install
    
    
    Using npm

        npm install
        
    
3. After all the dependency is installed, you can run the server in using, the following command:

    Using yarn

        yarn start
    
    Using npm

        npm start

    This will compile the ts file on **src** and run the compiled version located at **dist**.

4. To run the server in **development mode**, do the following command instead of the above commands:
   
   Using yarn
        
        yarn watch 

    then open another terminal, and do:
    
        yarn dev

    Using npm
            
        npm run watch 
            
    then open another terminal, and do:
        
        npm run dev

**P.S** To open the apollo server sandbox go to **http://localhost:PORT/graphql**, this only work if the NODE_ENV is on **development**.
## Running the Client
After we start up the server using the instruction listed above, we now can start the **Client** web server, to do this we need to go to the client directory and do the following step:
    
   1. Make a .env file on the root dir of the client dir or set an **environment variable** containing.
      - **NEXT_PUBLIC_SERVER_URL** (this contain the url of your graphql server ex. http://localhost:3001/graphql)
  
   2. Install all the required dependency, by running the following command:
   
        Using yarn
                
            yarn install 

        Using npm
                    
            npm install 

   3. After all the dependency is installed, you can run the website in using, the following command:

        Using yarn

            yarn build
        
        Using npm

            npm run build

        after it finished. It will create an optimized build for production. To run it you can use the following command:

        Using yarn 

            yarn start

        Using npm

            yarn start    
    
   4. To run the website in **development mode**, do the following command instead of the above commands:

        Using yarn

            yarn dev
        
        Using npm

            npm run dev

# Author
 Yonathan Cahyadi