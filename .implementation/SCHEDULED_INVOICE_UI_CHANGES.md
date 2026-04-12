# Implémentation UI Personnalisée pour Factures Planifiées

## Vue d'ensemble
Modification complète de l'UI des cartes de factures planifiées dans le calendrier de planification pour afficher:
1. Le nom de la facture (référence)
2. Le destinataire (clientName)
3. Une input date modifiable pour changer la date d'envoi
4. Un style cohérent avec les tâches de planification

---

## Fichiers Modifiés

### 1. **essor/src/components/planning/ScheduledInvoiceDialog.tsx** (NOUVEAU)
**Créé de zéro**

- Composant React Client utilisant Dialog d'Shadcn/ui
- Affiche les détails de la facture planifiée:
  - Nom de la facture (lecture seule)
  - Destinataire (lecture seule)
  - Montant HT (lecture seule, si disponible)
  - Date d'envoi (datetime-local input, modifiable)
- États:
  - `isOpen` / `onOpenChange`: contrôle l'ouverture/fermeture
  - `invoice`: objet facture à afficher
  - `editedDate`: date modifiée en cours
  - `isEditing`: booléen pour activer l'édition
  - `error`: message d'erreur
- Fonction de callback `onSave(invoiceId, newDateTimeLocal)`: appelée lors de la sauvegarde
- Styles:
  - Cartes affichant infos en lecture seule: bg-primary/10 + border-primary/20
  - Input date d'envoi: bg-amber-500/10 + border-amber-500/20
  - Boutons stylisés avec couleur ambre pour l'action principale
  - Design cohérent avec les tâches (couleurs primaires et ambre)

### 2. **essor/app/(globale-layout)/planning/PlanningClient.tsx**
**Modifié**

#### Imports
- Ajout: `import { ScheduledInvoiceDialog } from "@/src/components/planning/ScheduledInvoiceDialog";`

#### Nouveaux États
```typescript
const [isScheduledInvoiceModalOpen, setIsScheduledInvoiceModalOpen] = useState(false);
const [selectedScheduledInvoice, setSelectedScheduledInvoice] = useState<any | null>(null);
const [isSavingScheduledInvoice, setIsSavingScheduledInvoice] = useState(false);
```

#### Nouveau Handler: `handleSaveScheduledInvoiceDate`
- Convertit datetime-local en ISO string
- Appelle `performAction("invoices", "patch", { id, nextIssueDate })`
- Met à jour l'état local `scheduledInvoices`
- Affiche toast de succès/erreur
- Ferme la modal à la fin

#### Modifié: `handleTodoClick`
- Ajoute vérification `if ((todo as any).isInvoiceTask)`
- Si c'est une tâche de facture, cherche la facture correspondante dans `scheduledInvoices`
- Ouvre la modal `ScheduledInvoiceDialog` au lieu de `TaskDialog`
- Sinon, traite comme une tâche régulière

#### Rendu du Composant
- Ajout du rendu de `<ScheduledInvoiceDialog />` avec props:
  - `isOpen={isScheduledInvoiceModalOpen}`
  - `onOpenChange={setIsScheduledInvoiceModalOpen}`
  - `invoice={selectedScheduledInvoice}`
  - `onSave={handleSaveScheduledInvoiceDate}`
  - `isLoading={isSavingScheduledInvoice}`

### 3. **essor/electron/data-handlers.js**
**Modifié**

#### Amélioration: Query pour factures planifiées
- Ajout d'un `select` explicite pour optimiser la requête
- Champs retournés:
  - `id`, `reference`, `clientName`, `totalHT`, `status`, `isScaled`, `createdAt`, `nextIssueDate`

#### Amélioration: Query pour factures récurrentes
- Ajout d'un `select` explicite
- Champs retournés (incluant les spécifiques aux récurrentes):
  - `id`, `reference`, `clientName`, `totalHT`, `status`, `isScaled`, `createdAt`
  - `nextIssueDate`, `isRecurring`, `recurrenceFreq`, `autoReminders`, `nextReminderDate`

### 4. **essor/src/lib/translations.ts**
**Modifié**

#### Traductions Français (FR) - Nouvelles clés
```
scheduledInvoice: "Facture Planifiée"
invoiceName: "Nom de la facture"
recipient: "Destinataire"
noClient: "Pas de client"
amountHT: "Montant HT"
sendDate: "Date d'envoi"
edit: "Modifier"
errorSaving: "Erreur lors de la sauvegarde"
requiredField: "Champ obligatoire"
cancelEdit: "Annuler la modification"
saving: "Enregistrement..."
editDate: "Modifier la date"
dateSaved: "Date mise à jour avec succès"
```

