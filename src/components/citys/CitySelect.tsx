'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface City {
  id: string;
  name: string;
}

interface CitySelectProps {
  stateId: string;
  value: string;
  onChange: (value: string) => void;
}

export const CitySelect = ({ stateId, value, onChange }: CitySelectProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      if (!stateId) {
        setCities([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/city?stateId=${stateId}`);
        const city = await response.json();
        setCities(city.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [stateId]);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading || !stateId}>
      <SelectTrigger className="w-full">
        <SelectValue 
          placeholder={!stateId ? "Selecciona un estado primero" : loading ? "Cargando ciudades..." : "Selecciona una ciudad"} 
        />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.id}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};