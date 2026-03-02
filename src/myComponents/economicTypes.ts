type ImpactLevel = "High" | "Medium" | "Low";

export interface TaxAdvice {
  id: number;
  category: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  legal_source: { fr: string; en: string };
  impact_level: ImpactLevel;
}

export interface TaxAdviceDataset {
  version: string;
  total_count: number;
  advice_list: TaxAdvice[];
}

export const TaxAdviceDataset: TaxAdviceDataset = {
  version: "1.0",
  total_count: 150,
  advice_list: [
    {
      id: 1,
      category: "Corporate Tax",
      title: {
        fr: "Option pour l'Intégration Fiscale",
        en: "Election for Tax Consolidation",
      },
      description: {
        fr: "Permet de compenser les bénéfices et les pertes entre les sociétés d'un même groupe (détenues à plus de 95%) pour ne payer l'impôt que sur le résultat net global.",
        en: "Allows offsetting profits and losses between group companies (owned over 95%) to pay tax only on the global net result.",
      },
      legal_source: {
        fr: "Articles 223 A et suivants du Code Général des Impôts",
        en: "Articles 223 A et seq. of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 2,
      category: "Innovation",
      title: {
        fr: "Crédit d'Impôt Recherche (CIR)",
        en: "Research Tax Credit (CIR)",
      },
      description: {
        fr: "Réduction d'impôt de 30 % des dépenses de R&D. Crucial pour les entreprises technologiques.",
        en: "Tax reduction of 30% of R&D expenses. Crucial for technology companies.",
      },
      legal_source: {
        fr: "Article 244 quater B du CGI",
        en: "Article 244 quater B of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 3,
      category: "Innovation",
      title: {
        fr: "Statut de Jeune Entreprise Innovante (JEI)",
        en: "Young Innovative Company Status (JEI)",
      },
      description: {
        fr: "Exonération d'impôt sur les bénéfices (100% la 1ère année, 50% la 2ème) et exonération de cotisations sociales patronales sur les chercheurs.",
        en: "Exemption from corporate tax (100% 1st year, 50% 2nd year) and exemption from employer social security contributions for researchers.",
      },
      legal_source: {
        fr: "Article 44 sexies-0 A du CGI",
        en: "Article 44 sexies-0 A of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 4,
      category: "VAT",
      title: {
        fr: "Franchise en base de TVA",
        en: "VAT Registration Threshold Exemption",
      },
      description: {
        fr: "Permet aux petites entreprises de ne pas facturer ni reverser de TVA si le chiffre d'affaires est inférieur aux seuils légaux.",
        en: "Allows small businesses not to charge or remit VAT if turnover is below legal thresholds.",
      },
      legal_source: {
        fr: "Article 293 B du CGI",
        en: "Article 293 B of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 5,
      category: "Assets",
      title: {
        fr: "Amortissement exceptionnel des logiciels",
        en: "Exceptional depreciation of software",
      },
      description: {
        fr: "Possibilité d'amortir sur 12 mois les logiciels acquis pour les besoins de l'entreprise.",
        en: "Possibility of depreciating software acquired for business needs over 12 months.",
      },
      legal_source: {
        fr: "Article 236 du CGI",
        en: "Article 236 of the General Tax Code",
      },
      impact_level: "Low",
    },
    {
      id: 6,
      category: "Corporate Tax",
      title: {
        fr: "Régime Parent-Filiale",
        en: "Parent-Subsidiary Regime",
      },
      description: {
        fr: "Exonération quasi-totale (95%) des dividendes reçus d'une filiale détenue à au moins 5%.",
        en: "Near-total exemption (95%) of dividends received from a subsidiary owned at least 5%.",
      },
      legal_source: {
        fr: "Articles 145 et 216 du CGI",
        en: "Articles 145 and 216 of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 7,
      category: "Local Tax",
      title: {
        fr: "Exonération de CFE en zone franche",
        en: "CFE Exemption in Tax-Free Zones",
      },
      description: {
        fr: "Exonération de la Cotisation Foncière des Entreprises pour les établissements créés en zone de revitalisation rurale (ZRR).",
        en: "Exemption from the Corporate Property Tax for establishments created in rural revitalization zones (ZRR).",
      },
      legal_source: {
        fr: "Article 1465 A du CGI",
        en: "Article 1465 A of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 8,
      category: "International",
      title: {
        fr: "Crédit d'impôt pour prospection commerciale",
        en: "Tax credit for commercial prospection",
      },
      description: {
        fr: "Aide aux PME qui recrutent pour explorer des marchés hors espace économique européen.",
        en: "Aid for SMEs hiring to explore markets outside the European Economic Area.",
      },
      legal_source: {
        fr: "Article 244 quater H du CGI",
        en: "Article 244 quater H of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 9,
      category: "Payroll",
      title: {
        fr: "Exonération de taxe d'apprentissage",
        en: "Apprenticeship tax exemption",
      },
      description: {
        fr: "Les entreprises employant un ou plusieurs apprentis et dont la masse salariale est inférieure à 6 fois le SMIC annuel sont exonérées.",
        en: "Companies employing one or more apprentices with a payroll less than 6 times the annual minimum wage are exempt.",
      },
      legal_source: {
        fr: "Article 1599 ter A du CGI",
        en: "Article 1599 ter A of the General Tax Code",
      },
      impact_level: "Low",
    },
    {
      id: 10,
      category: "Corporate Tax",
      title: {
        fr: "Déduction des charges financières (Rabot)",
        en: "Deduction of financial charges (Cap)",
      },
      description: {
        fr: "Vérifiez le plafonnement de la déductibilité des intérêts d'emprunt (limite de 30% de l'EBITDA fiscal).",
        en: "Verify the cap on the deductibility of loan interest (limit of 30% of tax EBITDA).",
      },
      legal_source: {
        fr: "Article 212 bis du CGI",
        en: "Article 212 bis of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 11,
      category: "Innovation",
      title: {
        fr: "Crédit d'Impôt Innovation (CII)",
        en: "Innovation Tax Credit (CII)",
      },
      description: {
        fr: "Réservé aux PME : crédit d'impôt de 30% sur les dépenses de création de prototypes ou d'installations pilotes de nouveaux produits.",
        en: "Reserved for SMEs: 30% tax credit on expenses for creating prototypes or pilot installations of new products.",
      },
      legal_source: {
        fr: "Article 244 quater B, II-k du CGI",
        en: "Article 244 quater B, II-k of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 12,
      category: "VAT",
      title: {
        fr: "Autoliquidation de la TVA à l'importation",
        en: "Reverse charge of import VAT",
      },
      description: {
        fr: "Évitez l'avance de trésorerie en déclarant et déduisant simultanément la TVA sur la déclaration CA3 au lieu de la payer aux douanes.",
        en: "Avoid cash flow advance by simultaneously declaring and deducting VAT on the CA3 return instead of paying it to customs.",
      },
      legal_source: {
        fr: "Article 1695 du CGI",
        en: "Article 1695 of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 13,
      category: "Corporate Tax",
      title: {
        fr: "Report en avant des déficits",
        en: "Loss carry-forward",
      },
      description: {
        fr: "Les déficits constatés une année peuvent être reportés indéfiniment sur les bénéfices des années suivantes.",
        en: "Losses recorded one year can be carried forward indefinitely against profits in subsequent years.",
      },
      legal_source: {
        fr: "Article 209, I du CGI",
        en: "Article 209, I of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 14,
      category: "Incentives",
      title: {
        fr: "Réduction d'impôt pour mécénat",
        en: "Tax reduction for patronage",
      },
      description: {
        fr: "Réduction d'impôt de 60% du montant des versements faits à des organismes d'intérêt général (limite de 20 000€ ou 0,5% du CA).",
        en: "Tax reduction of 60% of the amount of payments made to general interest organizations (limit of €20,000 or 0.5% of turnover).",
      },
      legal_source: {
        fr: "Article 238 bis du CGI",
        en: "Article 238 bis of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 15,
      category: "Environment",
      title: {
        fr: "Suramortissement 'Vert'",
        en: "Green Bonus Depreciation",
      },
      description: {
        fr: "Déduction fiscale supplémentaire pour l'acquisition de poids lourds utilisant des énergies propres (GNV, hydrogène).",
        en: "Additional tax deduction for the acquisition of heavy goods vehicles using clean energy (NGV, hydrogen).",
      },
      legal_source: {
        fr: "Article 39 decies A du CGI",
        en: "Article 39 decies A of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 16,
      category: "Restructuring",
      title: {
        fr: "Pacte Dutreil (Transmission)",
        en: "Dutreil Pact (Transfer)",
      },
      description: {
        fr: "Exonération de 75% de la valeur de l'entreprise pour le calcul des droits de mutation en cas de transmission.",
        en: "Exemption of 75% of the company value for the calculation of transfer duties in case of transmission.",
      },
      legal_source: {
        fr: "Article 787 B du CGI",
        en: "Article 787 B of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 17,
      category: "VAT",
      title: {
        fr: "TVA sur les débits vs encaissements",
        en: "VAT on accruals vs cash basis",
      },
      description: {
        fr: "Opter pour la TVA sur les débits pour simplifier la comptabilité si vous vendez principalement des biens.",
        en: "Opt for VAT on accruals to simplify accounting if you primarily sell goods.",
      },
      legal_source: {
        fr: "Article 269 du CGI",
        en: "Article 269 of the General Tax Code",
      },
      impact_level: "Low",
    },
    {
      id: 18,
      category: "Corporate Tax",
      title: {
        fr: "Taux réduit d'IS pour les PME",
        en: "Reduced Corporate Tax rate for SMEs",
      },
      description: {
        fr: "Application d'un taux de 15% sur la tranche de bénéfice allant jusqu'à 42 500 € pour les PME.",
        en: "Application of a 15% rate on the profit slice up to €42,500 for SMEs.",
      },
      legal_source: {
        fr: "Article 219, I-b du CGI",
        en: "Article 219, I-b of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 19,
      category: "Real Estate",
      title: {
        fr: "Exonération de taxe foncière (Construction neuve)",
        en: "Property tax exemption (New construction)",
      },
      description: {
        fr: "Exonération temporaire de 2 ans pour les constructions nouvelles à usage professionnel ou d'habitation.",
        en: "Temporary 2-year exemption for new constructions for professional or residential use.",
      },
      legal_source: {
        fr: "Article 1383 du CGI",
        en: "Article 1383 of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 20,
      category: "Compliance",
      title: {
        fr: "Examen de Conformité Fiscale (ECF)",
        en: "Tax Compliance Review (ECF)",
      },
      description: {
        fr: "Faire auditer 10 points fiscaux par un tiers pour éviter des pénalités en cas de contrôle ultérieur.",
        en: "Have 10 tax points audited by a third party to avoid penalties in case of a subsequent audit.",
      },
      legal_source: {
        fr: "Décret n° 2021-25 du 13 janvier 2021",
        en: "Decree No. 2021-25 of January 13, 2021",
      },
      impact_level: "Medium",
    },
    {
      id: 21,
      category: "Payroll",
      title: {
        fr: "Réduction générale des cotisations patronales",
        en: "General reduction of employer contributions",
      },
      description: {
        fr: "Réduction dégressive des cotisations pour les salaires inférieurs à 1,6 SMIC (ex-Réduction Fillon).",
        en: "Decline in contributions for salaries below 1.6 times the minimum wage (ex-Fillon reduction).",
      },
      legal_source: {
        fr: "Article L241-13 du Code de la sécurité sociale",
        en: "Article L241-13 of the Social Security Code",
      },
      impact_level: "High",
    },
    {
      id: 22,
      category: "Innovation",
      title: {
        fr: "Régime IP Box (Brevets)",
        en: "IP Box Regime (Patents)",
      },
      description: {
        fr: "Imposition à taux réduit (10%) des revenus issus de la propriété intellectuelle (brevets, logiciels).",
        en: "Reduced tax rate (10%) on income from intellectual property (patents, software).",
      },
      legal_source: {
        fr: "Article 238 du CGI",
        en: "Article 238 of the General Tax Code",
      },
      impact_level: "High",
    },
    {
      id: 23,
      category: "International",
      title: {
        fr: "Retenue à la source (Conventions)",
        en: "Withholding tax (Treaties)",
      },
      description: {
        fr: "Application des taux réduits de retenue à la source sur les flux internationaux grâce aux conventions fiscales bilatérales.",
        en: "Application of reduced withholding tax rates on international flows through bilateral tax treaties.",
      },
      legal_source: {
        fr: "Modèle de convention de l'OCDE",
        en: "OECD Model Tax Convention",
      },
      impact_level: "Medium",
    },
    {
      id: 24,
      category: "VAT",
      title: {
        fr: "Régime de la marge (Biens d'occasion)",
        en: "Margin scheme (Second-hand goods)",
      },
      description: {
        fr: "Calculer la TVA uniquement sur la marge bénéficiaire et non sur le prix de vente total pour les biens d'occasion.",
        en: "Calculate VAT only on the profit margin and not on the total sales price for second-hand goods.",
      },
      legal_source: {
        fr: "Article 297 A du CGI",
        en: "Article 297 A of the General Tax Code",
      },
      impact_level: "Medium",
    },
    {
      id: 25,
      category: "Corporate Tax",
      title: {
        fr: "Amortissement dégressif",
        en: "Declining balance depreciation",
      },
      description: {
        fr: "Accélérer l'amortissement des biens d'équipement neufs pour réduire le bénéfice imposable les premières années.",
        en: "Accelerate depreciation of new capital goods to reduce taxable profit in the early years.",
      },
      legal_source: {
        fr: "Article 39 A du CGI",
        en: "Article 39 A of the General Tax Code",
      },
      impact_level: "Medium",
    },
  ],
};
