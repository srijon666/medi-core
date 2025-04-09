
import React, { useState } from "react";
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

interface AddAppointmentFormProps {
  onSubmit: (appointment: any) => void;
  onCancel: () => void;
}

const AddAppointmentForm = ({ onSubmit, onCancel }: AddAppointmentFormProps) => {
  const [newAppointment, setNewAppointment] = useState({
    id: `APT${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: "",
    doctorName: "",
    department: "",
    date: "",
    time: "",
    type: "consultation",
    status: "scheduled",
  });

  const handleChange = (field: string, value: string) => {
    setNewAppointment({ ...newAppointment, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newAppointment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            value={newAppointment.patientName}
            onChange={(e) => handleChange("patientName", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doctorName">Doctor Name</Label>
          <Input
            id="doctorName"
            value={newAppointment.doctorName}
            onChange={(e) => handleChange("doctorName", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select 
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
            onValueChange={(value) => handleChange("type", value)}
            defaultValue="consultation"
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
              value={newAppointment.date}
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
              value={newAppointment.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hospital-primary hover:bg-hospital-accent">
          Add Appointment
        </Button>
      </div>
    </form>
  );
};

export default AddAppointmentForm;
