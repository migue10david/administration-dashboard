'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer } from '@/app/lib/types/modelTypes';

interface RecipientSearchProps {
  onSelect: (recipient: Customer) => void;
  onCreateNew?: () => void;
  error?: boolean;
  onBlur?: () => void;
}

export function RecipientSearch({ 
  onSelect, 
  onCreateNew, 
  error,
  onBlur
}: RecipientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Customer | null>(null);

  // Función para buscar beneficiarios
  const searchRecipients = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/recipient/search?term=${encodeURIComponent(term)}`);
      const data = await response.json();
      setResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching recipients:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce para evitar muchas llamadas API
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedRecipient || searchTerm !== `${selectedRecipient.firstName} ${selectedRecipient.lastNameOne}`) {
        searchRecipients(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchRecipients, selectedRecipient]);

  const handleSelect = (recipient: Customer) => {
    setSelectedRecipient(recipient);
    onSelect(recipient);
    setShowDropdown(false);
    setSearchTerm(`${recipient.firstName} ${recipient.lastNameOne}`);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      if (onBlur) onBlur();
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value === '') {
              setSelectedRecipient(null);
              onSelect({} as Customer); // Reset selection
            }
          }}
          onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
          onBlur={handleBlur}
          placeholder="Buscar por nombre, apellido o código..."
          className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {isLoading && (
          <div className="flex items-center">
            <span className="loading loading-spinner"></span>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {results.length > 0 ? (
            results.map((recipient) => (
              <div
                key={recipient.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(recipient)}
              >
                <div className="font-semibold">
                  {recipient.firstName} {recipient.lastNameOne} {recipient.lastNameTwo}
                </div>
                <div className="text-sm text-gray-500">
                  Código: {recipient.code} | Tel: {recipient.phone}
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">
              {searchTerm.length > 1 ? 'No se encontraron resultados' : 'Escribe al menos 2 caracteres'}
              {onCreateNew && searchTerm.length > 1 && (
                <button
                  onClick={() => {
                    onCreateNew();
                    setShowDropdown(false);
                  }}
                  className="mt-2 w-full text-left text-blue-500 hover:text-blue-700"
                >
                  + Crear nuevo beneficiario
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}