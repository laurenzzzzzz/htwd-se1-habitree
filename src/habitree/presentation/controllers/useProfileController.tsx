import { useState } from 'react';
import { profileService } from '../../infrastructure/di/ServiceContainer';
import { useAuth, CurrentUser } from '../../context/AuthContext';

export function useProfileController() {
  const { authToken, signIn } = useAuth();
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const updateUsername = async (newUsername: string) => {
    if (!authToken) throw new Error('Not authenticated');
    setIsUpdatingUsername(true);
    try {
      const updated = await profileService.updateUsername(authToken, newUsername);
      // update context user
      await signIn(authToken, updated as CurrentUser);
      return updated;
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!authToken) throw new Error('Not authenticated');
    setIsUpdatingPassword(true);
    try {
      const res = await profileService.updatePassword(authToken, oldPassword, newPassword);
      return res;
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return { updateUsername, updatePassword, isUpdatingUsername, isUpdatingPassword };
}

export default useProfileController;
