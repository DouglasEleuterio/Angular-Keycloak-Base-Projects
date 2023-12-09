import { Class } from 'leaflet';

export interface Dropdown {
  label: Class;
  value: string;
}

export const buildDropdownFromEnum = (eNum: Class): Dropdown[] => {
  const items: Dropdown[] = [];
  items.push({
    label: 'Selecione',
    value: null
  });
  Object.keys(eNum).forEach((key: string) => {
    items.push({ label: eNum[key], value: key });
  });
  return items;
};
