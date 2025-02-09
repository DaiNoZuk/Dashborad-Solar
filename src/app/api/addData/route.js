import admin from "firebase-admin";
import { NextResponse } from 'next/server';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

export async function POST(req, res) {
    try {
        const body = await req.json();

        // เช็คว่าข้อมูลที่ส่งมาต้องเป็น array
        if (!Array.isArray(body)) {
            return NextResponse.json({ error: "Data must be an array of objects" });
        }

        // เริ่มต้น Batch Write
        const batch = db.batch();
        const collectionRef = db.collection("power_solar");

        body.forEach((item) => {
            const { i, v, create_date } = item;

            // ตรวจสอบว่าข้อมูลครบถ้วน
            if (i === undefined || v === undefined || !create_date) {
                throw new Error("Each object must contain i, v, and create_date");
            }

            // ตรวจสอบว่า create_date ถูกต้องหรือไม่
            const timestamp = new Date(create_date);
            if (isNaN(timestamp.getTime())) {
                throw new Error("Invalid date format in one of the items. Use ISO 8601 or timestamp.");
            }

            // เพิ่มข้อมูลลงใน batch
            const docRef = collectionRef.doc(); // ให้ Firestore สร้าง ID อัตโนมัติ
            batch.set(docRef, {
                i,
                v,
                create_date: timestamp,
            });
        });

        // ดำเนินการ batch commit
        await batch.commit();

        return NextResponse.json({ message: "All data saved successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save data", details: error.message });
    }
}
