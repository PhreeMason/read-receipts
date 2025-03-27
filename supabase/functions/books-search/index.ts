import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { generateUrl } from './utils.ts';

Deno.serve(async (req: Request) => {

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  // Get the session or user object
  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const { data: userData } = await supabaseClient.auth.getUser(token);
  const { data, error } = await supabaseClient.from('profiles').select('*');

  if (error) {
    return new Response(JSON.stringify({ error }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  const user = userData.user
  const user_id = user?.id
  const { query } = await req.json();
  const profile = data[0];

  const scrapeUrl = generateUrl(query);
  try {
    const response = await fetch(scrapeUrl);
    
    
  } catch (error) {
    
  }

  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })

})