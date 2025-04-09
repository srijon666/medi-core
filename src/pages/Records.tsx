import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  Calendar,
  Clock,
  User,
  FileUp,
  MoreHorizontal,
  Check
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Record {
  id: string;
  patientId: string;
  patientName: string;
  recordType: string;
  date: string;
  doctor: string;
  department: string;
  status: "complete" | "pending" | "review";
  files: {
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }[];
}

const initialRecords: Record[] = [
  {
    id: "REC001",
    patientId: "P001",
    patientName: "John Smith",
    recordType: "Lab Report",
    date: "2023-12-15",
    doctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    status: "complete",
    files: [
      {
        name: "blood_work_results.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadDate: "2023-12-15",
      },
      {
        name: "ecg_report.pdf",
        type: "PDF",
        size: "1.8 MB",
        uploadDate: "2023-12-15",
      },
    ],
  },
  {
    id: "REC002",
    patientId: "P002",
    patientName: "Mary Johnson",
    recordType: "Prescription",
    date: "2023-12-17",
    doctor: "Dr. Michael Chen",
    department: "Neurology",
    status: "complete",
    files: [
      {
        name: "prescription_dec17.pdf",
        type: "PDF",
        size: "0.5 MB",
        uploadDate: "2023-12-17",
      },
    ],
  },
  {
    id: "REC003",
    patientId: "P003",
    patientName: "Rahul Sharma",
    recordType: "Surgery Report",
    date: "2023-12-10",
    doctor: "Dr. Elizabeth Taylor",
    department: "Orthopedics",
    status: "review",
    files: [
      {
        name: "surgery_report.pdf",
        type: "PDF",
        size: "4.2 MB",
        uploadDate: "2023-12-10",
      },
      {
        name: "post_op_instructions.pdf",
        type: "PDF",
        size: "1.1 MB",
        uploadDate: "2023-12-10",
      },
      {
        name: "xray_images.zip",
        type: "ZIP",
        size: "15.8 MB",
        uploadDate: "2023-12-10",
      },
    ],
  },
  {
    id: "REC004",
    patientId: "P004",
    patientName: "Priya Patel",
    recordType: "Radiology",
    date: "2023-12-18",
    doctor: "Dr. Robert Johnson",
    department: "Radiology",
    status: "pending",
    files: [
      {
        name: "chest_xray.dcm",
        type: "DICOM",
        size: "24.5 MB",
        uploadDate: "2023-12-18",
      },
    ],
  },
  {
    id: "REC005",
    patientId: "P005",
    patientName: "Michael Wong",
    recordType: "Consultation",
    date: "2023-12-16",
    doctor: "Dr. James Wilson",
    department: "Cardiology",
    status: "complete",
    files: [
      {
        name: "consultation_notes.pdf",
        type: "PDF",
        size: "0.8 MB",
        uploadDate: "2023-12-16",
      },
      {
        name: "medication_list.pdf",
        type: "PDF",
        size: "0.3 MB",
        uploadDate: "2023-12-16",
      },
    ],
  },
];

const Records = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true : record.status === statusFilter;
    const matchesType = typeFilter === "all" ? true : record.recordType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewRecord = (record: Record) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const handleDeleteRecord = (record: Record) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRecord = () => {
    if (selectedRecord) {
      setRecords(records.filter(r => r.id !== selectedRecord.id));
      toast({
        title: "Record Deleted",
        description: `Record ${selectedRecord.id} has been deleted`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUploadFiles = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsUploadDialogOpen(true);
  };

  const handleStatusChange = (recordId: string, newStatus: "complete" | "pending" | "review") => {
    setRecords(records.map(record => 
      record.id === recordId ? {...record, status: newStatus} : record
    ));
    
    toast({
      title: "Status Updated",
      description: `Record status has been changed to ${newStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "review": return "bg-blue-500";
      default: return "bg-gray-400";
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf": return "📄";
      case "dicom": return "🔬";
      case "zip": return "🗜️";
      case "jpg":
      case "jpeg":
      case "png": return "🖼️";
      default: return "📁";
    }
  };

  const recordTypes = ["Lab Report", "Prescription", "Surgery Report", "Radiology", "Consultation"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-hospital-primary" />
          <h1 className="text-2xl font-bold">Medical Records</h1>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)} className="bg-hospital-primary">
          <Plus className="h-4 w-4 mr-2" /> Upload Record
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records by patient name, ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem> 
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Type:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {recordTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} out of {records.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{record.patientName}</div>
                        <div className="text-sm text-gray-500">{record.patientId}</div>
                      </TableCell>
                      <TableCell>{record.recordType}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={`rounded-full px-2 py-0.5 text-white ${getStatusColor(record.status)}`}
                            >
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleStatusChange(record.id, "complete")}>
                              <Badge className="bg-green-500 mr-2">Complete</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(record.id, "pending")}>
                              <Badge className="bg-yellow-500 mr-2">Pending</Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(record.id, "review")}>
                              <Badge className="bg-blue-500 mr-2">Under Review</Badge>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>{record.files.length} files</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewRecord(record)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUploadFiles(record.patientId)}>
                              <FileUp className="mr-2 h-4 w-4" />
                              <span>Upload Files</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteRecord(record)}
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
                      No records found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected medical record
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Record ID</h3>
                  <p>{selectedRecord.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Record Type</h3>
                  <p>{selectedRecord.recordType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
                  <p>{selectedRecord.patientName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                  <p>{selectedRecord.patientId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{new Date(selectedRecord.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className={`${getStatusColor(selectedRecord.status)} text-white`}>
                    {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                  <p>{selectedRecord.doctor}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p>{selectedRecord.department}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Files</h3>
                <div className="space-y-2">
                  {selectedRecord.files.map((file, index) => (
                    <div key={index} className="border rounded p-3 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-2 text-xl">{getFileIcon(file.type)}</span>
                        <div>
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {file.type} • {file.size} • Uploaded on {new Date(file.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medical record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="py-4">
              <p className="font-medium">You are about to delete:</p>
              <p className="text-gray-700">Record ID: {selectedRecord.id}</p>
              <p className="text-gray-700">Patient: {selectedRecord.patientName}</p>
              <p className="text-gray-700">Type: {selectedRecord.recordType}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteRecord}
            >
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Medical Record</DialogTitle>
            <DialogDescription>
              Add new files to a patient's medical record
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select defaultValue={selectedPatientId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {records.map(record => (
                    <SelectItem key={record.patientId} value={record.patientId}>
                      {record.patientName} ({record.patientId})
                    </SelectItem>
                  )).filter((item, index, self) => 
                    index === self.findIndex(t => t.key === item.key)
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-sarah-johnson">Dr. Sarah Johnson</SelectItem>
                  <SelectItem value="dr-michael-chen">Dr. Michael Chen</SelectItem>
                  <SelectItem value="dr-elizabeth-taylor">Dr. Elizabeth Taylor</SelectItem>
                  <SelectItem value="dr-robert-johnson">Dr. Robert Johnson</SelectItem>
                  <SelectItem value="dr-james-wilson">Dr. James Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="files">Upload Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <FileUp className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <Button variant="outline" size="sm">Select Files</Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Support for PDF, DICOM, JPEG, PNG files. Max 50MB per file.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Files Uploaded",
                  description: "Medical records have been successfully uploaded",
                });
                setIsUploadDialogOpen(false);
              }}
            >
              Upload Files
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Records;
