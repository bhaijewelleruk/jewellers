import { NextRequest, NextResponse } from 'next/server';
import { getBullionCatalog, saveBullionItem, deleteBullionItem } from '@/lib/bullion-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metal = searchParams.get('metal'); // 'gold' | 'silver'
    const id = searchParams.get('id');

    const catalog = await getBullionCatalog();

    if (id) {
      const item =
        catalog.goldItems.find((i) => i.id === id) ||
        catalog.silverItems.find((i) => i.id === id);

      if (!item) {
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, item });
    }

    if (metal === 'gold') {
      return NextResponse.json({ success: true, items: catalog.goldItems });
    }
    if (metal === 'silver') {
      return NextResponse.json({ success: true, items: catalog.silverItems });
    }

    return NextResponse.json({
      success: true,
      goldItems: catalog.goldItems,
      silverItems: catalog.silverItems,
      lastUpdated: catalog.lastUpdated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch bullion items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.name || !body.metal) {
      return NextResponse.json(
        { success: false, error: 'Product name and metal are required' },
        { status: 400 }
      );
    }

    const updatedCatalog = await saveBullionItem(body);

    return NextResponse.json({
      success: true,
      message: 'Bullion item saved successfully',
      catalog: updatedCatalog,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save bullion item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Bullion item id is required' },
        { status: 400 }
      );
    }

    const updatedCatalog = await deleteBullionItem(id);

    return NextResponse.json({
      success: true,
      message: `Bullion item '${id}' removed successfully`,
      catalog: updatedCatalog,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete bullion item' },
      { status: 500 }
    );
  }
}
