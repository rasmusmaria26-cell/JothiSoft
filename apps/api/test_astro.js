const Astronomy = require('astronomy-engine');

const date = new Date('2026-05-20T12:00:00Z');
const time = Astronomy.MakeTime(date);

const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, time, true);
const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);

const sunEcl = Astronomy.Ecliptic(sunVec);
const moonEcl = Astronomy.Ecliptic(moonVec);

console.log('Sun Tropical:', sunEcl.elon);
console.log('Moon Tropical:', moonEcl.elon);

// Lahiri Ayanamsa approx for 2026:
const year = 2026;
const ayanamsa = 24.1 + (year - 2000) * (50.29 / 3600);

const sunSidereal = (sunEcl.elon - ayanamsa + 360) % 360;
const moonSidereal = (moonEcl.elon - ayanamsa + 360) % 360;

console.log('Sun Sidereal:', sunSidereal);
console.log('Moon Sidereal:', moonSidereal);

// Tithi: (Moon - Sun) / 12
let diff = moonSidereal - sunSidereal;
if (diff < 0) diff += 360;
const tithi = diff / 12;

console.log('Tithi (exact):', tithi);
console.log('Tithi (index):', Math.floor(tithi) + 1);

// Nakshatra: Moon / 13.333333
const nakshatra = moonSidereal / (360/27);
console.log('Nakshatra (exact):', nakshatra);
console.log('Nakshatra (index):', Math.floor(nakshatra) + 1);
