const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const Name = require('./models/Name');
const Wish = require('./models/Wish');

async function seedDatabase() {
    try {
        await connectDB();
        
        // Read names from JSON file
        const namesData = JSON.parse(fs.readFileSync('./data/names.json', 'utf8'));
        
        // Read wishes from JSON file
        const wishesData = JSON.parse(fs.readFileSync('./data/wishes.json', 'utf8'));

        // By default we clear existing data to avoid duplicates during development.
        // You can change this behavior by setting SKIP_CLEAR=true in your environment
        const skipClear = process.env.SKIP_CLEAR === 'true';
        if (!skipClear) {
            await Name.deleteMany({});
            await Wish.deleteMany({});
            console.log('🗑️  Cleared existing data...');
        } else {
            console.log('⚠️  SKIP_CLEAR=true — existing data will NOT be removed');
        }

        // Seed names (handle large lists safely)
        if (namesData.names && Array.isArray(namesData.names) && namesData.names.length) {
            // Normalize and deduplicate names (by lowercase key)
            const seen = new Set();
            const nameDocuments = [];
            for (let raw of namesData.names) {
                if (!raw || typeof raw !== 'string') continue;
                const trimmed = raw.trim();
                if (!trimmed) continue;
                const key = trimmed.toLowerCase();
                if (seen.has(key)) continue;
                seen.add(key);
                nameDocuments.push({ name: key, displayName: trimmed });
            }

            console.log(`ℹ️  Prepared ${nameDocuments.length} unique names for import`);

            // Insert in chunks to avoid very large single insert operations
            const chunkSize = parseInt(process.env.SEED_CHUNK_SIZE || '1000', 10);
            let insertedCount = 0;
            for (let i = 0; i < nameDocuments.length; i += chunkSize) {
                const chunk = nameDocuments.slice(i, i + chunkSize);
                try {
                    const res = await Name.insertMany(chunk, { ordered: false });
                    insertedCount += Array.isArray(res) ? res.length : 0;
                    console.log(`  ✅ Inserted chunk ${Math.floor(i / chunkSize) + 1}: ${chunk.length} items`);
                } catch (err) {
                    // insertMany with ordered:false will continue on duplicate key errors
                    if (err && err.writeErrors) {
                        const successCount = (err.result && err.result.nInserted) || 0;
                        insertedCount += successCount;
                        console.warn(`  ⚠️  Chunk insert had ${err.writeErrors.length} writeErrors; ${successCount} inserted`);
                    } else {
                        console.error('  ❌ Chunk insert failed:', err.message || err);
                    }
                }
            }

            console.log(`✅ Seeded names — total inserted: ${insertedCount}`);
        } else {
            console.log('ℹ️  No names found to seed');
        }

        // Seed wishes
        if (wishesData.wishes && Array.isArray(wishesData.wishes) && wishesData.wishes.length) {
            try {
                await Wish.insertMany(wishesData.wishes, { ordered: false });
                console.log(`✅ Seeded ${wishesData.wishes.length} wishes`);
            } catch (err) {
                console.warn('⚠️  Some wishes may have failed to insert (duplicates?), see error below:');
                console.warn(err.message || err);
            }
        } else {
            console.log('ℹ️  No wishes found to seed');
        }

        console.log('✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
