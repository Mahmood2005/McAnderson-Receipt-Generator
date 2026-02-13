"use client";

import { useEffect, useState } from "react";
import { getReceipts } from "@/app/actions/receipts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Home } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function HistoryPage() {
    const [receipts, setReceipts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Receipt-${selectedReceipt?.receiptNumber || "Export"}`,
    });

    useEffect(() => {
        async function fetchReceipts() {
            const res = await getReceipts();
            if (res.success) {
                setReceipts(res.receipts || []);
            }
            setLoading(false);
        }
        fetchReceipts();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Receipt History</h1>
                    <p className="text-muted-foreground">View and reprint past receipts.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Generator
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading receipts...</div>
                    ) : receipts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground italic">No receipts found. Generate one to see it here.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Receipt No.</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Received From</TableHead>
                                    <TableHead>Amount (₦)</TableHead>
                                    <TableHead>Tracking No.</TableHead>
                                    <TableHead>Carrier</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {receipts.map((receipt) => (
                                    <TableRow key={receipt.id}>
                                        <TableCell className="font-medium text-red-600 font-mono">{receipt.receiptNumber}</TableCell>
                                        <TableCell>{dayjs(receipt.date).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell className="uppercase">{receipt.customerName}</TableCell>
                                        <TableCell>{receipt.amountNumeric.toLocaleString()}</TableCell>
                                        <TableCell className="font-mono">{receipt.trackingNumber}</TableCell>
                                        <TableCell>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold border">
                                                {receipt.carrier}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(receipt)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-[850px] max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Receipt Details</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="flex justify-center p-4">
                                                        {selectedReceipt && (
                                                            <div className="space-y-4">
                                                                <div className="flex justify-end">
                                                                    <Button onClick={() => handlePrint()} size="sm">
                                                                        <Download className="mr-2 h-4 w-4" />
                                                                        Download PDF
                                                                    </Button>
                                                                </div>
                                                                <div className="border shadow-md">
                                                                    <ReceiptPreview ref={printRef} receipt={selectedReceipt} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
