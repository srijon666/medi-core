
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Printer, Download, Share2 } from "lucide-react";

interface ReportViewerProps {
  report: {
    id: string;
    name: string;
    category: string;
    date: string;
    author: string;
    type: string;
    status: string;
  };
  onClose: () => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

// Mock data for different report types
const patientAnalyticsData = [
  { month: 'Jan', patients: 65 },
  { month: 'Feb', patients: 59 },
  { month: 'Mar', patients: 80 },
  { month: 'Apr', patients: 81 },
  { month: 'May', patients: 56 },
  { month: 'Jun', patients: 55 },
];

const departmentData = [
  { name: 'Cardiology', value: 400 },
  { name: 'Neurology', value: 300 },
  { name: 'Pediatrics', value: 300 },
  { name: 'Orthopedics', value: 200 },
  { name: 'Radiology', value: 100 },
];

const documentData = `
# ${new Date().toLocaleDateString()} Report Summary

## Overview
This report provides a comprehensive analysis of hospital operations over the past quarter. Key metrics and trends are highlighted below.

## Key Findings
1. Patient admissions increased by 12% compared to the previous quarter
2. Average length of stay decreased from 4.2 days to 3.8 days
3. Emergency department visits remained consistent with seasonal patterns
4. Outpatient procedures increased by 8%

## Department Performance
- Cardiology: 92% capacity utilization
- Neurology: 87% capacity utilization
- Pediatrics: 76% capacity utilization
- Orthopedics: 81% capacity utilization
- Radiology: 94% capacity utilization

## Recommendations
1. Increase staffing in high-utilization departments
2. Review patient discharge protocols to further reduce length of stay
3. Expand outpatient services to accommodate increasing demand
4. Implement new scheduling system to optimize resource allocation

## Next Steps
The hospital administration will review these findings and develop an action plan to address the recommendations by the end of the month.
`;

const ReportViewer = ({ report, onClose }: ReportViewerProps) => {
  // Generate appropriate content based on report type
  const renderReportContent = () => {
    if (report.type === "chart") {
      if (report.category === "Analytics" || report.name.includes("Patient")) {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientAnalyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" fill="#8884d8" name="Patient Count" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (report.category === "Feedback" || report.name.includes("Department")) {
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      }
    } else {
      // Document type report
      return (
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm">{documentData}</pre>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{report.name}</h2>
          <div className="text-gray-500 text-sm">
            {report.category} | {report.date} | {report.author}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <Card className="border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <CardTitle>{report.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderReportContent()}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ReportViewer;
