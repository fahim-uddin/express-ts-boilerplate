import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { logger } from './libraries';
import { requestLogger } from './handlers';
import { Routes } from './interfaces';
import { config } from './configs/config';
import { appConfig } from './configs/app.config';
import { errorMiddleware } from './middlewares';

class App {
    public app: express.Application;
    public env: string;
    public port: string | number;
    public isDev: boolean;
    public isProd: boolean;

    public root: string;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = config.ENV;
        this.port = config.SERVER.PORT;

        this.isDev = config.ENV === 'development';
        this.isProd = config.ENV === 'production';

        this.root = process.cwd();

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeLoggingMiddlewares();
        this.initializeErrorHandling();
    }

    public getServerApp() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(cors({ origin: config.CORS.ORIGIN, credentials: config.CORS.CREDENTIALS }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeLoggingMiddlewares = () => {
        this.app.use(requestLogger);
    };

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use('/v1/', route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'API Service',
                    version: '1.0.0',
                    description: 'REST API Docs'
                }
            },
            apis: ['swagger.yaml']
        };

        const specs = swaggerJSDoc(options);
        // this.app.use(`/${appConfig.VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(specs, { customCssUrl: './custom.css' }));
        // https://stackoverflow.com/questions/38713764/how-to-replace-swagger-ui-header-logo-in-swashbuckle
        this.app.use(`/${appConfig.VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(specs));
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.env} =======`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }
}

export default App;
