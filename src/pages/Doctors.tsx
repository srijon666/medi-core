
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MoreHorizontal,
  Plus, 
  FileEdit, 
  Trash2,
  FileText,
  Filter,
  ChevronDown,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock doctor data
const initialDoctors = [
  {
    id: "D001",
    name: "Dr. James Wilson",
    specialization: "Cardiology",
    experience: "15 years",
    contact: "(555) 123-4567",
    status: "available",
    schedule: "Mon-Fri",
  },
  {
    id: "D002",
    name: "Dr. Sarah Parker",
    specialization: "Neurology",
    experience: "12 years",
    contact: "(555) 234-5678",
    status: "unavailable",
    schedule: "Mon-Wed",
  },
  {
    id: "D003",
    name: "Dr. Michael Chen",
    specialization: "Pediatrics",
    experience: "8 years",
    contact: "(555) 345-6789",
    status: "available",
    schedule: "Tue-Sat",
  },
  {
    id: "D004",
    name: "Dr. Elizabeth Taylor",
    specialization: "Dermatology",
    experience: "10 years",
    contact: "(555) 456-7890",
    status: "available",
    schedule: "Mon-Thu",
  },
  {
    id: "D005",
    name: "Dr. Robert Johnson",
    specialization: "Orthopedics",
    experience: "20 years",
    contact: "(555) 567-8901",
    status: "unavailable",
    schedule: "Wed-Sun",
  },
  {
    id: "D006",
    name: "Dr. Jennifer Adams",
    specialization: "Gynecology",
    experience: "14 years",
    contact: "(555) 678-9012",
    status: "available",
    schedule: "Mon-Fri",
  },
];

// List of specializations
const specializations = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "General Surgery",
  "Ophthalmology",
  "Psychiatry",
  "Urology"
];

const statusStyles = {
  available: "bg-green-100 text-green-800 hover:bg-green-100",
  unavailable: "bg-red-100 text-red-800 hover:bg-red-100",
};

