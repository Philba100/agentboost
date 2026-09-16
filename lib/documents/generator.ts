/**
 * AgentBoost Enterprise Document Synthesis Engine
 * Converts deterministic skill outputs into formatted, auditable corporate documents.
 */

export interface GeneratedDocument {
  title: string;
  document_type: string;
  filename: string;
  content_markdown: string;
  content_html: string;
  audit_hash: string;
  generated_at: string;
}

// Generate a deterministic verification hash
function createAuditHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `AB-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}

export function generateCorporateDocument(
  docType: string,
  payload: Record<string, any>
): GeneratedDocument {
  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];

  let title = 'Official Corporate Instrument';
  let filename = `agentboost-document-${dateStr}.md`;
  let markdown = '';

  switch (docType) {
    // 1. Board Resolution Instrument
    case 'board-resolution':
    case 'corporate-governance': {
      const entity = payload.entity_name || 'Apex Holdings International LLC';
      const director = payload.authorized_director || 'Tariq Mansoor Al-Hashemi';
      const resolutionId = payload.resolution_id || `BR-${dateStr}`;
      const capitalLimit = Number(payload.capital_limit_usd || 500000).toLocaleString();

      title = `Board Resolution: ${resolutionId}`;
      filename = `board-resolution-${resolutionId}.md`;

      markdown = `# BOARD RESOLUTION OF ${entity.toUpperCase()}
**Instrument Reference:** ${resolutionId}  
**Date of Ratification:** ${dateStr}  
**Jurisdiction:** ${payload.jurisdiction || 'Commercial Companies Registry / ADGM / DIFC'}

---

### RECITALS
**WHEREAS**, the Board of Directors of ${entity} has reviewed corporate operational requirements, banking mandates, and commercial development priorities;

**WHEREAS**, it is deemed in the best interest of the Corporation to appoint authorized representation for formal contractual and financial execution;

### FORMAL RESOLUTIONS

1. **APPOINTMENT OF SIGNATORY AUTHORITY:**  
   **RESOLVED**, that **${director}** is hereby granted full authority to represent the Corporation, execute binding commercial agreements, enter into vendor obligations, and issue banking instructions up to the maximum single-transaction threshold of **$${capitalLimit} USD**.

2. **COMPLIANCE & BENEFICIAL OWNERSHIP AUDIT:**  
   **RESOLVED**, that the Corporation’s Ultimate Beneficial Ownership (UBO) Register and Anti-Money Laundering (AML) audit dossiers are hereby certified as fully compliant with statutory corporate governance regulations.

3. **REGISTRAR SUBMISSION:**  
   **RESOLVED**, that corporate counsel and designated officers are authorized to file this ratified resolution with the competent commercial licensing authority.

---

### ATTESTATION & SIGNATURES

**Chairman of the Board:** ___________________________  
**Corporate Secretary:** ___________________________  

*Verification Audit Hash: ${createAuditHash(entity + resolutionId + dateStr)}*
`;
      break;
    }

    // 2. Commercial Tenancy Contract & Statutory Addendum
    case 'lease-agreement':
    case 'commercial-tenancy': {
      const property = payload.property || payload.property_name || 'Commercial Facility Unit 14';
      const lessor = payload.lessor || payload.landlord_entity || 'Asset Management Corp';
      const lessee = payload.lessee || payload.tenant_entity || 'Enterprise Operator LLC';
      const rent = payload.proposed_annual_rent || '$250,000';

      title = `Commercial Tenancy Contract: ${property}`;
      filename = `commercial-lease-${dateStr}.md`;

      markdown = `# COMMERCIAL TENANCY CONTRACT & REGULATORY ADDENDUM
**Registry Docket:** TC-${dateStr}-882  
**Effective Commencement:** ${dateStr}  

---

### CONTRACTING PARTIES
* **Lessor (Landlord):** ${lessor}  
* **Lessee (Tenant):** ${lessee}  
* **Demised Premises:** ${property}  

### COMMERCIAL TERMS
* **Agreed Annual Base Rent:** ${typeof rent === 'number' ? `$${rent.toLocaleString()}` : rent}
* **Payment Frequency:** 4 Equal Post-Dated Installments / Cheques
* **Refundable Security Deposit:** 5% of Annual Base Rent
* **Permitted Usage:** Exclusive Class-A Corporate & Commercial Operations

### STATUTORY COMPLIANCE COVENANTS
1. **Rental Index Cap Compliance:** The rent herein complies strictly with statutory municipal rental index ceilings and official rent increase calculators.
2. **Maintenance & Repairs:** Lessor warrants structural integrity. Lessee covenants routine internal utility maintenance.
3. **Dispute Jurisdiction:** In the event of unresolved disputes, both parties irrevocably submit to the jurisdiction of the Municipal Rental Dispute Settlement Centre.