#### Traductions Anglais (EN) - Nouvelles clés
```
scheduledInvoice: "Scheduled Invoice"
invoiceName: "Invoice Name"
recipient: "Recipient"
noClient: "No client"
amountHT: "Amount HT"
sendDate: "Send Date"
edit: "Edit"
errorSaving: "Error saving changes"
requiredField: "Required field"
cancelEdit: "Cancel Edit"
saving: "Saving..."
editDate: "Edit Date"
dateSaved: "Date updated successfully"
```

#### Nettoyage
- Suppression des clés `recurring`, `weekly`, `monthly`, `yearly` dupliquées dans la section EN (L1576-1581)

---

## Flux d'Utilisation

### Avant: Ancien Comportement
- Clic sur une facture planifiée dans le calendrier
- Affichage d'une carte générique de tâche (titre + description)
- Aucun moyen de modifier la date d'envoi depuis le calendrier

### Après: Nouveau Comportement
1. **Affichage dans le Calendrier**
   - Les factures planifiées apparaissent comme des tâches avec `isInvoiceTask: true`
   - Titre: "Envoi: [référence]"
   - Description: "Client: [nom du client]"

2. **Clic sur la Facture**
   - Détection du type d'event: `isInvoiceTask`
   - Recherche de la facture dans `scheduledInvoices`
   - Ouverture de la modal `ScheduledInvoiceDialog`

3. **Modal Affichée**
   - Affiche en lecture seule:
     - Nom de la facture
     - Destinataire
     - Montant HT
   - Affiche la date d'envoi actuelle
   - Bouton "Modifier la date" pour entrer en mode édition

4. **Mode Édition**
   - Input datetime-local pré-remplie avec la date actuelle
   - Boutons: "Annuler la modification" et "Enregistrer"
   - Gestion des erreurs affichée

5. **Sauvegarde**
   - Conversion datetime-local → ISO string
   - API call: PATCH /invoices avec `nextIssueDate`
   - Mise à jour état local
   - Toast de succès
   - Fermeture modal

---

## Style et Thème

### Couleurs Utilisées
- **Infos en lecture seule**: `bg-primary/10` + `border-primary/20` + `text-foreground`
- **Date d'envoi**: `bg-amber-500/10` + `border-amber-500/20` + `text-amber-600`
- **Bouton principal**: `bg-amber-500 hover:bg-amber-600` + shadow ambre
- **Éléments texte**: Thème cohérent avec le reste de l'app

### Composants UI Utilisés
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` (Shadcn)
- `Button` (Shadcn) - variants: default, outline, ghost
- Input `datetime-local` HTML5 natif
- Icons de lucide-react (si besoin futur)

---

## Points Clés d'Implémentation

1. **Détection des Tâches de Facture**
   - Utilise le flag `isInvoiceTask` ajouté lors de la création des `combinedCalendarTasks`
   - Permet de différencier tâches régulières vs factures planifiées

2. **Fetch Optimisé**
   - Utilisation de `select` explicite dans les requêtes Prisma
   - Réduit la charge du serveur en ne retournant que les champs nécessaires

3. **Gestion des Dates**
   - Format datetime-local pour l'input (YYYY-MM-DDTHH:mm)
   - Conversion en ISO string pour l'API
   - Gestion des fuseaux horaires via le navigateur

4. **Traductions**
   - Clés bien structurées avec fallback EN → FR
   - Messages d'erreur localisés

---

## Tests à Effectuer

1. ✅ Créer une facture planifiée avec `nextIssueDate` non-null et `isRecurring = false`
2. ✅ Vérifier que l'élément apparaît dans le calendrier avec le bon titre
3. ✅ Cliquer sur la facture pour ouvrir la modal
4. ✅ Modifier la date et vérifier la sauvegarde
5. ✅ Vérifier que le calendrier se met à jour après la modification
6. ✅ Tester avec langue FR et EN
7. ✅ Vérifier la gestion des erreurs

---

## Fichiers Impactés (Résumé)

| Fichier | Type | Description |
|---------|------|-------------|
| `ScheduledInvoiceDialog.tsx` | CRÉÉ | Nouveau composant modal |
| `PlanningClient.tsx` | MODIFIÉ | Logique d'ouverture + handler de sauvegarde |
| `data-handlers.js` | MODIFIÉ | Requêtes optimisées avec select |
| `translations.ts` | MODIFIÉ | 16 nouvelles clés (FR + EN) |

---

## Notes de Déploiement

1. Redémarrer le serveur Next.js et Electron après déploiement
2. Vérifier que les factures planifiées existantes sont bien chargées
3. Tester le flow complet de création → planification → modification
4. Vérifier la cohérence des styles avec le thème de l'application
