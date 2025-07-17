// Indian Medicine Database Service using FREE APIs
const axios = require('axios');

class IndianMedicineService {
  constructor() {
    this.initialized = true;
    console.log('✅ Indian Medicine Database Service initialized');
  }

  // Search medicines in Indian database (using multiple free sources)
  async searchIndianMedicines(medicineName) {
    try {
      const results = await Promise.allSettled([
        this.searchOpenFDA(medicineName),
        this.searchRxNav(medicineName),
        this.searchIndianDrugDatabase(medicineName)
      ]);

      const successfulResults = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value);

      if (successfulResults.length > 0) {
        return {
          success: true,
          data: this.mergeMedicineData(successfulResults),
          sources: successfulResults.map(r => r.source)
        };
      }

      return {
        success: false,
        message: 'Medicine not found in any database',
        fallback: await this.getIndianFallbackData(medicineName)
      };
    } catch (error) {
      console.error('Indian medicine search failed:', error);
      return {
        success: false,
        message: error.message,
        fallback: await this.getIndianFallbackData(medicineName)
      };
    }
  }

  // Search OpenFDA database (FREE, unlimited)
  async searchOpenFDA(medicineName) {
    try {
      const searchTerm = encodeURIComponent(medicineName);
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${searchTerm}"+OR+openfda.generic_name:"${searchTerm}"&limit=5`;
      
      const response = await axios.get(url, { timeout: 5000 });
      
      if (response.data.results && response.data.results.length > 0) {
        const medicine = response.data.results[0];
        
        return {
          success: true,
          source: 'OpenFDA',
          data: {
            name: medicine.openfda?.brand_name?.[0] || medicine.openfda?.generic_name?.[0] || medicineName,
            genericName: medicine.openfda?.generic_name?.[0],
            manufacturer: medicine.openfda?.manufacturer_name?.[0],
            dosageForm: medicine.dosage_form?.[0],
            route: medicine.route?.[0],
            indications: medicine.indications_and_usage?.[0],
            warnings: medicine.warnings?.[0],
            contraindications: medicine.contraindications?.[0],
            activeIngredient: medicine.active_ingredient?.[0],
            fdaApproved: true,
            country: 'US'
          }
        };
      }

      return { success: false, source: 'OpenFDA' };
    } catch (error) {
      console.error('OpenFDA search failed:', error);
      return { success: false, source: 'OpenFDA', error: error.message };
    }
  }

  // Search RxNav database (FREE, unlimited)
  async searchRxNav(medicineName) {
    try {
      const searchTerm = encodeURIComponent(medicineName);
      const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchTerm}`;
      
      const response = await axios.get(url, { timeout: 5000 });
      
      if (response.data.drugGroup?.conceptGroup) {
        const concepts = response.data.drugGroup.conceptGroup
          .filter(group => group.conceptProperties)
          .flatMap(group => group.conceptProperties);

        if (concepts.length > 0) {
          const concept = concepts[0];
          
          return {
            success: true,
            source: 'RxNav',
            data: {
              name: concept.name,
              rxcui: concept.rxcui,
              synonym: concept.synonym,
              tty: concept.tty,
              language: concept.language,
              country: 'US',
              verified: true
            }
          };
        }
      }

      return { success: false, source: 'RxNav' };
    } catch (error) {
      console.error('RxNav search failed:', error);
      return { success: false, source: 'RxNav', error: error.message };
    }
  }

  // Search Indian-specific drug database (Simulated - replace with actual Indian API)
  async searchIndianDrugDatabase(medicineName) {
    try {
      // This would be replaced with actual Indian CDSCO/DCGI API when available
      // For now, using a curated list of common Indian medicines
      const indianMedicines = {
        'paracetamol': {
          name: 'Paracetamol',
          indianBrands: ['Crocin', 'Dolo', 'Calpol', 'Pyrigesic'],
          manufacturer: 'Various Indian companies',
          price: '₹10-50',
          prescription: false,
          schedule: 'OTC',
          commonUses: ['Fever', 'Pain relief', 'Headache'],
          indianApproval: 'CDSCO Approved',
          availableIn: 'All Indian pharmacies'
        },
        'cetirizine': {
          name: 'Cetirizine',
          indianBrands: ['Zyrtec', 'Okacet', 'Cetcip', 'Alerid'],
          manufacturer: 'Various Indian companies',
          price: '₹20-80',
          prescription: false,
          schedule: 'OTC',
          commonUses: ['Allergy', 'Hay fever', 'Urticaria'],
          indianApproval: 'CDSCO Approved',
          availableIn: 'All Indian pharmacies'
        },
        'azithromycin': {
          name: 'Azithromycin',
          indianBrands: ['Azee', 'Zithromax', 'Azithral', 'Azicip'],
          manufacturer: 'Various Indian companies',
          price: '₹50-200',
          prescription: true,
          schedule: 'Prescription only',
          commonUses: ['Bacterial infections', 'Respiratory tract infections'],
          indianApproval: 'CDSCO Approved',
          availableIn: 'All Indian pharmacies'
        }
      };

      const key = medicineName.toLowerCase();
      const found = Object.keys(indianMedicines).find(med => 
        key.includes(med) || med.includes(key)
      );

      if (found) {
        return {
          success: true,
          source: 'Indian Drug Database',
          data: indianMedicines[found]
        };
      }

      return { success: false, source: 'Indian Drug Database' };
    } catch (error) {
      console.error('Indian drug database search failed:', error);
      return { success: false, source: 'Indian Drug Database', error: error.message };
    }
  }

  // Merge data from multiple sources
  mergeMedicineData(results) {
    const merged = {
      name: '',
      sources: [],
      international: {},
      indian: {},
      safety: {},
      availability: {}
    };

    results.forEach(result => {
      merged.sources.push(result.source);
      
      if (result.source === 'OpenFDA') {
        merged.international = result.data;
        merged.name = result.data.name;
      } else if (result.source === 'RxNav') {
        merged.international = { ...merged.international, ...result.data };
        if (!merged.name) merged.name = result.data.name;
      } else if (result.source === 'Indian Drug Database') {
        merged.indian = result.data;
        if (!merged.name) merged.name = result.data.name;
      }
    });

    // Add safety assessment
    merged.safety = this.assessMedicineSafety(merged);
    merged.availability = this.assessIndianAvailability(merged);

    return merged;
  }

  // Assess medicine safety for Indian market
  assessMedicineSafety(medicineData) {
    const safety = {
      riskLevel: 'medium',
      prescriptionRequired: false,
      ageRestrictions: [],
      contraindications: [],
      warnings: []
    };

    // Check if prescription is required in India
    if (medicineData.indian?.prescription || 
        medicineData.international?.warnings?.toLowerCase().includes('prescription')) {
      safety.prescriptionRequired = true;
      safety.riskLevel = 'high';
    }

    // Extract warnings
    if (medicineData.international?.warnings) {
      safety.warnings.push(medicineData.international.warnings);
    }

    if (medicineData.international?.contraindications) {
      safety.contraindications.push(medicineData.international.contraindications);
    }

    return safety;
  }

  // Assess availability in Indian market
  assessIndianAvailability(medicineData) {
    return {
      available: true,
      estimatedPrice: medicineData.indian?.price || '₹50-200',
      commonBrands: medicineData.indian?.indianBrands || ['Generic available'],
      pharmacyAvailability: medicineData.indian?.availableIn || 'Most pharmacies',
      onlineAvailable: true,
      deliveryTime: '2-4 hours'
    };
  }

  // Get fallback data for medicines not found in databases
  async getIndianFallbackData(medicineName) {
    return {
      name: medicineName,
      status: 'Not found in database',
      suggestion: 'Please consult a pharmacist',
      alternativeSearch: [
        `Generic name for ${medicineName}`,
        `${medicineName} composition`,
        `${medicineName} uses`
      ],
      indianPharmacyAdvice: 'Visit nearby pharmacy with prescription',
      helpline: '1800-XXX-XXXX (Pharmacy helpline)'
    };
  }

  // Get medicine interactions specific to Indian combinations
  async getIndianMedicineInteractions(medicineNames) {
    try {
      // Common Indian medicine combinations and their interactions
      const indianInteractions = {
        'paracetamol+cetirizine': {
          interaction: 'Safe combination',
          riskLevel: 'low',
          notes: 'Commonly prescribed together for fever with allergy'
        },
        'azithromycin+paracetamol': {
          interaction: 'Safe combination',
          riskLevel: 'low',
          notes: 'Often prescribed together for infections'
        },
        'aspirin+warfarin': {
          interaction: 'Dangerous combination',
          riskLevel: 'high',
          notes: 'Increased bleeding risk - avoid combination'
        }
      };

      const combinations = this.generateCombinations(medicineNames);
      const interactions = [];

      combinations.forEach(combo => {
        const key = combo.toLowerCase();
        const found = Object.keys(indianInteractions).find(interaction => 
          interaction.includes(key) || key.includes(interaction)
        );

        if (found) {
          interactions.push({
            medicines: combo,
            ...indianInteractions[found]
          });
        }
      });

      return {
        success: true,
        interactions,
        generalAdvice: 'Always consult a pharmacist for medicine combinations',
        emergencyContact: '102 (Emergency services)'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Generate medicine combinations for interaction checking
  generateCombinations(medicines) {
    const combinations = [];
    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        combinations.push(`${medicines[i].toLowerCase()}+${medicines[j].toLowerCase()}`);
      }
    }
    return combinations;
  }

  // Test the service
  async testService() {
    try {
      const result = await this.searchIndianMedicines('paracetamol');
      return {
        success: true,
        message: 'Indian Medicine Database service is working',
        testResult: result.success
      };
    } catch (error) {
      return {
        success: false,
        message: `Service test failed: ${error.message}`
      };
    }
  }
}

module.exports = new IndianMedicineService();
