import { useState } from "react";
import { formSchema } from "../utils/formSchema";
import type { FormData, FormSubmission, FormSubmissions } from "../utils/types";

export default function Form() {
  const [formData, setFormData] = useState<FormData>({
    locationName: "",
    description: "",
    longitude: "",
    latitude: "",
    files: [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = formSchema.safeParse({
      locationName: formData?.locationName,
      description: formData?.description,
      longitude: formData?.longitude,
      latitude: formData?.latitude,
      files: formData?.files,
    });
    if (!result.success) {
      const fieldErrors: { [index: string]: string } = {}; // called an index signature in typescript
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    // Process files and store in localStorage
    const processFiles = async () => {
      const filePromises = formData.files.map(async (file) => {
        const reader = new FileReader();
        return new Promise<{ name: string; data: string }>((resolve) => {
          reader.onload = () =>
            resolve({
              name: file.name,
              data: reader.result as string,
            });
          reader.readAsDataURL(file);
        });
      });

      const processedFiles = await Promise.all(filePromises);

      // Get existing data from localStorage
      let existingData: FormSubmissions;
      try {
        const storedData = localStorage.getItem("formData");
        existingData = storedData ? JSON.parse(storedData) : [];
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        existingData = [];
      }

      // Find if a submission with same lat/lng exists
      const matchIdx = existingData.findIndex(
        (entry) =>
          entry.latitude === formData.latitude &&
          entry.longitude === formData.longitude
      );

      if (matchIdx !== -1) {
        // Merge images into existing entry
        existingData[matchIdx].files = [
          ...existingData[matchIdx].files,
          ...processedFiles,
        ];
        existingData[matchIdx].timestamp = new Date().toISOString();
        existingData[matchIdx].locationName =
          formData.locationName.toLowerCase();
        existingData[matchIdx].description = formData.description.toLowerCase();
        localStorage.setItem("formData", JSON.stringify(existingData));
      } else {
        // Add new submission
        const newSubmission: FormSubmission = {
          locationName: formData.locationName.toLowerCase(),
          description: formData.description.toLowerCase(),
          longitude: formData.longitude,
          latitude: formData.latitude,
          files: processedFiles,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(
          "formData",
          JSON.stringify([...existingData, newSubmission])
        );
      }
    };

    // Process files and store everything
    processFiles().then(() => {
      console.log("Form submitted successfully");
      setIsSubmitted(true);
      setFormData({
        locationName: "",
        description: "",
        longitude: "",
        latitude: "",
        files: [],
      });
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({
      ...formData,
      files: files,
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
          Location name blah!
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="text"
          placeholder="Paris..."
          value={formData?.locationName}
          onChange={(e) =>
            setFormData({
              ...formData,
              locationName: e.target.value.toLowerCase(),
            })
          }
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
          value={formData?.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value.toLowerCase(),
            })
          }
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
          value={formData?.latitude}
          onChange={(e) =>
            setFormData({
              ...formData,
              latitude: e.target.value,
            })
          }
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
          value={formData?.longitude}
          onChange={(e) =>
            setFormData({
              ...formData,
              longitude: e.target.value,
            })
          }
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
        {formData?.files.length > 0 &&
          formData?.files.map((file) => (
            <span key={file.name} className="block mt-1">
              {file.name}
            </span>
          ))}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer"
        >
          Add
        </button>
      </div>
    </form>
  );
}
