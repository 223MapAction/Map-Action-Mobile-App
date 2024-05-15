const permissions = {
  add_challenge: 1,
  participate_challenge: 2,
  promouvoir_acte_citoyen: 3,
  discussion: 4,
};
const Constants = {
  roles: {
    reporter: "reporter",
    admin: "admin",
    visitor: "visitor",
    citizen: "citizen",
    business: "business",
    elu: "elu",
  },

  badges: {
    aucun: {
      label: "pas de Badge",
      color: "#000",
      count: 0,
      permissions: [],
    },
    cuivre: {
      label: "Badge cuivre",
      color: "rgb(178, 54, 20)",
      count: 1,
      permissions: [permissions.participate_challenge],
    },
    bronze: {
      label: "Badge bronze",
      color: "#F0C016",
      count: 3,
      permissions: [
        permissions.participate_challenge,
        permissions.promouvoir_acte_citoyen,
      ],
    },
    argent: {
      label: "Badge argent",
      color: "#DBDBDB",
      count: 5,
      permissions: [
        permissions.add_challenge,
        permissions.participate_challenge,
        permissions.promouvoir_acte_citoyen,
      ],
    },
    gold: {
      label: "Badge gold",
      color: "#F8F14F",
      count: 10,
      permissions: [
        permissions.add_challenge,
        permissions.discussion,
        permissions.participate_challenge,
        permissions.promouvoir_acte_citoyen,
      ],
    },
  },
  permissions,
  incidents: {
    state: {
      declared: "declared",
      resolved: "resolved",
    },
  },
};

export default Constants;
