const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

dotenv.config();

const medicines = [
  {
    name: "Paracetamol 500mg",
    genericName: "Paracetamol",
    category: "Pain Relief",
    price: 45,
    originalPrice: 60,
    rating: 4.5,
    reviewsCount: 234,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 100,
    manufacturer: "GlaxoSmithKline",
    description: "Effective pain relief and fever reducer for adults and children",
    activeIngredient: "Paracetamol",
    strength: "500mg",
    form: "Tablet",
    uses: ["Pain relief", "Fever reduction", "Headache", "Body ache"],
    sideEffects: ["Rare: Skin rash", "Nausea (uncommon)"],
    precautions: ["Do not exceed 8 tablets in 24 hours", "Avoid alcohol", "Consult doctor if symptoms persist"],
    dosage: "Adults: 1-2 tablets every 4-6 hours",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Cetirizine 10mg",
    genericName: "Cetirizine",
    category: "Allergy",
    price: 85,
    originalPrice: 100,
    rating: 4.3,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 75,
    manufacturer: "Cipla",
    description: "Antihistamine for allergic reactions and hay fever",
    activeIngredient: "Cetirizine Hydrochloride",
    strength: "10mg",
    form: "Tablet",
    uses: ["Allergic rhinitis", "Urticaria", "Hay fever", "Skin allergies"],
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
    precautions: ["May cause drowsiness", "Avoid alcohol", "Use caution when driving"],
    dosage: "Adults: 1 tablet once daily",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Vitamin D3 60000 IU",
    genericName: "Cholecalciferol",
    category: "Supplements",
    price: 320,
    originalPrice: 400,
    rating: 4.7,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 50,
    manufacturer: "Sun Pharma",
    description: "Essential vitamin D supplement for bone health",
    activeIngredient: "Cholecalciferol",
    strength: "60000 IU",
    form: "Capsule",
    uses: ["Bone health", "Immune support", "Calcium absorption", "Vitamin D deficiency"],
    sideEffects: ["Nausea", "Vomiting", "Weakness"],
    precautions: ["Monitor calcium levels", "Do not exceed recommended dose"],
    dosage: "1 capsule weekly or as directed",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    category: "Digestive Health",
    price: 125,
    originalPrice: 150,
    rating: 4.4,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1583244685026-d8519b5e7be7?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 60,
    manufacturer: "Dr. Reddy's",
    description: "Proton pump inhibitor for acid reflux and ulcers",
    activeIngredient: "Omeprazole",
    strength: "20mg",
    form: "Capsule",
    uses: ["Acid reflux", "GERD", "Peptic ulcers", "Heartburn"],
    sideEffects: ["Headache", "Diarrhea", "Nausea"],
    precautions: ["Take before meals", "Long-term use requires monitoring"],
    dosage: "1 capsule daily before breakfast",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    price: 180,
    originalPrice: 220,
    rating: 4.2,
    reviewsCount: 145,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
    prescriptionRequired: true,
    inStock: true,
    stockQuantity: 40,
    manufacturer: "Ranbaxy",
    description: "Broad-spectrum antibiotic for bacterial infections",
    activeIngredient: "Amoxicillin",
    strength: "500mg",
    form: "Capsule",
    uses: ["Respiratory infections", "UTI", "Skin infections", "Dental infections"],
    sideEffects: ["Diarrhea", "Nausea", "Allergic reactions"],
    precautions: ["Complete full course", "Take with food", "Check for penicillin allergy"],
    dosage: "1 capsule 3 times daily for 5-7 days",
    isFeatured: false,
    isActive: true
  },
  {
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    category: "Pain Relief",
    price: 65,
    originalPrice: 80,
    rating: 4.3,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 80,
    manufacturer: "Abbott",
    description: "Non-steroidal anti-inflammatory drug for pain and inflammation",
    activeIngredient: "Ibuprofen",
    strength: "400mg",
    form: "Tablet",
    uses: ["Pain relief", "Inflammation", "Fever", "Arthritis"],
    sideEffects: ["Stomach upset", "Dizziness", "Headache"],
    precautions: ["Take with food", "Avoid if stomach ulcers", "Check kidney function"],
    dosage: "1 tablet 2-3 times daily after meals",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Multivitamin Tablets",
    genericName: "Multivitamin Complex",
    category: "Supplements",
    price: 450,
    originalPrice: 550,
    rating: 4.5,
    reviewsCount: 234,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 120,
    manufacturer: "Himalaya",
    description: "Complete daily nutrition with essential vitamins and minerals",
    activeIngredient: "Mixed Vitamins & Minerals",
    strength: "Multi",
    form: "Tablet",
    uses: ["Daily nutrition", "Energy boost", "Immune support", "Overall health"],
    sideEffects: ["Nausea (if taken empty stomach)", "Mild stomach upset"],
    precautions: ["Take with breakfast", "Store in cool dry place"],
    dosage: "1 tablet daily after breakfast",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Azithromycin 500mg",
    genericName: "Azithromycin",
    category: "Antibiotics",
    price: 85,
    originalPrice: 110,
    rating: 4.1,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
    prescriptionRequired: true,
    inStock: true,
    stockQuantity: 30,
    manufacturer: "Pfizer",
    description: "Macrolide antibiotic for respiratory and other infections",
    activeIngredient: "Azithromycin",
    strength: "500mg",
    form: "Tablet",
    uses: ["Respiratory infections", "Pneumonia", "Bronchitis", "Sinusitis"],
    sideEffects: ["Nausea", "Diarrhea", "Abdominal pain"],
    precautions: ["Complete full course", "Take on empty stomach", "Monitor liver function"],
    dosage: "1 tablet daily for 3-5 days",
    isFeatured: false,
    isActive: true
  },
  {
    name: "Calcium + Vitamin D3",
    genericName: "Calcium Carbonate + Cholecalciferol",
    category: "Supplements",
    price: 280,
    originalPrice: 350,
    rating: 4.4,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 90,
    manufacturer: "Lupin",
    description: "Bone health supplement with calcium and vitamin D3",
    activeIngredient: "Calcium Carbonate 1250mg + Vitamin D3 250 IU",
    strength: "1250mg + 250 IU",
    form: "Tablet",
    uses: ["Bone health", "Osteoporosis prevention", "Calcium deficiency", "Growing children"],
    sideEffects: ["Constipation", "Gas", "Stomach upset"],
    precautions: ["Take with plenty of water", "Separate from iron supplements"],
    dosage: "1 tablet twice daily with meals",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Loratadine 10mg",
    genericName: "Loratadine",
    category: "Allergy",
    price: 95,
    originalPrice: 120,
    rating: 4.2,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 65,
    manufacturer: "Johnson & Johnson",
    description: "Non-drowsy antihistamine for allergies",
    activeIngredient: "Loratadine",
    strength: "10mg",
    form: "Tablet",
    uses: ["Seasonal allergies", "Hay fever", "Allergic rhinitis", "Skin allergies"],
    sideEffects: ["Headache", "Dry mouth", "Fatigue"],
    precautions: ["Less drowsy than other antihistamines", "Safe for daytime use"],
    dosage: "1 tablet once daily",
    isFeatured: false,
    isActive: true
  },
  // Adding more popular medicines
  {
    name: "Crocin Advance 500mg",
    genericName: "Paracetamol",
    category: "Pain Relief",
    price: 35,
    originalPrice: 45,
    rating: 4.6,
    reviewsCount: 342,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 150,
    manufacturer: "GlaxoSmithKline",
    description: "Fast acting pain relief and fever reducer",
    activeIngredient: "Paracetamol",
    strength: "500mg",
    form: "Tablet",
    uses: ["Headache", "Body pain", "Fever", "Dental pain"],
    sideEffects: ["Rare allergic reactions", "Liver damage in overdose"],
    precautions: ["Do not exceed 8 tablets in 24 hours", "Avoid with alcohol"],
    dosage: "1-2 tablets every 4-6 hours",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Dolo 650mg",
    genericName: "Paracetamol",
    category: "Pain Relief", 
    price: 28,
    originalPrice: 35,
    rating: 4.5,
    reviewsCount: 567,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 200,
    manufacturer: "Micro Labs",
    description: "Higher strength paracetamol for effective fever control",
    activeIngredient: "Paracetamol",
    strength: "650mg",
    form: "Tablet",
    uses: ["High fever", "Severe headache", "Post-vaccination fever", "Body ache"],
    sideEffects: ["Nausea", "Vomiting", "Liver toxicity in overdose"],
    precautions: ["Maximum 4 tablets in 24 hours", "Take with food"],
    dosage: "1 tablet every 6-8 hours",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Becosules Capsules",
    genericName: "Vitamin B Complex",
    category: "Supplements",
    price: 89,
    originalPrice: 110,
    rating: 4.4,
    reviewsCount: 234,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 100,
    manufacturer: "Pfizer",
    description: "Complete B-complex vitamin for energy and nerve health",
    activeIngredient: "Vitamin B Complex",
    strength: "Multi B vitamins",
    form: "Capsule",
    uses: ["Energy boost", "Nerve health", "Hair growth", "Skin health"],
    sideEffects: ["Yellow coloration of urine", "Mild nausea"],
    precautions: ["Take after meals", "Maintain regular dosing"],
    dosage: "1 capsule daily after breakfast",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Digene Antacid Gel",
    genericName: "Simethicone + Magnesium Hydroxide",
    category: "Digestive Health",
    price: 45,
    originalPrice: 55,
    rating: 4.3,
    reviewsCount: 178,
    image: "https://images.unsplash.com/photo-1583244685026-d8519b5e7be7?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 80,
    manufacturer: "Abbott",
    description: "Fast relief from acidity and gas",
    activeIngredient: "Simethicone + Magnesium Hydroxide",
    strength: "50mg + 400mg per 10ml",
    form: "Syrup",
    uses: ["Acidity", "Gas", "Bloating", "Indigestion"],
    sideEffects: ["Diarrhea", "Constipation", "Stomach cramps"],
    precautions: ["Shake well before use", "Do not exceed 8 doses per day"],
    dosage: "1-2 teaspoons after meals",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Volini Pain Relief Gel",
    genericName: "Diclofenac Diethylamine",
    category: "Pain Relief",
    price: 125,
    originalPrice: 145,
    rating: 4.2,
    reviewsCount: 289,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 75,
    manufacturer: "Ranbaxy",
    description: "Topical pain relief gel for muscle and joint pain",
    activeIngredient: "Diclofenac Diethylamine",
    strength: "1.16% w/w",
    form: "Cream",
    uses: ["Muscle pain", "Joint pain", "Sports injuries", "Back pain"],
    sideEffects: ["Skin irritation", "Redness", "Burning sensation"],
    precautions: ["For external use only", "Avoid contact with eyes", "Do not use on broken skin"],
    dosage: "Apply 2-4 times daily on affected area",
    isFeatured: true,
    isActive: true
  },
  {
    name: "Livogen-Z Tablets", 
    genericName: "Iron + Folic Acid + Zinc",
    category: "Supplements",
    price: 145,
    originalPrice: 175,
    rating: 4.1,
    reviewsCount: 156,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400",
    prescriptionRequired: false,
    inStock: true,
    stockQuantity: 90,
    manufacturer: "Merck",
    description: "Iron supplement for anemia and iron deficiency",
    activeIngredient: "Iron + Folic Acid + Zinc",
    strength: "100mg + 1.5mg + 22.5mg",
    form: "Tablet",
    uses: ["Iron deficiency anemia", "Pregnancy nutrition", "General weakness", "Hair loss"],
    sideEffects: ["Nausea", "Constipation", "Dark stools", "Metallic taste"],
    precautions: ["Take on empty stomach", "Avoid with tea/coffee", "May cause dark stools"],
    dosage: "1 tablet daily before breakfast",
    isFeatured: true,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🗄️  Connected to MongoDB');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('🗑️  Cleared existing medicines');

    // Insert sample medicines
    await Medicine.insertMany(medicines);
    console.log('✅ Sample medicines inserted');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@avaxen.com' });
    if (!adminExists) {
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@avaxen.com',
        password: 'admin123',
        phone: '+91 9876543210',
        role: 'admin'
      });
      await admin.save();
      console.log('👨‍💼 Admin user created');
    }

    // Create pharmacist user if doesn't exist
    const pharmacistExists = await User.findOne({ email: 'pharmacist@avaxen.com' });
    if (!pharmacistExists) {
      const pharmacist = new User({
        firstName: 'John',
        lastName: 'Pharmacist',
        email: 'pharmacist@avaxen.com',
        password: 'pharma123',
        phone: '+91 9876543211',
        role: 'pharmacist'
      });
      await pharmacist.save();
      console.log('💊 Pharmacist user created');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
