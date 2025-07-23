'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface State {
  id: string;
  name: string;
}

interface StateSelectProps {
  countryId: string;
  value: string;
  onChange: (value: string) => void;
}

export const StateSelect = ({ countryId, value, onChange }: StateSelectProps) => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryId) {
        setStates([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/state?countryId=${countryId}`);
        const state = await response.json();
        setStates(state.data);
      } catch (error) {
        console.error('Error obteniendo estados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [countryId]);

  return (
    <Select value={value} onValueChange={onChange} disabled={loading || !countryId}>
      <SelectTrigger className="w-full">
        <SelectValue 
          placeholder={!countryId ? "Selecciona un país primero" : loading ? "Cargando estados..." : "Selecciona un estado"} 
        />
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state.id} value={state.id}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};