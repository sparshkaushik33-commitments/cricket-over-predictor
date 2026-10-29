// ─────────────────────────────────────────────────────────────────────────────
// Real international cricketer names (used with permission of public knowledge)
// Strength ratings reflect career strike-rate / batting impact level
// ─────────────────────────────────────────────────────────────────────────────

export const TEAMS = [
  { name: 'India', city: '', short: 'IND', color: '#1d4ed8' },
  { name: 'Australia', city: '', short: 'AUS', color: '#eab308' },
  { name: 'England', city: '', short: 'ENG', color: '#dc2626' },
  { name: 'Pakistan', city: '', short: 'PAK', color: '#15803d' },
  { name: 'South Africa', city: '', short: 'SA', color: '#047857' },
  { name: 'New Zealand', city: '', short: 'NZ', color: '#334155' },
  { name: 'West Indies', city: '', short: 'WI', color: '#991b1b' },
  { name: 'Sri Lanka', city: '', short: 'SL', color: '#0284c7' },
  { name: 'Afghanistan', city: '', short: 'AFG', color: '#0369a1' },
  { name: 'Bangladesh', city: '', short: 'BAN', color: '#166534' },
];

/**
 * Batters — real names, strength 0-100 reflecting T20 impact
 * (aggressive finishers score higher; anchors/openers score moderate)
 */
export const BATTERS = [
  // India
  { name: 'V. Kohli',       strength: 95 },
  { name: 'R. Sharma',      strength: 92 },
  { name: 'S. Dhawan',      strength: 80 },
  { name: 'K. L. Rahul',    strength: 84 },
  { name: 'H. Pandya',      strength: 87 },
  { name: 'S. Iyer',        strength: 78 },
  { name: 'R. Jadeja',      strength: 72 },
  { name: 'D. Padikkal',    strength: 74 },
  { name: 'S. Samson',      strength: 80 },
  // Australia
  { name: 'D. Warner',      strength: 91 },
  { name: 'S. Smith',       strength: 82 },
  { name: 'G. Maxwell',     strength: 97 },
  { name: 'T. Head',        strength: 89 },
  { name: 'M. Stoinis',     strength: 85 },
  { name: 'A. Finch',       strength: 83 },
  // England
  { name: 'J. Buttler',     strength: 94 },
  { name: 'B. Stokes',      strength: 86 },
  { name: 'J. Root',        strength: 79 },
  { name: 'D. Malan',       strength: 77 },
  { name: 'L. Livingstone', strength: 93 },
  { name: 'M. Ali',         strength: 71 },
  // West Indies
  { name: 'K. Pollard',     strength: 90 },
  { name: 'A. Russell',     strength: 99 },
  { name: 'S. Hope',        strength: 73 },
  { name: 'N. Pooran',      strength: 88 },
  // Pakistan
  { name: 'B. Azam',        strength: 90 },
  { name: 'M. Rizwan',      strength: 82 },
  { name: 'S. Masood',      strength: 76 },
  { name: 'F. Zaman',       strength: 83 },
  // New Zealand
  { name: 'K. Williamson',  strength: 85 },
  { name: 'M. Guptill',     strength: 87 },
  { name: 'D. Conway',      strength: 80 },
  { name: 'G. Phillips',    strength: 84 },
  // South Africa
  { name: 'Q. de Kock',     strength: 86 },
  { name: 'R. Hendricks',   strength: 78 },
  { name: 'H. Klaasen',     strength: 91 },
  { name: 'D. Miller',      strength: 89 },
  // Sri Lanka
  { name: 'K. Perera',      strength: 88 },
  { name: 'D. Gunathilaka', strength: 80 },
  { name: 'P. Nissanka',    strength: 77 },
  { name: 'C. Asalanka',    strength: 82 },
  // Bangladesh / Afghanistan
  { name: 'M. Ullah',       strength: 79 },
  { name: 'I. Zadran',      strength: 81 },
  { name: 'R. Khan',        strength: 75 },
];

/**
 * Bowlers — real names, economy & wicketRate reflecting T20 career stats
 */
export const BOWLERS = [
  // India
  { name: 'J. Bumrah',       economy: 6.7,  wicketRate: 0.26 },
  { name: 'R. Ashwin',       economy: 6.9,  wicketRate: 0.20 },
  { name: 'B. Kumar',        economy: 7.4,  wicketRate: 0.18 },
  { name: 'Y. Chahal',       economy: 7.6,  wicketRate: 0.22 },
  { name: 'A. Mishra',       economy: 7.2,  wicketRate: 0.21 },
  { name: 'K. Yadav',        economy: 6.8,  wicketRate: 0.20 },
  // Australia
  { name: 'P. Cummins',      economy: 7.5,  wicketRate: 0.23 },
  { name: 'A. Zampa',        economy: 7.0,  wicketRate: 0.24 },
  { name: 'M. Starc',        economy: 8.0,  wicketRate: 0.22 },
  { name: 'J. Hazlewood',    economy: 7.1,  wicketRate: 0.19 },
  { name: 'K. Richardson',   economy: 7.9,  wicketRate: 0.16 },
  // England
  { name: 'A. Rashid',       economy: 7.3,  wicketRate: 0.23 },
  { name: 'J. Archer',       economy: 7.1,  wicketRate: 0.21 },
  { name: 'C. Jordan',       economy: 8.5,  wicketRate: 0.17 },
  { name: 'T. Curran',       economy: 8.8,  wicketRate: 0.14 },
  { name: 'M. Wood',         economy: 8.1,  wicketRate: 0.18 },
  // West Indies
  { name: 'S. Cottrell',     economy: 7.8,  wicketRate: 0.18 },
  { name: 'J. Holder',       economy: 7.6,  wicketRate: 0.17 },
  { name: 'O. McCoy',        economy: 7.4,  wicketRate: 0.25 },
  // Pakistan
  { name: 'S. Shah',         economy: 7.0,  wicketRate: 0.22 },
  { name: 'H. Ali',          economy: 8.2,  wicketRate: 0.16 },
  { name: 'M. Amir',         economy: 7.3,  wicketRate: 0.19 },
  { name: 'N. Pooran',       economy: 8.4,  wicketRate: 0.13 },
  // New Zealand
  { name: 'T. Boult',        economy: 7.5,  wicketRate: 0.21 },
  { name: 'L. Ferguson',     economy: 7.8,  wicketRate: 0.20 },
  { name: 'M. Bracewell',    economy: 7.2,  wicketRate: 0.18 },
  // South Africa
  { name: 'K. Rabada',       economy: 7.4,  wicketRate: 0.24 },
  { name: 'T. Shamsi',       economy: 6.9,  wicketRate: 0.25 },
  { name: 'A. Nortje',       economy: 7.7,  wicketRate: 0.21 },
  { name: 'L. Ngidi',        economy: 8.0,  wicketRate: 0.18 },
  // Sri Lanka / Afghanistan
  { name: 'M. Theekshana',   economy: 6.8,  wicketRate: 0.23 },
  { name: 'W. Hasaranga',    economy: 6.5,  wicketRate: 0.27 },
  { name: 'M. Nabi',         economy: 6.6,  wicketRate: 0.20 },
  { name: 'F. Zaman',        economy: 8.3,  wicketRate: 0.14 },
];
