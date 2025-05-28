import Globe from "globe.gl";
import { useRef, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Form from "./Form";
import type { Label, Picture, Image, FormSubmission } from "../utils/types";

export default function GlobeComponent() {
  const globeRef = useRef<HTMLDivElement>(null);
  const [modalLabel, setModalLabel] = useState<Label | null>(null);
  const [modalPicture, setModalPicture] = useState<Picture | null>(null);
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
    const formData = JSON.parse(localStorage.getItem("formData") || "[]");
    if (Array.isArray(formData) && formData.length > 0) {
      myGlobe.labelsData(
        formData.map((entry: FormSubmission) => ({
          text: entry.locationName,
          description: entry.description,
          lat: Number(entry.latitude),
          lng: Number(entry.longitude),
          picture: entry.files,
        }))
      );
    }
    myGlobe.onLabelHover((label) =>
      setModalLabel(label ? (label as Label) : null)
    );
    myGlobe.onLabelClick((label) => {
      const labelData = label as Label;
      if (labelData.picture && labelData.picture.length > 0) {
        setModalPicture(labelData.picture[0]);
      }
    });
  }, []);

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
      {modalPicture && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setModalPicture(null)}
        >
          <div
            className="bg-white p-4 rounded shadow pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={modalPicture.data} alt={modalPicture.name} />
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
