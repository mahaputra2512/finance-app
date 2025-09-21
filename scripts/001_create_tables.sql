-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table for transaction categorization
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT DEFAULT '#d97706',
  icon TEXT DEFAULT 'wallet',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table for income and expense tracking
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table for budget tracking
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly', 'weekly', 'yearly')),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for categories
CREATE POLICY "categories_select_own" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "categories_insert_own" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "categories_update_own" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "categories_delete_own" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions_update_own" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "transactions_delete_own" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "budgets_select_own" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "budgets_insert_own" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "budgets_update_own" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "budgets_delete_own" ON public.budgets FOR DELETE USING (auth.uid() = user_id);
