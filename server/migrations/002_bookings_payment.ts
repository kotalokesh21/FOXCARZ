import { sql } from 'drizzle-orm';
import { db } from '../storage';

export async function addPaymentColumns() {
  await db.execute(sql`
    ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS advance_payment DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS refund_status TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);
}

addPaymentColumns().catch(console.error);