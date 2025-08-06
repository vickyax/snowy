import supabase from '@/utils/server';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { isLogin, email, password, name, userRole, phone } = req.body;

        if (isLogin) {
            // Logic for login remains the same
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) return res.status(400).json({ error: error.message });
            return res.status(200).json({ user: data.user });

        } else {
            // --- 🚨 START: SERVER-SIDE VALIDATION 🚨 ---
            const allowedRoles = ['customer', 'technician'];

            if (!email || !password || password.length < 6) {
                return res.status(400).json({ error: 'Email and a password of at least 6 characters are required.' });
            }
            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(400).json({ error: 'A valid user role is required.' });
            }
            // --- ✅ END: SERVER-SIDE VALIDATION ✅ ---

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role: userRole, // Pass validated role to the trigger
                        phone // Pass phone to the trigger
                    },
                },
            });

            if (signUpError) return res.status(400).json({ error: signUpError.message });
            if (!signUpData || !signUpData.user) {
                return res.status(500).json({ error: "User not created during sign up." });
            }
            
            // The database trigger will handle inserting into the 'users' table.
            return res.status(200).json({ user: signUpData.user, message: "Account created! Please check your email to verify." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}