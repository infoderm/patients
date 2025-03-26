# :test_tube: Test check list

> **TODO** Document instead by reading the test file declarations. Manual tests
> can be written down and marked as "skipped".

> :heavy_check_mark: Checked items correspond to automated tests. Items that
> are missing automated integration tests are marked with (~`integration`~).
> A similar notation is used for missing unit tests.

  - [x] APIs
    - [x] Subscriptions (~`unit`~)
    - [x] methods
    - [x] http api
      - [x] `api/ics`

  - [x] User Accounts
    - [x] Create
      - [x] Registering a new user
    - [x] Update
      - [x] Changing password

  - [x] User sessions
    - [x] Logging in
    - [x] Logging out

  - [ ] Patients
    - [x] Create
      - [x] Create patient from scratch
      - [x] Create patient from eID
    - [ ] Read
      - [x] Search
      - [ ] Search including deceased
    - [x] Update
      - [x] Patient personal info edition
      - [x] Update patient from eID
      - [x] eID noop when already up-to-date
      - [x] Patient merge (~`integration`~)
    - [ ] Delete
      - [ ] Mark patient as deceased
      - [x] Remove patient from DB


  - [ ] Appointments
    - [ ] Create
      - [ ] Schedule an appointment from agenda
        - [ ] With existing patient
        - [ ] With new patient
      - [ ] Schedule an appointment from agenda (by clicking on slot)
        - [ ] With existing patient
        - [ ] With new patient
      - [x] Schedule an appointment from patient
    - [ ] Read
      - [ ] Search for available slots
      - [ ] Patient's appointments list
      - [ ] Day's appointments list
    - [ ] Update
      - [x] Begin consultation
      - [ ] Transfer
    - [x] Delete
      - [x] Cancel an appointment
      - [x] Remove appointment from DB (~`integration`~)


  - [ ] Consultations
    - [x] Create
      - [x] Create new consultation without an appointment from patient page
    - [ ] Read
      - [ ] Paid
      - [ ] Unpaid
    - [x] Update
      - [x] Edit consultation
      - [x] Restore appointment (~`integration`~)
      - [x] Settle debt
      - [x] Transfer (~`integration`~)
    - [x] Delete
      - [x] Permanently delete (~`integration`~)

  - [ ] Books
    - [ ] Create
      - [x] By creating a consultation from scratch (~`integration`~)
      - [ ] By beginning a consultation from an appointment
    - [ ] Read
      - [ ] Books list
      - [ ] Book's consultations list
      - [x] CSV output (~`integration`~)
    - [x] Update
      - [x] Rename book (~`integration`~)
    - [x] Delete
      - [x] NA: Books cannot be explicitly deleted, they need to be renamed to
        an existing book name to "disappear".

  - [ ] SEPA
    - [ ] Check that is says "data.name must be a non-empty string" when
      payment settings are unset.
    - [ ] Check that is says "data.iban must be a non-empty string" when only holder account is set.
    - [ ] Check that it displays QR code when account holder and IBAN are set.
    - [ ] Check that inputting a reference with 141 characters triggers
      "data.unstructuredReference must have <=140 characters".
    - [ ] Check that inputting out of range amounts trigger "data.amount must be >=0.01 and <=999999999.99.".

  - [ ] Documents
    - [x] Create
      - [x] Should allow to upload a document by drag-and-drop
      - [x] Should allow to upload a document by import button
      - [x] Documents are automatically linked to matching patient when there is no ambiguity (~`integration`~)
    - [ ] Read
      - [x] Should allow to list patient's documents
      - [ ] Should allow to read a document
      - [x] Should allow to download a document (~`integration`~)
      - [ ] Should allow to print a results table
    - [x] Update
      - [x] Should allow to link document to a different patient (~`integration`~)
      - [x] Should allow to unlink (~`integration`~)
    - [x] Delete
      - [x] Should allow to mark document as "deleted" (~`integration`~)
      - [x] Should allow to remove document from DB (~`integration`~)
      - [x] Should allow to restore a document (~`integration`~)

  - [ ] Attachments
    - [ ] Create
      - [x] Can attach to patient
      - [ ] Can attach to consultation
    - [ ] Read
      - [ ] Can list patient attachments
      - [ ] Can list consultation attachments
      - [ ] Can list detached attachments
      - [ ] Can download / read attached contents
    - [ ] Update
      - [ ] Can detach
      - [ ] Can rename
      - [ ] Can reetach
    - [ ] Delete
      - [ ] Can delete

  - [ ] Allergies
    - [ ] Create
      - [ ] Allergy is automatically created if it does not exist when added to patient
    - [ ] Read
      - [ ] Can list all allergies and paginate
      - [ ] Can filter allergies by prefix and paginate
      - [ ] Patient allergies are shown in patient personal information
    - [ ] Update
      - [x] Can change color (~`integration`~)
      - [ ] Renaming allergy renames it for all patients
      - [ ] Patient-specific comments work
    - [ ] Delete
      - [ ] Deleting allergy removes it from all patients

  - [ ] Doctors
    - [ ] Create
      - [ ] Doctor is automatically created if it does not exist when added to patient
    - [ ] Read
      - [ ] Can list all doctors and paginate
      - [ ] Can filter doctors by prefix and paginate
      - [ ] Patient doctors are shown in patient personal information
    - [ ] Update
      - [ ] Renaming doctor renames it for all patients
      - [ ] Patient-specific comments work
    - [ ] Delete
      - [ ] Deleting doctor removes it from all patients

  - [ ] Insurances
    - [ ] Create
      - [ ] Insurance is automatically created if it does not exist when added to patient
    - [ ] Read
      - [ ] Can list all insurances and paginate
      - [ ] Can filter insurances by prefix and paginate
      - [ ] Patient insurances are shown in patient personal information
    - [ ] Update
      - [ ] Renaming insurance renames it for all patients
      - [ ] Patient-specific comments work
    - [ ] Delete
      - [ ] Deleting insurance removes it from all patients

  - [ ] Issues
    - [ ] It lists uploads that are not attached
    - [ ] It lists documents that are not parsed
    - [ ] It lists documents that are not decoded
    - [ ] It lists documents that are not linked
    - [ ] It lists consultations missing payment data
    - [ ] It lists consultations missing a book
    - [ ] It lists consultations with price 0 not in book 0
    - [ ] It lists doctors with non-alphabetical symbols

  - [ ] Settings
    - [ ] UI
      - [ ] Toggle navigation drawer state
        - [ ] From settings
        - [ ] By clicking hamburger menu
    - [ ] Theme
      - [ ] Toggle theme light/dark
      - [x] Set theme primary color (~`integration`~)
      - [x] Reset theme primary color (~`integration`~)
      - [x] Set theme secondary color (~`integration`~)
      - [x] Reset theme secondary color (~`integration`~)
    - [ ] Payment
      - [x] Set account holder (~`integration`~)
      - [x] Set IBAN (~`integration`~)
      - [ ] Check IBAN validation
      - [ ] Check only EUR is supported
    - [ ] Locale
      - [ ] Changing language updates first day of the week and first week
        contains date when set to "same as locale".
      - [ ] Changing first day of the week updates Agenda day order (weekly)
      - [ ] Changing first day of the week updates Agenda day order (monthly)
      - [ ] Changing first week contains date changes week numbers (if first
        day of the year is not the first day of the first week)
    - [ ] Agenda
      - [ ] Configure work schedule
      - [ ] Configure appointment durations
      - [ ] Configure displayed week days
      - [ ] Configure cancellation reasons
      - [ ] Agenda work-schedule slot click sets initial time
      - [ ] Agenda full-day slot click empties initial time
      - [ ] Agenda work-schedule slot click does not set initial time when configured not to
    - [ ] Text
      - [ ] Text transform uppercase works
      - [ ] Important strings are highlighted (past)
      - [ ] Important strings are highlighted (ongoing)

  - [x] API tokens
    - [x] Can generate a token (~`integration`~)
    - [x] Can revoke a token (~`integration`~)
    - [x] Can use a token (~`integration`~)

  - [ ] Statistics
    - [ ] Check that it displays empty plots on with a new user account
    - [ ] Check that it displays plots with data after creating one patient of
      each gender with a set age, and at least on consultation for one of them.
