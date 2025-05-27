import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const parishes = [
  // Domyślna parafia dla testów płatności
  {
    name: "Parafia Testowa Taca.pl",
    address: "ul. Testowa 1",
    city: "Wrocław",
    zipCode: "00-000",
    latitude: 51.1079,
    longitude: 17.0385,
    phone: "+48 000 000 000",
    email: "test@taca.pl",
    website: "https://taca.pl",
    description: "Parafia testowa dla systemu płatności Taca.pl",
    pastor: "ks. Test Testowy",
    massSchedule: "Testowe: 10:00",
    uniqueSlug: "parafia-testowa-taca-pl"
  },
  {
    name: "Parafia św. Eliziety",
    address: "ul. św. Antoniego 26",
    city: "Wrocław",
    zipCode: "50-073",
    latitude: 51.1095,
    longitude: 17.0347,
    phone: "(71) 344 23 56",
    email: "parafiasweliziety@wp.pl",
    website: "https://swieta-elzbieta.pl",
    description: "Gotycki kościół z XIV wieku, jeden z najstarszych we Wrocławiu",
    pastor: "ks. dr Wojciech Kaczmarek",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 10:00, 12:00, 18:00"
  },
  {
    name: "Parafia św. Mikołaja",
    address: "ul. św. Mikołaja 1-2",
    city: "Wrocław", 
    zipCode: "50-127",
    latitude: 51.1109,
    longitude: 17.0304,
    phone: "(71) 344 15 96",
    email: "biuro@swmikolaj.pl",
    website: "https://swmikolaj.pl",
    description: "Najstarsza parafia we Wrocławiu, gotycki kościół z XIII wieku",
    pastor: "ks. kan. Stanisław Zyguła",
    massSchedule: "Dni powszednie: 7:00, 8:00, 18:00\nNiedziela: 7:00, 8:30, 10:00, 11:30, 18:00"
  },
  {
    name: "Parafia Najświętszego Serca Pana Jezusa",
    address: "pl. Nankiera 15",
    city: "Wrocław",
    zipCode: "50-140",
    latitude: 51.1148,
    longitude: 17.0369,
    phone: "(71) 344 47 20",
    email: "kancelaria@nsj.pl",
    website: "https://nsj.pl",
    description: "Neogotycka świątynia z początku XX wieku",
    pastor: "ks. dr Dariusz Kwiatkowski",
    massSchedule: "Dni powszednie: 6:30, 7:00, 18:00\nNiedziela: 7:00, 8:30, 10:00, 11:30, 17:00, 18:30"
  },
  {
    name: "Parafia św. Wincentego à Paulo",
    address: "ul. Czerwonego Krzyża 5",
    city: "Wrocław",
    zipCode: "50-345",
    latitude: 51.1088,
    longitude: 17.0486,
    phone: "(71) 343 67 89",
    email: "kancelaria@swwincenty.pl",
    website: "https://swwincenty.pl",
    description: "Kościół neogotycki z końca XIX wieku",
    pastor: "ks. Tadeusz Michalik",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 9:30, 11:00, 12:30, 18:00"
  },
  {
    name: "Parafia św. Maurycego",
    address: "ul. Kotlarska 41",
    city: "Wrocław",
    zipCode: "50-120",
    latitude: 51.1135,
    longitude: 17.0260,
    phone: "(71) 344 18 42",
    email: "parafia@swmaurycy.pl",
    website: "https://swmaurycy.pl",
    description: "Kościół gotycki z XIV wieku z cenną polichromią",
    pastor: "ks. Paweł Skoczylas",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 10:00, 12:00, 18:00"
  },
  {
    name: "Parafia św. Macieja",
    address: "ul. Psie Budy 10",
    city: "Wrocław",
    zipCode: "50-080",
    latitude: 51.1120,
    longitude: 17.0380,
    phone: "(71) 344 23 78",
    email: "biuro@swmaciej.pl",
    website: "https://swmaciej.pl",
    description: "Gotycka świątynia z XIV wieku z renesansowym ołtarzem",
    pastor: "ks. Krzysztof Nowak",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 10:00, 11:30, 18:00"
  },
  {
    name: "Parafia św. Krzyża",
    address: "pl. św. Macieja 3",
    city: "Wrocław",
    zipCode: "50-244",
    latitude: 51.1070,
    longitude: 17.0290,
    phone: "(71) 344 12 34",
    email: "kancelaria@swkrzyz.pl",
    website: "https://swkrzyz.pl",
    description: "Gotycki kościół z XIV wieku z barokowym wnętrzem",
    pastor: "ks. Andrzej Kowalski",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 9:30, 11:00, 12:30, 18:00"
  },
  {
    name: "Parafia Matki Bożej na Piasku",
    address: "ul. Na Piasku 9",
    city: "Wrocław",
    zipCode: "50-353",
    latitude: 51.1055,
    longitude: 17.0440,
    phone: "(71) 322 23 56",
    email: "kancelaria@mbnapisku.pl",
    website: "https://mbnapisku.pl",
    description: "Gotycka świątynia z XIV wieku na Ostrowie Tumskim",
    pastor: "ks. Robert Jankowski",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 10:00, 12:00, 18:00"
  },
  {
    name: "Parafia św. Piotra i Pawła",
    address: "ul. Katedralna 10",
    city: "Wrocław",
    zipCode: "50-329",
    latitude: 51.1040,
    longitude: 17.0470,
    phone: "(71) 322 25 74",
    email: "biuro@katedra.pl",
    website: "https://katedra.pl",
    description: "Gotycka katedra z XIV wieku, główna świątynia archidiecezji",
    pastor: "ks. kan. Marek Kosicki",
    massSchedule: "Dni powszednie: 7:00, 8:00, 18:00\nNiedziela: 7:00, 8:30, 10:00, 11:30, 17:00, 18:30"
  },
  {
    name: "Parafia św. Jadwigi",
    address: "ul. Jadwigi 1",
    city: "Wrocław",
    zipCode: "50-266",
    latitude: 51.1080,
    longitude: 17.0200,
    phone: "(71) 344 56 78",
    email: "kancelaria@swjadwiga.pl",
    website: "https://swjadwiga.pl",
    description: "Neogotycki kościół z początku XX wieku",
    pastor: "ks. Tomasz Lewandowski",
    massSchedule: "Dni powszednie: 7:00, 18:00\nNiedziela: 8:00, 9:30, 11:00, 12:30, 18:00"
  }
];

