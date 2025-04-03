
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Pill, Package2, Building, DollarSign, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicationDetailsProps {
  medication: {
    id: string;
    name: string;
    category: string;
    stock: number;
    price: string;
    supplier: string;
    status: string;
  };
  onUpdate: (medication: any) => void;
  onClose: () => void;
}

const statusStyles = {
  "in-stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "low-stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "out-of-stock": "bg-red-100 text-red-800 hover:bg-red-100",
};

const MedicationDetails = ({ medication, onUpdate, onClose }: MedicationDetailsProps) => {
  const [stock, setStock] = useState(medication.stock.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    const updatedStock = parseInt(stock);
    
    // Determine new status based on stock level
    let newStatus = medication.status;
    if (updatedStock <= 0) {
      newStatus = "out-of-stock";
    } else if (updatedStock <= 50) {
      newStatus = "low-stock";
    } else {
      newStatus = "in-stock";
    }
    
    onUpdate({
      ...medication,
      stock: updatedStock,
      status: newStatus
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Medication Details</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium">{medication.name}</h3>
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <Pill className="h-4 w-4" />
              {medication.category}
            </p>
          </div>
          <Badge 
            className={cn(
              "font-normal capitalize",
              statusStyles[medication.status as keyof typeof statusStyles]
            )}
          >
            {medication.status.replace('-', ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{medication.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Supplier</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Building className="h-5 w-5 text-gray-400" />
              <p className="text-lg">{medication.supplier}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Price</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <p className="text-lg font-semibold">{medication.price}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Stock</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Package2 className="h-5 w-5 text-gray-400" />
              <p className="text-lg font-semibold">{medication.stock} units</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Update Stock</CardTitle>
            <CardDescription>
              Adjust the current stock level of this medication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {isEditing ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="stock">New Stock Level</Label>
                      <div className="flex gap-2 items-center">
                        <ShoppingCart className="h-5 w-5 text-gray-400" />
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate}>
                      Update Stock
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Update Stock Level
                </Button>
              )}
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

export default MedicationDetails;
