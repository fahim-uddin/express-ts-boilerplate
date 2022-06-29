import { NextFunction, Request, Response } from 'express';

class IndexController {
    public index = (request: Request, response: Response, next: NextFunction): void => {
        try {
            response.status(200).send('Working...');
            //response.sendStatus(200);
        } catch (error) {
            next(error);
        }
    };
}

export default IndexController;
