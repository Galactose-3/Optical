

'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, parseISO } from 'date-fns';
import type { Appointment } from '@/lib/types';
import { getAppointments } from '@/lib/api';
import { Skeleton } from './ui/skeleton';

export function DoctorSchedule() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [appointments, setAppointments] = React.useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const app = await getAppointments();
            setAppointments(app);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const selectedDayAppointments = appointments.filter(a => date && isSameDay(parseISO(a.date), date));
    
    if (isLoading) {
        return (
             <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        )
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Appointment Calendar</h3>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    components={{
                        DayContent: (props) => {
                            const hasAppointment = appointments.some(a => isSameDay(parseISO(a.date), props.date));
                            return (
                                <div className="relative">
                                    <p>{format(props.date, 'd')}</p>
                                    {hasAppointment && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
                                </div>
                            )
                        }
                    }}
                />
            </div>
            <div>
                 <h3 className="text-lg font-medium mb-4">
                    Appointments for {date ? format(date, 'PPP') : '...'}
                </h3>
                <Card>
                    <CardContent className="pt-6">
                        {selectedDayAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {selectedDayAppointments.map((app, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                                       <div>
                                            <p className="font-semibold">{app.doctorName}</p>
                                            <p className="text-sm text-muted-foreground">{app.time} - {app.patientName}</p>
                                       </div>
                                        <Badge>{app.status}</Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                No appointments scheduled for this day.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
