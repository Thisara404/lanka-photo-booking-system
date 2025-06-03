import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ProductsManagement() {
  const [loading, setLoading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Management</CardTitle>
        <CardDescription>Manage your prints and presets</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">This feature is under development.</p>
            <Button disabled>Add New Product</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}