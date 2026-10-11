# Doctor Module — Flow

## 1. Login and Access
```mermaid
flowchart TD
    A[Doctor opens Login] --> B[Submits credentials]
    B --> C{Authenticated and authorized?}
    C -- No --> D[Show error or access denied]
    C -- Yes --> E[Doctor Dashboard]
```
Authentication is documented as JWT with HttpOnly Cookies. Role-based authorization should protect Doctor routes. The exact behavior for unverified doctors must be confirmed.

## 2. Booking Approval
```mermaid
flowchart TD
    A[Patient books appointment] --> B[Status: pending]
    B --> C[Doctor reviews booking]
    C --> D{Doctor decision}
    D -- Accept --> E[Status: confirmed]
    E --> F[Notify patient]
    F --> G[Add patient to queue]
    G --> H[Record action in Audit Log]
    D -- Reject --> I[Status: rejected]
    I --> J[Notify patient]
    J --> K[Free appointment slot]
    K --> H
```
This follows the README's documented booking workflow.

## 3. Waiting List and Clinical Work
```mermaid
flowchart TD
    A[Doctor Dashboard] --> B[Open Waiting List]
    B --> C[Select patient or visit]
    C --> D[Load authorized clinical information]
    D --> E[Review clinical context]
    E --> F[Create or modify diagnosis]
    F --> G[Save diagnosis]
    G --> H[Write prescription]
    H --> I[Save prescription]
```
The detailed visit lifecycle and mandatory order of diagnosis/prescription are not defined in the README. This is a proposed flow.

## 4. AI Decision Support
```mermaid
flowchart TD
    A[AI service returns suggestion] --> B[Doctor reviews information]
    B --> C[Doctor makes clinical decision]
    C --> D[Diagnosis or prescription as appropriate]
```
AI output remains a suggestion. The physician retains authority over diagnosis, prescriptions, and medical reports.

## 5. Key Rules
- New booking starts as `pending`.
- Accept changes status to `confirmed`, notifies the patient, and adds the patient to the queue.
- Reject changes status to `rejected`, notifies the patient, and frees the slot.
- Every accept/reject action is recorded in the Audit Log.
- Doctor cannot access the patient's full account data.
- Admin handles physician ID verification and activation/rejection.

## 6. Unresolved Rule
The README mentions an additional patient confirmation / repeated non-confirmation rule, including rejection on a third occurrence, but does not fully define its states and transitions. Confirm with the team before implementing.
