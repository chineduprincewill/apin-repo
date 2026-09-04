import { useEffect, useState } from "react";

function pointInPolygon(point, polygon) {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [lat1, lng1] = polygon[i];
    const [lat2, lng2] = polygon[j];

    const intersect =
      ((lng1 > lng) !== (lng2 > lng)) &&
      lat < ((lat2 - lat1) * (lng - lng1)) / (lng2 - lng1) + lat1;

    if (intersect) inside = !inside;
  }

  return inside;
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function isNearPolygon(point, polygon, tolerance = 10) {
  const [lat, lng] = point;

  for (const [plat, plng] of polygon) {
    const dist = distanceMeters(lat, lng, plat, plng);
    if (dist <= tolerance) return true;
  }

  return false;
}

export function useSmartGeofence(polygon, tolerance = 10) {
  const [position, setPosition] = useState(null);
  const [inside, setInside] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;

        const point = [lat, lng];

        setPosition(point);
        setAccuracy(acc);

        const insidePolygon = pointInPolygon(point, polygon);
        const nearPolygon = isNearPolygon(point, polygon, tolerance);

        // Smart decision
        setInside(insidePolygon || nearPolygon || acc > tolerance);
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [polygon, tolerance]);

  return { position, inside, accuracy };
}