export const START = { lat: 52.0894, lng: 5.1098 };

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
    id: 'centraal', name: 'Utrecht Centraal', cat: 'transport', icon: '🚉', lat: 52.0894, lng: 5.1098,
    intro: "The station concourse hums with bikes wheeling past and the announcer's clipped Dutch. This is home base — you can always drift back here.",
    activities: [
      {
        id: 'coffee-togo', label: 'Grab a coffee to-go from the kiosk', time: 5, money: 3, energy: 10, mood: 1, meal: 'snack',
        text: "The kiosk coffee is bitter and a little burnt, but it's hot, and the woman behind the counter tosses in a free stroopwafel to balance it out.",
      },
      {
        id: 'moreelse', label: 'Walk out over the Moreelsebrug', time: 15, money: 0, energy: 0, mood: 3,
        text: "The pedestrian bridge over the platforms is three hundred metres of nothing but trains underneath you. Intercities pull out for Amsterdam every few minutes, and you stand there far longer than you meant to, like a nine-year-old.",
      },
      {
        id: 'breakfast', label: 'Proper breakfast before you start', time: 35, money: 10.5, energy: 20, mood: 3, meal: true,
        text: "Eggs, good bread and a pot of coffee at a table by the window, watching the 09:12 to Den Bosch fill up. It costs more than it should and sets you up for the entire day, which is roughly the deal everywhere.",
      },
      {
        id: 'wait', label: 'Sit on the platform and let the day pass', time: 30, money: 0, energy: 5, mood: 1, repeatable: true,
        text: "You take a bench under the departure boards and watch Utrecht work: the announcer, the trolley, the man sprinting for a train he was never going to catch. Not much of a day out, but it costs nothing at all.",
      },
    ],
  },
  {
    id: 'dom', name: 'Domplein & Dom Tower', cat: 'culture', icon: '🏰', lat: 52.0904, lng: 5.1217,
    intro: "The Dom Tower rises 112 metres over the square, the tallest church tower in the country, oddly disconnected from its own nave since a 1674 storm tore the middle of the church clean off.",
    activities: [
      {
        id: 'climb', label: 'Climb the 465 steps to the top', time: 75, money: 12.5, energy: -20,
        random: {
          chance: 0.7,
          good: { mood: 12, text: "The guide times it perfectly — you crest the final stairwell just as the haze burns off, and all of Utrecht opens out beneath you: red rooftops, the ring of canals, windmills on the horizon." },
          bad: { mood: 1, text: "Low cloud rolls in halfway up, and the view from the top is mostly grey soup. Still, there's something satisfying about the burn in your legs and the bell chamber's enormous, silent bells up close." },
        },
      },
      {
        id: 'watch', label: 'Sit on Domplein and people-watch', time: 20, money: 0, energy: 5, mood: 3,
        text: "You find a stone step in the sun. A street musician plays something half-recognisable on an accordion, and a wedding party spills out of the Dom's side door, laughing.",
      },
      {
        id: 'domunder', label: 'Go down into DOMunder', time: 60, money: 13.5, energy: -8, mood: 8,
        text: "A hatch in the middle of the square lets you down under it, torch in hand, into two thousand years of Utrecht in cross-section: a Roman fort wall, a medieval graveyard, and the rubble the 1674 storm left where the nave used to stand. You come back up into daylight slightly recalibrated.",
      },
      {
        id: 'walkingtour', label: 'Join the free walking tour', time: 105, money: 0, energy: -10, mood: 11,
        text: "A student with a yellow umbrella collects a dozen of you by the Dom and walks you through two hours of the city: the storm of 1674, why the wharfs are a storey down, which bridge the students throw each other off in September. It's free and it is emphatically not free — the hat comes round at the end, and you put something in it, because she was good.",
      },
    ],
  },
  {
    id: 'pieterskerk', name: 'Pieterskerk', cat: 'culture', icon: '⛪', lat: 52.0913, lng: 5.1244,
    intro: "Consecrated in 1048 and still standing in more or less its original shape — squat and romanesque, with red sandstone columns hauled up the Rhine and a crypt underneath that smells of cold stone. It is the oldest church in the country and one of the least visited things in the middle of Utrecht.",
    activities: [
      {
        id: 'visit', label: 'Go in and sit in the nave', time: 25, money: 3, energy: 5, mood: 5,
        text: "Whitewashed plain, the way Dutch churches were made plain, so what's left is proportion and light. Down in the crypt a single lamp burns over the tomb of the bishop who built the place, and after the noise of the Oudegracht the quiet arrives like a held breath.",
      },
      {
        id: 'concert', label: 'Chamber concert by candlelight', time: 90, money: 18, energy: -8, minMinutes: 600,
        random: {
          chance: 0.6,
          good: { mood: 12, text: "Four players, no microphones, nine hundred years of stone doing the amplification. Halfway through the slow movement somebody's phone goes off and even that sounds resonant. Nobody claps between movements, and you can hear the whole room deciding not to." },
          bad: { mood: 2, text: "The programme is heavier going than you'd hoped and the pews were built by people with strong opinions about comfort, but the candles, the columns and the last ten minutes make the case on their own." },
        },
      },
    ],
  },
  {
    id: 'speelklok', name: 'Museum Speelklok', cat: 'culture', icon: '🎼', lat: 52.0907, lng: 5.1194,
    intro: "Utrecht's oldest parish church, filled with machines built to play music by themselves: street organs, orchestrions, a violin-playing automaton, a clock that summons a small brass band. The whole point of the place is that they get wound up and set going, loudly, several times an hour.",
    activities: [
      {
        id: 'tour', label: 'Take the tour and let them wind everything up', time: 60, money: 17.5, energy: -5,
        random: {
          chance: 0.7,
          good: { mood: 11, text: "The guide saves the 1920s dance organ for last, sets it going, and the sound reaches you through the floor before it reaches your ears. A room full of strangers stands there grinning at each other like idiots." },
          bad: { mood: 2, text: "You arrive between tours and get the collection in near-silence, which is a peculiar way to meet machines built to make noise — though the automaton violinist is started up just for you, and plays a little worse than a person and much more unnervingly." },
        },
      },
      {
        id: 'pierement', label: 'Listen to the street organ out front', time: 10, money: 1, energy: 0, mood: 2,
        text: "A pierement is parked on the Steenweg with its painted shutters open, grinding out a waltz nobody asked for at a volume nobody can argue with. You put a euro in the tin and stay for all of it.",
      },
    ],
  },
  {
    id: 'hema', name: 'HEMA on the Steenweg', cat: 'food', icon: '🌭', lat: 52.0908, lng: 5.1172,
    intro: "The most Dutch building in the city centre isn't a church, it's this: the HEMA, where the entire country buys its socks and eats a sausage standing up on the way out.",
    activities: [
      {
        id: 'rookworst', label: 'Rookworst at the counter, standing up', time: 15, money: 3.5, energy: 12, mood: 5, meal: 'snack',
        text: "Smoked sausage in a paper napkin with a blob of mustard, eaten upright by the escalator with four other people doing exactly the same thing and none of them making eye contact. It costs almost nothing and is one of the better things you eat all day.",
      },
      {
        id: 'ontbijt', label: 'Sit down for the cheap breakfast deal', time: 30, money: 4.5, energy: 15, mood: 5, meal: true,
        text: "Egg, roll, orange juice and coffee for the price of a cocktail elsewhere, in a cafeteria full of people who have been coming here since it opened. A tompouce afterwards, because it's there and it's pink.",
      },
    ],
  },
  {
    id: 'sonnenborgh', name: 'Sonnenborgh Observatory', cat: 'culture', icon: '🔭', lat: 52.0853, lng: 5.1291,
    intro: "An observatory built on top of a 16th-century bastion, where Buys Ballot worked out that wind circles a low-pressure area rather than blowing straight at it — which is, more or less, where the weather forecast comes from.",
    activities: [
      {
        id: 'dome', label: 'Climb up to the dome and the old telescopes',
        time: 45, money: 12, energy: -5, mood: 6,
        text: "Brass and mahogany instruments, a dome that still turns by hand crank, and a view off the bastion over the rooftops. A volunteer explains the 1854 storm warning system to you for twenty minutes and you don't once want him to stop.",
      },
      {
        id: 'stars', label: 'Stay for the evening observing session', time: 75, money: 12, energy: -10, minMinutes: 660,
        random: {
          chance: 0.5,
          good: { mood: 13, text: "The sky holds. You get Saturn — actually Saturn, rings and all, small and sharp and slightly yellow — and then the Andromeda galaxy as a smudge you have to look slightly to one side of to see. The astronomer would clearly go on until dawn." },
          bad: { mood: -6, text: "Cloud, of course. The Dutch sky closes like a lid at nine and stays shut. You get the lecture, the coffee, a laser-pointer tour of where things would be, and a very good look at the inside of the dome." },
        },
      },
    ],
  },
  {
    id: 'academie', name: 'Academiegebouw & Pandhof', cat: 'culture', icon: '🏛️', lat: 52.0902, lng: 5.1223,
    intro: "The University Hall's great auditorium is the Dom's old chapter house, where the Union of Utrecht was signed in 1579 — one room, a handful of signatures, the rough beginnings of a republic. Through the arch beside it lies the Pandhof, the cathedral's walled cloister garden.",
    activities: [
      {
        id: 'pandhof', label: 'Sit in the Pandhof cloister garden', time: 20, money: 0, energy: 8, mood: 4,
        text: "Herb beds laid out in neat squares, gothic arcading on all four sides, a stone fountain in the middle and the Dom Tower leaning over the wall. Someone upstairs is practising the carillon, badly and then suddenly well, and you stay for all of it. Free, and the quietest place in the centre.",
      },
      {
        id: 'hall', label: 'Look inside the Academiegebouw', time: 25, money: 0, energy: -2,
        random: {
          chance: 0.55,
          good: { mood: 7, text: "A doctoral defence is letting out as you arrive: the pedel raps the floor with the mace, calls ‘Hora est’, and the whole room stands at once. Afterwards you get five minutes alone in the auditorium under the stained glass, before the next lot files in." },
          bad: { mood: 1, text: "It's roped off for a ceremony you are firmly not part of, so you get the entrance hall instead — marble stairs, dark wood, and a ceiling you spend an embarrassing amount of time looking straight up at." },
        },
      },
    ],
  },
  {
    id: 'oudegracht', name: 'Oudegracht Wharf', cat: 'food', icon: '☕', lat: 52.0898, lng: 5.1208,
    intro: "Utrecht's signature trick: the canal here runs a full storey below street level, with wharf cellars — once warehouses, now cafés — opening directly onto the water.",
    activities: [
      {
        id: 'terrace', label: 'Coffee & appeltaart on the wharf terrace', time: 40, money: 6.5, energy: 15, mood: 4, meal: 'snack',
        text: "You get a table right at the waterline. The appeltaart arrives with a small mountain of whipped cream, and a duck family paddles past close enough to touch.",
      },
      {
        id: 'boat', label: 'Rent a small sloep and take it for a spin', time: 60, money: 20, energy: -5,
        random: {
          chance: 0.65,
          good: { mood: 10, text: "You get the hang of the tiller almost immediately, gliding under low bridges as cyclists rumble overhead. It's the best twenty euros you've spent all trip." },
          bad: { mood: 1, text: "A sudden drizzle catches you halfway round the loop, and you spend the last twenty minutes steering one-handed while holding your jacket over your bag." },
        },
      },
      {
        id: 'dinner', label: 'Long dinner in a wharf cellar', time: 80, money: 28, energy: 5, minMinutes: 600, meal: true,
        random: {
          chance: 0.65,
          good: { mood: 11, text: "You get the table right at the cellar mouth, the candle keeps blowing out, and the kitchen sends out something with fennel you'd never have ordered on purpose. Boats go past at eye level in the dark." },
          bad: { mood: -2, text: "It's forty minutes between courses and the table next to you is a birthday party at full volume, but the brick vault, the water and the second glass of wine wear you down into enjoying it anyway." },
        },
      },
    ],
  },
  {
    id: 'muntkelder', name: 'De Oude Muntkelder', cat: 'food', icon: '🥞', lat: 52.0933, lng: 5.1172,
    intro: "A pancake restaurant down in a wharf cellar on the Oudegracht — and not just any cellar: this is where Utrecht's coins were struck in the Middle Ages, before the mint moved out west. You eat pannenkoeken in the mint.",
    activities: [
      {
        id: 'pancakes', label: 'Pannenkoeken in the old mint cellar', time: 60, money: 14, energy: 15, mood: 6, meal: true,
        text: "The pancake arrives overhanging the plate on all sides, with bacon and syrup because the waiter raised an eyebrow when you hesitated. Brick vaulting, a low door onto the water, and the faint sense of eating lunch inside a history lesson.",
      },
      {
        id: 'poffertjes', label: 'Just a plate of poffertjes', time: 25, money: 6.5, energy: 8, mood: 4, meal: 'snack',
        text: "Twelve small ones, butter and an unreasonable snowdrift of icing sugar, gone in about four minutes.",
      },
    ],
  },
  {
    id: 'mario', name: 'Broodje Mario', cat: 'food', icon: '🥪', lat: 52.0922, lng: 5.1171,
    intro: "A cash-only sandwich counter down a set of wharf steps on the Oudegracht, going since 1979 and famous out of all proportion to its size. There is no seating, there is barely a menu, and there is always a queue.",
    activities: [
      {
        id: 'broodje', label: 'Queue for a hot broodje Mario', time: 25, money: 4.5, energy: 18, mood: 5, meal: true,
        text: "You shuffle down into the cellar behind three students, a painter in spattered whites and one man in a very good suit, and order the hot one because everyone ahead of you did. It comes out foil-wrapped and heavy as a brick — ham, cheese and tomato sauce baked into the roll — and you eat it sitting on the wharf with your feet nearly in the canal. The sauce is on your sleeve within a minute.",
      },
      {
        id: 'second', label: 'Order a second one "for later"', time: 10, money: 4.5, energy: 8, mood: 3, meal: 'snack',
        text: "You tell yourself it's for the train home. It does not survive the walk to the next bridge.",
      },
    ],
  },
  {
    id: 'museum', name: 'Centraal Museum', cat: 'culture', icon: '🖼️', lat: 52.0836, lng: 5.1257,
    intro: "The Netherlands' oldest municipal museum, tucked into a former convent, with a wing devoted to Utrecht-born furniture radical Gerrit Rietveld.",
    activities: [
      {
        id: 'full', label: 'Buy a ticket and explore at leisure', time: 90, money: 15.5, energy: -10, mood: 8,
        text: "You lose track of time in the Rietveld room, staring at the primary-colour geometry of a chair that looks like it shouldn't be sittable, and somehow is.",
      },
      {
        id: 'garden', label: 'Peek at the free museum garden only', time: 15, money: 0, energy: 5, mood: 2,
        text: "You skip the ticket line and slip into the courtyard garden instead — a quiet square of clipped hedges and a single, enormous magnolia.",
      },
      {
        id: 'ship', label: 'Go and find the Utrecht ship', time: 35, money: 15.5, energy: -5, mood: 5,
        text: "A thousand-year-old flat-bottomed boat, dug out of the Vecht mud in 1930 and now lying in a cellar of the museum, black and improbably whole. Somebody hollowed that out with an axe while the Dom was still an idea.",
      },
    ],
  },
  {
    id: 'cinema', name: 'Louis Hartlooper Complex', cat: 'culture', icon: '🎬', lat: 52.0818, lng: 5.1242,
    intro: "The old police headquarters at the Tolsteegbrug, now an arthouse cinema: tiled corridors, a café in the charge room, and five screens where the cells and the stables used to be.",
    activities: [
      {
        id: 'film', label: 'Catch an evening film', time: 130, money: 12.5, energy: 5, minMinutes: 540,
        random: {
          chance: 0.65,
          good: { mood: 12, text: "Something Scandinavian and slow that you'd never have chosen at home, in a small warm room with thirty other people, all of whom stay through the credits. You come out into the dark by the canal still half inside it." },
          bad: { mood: -2, text: "The film is two hours of a man being sad in a beautiful apartment, and the subtitles are Dutch, so you spend the second half reconstructing the plot from faces. The building remains lovely." },
        },
      },
      {
        id: 'foyer', label: 'A drink in the old charge room', time: 35, money: 4.5, energy: 8, mood: 5, meal: 'snack',
        text: "Coffee under the original tiling, at a table where people were once booked in for public drunkenness. Somebody at the next table is explaining a screenplay to somebody who does not want to hear it.",
      },
    ],
  },
  {
    id: 'miffy', name: 'Nijntje (Miffy) Museum', cat: 'culture', icon: '🐰', lat: 52.0838, lng: 5.1258,
    intro: "Dick Bruna's tiny square-headed rabbit was born right here in Utrecht, and her museum sits directly across the street from the Centraal Museum. It is technically for children under six, which has never stopped anyone.",
    activities: [
      {
        id: 'inside', label: 'Relive childhood inside the museum', time: 45, money: 7.5, energy: -5,
        random: {
          chance: 0.6,
          good: { mood: 10, text: "You end up sitting cross-legged on a beanbag reading a nijntje book aloud to a delighted three-year-old you've never met, much to her parents' amusement." },
          bad: { mood: 1, text: "It's swamped with a school trip, and you spend most of the visit gently sidestepping toddlers. Still charming, just noisier than expected." },
        },
      },
      {
        id: 'shop', label: 'Give in to the museum shop', time: 10, money: 12.5, energy: 0, mood: 3,
        text: "You go in for a postcard and come out with an egg cup shaped like a rabbit's head, which you will have to explain to at least one adult at home.",
      },
    ],
  },
  {
    id: 'rietveld', name: 'Rietveld Schröderhuis', cat: 'culture', icon: '🏠', lat: 52.0853, lng: 5.1476,
    intro: "Rietveld built this in 1924 on the blunt end of an ordinary brick terrace, for Truus Schröder, who wanted an upstairs with no fixed rooms in it. It's on the UNESCO list, it is startlingly small, and it still looks like it landed here the day before yesterday.",
    activities: [
      {
        id: 'tour', label: 'Take the timed tour inside', time: 75, money: 19.5, energy: -5,
        random: {
          chance: 0.7,
          good: { mood: 13, text: "The guide slides the upstairs partitions away one by one until the entire floor is a single room with windows on every side, then folds it back into four again. You have never seen anyone so pleased to demonstrate a wall, and by the end neither have you." },
          bad: { mood: 2, text: "Your slot is full and you shuffle through the small rooms in a group of twelve, mostly looking at the backs of coats. Then they open the corner window — the one where the frame swings away and the corner simply stops existing — and it's worth the ticket on its own." },
        },
      },
      {
        id: 'outside', label: 'Look at it from the pavement', time: 15, money: 0, energy: 0, mood: 3,
        text: "You stand on the corner where the red, blue and yellow lines run out flat against the brown brick terrace next door, like a sentence that changes language halfway through. A woman walking her dog gives you the look reserved for people who photograph houses.",
      },
    ],
  },
  {
    id: 'wilhelminapark', name: 'Wilhelminapark', cat: 'nature', icon: '🌳', lat: 52.0883, lng: 5.1406,
    intro: "A proper 19th-century city park out past the singel: plane trees, a pond with a fountain, a bandstand, and on any warm afternoon half the neighbourhood lying on the grass in an arrangement that looks almost organised.",
    activities: [
      {
        id: 'grass', label: 'Lie on the grass by the pond', time: 30, money: 0, energy: 15, mood: 4,
        text: "You find a spot near the fountain and do nothing at all for half an hour. A heron works the pond edge with enormous professional patience, and two dogs conduct a long negotiation over a stick.",
      },
      {
        id: 'theehuis', label: 'Tea and cake at the park teahouse', time: 45, money: 9, energy: 10, mood: 5, meal: 'snack',
        text: "Tea in a proper pot and a slab of appeltaart, outside under the trees with the fountain going. The bill is a little more than you expected and you find you don't mind.",
      },
      {
        id: 'picnic', label: 'Supermarket picnic on the grass', time: 30, money: 5, energy: 12, mood: 6, meal: true,
        text: "A sandwich, a tub of salad and a bottle of something from the Albert Heijn on the way, eaten cross-legged on the grass for a fifth of what the teahouse charges. It is objectively the same lunch everyone around you is having.",
      },
    ],
  },
  {
    id: 'nijntjepleintje', name: 'Nijntje Pleintje', cat: 'culture', icon: '🐇', lat: 52.0963, lng: 5.1165,
    intro: "A pocket-sized square off the Breedstraat, right up at the north end of the old town and a solid twenty-five minutes' walk from the museum, which surprises almost everyone — laid out around Dick Bruna's rabbit: her own small bronze statue, benches at child height, and the neighbourhood's toddlers running the place.",
    activities: [
      {
        id: 'statue', label: 'Photograph the little bronze nijntje', time: 5, money: 0, energy: 0, mood: 2,
        text: "She's about knee-high and worn smooth on the ears from a decade of hands. You wait your turn behind two four-year-olds and their extremely patient father.",
      },
      {
        id: 'sit', label: 'Sit on the square for a while', time: 25, money: 0, energy: 8, mood: 4,
        text: "You take a bench and let the square happen around you: a delivery bike, a dropped ice cream and its swift emotional resolution, someone's grandmother conducting a very slow conversation across the paving. Free, and quietly lovely.",
      },
    ],
  },
  {
    id: 'vredenburg', name: 'Vredenburg & Hoog Catharijne', cat: 'shopping', icon: '🧺', lat: 52.092, lng: 5.1151,
    intro: "A wide market square backing onto one of Europe's largest indoor shopping centres — old stalls and glass atriums, side by side.",
    activities: [
      {
        id: 'market', label: 'Browse the market stalls', time: 30, money: 4, energy: 5, mood: 3, meal: 'snack',
        text: "You end up with a paper cone of fresh-cut fruit and a block of aged Gouda you definitely didn't plan on buying, from a vendor who insists you try three samples first.",
      },
      {
        id: 'samples', label: 'Work the cheese stall for samples', time: 20, money: 0, energy: 8, mood: 3, meal: 'snack',
        text: "Three cubes of increasingly old Gouda on cocktail sticks, a slice of something with cumin in it, and a long conversation about the correct age to buy at. You leave without paying for anything, which the man behind the counter seems to have entirely expected.",
      },
      {
        id: 'shop', label: 'Duck into Hoog Catharijne for shopping', time: 40, money: 20, energy: -10, mood: 3,
        text: "You get pleasantly lost under the glass roof and come out with a small souvenir you'll probably regret packing.",
      },
    ],
  },
  {
    id: 'lombok', name: 'Lombok & the Kanaalstraat', cat: 'food', icon: '🥘', lat: 52.0913, lng: 5.1007,
    intro: "Ten minutes west of the station the city changes register completely: the Kanaalstraat is Turkish and Moroccan greengrocers, bakeries with trays of börek in the window, a mosque between the terraced houses. Nothing on this street is priced for visitors.",
    activities: [
      {
        id: 'graze', label: 'Eat your way down the Kanaalstraat', time: 35, money: 6, energy: 15, mood: 5, meal: true,
        text: "Spinach börek from one counter, two enormous flatbreads and a bag of dates from the next, a kilo of apricots for less than a coffee costs in the centre. You end up on a bench by the water with more food than any one person should be carrying.",
      },
      {
        id: 'cay', label: 'Sit down for a glass of çay', time: 25, money: 2.5, energy: 8, mood: 3, meal: 'snack',
        text: "Mostly older men, a match on a screen bolted high in the corner, and nobody minding in the slightest that you're there. The tea comes in a tulip glass too hot to pick up for the first two minutes, and costs about as much as nothing.",
      },
    ],
  },
  {
    id: 'jaarbeurs', name: 'Jaarbeurs', cat: 'culture', icon: '🎪', lat: 52.0902, lng: 5.1062,
    intro: "The country's biggest exhibition halls, straight out the back of the station: a wall of grey sheds where the whole of the Netherlands comes to buy caravans, look at model trains or get married, depending on the weekend.",
    activities: [
      {
        id: 'whatson', label: "Buy a ticket to whatever's on today", time: 90, money: 12, energy: -8,
        random: {
          chance: 0.55,
          good: { mood: 11, text: "It turns out to be the model railway fair, and it is enormous — three halls of hand-built Dutch villages with working level crossings, run by men who have waited all year to explain them to somebody. One of them lets you drive." },
          bad: { mood: -3, text: "It turns out to be a caravan and camping fair. You walk through four halls of identical interiors being admired by people twice your age, buy a coffee out of politeness, and leave." },
        },
      },
      {
        id: 'beatrix', label: 'A show at the Beatrix Theater', time: 150, money: 45, energy: -10, minMinutes: 570,
        random: {
          chance: 0.7,
          good: { mood: 14, text: "Full orchestra, a set that rebuilds itself twice, and the kind of touring production that fills two thousand seats and deserves to. You come out onto Jaarbeursplein at half eleven humming something you'll be humming on the train." },
          bad: { mood: 2, text: "The seats are high and to the side, the sound is a shade muddy up there, and the interval drink costs what dinner would in Lombok. Grand, but you saw it from a long way off." },
        },
      },
    ],
  },
  {
    id: 'oogindal', name: 'Oog in Al & the old Mint', cat: 'nature', icon: '🪙', lat: 52.0872, lng: 5.0967,
    intro: "West of Lombok the canal opens out and the city goes quiet. This is 's Rijks Munt on the Leidseweg — the national mint, where every Dutch coin was struck for most of the last century — reached by a towpath walk along the Leidse Rijn, with Park Oog in Al a few minutes further on.",
    activities: [
      {
        id: 'muntwalk', label: 'Walk the towpath to the Muntgebouw', time: 50, money: 0, energy: -5, mood: 8,
        text: "Water on one side, gardens on the other, and then the Mint: a long brick building with MUNT over the door, where guilders came out by the million and now nothing does. You stand looking at it for a while, thinking about the pancake cellar in town where the same job was done by hand six hundred years ago.",
      },
      {
        id: 'park', label: 'Sit in Park Oog in Al', time: 30, money: 0, energy: 12, mood: 6,
        text: "A country estate the city grew around and then politely left alone: a rose garden gone slightly wild, enormous trees, and a bench where the only traffic is a man teaching a small child to ride a bike, at length, with commentary.",
      },
    ],
  },
  {
    id: 'tivoli', name: 'TivoliVredenburg', cat: 'culture', icon: '🎵', lat: 52.0925, lng: 5.1128,
    intro: "Five concert halls stacked on top of one another in a single block by the station: the old Vredenburg hall wrapped in four new ones, so a symphony, a jazz trio and a metal band can be going at the same moment on different floors and none of them hear each other.",
    activities: [
      {
        id: 'grotezaal', label: 'Evening concert in the Grote Zaal', time: 120, money: 25, energy: -12, minMinutes: 600,
        random: {
          chance: 0.6,
          good: { mood: 13, text: "You're in the big hall, where the acoustics are good enough that you can hear the double bass player breathing between phrases. You come out onto Vredenburg at half eleven still slightly elsewhere." },
          bad: { mood: 1, text: "A cheap seat behind a pillar for a band you half know, and you spend the first set craning. The building goes some way to making up for it — a concrete stack of foyers with the city glittering through the glass." },
        },
      },
      {
        id: 'lunchconcert', label: 'Catch the free lunchtime concert', time: 45, money: 0, energy: 5, mood: 6,
        minMinutes: 150, maxMinutes: 300,
        text: "Free at half twelve, no ticket, no fuss: a conservatoire trio in one of the smaller halls playing to eighty people, half of whom are eating a sandwich out of a paper bag. Utrecht at its most quietly civilised.",
      },
    ],
  },
  {
    id: 'schouwburg', name: 'Stadsschouwburg Utrecht', cat: 'culture', icon: '🎭', lat: 52.0934, lng: 5.1275,
    intro: "Dudok's 1941 theatre on the Lucasbolwerk — a long low brick thing with a marble foyer and a great rake of steps, still the city's main stage for touring theatre, dance, and the cabaret nights that sell out in an hour.",
    activities: [
      {
        id: 'show', label: 'An evening at the theatre', time: 150, money: 32, energy: -10, minMinutes: 570,
        random: {
          chance: 0.65,
          good: { mood: 13, text: "Dutch theatre played fast and loud, and you follow more of it than you expect to — the physical half needs no translation at all, and the woman beside you translates the jokes in a stage whisper you come to depend on." },
          bad: { mood: 0, text: "Two hours of dialogue in a language you have maybe forty words of. You spend the second half studying Dudok's ceiling, which is at least worth studying, and leave at the interval-that-wasn't feeling like a fraud." },
        },
      },
      {
        id: 'foyer', label: 'Look round the foyer and the steps', time: 20, money: 0, energy: 0, mood: 4,
        text: "You wander in as if you belong there. Marble, brass handrails, and a wall of glass looking back over the Lucasbolwerk — 1941 municipal confidence, built while the country was occupied, which is a strange thing to stand in.",
      },
    ],
  },
  {
    id: 'winkel', name: 'Winkel van Sinkel', cat: 'food', icon: '🍽️', lat: 52.0919, lng: 5.1187,
    intro: "A grand 19th-century department store turned café-restaurant-club, right on the canal, with a wharf-level cellar bar below street level. The four cast-iron caryatids on the façade arrived from England by ship in 1839 and promptly fell through the quay while being unloaded.",
    activities: [
      {
        id: 'lunch', label: 'Canal-side lunch on the terrace', time: 50, money: 18, energy: 10, mood: 5, meal: true,
        text: "Bitterballen and a beer, watching the wharf traffic go by below eye level — bikes and pedestrians up top, boats down at the water.",
      },
      {
        id: 'evening', label: 'Evening drinks & live music in the cellar', time: 70, money: 15, energy: -5, minMinutes: 540, meal: 'snack',
        random: {
          chance: 0.6,
          good: { mood: 13, text: "A local three-piece is playing in the vaulted cellar bar, and by the second set half the room is singing along to a song you don't know but somehow do." },
          bad: { mood: 2, text: "The band's on a break longer than the set itself, but the old brick cellar and the candlelight make up for the quiet." },
        },
      },
      {
        id: 'dinner', label: 'Dinner in the grand hall', time: 95, money: 42, energy: 10, minMinutes: 510, meal: true,
        random: {
          chance: 0.65,
          good: { mood: 13, text: "Three courses under the chandeliers of what was once the country's grandest shop, at a table by a window two storeys tall. It costs about what you'd expect and is worth every cent of it — the waiter is genuinely delighted you asked about the caryatids." },
          bad: { mood: -5, text: "The room is magnificent and the kitchen is having an average evening: the main arrives lukewarm and the bill does not reflect that. Still, you ate dinner in a 19th-century department store, which is not nothing." },
        },
      },
    ],
  },
  {
    id: 'railway', name: 'Spoorwegmuseum', cat: 'culture', icon: '🚂', lat: 52.0877, lng: 5.132,
    intro: "The old Maliebaan station, now packed with a century of Dutch locomotives you're actively encouraged to climb into.",
    activities: [
      {
        id: 'trains', label: 'Explore the vintage trains', time: 75, money: 17.5, energy: -10, mood: 6,
        text: "You end up in the cab of a 1950s diesel loco pulling imaginary levers like a kid, while a projection show turns the old platform into a snowy mountain pass.",
      },
      {
        id: 'maliebaan', label: 'Walk the Maliebaan back into town', time: 30, money: 0, energy: -5, mood: 3,
        text: "The Maliebaan was laid out in 1637 as a court for a mallet game nobody has played here in centuries, which is why it runs dead straight, twice as wide as it needs to be, under four rows of lime trees. Grand houses on both sides, and almost nobody on it.",
      },
    ],
  },
  {
    id: 'neude', name: 'Neude Square', cat: 'food', icon: '🍸', lat: 52.0932, lng: 5.1186,
    intro: "By evening, this modern square — flanked by the old post office and a cluster of bars — turns into the liveliest patch of the city centre.",
    activities: [
      {
        id: 'barhop', label: 'Bar-hop around Neude square', time: 60, money: 15, energy: -10, minMinutes: 600, meal: 'snack',
        random: {
          chance: 0.65,
          good: { mood: 11, text: "You fall into conversation with a table of Utrecht locals who insist on teaching you the correct way to toast in Dutch, which takes three tries and a lot of laughing." },
          bad: { mood: 2, text: "Every terrace is packed and you spend twenty minutes just finding a stool, but the square's buzz is contagious once you do." },
        },
      },
      {
        id: 'library', label: 'Browse the library in the old post office', time: 35, money: 0, energy: 12, mood: 5,
        text: "Utrecht's main library lives inside the grand old PTT post office building — a soaring, light-filled hall under the original ironwork skylight. You sink into a reading chair with a book you can't actually check out and stay far longer than planned. Free, and one of the calmest half-hours of the day.",
      },
      {
        id: 'nightwalk', label: 'Loop the lit canal on the way back', time: 40, money: 0, energy: -5, mood: 5, minMinutes: 660,
        text: "The wharf cellars throw their light out flat across the water, the bridges pick up the Dom floodlit behind you, and the whole canal turns into the thing on the postcard. A rowing eight goes past in the dark with a cox shouting, which is somehow the best part.",
      },
    ],
  },
  {
    id: 'campus', name: 'Utrecht Science Park', cat: 'culture', icon: '🎓', lat: 52.0859, lng: 5.1721,
    intro: "In the 1960s the university gave up on squeezing into the old centre and moved out to a polder east of town, then let a generation of architects loose on it: Koolhaas's Educatorium, the Minnaert building with its rusted skin, Wiel Arets' black glass library. It's a long walk out — the locals take the tram — and it feels like a different city when you arrive.",
    activities: [
      {
        id: 'architecture', label: 'Walk the campus architecture loop', time: 55, money: 0, energy: -12, mood: 9,
        text: "Up the Educatorium's great concrete ramp, past MINNAERT spelled out in letters the size of a car, into a hall where rain off the roof collects in a long shallow pool that students work beside as if it were completely normal. The library's glass is printed with a forest, so the reading rooms are full of leaf shadows.",
      },
      {
        id: 'library', label: 'Read a while in the university library', time: 40, money: 3.5, energy: 12, mood: 5, meal: 'snack',
        text: "You buy a coffee, find a chair among a few hundred students revising in total silence, and read for half an hour. Nobody once asks who you are or what you're doing there.",
      },
      {
        id: 'mensa', label: 'Cheap lunch in a student canteen', time: 30, money: 7, energy: 15, mood: 4, meal: true,
        text: "Lunch on a plastic tray at a long table, next to two people having a very intense argument about a supervisor. It costs almost nothing and you leave suspiciously full.",
      },
    ],
  },
  {
    id: 'botanic', name: 'Utrecht Botanic Gardens', cat: 'nature', icon: '🌿', lat: 52.0848, lng: 5.1676,
    intro: "Glasshouses and themed gardens wrapped around Fort Hoofddijk, a small 19th-century waterline fort at the near edge of the Science Park — the same trek east as the campus, and best paired with it.",
    activities: [
      {
        id: 'wander', label: 'Wander the greenhouses and gardens', time: 60, money: 6, energy: 20, mood: 8,
        text: "The tropical greenhouse fogs up your glasses the second you step in. Outside, the rock garden grows straight out of the old fort's earth ramparts, nearly empty, and you sit by the pond until your legs stop aching.",
      },
      {
        id: 'fort', label: 'Climb over Fort Hoofddijk', time: 25, money: 6, energy: 0, mood: 4,
        text: "The gardens grew up around a small waterline fort — earth banks, a brick guardhouse, gun emplacements now planted with ferns and alpines. You can walk over the roof of the thing, which is either a lovely idea or a slightly rude one, depending on how you feel about forts.",
      },
    ],
  },
];

export function findLocation(id) {
  return LOCATIONS.find((l) => l.id === id);
}
