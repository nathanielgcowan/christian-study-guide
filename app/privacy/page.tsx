import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100">Last updated: March 26, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 prose prose-lg text-[#1f2937] leading-relaxed">
        <p className="text-lg">
          At <strong>FaithPath Studies</strong>, we respect your privacy and are
          committed to protecting your personal information.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> When you create an account, we
            collect your email address and password.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect information about how
            you use the site (e.g., which studies you view or save).
          </li>
          <li>
            <strong>Prayer Requests:</strong> If you choose to share prayer
            requests in the community section.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and improve our Bible study resources</li>
          <li>
            Allow you to save studies, take notes, and track your spiritual
            growth
          </li>
          <li>Send important updates about the website (very rarely)</li>
          <li>Protect the security of our platform</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do <strong>not</strong> sell your personal information. We may
          share your information only in these limited cases:
        </p>
        <ul>
          <li>
            With trusted service providers who help us operate the website
            (e.g., hosting, email services)
          </li>
          <li>When required by law</li>
          <li>
            To protect the rights, property, or safety of FaithPath Studies and
            our users
          </li>
        </ul>

        <h2>4. Data Storage and Security</h2>
        <p>
          Your data is stored securely using industry-standard encryption. We
          use Supabase (or your chosen backend) to handle user accounts and
          data.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your account information</li>
          <li>Request a copy of the personal data we hold about you</li>
          <li>Opt out of any non-essential communications</li>
        </ul>
        <p>
          To exercise these rights, please contact us at
          support@faithpathstudies.com.
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use essential cookies to keep you logged in and provide a smooth
          experience. We do not use tracking cookies for advertising purposes.
        </p>

        <h2>7. Children’s Privacy</h2>
        <p>
          Our website is not directed to children under the age of 13. We do not
          knowingly collect personal information from children.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes by posting the new policy on this page.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please feel free
          to contact us:
        </p>
        <p className="font-medium mt-4">Email: support@faithpathstudies.com</p>

        <div className="mt-16 pt-12 border-t border-zinc-200 text-center">
          <p className="italic text-zinc-600">
            “Trust in the Lord with all your heart and lean not on your own
            understanding.”
            <br />— Proverbs 3:5
          </p>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-block bg-[#d4af37] hover:bg-[#c9a66b] text-[#0f172a] font-semibold px-10 py-4 rounded-2xl transition"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
