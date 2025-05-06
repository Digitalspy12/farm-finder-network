
import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Distributor } from '../../types';

const dataFilePath = path.join(process.cwd(), 'src/data/distributors.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read the existing data
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    let distributors: Distributor[] = JSON.parse(jsonData);
    
    if (req.method === 'GET') {
      return res.status(200).json(distributors);
    }
    
    if (req.method === 'POST') {
      const newDistributor: Distributor = req.body;
      
      // Generate a unique ID
      const maxId = distributors.length > 0 
        ? Math.max(...distributors.map(d => d.id))
        : 0;
      newDistributor.id = maxId + 1;
      
      distributors.push(newDistributor);
      await fs.writeFile(dataFilePath, JSON.stringify(distributors, null, 2));
      
      return res.status(201).json(newDistributor);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
