import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  contact: string;
  email: string;
  status: "active" | "inactive";
  availability: string;
}

const initialDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    department: "Cardiology",
    contact: "+91 9876543210",
    email: "james.wilson@healthgrid.com",
    status: "active",
    availability: "Mon-Fri, 9 AM - 5 PM",
  },
  {
    id: "D002",
    name: "Dr. Sarah Parker",
    specialty: "Neurologist",
    department: "Neurology",
    contact: "+91 8765432109",
    email: "sarah.parker@healthgrid.com",
    status: "active",
    availability: "Tue-Sat, 10 AM - 6 PM",
  },
  {
    id: "D003",
    name: "Dr. Michael Chen",
    specialty: "Pediatrician",
    department: "Pediatrics",
    contact: "+91 7654321098",
    email: "michael.chen@healthgrid.com",
    status: "inactive",
    availability: "N/A",
  },
  {
    id: "D004",
    name: "Dr. Elizabeth Taylor",
    specialty: "Dermatologist",
    department: "Dermatology",
    contact: "+91 6543210987",
    email: "elizabeth.taylor@healthgrid.com",
    status: "active",
    availability: "Mon-Wed, 8 AM - 4 PM",
  },
];

const Doctors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, "id">>({
    name: "",
    specialty: "",
    department: "",
    contact: "",
    email: "",
    status: "active",
    availability: "",
  });

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : doctor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    doctorId: string,
    newStatus: "active" | "inactive"
  ) => {
    setDoctors(
      doctors.map(doctor =>
        doctor.id === doctorId ? { ...doctor, status: newStatus } : doctor
      )
    );
    toast({
      title: "Status Updated",
      description: `Doctor status has been changed to ${newStatus}`,
    });
  };

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsViewDialogOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDoctor = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(d => d.id !== selectedDoctor.id));
      toast({
        title: "Doctor Deleted",
        description: `${selectedDoctor.name}'s records have been deleted`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddDoctor = () => {
    const newId = `D${String(doctors.length + 1).padStart(3, "0")}`;
    setDoctors([...doctors, { ...newDoctor, id: newId }]);
    setNewDoctor({
      name: "",
      specialty: "",
      department: "",
      contact: "",
      email: "",
      status: "active",
      availability: "",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Doctor Added",
      description: `${newDoctor.name} has been added to the system`,
    });
  };

  const handleUpdateDoctor = () => {
    if (selectedDoctor) {
      setDoctors(
        doctors.map(d => (d.id === selectedDoctor.id ? selectedDoctor : d))
      );
      toast({
        title: "Doctor Updated",
        description: `${selectedDoctor.name}'s information has been updated`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <User className="h-6 w-6 mr-2 text-hospital-primary" />
          <h1 className="text-2xl font-bold">Doctors</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-hospital-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Doctor
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Filter:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Doctor List</CardTitle>
          <CardDescription>
            Showing {filteredDoctors.length} out of {doctors.length} doctors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doctor => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.id}</TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{doctor.department}</TableCell>
                      <TableCell>{doctor.contact}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-full px-2 py-0.5 text-white ${getStatusColor(
                                doctor.status
                              )}`}
                            >
                              {doctor.status.charAt(0).toUpperCase() +
                                doctor.status.slice(1)}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(doctor.id, "active")
                              }
                            >
                              <Badge className="bg-green-500 mr-2">Active</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(doctor.id, "inactive")
                              }
                            >
                              <Badge className="bg-red-500 mr-2">Inactive</Badge>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>{doctor.availability}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDoctor(doctor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoctor(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDoctor(doctor)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No doctors found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>
              Enter doctor details to register them in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newDoctor.name}
                  onChange={e =>
                    setNewDoctor({ ...newDoctor, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={newDoctor.specialty}
                  onChange={e =>
                    setNewDoctor({ ...newDoctor, specialty: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newDoctor.department}
                  onChange={e =>
                    setNewDoctor({ ...newDoctor, department: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={newDoctor.contact}
                  onChange={e =>
                    setNewDoctor({ ...newDoctor, contact: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newDoctor.email}
                  onChange={e =>
                    setNewDoctor({ ...newDoctor, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={newDoctor.availability}
                  onChange={e =>
                    setNewDoctor({ ...newDoctor, availability: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newDoctor.status}
                onValueChange={value =>
                  setNewDoctor({ ...newDoctor, status: value as "active" | "inactive" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddDoctor}>
              Add Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected doctor
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Doctor ID</h3>
                  <p>{selectedDoctor.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{selectedDoctor.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specialty</h3>
                  <p>{selectedDoctor.specialty}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p>{selectedDoctor.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p>{selectedDoctor.contact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>
                    <Mail className="inline-block h-4 w-4 mr-1 align-middle" />
                    {selectedDoctor.email}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className={`${getStatusColor(selectedDoctor.status)} text-white`}>
                    {selectedDoctor.status.charAt(0).toUpperCase() +
                      selectedDoctor.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Availability
                  </h3>
                  <p>{selectedDoctor.availability}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Doctor Details</DialogTitle>
            <DialogDescription>Update information for this doctor</DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedDoctor.name}
                    onChange={e =>
                      setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-specialty">Specialty</Label>
                  <Input
                    id="edit-specialty"
                    value={selectedDoctor.specialty}
                    onChange={e =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        specialty: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={selectedDoctor.department}
                    onChange={e =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Number</Label>
                  <Input
                    id="edit-contact"
                    value={selectedDoctor.contact}
                    onChange={e =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        contact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedDoctor.email}
                    onChange={e =>
                      setSelectedDoctor({ ...selectedDoctor, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-availability">Availability</Label>
                  <Input
                    id="edit-availability"
                    value={selectedDoctor.availability}
                    onChange={e =>
                      setSelectedDoctor({
                        ...selectedDoctor,
                        availability: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedDoctor.status}
                  onValueChange={value =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      status: value as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDoctor}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this doctor's records? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="py-4">
              <p className="font-medium">You are about to delete records for:</p>
              <p className="text-gray-700">
                {selectedDoctor.name} (ID: {selectedDoctor.id})
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDoctor}>
              Delete Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;
