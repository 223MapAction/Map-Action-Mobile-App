import * as actions from '../../redux/challenges/action';
import constants from '../../redux/challenges/constantes';

describe('Redux Actions', () => {
  it('should create an action to get challenges', () => {
    const challenges = [/* Array of challenges */];
    const expectedAction = {
      type: constants.ON_GET_CHALLENGES,
      challenges: actions.order(challenges),
    };
    expect(actions.onGetChallenges(challenges)).toEqual(expectedAction);
  });

  it('should create an action to add a challenge', () => {
    const challenge = {/* Challenge object */};
    const expectedAction = {
      type: constants.ON_ADD_CHALLENGE,
      challenge,
    };
    expect(actions.onAddChallenge(challenge)).toEqual(expectedAction);
  });

  it('should create an action to delete a challenge', () => {
    const challenge = {/* Challenge object */};
    const expectedAction = {
      type: constants.ON_DELETE_CHALLENGE,
      challenge,
    };
    expect(actions.onDeleteChallenge(challenge)).toEqual(expectedAction);
  });

  it('should create an action to edit a challenge', () => {
    const challenge = {/* Challenge object */};
    const expectedAction = {
      type: constants.ON_EDIT_CHALLENGE,
      challenge,
    };
    expect(actions.onEditChallenge(challenge)).toEqual(expectedAction);
  });
});
