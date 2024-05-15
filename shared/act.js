// actions.js ou autre fichier où vous définissez vos actions
export const setOrigin = (data) => ({
    type: 'SET_ORIGIN',
    payload: data,
  });
  
  export const setDestination = (data) => ({
    type: 'SET_DESTINATION',
    payload: data,
  });
  