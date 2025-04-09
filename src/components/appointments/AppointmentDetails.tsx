
import React from "react";
import { CalendarDays, Clock, User, Stethoscope, Building, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  department: string;
  type?: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

interface AppointmentDetailsProps {
  appointment: Appointment;
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  "in-progress": "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const AppointmentDetails = ({ appointment }: AppointmentDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-semibold text-gray-900">
          Appointment #{appointment.id}
        </h3>
        <Badge 
          className={`w-fit capitalize ${
            statusColors[appointment.status as keyof typeof statusColors]
          }`}
        >
          {appointment.status}
        </Badge>
      </div>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-[20px_1fr] items-start gap-4">
          <User className="h-5 w-5 text-hospital-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Patient</p>
            <p className="font-medium">{appointment.patientName}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-[20px_1fr] items-start gap-4">
          <Stethoscope className="h-5 w-5 text-hospital-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Doctor</p>
            <p className="font-medium">{appointment.doctorName}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-[20px_1fr] items-start gap-4">
          <Building className="h-5 w-5 text-hospital-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Department</p>
            <p className="font-medium">{appointment.department}</p>
          </div>
        </div>

        {appointment.type && (
          <div className="grid grid-cols-[20px_1fr] items-start gap-4">
            <Activity className="h-5 w-5 text-hospital-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="font-medium capitalize">{appointment.type}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-[20px_1fr] items-start gap-4">
          <CalendarDays className="h-5 w-5 text-hospital-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="font-medium">{appointment.date}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-[20px_1fr] items-start gap-4">
          <Clock className="h-5 w-5 text-hospital-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Time</p>
            <p className="font-medium">{appointment.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
