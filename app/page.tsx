"use client";

import { useState } from "react";
import { ReceiptForm } from "@/components/ReceiptForm";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { Button } from "@/components/ui/button";
import { Download, History, Plus } from "lucide-react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export default function Home() {
  const [createdReceipt, setCreatedReceipt] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${createdReceipt?.receiptNumber || "New"}`,
  });

  const nextReceiptNumber = `MC-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receipt Generator</h1>
          <p className="text-muted-foreground">Create and manage logistics receipts for McAnderson Logistics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/history">
              <History className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <ReceiptForm
            defaultReceiptNumber={nextReceiptNumber}
            onSuccess={(receipt) => setCreatedReceipt(receipt)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border">
            <h2 className="text-lg font-semibold">Live Preview</h2>
            {createdReceipt && (
              <Button onClick={() => handlePrint()} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>

          <div className="flex justify-center border p-4 bg-slate-100 rounded-lg overflow-x-auto">
            {createdReceipt ? (
              <ReceiptPreview ref={receiptRef} receipt={createdReceipt} />
            ) : (
              <div className="w-[500px] h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400 italic">
                Fill out the form to generate a preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
