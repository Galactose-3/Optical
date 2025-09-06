


import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Upload, Loader2, Camera } from 'lucide-react';

import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import PrescriptionScannerCamera from './prescription-scanner-camera';

const prescriptionDetailSchema = z.object({
    right: z.coerce.number().default(0),
    left: z.coerce.number().default(0),
});

const patientSchema = z.object({
  name: z.string().min(1, 'Patient name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(1, 'Phone number is required.'),
  address: z.object({
      city: z.string().optional(),
      state: z.string().optional(),
  }).optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  prescription: z.object({
    sphere: prescriptionDetailSchema,
    cylinder: prescriptionDetailSchema,
    axis: prescriptionDetailSchema,
    add: prescriptionDetailSchema,
  }),
});

export function AddPatientForm({ onAddPatient }) {
    const { toast } = useToast();
    const [isScanning, setIsScanning] = React.useState(false);
    const [isCameraScannerOpen, setCameraScannerOpen] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const form = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: { city: '', state: '' },
            insuranceProvider: '',
            insurancePolicyNumber: '',
            prescription: {
                sphere: { right: 0, left: 0 },
                cylinder: { right: 0, left: 0 },
                axis: { right: 0, left: 0 },
                add: { right: 0, left: 0 },
            }
        }
    });
    
    const processPrescriptionScan = async () => {
        setIsScanning(true);
        toast({ title: 'AI Scanner activated...', description: 'Analyzing prescription. Please wait.' });

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsScanning(false);
        
        // Mocked successful result
        const mockResult = {
            patientName: 'John Doe (Scanned)',
            prescription: {
                sphere: { right: -2.5, left: -2.75 },
                cylinder: { right: -0.75, left: -0.5 },
                axis: { right: 90, left: 85 },
                add: { right: 1.25, left: 1.25 },
            }
        };

        toast({ title: 'Scan Successful!', description: 'Patient and prescription details have been populated.' });
        
        form.setValue('name', mockResult.patientName || '');
        form.setValue('prescription', mockResult.prescription);
    }


    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        await processPrescriptionScan();
    };

    const handleCameraCapture = async (dataUri) => {
        setCameraScannerOpen(false);
        await processPrescriptionScan();
    }

    const onSubmit = (data) => {
        const newPatientData = {
            ...data,
            address: {
                city: data.address?.city || 'Unknown',
                state: data.address?.state || ''
            },
            insuranceProvider: data.insuranceProvider || '',
            insurancePolicyNumber: data.insurancePolicyNumber || ''
        }
        onAddPatient(newPatientData);
        toast({
            title: 'Patient Added',
            description: `${data.name} has been added to the system.`
        });
        form.reset();
    }
    
    const renderPrescriptionInputs = (eye, eyeLabel) => (
        <div className="space-y-2">
             <FormLabel className="text-center block text-muted-foreground">{eyeLabel}</FormLabel>
             <div className="grid grid-cols-4 gap-2">
                 <FormField control={form.control} name={`prescription.sphere.${eye}`} render={({ field }) => (
                     <FormItem><FormControl><Input placeholder="SPH" type="number" step="0.25" {...field} /></FormControl></FormItem>
                 )} />
                  <FormField control={form.control} name={`prescription.cylinder.${eye}`} render={({ field }) => (
                     <FormItem><FormControl><Input placeholder="CYL" type="number" step="0.25" {...field} /></FormControl></FormItem>
                 )} />
                  <FormField control={form.control} name={`prescription.axis.${eye}`} render={({ field }) => (
                     <FormItem><FormControl><Input placeholder="Axis" type="number" {...field} /></FormControl></FormItem>
                 )} />
                  <FormField control={form.control} name={`prescription.add.${eye}`} render={({ field }) => (
                     <FormItem><FormControl><Input placeholder="Add" type="number" step="0.25" {...field} /></FormControl></FormItem>
                 )} />
             </div>
        </div>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isScanning} className="w-full">
                        {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Scan from File
                    </Button>
                     <Dialog open={isCameraScannerOpen} onOpenChange={setCameraScannerOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" disabled={isScanning} className="w-full">
                                {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                                Scan with Camera
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Scan Prescription</DialogTitle>
                                <DialogDescription>Position the prescription within the frame and capture.</DialogDescription>
                            </DialogHeader>
                            <PrescriptionScannerCamera onCapture={handleCameraCapture} />
                        </DialogContent>
                    </Dialog>
                </div>


                <Separator />
                
                <h3 className="text-lg font-medium text-center">Or Enter Details Manually</h3>

                <FormField 
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient Name</FormLabel>
                            <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="john.doe@example.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input placeholder="555-123-4567" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="address.city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="e.g., Optic City" {...field} /></FormControl>
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="address.state" render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl><Input placeholder="e.g., CA" {...field} /></FormControl>
                        </FormItem>
                    )} />
                 </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="insuranceProvider" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Insurance Provider (Optional)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="insurancePolicyNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Policy Number (Optional)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                    )} />
                 </div>

                 <Separator />

                 <h3 className="text-lg font-medium text-center">Prescription Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderPrescriptionInputs('right', 'Right Eye (OD)')}
                    {renderPrescriptionInputs('left', 'Left Eye (OS)')}
                 </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isScanning}><PlusCircle className="mr-2 h-4 w-4" /> Add Patient</Button>
                </div>
            </form>
        </Form>
    );
}
