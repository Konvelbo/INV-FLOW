# Guide Visuel: Sélection d'Invoices dans le Calendrier de Planification

## 📱 Vue d'ensemble de l'Interface

### AVANT (UI Statique)
```
┌────────────────────────────────────────────┐
│         Facture Planifiée                  │
├────────────────────────────────────────────┤
│                                            │
│  Nom de la facture:                        │
│  ┌──────────────────────────────────────┐  │
│  │ REF-2024-001                         │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Destinataire:                             │
│  ┌──────────────────────────────────────┐  │
│  │ Acme Corporation                     │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Montant HT:                               │
│  ┌──────────────────────────────────────┐  │
│  │ 1500.00 €                            │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Date d'envoi:                             │
│  ┌──────────────────────────────────────┐  │
│  │ 15 Jan 2024 09:00                    │  │
│  └──────────────────────────────────────┘  │
│                            [Annuler][Édit.]│
└────────────────────────────────────────────┘
```

### APRÈS (UI Interactive)
```
┌────────────────────────────────────────────┐
│         Facture Planifiée                  │
├────────────────────────────────────────────┤
│                                            │
│  Nom de la facture: ← PEUT CHANGER        │
│  ┌──────────────────────────────────────┐  │
│  │ ▼ REF-2024-001 (Acme Corp.)          │  │
│  │ Cliquez pour sélectionner une autre  │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ⚠️  La facture sera changée lors de la    │
│      sauvegarde                            │
│                                            │
│  Destinataire: ← MIS À JOUR AUTO           │
│  ┌──────────────────────────────────────┐  │
│  │ Tech Innovations Ltd                 │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Montant HT: ← MIS À JOUR AUTO             │
│  ┌──────────────────────────────────────┐  │
│  │ 2500.00 €                            │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Date d'envoi:                             │
│  ┌──────────────────────────────────────┐  │
│  │ 20 Jan 2024 10:00    [Modifier]      │  │
│  └──────────────────────────────────────┘  │
│            [Annuler][Annuler Modif.][✓]   │
└────────────────────────────────────────────┘
```

## 🔄 Flux d'Interaction Complet

### Cas 1: Modification Simple de la Date
```
┌─────────────────┐
│ Modal Ouverte   │
│ Facture A       │
└────────┬────────┘
         │
         │ Clic "Modifier la date"
         ↓
┌─────────────────┐
│ Mode Édition    │
│ Date changée    │
└────────┬────────┘
         │
         │ Clic "Enregistrer"
         ↓
┌─────────────────────────┐
│ API: PATCH invoices/A   │
│ nextIssueDate: nouvelle │
└────────┬────────────────┘
         │
         │ Succès
         ↓
┌─────────────────────────┐
│ Toast: "Date mise à     │
│ jour avec succès"       │
│ Modal se ferme          │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│ Calendrier Actualisé    │
│ Facture A déplacée      │
└─────────────────────────┘
```

