import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  ArrowLeft,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  ChevronDown,
  AlertTriangle,
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

interface Bed {
  id: string;
  room: string;
  type: "single" | "double" | "icu";
  status: "available" | "occupied" | "maintenance";
  patientName?: string;
  admissionDate?: string;
}

const initialBeds: Bed[] = [
  {
    id: "B001",
    room: "101",
    type: "single",
    status: "available",
  },
  {
    id: "B002",
    room: "101",
    type: "single",
    status: "occupied",
    patientName: "John Smith",
    admissionDate: "2024-05-15",
  },
  {
    id: "B003",
    room: "102",
    type: "double",
    status: "available",
  },
  {
    id: "B004",
    room: "102",
    type: "double",
    status: "maintenance",
  },
  {
    id: "B005",
    room: "103",
    type: "icu",
    status: "available",
  },
  {
    id: "B006",
    room: "103",
    type: "icu",
    status: "occupied",
    patientName: "Alice Johnson",
    admissionDate: "2024-05-10",
  },
];

const BookBed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [newBed, setNewBed] = useState<Omit<Bed, "id" | "patientName" | "admissionDate">>({
    room: "",
    type: "single",
    status: "available",
  });

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch =
      bed.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" ? true : bed.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bedId: string, newStatus: "available" | "occupied" | "maintenance") => {
    setBeds(
      beds.map((bed) =>
        bed.id === bedId ? { ...bed, status: newStatus } : bed
      )
    );
    toast({
      title: "Status Updated",
      description: `Bed status has been changed to ${newStatus}`,
    });
  };

  const handleEditBed = (bed: Bed) => {
    setSelectedBed(bed);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBed = (bed: Bed) => {
    setSelectedBed(bed);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBed = () => {
    if (selectedBed) {
      setBeds(beds.filter((b) => b.id !== selectedBed.id));
      toast({
        title: "Bed Deleted",
        description: `Bed ${selectedBed.id} has been removed`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddBed = () => {
    const newId = `B${String(beds.length + 1).padStart(3, "0")}`;
    const bedToAdd = {
      ...newBed,
      id: newId,
    };
    setBeds([...beds, bedToAdd]);
    setNewBed({
      room: "",
      type: "single",
      status: "available",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Bed Added",
      description: `Bed ${bedToAdd.id} has been added to the system`,
    });
  };

  const handleUpdateBed = () => {
    if (selectedBed) {
      setBeds(
        beds.map((b) => (b.id === selectedBed.id ? selectedBed : b))
      );
      toast({
        title: "Bed Updated",
        description: `Bed ${selectedBed.id} information has been updated`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BedDouble className="h-6 w-6 mr-2 text-hospital-primary" />
          <h1 className="text-2xl font-bold">Book Bed</h1>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-hospital-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Bed
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search beds..."
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bed List</CardTitle>
          <CardDescription>
            Showing {filteredBeds.length} out of {beds.length} beds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeds.length > 0 ? (
                  filteredBeds.map((bed) => (
                    <TableRow key={bed.id}>
                      <TableCell className="font-medium">{bed.id}</TableCell>
                      <TableCell>{bed.room}</TableCell>
                      <TableCell>{bed.type}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`rounded-full px-2 py-0.5 text-white ${getStatusColor(bed.status)}`}
                            >
                              {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleStatusChange(bed.id, "available")}>
                              <Badge className="bg-green-500 mr-2">Available</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(bed.id, "occupied")}>
                              <Badge className="bg-red-500 mr-2">Occupied</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(bed.id, "maintenance")}>
                              <Badge className="bg-yellow-500 mr-2">Maintenance</Badge>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>{bed.patientName || "-"}</TableCell>
                      <TableCell>{bed.admissionDate || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBed(bed)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBed(bed)}
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
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No beds found matching your criteria
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
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>
              Enter bed details to add it to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  value={newBed.room}
                  onChange={(e) => setNewBed({ ...newBed, room: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Bed Type</Label>
                <Select
                  value={newBed.type}
                  onValueChange={(value) => setNewBed({ ...newBed, type: value as "single" | "double" | "icu" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newBed.status}
                onValueChange={(value) => setNewBed({ ...newBed, status: value as "available" | "occupied" | "maintenance" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddBed}>
              Add Bed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bed Details</DialogTitle>
            <DialogDescription>Update information for this bed</DialogDescription>
          </DialogHeader>
          {selectedBed && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-room">Room Number</Label>
                  <Input
                    id="edit-room"
                    value={selectedBed.room}
                    onChange={(e) => setSelectedBed({ ...selectedBed, room: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Bed Type</Label>
                  <Select
                    value={selectedBed.type}
                    onValueChange={(value) => setSelectedBed({ ...selectedBed, type: value as "single" | "double" | "icu" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedBed.status}
                  onValueChange={(value) => setSelectedBed({ ...selectedBed, status: value as "available" | "occupied" | "maintenance" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBed}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBed && (
            <div className="py-4">
              <p className="font-medium">You are about to delete bed:</p>
              <p className="text-gray-700">
                {selectedBed.id} (Room: {selectedBed.room})
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBed}>
              Delete Bed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookBed;
