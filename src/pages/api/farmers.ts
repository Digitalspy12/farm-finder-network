
import { promises as fs } from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Farmer } from '../../types';

const dataFilePath = path.join(process.cwd(), 'src/data/farmers.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read the existing data
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    let farmers: Farmer[] = JSON.parse(jsonData);
    
    if (req.method === 'GET') {
      return res.status(200).json(farmers);
    }
    
    if (req.method === 'POST') {
      const newFarmer: Farmer = req.body;
      
      // Generate a unique ID
      const maxId = farmers.length > 0 
        ? Math.max(...farmers.map(f => f.id))
        : 0;
      newFarmer.id = maxId + 1;
      
      farmers.push(newFarmer);
      await fs.writeFile(dataFilePath, JSON.stringify(farmers, null, 2));
      
      return res.status(201).json(newFarmer);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
