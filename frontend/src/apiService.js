import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export async function fetchData(endpoint) {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching data:', error);
    throw error;
  }
};

export async function fetchDataById(endpoint, id) {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching data with id:', id);
    throw error;
  }
};

export async function postData(endpoint, data) {
  try {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.log('Error posting data: ', error);
    throw error;
  }
};

export async function putData(endpoint, id, data) {
  try {
    console.log(data);
    const response = await axios.put(`${BASE_URL}/${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Error updating data: ', error);
    throw error;
  }
};

export async function deleteData(endpoint, id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error deleting data: ', error);
    throw error;
  }
};