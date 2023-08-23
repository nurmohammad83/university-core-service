export const roomSearchableField = ['roomNumber', 'floor', 'buildingId'];

export const roomFilterableFields = [
  'searchTerm',
  'roomNumber',
  'floor',
  'buildingId',
];
export const roomRelationalFields: string[] = ['buildingId'];
export const roomRelationalFieldsMapper: { [key: string]: string } = {
  buildingId: 'building',
};
