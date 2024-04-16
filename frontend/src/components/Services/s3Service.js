import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/s3';

export async function postFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response  = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw error;
  }
};