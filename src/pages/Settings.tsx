
import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Paintbrush,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Settings = () => {
  const { toast } = useToast();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@medicore.com",
    phone: "+91 98765 43210",
    role: "Cardiologist",
    department: "Cardiology",
    bio: "Experienced cardiologist with over 10 years of practice in diagnosing and treating heart conditions.",
    profilePicture: "/assets/doctor-image.jpg"
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    inAppNotifications: true,
    appointmentReminders: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    fontSize: "medium",
    compactMode: false,
    highContrast: false,
  });

  // Handle account form changes
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification toggle
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle security toggle
  const handleSecurityToggle = (setting: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  // Handle appearance changes
  const handleAppearanceChange = (setting: string, value: any) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle upload image
  const handleUploadImage = () => {
    if (selectedFile) {
      setAccountSettings(prev => ({
        ...prev,
        profilePicture: previewUrl || prev.profilePicture
      }));
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
      setShowUploadDialog(false);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setAccountSettings(prev => ({
      ...prev,
      profilePicture: ""
    }));
    toast({
      title: "Profile Picture Removed",
      description: "Your profile picture has been removed.",
    });
    setShowUploadDialog(false);
  };

  // Handle save account settings
  const handleSaveAccount = () => {
    toast({
      title: "Account Settings Saved",
      description: "Your account information has been updated successfully.",
    });
  };

  // Handle save security settings
  const handleSaveSecurity = () => {
    // Validation
    if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (securitySettings.newPassword && !securitySettings.currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Security Settings Saved",
      description: "Your security settings have been updated successfully.",
    });
    
    // Reset password fields
    setSecuritySettings(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  // Handle save appearance settings
  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Settings Saved",
      description: "Your appearance preferences have been updated successfully.",
    });
  };

  // Avatar fallback initials
  const avatarInitials = `${accountSettings.firstName.charAt(0)}${accountSettings.lastName.charAt(0)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex items-center">
            <User className="h-4 w-4 mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Paintbrush className="h-4 w-4 mr-2" /> Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={accountSettings.profilePicture} />
                    <AvatarFallback className="text-2xl bg-hospital-primary text-white">{avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div className="mt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowUploadDialog(true)}
                    >
                      Change Photo
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={handleRemoveImage}
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={accountSettings.firstName}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={accountSettings.lastName}
                        onChange={handleAccountChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={accountSettings.email}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={accountSettings.phone}
                        onChange={handleAccountChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        name="role"
                        value={accountSettings.role}
                        onChange={handleAccountChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={accountSettings.department}
                        onChange={handleAccountChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={accountSettings.bio}
                      onChange={handleAccountChange}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveAccount}>Save Changes</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications" className="font-medium">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={() => handleNotificationToggle("smsNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications" className="font-medium">Push Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={() => handleNotificationToggle("pushNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inAppNotifications" className="font-medium">In-App Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications within the application
                      </p>
                    </div>
                    <Switch
                      id="inAppNotifications"
                      checked={notificationSettings.inAppNotifications}
                      onCheckedChange={() => handleNotificationToggle("inAppNotifications")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appointmentReminders" className="font-medium">Appointment Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Reminders about upcoming appointments
                      </p>
                    </div>
                    <Switch
                      id="appointmentReminders"
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={() => handleNotificationToggle("appointmentReminders")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemUpdates" className="font-medium">System Updates</Label>
                      <p className="text-sm text-gray-500">
                        Updates about system maintenance and new features
                      </p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketingEmails" className="font-medium">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Promotional emails and newsletters
                      </p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => {
                  toast({
                    title: "Notification Settings Saved",
                    description: "Your notification preferences have been updated successfully.",
                  });
                }}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={handleSecurityChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={securitySettings.newPassword}
                        onChange={handleSecurityChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={securitySettings.confirmPassword}
                        onChange={handleSecurityChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth" className="font-medium">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityToggle("twoFactorAuth")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginNotifications" className="font-medium">Get alerts on new logins</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications when your account is accessed from a new device
                    </p>
                  </div>
                  <Switch
                    id="loginNotifications"
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={() => handleSecurityToggle("loginNotifications")}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select timeout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                      appearanceSettings.theme === "light" ? "border-primary bg-accent" : "border-gray-200"
                    }`}
                    onClick={() => handleAppearanceChange("theme", "light")}
                  >
                    <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2">
                      <Sun className="h-6 w-6 text-yellow-500" />
                    </div>
                    <span>Light</span>
                    {appearanceSettings.theme === "light" && (
                      <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                    )}
                  </div>
                  <div
                    className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                      appearanceSettings.theme === "dark" ? "border-primary bg-accent" : "border-gray-200"
                    }`}
                    onClick={() => handleAppearanceChange("theme", "dark")}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center mb-2">
                      <Moon className="h-6 w-6 text-gray-300" />
                    </div>
                    <span>Dark</span>
                    {appearanceSettings.theme === "dark" && (
                      <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                    )}
                  </div>
                  <div
                    className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                      appearanceSettings.theme === "system" ? "border-primary bg-accent" : "border-gray-200"
                    }`}
                    onClick={() => handleAppearanceChange("theme", "system")}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white to-gray-900 flex items-center justify-center mb-2">
                      <Laptop className="h-6 w-6 text-blue-500" />
                    </div>
                    <span>System</span>
                    {appearanceSettings.theme === "system" && (
                      <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Font Size</h3>
                <div className="space-y-2">
                  <Select
                    value={appearanceSettings.fontSize}
                    onValueChange={(value) => handleAppearanceChange("fontSize", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium (Default)</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactMode" className="font-medium">Compact Mode</Label>
                      <p className="text-sm text-gray-500">
                        Show more content with reduced spacing
                      </p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={appearanceSettings.compactMode}
                      onCheckedChange={(checked) => handleAppearanceChange("compactMode", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="highContrast" className="font-medium">High Contrast</Label>
                      <p className="text-sm text-gray-500">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={appearanceSettings.highContrast}
                      onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAppearance}>Save Appearance Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture or remove the current one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              {previewUrl ? (
                <div className="relative w-32 h-32">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              ) : (
                <Avatar className="w-32 h-32">
                  <AvatarImage src={accountSettings.profilePicture} />
                  <AvatarFallback className="text-2xl bg-hospital-primary text-white">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Upload Image</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between">
            <Button 
              variant="outline" 
              onClick={handleRemoveImage} 
              className="sm:order-1"
            >
              Remove Photo
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUploadImage} 
                disabled={!selectedFile}
              >
                Upload
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
