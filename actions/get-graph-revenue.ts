import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // Créer un objet pour stocker les revenus mensuels
  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // obtenir le mois (0 = Janvier, 11 = Décembre)

    let revenueForOrder = 0;

    // Calculer le revenu pour chaque commande
    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    // Ajouter le revenu au mois correspondant
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Créer la structure des données de graphe avec les mois en français
  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Fév", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Avr", total: 0 },
    { name: "Mai", total: 0 },
    { name: "Jui", total: 0 },
    { name: "Juil", total: 0 },
    { name: "Aoû", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Déc", total: 0 },
  ];

  // Mettre à jour les totaux dans graphData en fonction des revenus mensuels
  for (const month in monthlyRevenue) {
    const monthIndex = parseInt(month);
    if (graphData[monthIndex]) {
      graphData[monthIndex].total = monthlyRevenue[monthIndex];
    }
  }

  return graphData;
};
