# Doctory tests

```
test/
├── helpers/        shared helpers (db, auth, factories)
├── mocks/          service mocks (AI service, mailer…)
├── unit/           one folder per module — controllers & pure logic, no database
│   ├── middleware/ services/ utils/      (cross-cutting units — already written)
│   └── <module>/<module>.controller.test.js
├── integration/    one folder per module — API endpoints through supertest + test database
│   └── <module>/<module>.api.test.js
└── e2e/            one folder per module — pages / user flows on the running app
    ├── <module>/<module>.e2e.test.js
    └── flows/      cross-module journeys (patient booking, doctor onboarding, account security)
```

Modules: admin, auth, booking, booking-item, deletion-request, doctor, doctor-portfolio, doctor-work,
notification, patient, report, review, static, user.

Every generated file lists the endpoints documented in `routes/<Module>/index.js` as `test.todo(...)`:
replace a `todo` with a real test when its endpoint is implemented, so the todo count is the remaining work.

Run: `npm test` · `npm run test:unit` · `npm run test:integration` · `npm run test:e2e`
(the scripts need `jest` and `supertest` in devDependencies — see package.json).
