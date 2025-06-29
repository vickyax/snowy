import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export async function TechnicianProfileAPI(req, res) {
    const SibApiV3Sdk = require('sib-api-v3-sdk');
   

    console.log("🔍 Incoming request:", req.method);

    if (req.method !== "POST") {
        console.warn("⚠️ Invalid method. Only POST is allowed.");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const profileData = req.body;
    console.log("📦 Received profile data:", profileData);

    const {
        id, job_role, expertise, age, experience, service_radius,
        profile_photo, dob, country, state, city, pincode, phone,
        email, name
    } = profileData;

    if (!id || !expertise || !experience || !email || !name) {
        console.error("❌ Missing required fields:", { id, expertise, experience, email, name });
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 1: Insert the data into Supabase
    console.log("📥 Inserting profile into Supabase...");
    // Try to update the technician by id
    const { data: updated, error: updateError } = await supabase
        .from("technicians")
        .update({
            job_role, expertise, age, experience, service_radius,
            profile_photo, dob, country, state, city, pincode, phone,
            email, name
        })
        .eq('id', id)
        .select();

    let dbError = updateError;

    // If no row was updated, insert a new technician
    if (!updateError && (!updated || updated.length === 0)) {
        const { error: insertError } = await supabase
            .from("technicians")
            .insert([{
                id, job_role, expertise, age, experience, service_radius,
                profile_photo, dob, country, state, city, pincode, phone,
                email, name
            }]);
        dbError = insertError;
    }

    if (dbError) {
        console.error("🔥 Supabase DB Error:", dbError.message);
        return res.status(500).json({ error: `Database error: ${dbError.message}` });
    }
    console.log("✅ Profile inserted into Supabase successfully.");

    // Step 2: Email notification
    try {
        console.log("📤 Preparing Brevo email...");
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        const htmlContent = `
            <h1>New Technician Application</h1>
            <p>A new candidate, <strong>${name}</strong>, has submitted their profile for review.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li><strong>Job Role:</strong> ${job_role}</li>
                <li><strong>Expertise:</strong> ${expertise}</li>
                <li><strong>Age:</strong> ${age}</li>
                <li><strong>Experience:</strong> ${experience} years</li>
                <li><strong>Service Radius:</strong> ${service_radius} km</li>
                <li><strong>Date of Birth:</strong> ${dob}</li>
                <li><strong>Country:</strong> ${country}</li>
                <li><strong>State:</strong> ${state}</li>
                <li><strong>City:</strong> ${city}</li>
                <li><strong>Pincode:</strong> ${pincode}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
            <p>Please review the application at your earliest convenience.</p>
            <p>Thank you!</p>
            
            ...
        `;

        sendSmtpEmail.subject = `New Technician Application: ${name}`;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { name: "JC Services", email: "vigneshr75021@gmail.com" };
        sendSmtpEmail.to = [{ email: "vigneshr75021@gmail.com", name: "Hiring Manager" }];

        console.log("🚀 Sending email via Brevo...");
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("📨 Email sent successfully. Brevo response:", JSON.stringify(data));
    } catch (emailError) {
        console.error("📛 Brevo API Error:", emailError.message || emailError);
    }

    // Step 3: Final success response
    console.log("🎉 All operations completed. Responding to client.");
    return res.status(200).json({ success: true, message: "Profile created and notification sent." });
}

export default TechnicianProfileAPI;
