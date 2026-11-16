import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash('Rescue@123', 10);
  const admin = await prisma.user.upsert({ where: { email: 'admin@floodrescue.demo' }, update: {}, create: { name: 'Control Room Admin', email: 'admin@floodrescue.demo', passwordHash, role: 'ADMIN' } });
  const citizen = await prisma.user.upsert({ where: { email: 'citizen@floodrescue.demo' }, update: {}, create: { name: 'Demo Citizen', email: 'citizen@floodrescue.demo', passwordHash, role: 'CITIZEN' } });
  if (await prisma.rescueRequest.count() === 0) {
    const samples = [
      ['Riya Das','9876543210',4,'MEDICAL','An elderly person needs urgent medical assistance.',28.6139,77.2090,'Central Delhi','CRITICAL'],
      ['Aman Verma','9876543211',6,'TRAPPED','Family stranded on the first floor.',28.6200,77.2150,'Civil Lines','CRITICAL'],
      ['Sara Khan','9876543212',3,'FOOD_WATER','No drinking water for 12 hours.',28.6080,77.2020,'ITO Area','HIGH'],
      ['Rahul Sen','9876543213',2,'EVACUATION','Water level is rising rapidly.',28.6350,77.2250,'Kashmere Gate','HIGH'],
      ['Mina Roy','9876543214',5,'MEDICAL','One person has an injury.',28.6400,77.2300,'Majnu Ka Tila','MEDIUM']
    ] as const;
    for (const s of samples) await prisma.rescueRequest.create({ data: { name:s[0], phone:s[1], peopleCount:s[2], emergencyType:s[3], description:s[4], latitude:s[5], longitude:s[6], address:s[7], severity:s[8], userId:citizen.id } });
  }
  if (await prisma.resource.count() === 0) await prisma.resource.createMany({ data: [
    {name:'Rescue Boat Team A',type:'BOAT',quantity:5,available:3,location:'Central Rescue Station'},
    {name:'Medical Response Unit',type:'MEDICAL',quantity:4,available:2,location:'District Hospital'},
    {name:'Food & Water Kits',type:'SUPPLIES',quantity:300,available:185,location:'Relief Warehouse'},
    {name:'Evacuation Vehicles',type:'VEHICLE',quantity:8,available:5,location:'North Depot'}
  ] });
  console.log('Seed complete. Admin:', admin.email);
}
main().finally(() => prisma.$disconnect());
