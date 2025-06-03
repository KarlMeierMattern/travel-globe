import Globe from "globe.gl";
import { useRef, useEffect, useState } from "react";
import Form from "./Form";
import type { Label, Picture } from "../utils/types";
import { supabase } from "../lib/supabase";
import Card from "./Card";
import Carousel from "./Carousel";
import FormIcon from "./FormIcon";
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
              description: img.description,
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
      <Card modalLabel={modalLabel} />
      <Carousel
        modalPictures={modalPictures}
        currentPicIdx={currentPicIdx}
        setModalPictures={setModalPictures}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <FormIcon setModalIcon={setModalIcon} />
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
