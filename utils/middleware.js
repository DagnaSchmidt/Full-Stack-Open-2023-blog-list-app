import {infoM, errorM} from './logger.js';
import {SECRET} from '../utils/config.js';
import User from '../models/user.js';
import jwt from "jsonwebtoken";

export const requestLogger = (request, response, next) => {
    infoM('Method:', request.method)
    infoM('Path:  ', request.path)
    infoM('Body:  ', request.body)
    infoM('---')
    next()
};

export const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
  };

export const errorHandler = (error, request, response, next) => {
    errorM(error.message);
    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'wrong format of id' });
    }else if(error.name === 'ValidationError' || error.name === 'JsonWebTokenError'){
        return response.status(400).json({ error: error.message });
    }
    next(error);
  };

export const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization');
    if(authorization && authorization.startsWith('Bearer ')){
        request.body.token = authorization.replace('Bearer ', '');
    }
    next();
};

export const userExtractor = async (request, response, next) => {
    if(request.body.token){
        const decodedToken = jwt.verify(request.body.token, SECRET);
        const foundUser = await User.findById(decodedToken.id.toString());
        console.log(foundUser);
        if(!foundUser){
            return response.status(400).json({ error: 'user not found' });
        }else{
            request.body.user = {
                "username": foundUser.username,
                "name": foundUser.name,
                "id": foundUser.id
            }
        }
    }
    next();
}