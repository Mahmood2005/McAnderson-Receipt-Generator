"use strict";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReceipt(data: {
    receiptNumber: string;
    date: Date;
    customerName: string;
    amountWords: string;
    amountNumeric: number;
    trackingNumber: string;
    purpose: string;
    carrier: string;
}) {
    try {
        const receipt = await prisma.receipt.create({
            data,
        });

        revalidatePath("/history");
        return { success: true, receipt };
    } catch (error: any) {
        console.error("Failed to create receipt:", error);
        return { success: false, error: error.message || "Failed to create receipt" };
    }

}

export async function getReceipts() {
    try {
        const receipts = await prisma.receipt.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, receipts };
    } catch (error) {
        console.error("Failed to fetch receipts:", error);
        return { success: false, error: "Failed to fetch receipts" };
    }
}

export async function getReceiptById(id: string) {
    try {
        const receipt = await prisma.receipt.findUnique({
            where: { id },
        });
        return { success: true, receipt };
    } catch (error) {
        console.error("Failed to fetch receipt:", error);
        return { success: false, error: "Failed to fetch receipt" };
    }
}
