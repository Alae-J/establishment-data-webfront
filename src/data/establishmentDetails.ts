export interface EstablishmentDetail {
  title:       string;
  description: string;
  features:    string[];
  regions:     string[];
}

// key must match whatever you use in your URL param (`name`)
export const establishmentDetails: Record<string, EstablishmentDetail> = {
  // ORMVA Loukkos
  ormvas: {
    title:       "ORMVA – Offices Régionaux de Mise en Valeur Agricole",
    description: "Les ORMVA sont responsables de la gestion intégrée de l’eau et du sol afin de soutenir l’agriculture intensive et durable.",
    features: [
      "Gestion des ressources en eau et réseaux d’irrigation",
      "Programmes de conservation et restauration des sols",
      "Assistance technique aux agriculteurs",
      "Développement de projets d’infrastructure agricole",
      "Formation et vulgarisation des bonnes pratiques"
    ],
    regions: [
      "ORMVA du Loukkos",
      "ORMVA du Gharb",
      "ORMVA de Doukkala",
      "ORMVA de Tafilalet",
      "ORMVA du Haouz"
    ]
  },

  // Agences de Développement
  agences: {
    title:       "Agences de Développement",
    description: "Ces agences œuvrent pour la promotion du développement rural, la modernisation agricole et l’appui aux chaînes de valeur.",
    features: [
      "Diagnostics et planification de projets ruraux",
      "Financement et suivi des investissements",
      "Transfert de technologies et innovations",
      "Appui à la formation professionnelle",
      "Renforcement des capacités des acteurs locaux"
    ],
    regions: [
      "Agence Région Nord",
      "Agence Région Centre",
      "Agence Région Sud",
      "Agence Région Est"
    ]
  },

  // Offices Agricoles
  offices: {
    title:       "Offices Agricoles",
    description: "Implantés au plus près des agriculteurs, les Offices Agricoles garantissent un accompagnement technique quotidien sur le terrain.",
    features: [
      "Analyse de sol et conseils agronomiques",
      "Distribution d’intrants certifiés",
      "Suivi phytosanitaire des cultures",
      "Appui à la mécanisation",
      "Organisation de ateliers de formation"
    ],
    regions: [
      "Office Agricole de Tanger",
      "Office Agricole de Meknès",
      "Office Agricole de Marrakech",
      "Office Agricole d’Agadir"
    ]
  },

  // Centres de Formation
  formation: {
    title:       "Centres de Formation Agricole",
    description: "Les centres de formation dispensent des cursus professionnalisants pour préparer les jeunes et les agriculteurs aux métiers de l’agro-alimentaire.",
    features: [
      "Diplômes techniques en agronomie et élevage",
      "Stages pratiques en exploitation pilote",
      "Modules de gestion d’exploitation",
      "Ateliers d’innovation et agro-écologie",
      "Partenariats internationaux et échanges"
    ],
    regions: [
      "Centre de Formation de Rabat",
      "Centre de Formation de Fès",
      "Centre de Formation de Meknès",
      "Centre de Formation de Taza"
    ]
  },

  // Sociétés d’État
  "societe-etat": {
    title:       "Sociétés d’État du Secteur Agroalimentaire",
    description: "Ces sociétés publiques interviennent dans la transformation, la logistique et la commercialisation des produits agricoles.",
    features: [
      "Collecte et stockage de céréales",
      "Transformation agroalimentaire (huileries, sucreries…)    ",
      "Distribution à large échelle",
      "Recherche & développement en agro-tech",
      "Exportation et ouverture de marchés"
    ],
    regions: [
      "Siège National – Rabat",
      "Division Production – Casablanca",
      "Division Logistique – Agadir",
      "Centre R&D – Settat"
    ]
  },
};
