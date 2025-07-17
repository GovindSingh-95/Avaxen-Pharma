"use client";

import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Heart, Shield, Bell, User, MapPin, Phone, Mail, Plus, X } from 'lucide-react';

export default function EnhancedProfilePage() {
  const { profile: originalProfile, isLoading, updateProfile, updateMedicalProfile, enableTwoFactor, addAllergy, removeAllergy, getHealthSummary } = useUserProfile();
  const { showToast } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [profile, setProfile] = useState(originalProfile);

  // Update local profile state when original profile changes
  useEffect(() => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
  }, [originalProfile]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const healthSummary = getHealthSummary();

  const handleSaveProfile = async () => {
    const success = await updateProfile(profile);
    if (success) {
      setIsEditing(false);
      showToast('success', 'Profile Updated', 'Your profile has been saved successfully');
    } else {
      showToast('error', 'Update Failed', 'Could not save your profile changes');
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleAddAllergy = async () => {
    if (newAllergy.trim()) {
      const success = await addAllergy(newAllergy.trim());
      if (success) {
        setNewAllergy('');
        showToast('success', 'Allergy Added', `Added ${newAllergy} to your medical profile`);
      }
    }
  };

  const handleRemoveAllergy = async (allergy: string) => {
    const success = await removeAllergy(allergy);
    if (success) {
      showToast('success', 'Allergy Removed', `Removed ${allergy} from your profile`);
    }
  };

  const handleEnableTwoFactor = async () => {
    const success = await enableTwoFactor();
    if (success) {
      showToast('success', '2FA Enabled', 'Two-factor authentication has been enabled');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👤 My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account and medical information</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Summary Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Health Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthSummary && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Age:</span>
                      <span className="text-sm">{healthSummary.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">BMI:</span>
                      <Badge variant={healthSummary.bmi < 25 ? 'default' : 'destructive'}>
                        {healthSummary.bmi} ({healthSummary.bmiCategory})
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Blood Group:</span>
                      <span className="text-sm font-bold text-red-600">{profile.medicalProfile.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Allergies:</span>
                      <span className="text-sm">{healthSummary.allergyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Medications:</span>
                      <span className="text-sm">{healthSummary.medicationCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Insurance:</span>
                      <Badge variant={healthSummary.hasInsurance ? 'default' : 'secondary'}>
                        {healthSummary.hasInsurance ? 'Covered' : 'None'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.medicalProfile.dateOfBirth}
                      onChange={(e) => updateMedicalProfile({dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={`${profile.address.street}, ${profile.address.city}, ${profile.address.state} ${profile.address.zipCode}`}
                    onChange={(e) => {
                      // Simple address parsing for demo
                      const parts = e.target.value.split(',');
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          street: parts[0]?.trim() || '',
                          city: parts[1]?.trim() || '',
                          state: parts[2]?.trim() || '',
                          zipCode: parts[3]?.trim() || ''
                        }
                      });
                    }}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">⚠️ Allergies</CardTitle>
                <CardDescription>Manage your known allergies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add new allergy..."
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                  />
                  <Button onClick={handleAddAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.medicalProfile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveAllergy(allergy)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">💊 Current Medications</CardTitle>
                <CardDescription>Your active prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.medicalProfile.currentMedications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="font-medium">{med}</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Physical Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">📏 Physical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.medicalProfile.height}
                      onChange={(e) => updateMedicalProfile({height: parseInt(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.medicalProfile.weight}
                      onChange={(e) => updateMedicalProfile({weight: parseInt(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      value={profile.medicalProfile.bloodGroup}
                      onChange={(e) => updateMedicalProfile({bloodGroup: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">🚨 Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emergencyName">Name</Label>
                  <Input
                    id="emergencyName"
                    value={profile.medicalProfile.emergencyContact.name}
                    onChange={(e) => updateMedicalProfile({
                      emergencyContact: {
                        ...profile.medicalProfile.emergencyContact,
                        name: e.target.value
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={profile.medicalProfile.emergencyContact.phone}
                    onChange={(e) => updateMedicalProfile({
                      emergencyContact: {
                        ...profile.medicalProfile.emergencyContact,
                        phone: e.target.value
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={profile.medicalProfile.emergencyContact.relationship}
                    onChange={(e) => updateMedicalProfile({
                      emergencyContact: {
                        ...profile.medicalProfile.emergencyContact,
                        relationship: e.target.value
                      }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={profile.accountSecurity.twoFactorEnabled ? 'default' : 'secondary'}>
                    {profile.accountSecurity.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  {!profile.accountSecurity.twoFactorEnabled && (
                    <Button onClick={handleEnableTwoFactor} size="sm">
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Login Activity</h4>
                <div className="text-sm text-gray-600">
                  <p>Last login: {profile.accountSecurity.lastLoginAt.toLocaleString()}</p>
                  <p>Failed attempts: {profile.accountSecurity.loginAttempts}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Change Password</h4>
                <Button variant="outline">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive order updates via email</p>
                </div>
                <Switch
                  checked={profile.preferences.emailNotifications}
                  onCheckedChange={(checked) => 
                    updateProfile({
                      preferences: { ...profile.preferences, emailNotifications: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                </div>
                <Switch
                  checked={profile.preferences.smsNotifications}
                  onCheckedChange={(checked) => 
                    updateProfile({
                      preferences: { ...profile.preferences, smsNotifications: checked }
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="reminderTime">Daily Reminder Time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={profile.preferences.reminderTime}
                  onChange={(e) => 
                    updateProfile({
                      preferences: { ...profile.preferences, reminderTime: e.target.value }
                    })
                  }
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
