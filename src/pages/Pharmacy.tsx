import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  User,
  Package,
  TrendingUp,
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  expiryDate: string;
  manufacturer: string;
  price: number;
}

const initialMedications: Medication[] = [
  {
    id: "M001",
    name: "Amoxicillin",
    dosage: "250mg",
    stock: 120,
    expiryDate: "2024-12-31",
    manufacturer: "PharmaCorp",
    price: 5.99,
  },
  {
    id: "M002",
    name: "Ibuprofen",
    dosage: "200mg",
    stock: 200,
    expiryDate: "2025-01-15",
    manufacturer: "MediPlus",
    price: 3.50,
  },
  {
    id: "M003",
    name: "Paracetamol",
    dosage: "500mg",
    stock: 150,
    expiryDate: "2024-11-30",
    manufacturer: "HealthFirst",
    price: 4.25,
  },
  {
    id: "M004",
    name: "Loratadine",
    dosage: "10mg",
    stock: 100,
    expiryDate: "2025-02-28",
    manufacturer: "AllergyFree",
    price: 7.50,
  },
  {
    id: "M005",
    name: "Omeprazole",
    dosage: "20mg",
    stock: 80,
    expiryDate: "2024-10-31",
    manufacturer: "GastroEase",
    price: 9.99,
  },
];

const Pharmacy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState<Omit<Medication, "id">>({
    name: "",
    dosage: "",
    stock: 0,
    expiryDate: new Date().toISOString().split('T')[0],
    manufacturer: "",
    price: 0,
  });

  const filteredMedications = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedication = () => {
    const newId = `M${String(medications.length + 1).padStart(3, '0')}`;
    const medicationToAdd = { ...newMedication, id: newId };
    setMedications([...medications, medicationToAdd]);
    setNewMedication({
      name: "",
      dosage: "",
      stock: 0,
      expiryDate: new Date().toISOString().split('T')[0],
      manufacturer: "",
      price: 0,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Medication Added",
      description: `${medicationToAdd.name} has been added to the inventory`,
    });
  };

  const handleUpdateMedication = () => {
    if (selectedMedication) {
      setMedications(medications.map(m =>
        m.id === selectedMedication.id ? selectedMedication : m
      ));
      toast({
        title: "Medication Updated",
        description: `${selectedMedication.name}'s information has been updated`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteMedication = () => {
    if (selectedMedication) {
      setMedications(medications.filter(m => m.id !== selectedMedication.id));
      toast({
        title: "Medication Deleted",
        description: `${selectedMedication.name} has been removed from the inventory`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStockAlert = () => {
    const lowStockMedications = medications.filter(medication => medication.stock < 50);
    if (lowStockMedications.length > 0) {
      const medicationNames = lowStockMedications.map(medication => medication.name).join(", ");
      toast({
        title: "Low Stock Alert",
        description: `The following medications are running low: ${medicationNames}`,
      });
    } else {
      toast({
        title: "Stock Levels",
        description: "All medications are adequately stocked",
      });
    }
  };

  const handleExpiryAlert = () => {
    const expiringSoonMedications = medications.filter(medication => {
      const expiryDate = new Date(medication.expiryDate);
      const currentDate = new Date();
      const timeDiff = expiryDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff <= 90;
    });

    if (expiringSoonMedications.length > 0) {
      const medicationNames = expiringSoonMedications.map(medication => medication.name).join(", ");
      toast({
        title: "Expiry Alert",
        description: `The following medications are expiring within 90 days: ${medicationNames}`,
      });
    } else {
      toast({
        title: "Expiry Dates",
        description: "No medications are expiring within the next 90 days",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Package className="h-6 w-6 mr-2 text-hospital-primary" />
          <h1 className="text-2xl font-bold">Pharmacy</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-hospital-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Medication
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleStockAlert} variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" /> Check Stock
              </Button>
              <Button onClick={handleExpiryAlert} variant="outline">
                <Calendar className="h-4 w-4 mr-2" /> Check Expiry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Medication List</CardTitle>
          <CardDescription>
            Showing {filteredMedications.length} out of {medications.length} medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.length > 0 ? (
                  filteredMedications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.id}</TableCell>
                      <TableCell>{medication.name}</TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.stock}</TableCell>
                      <TableCell>{new Date(medication.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>{medication.manufacturer}</TableCell>
                      <TableCell>${medication.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMedication(medication);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMedication(medication);
                              setIsDeleteDialogOpen(true);
                            }}
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
                      No medications found matching your criteria
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
            <DialogTitle>Add New Medication</DialogTitle>
            <DialogDescription>
              Enter medication details to add it to the inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newMedication.stock}
                  onChange={(e) => setNewMedication({ ...newMedication, stock: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newMedication.expiryDate}
                  onChange={(e) => setNewMedication({ ...newMedication, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={newMedication.manufacturer}
                  onChange={(e) => setNewMedication({ ...newMedication, manufacturer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newMedication.price}
                  onChange={(e) => setNewMedication({ ...newMedication, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddMedication}>Add Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Medication Details</DialogTitle>
            <DialogDescription>
              Update information for this medication
            </DialogDescription>
          </DialogHeader>
          {selectedMedication && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedMedication.name}
                    onChange={(e) => setSelectedMedication({ ...selectedMedication, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dosage">Dosage</Label>
                  <Input
                    id="edit-dosage"
                    value={selectedMedication.dosage}
                    onChange={(e) => setSelectedMedication({ ...selectedMedication, dosage: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={selectedMedication.stock}
                    onChange={(e) => setSelectedMedication({ ...selectedMedication, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">Expiry Date</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={selectedMedication.expiryDate}
                    onChange={(e) => setSelectedMedication({ ...selectedMedication, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                  <Input
                    id="edit-manufacturer"
                    value={selectedMedication.manufacturer}
                    onChange={(e) => setSelectedMedication({ ...selectedMedication, manufacturer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedMedication.price}
                    onChange={(e) => setSelectedMedication({ ...selectedMedication, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateMedication}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medication from the inventory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedMedication && (
            <div className="py-4">
              <p className="font-medium">You are about to delete:</p>
              <p className="text-gray-700">{selectedMedication.name} (ID: {selectedMedication.id})</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteMedication();
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pharmacy;
