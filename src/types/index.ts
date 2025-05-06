
export interface Farmer {
  id: number;
  name: string;
  farmName: string;
  contact: string;
  location: string;
  latitude?: number;
  longitude?: number;
  crops: string[];
}

export interface Distributor {
  id: number;
  name: string;
  companyName: string;
  contact: string;
  location: string;
  latitude?: number;
  longitude?: number;
  crops: string[];
}
