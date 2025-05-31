// /pages/api/auth.js

import supabase from '@/utils/supabaseServer';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { isLogin, email, password, name, userRole, ...rest } = req.body; // 'rest' contains other form data

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
			const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						name: name, // Store essential name
						role: userRole, // Store essential role
						// Avoid putting all of 'rest' here; localStorage is used for that by login.jsx
					},
				},
			});

			if (signUpError) return res.status(400).json({ error: signUpError.message });
			if (!signUpData || !signUpData.user) {
				return res.status(500).json({ error: "User not created during sign up." });
			}

			// REMOVED: Immediate insertion into 'users' or 'technicians' table.
			// This will now be handled by callback.jsx after email verification.

			return res.status(200).json({ user: signUpData.user, message: "Check your email for a verification link." });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}