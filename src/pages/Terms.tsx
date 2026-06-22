import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto bg-card rounded-2xl border border-border shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium mb-6 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">RASGoal Merchant Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">
            by Kora Technical Solutions ·{" "}
            <a href="https://www.rasgoal.com" className="underline hover:text-foreground">www.rasgoal.com</a>{" "}
            · <a href="mailto:info@rasgoal.com" className="underline hover:text-foreground">info@rasgoal.com</a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Business Registration No: 320261068317 (PACRA) · TPIN: 2004403621
          </p>
        </header>

        <article className="prose prose-sm max-w-none text-foreground space-y-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:leading-relaxed [&_p]:text-foreground/90 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-foreground/90">
          <section>
            <h2>1. Products and Services</h2>

            <h3>1.1 About RASGoal</h3>
            <p>
              RASGoal is a digital examination practice platform for Zambian students online
              tutoring and preparing for exam assessments at levels such as but not limited to
              Grade 7, and Grade 12. The platform is owned and operated by Kora Technical
              Solutions, registered under PACRA in Zambia.
            </p>

            <h3>1.2 Service Description</h3>
            <p>RASGoal provides the following digital services:</p>
            <ul>
              <li>Online tutoring platform</li>
              <li>Exam practice questions across all examinable subjects for Grades 7 and 12</li>
              <li>Timed mock examination sessions with automatic scoring and performance feedback</li>
              <li>Subject-by-subject performance tracking and precision scoring dashboards</li>
              <li>Parent and guardian read-only access to student progress reports</li>
              <li>A gamified achievement system including Vanguard student status tiers</li>
              <li>Teacher tools including per-student analytics and class-level performance radar charts</li>
            </ul>

            <h3>1.3 Free Access Tier</h3>
            <p>
              RASGoal offers a permanent free tier providing limited access to the platform. Free
              tier users may access a restricted set of practice questions across selected
              subjects. Full access to all subjects, question banks, mock exams, performance
              tracking, and dashboards requires a paid subscription.
            </p>

            <h3>1.4 Subscription Plans</h3>
            <p>Paid subscriptions unlock full platform access. Pricing is per student in Zambian Kwacha (ZMW):</p>
            <ul>
              <li>Monthly Plan: K50 per student per month</li>
              <li>Annual Plan: K400 per student per year</li>
            </ul>
            <p>
              The annual plan represents a saving compared to 12 monthly payments. There is no
              free trial period. Users may evaluate the platform via the free tier before
              subscribing.
            </p>

            <h3>1.5 Payment Methods</h3>
            <p>RASGoal accepts all of the following payment methods:</p>
            <ul>
              <li>Airtel Money</li>
              <li>MTN Mobile Money</li>
              <li>Visa and Mastercard (debit and credit)</li>
            </ul>
            <p>All transactions are processed in Zambian Kwacha (ZMW).</p>

            <h3>1.6 Service Delivery</h3>
            <p>
              RASGoal is delivered entirely digitally via the web platform at www.rasgoal.com. No
              physical goods are shipped. Full platform access is granted immediately upon
              successful payment confirmation. Users must have a device with internet
              connectivity to access the platform.
            </p>
          </section>

          <section>
            <h2>2. Refund Policy</h2>

            <h3>2.1 General Position</h3>
            <p>
              All subscription payments made to RASGoal are non-refundable. By completing a
              subscription payment, the customer acknowledges and agrees to this policy.
            </p>

            <h3>2.2 Non-Refundable Circumstances</h3>
            <p>Refunds will not be issued under any of the following circumstances:</p>
            <ul>
              <li>Change of mind after payment</li>
              <li>Non-use of the platform during the subscription period</li>
              <li>Failure to cancel before an automatic renewal date</li>
              <li>Dissatisfaction with content or features</li>
              <li>Technical issues on the customer's device, browser, or internet connection</li>
              <li>The subscription period has already commenced</li>
            </ul>

            <h3>2.3 Exceptions</h3>
            <p>Refunds will only be considered in the following limited circumstances:</p>
            <ul>
              <li>
                Duplicate payment: the customer was charged more than once for the same
                subscription period due to a payment processing error
              </li>
              <li>
                Verified billing error: the customer was charged an incorrect amount due to a
                confirmed payment system error.
              </li>
            </ul>
            <p>
              In either case, the refund will be limited to the erroneously charged amount only
              and will be returned to the original payment method within 14–30 business days of
              verification.
            </p>

            <h3>2.4 How to Request a Refund</h3>
            <p>
              Customers who believe they qualify under Section 2.3 must submit a request within 7
              days of the charge by emailing{" "}
              <a href="mailto:info@rasgoal.com" className="underline hover:text-foreground">info@rasgoal.com</a>{" "}
              with:
            </p>
            <ul>
              <li>Their registered email address</li>
              <li>The transaction reference number</li>
              <li>A description of the error</li>
            </ul>
          </section>

          <section>
            <h2>3. Cancellation Policy</h2>

            <h3>3.1 How to Cancel</h3>
            <p>
              Customers may cancel their subscription at any time directly from within the
              RASGoal platform by navigating to Account Settings &gt; Subscription &gt; Cancel
              Subscription. Cancellation takes effect at the end of the current billing period.
              No further charges will be made after cancellation is confirmed.
            </p>

            <h3>3.2 No Grace Period</h3>
            <p>
              There is no grace period upon subscription expiry. Once a paid subscription period
              ends and has not been renewed, access to premium features is immediately
              restricted. The customer's account reverts to the free tier.
            </p>

            <h3>3.3 Automatic Renewal</h3>
            <p>
              Card-based subscriptions (Visa, Mastercard) renew automatically at the end of each
              billing period unless cancelled before the renewal date. Customers will receive a
              notification before their renewal date. It is the customer's responsibility to
              cancel in advance if they do not wish to renew.
            </p>
            <p>
              Mobile money payments (Airtel Money, MTN Mobile Money) do not auto-renew. Customers
              on mobile money must manually renew their subscription to maintain access.
            </p>

            <h3>3.4 Effect of Cancellation</h3>
            <p>
              Cancellation does not entitle the customer to a refund for any unused portion of
              the current subscription period. The customer retains access until the end of the
              period for which they have paid, after which the account reverts to the free tier.
            </p>

            <h3>3.5 Account Suspension</h3>
            <p>
              RASGoal reserves the right to suspend or terminate accounts that violate the
              platform's Terms of Use, including sharing login credentials, fraudulent activity,
              or abuse of the platform. Suspended accounts are not eligible for refunds.
            </p>
          </section>

          <section>
            <h2>4. Contact and Dispute Resolution</h2>
            <p>For payment, refund, or cancellation queries, contact Kora Technical Solutions at:</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@rasgoal.com" className="underline hover:text-foreground">info@rasgoal.com</a>
              <br />
              <strong>Website:</strong>{" "}
              <a href="https://www.rasgoal.com" className="underline hover:text-foreground">www.rasgoal.com</a>
              <br />
              <strong>Business Address:</strong> Kora Technical Solutions, 7784 Woodlands
              Extension, Lusaka, Zambia
            </p>
            <p>
              We aim to respond to all queries within 2 business days. Unresolved disputes may be
              escalated to DPO Group via their official dispute resolution process.
            </p>
          </section>

          <p className="text-xs text-muted-foreground border-t border-border pt-4 mt-8">
            Last updated: May 2026 · Kora Technical Solutions · PACRA BN: 320261068317
          </p>
        </article>
      </div>
    </div>
  );
};

export default Terms;
