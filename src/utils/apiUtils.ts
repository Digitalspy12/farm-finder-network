
// Define API utility functions for data fetching and manipulation

export async function fetchData(endpoint: string) {
  try {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

export async function postData(endpoint: string, data: any) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
}

export async function updateData(endpoint: string, id: number, data: any) {
  try {
    const response = await fetch(`/api/${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
}

export async function deleteData(endpoint: string, id: number) {
  try {
    const response = await fetch(`/api/${endpoint}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error);
    throw error;
  }
}
