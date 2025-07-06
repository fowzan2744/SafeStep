const mongoose = require('mongoose');
const EmergencyService = require('./models/EmergencyService');
require('dotenv').config();

const sampleServices = [
  // Qatar Police Stations (around Doha)
  {
    name: "Doha Central Police Station",
    type: "police",
    address: "Al Corniche Street, Doha",
    phone: "999",
    email: "police@moi.gov.qa",
    location: { coordinates: [51.5310, 25.2854] },
    description: "Main police station serving central Doha"
  },
  {
    name: "West Bay Police Station",
    type: "police",
    address: "West Bay Area, Doha",
    phone: "999",
    email: "westbay.police@moi.gov.qa",
    location: { coordinates: [51.5280, 25.3200] },
    description: "Police station serving West Bay area"
  },
  {
    name: "Al Wakrah Police Station",
    type: "police",
    address: "Al Wakrah Municipality",
    phone: "999",
    email: "wakrah.police@moi.gov.qa",
    location: { coordinates: [51.6030, 25.1710] },
    description: "Police station serving Al Wakrah area"
  },

  // Qatar Fire Stations
  {
    name: "Doha Central Fire Station",
    type: "fire",
    address: "Al Sadd Area, Doha",
    phone: "999",
    email: "fire@civildefense.gov.qa",
    location: { coordinates: [51.5200, 25.2900] },
    description: "Central fire station with full emergency response"
  },
  {
    name: "Hamad International Airport Fire Station",
    type: "fire",
    address: "Hamad International Airport",
    phone: "999",
    email: "airport.fire@civildefense.gov.qa",
    location: { coordinates: [51.6090, 25.2730] },
    description: "Airport fire and rescue services"
  },

  // Qatar Hospitals
  {
    name: "Hamad General Hospital",
    type: "hospital",
    address: "Al Rayyan Road, Doha",
    phone: "999",
    email: "emergency@hamad.qa",
    location: { coordinates: [51.4900, 25.2800] },
    description: "Main emergency hospital in Qatar"
  },
  {
    name: "Al Wakra Hospital",
    type: "hospital",
    address: "Al Wakrah Municipality",
    phone: "999",
    email: "emergency@alwakra.qa",
    location: { coordinates: [51.6030, 25.1710] },
    description: "Emergency medical services in Al Wakrah"
  },
  {
    name: "Al Khor Hospital",
    type: "hospital",
    address: "Al Khor Municipality",
    phone: "999",
    email: "emergency@alkhor.qa",
    location: { coordinates: [51.4970, 25.6800] },
    description: "Emergency medical services in Al Khor"
  },
  {
    name: "Sidra Medicine",
    type: "hospital",
    address: "Education City, Doha",
    phone: "999",
    email: "emergency@sidra.org",
    location: { coordinates: [51.4300, 25.3100] },
    description: "Specialized pediatric and women's hospital"
  },

  // Poison Control Center
  {
    name: "Qatar Poison Control Center",
    type: "poison_control",
    address: "Hamad Medical Corporation, Doha",
    phone: "999",
    email: "poison@hamad.qa",
    location: { coordinates: [51.4900, 25.2800] },
    description: "24/7 poison control and toxicology services"
  },

  // Additional Police Stations
  {
    name: "Al Sadd Police Station",
    type: "police",
    address: "Al Sadd Area, Doha",
    phone: "999",
    email: "sadd.police@moi.gov.qa",
    location: { coordinates: [51.5200, 25.2900] },
    description: "Police station serving Al Sadd area"
  },
  {
    name: "Al Khor Police Station",
    type: "police",
    address: "Al Khor Municipality",
    phone: "999",
    email: "khor.police@moi.gov.qa",
    location: { coordinates: [51.4970, 25.6800] },
    description: "Police station serving Al Khor area"
  },

  // Additional Fire Stations
  {
    name: "Al Wakrah Fire Station",
    type: "fire",
    address: "Al Wakrah Municipality",
    phone: "999",
    email: "wakrah.fire@civildefense.gov.qa",
    location: { coordinates: [51.6030, 25.1710] },
    description: "Fire station serving Al Wakrah area"
  },
  {
    name: "Al Khor Fire Station",
    type: "fire",
    address: "Al Khor Municipality",
    phone: "999",
    email: "khor.fire@civildefense.gov.qa",
    location: { coordinates: [51.4970, 25.6800] },
    description: "Fire station serving Al Khor area"
  },

  // Additional Hospitals
  {
    name: "Al Ahli Hospital",
    type: "hospital",
    address: "Al Sadd Area, Doha",
    phone: "999",
    email: "emergency@ahlihospital.com",
    location: { coordinates: [51.5200, 25.2900] },
    description: "Private hospital with emergency services"
  },
  {
    name: "Al Emadi Hospital",
    type: "hospital",
    address: "Al Sadd Area, Doha",
    phone: "999",
    email: "emergency@alemadihospital.com",
    location: { coordinates: [51.5150, 25.2850] },
    description: "Private hospital with emergency services"
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safestep', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  try {
    // Clear existing emergency services data
    await EmergencyService.deleteMany({});
    
    // Insert new emergency services data
    const result = await EmergencyService.insertMany(sampleServices);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding emergency services:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 