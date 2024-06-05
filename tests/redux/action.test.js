import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../redux/incidents/action';
import constants from '../../redux/incidents/constantes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Redux Actions', () => {
  it('should create an action to get incidents', () => {
    const expectedAction = {
      type: constants.ON_GET_INCIDENTS,
      challenges: [/* Array of challenges */],
    };
    expect(actions.onGetIncidents([/* Array of challenges */])).toEqual(expectedAction);
  });

  it('should create an action to add an incident', () => {
    const expectedAction = {
      type: constants.ON_ADD_INCIDENT,
      challenge: {/* Challenge object */},
    };
    expect(actions.onAddIncident({/* Challenge object */})).toEqual(expectedAction);
  });

  it('should create an action to delete an incident', () => {
    const expectedAction = {
      type: constants.ON_DELETE_INCIDENT,
      challenge: {/* Challenge object */},
    };
    expect(actions.onDeleteIncident({/* Challenge object */})).toEqual(expectedAction);
  });

  it('should create an action to edit an incident', () => {
    const expectedAction = {
      type: constants.ON_EDIT_INCIDENT,
      challenge: {/* Challenge object */},
    };
    expect(actions.onEditIncident({/* Challenge object */})).toEqual(expectedAction);
  });

  it('should dispatch an action to get incidents', () => {
    const store = mockStore({});
    const expectedActions = [{
      type: constants.ON_GET_INCIDENTS,
      challenges: [/* Array of challenges */],
    }];
    store.dispatch(actions.onGetIncidents([/* Array of challenges */]));
    expect(store.getActions()).toEqual(expectedActions);
  });

});
