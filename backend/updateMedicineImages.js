const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./models/Medicine');

dotenv.config();

// Professional medicine images - high quality, varied, pharmaceutical-focused
const professionalMedicineImages = [
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format", // White tablets
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&auto=format", // Medicine bottles
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&auto=format", // Liquid medicine
  "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=400&fit=crop&auto=format", // Eye drops
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&auto=format", // Cream tubes
  "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&auto=format", // Medical supplies
  "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400&h=400&fit=crop&auto=format", // Colorful pills
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop&auto=format", // Medicine packets
  "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&auto=format", // Pharmacy bottles
  "https://images.unsplash.com/photo-1583244685026-d8519b5e7be7?w=400&h=400&fit=crop&auto=format", // Medical pills
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop&auto=format", // Capsules
  "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=400&fit=crop&auto=format", // Medicine bottle
  "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop&auto=format", // Pharmacy
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&auto=format", // Tablets
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=400&fit=crop&auto=format", // Medicine
];

// Function to get random image for variety
const getRandomMedicineImage = () => {
  return professionalMedicineImages[Math.floor(Math.random() * professionalMedicineImages.length)];
};

// Function to get image by medicine type
const getImageByType = (form, category) => {
  const imageMap = {
    // By form
    'Tablet': professionalMedicineImages[0],
    'Capsule': professionalMedicineImages[10],
    'Syrup': professionalMedicineImages[2],
    'Drops': professionalMedicineImages[3],
    'Cream': professionalMedicineImages[4],
    'Ointment': professionalMedicineImages[4],
    'Injection': professionalMedicineImages[5],
    
    // By category
    'Pain Relief': professionalMedicineImages[0],
    'Allergy': professionalMedicineImages[1],
    'Antibiotics': professionalMedicineImages[6],
    'Vitamins': professionalMedicineImages[7],
    'Heart Care': professionalMedicineImages[8],
    'Diabetes': professionalMedicineImages[9],
    'Skin Care': professionalMedicineImages[4],
    'Eye Care': professionalMedicineImages[3],
  };
  
  return imageMap[form] || imageMap[category] || getRandomMedicineImage();
};

async function updateMedicineImages() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('📊 Fetching all medicines...');
    const medicines = await Medicine.find({});
    
    console.log(`🏥 Found ${medicines.length} medicines to update`);
    
    for (let medicine of medicines) {
      const newImage = getImageByType(medicine.form, medicine.category);
      
      await Medicine.updateOne(
        { _id: medicine._id },
        { 
          $set: { 
            image: newImage,
            // Add fallback image field
            fallbackImage: "https://via.placeholder.com/400x400/2563eb/white?text=" + encodeURIComponent(medicine.name)
          }
        }
      );
      
      console.log(`✅ Updated image for: ${medicine.name}`);
    }
    
    console.log('🎉 All medicine images updated successfully!');
    console.log('📸 Images are now professional, varied, and pharmacy-focused');
    
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Export for use
module.exports = { updateMedicineImages, getImageByType, professionalMedicineImages };

// Run if called directly
if (require.main === module) {
  updateMedicineImages();
}
