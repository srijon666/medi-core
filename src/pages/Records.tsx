
import React, { useState, useRef } from "react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreHorizontal,
  Plus, 
  FileEdit, 
  Trash2,
  FileText,
  Filter,
  ChevronDown,
  Download,
  Share2,
  Printer,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock medical records data
const initialMedicalRecords = [
  {
    id: "R001",
    patientName: "Sarah Johnson",
    recordType: "Lab Report",
    date: "2023-12-15",
    doctor: "Dr. James Wilson",
    department: "Cardiology",
    status: "reviewed",
    notes: "Patient's cholesterol levels are within normal range. Blood pressure is slightly elevated."
  },
  {
    id: "R002",
    patientName: "Mike Peterson",
    recordType: "X-Ray",
    date: "2023-12-02",
    doctor: "Dr. Sarah Parker",
    department: "Radiology",
    status: "pending",
    notes: "Chest X-Ray shows no abnormalities in lung tissue. Heart size appears normal."
  },
  {
    id: "R003",
    patientName: "Emily Williams",
    recordType: "Prescription",
    date: "2023-12-18",
    doctor: "Dr. Michael Chen",
    department: "Pediatrics",
    status: "reviewed",
    notes: "Prescribed amoxicillin 250mg three times daily for 7 days for ear infection."
  },
  {
    id: "R004",
    patientName: "Robert Thompson",
    recordType: "MRI Scan",
    date: "2023-11-28",
    doctor: "Dr. Elizabeth Taylor",
    department: "Neurology",
    status: "reviewed",
    notes: "MRI of the brain shows no evidence of tumor or stroke. Mild age-related changes noted."
  },
  {
    id: "R005",
    patientName: "Linda Garcia",
    recordType: "Blood Test",
    date: "2023-12-10",
    doctor: "Dr. Robert Johnson",
    department: "Hematology",
    status: "pending",
    notes: "CBC indicates mild anemia. Recommend iron supplements and follow-up in 30 days."
  },
];

const statusStyles = {
  reviewed: "bg-green-100 text-green-800 hover:bg-green-100",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
};

const departments = [
  "Emergency Department (ED)", "Cardiology", "Neurology", "Pediatrics", 
  "Obstetrics and Gynecology", "Orthopedics", "Radiology", "Pathology", 
  "General Surgery", "Urology", "Dermatology", "Gastroenterology", 
  "Nephrology", "Pulmonology", "Psychiatry", "Endocrinology", 
  "Rheumatology", "Anesthesiology", "Intensive Care Unit (ICU)", 
  "Infectious Diseases", "Ophthalmology", "ENT (Otorhinolaryngology)", 
  "Hematology", "Physical Medicine and Rehabilitation"
];

const recordTypes = [
  "All Records", "Lab Report", "X-Ray", "Prescription", "MRI Scan", "Blood Test", "Ultrasound", "ECG", "CT Scan"
];

