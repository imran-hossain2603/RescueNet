export type RescuePoint = { id: string; latitude: number; longitude: number; peopleCount: number; severity: string };
// Greedy distance-based clustering (Haversine distance). Radius is configurable in km.
export function clusterRequests(points: RescuePoint[], radiusKm = 2) {
  const remaining = new Set(points.map(p => p.id));
  const byId = new Map(points.map(p => [p.id, p]));
  const distance = (a: RescuePoint, b: RescuePoint) => {
    const rad = (n: number) => n * Math.PI / 180;
    const dLat = rad(b.latitude - a.latitude), dLon = rad(b.longitude - a.longitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  };
  const clusters: { id: string; requests: RescuePoint[]; people: number; center: [number, number] }[] = [];
  while (remaining.size) {
    const seedId = remaining.values().next().value as string;
    const seed = byId.get(seedId)!;
    const members = points.filter(p => remaining.has(p.id) && distance(seed, p) <= radiusKm);
    members.forEach(p => remaining.delete(p.id));
    const people = members.reduce((sum, p) => sum + p.peopleCount, 0);
    clusters.push({ id: `cluster-${clusters.length + 1}`, requests: members, people, center: [members.reduce((s,p)=>s+p.latitude,0)/members.length, members.reduce((s,p)=>s+p.longitude,0)/members.length] });
  }
  return clusters.sort((a,b) => b.people - a.people);
}
