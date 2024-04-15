import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/documents';

export async function getDocuments() {
  try {
    const response = await axios.get(BASE_URL);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Unexpected status code: ', response.status);
    }
  } catch (error) {
    console.error('Error fetching documents: ', error);
  }
};

export async function getDocumentById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Unexpected status code: ', response.status);
    }
  } catch (error) {
    console.error('Error fetching document with id: ', id);
  }
};

export async function postDocument(document) {
  try {
    const response = await axios.post(`${BASE_URL}`, document);
    if (response.status === 201) {
      return response.data;
    } else {
      console.error('Unexpected status code: ', response.status);
    }
  } catch (error) {
    console.error('Error posting document: ', error);
  }
};

export async function updateDocument(id, newDoc) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, newDoc);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Unexpected status code: ', response.status);
    }
  } catch (error) {
    console.error('Error updating document with id: ', id, + ": ", error);
  } 
};

export async function deleteDocument(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    if (response.status === 204) {
      return response.data;
    } else {
      console.error('Unexpected status code: ', response.status);
    }
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};
