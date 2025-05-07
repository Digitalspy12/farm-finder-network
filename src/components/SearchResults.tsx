
import { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Farmer, Distributor } from "@/types";
import { Search, Phone, MapPin, Leaf } from "lucide-react";
import { toast } from "sonner";
import { fetchData } from "@/utils/apiUtils";

export default function SearchResults() {
  const { userRole } = useRole();
  const [location, setLocation] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [searchResults, setSearchResults] = useState<(Farmer | Distributor)[]>([]);
  const [filteredResults, setFilteredResults] = useState<(Farmer | Distributor)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueCrops, setUniqueCrops] = useState<string[]>([]);

  const searchEndpoint = userRole === "farmer" ? "distributors" : "farmers";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData(searchEndpoint);
        
        if (data) {
          setSearchResults(data);
          setFilteredResults(data);
          
          // Extract unique crops from all results
          const allCrops = data.flatMap((item: Farmer | Distributor) => item.crops || []);
          const uniqueCropsList = Array.from(new Set(allCrops)) as string[];
          setUniqueCrops(uniqueCropsList);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Failed to fetch search results");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchEndpoint]);

  useEffect(() => {
    // Apply filters when search results, location, or crop filter changes
    let filtered = searchResults;
    
    if (location) {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter((result) => 
        result.location.toLowerCase().includes(locationLower)
      );
    }
    
    if (cropFilter) {
      filtered = filtered.filter((result) => 
        result.crops && result.crops.includes(cropFilter)
      );
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else {
        // Sort based on location
        return a.location.length - b.location.length;
      }
    });
    
    setFilteredResults(filtered);
  }, [searchResults, location, cropFilter, sortOption]);

  const handleSearch = () => {
    toast.success("Search updated");
  };

  const clearFilters = () => {
    setLocation("");
    setCropFilter("");
    setSortOption("name");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Search for {userRole === "farmer" ? "Distributors" : "Farmers"}
          </CardTitle>
          <CardDescription>
            Find {userRole === "farmer" ? "distributors" : "farmers"} based on location and crop type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter location (city, state)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-croplink-green hover:bg-croplink-green-dark"
              >
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={cropFilter} onValueChange={setCropFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Crops</SelectItem>
                    {uniqueCrops.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name (A-Z)</SelectItem>
                    <SelectItem value="distance">Sort by Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Results ({filteredResults.length})</h3>
        
        {isLoading ? (
          <div className="text-center py-8">Loading results...</div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No matches found. Try adjusting your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((result) => (
              <Card key={result.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h3 className="text-xl font-medium">{result.name}</h3>
                      <p className="text-muted-foreground">
                        {userRole === "farmer" 
                          ? (result as Distributor).companyName 
                          : (result as Farmer).farmName}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{result.location}</span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-croplink-green" /> 
                        {userRole === "farmer" ? "Distributes:" : "Grows:"}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.crops && result.crops.map((crop, index) => (
                          <span
                            key={index}
                            className="bg-croplink-green/10 text-croplink-green-dark px-2 py-1 rounded-full text-xs"
                          >
                            {crop}
                          </span>
                        ))}
                        {(!result.crops || result.crops.length === 0) && (
                          <span className="text-muted-foreground text-sm">No crops listed</span>
                        )}
                      </div>
                    </div>
                    
                    <Button className="mt-2" variant="outline">
                      <Phone className="h-4 w-4 mr-2" /> 
                      {result.contact}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