### Cas 2: Changement de Facture + Date
```
┌─────────────────────────────────┐
│ Modal Ouverte                   │
│ Facture A sélectionnée          │
└────────────┬────────────────────┘
             │
             │ Clic dropdown "Nom de la facture"
             ↓
┌─────────────────────────────────┐
│ Liste déroulante apparaît:      │
│ • REF-2024-001 (Acme Corp.) ← A │
│ • REF-2024-002 (Tech Inn.) ← B  │
│ • REF-2024-003 (Design Co.)     │
└────────────┬────────────────────┘
             │
             │ Sélectionner B
             ↓
┌─────────────────────────────────┐
│ Facture B sélectionnée          │
│ Infos mises à jour:             │
│ • Destinataire: Tech Inn.       │
│ • Montant: 2500.00 €            │
│ ⚠️ Alerte: "La facture sera     │
│   changée lors de la sauvegarde"│
└────────────┬────────────────────┘
             │
             │ Clic "Modifier la date"
             ↓
┌─────────────────────────────────┐
│ Mode Édition - Date              │
└────────────┬────────────────────┘
             │
             │ Changer date → Clic "Enregistrer"
             ↓
┌─────────────────────────────────┐
│ API Call 1: PATCH invoices/A    │
│ { nextIssueDate: null }         │
│ (Désactiver ancienne)           │
└────────────┬────────────────────┘
             │
             ↓ Succès
┌─────────────────────────────────┐
│ API Call 2: PATCH invoices/B    │
│ { nextIssueDate: "2024-01-20"} │
│ (Activer nouvelle)              │
└────────────┬────────────────────┘
             │
             ↓ Succès
┌─────────────────────────────────┐
│ Toast: "Facture et date mises   │
│ à jour avec succès"             │
│ State mise à jour:              │
│ • Facture A: nextIssueDate=null │
│ • Facture B: nextIssueDate=date │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Calendrier Actualisé:           │
│ • Facture A disparaît           │
│ • Facture B apparaît à la date  │
└─────────────────────────────────┘
```

## 🎨 États Visuels du Sélecteur

### État Normal (Facture Inchangée)
```
┌──────────────────────────────────────┐
│ Nom de la facture                    │
├──────────────────────────────────────┤
│ ▼ REF-2024-001 (Acme Corp.)          │
│    Couleur: Primary/10 (bleu clair)  │
│    Border: Primary/20 (bleu foncé)   │
└──────────────────────────────────────┘
```

### État Changé (Facture Différente)
```
┌──────────────────────────────────────┐
│ Nom de la facture                    │
├──────────────────────────────────────┤
│ ▼ REF-2024-002 (Tech Inn.)           │
│    Couleur: Amber/10 (jaune clair)   │
│    Border: Amber/20 (jaune foncé)    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ⚠️  La facture sera changée lors de   │
│     la sauvegarde                    │
│    Couleur: Amber (avertissement)    │
└──────────────────────────────────────┘
```

### Dropdown Ouvert
```
┌──────────────────────────────────────┐
│ ▼ REF-2024-002 (Tech Inn.)           │
├──────────────────────────────────────┤
│ ☑ REF-2024-001                       │
│   Acme Corporation                   │
│                                      │
│   REF-2024-002                       │
│   Tech Innovations                   │
│                                      │
│   REF-2024-003                       │
│   Design Collective                  │
│                                      │
│   REF-2024-004                       │
│   Marketing Pro                      │
└──────────────────────────────────────┘
```

## 📊 Structure de Données

### Props PassÉes à ScheduledInvoiceDialog
```
{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  invoice: ScheduledInvoice {
    id: string
    reference: string
    clientName: string
    totalHT: number
    nextIssueDate: string (ISO)
    status?: string
    isScaled?: boolean
  }
  availableInvoices: ScheduledInvoice[] // NOUVEAU
  onSave: (
    oldInvoiceId: string,      // ID ancien
    newInvoiceId: string,      // ID nouveau (peut être égal)
    newDate: string            // datetime-local
  ) => Promise<void>
  isLoading: boolean
}
```

### État Local du Composant
```
{
  selectedInvoiceId: string      // L'ID sélectionné (peut ≠ invoice.id)
  editedDate: string             // Format datetime-local
  isEditing: boolean             // Mode édition activé?
  error: string | null           // Message d'erreur si présent
}
```

## 🔍 Mise à Jour des Informations en Temps Réel

Quand l'utilisateur change de facture dans le dropdown:

```
AVANT (Facture A):
┌────────────────────────────────────┐
│ Destinataire: Acme Corp.           │
│ Montant HT: 1500.00 €              │
└────────────────────────────────────┘

  ↓ Utilisateur sélectionne Facture B

APRÈS (Facture B):
┌────────────────────────────────────┐
│ Destinataire: Tech Inn.   ← AUTO   │
│ Montant HT: 2500.00 €     ← AUTO   │
└────────────────────────────────────┘

Code React:
const selectedInvoice = 
  availableInvoices.find(inv => inv.id === selectedInvoiceId) || invoice;

// Utilisé pour afficher les infos
<div>{selectedInvoice.clientName}</div>
<div>{selectedInvoice.totalHT.toFixed(2)} €</div>
```