const Records = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [medicalRecords, setMedicalRecords] = useState(initialMedicalRecords);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState("All Records");
  
  // Sheet states
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editRecordOpen, setEditRecordOpen] = useState(false);
  const [addRecordOpen, setAddRecordOpen] = useState(false);

  // Form states for add/edit record
  const [formData, setFormData] = useState({
    id: "",
    patientName: "",
    recordType: "",
    date: "",
    doctor: "",
    department: "",
    status: "",
    notes: ""
  });

  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  const filteredRecords = medicalRecords.filter(
    (record) => {
      const matchesSearch = 
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "All Records" || record.recordType === typeFilter;
      
      return matchesSearch && matchesType;
    }
  );

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to enable printing",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Record - ${selectedRecord?.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { color: #333; }
            .record-detail { margin-bottom: 20px; }
            .label { font-weight: bold; }
            .notes { white-space: pre-wrap; margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h2>Medical Record - ${selectedRecord?.id}</h2>
          <div class="record-detail"><span class="label">Patient:</span> ${selectedRecord?.patientName}</div>
          <div class="record-detail"><span class="label">Type:</span> ${selectedRecord?.recordType}</div>
          <div class="record-detail"><span class="label">Date:</span> ${selectedRecord?.date}</div>
          <div class="record-detail"><span class="label">Doctor:</span> ${selectedRecord?.doctor}</div>
          <div class="record-detail"><span class="label">Department:</span> ${selectedRecord?.department}</div>
          <div class="record-detail"><span class="label">Status:</span> ${selectedRecord?.status}</div>
          <div class="record-detail"><span class="label">Notes:</span></div>
          <div class="notes">${selectedRecord?.notes}</div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    toast({
      title: "Success",
      description: "Record printed successfully",
    });
  };

  const handleDownload = () => {
    handlePrint(); // For simplicity, download uses the same print functionality
    toast({
      title: "Success",
      description: "Record downloaded as PDF",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share initiated",
      description: "Record will be shared as PDF after download",
    });
    handleDownload();
  };

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setViewDetailsOpen(true);
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setFormData(record);
    setEditRecordOpen(true);
  };

  const handleAddRecord = () => {
    const newId = `R${String(medicalRecords.length + 1).padStart(3, '0')}`;
    
    setFormData({
      id: newId,
      patientName: "",
      recordType: "",
      date: new Date().toISOString().split('T')[0],
      doctor: "",
      department: "",
      status: "pending",
      notes: ""
    });
    
    setAddRecordOpen(true);
  };

  const handleSubmitAdd = () => {
    const newRecord = { ...formData };
    
    setMedicalRecords([...medicalRecords, newRecord]);
    setAddRecordOpen(false);
    
    toast({
      title: "Record added",
      description: `New record for ${newRecord.patientName} added successfully`,
    });
  };

  const handleSubmitEdit = () => {
    const updatedRecords = medicalRecords.map(record => 
      record.id === formData.id ? formData : record
    );
    
    setMedicalRecords(updatedRecords);
    setEditRecordOpen(false);
    
    toast({
      title: "Record updated",
      description: `Record for ${formData.patientName} updated successfully`,
    });
  };

  const handleDeleteConfirm = () => {
    if (selectedRecordId) {
      const updatedRecords = medicalRecords.filter(record => record.id !== selectedRecordId);
      setMedicalRecords(updatedRecords);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Record deleted",
        description: "Medical record has been deleted successfully",
      });
    }
  };

  const handleUpdateStatus = (recordId: string, newStatus: string) => {
    const updatedRecords = medicalRecords.map(record => 
      record.id === recordId ? { ...record, status: newStatus } : record
    );
    
    setMedicalRecords(updatedRecords);
    
    toast({
      title: "Status updated",
      description: `Record status changed to ${newStatus}`,
    });
  };

  const handleUpdateDepartment = (recordId: string, newDepartment: string) => {
    const updatedRecords = medicalRecords.map(record => 
      record.id === recordId ? { ...record, department: newDepartment } : record
    );
    
    setMedicalRecords(updatedRecords);
    
    toast({
      title: "Department updated",
      description: `Record department changed to ${newDepartment}`,
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Medical Records</h1>
          <p className="text-gray-600">Manage and view patient medical records</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search records..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{typeFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {recordTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => setTypeFilter(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={handleAddRecord}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.patientName}</TableCell>
                    <TableCell>{record.recordType}</TableCell>
                    <TableCell className="hidden md:table-cell">{record.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{record.doctor}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Select
                        defaultValue={record.department}
                        onValueChange={(value) => handleUpdateDepartment(record.id, value)}
                      >
                        <SelectTrigger className="h-8 w-[180px]">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={record.status}
                        onValueChange={(value) => handleUpdateStatus(record.id, value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue>
                            <Badge
                              className={cn(
                                "font-normal capitalize",
                                statusStyles[record.status as keyof typeof statusStyles]
                              )}
                            >
                              {record.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reviewed">
                            <Badge className={statusStyles.reviewed}>
                              Reviewed
                            </Badge>
                          </SelectItem>
                          <SelectItem value="pending">
                            <Badge className={statusStyles.pending}>
                              Pending
                            </Badge>
                          </SelectItem>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(record)}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(record);
                            handleDownload();
                          }}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRecord(record);
                            handleShare();
                          }}>
                            <Share2 className="mr-2 h-4 w-4" />
                            <span>Share</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            <span>Edit Record</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedRecordId(record.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Record</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medical record? This action cannot be undone.
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
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Sheet */}
      <Sheet open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Medical Record Details</SheetTitle>
            <SheetDescription>
              View complete details for this medical record
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6" ref={printRef}>
            {selectedRecord && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Record ID</h3>
                  <p className="text-base">{selectedRecord.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                  <p className="text-base">{selectedRecord.patientName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Record Type</h3>
                  <p className="text-base">{selectedRecord.recordType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-base">{selectedRecord.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                  <p className="text-base">{selectedRecord.doctor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="text-base">{selectedRecord.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge
                    className={cn(
                      "font-normal mt-1 capitalize",
                      statusStyles[selectedRecord.status as keyof typeof statusStyles]
                    )}
                  >
                    {selectedRecord.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical Notes</h3>
                  <p className="text-base mt-2 whitespace-pre-wrap border p-3 rounded-md bg-gray-50">
                    {selectedRecord.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <SheetFooter className="flex space-x-2 sm:space-x-0">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <SheetClose asChild>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleEditRecord(selectedRecord)}
              >
                <FileEdit className="h-4 w-4" />
                Edit
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Record Sheet */}
      <Sheet open={editRecordOpen} onOpenChange={setEditRecordOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Medical Record</SheetTitle>
            <SheetDescription>
              Make changes to the medical record
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Record ID</label>
                <Input name="id" value={formData.id} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Patient Name</label>
                <Input 
                  name="patientName" 
                  value={formData.patientName} 
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Record Type</label>
                <Select 
                  value={formData.recordType} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, recordType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.slice(1).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange} 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Doctor</label>
                <Input 
                  name="doctor" 
                  value={formData.doctor} 
                  onChange={handleFormChange} 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Medical Notes</label>
                <Textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleFormChange}
                  rows={6} 
                />
              </div>
            </form>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSubmitEdit} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Add Record Sheet */}
      <Sheet open={addRecordOpen} onOpenChange={setAddRecordOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Medical Record</SheetTitle>
            <SheetDescription>
              Create a new medical record for a patient
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Record ID</label>
                <Input name="id" value={formData.id} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Patient Name</label>
                <Input 
                  name="patientName" 
                  value={formData.patientName} 
                  onChange={handleFormChange}
                  placeholder="Enter patient name" 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Record Type</label>
                <Select 
                  value={formData.recordType} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, recordType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.slice(1).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange} 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Doctor</label>
                <Input 
                  name="doctor" 
                  value={formData.doctor} 
                  onChange={handleFormChange}
                  placeholder="Enter doctor name" 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Medical Notes</label>
                <Textarea 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleFormChange}
                  placeholder="Enter medical notes and observations" 
                  rows={6} 
                />
              </div>
            </form>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSubmitAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Records;
