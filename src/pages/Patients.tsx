import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
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

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  status: "active" | "critical" | "stable" | "discharged";
  lastVisit: string;
  medicalRecords: { date: string; description: string }[];
}

const initialPatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    age: 52,
    gender: "Male",
    contact: "+91 98765 43210",
    status: "stable",
    lastVisit: "2024-05-15",
    medicalRecords: [
      { date: "2024-05-15", description: "Regular checkup, blood pressure normal" },
      { date: "2024-04-02", description: "Flu symptoms, prescribed antibiotics" }
    ]
  },
  {
    id: "P002",
    name: "Mary Johnson",
    age: 46,
    gender: "Female",
    contact: "+91 87654 32109",
    status: "active",
    lastVisit: "2024-05-17",
    medicalRecords: [
      { date: "2024-05-17", description: "Diabetes follow-up, glucose levels stable" }
    ]
  },
  {
    id: "P003",
    name: "Rahul Sharma",
    age: 35,
    gender: "Male",
    contact: "+91 76543 21098",
    status: "discharged",
    lastVisit: "2024-05-10",
    medicalRecords: [
      { date: "2024-05-10", description: "Post-surgery follow up, recovery good" },
      { date: "2024-04-25", description: "Appendectomy surgery performed" }
    ]
  },
  {
    id: "P004",
    name: "Priya Patel",
    age: 28,
    gender: "Female",
    contact: "+91 65432 10987",
    status: "critical",
    lastVisit: "2024-05-18",
    medicalRecords: [
      { date: "2024-05-18", description: "Emergency admission - severe pneumonia" }
    ]
  },
  {
    id: "P005",
    name: "Michael Wong",
    age: 63,
    gender: "Male",
    contact: "+91 54321 09876",
    status: "active",
    lastVisit: "2024-05-16",
    medicalRecords: [
      { date: "2024-05-16", description: "Cardiac checkup, ECG performed" },
      { date: "2024-03-20", description: "Prescribed blood thinners" }
    ]
  },
  {
    id: "P006",
    name: "Sunita Desai",
    age: 42,
    gender: "Female",
    contact: "+91 43210 98765",
    status: "stable",
    lastVisit: "2024-05-14",
    medicalRecords: [
      { date: "2024-05-14", description: "Follow-up for hypertension" }
    ]
  },
];

const Patients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id" | "medicalRecords">>({
    name: "",
    age: 0,
    gender: "",
    contact: "",
    status: "active",
    lastVisit: new Date().toISOString().split('T')[0],
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (patientId: string, newStatus: "active" | "critical" | "stable" | "discharged") => {
    setPatients(patients.map(patient => 
      patient.id === patientId ? {...patient, status: newStatus} : patient
    ));
    toast({
      title: "Status Updated",
      description: `Patient status has been changed to ${newStatus}`,
    });
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePatient = () => {
    if (selectedPatient) {
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      toast({
        title: "Patient Deleted",
        description: `${selectedPatient.name}'s records have been deleted`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddPatient = () => {
    const newId = `P${String(patients.length + 1).padStart(3, '0')}`;
    const patientToAdd = {
      ...newPatient,
      id: newId,
      medicalRecords: [{ 
        date: new Date().toISOString().split('T')[0], 
        description: "Initial registration" 
      }]
    } as Patient;
    
    setPatients([...patients, patientToAdd]);
    setNewPatient({
      name: "",
      age: 0,
      gender: "",
      contact: "",
      status: "active",
      lastVisit: new Date().toISOString().split('T')[0],
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Patient Added",
      description: `${patientToAdd.name} has been added to the system`,
    });
  };

  const handleUpdatePatient = () => {
    if (selectedPatient) {
      setPatients(patients.map(p => 
        p.id === selectedPatient.id ? selectedPatient : p
      ));
      toast({
        title: "Patient Updated",
        description: `${selectedPatient.name}'s information has been updated`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-500";
      case "critical": return "bg-red-500";
      case "stable": return "bg-green-500";
      case "discharged": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-hospital-primary" />
          <h1 className="text-2xl font-bold">Patients</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-hospital-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Patient
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Patient List</CardTitle>
          <CardDescription>
            Showing {filteredPatients.length} out of {patients.length} patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.contact}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={`rounded-full px-2 py-0.5 text-white ${getStatusColor(patient.status)}`}
                            >
                              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleStatusChange(patient.id, "active")}>
                              <Badge className="bg-blue-500 mr-2">Active</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(patient.id, "critical")}>
                              <Badge className="bg-red-500 mr-2">Critical</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(patient.id, "stable")}>
                              <Badge className="bg-green-500 mr-2">Stable</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(patient.id, "discharged")}>
                              <Badge className="bg-gray-500 mr-2">Discharged</Badge>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewPatient(patient)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeletePatient(patient)}
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
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No patients found matching your criteria
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
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter patient details to register them in the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={newPatient.gender}
                  onValueChange={(value) => setNewPatient({...newPatient, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input 
                  id="contact" 
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select 
                value={newPatient.status}
                onValueChange={(value: any) => setNewPatient({...newPatient, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected patient
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                  <p>{selectedPatient.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{selectedPatient.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Age</h3>
                  <p>{selectedPatient.age} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p>{selectedPatient.gender}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p>{selectedPatient.contact}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className={`${getStatusColor(selectedPatient.status)} text-white`}>
                    {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Visit</h3>
                  <p>{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Medical Records</h3>
                <div className="space-y-2">
                  {selectedPatient.medicalRecords.map((record, index) => (
                    <div key={index} className="border rounded p-3 bg-gray-50">
                      <div className="font-medium text-sm">{new Date(record.date).toLocaleDateString()}</div>
                      <p className="text-sm text-gray-600">{record.description}</p>
                    </div>
                  ))}
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
            <DialogTitle>Edit Patient Details</DialogTitle>
            <DialogDescription>
              Update information for this patient
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedPatient.name}
                    onChange={(e) => setSelectedPatient({...selectedPatient, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-age">Age</Label>
                  <Input 
                    id="edit-age" 
                    type="number" 
                    value={selectedPatient.age}
                    onChange={(e) => setSelectedPatient({...selectedPatient, age: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select 
                    value={selectedPatient.gender}
                    onValueChange={(value) => setSelectedPatient({...selectedPatient, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Number</Label>
                  <Input 
                    id="edit-contact" 
                    value={selectedPatient.contact}
                    onChange={(e) => setSelectedPatient({...selectedPatient, contact: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedPatient.status}
                  onValueChange={(value: any) => setSelectedPatient({...selectedPatient, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastVisit">Last Visit Date</Label>
                <Input 
                  id="edit-lastVisit"
                  type="date"
                  value={selectedPatient.lastVisit}
                  onChange={(e) => setSelectedPatient({...selectedPatient, lastVisit: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePatient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient's records? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="py-4">
              <p className="font-medium">You are about to delete records for:</p>
              <p className="text-gray-700">{selectedPatient.name} (ID: {selectedPatient.id})</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeletePatient}
            >
              Delete Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
