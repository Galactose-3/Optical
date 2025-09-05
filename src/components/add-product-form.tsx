
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Barcode, ScanLine, PlusCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import BarcodeScanner from './barcode-scanner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const productSchema = z.object({
  id: z.string().min(1, 'Barcode/ID is required.'),
  name: z.string().min(1, 'Product name is required.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  stock: z.coerce.number().min(0, 'Stock must be a positive number.'),
  type: z.enum(['Eyewear', 'Service', 'Contact Lenses']),
  brand: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductFormProps {
    onAddProduct: (product: Omit<Product, 'id'> & { id: string }) => void;
}

export function AddProductForm({ onAddProduct }: AddProductFormProps) {
    const { toast } = useToast();
    const [isScannerOpen, setScannerOpen] = React.useState(false);

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            id: '',
            name: '',
            description: '',
            price: 0,
            stock: 0,
            type: 'Eyewear',
            brand: '',
        }
    });

    const handleScan = (barcode: string) => {
        form.setValue('id', barcode);
        toast({
            title: 'Barcode Scanned',
            description: `Barcode ${barcode} has been entered.`
        });
        setScannerOpen(false);
    }

    const generateBarcode = () => {
        const barcode = `LOCAL-${Date.now().toString(36).toUpperCase()}`;
        form.setValue('id', barcode);
         toast({
            title: 'Barcode Generated',
            description: `Generated: ${barcode}`
        });
    }

    const onSubmit = (data: ProductFormData) => {
        const productData = {
            ...data,
            description: data.description || '',
        };
        onAddProduct(productData);
        toast({
            title: 'Product Added',
            description: `${data.name} has been added to the inventory.`
        });
        form.reset();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Fill the form to add a new product to your inventory.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        <FormField 
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Barcode / Product ID</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="Manually enter or scan" {...field} />
                                        </FormControl>
                                        <Dialog open={isScannerOpen} onOpenChange={setScannerOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" type="button"><ScanLine className="h-4 w-4" /></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <BarcodeScanner onScan={handleScan} />
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="outline" size="icon" type="button" onClick={generateBarcode}><Barcode className="h-4 w-4"/></Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., VisionPro Frames" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Eyewear">Eyewear</SelectItem>
                                            <SelectItem value="Contact Lenses">Contact Lenses</SelectItem>
                                            <SelectItem value="Service">Service</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField 
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField 
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField 
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Ray-Ban" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A short description of the product." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
