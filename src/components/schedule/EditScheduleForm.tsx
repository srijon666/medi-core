
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";

// Sample doctors list for the form
const doctors = [
  { id: "D001", name: "Dr. James Wilson", department: "Cardiology" },
  { id: "D002", name: "Dr. Sarah Parker", department: "Neurology" },
  { id: "D003", name: "Dr. Michael Chen", department: "Pediatrics" },
  { id: "D004", name: "Dr. Elizabeth Taylor", department: "Dermatology" },
  { id: "D005", name: "Dr. Robert Johnson", department: "Orthopedics" },
];

const formSchema = z.object({
  id: z.string(),
  doctorName: z.string().min(1, { message: "Doctor is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  patients: z.coerce.number().min(0, { message: "Number of patients must be 0 or higher" }),
  status: z.string().min(1, { message: "Status is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditScheduleFormProps {
  schedule: FormValues;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const EditScheduleForm = ({ schedule, onSubmit, onCancel }: EditScheduleFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: schedule.id,
      doctorName: schedule.doctorName,
      department: schedule.department,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      patients: schedule.patients,
      status: schedule.status,
    },
  });

  const handleDoctorChange = (doctorName: string) => {
    const doctor = doctors.find(d => d.name === doctorName);
    if (doctor) {
      form.setValue("department", doctor.department);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...form.register("id")} />
        
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleDoctorChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Patients</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update Schedule</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditScheduleForm;
