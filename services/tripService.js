import Trip from "../models/Trip.js";

export class TripService {
    async createTrip(tripData) {
        const location = await Trip.create(tripData);
        return location;
    }
}

export default new TripService();