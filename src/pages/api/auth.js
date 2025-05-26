import supabase from '@/utils/supabaseServer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { isLogin, email, password, name, userRole } = req.body;

    if (isLogin) {
      // Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ user: data.user });
    } else {
      // Sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: userRole },
        },
      });
      if (error) return res.status(400).json({ error: error.message });

      // Store extra info in "profiles" table
      await supabase.from('profiles').insert([
        { id: data.user.id, name, role: userRole, email }
      ]);
      return res.status(200).json({ user: data.user });
    }
  } else {
    res.status(405).end();
  }
}