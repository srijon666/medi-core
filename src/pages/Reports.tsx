import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  LineChart as LineChartIcon,
  MoreHorizontal,
  PieChart as PieChartIcon,
  Plus,
  Printer,
  Search,
  Share2,
  Users,
} from "lucide-react";

// Sample data for charts
const patientStatistics = [
  { month: "Jan", inpatients: 120, outpatients: 450, emergency: 85 },
  { month: "Feb", inpatients: 132, outpatients: 478, emergency: 92 },
  { month: "Mar", inpatients: 141, outpatients: 503, emergency: 88 },
  { month: "Apr", inpatients: 154, outpatients: 522, emergency: 95 },
  { month: "May", inpatients: 162, outpatients: 543, emergency: 101 },
  { month: "Jun", inpatients: 159, outpatients: 528, emergency: 97 },
];

const departmentRevenue = [
  { name: "Cardiology", value: 35000 },
  { name: "Orthopedics", value: 28000 },
  { name: "Pediatrics", value: 22000 },
  { name: "Neurology", value: 30000 },
  { name: "Radiology", value: 25000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Sample reports data
const reportsData = [
  {
    id: "REP001",
    title: "Monthly Patient Statistics",
    category: "Patient",
    createdBy: "Dr. James Wilson",
    createdAt: "2023-05-15",
    status: "Published",
  },
  {
    id: "REP002",
    title: "Quarterly Revenue Analysis",
    category: "Financial",
    createdBy: "Finance Department",
    createdAt: "2023-05-10",
    status: "Published",
  },
  {
    id: "REP003",
    title: "Staff Performance Review",
    category: "HR",
    createdBy: "HR Manager",
    createdAt: "2023-05-08",
    status: "Draft",
  },
  {
    id: "REP004",
    title: "Medication Usage Trends",
    category: "Pharmacy",
    createdBy: "Pharmacy Department",
    createdAt: "2023-05-05",
    status: "Published",
  },
  {
    id: "REP005",
    title: "Emergency Department Efficiency",
    category: "Operations",
    createdBy: "Dr. Sarah Parker",
    createdAt: "2023-05-01",
    status: "Under Review",
  },
];

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateReportOpen, setIsCreateReportOpen] = useState<boolean>(false);
  const [isViewReportOpen, setIsViewReportOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Filter reports based on category and search term
  const filteredReports = reportsData.filter((report) => {
    const matchesCategory =
      selectedCategory === "all" || report.category === selectedCategory;
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewReportOpen(true);
  };

  const handleCreateReport = (formData: any) => {
    toast({
      title: "Report Created",
      description: "Your report has been created successfully.",
    });
    setIsCreateReportOpen(false);
  };

  const handleExportReport = (format: string) => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: "Your report is being exported.",
    });
  };

  const handlePrintReport = () => {
    toast({
      title: "Print Report",
      description: "Sending report to printer.",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Share Report",
      description: "Share options opened.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600">
            Generate and manage hospital reports and analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Category</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Patient")}>
                Patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Financial")}>
                Financial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("HR")}>
                HR
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Pharmacy")}>
                Pharmacy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedCategory("Operations")}
              >
                Operations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-hospital-primary hover:bg-hospital-accent"
            onClick={() => setIsCreateReportOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {reportsData.filter((r) => r.status === "Published").length}{" "}
              published
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Patient Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                reportsData.filter((r) => r.category === "Patient" && r.status === "Published")
                  .length
              }
            </div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" /> 12% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Financial Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                reportsData.filter(
                  (r) => r.category === "Financial" && r.status === "Published"
                ).length
              }
            </div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" /> 8% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="mb-8">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Report List
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>
                View and manage all hospital reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.id}
                          </TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.category}</TableCell>
                          <TableCell>{report.createdBy}</TableCell>
                          <TableCell>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                report.status === "Published"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "Draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {report.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewReport(report)}
                                >
                                  View Report
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleExportReport("pdf")}
                                >
                                  Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleExportReport("excel")}
                                >
                                  Export as Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handlePrintReport}>
                                  Print
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleShareReport}>
                                  Share
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          No reports found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2" />
                  Patient Statistics
                </CardTitle>
                <CardDescription>
                  Monthly patient admissions by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={patientStatistics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="inpatients"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="outpatients"
                        stroke="#82ca9d"
                      />
                      <Line
                        type="monotone"
                        dataKey="emergency"
                        stroke="#ffc658"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Department Revenue
                </CardTitle>
                <CardDescription>
                  Revenue distribution by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentRevenue}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          index,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x =
                            cx + radius * Math.cos(-midAngle * RADIAN);
                          const y =
                            cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#fff"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                            >
                              {`${departmentRevenue[index].name} ${(
                                percent * 100
                              ).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentRevenue.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Patient Trends
                </CardTitle>
                <CardDescription>
                  Monthly patient statistics by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={patientStatistics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="inpatients"
                        name="Inpatients"
                        fill="#8884d8"
                      />
                      <Bar
                        dataKey="outpatients"
                        name="Outpatients"
                        fill="#82ca9d"
                      />
                      <Bar
                        dataKey="emergency"
                        name="Emergency"
                        fill="#ffc658"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Report Dialog */}
      <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
            <DialogDescription>
              Fill in the details to generate a new report
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-title" className="text-right">
                Title
              </Label>
              <Input
                id="report-title"
                placeholder="Enter report title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-date-range" className="text-right">
                Date Range
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input type="date" className="flex-1" />
                <span>to</span>
                <Input type="date" className="flex-1" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="report-description"
                placeholder="Enter report description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-status" className="text-right">
                Status
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport}>Create Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={isViewReportOpen} onOpenChange={setIsViewReportOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.title || "Report Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedReport?.id || "Report ID"} -{" "}
              {selectedReport?.category || "Category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium">
                  {selectedReport?.createdBy || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {selectedReport
                    ? new Date(selectedReport.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedReport?.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : selectedReport?.status === "Draft"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedReport?.status || "Unknown"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Report Summary</h3>
              <p className="text-gray-700">
                This is a detailed report about{" "}
                {selectedReport?.category.toLowerCase() || "unknown"} metrics in
                HealthGrid Hospital Management System. The report contains
                analysis of data collected over the past month, including trends,
                anomalies, and recommendations.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Key Findings</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>
                  Overall increase in patient admissions by 12% compared to
                  previous month
                </li>
                <li>
                  Emergency department efficiency improved by 8% after new
                  protocols
                </li>
                <li>
                  Average patient satisfaction score of 4.7/5 based on exit
                  surveys
                </li>
                <li>
                  Medication dispensing errors reduced by 15% after system
                  upgrade
                </li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Charts & Visualizations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientStatistics}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="inpatients"
                      name="Inpatients"
                      fill="#8884d8"
                    />
                    <Bar
                      dataKey="outpatients"
                      name="Outpatients"
                      fill="#82ca9d"
                    />
                    <Bar dataKey="emergency" name="Emergency" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("pdf")}
              >
                <Download className="h-4 w-4 mr-2" /> PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("excel")}
              >
                <Download className="h-4 w-4 mr-2" /> Excel
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintReport}>
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareReport}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
