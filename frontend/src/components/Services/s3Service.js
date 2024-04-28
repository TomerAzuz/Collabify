import axios from 'axios';
import * as Sentry from '@sentry/react';

const BASE_URL = 'http://localhost:3000/api/v1/s3';

export async function postFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error uploading file: ', error);
  }
};