
import { Farmer } from '../../types';

// Use localStorage instead of file system
const STORAGE_KEY = 'farmers_data';

export async function getFarmers(): Promise<Farmer[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading farmers data:', error);
    return [];
  }
}

export async function addFarmer(farmer: Omit<Farmer, 'id'>): Promise<Farmer> {
  try {
    let farmers = await getFarmers();
    
    // Generate a unique ID
    const maxId = farmers.length > 0 
      ? Math.max(...farmers.map(f => f.id))
      : 0;
    const newFarmer: Farmer = { ...farmer, id: maxId + 1 };
    
    farmers.push(newFarmer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmers));
    
    return newFarmer;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function getFarmerById(id: number): Promise<Farmer | undefined> {
  const farmers = await getFarmers();
  return farmers.find(f => f.id === id);
}

export async function updateFarmer(id: number, farmer: Partial<Farmer>): Promise<Farmer> {
  try {
    let farmers = await getFarmers();
    const index = farmers.findIndex(f => f.id === id);
    
    if (index === -1) {
      throw new Error('Farmer not found');
    }
    
    farmers[index] = { ...farmers[index], ...farmer, id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmers));
    
    return farmers[index];
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function deleteFarmer(id: number): Promise<boolean> {
  try {
    let farmers = await getFarmers();
    farmers = farmers.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmers));
    return true;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
