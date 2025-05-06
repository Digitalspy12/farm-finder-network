
import { promises as fs } from 'fs';
import path from 'path';
import { Distributor } from '../../types';

const dataFilePath = path.join(process.cwd(), 'src/data/distributors.json');

export async function getDistributors() {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(jsonData) as Distributor[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, initialize with empty array
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
}

export async function addDistributor(distributor: Omit<Distributor, 'id'>) {
  try {
    let distributors = await getDistributors();
    
    // Generate a unique ID
    const maxId = distributors.length > 0 
      ? Math.max(...distributors.map(d => d.id))
      : 0;
    const newDistributor: Distributor = { ...distributor, id: maxId + 1 };
    
    distributors.push(newDistributor);
    await fs.writeFile(dataFilePath, JSON.stringify(distributors, null, 2));
    
    return newDistributor;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function getDistributorById(id: number) {
  const distributors = await getDistributors();
  return distributors.find(d => d.id === id);
}

export async function updateDistributor(id: number, distributor: Partial<Distributor>) {
  try {
    let distributors = await getDistributors();
    const index = distributors.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Distributor not found');
    }
    
    distributors[index] = { ...distributors[index], ...distributor, id };
    await fs.writeFile(dataFilePath, JSON.stringify(distributors, null, 2));
    
    return distributors[index];
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function deleteDistributor(id: number) {
  try {
    let distributors = await getDistributors();
    distributors = distributors.filter(d => d.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(distributors, null, 2));
    return true;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
