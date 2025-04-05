
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
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface NewAppointmentProps {
  onAdd: (appointment: any) => void;
  onCancel: () => void;
}

// Mock list of doctors for the select field
const doctors = [
  "Dr. James Wilson",
  "Dr. Sarah Parker",
  "Dr. Michael Chen",
  "Dr. Elizabeth Taylor",
  "Dr. Robert Johnson",
];

// Mock list of patients for the select field
const patients = [
  "Sarah Johnson",
  "Mike Peterson",
  "Emily Williams",
  "Robert Thompson",
  "Linda Garcia",
  "John Smith",
  "Mary Clark",
];

const NewAppointment = ({ onAdd, onCancel }: NewAppointmentProps) => {
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    type: "Consultation",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>New Appointment</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="patient" className="text-right">
            Patient
          </Label>
          <Select
            value={formData.patientName}
            onValueChange={(value) => handleChange('patientName', value)}
            required
          >
            <SelectTrigger id="patient" className="col-span-3">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient} value={patient}>
                  {patient}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="doctor" className="text-right">
            Doctor
          </Label>
          <Select
            value={formData.doctorName}
            onValueChange={(value) => handleChange('doctorName', value)}
            required
          >
            <SelectTrigger id="doctor" className="col-span-3">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor} value={doctor}>
                  {doctor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="time" className="text-right">
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => {
              // Convert 24hr format to 12hr with AM/PM
              const hours = parseInt(e.target.value.split(':')[0]);
              const minutes = e.target.value.split(':')[1];
              const period = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
              handleChange('time', `${displayHours.toString().padStart(2, '0')}:${minutes} ${period}`);
            }}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger id="type" className="col-span-3">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Check-up">Check-up</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Surgery">Surgery</SelectItem>
              <SelectItem value="X-Ray">X-Ray</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Appointment</Button>
      </DialogFooter>
    </form>
  );
};

export default NewAppointment;
