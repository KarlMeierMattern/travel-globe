import Globe from "globe.gl";
import { useRef, useEffect, useState } from "react";
import { labels } from "../utils/coordinates";
import type { Label } from "../utils/types";

export default function GlobeComponent() {
  const globeRef = useRef<HTMLDivElement>(null);
  const [modalLabel, setModalLabel] = useState<Label | null>(null);

  useEffect(() => {
    if (!globeRef.current) return;
    const myGlobe = new Globe(globeRef.current);
    myGlobe.globeImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    );
    myGlobe.backgroundImageUrl(
      "https://unpkg.com/three-globe/example/img/night-sky.png"
    );
    myGlobe.onLabelHover((label) =>
      setModalLabel(label ? (label as Label) : null)
    );
    myGlobe.labelsData(labels);
    myGlobe.labelColor((label) => (label as Label).labelColor || "orange");
    myGlobe.labelSize((label) => (label as Label).labelSize || 1);
    myGlobe.labelDotRadius((label) => (label as Label).labelDotRadius || 1);
    myGlobe.labelsTransitionDuration(3000);
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
    </>
  );
}
