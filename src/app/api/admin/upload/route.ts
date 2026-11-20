import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'bullion';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const uniqueFileName = `${Date.now()}-${cleanName}`;

    // 1. Save locally in public/<folder>
    const targetDir = path.join(process.cwd(), 'public', folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const localFilePath = path.join(targetDir, uniqueFileName);
    fs.writeFileSync(localFilePath, buffer);

    const localUrl = `/${folder}/${uniqueFileName}`;

    // 2. Also try uploading to Supabase Storage if configured
    if (supabaseAdmin) {
      try {
        const bucketName = 'showroom-media';
        const { data: buckets } = await supabaseAdmin.storage.listBuckets();
        if (!buckets?.some((b) => b.id === bucketName)) {
          await supabaseAdmin.storage.createBucket(bucketName, { public: true });
        }

        const { error: uploadErr } = await supabaseAdmin.storage
          .from(bucketName)
          .upload(`${folder}/${uniqueFileName}`, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadErr) {
          const { data: pubData } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(`${folder}/${uniqueFileName}`);

          if (pubData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: pubData.publicUrl,
              localUrl,
              fileName: uniqueFileName,
            });
          }
        }
      } catch (err) {
        console.warn('Supabase image upload failed, using local fallback:', err);
      }
    }

    return NextResponse.json({
      success: true,
      url: localUrl,
      fileName: uniqueFileName,
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
