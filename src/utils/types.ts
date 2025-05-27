export type Label = {
  lat: number;
  lng: number;
  text: string;
  labelColor?: string;
  labelSize?: number;
  labelDotRadius?: number;
  picture?: Picture[];
};

export type Picture = {
  name: string;
  data: string;
};
