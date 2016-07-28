# Dillinger
    ________  .__.__  .__  .__                             
    \______ \ |__|  | |  | |__| ____    ____   ___________ 
    |    |  \|  |  | |  | |  |/    \  / ___\_/ __ \_  __ \
    |    `   \  |  |_|  |_|  |   |  \/ /_/  >  ___/|  | \/
    /_______  /__|____/____/__|___|  /\___  / \___  >__|   
            \/                     \//_____/      \/       

> Proud of legitimate and unbelievably clean project Dillinger, as it should be, and as it will be.


## How to Install

### Install dependencies

##### Postgres
	
1. Install Postgres.app from [https://postgresapp.com/](https://postgresapp.com/)

  > Recommendation: Install the latest version pgAdmin gui for postgres from [https://www.pgadmin.org/download/macosx.php](https://www.pgadmin.org/download/macosx.php)

2. Add the following line to ~/.bash_profile: `export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin`

3. Login to postgres as a superuser: `sudo -u postgres psql postgres`

4. Run the following lines in the Postgres CLI:
 `CREATE USER dillinger WITH PASSWORD 'dillinger';`
 `CREATE DATABASE dillinger;`
 `GRANT ALL PRIVILEGES ON DATABASE dillinger to dillinger;` 
> run `\q` to quit postgres
	
##### Node
	
1. Install Node.js v6.3.0 from [https://nodejs.org/](https://nodejs.org/)
	
  > Node 6.3.0 comes with V8 v5.x which brings ~93% native ES6/ES2015 coverage.* The remaining coverage is supported by babel-preset-node6
	
##### Loopback
 
1. Install Loopback with command: `npm install -g strongloop`
	
 > More info: [http://loopback.io/getting-started/](http://loopback.io/getting-started/)
    
##### Heroku Toolbelt
	
1. Make sure it is installed, download from: [https://toolbelt.heroku.com/](https://toolbelt.heroku.com/))

2. Log in with your Heroku account: `heroku login`

3. Add the Heroku remote in the root folder: `heroku git:remote -a healthplatform`

### Build Project

##### Back End

 1. Run the following command: `npm install --ignore-scripts`

##### Front End

 1. Run the following command: `npm run build-client`

## How to Run

### Backend Server

1. Ensure Postgres.app is running (Elephant icon in menubar)

2. Ensure Back End and Front End are up to date (see Build Project)

3. Start server with command: `npm run backend`
 
> Backend server will send the browser the static React app we generated in "How to Install - Front End". See below if you'd like to view & develop the app instantly (without building) via the Front End Development Server.

### Front End Development Server

1. Ensure Backend Server is running

2. Ensure Front End is built (see Build Project)

3. Start server with command: `npm run client`

## How to Publish

Everything will automatically build on Heroku. Just run `git push heroku master`

