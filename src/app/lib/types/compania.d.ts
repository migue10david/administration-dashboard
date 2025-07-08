export type CompaniaWhereInput = {
  OR?: Array<
    {
      nombre?: {
        contains: string;
        mode: 'insensitive';
      };
    } &
      {
        direccion?: {
          contains: string;
          mode: 'insensitive';
        };
      } &
      {
        telefono?: {
          contains: string;
          mode: 'insensitive';
        };
      }
  >;
};