import { useState } from 'react';
import { toast } from 'react-toastify';

export const useEnhancedMutation = (mutation, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    onSuccess = () => {},
    onError = () => {},
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    showToast = true
  } = options;

  const executeMutation = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await mutation(data).unwrap();
      
      if (showToast) {
        toast.success(successMessage);
      }
      
      onSuccess(result);
      return result;
    } catch (error) {
      if (showToast) {
        toast.error(errorMessage);
      }
      
      onError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, { isLoading }];
};