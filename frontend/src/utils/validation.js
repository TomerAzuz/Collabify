export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const escapeFilename = (filename) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

export const isValidUrl = (url) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
};

export const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) {
    return false;
  }

  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
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

  if (formData.photoURL && !isValidUrl(formData.photoURL)) {
    errors.photoURL = 'Please enter a valid image url';
  }

  if (formData.newPassword && formData.newPassword < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return errors;
};
