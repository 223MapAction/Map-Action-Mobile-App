import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../redux/incidents/action';
import constants from '../../redux/incidents/constantes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Redux Actions', () => {
  it('should dispatch an action to get incidents', () => {
    const challenges = []; // Exemple de tableau de challenges
    const expectedActions = [
      {
        type: constants.ON_GET_INCIDENTS,
        challenges,
      },
    ];
    const store = mockStore({});
    store.dispatch(actions.onGetIncidents(challenges)); // Appeler l'action asynchrone sans `.then()`
    expect(store.getActions()).toEqual(expectedActions); // Vérifier l'action immédiatement
  });

  it('should dispatch an action to add an incident', () => {
    const challenge = {}; // Exemple d'objet challenge
    const expectedActions = [
      {
        type: constants.ON_ADD_INCIDENT,
        challenge,
      },
    ];
    const store = mockStore({});
    store.dispatch(actions.onAddIncident(challenge)); // Appeler l'action asynchrone sans `.then()`
    expect(store.getActions()).toEqual(expectedActions); // Vérifier l'action immédiatement
  });

  it('should dispatch an action to delete an incident', () => {
    const challenge = {}; // Exemple d'objet challenge
    const expectedActions = [
      {
        type: constants.ON_DELETE_INCIDENT,
        challenge,
      },
    ];
    const store = mockStore({});
    store.dispatch(actions.onDeleteIncident(challenge)); // Appeler l'action asynchrone sans `.then()`
    expect(store.getActions()).toEqual(expectedActions); // Vérifier l'action immédiatement
  });

  it('should dispatch an action to edit an incident', () => {
    const challenge = {}; // Exemple d'objet challenge
    const expectedActions = [
      {
        type: constants.ON_EDIT_INCIDENT,
        challenge,
      },
    ];
    const store = mockStore({});
    store.dispatch(actions.onEditIncident(challenge)); // Appeler l'action asynchrone sans `.then()`
    expect(store.getActions()).toEqual(expectedActions); // Vérifier l'action immédiatement
  });
});
