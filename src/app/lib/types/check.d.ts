export type CheckWhereInput = {
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
      }
  >;
};