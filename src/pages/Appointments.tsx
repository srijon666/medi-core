
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Search,
  Plus,
  FileEdit,
  Trash2,
  Filter,
  ChevronDown,
  Check,
  User,
  Stethoscope,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import AddAppointmentForm from "@/components/appointments/AddAppointmentForm";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";
import EditAppointmentForm from "@/components/appointments/EditAppointmentForm";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
  type: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

const initialAppointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "John Smith",
    doctorName: "Dr. Alice Johnson",
    date: "2023-12-20",
    time: "09:00 AM",
    department: "Cardiology",
    type: "consultation",
    status: "scheduled",
  },
  {
    id: "APT002",
    patientName: "Emily White",
    doctorName: "Dr. Bob Williams",
    date: "2023-12-20",
    time: "10:30 AM",
    department: "Neurology",
    type: "follow-up",
    status: "in-progress",
  },
  {
    id: "APT003",
    patientName: "David Brown",
    doctorName: "Dr. Carol Davis",
    date: "2023-12-21",
    time: "11:00 AM",
    department: "Pediatrics",
    type: "check-up",
    status: "completed",
  },
  {
    id: "APT004",
    patientName: "Linda Green",
    doctorName: "Dr. David Miller",
    date: "2023-12-21",
    time: "02:00 PM",
    department: "Orthopedics",
    type: "emergency",
    status: "cancelled",
  },
];

const statusStyles = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "in-progress": "bg-green-100 text-green-800 hover:bg-green-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

const Appointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (appointmentId: string, newStatus: Appointment["status"]) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
      )
    );
    toast({
      title: "Status Updated",
      description: `Appointment status has been changed to ${newStatus}`,
    });
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments([...appointments, newAppointment]);
    setIsAddDialogOpen(false);
    toast({
      title: "Appointment Added",
      description: "New appointment has been successfully added",
    });
  };

  const handleUpdateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment
      )
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Appointment Updated",
      description: "Appointment has been successfully updated",
    });
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointmentId) {
      setAppointments(appointments.filter((appointment) => appointment.id !== selectedAppointmentId));
      setIsDeleteDialogOpen(false);
      setSelectedAppointmentId(null);
      toast({
        title: "Appointment Deleted",
        description: "Appointment has been successfully deleted",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
          <p className="text-gray-600">Manage your hospital appointments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                {statusFilter === "all" && <Check className="mr-2 h-4 w-4" />}
                <span>All Statuses</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>
                {statusFilter === "scheduled" && <Check className="mr-2 h-4 w-4" />}
                <span>Scheduled</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
                {statusFilter === "in-progress" && <Check className="mr-2 h-4 w-4" />}
                <span>In Progress</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                {statusFilter === "completed" && <Check className="mr-2 h-4 w-4" />}
                <span>Completed</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                {statusFilter === "cancelled" && <Check className="mr-2 h-4 w-4" />}
                <span>Cancelled</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Appointments</h3>
          <div className="text-3xl font-bold">{appointments.length}</div>
          <div className="text-sm text-gray-500 mt-1">This month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Available Slots</h3>
          <div className="text-3xl font-bold">27</div>
          <div className="text-sm text-gray-500 mt-1">For new patients</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Upcoming Appointments</h3>
          <div className="text-3xl font-bold">8</div>
          <div className="text-sm text-gray-500 mt-1">Next 24 hours</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.id}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell className="hidden md:table-cell">{appointment.department}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={appointment.status}
                        onValueChange={(value) => handleStatusChange(appointment.id, value as Appointment["status"])}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-7 w-28 font-normal capitalize",
                            statusStyles[appointment.status as keyof typeof statusStyles]
                          )}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit Appointment</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedAppointmentId(appointment.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Appointment</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
            <DialogDescription>Create a new appointment for a patient.</DialogDescription>
          </DialogHeader>
          <AddAppointmentForm onSubmit={handleAddAppointment} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* View Appointment Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && <AppointmentDetails appointment={selectedAppointment} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Edit the details of the selected appointment.</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <EditAppointmentForm
              appointment={selectedAppointment}
              onSubmit={handleUpdateAppointment}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppointment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
