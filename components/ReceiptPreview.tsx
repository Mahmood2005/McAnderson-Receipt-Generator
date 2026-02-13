"use client";

import React from "react";
import Image from "next/image";
import dayjs from "dayjs";

interface ReceiptProps {
    receipt: {
        receiptNumber: string;
        date: Date;
        customerName: string;
        amountWords: string;
        amountNumeric: number;
        trackingNumber: string;
        purpose: string;
        carrier: string;
    };
}

const carrierLogos: Record<string, string> = {
    UPS: "/images/ups-logo.png",
    DHL: "/images/dhl-logo.png",
    FEDEX: "/images/aramex-logo.png",
    ARAMEX: "/images/fedex-logo.png",
};


export const ReceiptPreview = React.forwardRef<HTMLDivElement, ReceiptProps>(
    ({ receipt }, ref) => {
        return (
            <div
                ref={ref}
                className="bg-white border p-8 w-[800px] min-h-[500px] shadow-lg flex flex-col font-mono text-slate-800 relative overflow-hidden"
                style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
                {/* Paper Texture/Watermark effect can be added here */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center rotate-[-30deg] text-8xl font-bold">
                    MCANDERSON LOGISTICS
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="relative w-48 h-12">
                        <Image
                            src="/images/mcanderson-logo.jpg"
                            alt="McAnderson Logistics"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="relative w-24 h-12 mb-1">
                            <Image
                                src={carrierLogos[receipt.carrier] || carrierLogos.UPS}
                                alt={receipt.carrier}
                                fill
                                className="object-contain object-right"
                            />
                        </div>
                    </div>
                </div>


                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold underline tracking-widest">OFFICIAL RECEIPT</h1>
                </div>

                {/* Content Section */}
                <div className="flex-grow space-y-6 text-sm md:text-base">
                    <div className="flex justify-between border-b border-dotted border-slate-400 pb-1">
                        <div>
                            <span className="font-bold">No. </span>
                            <span className="text-red-600 font-bold">{receipt.receiptNumber}</span>
                        </div>
                        <div>
                            <span className="font-bold">Date: </span>
                            <span>{dayjs(receipt.date).format("DD/MM/YYYY")}</span>
                        </div>
                    </div>

                    <div className="border-b border-dotted border-slate-400 pb-1">
                        <span className="font-bold italic">Received From: </span>
                        <span className="underline decoration-slate-300 underline-offset-4 font-medium uppercase min-w-[300px] inline-block">
                            {receipt.customerName || "........................................................"}
                        </span>
                    </div>

                    <div className="border-b border-dotted border-slate-400 pb-1">
                        <span className="font-bold italic">The Sum of: </span>
                        <span className="underline decoration-slate-300 underline-offset-4 font-medium uppercase min-w-[400px] inline-block">
                            {receipt.amountWords || "........................................................"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-b border-dotted border-slate-400 pb-1 flex items-center">
                            <span className="font-bold italic mr-2 text-lg">₦ </span>
                            <span className="bg-slate-100 px-4 py-1 font-bold border rounded-sm min-w-[120px]">
                                {receipt.amountNumeric.toLocaleString()}
                            </span>
                        </div>
                        <div className="border-b border-dotted border-slate-400 pb-1">
                            <span className="font-bold italic">Tracking No: </span>
                            <span className="font-bold tracking-wider">{receipt.trackingNumber || ".................."}</span>
                        </div>
                    </div>

                    <div className="border-b border-dotted border-slate-400 pb-1">
                        <span className="font-bold italic">Being Payment for: </span>
                        <span className="underline decoration-slate-300 underline-offset-4 font-medium min-w-[300px] inline-block">
                            {receipt.purpose || "........................................................"}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 flex justify-end">
                    <div className="text-center w-64 pt-2 border-t border-slate-800">
                        <p className="text-xs font-bold mb-1">Receiver's Signature / Stamp</p>
                        <div className="h-12 border-b border-slate-200 mb-2"></div>
                        <p className="text-[10px] text-slate-500 italic uppercase">Logistics & Freight Services</p>
                    </div>
                </div>

                {/* Vertical Separator lines or other accents could go here */}
            </div>
        );
    }
);

ReceiptPreview.displayName = "ReceiptPreview";
