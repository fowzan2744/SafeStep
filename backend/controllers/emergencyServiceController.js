const EmergencyService = require('../models/EmergencyService');

// Get nearby emergency services
const getNearbyServices = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type } = req.query; // radius in meters, default 5km

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      isActive: true
    };

    // Filter by type if specified
    if (type) {
      query.type = type;
    }

    const services = await EmergencyService.find(query).limit(20);

    // Calculate distance for each service
    const servicesWithDistance = services.map(service => {
      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        service.location.coordinates[1],
        service.location.coordinates[0]
      );

      return {
        ...service.toObject(),
        distance: `${distance.toFixed(1)} km`,
        distanceValue: distance
      };
    });

    // Sort by distance
    servicesWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);

    res.json(servicesWithDistance);
  } catch (error) {
    console.error('Error fetching nearby services:', error);
    res.status(500).json({ message: 'Error fetching nearby emergency services' });
  }
};
 


// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

module.exports = {
  getNearbyServices
}; 