export type ChequeWhereInput = {
  OR?: Array<
    {
      clienteId?: {
        contains: string;
        mode: 'insensitive';
      };
    } &
      {
        companiaId?: {
          contains: string;
          mode: 'insensitive';
        };
      } &
      {
        estado?: {
          contains: string;
          mode: 'insensitive';
        };
      }
  >;
};