const firebase = require('firebase/app');
const database = require('firebase/database');

const pincodes = require('./pincodes.json')

// Initialize Firebase with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAevTZWCcLac89nt2zXZPiCSn-Lhuj07TY",
  authDomain: "race2vegas-3.firebaseapp.com",
  databaseURL: "https://race2vegas-3-default-rtdb.firebaseio.com",
  projectId: "race2vegas-3",
  storageBucket: "race2vegas-3.appspot.com",
  messagingSenderId: "449643200871",
  appId: "1:449643200871:web:0ad912f934ef8e908befc2"
};

const app = firebase.initializeApp(firebaseConfig);
const { getDatabase, get, set, ref, query, orderByChild, remove, update, endAt, limitToFirst, push } = database;
const db = getDatabase(app);

const GAME_ID = 'bikeRace'


function generateShortUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  const timestamp = Date.now().toString(36);
  code += timestamp;

  return code;
}

async function getProfile(mobile) {
  const dbRef = ref(db, `${GAME_ID}/users/${mobile}`)
  const snapshot = await get(dbRef);
  return snapshot.val()
}


async function getEntireLeaderBoard(count=100) {
  const scoreBoardQuery = query(ref(db, `${GAME_ID}/scores/`), orderByChild('negative_total'), limitToFirst(count*2));
  const snapshot = await get(scoreBoardQuery);
  const data = []

  snapshot.forEach(child => {
    data.push({mobile: child.key, scores: child.val()})
  })

 
  const promises = data.map(async (d) => {
    const user = await getProfile(d["mobile"])
    return {...d, user}
  })
  const leaderBoard = await Promise.all(promises)
  return leaderBoard.filter(d => ['User', 'Winner'].includes(d?.user?.userType)).slice(0, count)
}

const getRandomKey = (obj) => {
  // Get the keys of the object
  const keys = Object.keys(obj);

  // Check if the object is empty
  if (keys.length === 0) {
    return undefined;
  }

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * keys.length);

  // Use the random index to get the random key
  const randomKey = keys[randomIndex];

  return randomKey;
}



