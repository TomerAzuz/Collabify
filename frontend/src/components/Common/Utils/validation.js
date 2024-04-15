export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidImageUrl = (url) => {

  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

  if (!urlRegex.test(url)) {
    return false; 
  }

  const urlParts = url.split('.');
  const fileExtension = urlParts[urlParts.length - 1].toLowerCase();

  return supportedExtensions.includes(`.${fileExtension}`);
};

export const validateAuthForm = (formData, isSignUp) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (formData.displayName && formData.displayName.length > 50) {
    errors.displayName = 'Name cannot exceed 50 characters';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (isSignUp && formData.password !== formData.passwordConfirm) {
    errors.passwordConfirm = 'Passwords do not match';
  }

  return errors;
};

export const validateProfileForm = (formData) => {
  const errors = {};

  if (formData.displayName && formData.displayName.length > 50) {
    errors.displayName = 'Name cannot exceed 50 characters';
  }

  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (formData.photoURL && !isValidImageUrl(formData.photoURL)) {
    errors.photoURL = 'Please enter a valid image url';
  }

  if (formData.newPassword && formData.newPassword < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return errors;
};
