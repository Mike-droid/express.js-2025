const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcrypt'); // npm install bcrypt (opcional para hashear passwords)

const prisma = new PrismaClient();

const seedUsers = [
	{
		name: 'Admin Principal',
		email: 'admin@example.com',
		password: 'admin123',
		role: 'ADMIN',
	},
	{
		name: 'Juan Pérez',
		email: 'juan@example.com',
		password: 'user123',
		role: 'USER',
	},
	{
		name: 'María García',
		email: 'maria@example.com',
		password: 'user123',
		role: 'USER',
	},
	{
		name: 'Carlos López',
		email: 'carlos@example.com',
		password: 'user123',
		role: 'USER',
	},
	{
		name: 'Ana Martínez',
		email: 'ana@example.com',
		password: 'admin456',
		role: 'ADMIN',
	},
	{
		name: 'Luis Rodríguez',
		email: 'luis@example.com',
		password: 'user123',
		role: 'USER',
	},
];

async function hashPassword(password) {
	try {
		return await bcrypt.hash(password, 10);
	} catch (error) {
		console.error('Error hashing password:', error);
		return password;
	}
}

async function seedDatabase() {
	try {
		console.log('🌱 Starting database seed...');

		// Opcional: Limpiar usuarios existentes
		// await prisma.user.deleteMany({});
		// console.log('🗑️ Cleared existing users');

		// Hashear passwords y crear usuarios
		const usersWithHashedPasswords = await Promise.all(
			seedUsers.map(async (user) => ({
				...user,
				password: await hashPassword(user.password),
			}))
		);

		const result = await prisma.user.createMany({
			data: usersWithHashedPasswords,
			skipDuplicates: true, // No falla si el email ya existe
		});

		console.log(`✅ Successfully created ${result.count} users`);
		console.log('📋 Seeded users:');

		seedUsers.forEach((user, index) => {
			console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
		});

		return result;
	} catch (error) {
		console.error('❌ Error seeding database:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Ejecutar seed si el archivo se ejecuta directamente
if (require.main === module) {
	seedDatabase()
		.then(() => {
			console.log('🎉 Database seeding completed!');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 Database seeding failed:', error);
			process.exit(1);
		});
}

module.exports = { seedDatabase, seedUsers };
