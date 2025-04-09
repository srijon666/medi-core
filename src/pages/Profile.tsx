import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Edit,
  CalendarClock,
  MapPin,
  Stethoscope,
  Award,
  Calendar
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DoctorSchedule {
  day: string;
  startTime: string;
  endTime: string;
  patients: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Doctor profile data
  const [doctorProfile, setDoctorProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@healthgrid.com",
    phone: "+91 98765 43210",
    role: "Cardiologist",
    department: "Cardiology",
    bio: "Experienced cardiologist with over 10 years of practice in diagnosing and treating heart conditions. Specialized in interventional cardiology and cardiac imaging.",
    address: "123 Medical Plaza, Bangalore, Karnataka",
    experience: "10+ years",
    education: [
      { degree: "MD in Cardiology", institution: "All India Institute of Medical Sciences", year: "2009-2012" },
      { degree: "MBBS", institution: "Bangalore Medical College", year: "2003-2008" }
    ],
    certifications: [
      { name: "Board Certified in Cardiology", year: "2013" },
      { name: "Advanced Cardiac Life Support (ACLS)", year: "2020" }
    ],
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "17:00", patients: 12 },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00", patients: 10 },
      { day: "Wednesday", startTime: "09:00", endTime: "13:00", patients: 6 },
      { day: "Thursday", startTime: "09:00", endTime: "17:00", patients: 11 },
      { day: "Friday", startTime: "09:00", endTime: "17:00", patients: 9 },
    ],
    profilePicture: "/assets/doctor-image.jpg"
  });

  // Selected file for profile picture
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
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
      setDoctorProfile(prev => ({
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
    setDoctorProfile(prev => ({
      ...prev,
      profilePicture: ""
    }));
    toast({
      title: "Profile Picture Removed",
      description: "Your profile picture has been removed.",
    });
    setShowUploadDialog(false);
  };

  // Full Name
  const fullName = `Dr. ${doctorProfile.firstName} ${doctorProfile.lastName}`;
  
  // Avatar initials
  const avatarInitials = `${doctorProfile.firstName.charAt(0)}${doctorProfile.lastName.charAt(0)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="profile">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor Profile</h1>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="education">Education & Certifications</TabsTrigger>
          </TabsList>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-hospital-primary">
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={doctorProfile.profilePicture} />
                    <AvatarFallback className="text-2xl bg-hospital-primary text-white">
                      {avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <span className="text-white text-xs font-medium">Change Photo</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mt-4">{fullName}</h2>
                  <p className="text-gray-600">{doctorProfile.role}</p>
                </div>

                <div className="w-full space-y-3 pt-4 border-t">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{doctorProfile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{doctorProfile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{doctorProfile.department} Department</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{doctorProfile.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEditing ? "Edit Profile Information" : "About Doctor"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={doctorProfile.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={doctorProfile.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={doctorProfile.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={doctorProfile.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input 
                          id="role"
                          name="role"
                          value={doctorProfile.role}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department"
                          name="department"
                          value={doctorProfile.department}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address"
                        name="address"
                        value={doctorProfile.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio"
                        name="bio"
                        rows={5}
                        value={doctorProfile.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button className="bg-hospital-primary" onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start mb-6">
                      <Briefcase className="h-5 w-5 mr-2 text-hospital-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Experience</h3>
                        <p className="text-gray-600">{doctorProfile.experience}</p>
                      </div>
                    </div>
                    <div className="py-4 px-5 bg-gray-50 rounded-lg mb-6">
                      <p className="text-gray-700">{doctorProfile.bio}</p>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 mr-2 text-hospital-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Email Address</h3>
                          <p className="text-gray-600">{doctorProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 text-hospital-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Phone Number</h3>
                          <p className="text-gray-600">{doctorProfile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 text-hospital-primary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Address</h3>
                          <p className="text-gray-600">{doctorProfile.address}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-hospital-primary" />
                <CardTitle>Weekly Schedule</CardTitle>
              </div>
              <CardDescription>Your regular working hours and patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left font-medium text-gray-600">Day</th>
                      <th className="p-3 text-left font-medium text-gray-600">Hours</th>
                      <th className="p-3 text-left font-medium text-gray-600">Patients</th>
                      <th className="p-3 text-left font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {doctorProfile.schedule.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3">{day.day}</td>
                        <td className="p-3">{day.startTime} - {day.endTime}</td>
                        <td className="p-3">{day.patients} patients</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="hover:bg-gray-50">
                      <td className="p-3">Saturday</td>
                      <td className="p-3">Off</td>
                      <td className="p-3">-</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Inactive
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3">Sunday</td>
                      <td className="p-3">Off</td>
                      <td className="p-3">-</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Inactive
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <Button className="bg-hospital-primary">
                  <Calendar className="h-4 w-4 mr-2" /> Manage Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-hospital-primary" />
                  <CardTitle>Education</CardTitle>
                </div>
                <CardDescription>Academic qualifications and training</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {doctorProfile.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-hospital-primary pl-4 py-1">
                      <h3 className="font-medium text-lg">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-hospital-primary" />
                  <CardTitle>Certifications</CardTitle>
                </div>
                <CardDescription>Professional certifications and licenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {doctorProfile.certifications.map((cert, index) => (
                    <div key={index} className="border-l-2 border-hospital-primary pl-4 py-1">
                      <h3 className="font-medium text-lg">{cert.name}</h3>
                      <p className="text-sm text-gray-500">Issued: {cert.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <AvatarImage src={doctorProfile.profilePicture} />
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

export default Profile;
