import {infoM, errorM} from './logger.js';

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
    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'wrong format of id' });
    }else if(error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
  };