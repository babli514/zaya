namespace FinancialOCR.Api.Services;

public static class BilingualFinancialLabelPatterns
{
    public static readonly string[] SubtotalLabels = ["subtotal", "sub-total", "sous-total", "sous total"];
    public static readonly string[] TotalLabels = ["total", "amount", "montant", "balance due", "solde du", "solde dû", "amount due", "montant du", "montant dû"];
    public static readonly string[] GstLabels = ["gst", "g.s.t.", "tps", "t.p.s."];
    public static readonly string[] QstLabels = ["qst", "q.s.t.", "tvq", "t.v.q."];
    public static readonly string[] HstLabels = ["hst", "tvh"];
    public static readonly string[] PstLabels = ["pst", "tvp"];
    public static readonly string[] TipLabels = ["tip", "gratuity", "pourboire"];

    public static readonly string[] InvoiceNumberEnglishLabels = ["invoice no", "invoice number", "invoice", "receipt", "ticket", "transaction"];
    public static readonly string[] InvoiceNumberFrenchLabels = ["facture", "no de facture", "n° de facture", "numero de facture", "numéro de facture", "recu", "reçu", "ticket", "transaction"];
    public static readonly string[] DateEnglishLabels = ["date", "due date"];
    public static readonly string[] DateFrenchLabels = ["date", "date d'echeance", "date d’échéance", "date echeance", "echeance", "échéance"];
    public static readonly string[] VendorEnglishLabels = ["vendor", "supplier", "merchant"];
    public static readonly string[] VendorFrenchLabels = ["fournisseur", "marchand"];
    public static readonly string[] CustomerEnglishLabels = ["customer"];
    public static readonly string[] CustomerFrenchLabels = ["client"];

    public static readonly string[] InvoiceNumberLabels = InvoiceNumberEnglishLabels.Concat(InvoiceNumberFrenchLabels).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
    public static readonly string[] DateLabels = ["date"];
    public static readonly string[] DueDateLabels = ["due date", "date d'echeance", "date d’échéance", "date echeance", "echeance", "échéance"];
    public static readonly string[] VendorLabels = VendorEnglishLabels.Concat(VendorFrenchLabels).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
    public static readonly string[] CustomerLabels = CustomerEnglishLabels.Concat(CustomerFrenchLabels).Distinct(StringComparer.OrdinalIgnoreCase).ToArray();

    public static bool ContainsAnyLabel(string normalizedLine, IReadOnlyCollection<string> labels)
    {
        return labels.Any(label => normalizedLine.Contains(TextNormalizationHelper.NormalizeForMatching(label), StringComparison.Ordinal));
    }
}
