
export type ClientFormState = |
{
    data: {
        nombre?: string;
        direccion?: string;
        telefono?: string;
        nacionalidad?: string;
        imageUrl?: string;
    };
    errors: {
        nombre?: string[];
        direccion?: string[];
        telefono?: string[];
        nacionalidad?: string[];
        imageUrl?: string[];
    };
    message?: string;
} | undefined