import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  locationName: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  longitude: z
    .string()
    .refine(
      (val) => /^-?\d*(\.?\d*)?$/.test(val) && val !== "",
      "Longitude is required and must be a number"
    )
    .refine((val) => {
      const num = Number(val);
      return num >= -180 && num <= 180;
    }, "Longitude must be between -180 and 180"),
  latitude: z
    .string()
    .refine(
      (val) => /^-?\d*(\.?\d*)?$/.test(val) && val !== "",
      "Latitude is required and must be a number"
    )
    .refine((val) => {
      const num = Number(val);
      return num >= -90 && num <= 90;
    }, "Latitude must be between -90 and 90"),
  files: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});

export default function Form() {
  const [locationName, setLocationName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = formSchema.safeParse({
      locationName,
      description,
      longitude,
      latitude,
      files,
    });
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    localStorage.setItem("locationName", locationName.toLowerCase());
    localStorage.setItem("description", description.toLowerCase());
    localStorage.setItem("longitude", longitude);
    localStorage.setItem("latitude", latitude);
    console.log("Form submitted successfully");
    setIsSubmitted(true);
    setLocationName("");
    setDescription("");
    setLongitude("");
    setLatitude("");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFiles(files);
    console.log(files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const images = JSON.parse(localStorage.getItem("files") || "[]");
        images.push({
          name: file.name,
          data: reader.result,
          lat: Number(latitude),
          lng: Number(longitude),
        });
        localStorage.setItem("files", JSON.stringify(images));
      };
      reader.readAsDataURL(file);
    });
  };

  if (isSubmitted) {
    return <div>Form submitted successfully</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-80 h-160 bg-white rounded-full font-mono"
    >
      <div className="flex flex-col justify-center w-full h-full gap-2">
        <p className="text-xl font-mono font-bold text-blue-950 mb-2">
          Location name
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="text"
          placeholder="Paris..."
          value={locationName}
          onChange={(e) => setLocationName(e.target.value.toLowerCase())}
        />
        {errors.locationName && (
          <span className="text-red-500">{errors.locationName}</span>
        )}
        <p className="text-xl font-mono font-bold text-blue-950 mb-2">
          Add description
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="text"
          placeholder="Paris in summer..."
          value={description}
          onChange={(e) => setDescription(e.target.value.toLowerCase())}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description}</span>
        )}
        <p className="text-xl font-mono font-bold text-blue-950 mb-2">
          Latitude
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="number"
          step="any"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        {errors.latitude && (
          <span className="text-red-500">{errors.latitude}</span>
        )}
        <p className="text-xl font-mono font-bold text-blue-950 mb-2">
          Longitude
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="number"
          step="any"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        {errors.longitude && (
          <span className="text-red-500">{errors.longitude}</span>
        )}
        <label className="block w-full cursor-pointer mt-4">
          <span className="bg-slate-500 text-white px-4 py-2 rounded">
            Choose Image
          </span>
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        {errors.files && <span className="text-red-500">{errors.files}</span>}
        {files.length > 0 &&
          files.map((file) => (
            <span key={file.name} className="block mt-1">
              {file.name}
            </span>
          ))}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Add
        </button>
      </div>
    </form>
  );
}
