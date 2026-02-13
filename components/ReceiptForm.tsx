"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReceipt } from "@/app/actions/receipts";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const receiptSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    amountNumeric: z.number().min(0.01, "Amount must be greater than 0"),
    amountWords: z.string().min(2, "Amount in words is required"),
    trackingNumber: z.string().min(2, "Tracking number is required"),
    purpose: z.string().min(2, "Purpose is required"),
    date: z.string().min(1, "Date is required"),
    receiptNumber: z.string().min(1, "Receipt number is required"),
    carrier: z.string().min(1, "Carrier is required"),
});


type ReceiptFormValues = z.infer<typeof receiptSchema>;

interface ReceiptFormProps {
    onSuccess?: (receipt: any) => void;
    defaultReceiptNumber: string;
}

export function ReceiptForm({ onSuccess, defaultReceiptNumber }: ReceiptFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ReceiptFormValues>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            receiptNumber: defaultReceiptNumber,
            customerName: "",
            amountNumeric: 0,
            amountWords: "",
            trackingNumber: "",
            purpose: "Logistic Service",
            carrier: "UPS",
        },
    });


    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: ReceiptFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await createReceipt({
                ...data,
                date: new Date(data.date),
            });
            if (res.success && onSuccess) {
                onSuccess(res.receipt);
            } else if (!res.success) {
                setError(res.error || "Failed to generate receipt");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Generate New Receipt</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="receiptNumber">Receipt No.</Label>
                            <Input id="receiptNumber" {...form.register("receiptNumber")} readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" {...form.register("date")} />
                            {form.formState.errors.date && (
                                <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerName">Received From</Label>
                        <Input id="customerName" {...form.register("customerName")} placeholder="e.g. Professor Ayo Adesopo" />
                        {form.formState.errors.customerName && (
                            <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amountNumeric">Amount (Number)</Label>
                            <Input
                                id="amountNumeric"
                                type="number"
                                step="0.01"
                                {...form.register("amountNumeric", { valueAsNumber: true })}
                                placeholder="0.00"
                            />
                            {form.formState.errors.amountNumeric && (
                                <p className="text-sm text-red-500">{form.formState.errors.amountNumeric.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trackingNumber">Tracking No.</Label>
                            <Input id="trackingNumber" {...form.register("trackingNumber")} placeholder="e.g. LL12345678" />
                            {form.formState.errors.trackingNumber && (
                                <p className="text-sm text-red-500">{form.formState.errors.trackingNumber.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amountWords">Amount in Words</Label>
                        <Input id="amountWords" {...form.register("amountWords")} placeholder="e.g. Thirteen thousand naira only" />
                        {form.formState.errors.amountWords && (
                            <p className="text-sm text-red-500">{form.formState.errors.amountWords.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purpose">Being Payment For</Label>
                        <Input id="purpose" {...form.register("purpose")} />
                        {form.formState.errors.purpose && (
                            <p className="text-sm text-red-500">{form.formState.errors.purpose.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="carrier">Carrier</Label>
                        <select
                            id="carrier"
                            {...form.register("carrier")}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="UPS">UPS</option>
                            <option value="DHL">DHL</option>
                            <option value="FEDEX">FEDEX</option>
                            <option value="ARAMEX">ARAMEX</option>
                        </select>
                        {form.formState.errors.carrier && (
                            <p className="text-sm text-red-500">{form.formState.errors.carrier.message}</p>
                        )}
                    </div>


                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            "Generate Receipt"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
