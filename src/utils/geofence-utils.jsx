export function pointInPolygon(point, polygon) {
    const [lat, lng] = point;
    let inside = false;
  
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [lat1, lng1] = polygon[i];
      const [lat2, lng2] = polygon[j];
  
      const intersect =
        (lng1 > lng) !== (lng2 > lng) &&
        lat < ((lat2 - lat1) * (lng - lng1)) / (lng2 - lng1) + lat1;
  
      if (intersect) inside = !inside;
    }
  
    return inside;
  }
  
  export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
  
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  
  export function isNearPolygon(point, polygon, toleranceMeters = 10) {
    const [lat, lng] = point;
  
    for (const [plat, plng] of polygon) {
      const dist = haversineDistance(lat, lng, plat, plng);
      if (dist <= toleranceMeters) return true;
    }
  
    return false;
  }