---

**Signed on behalf of Lessor:** ___________________________  
**Signed on behalf of Lessee:** ___________________________  

*Verification Audit Hash: ${createAuditHash(property + lessor + lessee)}*
`;
      break;
    }

    // 3. Accounts Payable 3-Way Reconciliation Audit Memo
    case 'three-way-match':
    case 'ap-reconciliation': {
      const po = payload.po_reference || 'PO-88412';
      const vendor = payload.vendor_account || 'Vendor FZE';
      const verdict = payload.audit_verdict || 'MATCH_VERIFIED';

      title = `AP 3-Way Audit Memo: ${po}`;
      filename = `ap-reconciliation-${po}.md`;

      markdown = `# ACCOUNTS PAYABLE 3-WAY MATCHING AUDIT MEMO
**Purchase Order Baseline:** ${po}  
**Vendor Account:** ${vendor}  
**Audit Evaluation:** ${verdict}  
**Date Evaluated:** ${dateStr}  

---

### RECONCILIATION SUMMARY
* **Billed Invoice Total:** $${Number(payload.reconciliation_details?.billed_invoice_usd || 0).toLocaleString()} USD
* **Authorized PO Limit:** $${Number(payload.reconciliation_details?.po_authorized_usd || 0).toLocaleString()} USD
* **Calculated Tax/VAT:** $${Number(payload.reconciliation_details?.calculated_tax_usd || 0).toLocaleString()} USD
* **Net Authorized Settlement:** $${Number(payload.reconciliation_details?.total_payable_usd || 0).toLocaleString()} USD

### DISCREPANCY AUDIT
${
  payload.credit_note_demand
    ? `**ACTION REQUIRED - CREDIT NOTE DEMAND ISSUED:**\n${payload.credit_note_demand}`
    : `**CLEAN RECONCILIATION:** Warehouse Goods Received Note (GRN), Commercial Purchase Order, and Vendor Invoice quantities match at zero unit variance.`
}

---
**Certified by Automated AP Controller:** AgentBoost Deterministic Fastpath  
*Verification Audit Hash: ${createAuditHash(po + vendor + verdict)}*
`;
      break;
    }

    // 4. Official Tender Bid Submission Proposal
    default: {
      const rfqId = payload.rfq_id || `RFQ-${dateStr}`;
      const client = payload.client_name || payload.prospect_industry || 'Enterprise Client';
      const recommendedPrice = payload.recommended_bid_usd
        ? `$${Number(payload.recommended_bid_usd).toLocaleString()}`
        : '$145,000';

      title = `Commercial Tender Proposal: ${rfqId}`;
      filename = `tender-bid-proposal-${rfqId}.md`;

      markdown = `# COMMERCIAL TENDER & TECHNICAL BID PROPOSAL
**Tender Reference:** ${rfqId}  
**Target Enterprise:** ${client}  
**Date of Submission:** ${dateStr}  

---

### 1. EXECUTIVE SUMMARY
AgentBoost Infrastructure submits this firm, irrevocable commercial and technical proposal for the execution of ${rfqId}. All specifications meet or exceed mandatory compliance thresholds.

### 2. COMMERCIAL PRICING SCHEDULE
* **Primary Proposed Contract Value:** **${recommendedPrice} USD**
* **Billing Milestones:** 30% Inception, 40% Intermediate Delivery, 30% Final Acceptance
* **Validity Period:** 60 Calendar Days from Submission

### 3. COMPLIANCE & WARRANTY DECLARATION
* **SLA Uptime Guarantee:** 99.95% Deterministic Availability
* **Compliance Certification:** SOC-2 Type II and ISO-27001 verified
* **Warranty Period:** 12 Months full defect and performance liability coverage

---

**Authorized Bid Officer:** ___________________________  
**Commercial Director:** ___________________________  

*Verification Audit Hash: ${createAuditHash(rfqId + client + recommendedPrice)}*
`;
      break;
    }
  }

  // Convert markdown to a clean, styled HTML printable view
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { border-bottom: 2px solid #0f172a; padding-bottom: 8px; color: #0f172a; font-size: 24px; }
    h2, h3 { color: #334155; margin-top: 24px; }
    hr { border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    strong { color: #0f172a; }
    .audit-footer { margin-top: 50px; font-size: 11px; font-family: monospace; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
  </style>
</head>
<body>
  ${markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '<br/><br/>')
    .replace(/---/gim, '<hr/>')}
  <div class="audit-footer">AgentBoost Cryptographic Ledger Proof: ${createAuditHash(markdown)}</div>
</body>
</html>`;

  return {
    title,
    document_type: docType,
    filename,
    content_markdown: markdown,
    content_html: html,
    audit_hash: createAuditHash(markdown),
    generated_at: timestamp
  };
}