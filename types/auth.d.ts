import AuthTypes from '../src/enums/auth';

interface Authentication {
  type: AuthTypes,
  credentials: AuthenticationCreds,
}

interface AuthenticationCreds {
  username: string,
  password: string,
}
