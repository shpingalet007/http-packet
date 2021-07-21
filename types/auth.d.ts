import AuthTypes from '../src/enums/auth';

type Authentication = AuthBasic | AuthBearer;

interface AuthBasic {
  type: AuthTypes.Basic,
  credentials: AuthenticationCredentials,
}

interface AuthBearer {
  type: AuthTypes.Bearer,
  credentials: AuthenticationToken,
}

type AuthenticationData = AuthenticationCredentials | AuthenticationToken;

interface AuthenticationCredentials {
  username: string,
  password: string,
}

interface AuthenticationToken {
  token: string,
}
