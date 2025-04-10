const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(1)

async function main() {

    


const hashPass = bcrypt.hashSync('123123123', salt)

  await prisma.user.createMany({
    data: [
      { name: 'Ryan Panarigan', email: 'panariganpogi@gmail.com', password: hashPass},
      { name: 'Athan Sanchez', email: 'athan@gmail.com' , password: hashPass},
      { name: 'jeff Morate', email: 'jeff@gmail.com' , password: hashPass},
      { name: 'jm Ladores', email: 'jm@gmail.com' , password: hashPass},
      { name: 'Aries Apiña', email: 'aries@gmail.com' , password: hashPass},
      { name: 'Beth Beth', email: 'beth@gmail.com' , password: hashPass},
      { name: 'Jhanica Aciga', email: 'jhanica@gmail.com' , password: hashPass},
      { name: 'Michelle Guinez', email: 'michelle@gmail.com' , password: hashPass},
      { name: 'Lolinnie Eugenio', email: 'lolinnie@gmail.com' , password: hashPass},
      { name: 'Josh Lomeda', email: 'josh@gmail.com' , password: hashPass},
      { name: 'Lawrence Christian', email: 'lawrence@gmail.com' , password: hashPass},
    ],
  });
}

main()
  .then(() => console.log("Seeding complete"))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
