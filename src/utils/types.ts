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
  description: string;
};

export type FormData = {
  locationName: string;
  description: string;
  latitude: string;
  longitude: string;
  files: File[];
};

export type FormSubmission = {
  locationName: string;
  description: string;
  latitude: string;
  longitude: string;
  files: Array<{ name: string; data: string }>;
  timestamp: string;
};

export type FormSubmissions = FormSubmission[];

export type Image = {
  name: string;
  data: string;
  lat: number;
  lng: number;
};
