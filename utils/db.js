// Database connection and management
import mongoose from "mongoose";
import Mentor from "../models/mentor.js";

export default class DbClient{
    constructor() {
        // set database url parameters 
        const host = process.env.DB_HOST || 'localhost'; 
        const port = process.env.DB_PORT || 27017;
        const dbName = process.env.MENTORS_DB || 'light_it_Mentors';
        const dbUrl = `mongodb://${host}:${port}/${dbName}`;

        // conect to the data base
        mongoose.connect(dbUrl)
            .then(() => {
                console.log(`Database connection is established. readyState: ${mongoose.connection.readyState}`)
            })
            .catch((error) => console.log(`Connection Error: ${error}`))

        // Close the connection when the program is terminated
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('Database connection is closed due to program termination!');
                process.exit(0);
            } catch (err) {
                console.error(`Error closing the database connection: ${err}`);
                process.exit(1);
            }
        });
    }

    // Get the number of documents in the mentor collection
    async nbMentors() {
        try{
            const mentorCount = await Mentor.countDocuments();
            return mentorCount;
        } catch (err){
            console.log(`${err}`)
        }
    }

    /** 
     * @description retrives list of mentors
     *  paginated with ascending order of numberOfMentee
     * @returns {Object[]} - paginated list of mentors from the database
     */ 
    async getListOfMentors (page, limit) {

        // calculate the skip for pagination
        const skip = (page - 1) * limit

        try {
            // query the data base with asending sort, skip and limit
            const listOfMentors = await Mentor.find({})
            .sort({ numberOfMentee: 1 })
            .skip(skip)
            .limit(limit);

            return listOfMentors;
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    /**
     * @description retrives the mentor with Id
     * @param {String} id - id of the mentor
     * @returns {Object} - mentor retrived by the Id
     */
    async getMentor(id) {
        try {
            const mentor = await Mentor.findById(id);
            return mentor;
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }
}


// ( async () => {
// const db = new DbClient();
// console.log({
//     totalNumOfMentors: await db.nbMentors(),
//     listofMentors: await db.getListOfMentors() });
// })();