const fundraisingGoals = [
  {
    title: "Remont dachu kościoła",
    description: "Pilny remont dachu kościoła św. Eliziety - przecieka w kilku miejscach",
    targetAmount: 85000,
    currentAmount: 23500,
    deadline: new Date('2024-12-31'),
    parishIndex: 0
  },
  {
    title: "Renowacja organów",
    description: "Historyczne organy z XVIII wieku wymagają gruntownej renowacji",
    targetAmount: 120000,
    currentAmount: 45200,
    deadline: new Date('2025-06-30'),
    parishIndex: 1
  },
  {
    title: "Remont świetlicy parafialnej",
    description: "Modernizacja świetlicy dla dzieci i młodzieży",
    targetAmount: 35000,
    currentAmount: 18750,
    deadline: new Date('2024-09-30'),
    parishIndex: 2
  },
  {
    title: "Nowy system grzewczy",
    description: "Wymiana starego systemu grzewczego na ekologiczny",
    targetAmount: 95000,
    currentAmount: 12300,
    deadline: new Date('2024-11-30'),
    parishIndex: 3
  },
  {
    title: "Konserwacja fresków",
    description: "Profesjonalna konserwacja średniowiecznych fresków",
    targetAmount: 75000,
    currentAmount: 31500,
    deadline: new Date('2025-03-31'),
    parishIndex: 4
  }
];

async function main() {
  console.log('Seeding database...');

  // Create parishes
  const createdParishes = [];
  for (const parishData of parishes) {
    const parish = await prisma.parish.create({
      data: parishData
    });
    createdParishes.push(parish);
    console.log(`Created parish: ${parish.name}`);
  }

  // Create fundraising goals
  for (const goalData of fundraisingGoals) {
    const { parishIndex, ...goalWithoutIndex } = goalData;
    const goal = await prisma.fundraisingGoal.create({
      data: {
        ...goalWithoutIndex,
        parishId: createdParishes[parishIndex].id
      }
    });
    console.log(`Created fundraising goal: ${goal.title} for ${createdParishes[parishIndex].name}`);
  }

  // Create some sample payments
  for (let i = 0; i < 20; i++) {
    const randomParish = createdParishes[Math.floor(Math.random() * createdParishes.length)];
    const amount = Math.floor(Math.random() * 1000) + 50; // 50-1050 PLN
    
    await prisma.payment.create({
      data: {
        amount,
        donorName: Math.random() > 0.3 ? `Darczyńca ${i + 1}` : null,
        donorEmail: Math.random() > 0.5 ? `donor${i + 1}@example.com` : null,
        message: Math.random() > 0.7 ? "Dzięki za Waszą pracę!" : null,
        isAnonymous: Math.random() > 0.7,
        status: 'COMPLETED',
        paymentMethod: Math.random() > 0.5 ? 'CARD' : 'TRANSFER',
        parishId: randomParish.id
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
