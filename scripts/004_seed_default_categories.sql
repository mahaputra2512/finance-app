-- Function to create default categories for a user
CREATE OR REPLACE FUNCTION create_default_categories(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default income categories
  INSERT INTO public.categories (name, type, color, icon, user_id) VALUES
    ('Gaji', 'income', '#10b981', 'briefcase', user_id),
    ('Freelance', 'income', '#059669', 'laptop', user_id),
    ('Investasi', 'income', '#0d9488', 'trending-up', user_id),
    ('Bonus', 'income', '#0891b2', 'gift', user_id),
    ('Lainnya', 'income', '#6366f1', 'plus-circle', user_id);

  -- Insert default expense categories  
  INSERT INTO public.categories (name, type, color, icon, user_id) VALUES
    ('Makanan', 'expense', '#ef4444', 'utensils', user_id),
    ('Transportasi', 'expense', '#f97316', 'car', user_id),
    ('Belanja', 'expense', '#eab308', 'shopping-bag', user_id),
    ('Tagihan', 'expense', '#8b5cf6', 'receipt', user_id),
    ('Kesehatan', 'expense', '#ec4899', 'heart', user_id),
    ('Hiburan', 'expense', '#06b6d4', 'gamepad-2', user_id),
    ('Pendidikan', 'expense', '#84cc16', 'book', user_id),
    ('Lainnya', 'expense', '#6b7280', 'more-horizontal', user_id);
END;
$$;
