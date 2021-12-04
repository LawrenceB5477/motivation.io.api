## To get motivation.io running
- The app has two components, a Node.js backend using express and passport.js, and a frontend using Vue.js. The backend also relies on a Mongodb instance and a Redis instance that are currently hosted on GCP
- Ensure Node.js is installed, the LTS version is recommended (16.13.1) and that it is accessible from the command line (use node -v to check)
- Install yarn if not already installed (npm install --global yarn)


Backend
- clone the backend (https://github.com/LawrenceB5477/motivation.io.api)
- Install dependencies (yarn install)
- Create a .env file in the root directory of the project, copying and pasting its contents from the email provided (this contains passwords / private information so do not share!)
- Start the project (yarn start)

Frontend
- Clone the frontend on the same machine running the backend, this is required to prevent CORS issues (https://github.com/LawrenceB5477/motivation.io)
- Install dependencies (yarn install)
- Create a .env file in the root directory of the project, copying and pasting its contents from the email provided
- Start the project (yarn serve) - Note, this runs the project in development mode which is required for the reverse proxy to work so that the frontend can communicate with the backend when running on Chrome, we have to do this because we don't have HTTPS setup
- Open your internet browser to http://localhost:8080 where the site should be running 
