export const START = { lat: 52.0894, lng: 5.1101 };

export const CAT_COLORS = {
  transport: '#1B1B1B',
  culture: '#28433D',
  food: '#A8432E',
  shopping: '#C7961F',
  nature: '#4F6E48',
};

export const CAT_LABELS = {
  transport: 'Transport hub',
  culture: 'Culture',
  food: 'Food & drink',
  shopping: 'Shopping',
  nature: 'Nature',
};

export const TRAVEL_FLAVOR = [
  "A cyclist rings their bell and overtakes you without slowing down.",
  "You dodge a tram at the crossing a beat later than you'd like.",
  "Someone's cargo bike rattles past, three kids and a dog balanced in the front box.",
  "A church bell somewhere counts out the hour as you walk.",
  "The smell of frying oliebollen drifts from a stall you didn't plan to stop at — but almost do.",
];

export const LOCATIONS = [
  {
    id: 'centraal', name: 'Utrecht Centraal', cat: 'transport', icon: '🚉', lat: 52.0894, lng: 5.1101,
    intro: "The station concourse hums with bikes wheeling past and the announcer's clipped Dutch. This is home base — you can always drift back here.",
    activities: [
      {
        id: 'coffee-togo', label: 'Grab a coffee to-go from the kiosk', time: 5, money: 3, energy: 10, mood: 2,
        text: "The kiosk coffee is bitter and a little burnt, but it's hot, and the woman behind the counter tosses in a free stroopwafel to balance it out.",
      },
    ],
  },
  {
    id: 'dom', name: 'Domplein & Dom Tower', cat: 'culture', icon: '🏰', lat: 52.0908, lng: 5.1215,
    intro: "The Dom Tower rises 112 metres over the square, the tallest church tower in the country, oddly disconnected from its own nave since a 1674 storm tore the middle of the church clean off.",
    activities: [
      {
        id: 'climb', label: 'Climb the 465 steps to the top', time: 75, money: 12.5, energy: -20,
        random: {
          chance: 0.7,
          good: { mood: 28, text: "The guide times it perfectly — you crest the final stairwell just as the haze burns off, and all of Utrecht opens out beneath you: red rooftops, the ring of canals, windmills on the horizon." },
          bad: { mood: 12, text: "Low cloud rolls in halfway up, and the view from the top is mostly grey soup. Still, there's something satisfying about the burn in your legs and the bell chamber's enormous, silent bells up close." },
        },
      },
      {
        id: 'watch', label: 'Sit on Domplein and people-watch', time: 20, money: 0, energy: 5, mood: 8,
        text: "You find a stone step in the sun. A street musician plays something half-recognisable on an accordion, and a wedding party spills out of the Dom's side door, laughing.",
      },
    ],
  },
  {
    id: 'oudegracht', name: 'Oudegracht Wharf', cat: 'food', icon: '☕', lat: 52.0899, lng: 5.1201,
    intro: "Utrecht's signature trick: the canal here runs a full storey below street level, with wharf cellars — once warehouses, now cafés — opening directly onto the water.",
    activities: [
      {
        id: 'terrace', label: 'Coffee & appeltaart on the wharf terrace', time: 40, money: 6.5, energy: 15, mood: 10,
        text: "You get a table right at the waterline. The appeltaart arrives with a small mountain of whipped cream, and a duck family paddles past close enough to touch.",
      },
      {
        id: 'boat', label: 'Rent a small sloep and take it for a spin', time: 60, money: 20, energy: -5,
        random: {
          chance: 0.65,
          good: { mood: 25, text: "You get the hang of the tiller almost immediately, gliding under low bridges as cyclists rumble overhead. It's the best twenty euros you've spent all trip." },
          bad: { mood: 9, text: "A sudden drizzle catches you halfway round the loop, and you spend the last twenty minutes steering one-handed while holding your jacket over your bag." },
        },
      },
    ],
  },
  {
    id: 'museum', name: 'Centraal Museum', cat: 'culture', icon: '🖼️', lat: 52.0850, lng: 5.1204,
    intro: "The Netherlands' oldest municipal museum, tucked into a former convent, with a wing devoted to Utrecht-born furniture radical Gerrit Rietveld.",
    activities: [
      {
        id: 'full', label: 'Buy a ticket and explore at leisure', time: 90, money: 15.5, energy: -10, mood: 18,
        text: "You lose track of time in the Rietveld room, staring at the primary-colour geometry of a chair that looks like it shouldn't be sittable, and somehow is.",
      },
      {
        id: 'garden', label: 'Peek at the free museum garden only', time: 15, money: 0, energy: 5, mood: 4,
        text: "You skip the ticket line and slip into the courtyard garden instead — a quiet square of clipped hedges and a single, enormous magnolia.",
      },
    ],
  },
  {
    id: 'miffy', name: 'Nijntje (Miffy) Museum', cat: 'culture', icon: '🐰', lat: 52.0918, lng: 5.1266,
    intro: "Dick Bruna's tiny square-headed rabbit was born right here in Utrecht. The museum is technically for children, which has never stopped anyone.",
    activities: [
      {
        id: 'inside', label: 'Relive childhood inside the museum', time: 45, money: 7.5, energy: -5,
        random: {
          chance: 0.6,
          good: { mood: 24, text: "You end up sitting cross-legged on a beanbag reading a nijntje book aloud to a delighted three-year-old you've never met, much to her parents' amusement." },
          bad: { mood: 11, text: "It's swamped with a school trip, and you spend most of the visit gently sidestepping toddlers. Still charming, just noisier than expected." },
        },
      },
      {
        id: 'statue', label: 'Snap a photo with the Miffy statue outside', time: 5, money: 0, energy: 0, mood: 3,
        text: "A small bronze nijntje sits patiently by the entrance, worn smooth on the ears from a decade of hands.",
      },
      {
        id: 'plein', label: 'Relax at Nijntje Pleintje (Miffy Square)', time: 25, money: 0, energy: 8, mood: 9,
        text: "A tiny public square just round the corner, dotted with Miffy-shaped benches and a low hedge maze. You sit on a bench shaped like an oversized nijntje ear and just watch the neighbourhood go by for a while — free, and quietly lovely.",
      },
    ],
  },
  {
    id: 'vredenburg', name: 'Vredenburg & Hoog Catharijne', cat: 'shopping', icon: '🧺', lat: 52.0919, lng: 5.1148,
    intro: "A wide market square backing onto one of Europe's largest indoor shopping centres — old stalls and glass atriums, side by side.",
    activities: [
      {
        id: 'market', label: 'Browse the market stalls', time: 30, money: 4, energy: 5, mood: 8,
        text: "You end up with a paper cone of fresh-cut fruit and a block of aged Gouda you definitely didn't plan on buying, from a vendor who insists you try three samples first.",
      },
      {
        id: 'shop', label: 'Duck into Hoog Catharijne for shopping', time: 40, money: 20, energy: -10, mood: 6,
        text: "You get pleasantly lost under the glass roof and come out with a small souvenir you'll probably regret packing.",
      },
    ],
  },
  {
    id: 'winkel', name: 'Winkel van Sinkel', cat: 'food', icon: '🍽️', lat: 52.0913, lng: 5.1197,
    intro: "A grand 19th-century department store turned café-restaurant-club, right on the canal, with a wharf-level cellar bar below street level.",
    activities: [
      {
        id: 'lunch', label: 'Canal-side lunch on the terrace', time: 50, money: 18, energy: 10, mood: 12,
        text: "Bitterballen and a beer, watching the wharf traffic go by below eye level — bikes and pedestrians up top, boats down at the water.",
      },
      {
        id: 'evening', label: 'Evening drinks & live music in the cellar', time: 70, money: 15, energy: -5, minMinutes: 540,
        random: {
          chance: 0.6,
          good: { mood: 30, text: "A local three-piece is playing in the vaulted cellar bar, and by the second set half the room is singing along to a song you don't know but somehow do." },
          bad: { mood: 14, text: "The band's on a break longer than the set itself, but the old brick cellar and the candlelight make up for the quiet." },
        },
      },
    ],
  },
  {
    id: 'botanic', name: 'Utrecht Botanic Gardens', cat: 'nature', icon: '🌿', lat: 52.0847, lng: 5.1467,
    intro: "A green sprawl of glasshouses and themed gardens on the university campus, a proper walk east of the centre — quieter, slower, worth the trip.",
    activities: [
      {
        id: 'wander', label: 'Wander the greenhouses and gardens', time: 60, money: 6, energy: 20, mood: 15,
        text: "The tropical greenhouse fogs up your glasses the second you step in. Outside, the rock garden is nearly empty, and you sit by the pond until your legs stop aching.",
      },
    ],
  },
  {
    id: 'railway', name: 'Spoorwegmuseum', cat: 'culture', icon: '🚂', lat: 52.0989, lng: 5.1181,
    intro: "The old Maliebaan station, now packed with a century of Dutch locomotives you're actively encouraged to climb into.",
    activities: [
      {
        id: 'trains', label: 'Explore the vintage trains', time: 75, money: 17.5, energy: -10, mood: 14,
        text: "You end up in the cab of a 1950s diesel loco pulling imaginary levers like a kid, while a projection show turns the old platform into a snowy mountain pass.",
      },
    ],
  },
  {
    id: 'neude', name: 'Neude Square', cat: 'food', icon: '🍸', lat: 52.0925, lng: 5.1199,
    intro: "By evening, this modern square — flanked by the old post office and a cluster of bars — turns into the liveliest patch of the city centre.",
    activities: [
      {
        id: 'barhop', label: 'Bar-hop around Neude square', time: 60, money: 15, energy: -10, minMinutes: 600,
        random: {
          chance: 0.65,
          good: { mood: 26, text: "You fall into conversation with a table of Utrecht locals who insist on teaching you the correct way to toast in Dutch, which takes three tries and a lot of laughing." },
          bad: { mood: 13, text: "Every terrace is packed and you spend twenty minutes just finding a stool, but the square's buzz is contagious once you do." },
        },
      },
      {
        id: 'library', label: 'Browse the library in the old post office', time: 35, money: 0, energy: 12, mood: 11,
        text: "Utrecht's main library lives inside the grand old PTT post office building — a soaring, light-filled hall under the original ironwork skylight. You sink into a reading chair with a book you can't actually check out and stay far longer than planned. Free, and one of the calmest half-hours of the day.",
      },
    ],
  },
];

export function findLocation(id) {
  return LOCATIONS.find((l) => l.id === id);
}
