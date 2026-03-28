import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-blue-100">Last updated: March 26, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 prose prose-lg text-[#1f2937]">
        <p className="text-lg leading-relaxed">
          Welcome to <strong>FaithPath Studies</strong>. By accessing or using
          our website, you agree to be bound by these Terms and Conditions.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms and Conditions govern your use of FaithPathStudies.com and
          all its content, features, and services. If you do not agree with
          these terms, please do not use our website.
        </p>

        <h2>2. Purpose of the Website</h2>
        <p>
          FaithPath Studies is a free Christian resource platform dedicated to
          helping believers grow in their faith through Bible studies, daily
          devotionals, and community encouragement. All content is provided for
          spiritual growth and educational purposes.
        </p>

        <h2>3. User Conduct</h2>
        <p>
          You agree to use the website only for lawful purposes and in a
          respectful manner. You will not:
        </p>
        <ul>
          <li>
            Post or share any content that is offensive, harmful, or
            disrespectful to others
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the website
          </li>
          <li>Use the site to harass, abuse, or harm others</li>
          <li>
            Copy, reproduce, or distribute our content for commercial purposes
            without permission
          </li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          All Bible studies, devotionals, images, and other content on FaithPath
          Studies are protected by copyright. You may use the materials for
          personal, non-commercial Bible study and small group use. Please
          credit FaithPath Studies when sharing.
        </p>

        <h2>5. User Accounts</h2>
        <p>
          When you create an account, you are responsible for maintaining the
          confidentiality of your login information. You agree to notify us
          immediately of any unauthorized use of your account.
        </p>

        <h2>6. Content Accuracy</h2>
        <p>
          While we strive to provide accurate and biblically sound content, we
          are not a substitute for pastoral counseling or professional
          theological advice. All studies are written by humans and should be
          read with discernment and compared with Scripture.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          FaithPath Studies is provided "as is" without any warranties. We are
          not liable for any damages arising from your use of the website or its
          content.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We may update these Terms and Conditions from time to time. We will
          notify you of significant changes by posting the new terms on this
          page.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, please
          contact us at:
        </p>
        <p className="font-medium">Email: support@faithpathstudies.com</p>

        <div className="mt-16 pt-10 border-t border-zinc-200 text-center">
          <p className="text-sm text-zinc-500">
            Thank you for using FaithPath Studies. May the Lord bless you as you
            grow in your walk with Christ.
          </p>
          <div className="mt-8">
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
