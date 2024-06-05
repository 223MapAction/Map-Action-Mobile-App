import * as actions from '../../redux/challenges/action';
import constants from '../../redux/challenges/constantes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Redux Actions', () => {
  it('should create an action to get challenges', () => {
    const challenges = [];
    const expectedActions = [
      {
        type: constants.ON_GET_CHALLENGES,
        challenges: actions.order(challenges),
      },
    ];
    const store = mockStore({});

    store.dispatch(actions.onGetChallenges(challenges));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create an action to add a challenge', () => {
    const challenge = {};
    const expectedActions = [
      {
        type: constants.ON_ADD_CHALLENGE,
        challenge,
      },
    ];
    const store = mockStore({});

    store.dispatch(actions.onAddChallenge(challenge));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create an action to delete a challenge', () => {
    const challenge = {};
    const expectedActions = [
      {
        type: constants.ON_DELETE_CHALLENGE,
        challenge,
      },
    ];
    const store = mockStore({});

    store.dispatch(actions.onDeleteChallenge(challenge));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create an action to edit a challenge', () => {
    const challenge = {};
    const expectedActions = [
      {
        type: constants.ON_EDIT_CHALLENGE,
        challenge,
      },
    ];
    const store = mockStore({});

    store.dispatch(actions.onEditChallenge(challenge));
    expect(store.getActions()).toEqual(expectedActions);
  });
});