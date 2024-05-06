import axios from 'axios';

import { API_BASE_URL } from '../Common/Utils/constants';

export async function getDocuments() {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/documents`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export async function getDocumentById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/documents/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export async function postDocument(document) {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/documents`, document);
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export async function updateDocument(id, newDoc) {
  try {
    const response = await axios.put(`${API_BASE_URL}/v1/documents/${id}`, newDoc);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  } 
};

export async function deleteDocument(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/v1/documents/${id}`);
    if (response.status === 204) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
