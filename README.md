    ________  .__.__  .__  .__                             
    \______ \ |__|  | |  | |__| ____    ____   ___________ 
    |    |  \|  |  | |  | |  |/    \  / ___\_/ __ \_  __ \
    |    `   \  |  |_|  |_|  |   |  \/ /_/  >  ___/|  | \/
    /_______  /__|____/____/__|___|  /\___  / \___  >__|   
            \/                     \//_____/      \/       

> Proud of legitimate and unbelievably clean project Dillinder, as it should be, and as it will be.

HOW TO INSTALL
------------

###Postgres
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

###Node 
 1. Install Node.js v6.3.0 from [https://nodejs.org/](https://nodejs.org/)
 
    > Why? Node 6.3.0 comes with V8 v5.x which brings ~93% native ES6/ES2015 coverage.* The remaining coverage is supported by babel-preset-node6. 
 2. Run: `npm install`

###Loopback
 
 1. Install Loopback with command: `npm install -g strongloop`

    > (More info... [http://loopback.io/getting-started/](http://loopback.io/getting-started/))
    
HOW TO RUN
------------

 1. Ensure Postgres.app is running (Elephant icon in menubar)
 2. Start server with command: `node .`
