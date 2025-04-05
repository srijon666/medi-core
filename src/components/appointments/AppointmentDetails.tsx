
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  User, 
  UserRound, 
  FileText, 
  Pill, 
  Stethoscope, 
  CalendarRange,
} from "lucide-react";
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AppointmentDetailsProps {
  appointment: {
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    type: string;
    status: string;
  };
  onClose: () => void;
}

const statusStyles = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

// Mock patient data to display in the details view
const patientDetails = {
  age: 34,
  gender: "Female",
  contact: "+91 9876543210",
  lastVisit: "2023-11-15",
  medicalRecords: [
    { id: "MR001", date: "2023-11-15", type: "Check-up" },
    { id: "MR002", date: "2023-10-02", type: "Blood Test" },
  ]
};

const AppointmentDetails = ({ appointment, onClose }: AppointmentDetailsProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Appointment Details</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{appointment.patientName}</h3>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <UserRound className="h-4 w-4" />
              Patient
            </p>
          </div>
          <Badge 
            className={cn(
              "font-normal capitalize",
              statusStyles[appointment.status as keyof typeof statusStyles]
            )}
          >
            {appointment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Appointment ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{appointment.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{appointment.type}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <p className="font-medium">{appointment.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <p className="font-medium">{appointment.time}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doctor</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-gray-400" />
            <p className="font-medium">{appointment.doctorName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Age:</span>
              <span>{patientDetails.age}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Gender:</span>
              <span>{patientDetails.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Contact:</span>
              <span>{patientDetails.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Last Visit:</span>
              <span>{patientDetails.lastVisit}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patientDetails.medicalRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{record.type}</span>
                  </div>
                  <div className="text-sm text-gray-500">{record.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
};

export default AppointmentDetails;
