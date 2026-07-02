import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  loginWithEmail,
  signUpWithEmail,
  loginWithGoogle,
  logoutUser,
  resetPassword,
  clearError,
  toggleAuthModal,
  setAuthModal,
  updateUserProfile,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error, isAuthenticated, isAuthModalOpen } =
    useSelector((state: RootState) => state.auth);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAuthModalOpen,
    login: (email: string, password: string) =>
      dispatch(loginWithEmail({ email, password })),
    signup: (email: string, password: string, name: string) =>
      dispatch(signUpWithEmail({ email, password, name })),
    googleLogin: () => dispatch(loginWithGoogle()),
    logout: () => dispatch(logoutUser()),
    resetPassword: (email: string) => dispatch(resetPassword(email)),
    clearError: () => dispatch(clearError()),
    toggleAuthModal: () => dispatch(toggleAuthModal()),
    setAuthModal: (open: boolean) => dispatch(setAuthModal(open)),
    updateProfile: (updates: { displayName?: string; photoURL?: string }) =>
      dispatch(updateUserProfile(updates)),
  };
};
