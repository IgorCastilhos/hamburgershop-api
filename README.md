# 🍔 Hamburger Shop Api
Food delivery application (inspired in Ifood/Uber Eats).

## Back-end tech stack

* TypeScript
* Drizzle
* ElysiaJS
* Bun (Runtime)

## How to run
I've used Docker to run the database. If you already have Docker installed, clone this repository, install the dependencies, set up the Docker container and run the application.

> You must run the migrations to create the database tables and run the seed script to populate the database with fake data.

```sh
bun i
docker compose up -d
bun migrate
bun seed
bun dev
```

## Features

[x] it should be able to **register a new restaurant**  
[x] it should be able to **sign in as a restaurant manager**  
[x] it should be able to **register as a new customer**  
[x] it should be able to **create an order to the restaurant**  
[x] it should be able to **manage the restaurant menu**  
[x] it should be able to **manage the restaurant evaluations**  
[x] it should be able to **leave an evaluation**  
[x] it should be able to **manage the restaurant orders**  
[x] it should be able to **update the restaurant public profile** 
[x] it should be able to **open/close the restaurant** 
[x] it should be able to **list metrics from the restaurant**

## Author

[Igor Castilhos](https://github.com/IgorCastilhos)
