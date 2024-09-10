// Importation des modules nécessaires
import prismadb from "@/lib/prismadb"; // Importation de la base de données Prisma
import { auth } from "@clerk/nextjs/server"; // Importation de la fonction d'authentification de Clerk pour Next.js
import { redirect } from "next/navigation"; // Importation de la fonction de redirection de Next.js

// Déclaration de la fonction asynchrone SetupLayout
export default async function SetupLayout({
    children // Définition de la propriété children de type React.ReactNode
}: {
    children: React.ReactNode; // Typage de la propriété children
}) {
    const { userId } = auth(); // Récupération de l'ID de l'utilisateur via la fonction d'authentification

    // Si l'utilisateur n'est pas authentifié (pas d'userId)
    if (!userId) {
        redirect('/sign-in'); // Redirection vers la page de connexion
    }

    // Recherche de la première boutique associée à l'utilisateur dans la base de données Prisma
    const store = await prismadb.store.findFirst({
        where: {
            userId // Filtre basé sur l'ID de l'utilisateur
        }
    });

    // Si une boutique est trouvée
    if (store) {
        redirect(`/${store.id}`); // Redirection vers la page de la boutique trouvée
    }

    return (
        <>
        {children}
        </>
    )
}
