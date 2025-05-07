
import { Distributor } from '../../types';

// Use localStorage instead of file system
const STORAGE_KEY = 'distributors_data';

export async function getDistributors(): Promise<Distributor[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading distributors data:', error);
    return [];
  }
}

export async function addDistributor(distributor: Omit<Distributor, 'id'>): Promise<Distributor> {
  try {
    let distributors = await getDistributors();
    
    // Generate a unique ID
    const maxId = distributors.length > 0 
      ? Math.max(...distributors.map(d => d.id))
      : 0;
    const newDistributor: Distributor = { ...distributor, id: maxId + 1 };
    
    distributors.push(newDistributor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(distributors));
    
    return newDistributor;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function getDistributorById(id: number): Promise<Distributor | undefined> {
  const distributors = await getDistributors();
  return distributors.find(d => d.id === id);
}

export async function updateDistributor(id: number, distributor: Partial<Distributor>): Promise<Distributor> {
  try {
    let distributors = await getDistributors();
    const index = distributors.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Distributor not found');
    }
    
    distributors[index] = { ...distributors[index], ...distributor, id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(distributors));
    
    return distributors[index];
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export async function deleteDistributor(id: number): Promise<boolean> {
  try {
    let distributors = await getDistributors();
    distributors = distributors.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(distributors));
    return true;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