async function updateLeaderboard(leaderboardData) {
  try {
    
    for (const leader of leaderboardData) {
      console.log(leader.scores)
      if(leader.scores.score > 50000) {
        console.log(leader)
        const dbRef1 = ref(db, `${GAME_ID}/scores/${leader.mobile}`);
        await set(dbRef1, {
          bonus: 0,
          score: 0,
          time: 0,
          total: 0,
          gameCount: 0,
          negative_total: 0
        }); 
      } else {
        break;
      }
    }


    const positionsToUpdate = [
      { phone: '', name: 'Sumit', position: 1, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '8699525598', name: 'Aery Avi', position: 2, joinDate: "2023-10-06", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '7347601006', name: 'Nitin Thapa', position: 3, joinDate: "2023-10-08", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '9973409111', name: 'Pintu', position: 4, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '9996813301', name: 'Akash Thakral', position: 5, joinDate: "2023-10-07", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '7289970551', name: 'Neeta', position: 6, joinDate: "2023-10-08", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '8527408588', name: 'Pushkar Dhall', position: 7, joinDate: "2023-10-06", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '9478623293', name: 'Sahil', position: 8, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type:'scam no'},
      { phone: '6283691825', name: 'Gaurav Kumar', position: 9, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '', name: 'Jyoti', position: 10, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '9465144199', name: 'Manik Sharma', position: 11, joinDate: "2023-10-02", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '', name: 'Sheenu', position: 12, joinDate: "2023-10-02", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '9988341905', name: 'Harshdeep Singh', position: 13, joinDate: "2023-10-07", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '9988341905', name: 'Avinav', position: 14, joinDate: "2023-10-07", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '8146140259', name: 'Shalini', position: 15, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '', name: 'Rajan', position: 16, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '8468019128', name: 'Pooja', position: 17, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '7303207302', name: 'Pushkar', position: 18, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '8352896909', name: 'Yash Rai', position: 19, joinDate: "2023-10-01", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '7018901240', name: 'Mannat', position: 20, joinDate: "2023-10-10", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '8872766560', name: 'Monika S', position: 21, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '8054261732', name: 'Vivek', position: 22, joinDate: "2023-10-01", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '9988306375', userType: 'Winner', name: 'Prinsu', position: 23, joinDate: "2023-10-06", gameCount: 16, pinCode: "443203", city: "Umrad", refferalCode: "ih1c5lndfy4rt", type:'scam no'},
      { phone: '9803556703', name: 'Deepak', position: 24, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '7986750145', name: 'Mintu', position: 25, joinDate: "2023-10-10", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type:'scam no'},
      { phone: '8146625241', name: 'Davinder', position: 26, joinDate: "2023-10-11", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '9888616375', name: 'Silky', position: 27, joinDate: "2023-10-12", gameCount: 15, pinCode: "370490", city: "Vinjhan", refferalCode: "G4ITnlndi60fd", type: 'our new'},
      { phone: '7009886028', name: 'Rajinder', position: 28, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '8146625219', name: 'Saksham K', position: 29, joinDate: "2023-10-06", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '8437364840', name: 'Raman', position: 30, joinDate: "2023-10-04", gameCount: 14 , pinCode: "392240", city: "Tankaria", refferalCode: "T5vXzS3KwMqUo", type: 'our new'},
      { phone: '6394300408', name: 'Yash Rai', position: 31, joinDate: "2023-10-07", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '7986160662', name: 'Sargun', position: 32, joinDate: "2023-10-05", gameCount: 17, pinCode: "464240", city: "Serwasa", refferalCode: "W1OzUvgxj6rtl", type: 'our new'},
      { phone: '8400199367', name: 'Puja', position: 33, joinDate: "2023-10-06", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '7625966407', name: 'Gaurav', position: 34, joinDate: "2023-10-09", gameCount: 18, pinCode: "394380", city: "Sadgavan", refferalCode: "A6mBdVfRg9JqK", type: 'our new'},
      { phone: '', name: 'Varun', position: 35, joinDate: "2023-10-01", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Shivam', position: 36, joinDate: "2023-10-01", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '7298504502', name: 'Abhi Sharma', position: 37, joinDate: "2023-10-02", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'nitin dost'},
      { phone: '6280695266', name: 'Mahesh S', position: 38, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '', name: 'Chirag', position: 39, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '6280483185', name: 'Mahesh', position: 40, joinDate: "2023-10-08", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '9878502386', name: 'Mehak', userType: 'Winner', position: 41, joinDate: "2023-10-06", gameCount: 19, pinCode: "415206", city: "Yerad", refferalCode: "oAMGwlndi0obr", type:'scam no'},
      { phone: '7889179155', name: 'Keshav Jio', position: 42, joinDate: "2023-10-01", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '9417306375', name: 'Ashok', userType: 'Winner', position: 43, joinDate: "2023-10-08", gameCount: 16, pinCode: "443203", city: "Umrad", refferalCode: "ih1c5lndfy4rt", type:'scam no'},
      { phone: '8146625698', name: 'rajinder S', position: 44, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '6239731149', name: 'Keshav S', position: 45, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '7527955001', name: 'Harshdeep SN', position: 46, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '', name: 'Kunal S', position: 47, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '8146626459', name: 'Deepak O', position: 48, joinDate: "2023-10-10", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '09478623293', name: 'Mehak', position: 49, joinDate: "2023-10-10", gameCount: 19, pinCode: "415206", city: "Yerad", refferalCode: "oAMGwlndi0obr", type:'scam no'},
      { phone: '9988789451', name: 'Saksham Kalra', position: 50, joinDate: "2023-10-11", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '9877710715', name: 'Davinder Sir Jio', position: 51, joinDate: "2023-10-12", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'}, 
      { phone: '9855162654', name: 'Shalini', position: 52, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '9873358799', name: 'Pushku', position: 53, joinDate: "2023-10-09", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '9815848658', name: 'Keshav', position: 54, joinDate: "2023-10-08", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t", type: 'raman dost'},
      { phone: '07986750145', name: 'Shaily Malhotra', position: 55, joinDate: "2023-10-10", gameCount: 19, pinCode: "415206", city: "Yerad", refferalCode: "oAMGwlndi0obr", type:'scam no'},
      { phone: '', name: 'Shubham Panwar', position: 56, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Shyam', position: 57, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Shubham Chimpa', position: 58, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Anurag Garg', position: 59, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Suraj Kumar', position: 60, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Lovish', position: 61, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Deepak', position: 62, joinDate: "2023-10-05", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Madhav', position: 63, joinDate: "2023-10-01", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Kunal Sharma', position: 64, joinDate: "2023-10-07", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Shushant', position: 65, joinDate: "2023-10-04", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Livanshi', position: 66, joinDate: "2023-10-06", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Raghav', position: 67, joinDate: "2023-10-06", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      { phone: '', name: 'Jatin', position: 68, joinDate: "2023-10-08", gameCount: 12, pinCode: "416630", city: "Poyare", refferalCode: "5lD9xlndhuc3t"},
      //not added right now - nitin dost
      // nitin dost
      
    ];

    leaderboardData = await removeUsers(leaderboardData,positionsToUpdate);




    for (const position of positionsToUpdate) {
      if(!position.phone) continue;
      const oldData = leaderboardData[position.position - 1];
      const myProfile = await getProfile(position.phone)
      if (leaderboardData[position.position -1]) {
        if(leaderboardData[position.position -1].mobile === position.phone) continue;
        const currentScore = leaderboardData[position.position - 1].scores.score;
        const currentTime = leaderboardData[position.position - 1].scores.time;

        const minimalIncrease = Math.floor(Math.random() * 10) + 1; // Random increase between 1 and 10
        const newScore = currentScore + minimalIncrease;
        const newTime = parseFloat(currentTime) + minimalIncrease;
        const newGameCount = Math.floor(Math.random() * 50) + 50;

        // Update the phone number with the new score
        leaderboardData[position.position - 1].phone = newScore;
        const pinCode = getRandomKey(pincodes);
        console.log(`--${GAME_ID}/users/${position.phone}--`,{
          city: myProfile?.city ? myProfile?.city : pincodes[pinCode],
          joinDate: position.joinDate,
          mobile: position.phone,
          name: position.name,
          pincode: myProfile?.pincode ? myProfile?.pincode : pinCode,
          referralCode: myProfile?.referralCode ? myProfile?.referralCode : generateShortUniqueCode(),
          referredBy: "",
          userType: myProfile?.userType == 'User' ? myProfile?.userType : "User",
        })
        const dbRef = ref(db, `${GAME_ID}/users/${position.phone}`);
        
        await set(dbRef, {
          city: myProfile?.city ? myProfile?.city : pincodes[pinCode],
          joinDate: myProfile?.joinDate ? myProfile?.joinDate : position.joinDate,
          mobile: myProfile?.mobile ? myProfile?.mobile : position.phone,
          name: myProfile?.name ? myProfile?.name : position.name,
          pincode: myProfile?.pincode ? myProfile?.pincode : pinCode,
          referralCode: myProfile?.referralCode ? myProfile?.referralCode : generateShortUniqueCode(),
          referredBy: "",
          userType: myProfile?.userType == 'User' || myProfile?.userType == 'Winner' ? myProfile?.userType : "User",
        });
        console.log(`--${GAME_ID}/scores/${position.phone}--`,{
          bonus: 0,
          score: newScore,
          time: newTime.toString(),
          total: newScore,
          gameCount: newGameCount,
          negative_total: newScore*-1,
          date: new Date()
        })
        // Update the score in the database
        const dbRef1 = ref(db, `${GAME_ID}/scores/${position.phone}`);
        await set(dbRef1, {
          bonus: 0,
          score: newScore,
          time: newTime.toString(),
          total: newScore,
          gameCount: newGameCount,
          negative_total: newScore*-1
        });


  
      }
    }

    console.log('Leaderboard updated successfully');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
}

const removeUsers = async (leaderboardData, positionsToUpdate) => {
  const positionsToUpdateObj = {};
  for(let i=0;i<positionsToUpdate.length;i++) {
    positionsToUpdateObj[positionsToUpdate[i].phone] = 1;
  }

  for(let i = 0;i<leaderboardData.length;i++){
    const leader = leaderboardData[i];
    
    console.log(leader.scores.score,typeof leader.scores.score)
    if(leader.scores.score >= 100000) {
      if(!positionsToUpdateObj[leaderboardData[i].mobile]) {
        const dbRef2 = ref(db, `${GAME_ID}/users/${leaderboardData[i].mobile}`);
        const dbRef4 = ref(db, `${GAME_ID}/scores/${leaderboardData[i].mobile}`);
        await remove(dbRef2);
        await remove(dbRef4);
      }
    }
  }
  
  return await getEntireLeaderBoard();
}
async function main() {
  // for(;;) { 
  try {
    const leaderboardData = await getEntireLeaderBoard();
    if (!leaderboardData) {
      console.error('Leaderboard data is empty');
      return;
    }
    
    await updateLeaderboard(leaderboardData);
  } catch (error) {
    console.error('An error occurred:', error);
  }
  // }
}

// Run the main function initially
main();

// Schedule to run the main function every 30 minutes (30 * 60 * 1000 milliseconds)
setInterval(main, 30 * 1000);
