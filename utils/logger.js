export const infoM = (...params) => {
    if(process.env.NODE_ENV !== 'test') {
      console.log(...params);
    }
  };
  
export const errorM = (...params) => {
    if(process.env.NODE_ENV !== 'test') {
      console.error(...params);
    }
  };