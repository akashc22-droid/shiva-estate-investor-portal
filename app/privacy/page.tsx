import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Privacy Policy — Shiva Estate Investor Portal',
    description: 'How the Shiva Estate Investor Portal collects, uses, and protects your data.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-surface-dark px-5 py-12">
            <div className="max-w-2xl mx-auto">
                <Link href="/login" className="inline-flex items-center gap-1 text-text-muted text-xs mb-8 hover:text-text-secondary transition-colors">
                    <ArrowLeft size={14} /> Back
                </Link>

                <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
                <p className="text-text-muted text-sm mb-10">Shiva Estate Investor Portal · Effective 11 June 2026</p>

                <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Who we are</h2>
                        <p>
                            The Shiva Estate Investor Portal (&ldquo;the App&rdquo;) is operated by Shiva Buildcon /
                            Shiva Investments (&ldquo;we&rdquo;, &ldquo;us&rdquo;), and is provided on the Artha
                            investor-relations platform. This policy explains what personal data the App
                            collects, why, and how we protect it.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Data we collect</h2>
                        <ul className="list-disc list-inside space-y-1.5">
                            <li><span className="text-text-primary">Identity &amp; contact:</span> name, email address, mobile number.</li>
                            <li><span className="text-text-primary">KYC references:</span> last 4 digits of Aadhaar and PAN reference (where provided for compliance).</li>
                            <li><span className="text-text-primary">Investment &amp; financial data:</span> your bookings, units, payment history and agreement details.</li>
                            <li><span className="text-text-primary">Documents:</span> files you or your builder upload to your vault.</li>
                            <li><span className="text-text-primary">Usage &amp; device data:</span> basic technical logs needed to operate and secure the service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">How we use your data</h2>
                        <p>
                            To authenticate you, show your investments and construction progress, deliver
                            notifications, generate AI-assisted return analysis, and meet legal and RERA
                            compliance obligations. We do not sell your personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Service providers</h2>
                        <p>We share data only with processors that help run the App:</p>
                        <ul className="list-disc list-inside space-y-1.5 mt-2">
                            <li><span className="text-text-primary">Supabase</span> — authentication and database hosting.</li>
                            <li><span className="text-text-primary">Vercel</span> — application hosting.</li>
                            <li><span className="text-text-primary">Google (Gemini API)</span> — AI return analysis and document classification.</li>
                            <li><span className="text-text-primary">SMS / messaging providers</span> — to deliver one-time login codes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Data security</h2>
                        <p>
                            Data is encrypted in transit (TLS) and at rest. Access is restricted so that
                            each investor can view only their own records. Login uses one-time codes; we do
                            not store passwords for investor accounts.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Data retention &amp; deletion</h2>
                        <p>
                            You can permanently delete your account and associated data at any time from the{' '}
                            <Link href="/delete-account" className="text-brand-accent">Delete Account</Link> page in
                            the App, or by emailing{' '}
                            <a href="mailto:privacy@shivaestate.com" className="text-brand-accent">privacy@shivaestate.com</a>.
                            We action deletion requests within 30 days. Records we are legally required to
                            retain (e.g. for RERA or tax purposes) may be kept for the statutory period.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Your rights</h2>
                        <p>
                            You may request access to, correction of, or deletion of your personal data.
                            Contact us at{' '}
                            <a href="mailto:privacy@shivaestate.com" className="text-brand-accent">privacy@shivaestate.com</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">Contact</h2>
                        <p>
                            Shiva Buildcon / Shiva Investments, Bhopal, Madhya Pradesh, India.{' '}
                            <a href="mailto:privacy@shivaestate.com" className="text-brand-accent">privacy@shivaestate.com</a>
                        </p>
                    </section>
                </div>

                <p className="text-text-muted text-[11px] mt-12 border-t border-surface-border pt-6">
                    This policy is a template provided with the App and should be reviewed by your legal
                    counsel before public release.
                </p>
            </div>
        </div>
    )
}