const Doctors = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [newDoctor, setNewDoctor] = useState({
    id: `D${String(initialDoctors.length + 1).padStart(3, '0')}`,
    name: "",
    specialization: "Cardiology",
    experience: "",
    contact: "",
    status: "available",
    schedule: "",
  });
  const [editingStatus, setEditingStatus] = useState<{id: string, status: string} | null>(null);

  const filteredDoctors = doctors.filter(
    (doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" ? true : doctor.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsViewDialogOpen(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor({...doctor});
    setIsEditDialogOpen(true);
  };

  const handleDeleteDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleAddDoctor = () => {
    if (!newDoctor.name || !newDoctor.experience || !newDoctor.contact || !newDoctor.schedule) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedDoctors = [...doctors, newDoctor];
    setDoctors(updatedDoctors);
    setIsAddDialogOpen(false);
    
    // Reset the new doctor form with a new ID
    setNewDoctor({
      id: `D${String(updatedDoctors.length + 1).padStart(3, '0')}`,
      name: "",
      specialization: "Cardiology",
      experience: "",
      contact: "",
      status: "available",
      schedule: "",
    });

    toast({
      title: "Success",
      description: "Doctor added successfully!",
    });
  };

  const handleUpdateDoctor = () => {
    if (!selectedDoctor.name || !selectedDoctor.experience || !selectedDoctor.contact || !selectedDoctor.schedule) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setDoctors(doctors.map(d => 
      d.id === selectedDoctor.id ? selectedDoctor : d
    ));
    setIsEditDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Doctor updated successfully!",
    });
  };

  const confirmDeleteDoctor = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(d => d.id !== selectedDoctor.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Doctor deleted successfully!",
      });
    }
  };

  const handleStatusChange = (doctorId: string, newStatus: string) => {
    setDoctors(doctors.map(doctor => 
      doctor.id === doctorId ? {...doctor, status: newStatus} : doctor
    ));
    setEditingStatus(null);
    
    toast({
      title: "Status Updated",
      description: `Doctor status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>
          <p className="text-gray-600">Manage and view doctor information</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search doctors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Specialization</TableHead>
                <TableHead className="hidden md:table-cell">Experience</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Schedule</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-hospital-secondary text-hospital-primary text-xs">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {doctor.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.specialization}</TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.experience}</TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.contact}</TableCell>
                    <TableCell>
                      {editingStatus && editingStatus.id === doctor.id ? (
                        <Select 
                          defaultValue={doctor.status}
                          onValueChange={(value) => handleStatusChange(doctor.id, value)}
                          onOpenChange={(open) => {
                            if (!open) setEditingStatus(null);
                          }}
                        >
                          <SelectTrigger className="h-7 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          className={cn(
                            "font-normal capitalize cursor-pointer",
                            statusStyles[doctor.status as keyof typeof statusStyles]
                          )}
                          onClick={() => setEditingStatus({ id: doctor.id, status: doctor.status })}
                        >
                          {doctor.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.schedule}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDoctor(doctor)}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit Doctor</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteDoctor(doctor)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Doctor</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No doctors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Doctor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Doctor Profile</DialogTitle>
            <DialogDescription>
              Detailed information about the doctor.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-hospital-secondary text-hospital-primary">
                    {selectedDoctor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p>{selectedDoctor.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p>{selectedDoctor.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Specialization</p>
                  <p>{selectedDoctor.specialization}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Experience</p>
                  <p>{selectedDoctor.experience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p>{selectedDoctor.contact}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={
                    selectedDoctor.status === "available" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }>
                    {selectedDoctor.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Schedule</p>
                  <p>{selectedDoctor.schedule}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleEditDoctor(selectedDoctor);
            }}>
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>
              Update doctor information.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="doctor-id" className="text-sm font-medium text-gray-500">ID</label>
                  <Input 
                    id="doctor-id"
                    value={selectedDoctor.id} 
                    disabled 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="doctor-name" className="text-sm font-medium text-gray-500">Name</label>
                  <Input 
                    id="doctor-name"
                    value={selectedDoctor.name} 
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="doctor-specialization" className="text-sm font-medium text-gray-500">Specialization</label>
                  <Select 
                    value={selectedDoctor.specialization}
                    onValueChange={(value) => setSelectedDoctor({...selectedDoctor, specialization: value})}
                  >
                    <SelectTrigger id="doctor-specialization">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="doctor-experience" className="text-sm font-medium text-gray-500">Experience</label>
                  <Input 
                    id="doctor-experience"
                    value={selectedDoctor.experience} 
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, experience: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="doctor-contact" className="text-sm font-medium text-gray-500">Contact</label>
                  <Input 
                    id="doctor-contact"
                    value={selectedDoctor.contact} 
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, contact: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="doctor-status" className="text-sm font-medium text-gray-500">Status</label>
                  <Select 
                    value={selectedDoctor.status}
                    onValueChange={(value) => setSelectedDoctor({...selectedDoctor, status: value})}
                  >
                    <SelectTrigger id="doctor-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="doctor-schedule" className="text-sm font-medium text-gray-500">Schedule</label>
                  <Input 
                    id="doctor-schedule"
                    value={selectedDoctor.schedule} 
                    onChange={(e) => setSelectedDoctor({...selectedDoctor, schedule: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDoctor}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Doctor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new doctor to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="new-doctor-id" className="text-sm font-medium text-gray-500">ID</label>
                <Input 
                  id="new-doctor-id"
                  value={newDoctor.id} 
                  disabled 
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="new-doctor-name" className="text-sm font-medium text-gray-500">Name</label>
                <Input 
                  id="new-doctor-name"
                  value={newDoctor.name} 
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="new-doctor-specialization" className="text-sm font-medium text-gray-500">Specialization</label>
                <Select 
                  value={newDoctor.specialization}
                  onValueChange={(value) => setNewDoctor({...newDoctor, specialization: value})}
                >
                  <SelectTrigger id="new-doctor-specialization">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label htmlFor="new-doctor-experience" className="text-sm font-medium text-gray-500">Experience</label>
                <Input 
                  id="new-doctor-experience"
                  value={newDoctor.experience} 
                  onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                  placeholder="10 years"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="new-doctor-contact" className="text-sm font-medium text-gray-500">Contact</label>
                <Input 
                  id="new-doctor-contact"
                  value={newDoctor.contact} 
                  onChange={(e) => setNewDoctor({...newDoctor, contact: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="new-doctor-status" className="text-sm font-medium text-gray-500">Status</label>
                <Select 
                  value={newDoctor.status}
                  onValueChange={(value) => setNewDoctor({...newDoctor, status: value})}
                >
                  <SelectTrigger id="new-doctor-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label htmlFor="new-doctor-schedule" className="text-sm font-medium text-gray-500">Schedule</label>
                <Input 
                  id="new-doctor-schedule"
                  value={newDoctor.schedule} 
                  onChange={(e) => setNewDoctor({...newDoctor, schedule: e.target.value})}
                  placeholder="Mon-Fri"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDoctor}>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this doctor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="py-4">
              <p><span className="font-medium">ID:</span> {selectedDoctor.id}</p>
              <p><span className="font-medium">Name:</span> {selectedDoctor.name}</p>
              <p><span className="font-medium">Specialization:</span> {selectedDoctor.specialization}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteDoctor}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;
