import fs from 'fs';
import path from 'path';
import { BullionProduct, INITIAL_GOLD_ITEMS, INITIAL_SILVER_ITEMS } from '@/data/bullion-items';
import { supabaseAdmin } from './supabaseAdmin';

export interface BullionStoreData {
  goldItems: BullionProduct[];
  silverItems: BullionProduct[];
  lastUpdated: string;
}

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'bullion-store.json');

export function getLocalBullionStore(): BullionStoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data.goldItems) && Array.isArray(data.silverItems)) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error reading bullion-store.json:', err);
  }

  return {
    goldItems: INITIAL_GOLD_ITEMS,
    silverItems: INITIAL_SILVER_ITEMS,
    lastUpdated: new Date().toISOString(),
  };
}

export function saveLocalBullionStore(data: BullionStoreData): boolean {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing bullion-store.json:', err);
    return false;
  }
}

export async function getBullionCatalog(): Promise<BullionStoreData> {
  // If Supabase is configured, try to fetch from `bullion_catalog` table
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('bullion_catalog')
        .select('*')
        .eq('id', 'main_catalog')
        .single();

      if (!error && data && Array.isArray(data.gold_items)) {
        return {
          goldItems: data.gold_items,
          silverItems: data.silver_items || [],
          lastUpdated: data.updated_at || new Date().toISOString(),
        };
      }
    } catch {
      // Fallback to local file
    }
  }

  return getLocalBullionStore();
}

export async function saveBullionItem(item: BullionProduct): Promise<BullionStoreData> {
  const current = await getBullionCatalog();
  const isGold = item.metal === 'gold';
  const targetList = isGold ? [...current.goldItems] : [...current.silverItems];

  const existingIdx = targetList.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    targetList[existingIdx] = { ...targetList[existingIdx], ...item };
  } else {
    // Generate id if not present
    if (!item.id) {
      item.id = `${item.metal}-${item.weightGrams}g-${Date.now()}`;
    }
    targetList.unshift(item);
  }

  const updated: BullionStoreData = {
    goldItems: isGold ? targetList : current.goldItems,
    silverItems: isGold ? current.silverItems : targetList,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Save to local JSON store
  saveLocalBullionStore(updated);

  // 2. Sync to Supabase if configured
  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('bullion_catalog').upsert({
        id: 'main_catalog',
        gold_items: updated.goldItems,
        silver_items: updated.silverItems,
        updated_at: updated.lastUpdated,
      });
    } catch (err) {
      console.warn('Supabase sync error (non-fatal):', err);
    }
  }

  return updated;
}

export async function deleteBullionItem(id: string): Promise<BullionStoreData> {
  const current = await getBullionCatalog();

  const updated: BullionStoreData = {
    goldItems: current.goldItems.filter((i) => i.id !== id),
    silverItems: current.silverItems.filter((i) => i.id !== id),
    lastUpdated: new Date().toISOString(),
  };

  saveLocalBullionStore(updated);

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('bullion_catalog').upsert({
        id: 'main_catalog',
        gold_items: updated.goldItems,
        silver_items: updated.silverItems,
        updated_at: updated.lastUpdated,
      });
    } catch (err) {
      console.warn('Supabase sync error (non-fatal):', err);
    }
  }

  return updated;
}
