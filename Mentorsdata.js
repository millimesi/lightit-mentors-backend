import sha1 from 'sha1';

const million = {
    name: 'Million',
    fatherName: 'Meseret',
    email: 'millionmesi1@gmail.com',
    password: sha1('1234'),
    profileImage: 'millionProfileImage1.jpeg',
    phoneNumber: '0910120891',
    mentorType: ['Academic Tutor', 'Life Skill Mentor'],
    city: 'Jimma',
    location: 'Ferenje Arada',
    numberOfMentee: 0,
    rating: 8,
    reviews: [
      {
        userId: 'user1',
        comment: 'Great mentor, very helpful and knowledgeable.',
        rating: 9,
      },
      {
        userId: 'user2',
        comment: 'Provided excellent guidance, would recommend.',
        rating: 8,
      },
    ],
  };
  
  const yidiya = {
    name: 'Yididia',
    fatherName: 'Meseret',
    email: 'yididiyameseret89@gmail.com',
    password: sha1('1234'),
    profileImage: 'yididyaProfileImage1.jpeg',
    phoneNumber: '0923269367',
    mentorType: ['Academic Tutor'],
    numberOfMentee: 5,
    city: 'Jimma',
    location: 'Ajip',
    rating: 5,
    reviews: [
      {
        userId: 'user3',
        comment: 'Knowledgeable in the subject, but could be more engaging.',
        rating: 6,
      },
      {
        userId: 'user4',
        comment: 'Helpful but lacked practical examples.',
        rating: 5,
      },
    ],
  };
  
  const mega = {
    name: 'Mega',
    fatherName: 'Kebede',
    email: 'millimesi106@gmail.com',
    password: sha1('1234'),
    profileImage: 'megaProfileImage1.jpeg',
    phoneNumber: '0912345678',
    mentorType: ['Life Skill Mentor'],
    city: 'Jimma',
    location: 'kochi',
    rating: 7,
    numberOfMentee: 2,
    reviews: [
      {
        userId: 'user5',
        comment: 'Insightful advice and very supportive.',
        rating: 7,
      },
      {
        userId: 'user6',
        comment: 'Helped me a lot in setting life goals.',
        rating: 8,
      },
    ],
  };

  
const mentorList = [million, yidiya, mega];
export default mentorList;
