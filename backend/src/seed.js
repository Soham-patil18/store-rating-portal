import { sequelize, User, Store, Rating } from './models/index.js';

export const seedInitialData = async (force = false) => {
  try {
    if (force) {
      await sequelize.sync({ force: true });
    } else {
      await sequelize.sync();
      const count = await User.count();
      if (count > 0) {
        return; // Already populated
      }
    }

    console.log('Seeding demo users...');
    const admin = await User.create({
      name: 'System Administrator User Account', // 33 chars
      email: 'admin@storerating.com',
      password: 'Admin@123',
      address: 'Suite 100, 742 Evergreen Terrace, Springfield, OR',
      role: 'admin',
    });

    const owner1 = await User.create({
      name: 'Michael Christopher Davies III', // 32 chars
      email: 'michael.davies@stores.com',
      password: 'Owner@123',
      address: '450 North Michigan Avenue, Chicago, IL 60611',
      role: 'owner',
    });

    const owner2 = await User.create({
      name: 'Katherine Elizabeth Smith Watson', // 33 chars
      email: 'katherine.smith@stores.com',
      password: 'Owner@123',
      address: '880 Market Street, San Francisco, CA 94102',
      role: 'owner',
    });

    const user1 = await User.create({
      name: 'Johnathan Alexander Doe Senior', // 31 chars
      email: 'johnathan.doe@example.com',
      password: 'User@123',
      address: '123 Pleasant Valley Road, Austin, TX 78701',
      role: 'normal',
    });

    const user2 = await User.create({
      name: 'Eleanor Samantha Vance Johnson', // 32 chars
      email: 'eleanor.vance@example.com',
      password: 'User@123',
      address: '567 Maple Blossom Avenue, Seattle, WA 98101',
      role: 'normal',
    });

    const user3 = await User.create({
      name: 'Robert Benjamin Franklin Junior', // 32 chars
      email: 'robert.franklin@example.com',
      password: 'User@123',
      address: '789 Chestnut Ridge Blvd, Denver, CO 80202',
      role: 'normal',
    });

    console.log('Seeding demo stores...');
    const store1 = await Store.create({
      name: 'Artisan Coffee Roasters & Bakery',
      email: 'contact@artisancoffee.com',
      address: '450 North Michigan Avenue, Chicago, IL 60611',
      ownerId: owner1.id,
    });

    const store2 = await Store.create({
      name: 'Bay Area Organic Grocery Mart',
      email: 'hello@bayareagrocery.com',
      address: '880 Market Street, San Francisco, CA 94102',
      ownerId: owner2.id,
    });

    const store3 = await Store.create({
      name: 'Downtown Tech Gadgets & Books',
      email: 'support@downtowntech.com',
      address: '1010 Silicon Boulevard, San Jose, CA 95110',
      ownerId: null,
    });

    console.log('Seeding demo ratings...');
    await Rating.create({ userId: user1.id, storeId: store1.id, rating: 5 });
    await Rating.create({ userId: user1.id, storeId: store2.id, rating: 4 });
    await Rating.create({ userId: user2.id, storeId: store1.id, rating: 4 });
    await Rating.create({ userId: user2.id, storeId: store2.id, rating: 5 });
    await Rating.create({ userId: user2.id, storeId: store3.id, rating: 3 });
    await Rating.create({ userId: user3.id, storeId: store1.id, rating: 5 });

    console.log('Initial data seeded successfully!');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

export const seedDatabase = async () => {
  try {
    await seedInitialData(true);
  } finally {
    await sequelize.close();
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}
