// Mentor endspoints controller
import DbClient from '../utils/db.js'
import getPrice from '../utils/mentorPrice.js';

// initiate the Database
const db = new DbClient();

/**
 * @description - 
 * @
 */
export default class MentorController {
    static async getMentors(req, res){
        console.log('GET /mentors is Accessed');

        // get the query parameters and parseInt them
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 3;

            // Total number of mentors
            const totalNumOfMentors = await db.nbMentors()

            // get the list of mentors
            // sorted with ascending numberofmentee and paginated
            const listOfMentors = await db.getListOfMentors(page, limit);
            
            // prepare mentor list only by including relevant information
            // create empty list of mentors to push filtered mentor information
            let mentorList = [];

            // take the listOfMentors and filter each mentor also include price 
            // and push it to MentorList
            for (const mentor of listOfMentors) {
                const mentorInfo = {
                    _id: mentor._id,
                    name: mentor.name,
                    fatherName: mentor.fatherName,
                    profileImage: mentor.profileImage ? `http://localhost:5000/profileImage/${mentor.profileImage}` : null,
                    mentorExpertise: mentor.mentorType,
                    city: mentor.city,
                    location: mentor.location,
                    numberOfMentee: mentor.numberOfMentee,
                    rating: mentor.rating,
                    price: getPrice(mentor.rating),
                    revievews: mentor.revievews
                }

                // push the mentor to the mentorList
                mentorList.push(mentorInfo);
            }

            res.status(200).json({ totalNumOfMentors, mentorList });
        } catch (err) {
            console.log(`Error: ${err}`);
            res.status(500).json({ error: 'Server error occurred' });
        }
    }

    static async getMentorByID(req, res) {
        console.log('GET /mentors/:id is Accesseed')
        
        // get the id from params
        const mentorId = req.params.id;

        // get the mentor from the database
        try {
            const mentor = await db.getMentor(mentorId);

            // filter the mentor and add the incuded price
            const mentorInfo = {
                _id: mentor._id,
                name: mentor.name,
                fatherName: mentor.fatherName,
                profileImage: mentor.profileImage,
                mentorExpertise: mentor.mentorType,
                city: mentor.city,
                location: mentor.location,
                rating: mentor.rating,
                price: getPrice(mentor.rating),
                revievews: mentor.revievews
            }

            res.status(200).json({ mentorInfo });
        } catch (err) {
            console.log(`Error: ${err}`);
            res.status(500).json({ error: 'Server error occurred' });
        }
    } 
}