## 🔄 Cycle de Vie de la Sauvegarde

```
handleSaveScheduledInvoiceDate(oldId, newId, dateTime):
│
├─ 1️⃣ Convertir datetime-local → ISO
│  "2024-01-20T10:30" → "2024-01-20T08:30:00Z"
│
├─ 2️⃣ Si changement: Désactiver ancienne
│  IF oldId ≠ newId:
│    PATCH /invoices/oldId
│    { nextIssueDate: null }
│
├─ 3️⃣ Activer nouvelle
│  PATCH /invoices/newId
│  { nextIssueDate: isoDate }
│
├─ 4️⃣ Succès? Mettre à jour state local
│  setScheduledInvoices((prev) => {
│    if (oldId ≠ newId)
│      désactiver oldId
│    activer newId avec nouvelle date
│  })
│
├─ 5️⃣ Toast de succès adapté
│  IF oldId ≠ newId:
│    "Facture et date mises à jour"
│  ELSE:
│    "Date mise à jour avec succès"
│
└─ 6️⃣ Fermer modal
   setIsScheduledInvoiceModalOpen(false)
```

## ⚡ Gestion des Erreurs

### Erreur: Champs Manquants
```
handleSave() → Validation
├─ invoice.id ? ✓
├─ selectedInvoiceId ? ✓
├─ editedDate ? ✓
└─ Si une manque:
   error = "Champ obligatoire"
   ❌ Arrêter, afficher erreur
```

### Erreur: API Échouée
```
PATCH /invoices/{id} → 500 error
├─ catch(error)
├─ setError(error.message)
├─ toast.error(message)
└─ ✋ Garder modal ouverte pour retry
```

### Affichage des Erreurs
```
┌────────────────────────────────────┐
│ ❌ Erreur lors de la sauvegarde    │
│    Impossible de contacter le      │
│    serveur. Veuillez réessayer.    │
└────────────────────────────────────┘
```

## 🌐 Traductions Multilingues

### Français (FR)
```
invoiceWillBeChanged: "La facture sera changée lors de la sauvegarde"
invoiceAndDateSaved: "Facture et date mises à jour avec succès"
dateSaved: "Date mise à jour avec succès"
invoiceName: "Nom de la facture"
recipient: "Destinataire"
amountHT: "Montant HT"
sendDate: "Date d'envoi"
edit: "Modifier"
cancelEdit: "Annuler la modification"
saving: "Enregistrement..."
```

### Anglais (EN)
```
invoiceWillBeChanged: "The invoice will be changed when saving"
invoiceAndDateSaved: "Invoice and date updated successfully"
dateSaved: "Date updated successfully"
invoiceName: "Invoice Name"
recipient: "Recipient"
amountHT: "Amount HT"
sendDate: "Send Date"
edit: "Edit"
cancelEdit: "Cancel Edit"
saving: "Saving..."
```

## 🎯 Cas d'Usage: Scénarios Réels

### Scénario 1: Changer la Date d'Envoi
```
Contexte: Facture A planifiée pour demain, mais le client
          demande de la reporter d'une semaine.

Utilisateur:
1. Ouvre le calendrier
2. Clique sur Facture A
3. Modal s'ouvre → Facture A sélectionnée
4. Clic "Modifier la date"
5. Change date de "2024-01-20" à "2024-01-27"
6. Clic "Enregistrer"

Résultat:
✅ Facture A reste assignée
✅ Date d'envoi change
✅ Toast: "Date mise à jour avec succès"
✅ Calendrier: Facture A se déplace au 27 janvier
```

