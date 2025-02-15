import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    const layoutData = await request.json();

    if (!layoutData) {
        return NextResponse.json('No layout data provided');
    }

    const filePath = path.join('src/app/layout.json');
    console.log("Layout data is: ", layoutData);
    await fs.writeFile(filePath, JSON.stringify(layoutData), (err) => {
        if (err) {
            console.log("Failed To write");
            return Response.json('Failed to save layout data');
        }
    });
    return Response.json('Layout data saved successfully');
};

export async function GET() {
    const filePath = path.join('src/app/layout.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch {
        return NextResponse.json('Failed to read layout data');
    }
};