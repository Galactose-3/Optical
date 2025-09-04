
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CalendarIcon, PlusCircle, Trash2, ScanLine, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Patient, Product, InvoiceItem, Invoice } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { useCurrency } from '@/context/currency-context';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import BarcodeScanner from './barcode-scanner';
import { ScrollArea } from './ui/scroll-area';
import { getProducts } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

const invoiceItemSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  productName: z.string(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  unitPrice: z.coerce.number(), // This will be the base USD price
});

const invoiceFormSchema = z.object({
  patientName: z.string().min(1, "Patient name is required."),
  issueDate: z.date({ required_error: "Issue date is required." }),
  dueDate: z.date({ required_error: "Due date is required." }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required."),
  total: z.number(), // This will be the base USD total
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
    onCreate: (invoice: Omit<Invoice, 'id' | 'status' | 'patientId'>) => void;
}

const InvoiceItemRow = ({ field, index, remove, control, register, formatCurrency, convertedValues, registerValue }: any) => {
    const unitPriceId = `form_item_unit_price_${field.id}`;
    const totalId = `form_item_total_${field.id}`;

    React.useEffect(() => {
        registerValue(unitPriceId, field.unitPrice);
        registerValue(totalId, field.unitPrice * field.quantity);
    }, [registerValue, unitPriceId, totalId, field.unitPrice, field.quantity]);

    const displayUnitPrice = convertedValues[unitPriceId] ?? field.unitPrice;
    const displayTotal = convertedValues[totalId] ?? (field.unitPrice * field.quantity);

    return (
        <TableRow>
            <TableCell className="font-medium">{field.productName}</TableCell>
            <TableCell>
                <Input
                    type="number"
                    {...register(`items.${index}.quantity`)}
                    className="text-center"
                />
            </TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(displayUnitPrice)}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(displayTotal)}</TableCell>
            <TableCell>
                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </TableRow>
    )
}


