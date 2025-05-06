
import { toast } from "sonner";

export async function fetchData(endpoint: string) {
  try {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Failed to load data. Please try again.");
    return null;
  }
}

export async function postData(endpoint: string, data: any) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error posting data to ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Post error:", error);
    toast.error("Failed to save data. Please try again.");
    return null;
  }
}

export async function updateData(endpoint: string, id: number, data: any) {
  try {
    const response = await fetch(`/api/${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating data in ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update data. Please try again.");
    return null;
  }
}

export async function deleteData(endpoint: string, id: number) {
  try {
    const response = await fetch(`/api/${endpoint}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting data from ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete data. Please try again.");
    return null;
  }
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}
