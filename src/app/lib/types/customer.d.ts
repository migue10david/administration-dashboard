export type CustomerWhereInput = {
  OR?: Array<
    {
      code?: {
        contains: string;
        mode: "insensitive";
      };
    } & {
      firstName?: {
        contains: string;
        mode: "insensitive";
      };
    } & {
      middleName?: {
        contains: string;
        mode: "insensitive";
      };
    } & {
      lastNameOne?: {
        contains: string;
        mode: "insensitive";
      };
    } & {
      lastNameTwo?: {
        contains: string;
        mode: "insensitive";
      };
    } & {
      phone?: {
        contains: string;
        mode: "insensitive";
      };
    }
  >;
};
