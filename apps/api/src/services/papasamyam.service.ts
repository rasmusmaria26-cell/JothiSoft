import { PlanetData } from './horoscope.service';

export const calculatePapasamyam = (boyPlanets: PlanetData[], girlPlanets: PlanetData[]) => {
  const calculatePoints = (planets: PlanetData[]) => {
    // Malefic planets considered for Papasamyam
    const malefics = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
    // Houses that cause dosha
    const doshaHouses = [1, 2, 4, 7, 8, 12];
    
    // Helper to find planet's sign/house
    const getPlanetHouse = (planetName: string) => {
      const p = planets.find(p => p.planet === planetName);
      return p ? p.house : 1;
    };
    
    // We need to calculate dosha from Lagna, Moon, and Venus.
    // Lagna is house 1.
    const lagnaHouse = 1;
    const moonHouse = getPlanetHouse('Moon');
    const venusHouse = getPlanetHouse('Venus');
    
    let score = 0;
    
    for (const p of planets) {
      if (!malefics.includes(p.planet)) continue;
      
      // Calculate house distance from Lagna
      const fromLagna = p.house; // Since p.house is already relative to Lagna in our standard mapping
      if (doshaHouses.includes(fromLagna)) {
        score += (p.planet === 'Mars' && (fromLagna === 7 || fromLagna === 8)) ? 1.5 : 1;
      }
      
      // Calculate house distance from Moon
      const fromMoon = ((p.house - moonHouse + 12) % 12) + 1;
      if (doshaHouses.includes(fromMoon)) {
        // Moon points usually carry slightly less weight but we sum them equally for simplicity, 
        // or 0.75 in some traditions. We'll use 1 for standard 33-point systems.
        score += (p.planet === 'Mars' && (fromMoon === 7 || fromMoon === 8)) ? 1.5 : 1;
      }
      
      // Calculate house distance from Venus
      const fromVenus = ((p.house - venusHouse + 12) % 12) + 1;
      if (doshaHouses.includes(fromVenus)) {
        score += (p.planet === 'Mars' && (fromVenus === 7 || fromVenus === 8)) ? 0.75 : 0.5; // Venus points are usually half weight
      }
    }
    
    return Math.round(score * 2) / 2; // round to nearest 0.5
  };

  const boy_score = calculatePoints(boyPlanets);
  const girl_score = calculatePoints(girlPlanets);
  const difference = Math.abs(boy_score - girl_score);
  
  // Rule of thumb: difference <= 1.5 or 2 is acceptable. Also, Boy should ideally have higher or equal points.
  const compatible = difference <= 2 && boy_score >= girl_score - 1;

  return {
    boy_score,
    girl_score,
    difference,
    compatible
  };
};
