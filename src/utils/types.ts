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
  title: string;
  src: string;
};
