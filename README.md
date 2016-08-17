    ________  .__.__  .__  .__                             
    \______ \ |__|  | |  | |__| ____    ____   ___________ 
    |    |  \|  |  | |  | |  |/    \  / ___\_/ __ \_  __ \
    |    `   \  |  |_|  |_|  |   |  \/ /_/  >  ___/|  | \/
    /_______  /__|____/____/__|___|  /\___  / \___  >__|   
            \/                     \//_____/      \/       

> Proud of legitimate and unbelievably clean project Dillinger, as it should be, and as it will be.

> In staging: [https://staging.visav.io](https://secure.visav.io) — tracking "dev" branch
> In production: [https://secure.visav.io](https://secure.visav.io) — tracking "master" branch

* [How to Install](#how-to-install)
  - [Install dependencies](#install-dependencies)
  - [Build Project](#build-project)
* [How to Run](#how-to-run)
  - [Backend Server](#backend-server)
  - [Front End Development Server](#front-end-development-server)
* [How to Publish](#how-to-publish)
* [How to Login](#how-to-login)
* [How to Unit Test](#how-to-unit-test)
* [How to Generate Documentation](#how-to-generate-documentation)

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

3. Add the Heroku live remote: `heroku git:remote -r heroku -a visav` — this will be locally named "heroku"

4. Add the Heroku staging remote: `heroku git:remote -r staging -a visav-staging` – this will be locally named "staging"

##### Environment Variables

It is essential that you have a .env file in the project, to load secure/environment constants.

NAME | VALUE
--- | --- | ---
`PORT` 							| `4000`
`NODE_ENV` 						| `development`
`OPENTOK_API_KEY` 				| *Obtain with:* `heroku config -a visav`
`OPENTOK_SECRET` 				| *Obtain with:* `heroku config -a visav`
`FACEBOOK_APP_SECRET` 			| *Obtain with:* `heroku config -a visav`
`FACEBOOK_APP_ID` 				| *Obtain with:* `heroku config -a visav`
`POSTMARK_API_TOKEN` 			| *Obtain with:* `heroku config -a visav`
`POSTMARK_SMTP_SERVER` 			| *Obtain with:* `heroku config -a visav`

> You can also use a command line tool [https://github.com/xavdid/heroku-config](https://github.com/xavdid/heroku-config) to copy in all Heroku environment variables to a .env file. Just remember to set `PORT=4000` and `NODE_ENV=development`, on your local project!

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

## How to Login

There is a predefined test user with following credentials:

```
Username: dev@test.user
Password: testtest
```

(This assumes you are running the front-end client in development mode)

1. (Optional) Load the Sign Up screen: [http://localhost:3000/signup/](http://localhost:3000/signup/) and create an account

2. Sign In: [http://localhost:3000/login/](http://localhost:3000/login/)

## How to Unit Test
1. Client unit test:
  1.1 Rebuild client distribution: `npm run package-client` 
  1.2 Run unit test for client: `npm run test-client`
2. Server unit test:
  Run command: 'npm run test-server'

## How to Generate Documentation.
1. Generate client documentation:
  Run command `npm run doc-client`
  The docs will be generated in QA/jsdoc/client.
2. Generate server documentation:
  Run command `npm run doc-server`
  The docs will be generated in QA/jsdoc/server.
