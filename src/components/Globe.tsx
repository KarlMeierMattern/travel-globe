import Globe from "globe.gl";
import { useRef, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Form from "./Form";
import type { Label, Picture } from "../utils/types";
import { supabase } from "../lib/supabase";
import type { Database } from "../utils/database.types";

type Image = Database["public"]["Tables"]["images"]["Row"];

export default function GlobeComponent() {
  const globeRef = useRef<HTMLDivElement>(null);
  const [modalLabel, setModalLabel] = useState<Label | null>(null);
  const [modalPictures, setModalPictures] = useState<Picture[] | null>(null);
  const [currentPicIdx, setCurrentPicIdx] = useState(0);
  const [modalIcon, setModalIcon] = useState<boolean>(false);

  useEffect(() => {
    if (!globeRef.current) return;
    const myGlobe = new Globe(globeRef.current);
    myGlobe.labelColor((label) => (label as Label).labelColor || "orange");
    myGlobe.labelSize((label) => (label as Label).labelSize || 1);
    myGlobe.labelDotRadius((label) => (label as Label).labelDotRadius || 1);
    myGlobe.labelsTransitionDuration(3000);
    myGlobe.globeImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    );
    myGlobe.backgroundImageUrl(
      "https://unpkg.com/three-globe/example/img/night-sky.png"
    );

    // Fetch data from Supabase
    const fetchData = async () => {
      const { data: locations, error: locationsError } = await supabase.from(
        "locations"
      ).select(`
          *,
          images (*)
        `);

      if (locationsError) {
        console.error("Error fetching locations:", locationsError);
        return;
      }

      if (locations && locations.length > 0) {
        myGlobe.labelsData(
          locations.map((location) => ({
            text: location.location_name,
            description: location.description,
            lat: location.latitude,
            lng: location.longitude,
            picture: location.images.map((img: Image) => ({
              name: img.name,
              data: img.url,
            })),
          }))
        );
      }
    };

    fetchData();

    myGlobe.onLabelHover((label) =>
      setModalLabel(label ? (label as Label) : null)
    );
    myGlobe.onLabelClick((label) => {
      const labelData = label as Label;
      if (labelData.picture && labelData.picture.length > 0) {
        setModalPictures(labelData.picture);
        setCurrentPicIdx(0);
      }
    });
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalPictures) return;
    setCurrentPicIdx((idx) => (idx === 0 ? modalPictures.length - 1 : idx - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modalPictures) return;
    setCurrentPicIdx((idx) => (idx === modalPictures.length - 1 ? 0 : idx + 1));
  };

  return (
    <>
      <div ref={globeRef} className="w-full h-full" />
      {modalLabel && (
        <div className="absolute top-8 left-8 bg-white p-4 rounded shadow pointer-events-auto z-50">
          <h2 className="text-lg font-bold mb-2">{modalLabel.text}</h2>
          <p>Lat: {modalLabel.lat}</p>
          <p>Lng: {modalLabel.lng}</p>
        </div>
      )}
      {modalPictures && modalPictures.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50"
          onClick={() => setModalPictures(null)}
        >
          <div
            className="bg-white p-4 rounded shadow pointer-events-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalPictures[currentPicIdx].data}
              alt={modalPictures[currentPicIdx].name}
              className="max-w-xs max-h-96 mb-2"
            />
            <div className="flex gap-4 items-center">
              <button
                onClick={handlePrev}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
              >
                Prev
              </button>
              <span>
                {currentPicIdx + 1} / {modalPictures.length}
              </span>
              <button
                onClick={handleNext}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="absolute top-8 right-8 z-50 p-2 bg-white rounded-full cursor-pointer"
        onClick={() => setModalIcon(true)}
      >
        <Plus />
      </button>
      {modalIcon && (
        <div className="fixed inset-0 z-50" onClick={() => setModalIcon(false)}>
          <div
            className="absolute top-20 right-8 bg-white p-6 rounded shadow pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Form />
          </div>
        </div>
      )}
    </>
  );
}
