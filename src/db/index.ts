import Dexie, { type EntityTable } from "dexie";

export interface SyncMeta {
  _localId: string;
  _dirty: 0 | 1;
  last_modified_at: string;
  deleted_at: string | null;
}

export interface Product extends SyncMeta {
  id?: string;
  store_id: string;
  name: string;
  hsn_code: string | null;
}

export interface Invoice extends SyncMeta {
  id?: string;
  store_id: string;
  /** {store_code}-{device_id}-{local_sequence} — never a central counter (§6) */
  invoice_no: string;
  total_paise: number;
}

export interface OutboxItem {
  id?: number;
  table: string;
  localId: string;
  op: "insert" | "update" | "delete";
  queued_at: string;
  attempts: number;
}

export const db = new Dexie("storeparda") as Dexie & {
  products: EntityTable<Product, "_localId">;
  invoices: EntityTable<Invoice, "_localId">;
  outbox: EntityTable<OutboxItem, "id">;
};

db.version(1).stores({
  products: "_localId, id, store_id, name, _dirty, last_modified_at",
  invoices: "_localId, id, store_id, invoice_no, _dirty, last_modified_at",
  outbox: "++id, table, localId, queued_at",
});
