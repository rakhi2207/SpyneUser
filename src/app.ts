import * as bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import db from 'mysql2';
import "reflect-metadata";
import { appConfig } from './config/app.config';
import { dataSource } from './config/db.config';
import { errorHandler, notFoundErrorHandler } from './middlewares/error.handler.middleware';
import { Routes } from './interfaces/rotes.interface';
import { DataSource } from 'typeorm';

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;

    constructor(routes: Routes[]) {
        dotenv.config();
        this.app = express();
        this.env = process.env.NODE_ENV || 'development';
        this.port = appConfig.port || 3007;

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
           console.log(`=================================`);
            console.log(`======= ENV: ${this.env} =======`);
            console.log(`🚀 App listening on the port ${this.port}`);
           console.log(`=================================`);
        });
    }

    private connectToDatabase() {
        return this.createConnection(dataSource);
    }

    private createConnection(datasource: DataSource) {
        // const pool = db.createPool({
        //     host: dbConfig.host,
        //     user: dbConfig.username,
        //     database: dbConfig.database,
        //     password: dbConfig.password,
        // })
        // return pool.promise();
        datasource
            .initialize()
            .then(() => {
                console.log('Connected to database!');
            })
            .catch((err: Error) => {
                console.log(
                    'Error in establishing connection with the database..',
                    err
                );
            });
    }

    private initializeMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });
    }


    private initializeErrorHandling() {
        this.app.use(notFoundErrorHandler);
        this.app.use(errorHandler);
    }
}

export default App;
