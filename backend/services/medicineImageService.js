const axios = require('axios');
const Medicine = require('../models/Medicine');

class MedicineImageService {
  constructor() {
    this.fallbackImages = {
      'Pain Relief': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      'Antibiotics': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
      'Supplements': 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400',
      'Digestive Health': 'https://images.unsplash.com/photo-1583244685026-d8519b5e7be7?w=400',
      'Allergy': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      'default': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400'
    };
  }

  // Option 1: FDA API Integration
  async fetchFromFDA(medicineName, genericName) {
    try {
      const searchTerm = encodeURIComponent(genericName || medicineName);
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${searchTerm}"&limit=1`;
      
      const response = await axios.get(url);
      
      if (response.data.results && response.data.results.length > 0) {
        const drug = response.data.results[0];
        // FDA doesn't provide images, but we can get detailed info
        return {
          success: false,
          data: drug,
          message: 'FDA API does not provide images'
        };
      }
      
      return { success: false, message: 'Medicine not found in FDA database' };
    } catch (error) {
      console.error('FDA API error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Option 2: Drug Bank API (Requires subscription)
  async fetchFromDrugBank(medicineName) {
    try {
      // This would require DrugBank API key
      const apiKey = process.env.DRUGBANK_API_KEY;
      if (!apiKey) {
        return { success: false, message: 'DrugBank API key not configured' };
      }

      const url = `https://go.drugbank.com/public_api/v1/drugs.json`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        params: {
          q: medicineName
        }
      });

      // DrugBank provides detailed drug information but limited images
      return {
        success: true,
        data: response.data,
        hasImage: false
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Option 3: RxNav API (Free, no images but good for verification)
  async fetchFromRxNav(medicineName) {
    try {
      const searchTerm = encodeURIComponent(medicineName);
      const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchTerm}`;
      
      const response = await axios.get(url);
      
      if (response.data.drugGroup && response.data.drugGroup.conceptGroup) {
        return {
          success: true,
          data: response.data,
          hasImage: false,
          message: 'RxNav provides drug info but no images'
        };
      }
      
      return { success: false, message: 'Medicine not found in RxNav' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Option 4: Web Scraping Medicine Websites (Use with caution)
  async scrapePharmacyImages(medicineName) {
    try {
      // This is a simplified example - in production, use proper scraping tools
      // and respect robots.txt and terms of service
      
      const searchResults = await this.searchGoogleImages(medicineName);
      
      if (searchResults && searchResults.length > 0) {
        // Filter for pharmacy/medical sites
        const pharmacyImages = searchResults.filter(img => 
          img.url.includes('pharmacy') || 
          img.url.includes('medical') ||
          img.url.includes('pharma')
        );
        
        return {
          success: true,
          images: pharmacyImages.slice(0, 3), // Top 3 results
          source: 'web_scraping'
        };
      }
      
      return { success: false, message: 'No suitable images found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Option 5: AI-Generated Placeholder Images
  async generateAIPlaceholder(medicine) {
    try {
      // Using placeholder.com with medicine-specific styling
      const { name, category, form, manufacturer } = medicine;
      
      const color = this.getCategoryColor(category);
      const text = encodeURIComponent(name.substring(0, 15));
      
      const placeholderUrl = `https://via.placeholder.com/400x400/${color}/ffffff.png?text=${text}`;
      
      // For production, you could use services like:
      // - DALL-E API for AI-generated medicine images
      // - Stable Diffusion API
      // - Custom trained models for pharmaceutical products
      
      return {
        success: true,
        imageUrl: placeholderUrl,
        type: 'ai_placeholder',
        prompt: `Medicine package for ${name}, ${form} form, ${category} category`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Main function to get medicine image from multiple sources
  async getMedicineImage(medicineId, options = {}) {
    try {
      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        throw new Error('Medicine not found');
      }

      // Return existing image if available and not expired
      if (medicine.image && !options.forceRefresh) {
        return {
          success: true,
          imageUrl: medicine.image,
          source: 'database'
        };
      }

      const { name, genericName, category } = medicine;
      
      // Try multiple sources in order of preference
      const sources = [
        () => this.fetchFromFDA(name, genericName),
        () => this.fetchFromRxNav(name),
        () => this.scrapePharmacyImages(name),
        () => this.generateAIPlaceholder(medicine)
      ];

      for (const source of sources) {
        const result = await source();
        if (result.success && result.imageUrl) {
          // Update medicine with new image
          medicine.image = result.imageUrl;
          medicine.imageSource = result.source || 'external';
          medicine.imageUpdatedAt = new Date();
          await medicine.save();
          
          return result;
        }
      }

      // Fallback to category-based stock image
      const fallbackImage = this.fallbackImages[category] || this.fallbackImages.default;
      medicine.image = fallbackImage;
      medicine.imageSource = 'fallback';
      await medicine.save();

      return {
        success: true,
        imageUrl: fallbackImage,
        source: 'fallback'
      };

    } catch (error) {
      console.error('Error getting medicine image:', error);
      return { success: false, error: error.message };
    }
  }

  // Bulk update images for all medicines
  async updateAllMedicineImages(batchSize = 10) {
    try {
      const medicines = await Medicine.find({ 
        $or: [
          { image: { $exists: false } },
          { image: '' },
          { imageUpdatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // Older than 30 days
        ]
      }).limit(batchSize);

      const results = {
        processed: 0,
        successful: 0,
        failed: 0,
        errors: []
      };

      for (const medicine of medicines) {
        try {
          const result = await this.getMedicineImage(medicine._id, { forceRefresh: true });
          if (result.success) {
            results.successful++;
          } else {
            results.failed++;
            results.errors.push({
              medicineId: medicine._id,
              name: medicine.name,
              error: result.error
            });
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            medicineId: medicine._id,
            name: medicine.name,
            error: error.message
          });
        }
        
        results.processed++;
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return results;
    } catch (error) {
      console.error('Bulk update error:', error);
      return { success: false, error: error.message };
    }
  }

  getCategoryColor(category) {
    const colors = {
      'Pain Relief': '3b82f6',
      'Antibiotics': '10b981',
      'Supplements': 'f59e0b',
      'Digestive Health': '8b5cf6',
      'Allergy': 'ef4444'
    };
    return colors[category] || '6b7280';
  }

  async searchGoogleImages(query) {
    // This would require Google Custom Search API
    // For demo purposes, returning mock data
    return [
      {
        url: `https://example.com/medicine-${query.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        title: `${query} Medicine Image`,
        source: 'example-pharmacy.com'
      }
    ];
  }
}

module.exports = new MedicineImageService();
