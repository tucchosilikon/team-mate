const axios = require('axios');

const HOSPITABLE_API_URL = 'https://api.hospitable.com/v1'; // Example URL

class HospitableService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: HOSPITABLE_API_URL,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async syncPropertyCalendars(propertyId) {
        // Scaffold: Logic to sync calendar
        console.log(`Syncing calendar for property ${propertyId}`);
        // await this.client.get(...)
    }

    async fetchMessageMetadata(threadId) {
        // Scaffold: Fetch metadata
        console.log(`Fetching messages for thread ${threadId}`);
    }
}

module.exports = new HospitableService(process.env.HOSPITABLE_API_KEY);
