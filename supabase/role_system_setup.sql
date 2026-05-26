-- 1. Retailer-Customer bridge table
CREATE TABLE IF NOT EXISTS retailer_customers (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activated_at timestamptz DEFAULT now(),
  plan_given   text DEFAULT 'PRO',
  expires_at   timestamptz,
  UNIQUE(retailer_id, customer_id)
);

-- 2. Enable RLS
ALTER TABLE retailer_customers ENABLE ROW LEVEL SECURITY;

-- 3. Retailer sees only their own customer links
CREATE POLICY "retailer_own_customers_only"
ON retailer_customers FOR SELECT
USING (retailer_id = auth.uid());

-- 4. Only service role can insert/update/delete
CREATE POLICY "service_role_manage"
ON retailer_customers FOR ALL
USING (false)
WITH CHECK (false);

-- 5. Extend subscriptions RLS — retailer sees linked customer subscriptions
CREATE POLICY "retailer_sees_linked_subscriptions"
ON subscriptions FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM retailer_customers rc
    WHERE rc.customer_id = subscriptions.user_id
    AND rc.retailer_id = auth.uid()
  )
);
