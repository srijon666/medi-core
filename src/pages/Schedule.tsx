
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  MoreHorizontal,
  Plus, 
  FileEdit, 
  Trash2,
  Filter,
  ChevronDown,
  Calendar,
  CalendarClock,
  Check,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import AddScheduleForm from "@/components/schedule/AddScheduleForm";
import ScheduleDetails from "@/components/schedule/ScheduleDetails";
import EditScheduleForm from "@/components/schedule/EditScheduleForm";

// Mock schedule data
const initialSchedules = [
  {
    id: "S001",
    doctorName: "Dr. James Wilson",
    department: "Cardiology",
    date: "2023-12-22",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    patients: 8,
    status: "scheduled",
  },
  {
    id: "S002",
    doctorName: "Dr. Sarah Parker",
    department: "Neurology",
    date: "2023-12-22",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    patients: 6,
    status: "in-progress",
  },
  {
    id: "S003",
    doctorName: "Dr. Michael Chen",
    department: "Pediatrics",
    date: "2023-12-22",
    startTime: "08:30 AM",
    endTime: "02:30 PM",
    patients: 10,
    status: "scheduled",
  },
  {
    id: "S004",
    doctorName: "Dr. Elizabeth Taylor",
    department: "Dermatology",
    date: "2023-12-23",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    patients: 12,
    status: "scheduled",
  },
  {
    id: "S005",
    doctorName: "Dr. Robert Johnson",
    department: "Orthopedics",
    date: "2023-12-23",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    patients: 7,
    status: "scheduled",
  },
];

const statusStyles = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "in-progress": "bg-green-100 text-green-800 hover:bg-green-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

const availableDates = ["2023-12-22", "2023-12-23", "2023-12-24", "2023-12-25"];

const Schedule = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const filteredSchedules = schedules
    .filter(schedule => 
      schedule.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(schedule => 
      statusFilter === "all" ? true : schedule.status === statusFilter
    )
    .filter(schedule => 
      dateFilter === "all" ? true : schedule.date === dateFilter
    );

  const handleStatusChange = (scheduleId: string, newStatus: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: newStatus } 
        : schedule
    ));
    
    toast({
      title: "Status updated",
      description: `Schedule status has been changed to ${newStatus}`,
    });
  };

  const handleAddSchedule = (newSchedule: any) => {
    // Generate a new ID (in a real app this would come from the backend)
    const id = `S${String(schedules.length + 1).padStart(3, '0')}`;
    const scheduleWithId = { ...newSchedule, id };
    
    setSchedules([...schedules, scheduleWithId]);
    setIsAddScheduleOpen(false);
    
    toast({
      title: "Schedule added",
      description: "New schedule has been successfully added",
    });
  };

  const handleUpdateSchedule = (updatedSchedule: any) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === updatedSchedule.id ? updatedSchedule : schedule
    ));
    setIsEditScheduleOpen(false);
    
    toast({
      title: "Schedule updated",
      description: "Schedule has been successfully updated",
    });
  };

  const handleDeleteSchedule = () => {
    if (selectedScheduleId) {
      setSchedules(schedules.filter(schedule => schedule.id !== selectedScheduleId));
      setIsDeleteDialogOpen(false);
      setSelectedScheduleId(null);
      
      toast({
        title: "Schedule deleted",
        description: "Schedule has been successfully deleted",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Schedule</h1>
          <p className="text-gray-600">Doctor schedule and appointments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search schedules..."
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
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Date</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setDateFilter("all")}>
                {dateFilter === "all" && <Check className="mr-2 h-4 w-4" />}
                <span>All Dates</span>
              </DropdownMenuItem>
              {availableDates.map(date => (
                <DropdownMenuItem key={date} onClick={() => setDateFilter(date)}>
                  {dateFilter === date && <Check className="mr-2 h-4 w-4" />}
                  <span>{date}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={() => setIsAddScheduleOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Appointments</h3>
          <div className="text-3xl font-bold">43</div>
          <div className="text-sm text-gray-500 mt-1">Today</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Doctors On Duty</h3>
          <div className="text-3xl font-bold">12</div>
          <div className="text-sm text-gray-500 mt-1">Out of 15 doctors</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Available Hours</h3>
          <div className="text-3xl font-bold">6</div>
          <div className="text-sm text-gray-500 mt-1">For new appointments</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden md:table-cell">Hours</TableHead>
                <TableHead className="hidden md:table-cell">Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.id}</TableCell>
                    <TableCell>{schedule.doctorName}</TableCell>
                    <TableCell className="hidden md:table-cell">{schedule.department}</TableCell>
                    <TableCell>{schedule.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                    <TableCell className="hidden md:table-cell">{schedule.patients}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={schedule.status}
                        onValueChange={(value) => handleStatusChange(schedule.id, value)}
                      >
                        <SelectTrigger className={cn(
                          "h-7 w-28 font-normal capitalize",
                          statusStyles[schedule.status as keyof typeof statusStyles]
                        )}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
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
                              setSelectedSchedule(schedule);
                              setIsViewDetailsOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setIsEditScheduleOpen(true);
                            }}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit Schedule</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedScheduleId(schedule.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Schedule</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No schedules found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
            <DialogDescription>
              Create a new schedule for a doctor. Fill in all fields and click save.
            </DialogDescription>
          </DialogHeader>
          <AddScheduleForm onSubmit={handleAddSchedule} onCancel={() => setIsAddScheduleOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* View Schedule Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Details</DialogTitle>
          </DialogHeader>
          {selectedSchedule && <ScheduleDetails schedule={selectedSchedule} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={isEditScheduleOpen} onOpenChange={setIsEditScheduleOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the schedule information. Fill in all fields and click save.
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <EditScheduleForm 
              schedule={selectedSchedule} 
              onSubmit={handleUpdateSchedule}
              onCancel={() => setIsEditScheduleOpen(false)}
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
              Are you sure you want to delete this schedule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSchedule}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
