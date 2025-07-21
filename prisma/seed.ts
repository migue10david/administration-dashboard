// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Transacción para eliminar usuarios
  await prisma.$transaction(async (tx) => {
    await tx.systemSetting.deleteMany();
    await tx.user.deleteMany();
    await tx.account.deleteMany();
    await tx.session.deleteMany();
    await tx.country.deleteMany();
    await tx.state.deleteMany();
    await tx.city.deleteMany();
    await tx.customer.deleteMany();
    await tx.checkTransactionType.deleteMany();
    await tx.checkTransaction.deleteMany();
    await tx.company.deleteMany();
    await tx.wireTransfer.deleteMany();
  });

  // Aquí puedes añadir más transacciones o operaciones
  // Por ejemplo:
  await prisma.$transaction(async (tx) => {
    // Operaciones dentro de la transacción
   
    const user = await tx.user.create({
      data: {
        name: 'Miguel',
        email: 'miguel@example.com', 
        password: await bcrypt.hash("123456", 10),
        role: 'ADMIN',
      },
    });

    const country =await tx.country.create({
      data: {
        name: 'Mexico',
        code: 'MX',
        createdById: user.id,
      },
    });
  
    const state = await tx.state.create({
      data: {
        name: 'Jalisco',
        code: 'JAL',
        countryId: country.id,
        createdById: user.id,
      },
    });

    const city = await tx.city.create({
      data: {
        name: 'Guadalajara',
        code: 'GUA',
        stateId: state.id,
        createdById: user.id,
      },
    });

    await tx.systemSetting.create({
      data: {
        name: 'My Company',
        code: '1001',
        zipCode: '10300',
        numCustomerPercentRate: 0.5,
        customerPercentRate: 1.00,
        moneyOrderFeed: 0.49,
        maxBankDepositLimit: 100,
        minimunAge: 5,
        cityId: city.id,
        stateId: state.id,
      },
    });

    await tx.company.createMany({
      data: [
        {
          name: 'Wire',
          description: 'Wire Transfer',
          createdById: user.id,
        },
        {
          name: 'Vigo',
          description: 'Banco Vigo',
          createdById: user.id,
        },
        {
          name: 'WesterUnion',
          description: 'Compañia WesterUnion',
          createdById: user.id,
        },
      ],
    });

    await tx.customer.createMany({
      data: [
        {
          code: '8938',
          firstName: 'Antonio',
          middleName: 'Jose',
          lastNameOne: 'Perez',
          lastNameTwo: 'Sanchez',
          address: 'Calle 123',
          apartment: '23',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10300',
          phone: '1001001001',
          dob: new Date('1990-01-01'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'CUSTOMER',
          notes: '',
        },
        {
          code: '8939',
          firstName: 'Juan',
          middleName: 'Carlos',
          lastNameOne: 'Rodriguez',
          lastNameTwo: 'Diaz',
          address: 'Calle 19',
          apartment: '32',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10300',
          phone: '1001001002',
          dob: new Date('1990-01-02'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'CUSTOMER',
          notes: '',
        },
        {
          code: '8940',
          firstName: 'Maria',
          middleName: 'Teresa',
          lastNameOne: 'Gonzalez',
          lastNameTwo: 'Perez',
          address: 'Calle 31',
          apartment: '33',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10400',
          phone: '1001001003',
          dob: new Date('1990-01-03'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'CUSTOMER',
          notes: '',
        },
        {
          code: '8950',
          firstName: 'Javier',
          middleName: '',
          lastNameOne: 'Maroto',
          lastNameTwo: 'Pacheco',
          address: 'Calle 44',
          apartment: '53',
          countryId: country.id,
          stateId: state.id,
          cityId: city.id,
          zipCode: '10300',
          phone: '1001001005',
          dob: new Date('1990-01-05'),
          ssn: '123456789',
          dlid: '123456789',
          imageUrl: '',
          percentage: 0,
          createdById: user.id,
          type: 'RECIPIENT',
          notes: '',
        }

      ],
    });

    await tx.checkTransactionType.createMany({
      data: [
        {
          name: "Cash Check",
          description: "Cash Check",
          createdById: user.id,
          percentage: 0.5    //5%
        },
        {
          name: "Money Order",
          description: "Money Order",
          createdById: user.id,
          percentage: 0.49    //0.49
        }
      ]
    })

    const customer = await tx.customer.findMany();
    const checkTransactionType = await tx.checkTransactionType.findFirst();

    if (customer.length && checkTransactionType) {

      await tx.checkTransaction.createMany({
        data: [
          {
            customerId: customer[0].id,
            checkTransactionTypeId: checkTransactionType.id,
            number: "10001",
            amount: 1000,
            feed: 100,
            createdById: user.id
          },
          {
            customerId: customer[0].id,
            checkTransactionTypeId: checkTransactionType.id,
            number: "10002",
            amount: 2000,
            feed: 200,
            createdById: user.id
          },
          {
            customerId: customer[0].id,
            checkTransactionTypeId: checkTransactionType.id,
            number: "10003",
            amount: 3000,
            feed: 300,
            createdById: user.id
          }
        ]
      })

    }

    const company = await tx.company.findFirst();

    if (company && customer) {
      await tx.wireTransfer.createMany({
        data: [
          {
            customerId: customer[0].id,
            recipientId: customer[3].id,
            companyId: company.id,
            amount: 1000,
            feed: 100,
            createdById: user.id
          },
          {
            customerId: customer[0].id,
            recipientId: customer[3].id,
            companyId: company.id,
            amount: 500,
            feed: 50,
            createdById: user.id
          }
        ]
      });
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });