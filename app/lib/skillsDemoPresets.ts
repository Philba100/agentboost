export type DemoPreset = {
  input: Record<string, any>;
  output: Record<string, any>;
};

export const demoPresets: Record<string, DemoPreset> = {
  // Category 1: Trade Finance & Logistics
  "Logistics & Trade": {
    input: {
      lc_number: "LC-2026-DXB-9841",
      lc_amount: 300000,
      invoice_total: 298500,
      tolerance_percent: 5,
      shipment_date: "2026-05-10",
      lc_expiry_date: "2026-05-25",
      bl_date: "2026-05-08",
      hs_code: "8471.30"
    },
    output: {
      lc_reference: "LC-2026-DXB-9841",
      compliance_verdict: "CLEAN_PRESENTATION",
      bank_release_clearance: "AUTHORIZED",
      discrepancies_detected: 0,
      tolerance_applied: "+/- 5%",
      demurrage_risk_rating: "ZERO",
      documentation_checklist: {
        commercial_invoice: "Verified",
        marine_insurance: "Verified 110% CIF",
        bill_of_lading: "Compliant",
        certificate_of_origin: "Chamber Validated"
      }
    }
  },

  // Category 2: Accounts Payable & 3-Way Match
  "Finance & Accounting": {
    input: {
      po_number: "PO-88412",
      vendor_name: "Global Industrial Logistics FZE",
      po_amount: 45000,
      grn_quantity: 100,
      invoice_quantity: 100,
      invoice_amount: 45000,
      tax_rate_percent: 5
    },
    output: {
      po_reference: "PO-88412",
      vendor_account: "Global Industrial Logistics FZE",
      audit_verdict: "MATCH_VERIFIED",
      disbursement_status: "SCHEDULED_FOR_PAYMENT",
      reconciliation_details: {
        po_authorized_usd: 45000,
        billed_invoice_usd: 45000,
        calculated_tax_usd: 2250,
        total_payable_usd: 47250,
        unit_variance: 0
      },
      overbill_protection_saved: 0,
      credit_note_demand: null
    }
  },

  // Category 3: Corporate Governance & Legal Compliance
  "Legal & Compliance": {
    input: {
      entity_name: "Apex Holdings International LLC",
      jurisdiction: "ADGM / DIFC / Commercial Registry",
      resolution_type: "Bank Signatory Authorization",
      authorized_director: "Tariq Mansoor Al-Hashemi",
      capital_limit_usd: 500000
    },
    output: {
      entity_name: "Apex Holdings International LLC",
      instrument_type: "OFFICIAL_BOARD_RESOLUTION",
      resolution_id: "BR-882194",
      effective_date: "2026-05-15",
      statutory_clauses: [
        "RESOLVED, that Tariq Mansoor Al-Hashemi is granted authority up to $500,000 USD.",
        "FURTHER RESOLVED, that the UBO register is updated and certified.",
        "FURTHER RESOLVED, that officers submit this instrument to the registrar."
      ],
      filing_dossier: {
        board_minutes_compiled: true,
        ubo_declaration_attached: true,
        trade_license_renewal_clearance: "APPROVED"
      }
    }
  },

  // Category 4: Commercial Real Estate Lease Operations
  "Real Estate & Assets": {
    input: {
      property_name: "Al-Reem Financial Tower, Commercial Floor 14",
      landlord_entity: "Emaar Commercial Asset Management",
      tenant_entity: "FinTech Innovations DMCC",
      current_annual_rent: 240000,
      proposed_annual_rent: 250000,
      market_benchmark_rent: 245000
    },
    output: {
      property: "Al-Reem Financial Tower, Commercial Floor 14",
      regulatory_audit: {
        base_annual_rent: "$240,000",
        proposed_annual_rent: "$250,000",
        maximum_statutory_cap: "$252,000",
        statutory_compliance: "COMPLIANT_WITH_RENT_INDEX"
      },
      payment_terms: {
        installments: "4 Cheques / Post-Dated Bank Guarantees",
        security_deposit_refundable: "$12,500 (5%)",
        fit_out_period_days: 30
      },
      registration_status: "Ready for Ejari / Municipal Digital Endorsement"
    }
  },

  // Category 5: Workforce, WPS Payroll & Gratuity
  "Operations & HR": {
    input: {
      basic_salary: 12000,
      allowances: 6000,
      years_of_service: 4.5,
      unapproved_deductions: 0
    },
    output: {
      wps_sif_audit: {
        status: "SIF_PREFLIGHT_PASSED",
        declared_salary: "$18,000",
        basic_wage: "$12,000",
        compliance_risk: "ZERO"
      },
      statutory_gratuity_discharge: {
        tenure_years: 4.5,
        calculated_severance: "$37,282",
        accrued_leave_encashment: "$5,523 (14 days)",
        full_and_final_settlement: "$42,805"
      },
      discharge_receipt_status: "Ready for digital sign-off and labor file closure"
    }
  },

  // Existing Default Presets
  Finance: {
    input: {
      asset: "ETH-PERP",
      strategy: "Delta-Neutral Volatility Harvest",
      capital_allocation: 250000
    },
    output: {
      status: "OPTIMIZED",
      sharpe_ratio: 2.84,
      delta_exposure: "+0.012",
      estimated_apy: "24.6%"
    }
  },

  Default: {
    input: {
      entity: "Enterprise Corporation",
      scope: "Autonomous Workflow Execution"
    },
    output: {
      orchestration_status: "SUCCESS",
      confidence_score: 0.98,
      next_actions: ["Synthesize executive brief", "Sync team schedules", "Emit API webhook"]
    }
  }
};