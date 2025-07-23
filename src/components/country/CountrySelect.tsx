'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Country {
  id: string;
  name: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/country');
        const country = await response.json();
        setCountries(country.data);
      } catch (error) {
        console.error('Error obteniendo paises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Cargando países..." : "Selecciona un país"} />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.id} value={country.id}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};