import mongoose from 'mongoose';
import { database_url_connect } from './credentials.js';

mongoose.connect(database_url_connect, {
    dbName: 'Wikilinks'
});

mongoose.connection.once('open', async () => {
    console.log('Connecté à la base de données Wikilinks.');

    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log('Collections présentes dans Wikilinks :');
        collections.forEach(col => {
            console.log(col);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des collections :', error);
    } finally {
        await mongoose.connection.close();
    }
});