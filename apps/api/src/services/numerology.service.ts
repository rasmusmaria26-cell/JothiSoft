const CHALDEAN_VALUES: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8
};

const reduceNumber = (num: number): number => {
  if (num === 0) return 0;
  if (num === 11 || num === 22) return num;
  let current = num;
  while (current > 9) {
    if (current === 11 || current === 22) return current;
    current = String(current).split('').map(Number).reduce((sum, d) => sum + d, 0);
  }
  return current;
};

export const getChaldeanNumerology = async (name: string, dob: string, language: string = 'en') => {
  const sanitizedName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  let nameRaw = 0;
  let soulRaw = 0;
  let destinyRaw = 0;

  const vowels = ['a', 'e', 'i', 'o', 'u'];

  for (const char of sanitizedName) {
    const val = CHALDEAN_VALUES[char] || 0;
    nameRaw += val;
    if (vowels.includes(char)) {
      soulRaw += val;
    } else {
      destinyRaw += val;
    }
  }

  // Life path calculation
  const dobDigits = dob.replace(/[^0-9]/g, '');
  const dobRaw = dobDigits.split('').map(Number).reduce((sum, d) => sum + d, 0);

  return {
    name,
    dob,
    name_number: {
      raw: nameRaw,
      number: reduceNumber(nameRaw),
      name: name
    },
    life_path: {
      raw: dobRaw,
      number: reduceNumber(dobRaw),
      dob: dob
    },
    soul_urge: {
      raw: soulRaw,
      number: reduceNumber(soulRaw)
    },
    destiny: {
      raw: destinyRaw,
      number: reduceNumber(destinyRaw)
    }
  };
};

export const calculateAge = (dob: string) => {
  const birth = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Next birthday countdown
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = nextBirthday.getTime() - today.getTime();
  const days_until_birthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const yyyy = nextBirthday.getFullYear();
  const mm = String(nextBirthday.getMonth() + 1).padStart(2, '0');
  const dd = String(nextBirthday.getDate()).padStart(2, '0');
  const next_birthday = `${yyyy}-${mm}-${dd}`;

  return {
    years,
    months,
    days,
    next_birthday,
    days_until_birthday
  };
};
