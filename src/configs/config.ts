import dotenv from 'dotenv';

dotenv.config();

const APP_ENV: string = process.env.NODE_ENV || 'development';
const ACCESS_ORIGIN: string = process.env.ORIGIN || '*';
const ACCESS_CREDENTIALS: boolean = process.env.CREDENTIALS === 'true' || false;

const STRIPE_PUBLISHABLE_KEY: string = process.env.STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_SECRET_KEY: string = process.env.STRIPE_SECRET_KEY || '';

const SERVER_PORT: number = process.env.PORT ? Number(process.env.PORT) : 5000;

export const config = {
    STRIPE: {
        SECRET_KEY: STRIPE_SECRET_KEY
    },
    SERVER: {
        PORT: SERVER_PORT
    },
    ENV: APP_ENV,
    CORS: {
        ORIGIN: ACCESS_ORIGIN,
        CREDENTIALS: ACCESS_CREDENTIALS
    }
};
