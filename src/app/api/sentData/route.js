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
        console.log("Received Body:", body);
        const { i, v } = body;

        // เช็คว่ามีค่าที่ต้องการหรือไม่
        if (i === undefined || v === undefined) {
            return NextResponse.json({ error: "Missing required fields: i, v" });
        }

        // บันทึกข้อมูลลง Firestore พร้อม timestamp อัตโนมัติ
        const docRef = await db.collection("power_solar").add({
            i,  // ค่ากระแสไฟ
            v,  // ค่าแรงดันไฟ
            create_date: admin.firestore.FieldValue.serverTimestamp() // ให้ Firebase สร้าง timestamp เอง
        });


        return NextResponse.json({ message: "Data saved successfully", id: docRef.id })
    } catch (error) {
        return NextResponse.json({ error: "Failed to save data", details: error.message })
    }
}