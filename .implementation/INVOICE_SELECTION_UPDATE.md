# Mise à Jour: Sélection d'Invoices dans la Modal de Factures Planifiées

## Vue d'ensemble

La modal `ScheduledInvoiceDialog` a été améliorée pour permettre aux utilisateurs de **changer la facture planifiée** en plus de modifier la date d'envoi. Cette fonctionnalité permet une gestion flexible des planifications d'envoi.

---

## Changements

Détaillés

### 1. ScheduledInvoiceDialog.tsx - Modifications Structurelles

#### Nouvelle Prop

```typescript
availableInvoices?: ScheduledInvoice[];
```

- Liste de toutes les factures planifiées disponibles pour la sélection
- Passée depuis `PlanningClient.tsx`

#### Signature de Callback Mise à Jour

```typescript
onSave: (
  invoiceId: string, // ID de l'ancienne facture
  newInvoiceId: string, // ID de la nouvelle facture
  newDate: string, // Date/heure ISO locale
) => Promise<void>;
```

#### Nouveau État

```typescript
const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
```

- Suit l'ID de la facture sélectionnée
- Initialisé avec `invoice.id` lors du montage

#### Nouveau Handler

```typescript
const handleInvoiceChange = useCallback((newInvoiceId: string) => {
  setSelectedInvoiceId(newInvoiceId);
  setError(null);
}, []);
```

- Met à jour la sélection et efface les erreurs précédentes

### 2. Interface Utilisateur - Nouveau Sélecteur

#### Section "Nom de la Facture"

**Avant**: Affichage statique du nom de la facture

```
┌─────────────────────────┐
│    Nom de la facture    │
├─────────────────────────┤
│   REF-2024-001          │
└─────────────────────────┘
```

**Après**: Sélecteur dropdown avec liste dynamique

```
┌─────────────────────────────────────────────┐
│    Nom de la facture                        │
├─────────────────────────────────────────────┤
│  ▼ REF-2024-001 (Client Name)               │
└─────────────────────────────────────────────┘
```

Détails du SelectItem:

- **Référence**: affichée en gras
- **Client**: affichée en petit texte gris dessous
- Tous les champs cliquables
- Format cohérent avec le design de l'app

#### Alerte de Changement

Quand l'utilisateur sélectionne une facture différente:

```
⚠️  La facture sera changée lors de la sauvegarde
```

- Couleur: amber (avertissement, pas erreur)
- Icon AlertCircle intégré
- Disparaît quand on revient à la facture originale

#### Mise à Jour des Informations

Quand une facture est sélectionnée, les champs suivants se mettent à jour automatiquement:

- **Destinataire**: du client de la nouvelle facture
- **Montant HT**: du montant de la nouvelle facture

### 3. PlanningClient.tsx - Logique de Gestion

#### Handler Amélioré: `handleSaveScheduledInvoiceDate`

**Étape 1: Déplanifier l'ancienne facture** (si changement)

```typescript
if (invoiceId !== newInvoiceId) {
  await performAction("invoices", "patch", {
    id: invoiceId,
    nextIssueDate: null,
  });
}
```

- Annule la planification sur l'ancienne facture
- Permet à l'ancienne facture de réapparaître au calendrier si nécessaire

**Étape 2: Planifier la nouvelle facture**

```typescript
const res = await performAction("invoices", "patch", {
  id: newInvoiceId,
  nextIssueDate: isoDate,
});
```

- Applique la nouvelle date d'envoi à la facture sélectionnée

**Étape 3: Mise à Jour de l'État Local**

```typescript
setScheduledInvoices((prev) => {
  let updated = [...prev];

  // Désactiver l'ancienne
  if (invoiceId !== newInvoiceId) {
    updated = updated.map((inv) =>
      inv.id === invoiceId ? { ...inv, nextIssueDate: null } : inv,
    );
  }

  // Activer la nouvelle
  updated = updated.map((inv) =>
    inv.id === newInvoiceId ? { ...inv, nextIssueDate: isoDate } : inv,
  );

  return updated;
});
```

**Étape 4: Message de Succès Adapté**

```typescript
const message =
  invoiceId !== newInvoiceId
    ? t("invoiceAndDateSaved") || "Facture et date mises à jour..."
    : t("dateSaved") || "Date mise à jour...";
```

#### Props du Composant

```jsx
<ScheduledInvoiceDialog
  isOpen={isScheduledInvoiceModalOpen}
  onOpenChange={setIsScheduledInvoiceModalOpen}
  invoice={selectedScheduledInvoice}
  onSave={handleSaveScheduledInvoiceDate}
  availableInvoices={scheduledInvoices} // ✨ NOUVEAU
  isLoading={isSavingScheduledInvoice}
/>
```

### 4. Traductions - Nouvelles Clés

#### Français (fr)

