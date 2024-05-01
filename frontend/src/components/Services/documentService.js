import axios from 'axios';

import { DEV_API_BASE_URL } from '../Common/Utils/constants';

export async function getDocuments() {
  try {
    const response = await axios.get(DEV_API_BASE_URL);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching documents: ', error);
  }
};

export async function getDocumentById(id) {
  try {
    const response = await axios.get(`${DEV_API_BASE_URL}/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching document with id: ', id);
  }
};

export async function postDocument(document) {
  try {
    const response = await axios.post(`${DEV_API_BASE_URL}`, document);
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error('Error posting document: ', error);
  }
};

export async function updateDocument(id, newDoc) {
  try {
    const response = await axios.put(`${DEV_API_BASE_URL}/${id}`, newDoc);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error updating document with id: ', id, + ": ", error);
  } 
};

export async function deleteDocument(id) {
  try {
    const response = await axios.delete(`${DEV_API_BASE_URL}/${id}`);
    if (response.status === 204) {
      return response.data;
    }
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};
