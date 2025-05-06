
import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Farmer } from '../../../types';

const dataFilePath = path.join(process.cwd(), 'src/data/farmers.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const farmerId = parseInt(id as string, 10);
    
    if (isNaN(farmerId)) {
      return res.status(400).json({ message: 'Invalid farmer ID' });
    }
    
    // Read the existing data
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    let farmers: Farmer[] = JSON.parse(jsonData);
    
    const farmerIndex = farmers.findIndex(f => f.id === farmerId);
    
    if (farmerIndex === -1) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    
    if (req.method === 'GET') {
      return res.status(200).json(farmers[farmerIndex]);
    }
    
    if (req.method === 'PUT') {
      const updatedFarmer: Farmer = {
        ...farmers[farmerIndex],
        ...req.body,
        id: farmerId, // Ensure ID doesn't change
      };
      
      farmers[farmerIndex] = updatedFarmer;
      await fs.writeFile(dataFilePath, JSON.stringify(farmers, null, 2));
      
      return res.status(200).json(updatedFarmer);
    }
    
    if (req.method === 'DELETE') {
      farmers = farmers.filter(f => f.id !== farmerId);
      await fs.writeFile(dataFilePath, JSON.stringify(farmers, null, 2));
      
      return res.status(200).json({ message: 'Farmer deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
