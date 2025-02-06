import admin from "firebase-admin";
import { NextResponse } from "next/server";

// ตรวจสอบว่ามี Firebase App ถูกสร้างหรือยัง
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const snapshot = await db.collection("power_solar").orderBy("create_date", "desc").get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    // แปลงข้อมูลจาก Firestore เป็น Array
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 });
  }
}
