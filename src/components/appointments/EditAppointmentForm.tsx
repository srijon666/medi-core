
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { CalendarDays, Clock } from "lucide-react";

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

interface EditAppointmentFormProps {
  appointment: Appointment;
  onSubmit: (appointment: Appointment) => void;
  onCancel: () => void;
}

const EditAppointmentForm = ({ appointment, onSubmit, onCancel }: EditAppointmentFormProps) => {
  const [editedAppointment, setEditedAppointment] = useState<Appointment>({...appointment});

  // Update form when appointment prop changes
  useEffect(() => {
    setEditedAppointment({...appointment});
  }, [appointment]);

  const handleChange = (field: string, value: string) => {
    setEditedAppointment({ ...editedAppointment, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedAppointment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            value={editedAppointment.patientName}
            onChange={(e) => handleChange("patientName", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            value={editedAppointment.doctorName}
            onChange={(e) => handleChange("doctorName", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select 
            value={editedAppointment.department}
            onValueChange={(value) => handleChange("department", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="Radiology">Radiology</SelectItem>
              <SelectItem value="General Medicine">General Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Appointment Type</Label>
          <Select 
            value={editedAppointment.type}
            onValueChange={(value) => handleChange("type", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="check-up">Check-up</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="date"
              type="date"
              className="pl-10"
              value={editedAppointment.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="time"
              type="time"
              className="pl-10"
              value={editedAppointment.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={editedAppointment.status}
            onValueChange={(value: any) => handleChange("status", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hospital-primary hover:bg-hospital-accent">
          Update Appointment
        </Button>
      </div>
    </form>
  );
};

export default EditAppointmentForm;
