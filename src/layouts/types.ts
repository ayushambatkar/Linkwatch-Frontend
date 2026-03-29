import type { Dispatch, SetStateAction } from 'react';
import type { AuthState } from '../types';

export type AppOutletContext = {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState | null>>;
};
