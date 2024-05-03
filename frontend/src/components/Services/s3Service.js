import axios from 'axios';

import { DEV_API_BASE_URL } from '../Common/Utils/constants';


export async function postFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${DEV_API_BASE_URL}/v1/s3/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Error uploading file: ', error);
  }
};