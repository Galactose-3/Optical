import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { getCustomers } from "@/lib/api";

export default function CustomersList() {
    const { data, loading, error } = useApi(() => getCustomers({ page: 1, limit: 10 }));
    const customers = data?.customers || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Customers
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-500">Error loading customers: {error}</p>
                ) : (
                    <div className="space-y-2">
                        {customers.map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-sm text-muted-foreground">{c.phone}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Invoices: {c.invoices?.length || 0}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