### Scénario 2: Changer de Facture
```
Contexte: Facture A était planifiée, mais c'est en fait
          Facture B qui doit être envoyée.

Utilisateur:
1. Ouvre le calendrier
2. Clique sur Facture A (mauvaise!)
3. Modal s'ouvre → Facture A sélectionnée
4. Clic dropdown "Nom de la facture"
5. Sélectionne Facture B
6. Alerte ⚠️ s'affiche
7. Vérifiie les infos: "Tech Inn., 2500€" ✓
8. Clic "Enregistrer" (date reste la même)

Résultat:
✅ Facture A: planification annulée
✅ Facture B: planification activée (même date)
✅ Toast: "Facture et date mises à jour"
✅ Calendrier: Facture A disparaît, Facture B s'affiche
```

### Scénario 3: Annuler le Changement
```
Contexte: Utilisateur essaie une nouvelle facture,
          puis change d'avis.

Utilisateur:
1. Modal ouverte, Facture A sélectionnée
2. Clic dropdown
3. Sélectionne Facture B
4. Alerte ⚠️ s'affiche
5. Re-clic dropdown
6. Sélectionne Facture A (retour)
7. Alerte ⚠️ DISPARAÎT (pas de changement)
8. Clic "Enregistrer"

Résultat:
✅ Aucun changement appliqué
✅ Toast: "Date mise à jour avec succès"
✅ Calendrier: Aucun changement
```

## 🔗 Intégration au Calendrier

### Avant Clic
```
Calendrier de Planification
┌─────────────────────────────────┐
│ 20 Jan 2024                     │
├─────────────────────────────────┤
│ • Tâche: Appel client (09:00)   │
│ • Envoi: REF-2024-001 (10:00)   │ ← Clique ici
└─────────────────────────────────┘
```

### Après Clic
```
Modal s'ouvre avec:
┌────────────────────────────────┐
│ Facture Planifiée              │
├────────────────────────────────┤
│ Nom: REF-2024-001              │
│ Client: Acme Corp.             │
│ Montant: 1500.00 €             │
│ Date: 20 Jan 2024 10:00        │
│ Boutons: [Annuler] [Modifier]  │
└────────────────────────────────┘
```

### Après Modification et Sauvegarde
```
Calendrier Actualisé
┌─────────────────────────────────┐
│ 27 Jan 2024  (Nouvelle date)   │
├─────────────────────────────────┤
│ • Envoi: REF-2024-002 (10:00)   │ ← Déplacé!
└─────────────────────────────────┘

Et

┌─────────────────────────────────┐
│ 20 Jan 2024                     │
├─────────────────────────────────┤
│ • Tâche: Appel client (09:00)   │
│ (REF-2024-001 a disparu)        │
└─────────────────────────────────┘
```

## 📈 Performance et Optimisations

### Requêtes API
```
Changement simple de date:
  1 PATCH /invoices/{id}
  └─ Rapide ✓

Changement de facture + date:
  2 PATCH /invoices/{oldId}
  2 PATCH /invoices/{newId}
  └─ Légèrement plus lent, mais acceptable

État local:
  Un seul appel setScheduledInvoices()
  avec map() en place
  └─ Optimisé avec useCallback
```

### Renders
```
Sans changes:
  Composant ne se re-rend que si props/state change
  ✓ Memoized avec useCallback

Pendant l'édition:
  Seul le champ concerné se met à jour
  ✓ Pas de re-render de tout le composant
```

## 🎓 Résumé des Améliorations

| Feature | Avant | Après |
|---------|-------|-------|
| **Modification date** | ✓ | ✓ (amélioré) |
| **Changement facture** | ✗ | ✅ NOUVEAU |
| **Alerte changement** | ✗ | ✅ NOUVEAU |
| **Mise à jour auto infos** | ✗ | ✅ NOUVEAU |
| **Traduction** | Complète | Complète + 2 clés |
| **UX** | Basique | Riche et intuitive |
| **Gestion erreurs** | Simple | Robuste |
