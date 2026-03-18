import { Shield, AlertTriangle, FileText } from "lucide-react";

const SupportPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-8">
          <h2 className="font-display text-3xl font-bold">Support & Legal</h2>
        </div>
      </div>

      <div className="container py-12 max-w-3xl space-y-8">
        {/* Disclaimer */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-bold text-lg mb-2">Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The owner and operator of OldGold is <strong>not responsible</strong> for any mismanagement, damaged products, defective items, or disputes arising from price negotiations between buyers and sellers. All transactions are conducted at the buyer's and seller's own risk.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-bold text-lg mb-2">Terms of Use</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>All products listed must be accurately described by the seller.</li>
                <li>Prices are listed in Indian Rupees (INR).</li>
                <li>OldGold reserves the right to remove any listing that violates our policies.</li>
                <li>Sellers must provide valid contact information and product details.</li>
                <li>Electronics must include power rating and brand name.</li>
                <li>Clothes must include size and brand details.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-bold text-lg mb-2">Copyright Notice</h3>
              <p className="text-sm text-muted-foreground">
                © 2026 <a href="https://Anish-kushwaha.online" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anish Kushwaha</a>. All rights reserved. The OldGold brand, logo, and all content on this website are the intellectual property of Anish Kushwaha. Unauthorized reproduction or distribution is prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-display font-bold text-lg mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            If you have any issues or questions, reach out through our Contact page or email us directly.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-semibold px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
            Go to Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
