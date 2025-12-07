import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            Fextrio ("we", "our", or "us") is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, and safeguard your information when you use our
            vehicle trips management application.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect the following information that you provide directly to us:</p>
          <ul>
            <li>Vehicle information (name/number, owner name)</li>
            <li>Trip data (date, cash amounts, earnings)</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain the service</li>
            <li>Generate statements and reports</li>
            <li>Improve and optimize the application</li>
            <li>Respond to your requests and support needs</li>
          </ul>

          <h2>Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We implement appropriate
            technical and organizational measures to protect your information against unauthorized
            access, alteration, disclosure, or destruction.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide
            you services. You may request deletion of your data at any time.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through the
            application or at your designated support channel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
