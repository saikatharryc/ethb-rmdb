#### RUN locally

-   To run locally you will be needing Redis & Mongo instance Both.
-   All configs goes inside `.env`

*   After cloning do a `npm install`
*   To run the app do `npm run dev`
    [which will be available at port `3000`]

Go inside `cron_worker` folder
and do `npm install` & then `npm start` as we need to `cron_worker` seperately .

##### RUN with docker

-   Here you dont need redis instance as spinning up redis instance in docker, although if you wish to use one, you can pass `REDIS_HOST`, `REDIS_PORT` in `.env`

*   after clone run :

```shell
WEB3_PROVIDER="<WEB3 infura instance>"  MONGO_URI="<Mongo connection URI>" docker-compose up -d
```

\*\* Defaultly it will expose port 3000

#### API to get user transaction with address

`/txns?user_address=<ADDRESS>&limit=3&skip=1`

-   limit is default 10
