import { config as dotenvConfig } from 'dotenv';
import { connectToDatabase } from '../database.connection';
import { seedDatabase } from './seedData';
import log4js from 'log4js';
import config from '../config';
import mongoose from 'mongoose';

dotenvConfig();
log4js.configure(config.log4js);
const logger = log4js.getLogger();

async function waitForMongo(maxAttempts: number = 10) {
    let attempts = 0;
    while (attempts < maxAttempts) {
        try {
            await mongoose.connect(process.env.MONGO_ADDRESS!);
            logger.info('✅ MongoDB connected');
            return;
        } catch (err) {
            attempts++;
            logger.warn(`⏳ Waiting for MongoDB... Attempt ${attempts} of ${maxAttempts}`);
            await new Promise(res => setTimeout(res, 2000));
        }
    }
    logger.error('❌ Failed to connect to MongoDB after several attempts');
    process.exit(1);
}

async function runSeed(): Promise<void> {
    try {
        logger.info('🚀 Starting seed process...');

        const mongoUri = process.env.MONGO_ADDRESS;
        if (!mongoUri) {
            throw new Error('MONGO_ADDRESS is not defined in .env file');
        }

        await waitForMongo();
        await seedDatabase();

        logger.info('🎉 Seed process completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Seed process failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    runSeed();
}

export { runSeed };
