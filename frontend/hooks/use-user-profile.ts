"use client";

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

interface MedicalProfile {
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bloodGroup: string;
  dateOfBirth: string;
  height: number;
  weight: number;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  medicalProfile: MedicalProfile;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminderTime: string;
    languagePreference: string;
  };
  accountSecurity: {
    twoFactorEnabled: boolean;
    lastLoginAt: Date;
    loginAttempts: number;
    securityQuestions: Array<{
      question: string;
      answer: string;
    }>;
  };
  role: 'customer' | 'admin' | 'pharmacy_staff';
  createdAt: Date;
  updatedAt: Date;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sendNotification } = useNotifications();

  // Load user profile from storage/API
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // In production, this would be an API call
      const storedProfile = localStorage.getItem('userProfile');
      
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile({
          ...parsedProfile,
          createdAt: new Date(parsedProfile.createdAt),
          updatedAt: new Date(parsedProfile.updatedAt),
          accountSecurity: {
            ...parsedProfile.accountSecurity,
            lastLoginAt: new Date(parsedProfile.accountSecurity.lastLoginAt)
          }
        });
      } else {
        // Don't create default profile - let user profile be empty until they fill it
        setProfile(null);
      }
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Profile loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      if (!profile) return false;

      const updatedProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date()
      };

      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      // Send notification for significant changes
      if (updates.medicalProfile || updates.address) {
        await sendNotification({
          type: 'order_confirmed',
          customerEmail: profile.email,
          customerName: profile.name,
          orderId: 'PROFILE_UPDATE',
          orderDetails: { type: 'Profile Update' }
        });
      }

      return true;
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
      return false;
    }
  };

  const updateMedicalProfile = async (medicalUpdates: Partial<MedicalProfile>): Promise<boolean> => {
    if (!profile) return false;

    const updatedMedicalProfile = {
      ...profile.medicalProfile,
      ...medicalUpdates
    };

    return await updateProfile({ medicalProfile: updatedMedicalProfile });
  };

  const enableTwoFactor = async (): Promise<boolean> => {
    try {
      if (!profile) return false;

      // In production, this would generate and send OTP
      const success = await updateProfile({
        accountSecurity: {
          ...profile.accountSecurity,
          twoFactorEnabled: true
        }
      });

      if (success) {
        await sendNotification({
          type: 'order_confirmed',
          customerEmail: profile.email,
          customerName: profile.name,
          orderId: 'SECURITY_UPDATE',
          orderDetails: { type: 'Two-Factor Authentication Enabled' }
        });
      }

      return success;
    } catch (err) {
      setError('Failed to enable two-factor authentication');
      console.error('2FA error:', err);
      return false;
    }
  };

  const addAllergy = async (allergy: string): Promise<boolean> => {
    if (!profile) return false;

    const currentAllergies = profile.medicalProfile.allergies;
    if (currentAllergies.includes(allergy)) return true;

    return await updateMedicalProfile({
      allergies: [...currentAllergies, allergy]
    });
  };

  const removeAllergy = async (allergy: string): Promise<boolean> => {
    if (!profile) return false;

    const updatedAllergies = profile.medicalProfile.allergies.filter(a => a !== allergy);
    return await updateMedicalProfile({ allergies: updatedAllergies });
  };

  const addMedication = async (medication: string): Promise<boolean> => {
    if (!profile) return false;

    const currentMeds = profile.medicalProfile.currentMedications;
    if (currentMeds.includes(medication)) return true;

    return await updateMedicalProfile({
      currentMedications: [...currentMeds, medication]
    });
  };

  const removeMedication = async (medication: string): Promise<boolean> => {
    if (!profile) return false;

    const updatedMeds = profile.medicalProfile.currentMedications.filter(m => m !== medication);
    return await updateMedicalProfile({ currentMedications: updatedMeds });
  };

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>): Promise<boolean> => {
    if (!profile) return false;

    const updatedPreferences = {
      ...profile.preferences,
      ...preferences
    };

    return await updateProfile({ preferences: updatedPreferences });
  };

  const getHealthSummary = () => {
    if (!profile) return null;

    const { medicalProfile } = profile;
    const age = new Date().getFullYear() - new Date(medicalProfile.dateOfBirth).getFullYear();
    const bmi = medicalProfile.weight / Math.pow(medicalProfile.height / 100, 2);

    return {
      age,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese',
      allergyCount: medicalProfile.allergies.length,
      medicationCount: medicalProfile.currentMedications.length,
      conditionCount: medicalProfile.chronicConditions.length,
      hasInsurance: !!medicalProfile.insuranceProvider
    };
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updateMedicalProfile,
    enableTwoFactor,
    addAllergy,
    removeAllergy,
    addMedication,
    removeMedication,
    updatePreferences,
    getHealthSummary,
    refreshProfile: loadUserProfile
  };
}
