import * as actions from '../../redux/user/action';
import constants from '../../redux/user/constantes';

describe('Redux Actions', () => {
  it('should create an action to log in', () => {
    const user = {};
    const expectedAction = {
      type: constants.LOGIN,
      user,
    };
    expect(actions.onLogin(user)).toEqual(expectedAction);
  });

  it('should create an action to get users', () => {
    const users = [];
    const expectedAction = {
      type: constants.LIST,
      users,
    };
    expect(actions.onGetUsers(users)).toEqual(expectedAction);
  });

  it('should create an action to log out', () => {
    const expectedAction = {
      type: constants.LOGOUT,
    };
    expect(actions.onLogout()).toEqual(expectedAction);
  });
});
