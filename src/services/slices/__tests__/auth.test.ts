import authSlice, {
  register,
  login,
  logout,
  getUser,
  updateUser,
  resetError,
  initialState as authInitialState
} from '../auth';
import { TUser } from '@utils-types';
import * as api from '@api';

jest.mock('@api');

describe('auth slice', () => {
  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(authSlice(undefined, { type: 'unknown' })).toEqual(authInitialState);
  });

  it('should handle resetError', () => {
    const stateWithError = {
      ...authInitialState,
      error: { message: 'Some error' }
    };
    expect(authSlice(stateWithError, resetError())).toEqual(authInitialState);
  });

  describe('async thunks', () => {
    it('should handle successful registration', async () => {
      const registerData = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User'
      };
      
      (api.registerUserApi as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh'
      });

      const dispatch = jest.fn();
      const thunk = register(registerData);
      await thunk(dispatch, () => ({}), {});

      const [start, end] = dispatch.mock.calls.map(call => call[0].type);
      expect(start).toBe('auth/register/pending');
      expect(end).toBe('auth/register/fulfilled');
    });
  });
});