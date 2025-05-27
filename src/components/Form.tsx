import { useState, useEffect } from "react";

export default function Form() {
  const [locationName, setLocationName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);

  // save to localstorage for dev purposes.
  useEffect(() => {
    localStorage.setItem("description", description);
    localStorage.setItem("files", JSON.stringify(files));
  }, [description, files]);

  return (
    <form className=" w-80 h-160 bg-white rounded-full font-mono">
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
        <p className="text-xl font-mono font-bold text-blue-950 mb-2">
          Longitude
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(Number(e.target.value))}
        />
        <p className="text-xl font-mono font-bold text-blue-950 mb-2">
          Latitude
        </p>
        <input
          className="w-full h-1/12 mb-2 py-2 px-2 border-blue-950 border-2 rounded-lg"
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(Number(e.target.value))}
        />
        <label className="block w-full cursor-pointer mt-4">
          <span className="bg-slate-500 text-white px-4 py-2 rounded">
            Choose Image
          </span>
          <input
            type="file"
            className="hidden"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            accept="image/*"
          />
        </label>
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
