import supabase from '@/utils/server';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { isLogin, email, password, name, userRole, phone } = req.body;

        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) return res.status(400).json({ error: error.message });
            return res.status(200).json({ user: data.user });
        } else {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role: userRole,
                    },
                },
            });

            if (signUpError) return res.status(400).json({ error: signUpError.message });
            if (!signUpData || !signUpData.user) {
                return res.status(500).json({ error: "User not created during sign up." });
            }

            // Insert into users table immediately
            await supabase.from('users').insert([
                {
                    id: signUpData.user.id,
                    name,
                    email,
                    phone,
                    role: userRole,
                }
            ]);

            return res.status(200).json({ user: signUpData.user, message: "Account created!" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}