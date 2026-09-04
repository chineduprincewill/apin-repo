import { useEffect, useState } from "react";
import { pointInPolygon, isNearPolygon } from "../utils/geofence-utils";

export function useGeofence(polygon, tolerance = 10) {
  const [position, setPosition] = useState(null);
  const [inside, setInside] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;

        const current = [lat, lng];

        setPosition(current);
        setAccuracy(acc);

        const insidePolygon = pointInPolygon(current, polygon);
        const nearPolygon = isNearPolygon(current, polygon, tolerance);

        //const result = insidePolygon || nearPolygon || acc > tolerance;
        const result = insidePolygon || nearPolygon;

        setInside(result);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);

  }, [polygon, tolerance]);

  return { position, inside, accuracy, error };
}