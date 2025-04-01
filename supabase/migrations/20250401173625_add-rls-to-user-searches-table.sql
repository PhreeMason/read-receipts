CREATE POLICY "Users can view their own searches" 
ON public.user_searches 
FOR SELECT 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own searches" 
ON public.user_searches 
FOR INSERT 
TO authenticated 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own searches" 
ON public.user_searches 
FOR UPDATE 
TO authenticated 
USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own searches" 
ON public.user_searches 
FOR DELETE 
TO authenticated 
USING ((SELECT auth.uid()) = user_id);