```typescript
invoiceWillBeChanged: "La facture sera changée lors de la sauvegarde";
invoiceAndDateSaved: "Facture et date mises à jour avec succès";
```

#### Anglais (en)

```typescript
invoiceWillBeChanged: "The invoice will be changed when saving";
invoiceAndDateSaved: "Invoice and date updated successfully";
```

---

## Flux d'Utilisation Amélioré

### Scénario 1: Modifier Uniquement la Date

1. Ouvrir modal → Facture X sélectionnée
2. Cliquer "Modifier la date"
3. Changer date/heure
4. Cliquer "Enregistrer"
5. Toast: "Date mise à jour avec succès"
6. Modal se ferme

### Scénario 2: Changer de Facture ET la Date

1. Ouvrir modal → Facture X sélectionnée
2. Cliquer dropdown "Nom de la facture"
3. Sélectionner Facture Y
4. **Alerte amber** s'affiche: "La facture sera changée..."
5. Cliquer "Modifier la date"
6. Changer date/heure
7. Cliquer "Enregistrer"
8. Backend:
   - Désactive planification Facture X (nextIssueDate = null)
   - Active planification Facture Y (nextIssueDate = nouvelle date)
9. Toast: "Facture et date mises à jour avec succès"
10. Modal se ferme
11. Calendrier se met à jour: Facture X disparaît, Facture Y apparaît

### Scénario 3: Changer de Facture, Puis Revenir à l'Originale

1. Sélectionner Facture Y → Alerte affichée
2. Cliquer dropdown
3. Sélectionner Facture X (l'originale)
4. Alerte **disparaît** (pas de changement réel)
5. Cliquer "Enregistrer"
6. Toast: "Date mise à jour avec succès" (car pas de changement d'invoice)

---

## Améliorations UX

### Indicateurs Visuels

- ✅ Dropdown change de style quand la facture change (amber border)
- ✅ Alerte amber pour avertir du changement
- ✅ Message Toast spécifique selon l'action
- ✅ Infos (destinataire, montant) se mettent à jour en temps réel

### États Désactivés

- Bouton "Enregistrer" désactivé si champs manquants
- SelectTrigger désactivé pendant le loading
- Input date désactivé pendant le loading

### Gestion des Erreurs

- Affichage clair des erreurs API
- Icon AlertCircle pour les erreurs et avertissements
- Possibilité d'annuler et réessayer

---

## Compatibilité Arrière

✅ Les factures planifiées existantes restent inchangées
✅ Les anciennes modales de tâches continuent de fonctionner
✅ Aucune rupture d'API backend
✅ L'état local est mis à jour de manière cohérente

---

## Tests Recommandés

1. ✅ Créer facture planifiée A avec date X
2. ✅ Créer facture planifiée B avec date Y
3. ✅ Ouvrir modal pour facture A
4. ✅ Vérifier dropdown affiche A et B
5. ✅ Sélectionner B
6. ✅ Vérifier alerte d'avertissement
7. ✅ Modifier la date
8. ✅ Cliquer "Enregistrer"
9. ✅ Vérifier:
   - Facture A disparaît du calendrier
   - Facture B se déplace à la nouvelle date
10. ✅ Tester le rollback (sélectionner A puis B à nouveau)
11. ✅ Tester avec FR et EN

---

## Performance

- **Requêtes Backend**: 2 PATCH au lieu de 1 (changement d'invoice)
  - 1 pour désactiver l'ancienne
  - 1 pour activer la nouvelle
- **État Local**: Mise à jour efficace avec `map` en place
- **Re-renders**: Minimisés grâce aux useCallback et dépendances ciblées

---

## Notes Techniques

1. **Type Safety**: Cast `t("invoiceWillBeChanged" as any)` pour éviter erreurs TypeScript
2. **Tailwind**: Utilisation de `shrink-0` au lieu de `flex-shrink-0` (moderne)
3. **Icones**: AlertCircle de lucide-react pour cohérence visuelle
4. **Sélecteur**: Utilise le composant Select d'Shadcn/ui (cohérent)

---

## Fichiers Impactés

| Fichier                      | Type    | Changements                   |
| ---------------------------- | ------- | ----------------------------- |
| `ScheduledInvoiceDialog.tsx` | MODIFIÉ | +Sélecteur, +Props, +Handlers |
| `PlanningClient.tsx`         | MODIFIÉ | +Logique double PATCH, +Props |
| `translations.ts`            | MODIFIÉ | +2 traductions (FR + EN)      |

---

## Prochaines Améliorations Possibles

- [ ] Filtrer les invoices non-planifiées du dropdown
- [ ] Ajouter un badge montrant le nombre de factures planifiées
- [ ] Permettre la création rapide d'une nouvelle facture depuis la modal
- [ ] Historique des changements de planification
