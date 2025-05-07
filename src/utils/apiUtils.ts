
// Define API utility functions for client-side data operations

export async function fetchData(endpoint: string) {
  try {
    // For farmers endpoint
    if (endpoint === 'farmers') {
      const data = localStorage.getItem('farmers_data');
      return data ? JSON.parse(data) : [];
    }
    
    // For distributors endpoint
    if (endpoint === 'distributors') {
      const data = localStorage.getItem('distributors_data');
      return data ? JSON.parse(data) : [];
    }
    
    throw new Error(`Unknown endpoint: ${endpoint}`);
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
}

export async function postData(endpoint: string, data: any) {
  try {
    let storageKey: string;
    let items: any[] = [];
    let newItem;
    
    // Determine which collection to update
    if (endpoint === 'farmers') {
      storageKey = 'farmers_data';
    } else if (endpoint === 'distributors') {
      storageKey = 'distributors_data';
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    // Get existing data
    const existingData = localStorage.getItem(storageKey);
    if (existingData) {
      items = JSON.parse(existingData);
    }
    
    // Generate a new ID
    const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
    newItem = { ...data, id: maxId + 1 };
    
    // Add new item and save
    items.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return newItem;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
}

export async function updateData(endpoint: string, id: number, data: any) {
  try {
    let storageKey: string;
    
    // Determine which collection to update
    if (endpoint === 'farmers') {
      storageKey = 'farmers_data';
    } else if (endpoint === 'distributors') {
      storageKey = 'distributors_data';
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    // Get existing data
    const existingData = localStorage.getItem(storageKey);
    if (!existingData) {
      throw new Error(`No data found for ${endpoint}`);
    }
    
    const items = JSON.parse(existingData);
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${endpoint}`);
    }
    
    // Update item and save
    items[index] = { ...items[index], ...data, id };
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    return items[index];
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
}

export async function deleteData(endpoint: string, id: number) {
  try {
    let storageKey: string;
    
    // Determine which collection to update
    if (endpoint === 'farmers') {
      storageKey = 'farmers_data';
    } else if (endpoint === 'distributors') {
      storageKey = 'distributors_data';
    } else {
      throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    // Get existing data
    const existingData = localStorage.getItem(storageKey);
    if (!existingData) {
      throw new Error(`No data found for ${endpoint}`);
    }
    
    const items = JSON.parse(existingData);
    const newItems = items.filter((item: any) => item.id !== id);
    
    // Save updated list
    localStorage.setItem(storageKey, JSON.stringify(newItems));
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error);
    throw error;
  }
}
