
import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Distributor } from '../../../types';

const dataFilePath = path.join(process.cwd(), 'src/data/distributors.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const distributorId = parseInt(id as string, 10);
    
    if (isNaN(distributorId)) {
      return res.status(400).json({ message: 'Invalid distributor ID' });
    }
    
    // Read the existing data
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    let distributors: Distributor[] = JSON.parse(jsonData);
    
    const distributorIndex = distributors.findIndex(d => d.id === distributorId);
    
    if (distributorIndex === -1) {
      return res.status(404).json({ message: 'Distributor not found' });
    }
    
    if (req.method === 'GET') {
      return res.status(200).json(distributors[distributorIndex]);
    }
    
    if (req.method === 'PUT') {
      const updatedDistributor: Distributor = {
        ...distributors[distributorIndex],
        ...req.body,
        id: distributorId, // Ensure ID doesn't change
      };
      
      distributors[distributorIndex] = updatedDistributor;
      await fs.writeFile(dataFilePath, JSON.stringify(distributors, null, 2));
      
      return res.status(200).json(updatedDistributor);
    }
    
    if (req.method === 'DELETE') {
      distributors = distributors.filter(d => d.id !== distributorId);
      await fs.writeFile(dataFilePath, JSON.stringify(distributors, null, 2));
      
      return res.status(200).json({ message: 'Distributor deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
