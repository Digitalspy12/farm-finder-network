
import { promises as fs } from 'fs';
import path from 'path';
import { Farmer } from '../../types';

const dataFilePath = path.join(process.cwd(), 'src/data/farmers.json');

export async function getFarmers() {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData) as Farmer[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, initialize with empty array
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
}

export async function addFarmer(farmer: Omit<Farmer, 'id'>) {
  try {
    let farmers = await getFarmers();
    
    // Generate a unique ID
    const maxId = farmers.length > 0 
      ? Math.max(...farmers.map(f => f.id))
      : 0;
    const newFarmer: Farmer = { ...farmer, id: maxId + 1 };
    
    farmers.push(newFarmer);
    await fs.writeFile(dataFilePath, JSON.stringify(farmers, null, 2));
    
    return newFarmer;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function getFarmerById(id: number) {
  const farmers = await getFarmers();
  return farmers.find(f => f.id === id);
}

export async function updateFarmer(id: number, farmer: Partial<Farmer>) {
  try {
    let farmers = await getFarmers();
    const index = farmers.findIndex(f => f.id === id);
    
    if (index === -1) {
      throw new Error('Farmer not found');
    }
    
    farmers[index] = { ...farmers[index], ...farmer, id };
    await fs.writeFile(dataFilePath, JSON.stringify(farmers, null, 2));
    
    return farmers[index];
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function deleteFarmer(id: number) {
  try {
    let farmers = await getFarmers();
    farmers = farmers.filter(f => f.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(farmers, null, 2));
    return true;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
