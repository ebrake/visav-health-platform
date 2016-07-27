    ________  .__.__  .__  .__                             
    \______ \ |__|  | |  | |__| ____    ____   ___________ 
    |    |  \|  |  | |  | |  |/    \  / ___\_/ __ \_  __ \
    |    `   \  |  |_|  |_|  |   |  \/ /_/  >  ___/|  | \/
    /_______  /__|____/____/__|___|  /\___  / \___  >__|   
            \/                     \//_____/      \/       

> Proud of legitimate and unbelievably clean project Dillinger, as it should be, and as it will be.

HOW TO INSTALL
------------

### Postgres
 1. Install Postgres.app from [https://postgresapp.com/](https://postgresapp.com/)
>Optional: Install the latest version pgAdmin gui for postgres from
 [https://www.pgadmin.org/download/macosx.php](https://www.pgadmin.org/download/macosx.php)
 
 2. Add the following line to ~/.bash_profile:
 `export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin`
 3. Login to postgres as a superuser: `sudo -u postgres psql postgres`
 4. Run the following lines in the Postgres CLI:
 `CREATE USER dillinger WITH PASSWORD 'dillinger';`
 `CREATE DATABASE dillinger;`
 `GRANT ALL PRIVILEGES ON DATABASE dillinger to dillinger;` 
> run `\q` to quit postgres

### Node 
 1. Install Node.js v6.3.0 from [https://nodejs.org/](https://nodejs.org/)
 
    > Why? Node 6.3.0 comes with V8 v5.x which brings ~93% native ES6/ES2015 coverage.* The remaining coverage is supported by babel-preset-node6. 
 2. Run: `npm install`

### Loopback
 
 1. Install Loopback with command: `npm install -g strongloop`

    > (More info... [http://loopback.io/getting-started/](http://loopback.io/getting-started/))
    
### Heroku Toolbelt

 1. Make sure it is installed, download from: [https://toolbelt.heroku.com/](https://toolbelt.heroku.com/))

 2. Log in with your Heroku account: `heroku login`

 3. Add the Heroku remote in the root folder: `heroku git:remote -a healthplatform`

### Front End
1. Navigate to client directory `cd <insert dillinger root>/client`
2. Run the following command: `npm install`
3. Run the following command: `npm run build`

HOW TO RUN (DEVELOPMENT)
----------
### Backend Server

 1. Ensure Postgres.app is running (Elephant icon in menubar)
 2. Ensure Node packages are up-to-date with command: `npm install`
 3. Ensure front end app is up-to-date (See HOW TO INSTALL - Front End)
 4. Start server with command: `heroku local -f Procfile.dev`
 
> Backend server will send the browser the static react app we generated in "HOW TO INSTALL - Front End". See below if you'd like to view the app via the Front End Development Server.

### Front End Development Server
 1. Navigate to project root
 2. Run the following command: `npm install`
 3. Start the back-end server with the following command: `heroku local -f Procfile.dev` 
 3. Navigate to client directory `cd <insert dillinger root>/client`
 4. Ensure Node packages are up-to-date, and build the client, with command: `npm install`
 5. Start server with command: `npm start`

HOW TO PUBLISH (PRODUCTION)
----------

1. Everything will automatically build on Heroku. Just run `git push heroku master`

