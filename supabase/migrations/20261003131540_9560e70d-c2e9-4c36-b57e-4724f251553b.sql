DROP FUNCTION IF EXISTS public.place_order(jsonb, text, text);

CREATE OR REPLACE FUNCTION public.place_order(p_user_id uuid, p_items jsonb, p_customer_name text, p_customer_email text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_order_id bigint;
  v_total numeric := 0;
  r record;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'NOT_SIGNED_IN'; END IF;
  IF p_customer_email IS NULL OR btrim(p_customer_email) = '' THEN RAISE EXCEPTION 'EMAIL_REQUIRED'; END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'CART_EMPTY';
  END IF;

  CREATE TEMP TABLE _req ON COMMIT DROP AS
    SELECT (e->>'product_id')::bigint AS product_id, sum((e->>'quantity')::int) AS quantity
    FROM jsonb_array_elements(p_items) e GROUP BY 1;

  IF EXISTS (SELECT 1 FROM _req WHERE quantity IS NULL OR quantity <= 0 OR product_id IS NULL) THEN
    RAISE EXCEPTION 'INVALID_QUANTITY';
  END IF;

  PERFORM 1 FROM products p WHERE p.id IN (SELECT product_id FROM _req) ORDER BY p.id FOR UPDATE;

  FOR r IN SELECT q.product_id, q.quantity, p.name, p.price, p.stock_quantity
           FROM _req q LEFT JOIN products p ON p.id = q.product_id LOOP
    IF r.name IS NULL THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', r.product_id; END IF;
    IF r.quantity > r.stock_quantity THEN
      RAISE EXCEPTION 'INSUFFICIENT_STOCK:%:%', r.name, r.stock_quantity;
    END IF;
    v_total := v_total + r.price * r.quantity;
  END LOOP;

  INSERT INTO orders (user_id, customer_name, customer_email, status, total_amount)
  VALUES (p_user_id, NULLIF(btrim(p_customer_name), ''), btrim(p_customer_email), 'pending', v_total)
  RETURNING id INTO v_order_id;

  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
  SELECT v_order_id, q.product_id, q.quantity, p.price FROM _req q JOIN products p ON p.id = q.product_id;

  UPDATE products p SET stock_quantity = p.stock_quantity - q.quantity, updated_at = now()
  FROM _req q WHERE p.id = q.product_id;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(uuid, jsonb, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_order(uuid, jsonb, text, text) TO service_role;