export function InvoiceForm({ onCreate }: InvoiceFormProps) {
    const { toast } = useToast();
    const { formatCurrency, registerValue, convertedValues } = useCurrency();
    const [barcode, setBarcode] = React.useState('');
    const [isScannerOpen, setScannerOpen] = React.useState(false);
    const [productSearch, setProductSearch] = React.useState('');
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const prods = await getProducts();
            setProducts(prods);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const form = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            patientName: '',
            issueDate: new Date(),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
            items: [],
            total: 0,
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const watchItems = form.watch('items');

    const subtotal = React.useMemo(() => {
        return watchItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    }, [watchItems]);

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    React.useEffect(() => {
        form.setValue('total', total);
        registerValue('form_subtotal', subtotal);
        registerValue('form_tax', tax);
        registerValue('form_total', total);
    }, [total, subtotal, tax, form, registerValue]);

    const displaySubtotal = convertedValues['form_subtotal'] ?? subtotal;
    const displayTax = convertedValues['form_tax'] ?? tax;
    const displayTotal = convertedValues['form_total'] ?? total;


    const addProductToInvoice = (productToAdd: Product) => {
        const existingItemIndex = fields.findIndex(item => item.productId === productToAdd.id);

        if (existingItemIndex > -1) {
            const currentItem = fields[existingItemIndex];
            update(existingItemIndex, {
                ...currentItem,
                quantity: currentItem.quantity + 1,
            });
            toast({ title: "Quantity Updated", description: `${productToAdd.name} quantity increased.`});
        } else {
            append({
                productId: productToAdd.id,
                productName: productToAdd.name,
                quantity: 1,
                unitPrice: productToAdd.price,
            });
            toast({ title: "Product Added", description: `${productToAdd.name} added to invoice.`});
        }
    }

    const handleBarcodeScan = (scannedBarcode: string) => {
        setBarcode(scannedBarcode);
        setScannerOpen(false);
        toast({ title: "Barcode Scanned", description: `Product ID: ${scannedBarcode}`});
        addProductByBarcode(scannedBarcode);
    };

    const addProductByBarcode = (targetBarcode: string) => {
        if (!targetBarcode) return;

        const product = products.find(p => p.id === targetBarcode);

        if (!product) {
            toast({ variant: 'destructive', title: "Product Not Found", description: `No product found with barcode: ${targetBarcode}`});
            return;
        }

        addProductToInvoice(product);
        setBarcode(''); // Clear input after adding
    };

    const filteredProducts = React.useMemo(() => {
        if (!productSearch) return products;
        return products.filter(p => 
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.brand?.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [productSearch, products]);

    const onSubmit = (data: InvoiceFormData) => {
        const invoiceData = {
            ...data,
            patientId: `CUST-${Date.now()}` // Create a temporary ID
        };
        onCreate(invoiceData);
        toast({
            title: 'Invoice Created',
            description: `Invoice for ${data.patientName} has been successfully created.`,
        });
        form.reset();
    };

    if (isLoading) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96 mt-2" />
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                    <CardTitle>Create New Invoice</CardTitle>
                    <CardDescription>Fill out the form to generate a new invoice for a patient.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 px-0">
                    <div className="grid md:grid-cols-3 gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input id="patientName" {...form.register('patientName')} placeholder="Enter patient's name" />
                            {form.formState.errors.patientName && <p className="text-sm text-destructive">{form.formState.errors.patientName.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Issue Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("justify-start text-left font-normal", !form.watch('issueDate') && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch('issueDate') ? format(form.watch('issueDate'), "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={form.watch('issueDate')} onSelect={(d) => d && form.setValue('issueDate', d)} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                            <Label>Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("justify-start text-left font-normal", !form.watch('dueDate') && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch('dueDate') ? format(form.watch('dueDate'), "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={form.watch('dueDate')} onSelect={(d) => d && form.setValue('dueDate', d)} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Label className="text-lg font-medium">Invoice Items</Label>
                        <div className="grid sm:grid-cols-3 gap-2 my-4">
                             <div className="sm:col-span-2 grid gap-2">
                                <Label htmlFor="barcode-input">Add by Barcode</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="barcode-input"
                                        value={barcode}
                                        onChange={(e) => setBarcode(e.target.value)}
                                        placeholder="Scan or enter product barcode"
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addProductByBarcode(barcode); }}}
                                    />
                                    <Dialog open={isScannerOpen} onOpenChange={setScannerOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" type="button" size="icon"><ScanLine className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <BarcodeScanner onScan={handleBarcodeScan} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="opacity-0 hidden sm:block">Add</Label>
                                <Button type="button" className="w-full" onClick={() => addProductByBarcode(barcode)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                                </Button>
                            </div>
                        </div>

                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="w-[100px]">Quantity</TableHead>
                                    <TableHead className="w-[150px] text-right">Unit Price</TableHead>
                                    <TableHead className="w-[150px] text-right">Total</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No items added yet.</TableCell></TableRow>}
                                {fields.map((field, index) => (
                                     <InvoiceItemRow
                                        key={field.id}
                                        field={field}
                                        index={index}
                                        remove={remove}
                                        control={form.control}
                                        register={form.register}
                                        formatCurrency={formatCurrency}
                                        convertedValues={convertedValues}
                                        registerValue={registerValue}
                                     />
                                ))}
                            </TableBody>
                         </Table>
                         {form.formState.errors.items && <p className="text-sm text-destructive mt-2">{form.formState.errors.items.message || form.formState.errors.items?.root?.message}</p>}
                    </div>

                    <Separator />

                    <div>
                        <Label className="text-lg font-medium">Available Products</Label>
                         <div className="relative my-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search for products or brands..."
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ScrollArea className="h-64 rounded-md border">
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map(product => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.brand || 'N/A'}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(convertedValues[`prod_price_${product.id}`] ?? product.price)}</TableCell>
                                            <TableCell>
                                                <Button size="sm" type="button" onClick={() => addProductToInvoice(product)}>Add</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>


                    <div className="flex justify-end mt-4">
                        <div className="w-full max-w-sm space-y-2">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(displaySubtotal)}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Tax (8%):</span>
                                <span className="font-medium">{formatCurrency(displayTax)}</span>
                            </div>
                            <Separator />
                             <div className="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span>{formatCurrency(displayTotal)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-0">
                    <Button type="submit">Create Invoice</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
