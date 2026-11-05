# SAP Joule enablement — research notes

Collected 4 Nov 2026 to build `SAP-Joule-Enablement-Runbook.docx`.

**How this was researched.** Web search across SAP Help Portal, SAP Learning,
SAP Architecture Center, SAP Community and selected partner sources. Direct page
reads of help.sap.com, community.sap.com and learning.sap.com were blocked by the
session's network policy, so details below come from search-engine extracts of
those pages. Every item marked **Verify** should be checked against the live
SAP page before you rely on it.

Confidence: **High** = several SAP sources agree · **Medium** = one SAP source or
SAP Community only · **Low / Verify** = partner blog, conflicting sources, or
unconfirmed.

---

## 1. Operating models

| Finding | Confidence | Source |
|---|---|---|
| Two provisioning models: **SAP-managed** (started from SAP for Me; SAP does BTP, identity and integration) and **customer-managed** (you set up BTP, Cloud Identity Services and run the Joule booster). | High | SAP Help *Customer-Managed Provisioning*; SAP Learning *Shifting Operating Model*; SAP Community *SAP-managed provisioning for Joule* |
| SAP-managed was announced at Sapphire 2026 as the standard path for new deployments; existing customer-managed instances stay supported, with migration help. | Medium | SAP Learning *Activating Joule* |
| SAP-managed: SAP for Me → Portfolio & Products → My Product Packages → Start Provisioning; monitor in the Resources tab. AI activation dashboard: Portfolio & Products → Business AI → Ready for Activation. "Level 2" (customer-like end-to-end) and "Level 0" (quick validation) provisioning exist for testing. | Medium | SAP Community *SAP Managed Joule Integration Testing Guide for LOB: Level 2 and Level 0* |
| Prerequisite in the onboarding guide: purchased **AI Unit SKU 8019164 or Joule Base**. (A €0 SKU 8019544 to accept AI terms is cited by one partner source but could not be confirmed.) | Medium / Verify | SAP Help *Joule Onboarding Guide*; partner blog |

## 2. Commercials (verify with SAP account team)

| Finding | Confidence | Source |
|---|---|---|
| Joule Base is included with qualifying SAP cloud subscriptions; Premium features (Joule Agents, assistants) consume **AI Units**. AI Units are purchased and activated in SAP for Me. | Medium | SAP Learning *Understanding the Commercial Model – Joule Base*; partner blogs |
| SAP reset AI/data licensing on 1 Jul 2025. Agent consumption rates differ by source (0.02 AI Units per action vs tiered 0.005 / 0.01 / 0.025 per step). Unused AI Units may expire at term end. | Low / Verify | redresscompliance.com, saplicensingexperts.com, SAP Community Joule Agents FAQ |
| Joule Studio: SAP Build entitlement + SAP Build developer licence; Joule entitlement to run in production. A free-run promotion for custom agents applied in Q1 2026. | Medium | SAP Architecture Center *Joule Skills*; sap.com Joule Studio |

## 3. Common technical prerequisites (customer-managed)

| Finding | Confidence | Source |
|---|---|---|
| SAP BTP **enterprise** global account (CPEA, BTPEA or subscription). | High | SAP Help *Prerequisites for Customer-Managed Provisioning*; SAP Learning |
| Entitlements in the same global account: **Joule** (technical name `das-application`, plan commonly **foundation**; some guides cite *standard* / DAS Standard / DAS Premium), **SAP Build Work Zone, standard edition** (foundation plan is in every global account; some SuccessFactors guides use *standard*), **SAP Cloud Identity Services**. | Medium / Verify plan names | SAP Community *Joule end-to-end setup guide (unified)*; SAP Learning |
| Joule and Work Zone in the **same subaccount**; Work Zone destinations in that subaccount. Joule talks to only one Work Zone instance; SAP recommends reusing an existing one. | High | SAP Help PCE integration; Architecture Center |
| Subaccount, IAS tenant and Work Zone in the same region; Cloud Foundry enabled. | Medium | SAP Community guides |
| Trust between subaccount and IAS via **OpenID Connect**; **SAML not supported** for the Joule trust. Disable default IdP for login where guides say so. | High | SAP Learning *Technical architecture*; Joule Studio enablement guide |
| **One SAP Cloud Identity Services tenant** for Joule and every integrated product; users identified by the **Global User ID** (`user_uuid`), mapped as an assertion attribute; Work Zone subject name identifier must also be the Global User ID. | High | SAP Help *Identity and Access Management for Joule*; SAP Community *Global User ID and SAP IAS* |
| Identity Provisioning Service (IPS) syncs users/roles (SCIM 2.0, includes `userUuid`) to Work Zone. | High | SAP Help integration guide |
| Trusted domains: product domains added in BTP and IAS; Joule URL in the product's CSP allowlist (S/4 Public: *Manage Content Security Policy*). | High | SAP Help per-product integration pages |
| Booster: Global account → **Boosters** → "Setting Up Joule" (also shown as *Joule*) → Start. It checks entitlements/IAS, creates the Joule subscription, destinations and a **formation** (System Landscape → Formations). It does **not** create role collections. | High | SAP Community booster guides; KBAs 3721340, 3675105 |
| Regions vary by product; examples cited: Joule for Consultants EU10, EU11, EU20, US10, AP10, JP10; Joule Studio AP10, EU10, EU30, EU20, US10, US21; Joule Preview entitlements only EU10/EU30. | Medium / Verify | SAP Learning J4C; SAP Community Joule Studio provisioning; SAP Help prerequisites |
| Landscape: one Joule instance per IAS tenant; **two tiers** recommended (non-production on **Joule Preview**, production). Older guidance shows three stages. | High | SAP Architecture Center *Joule Landscape Recommendation* |

## 4. Roles and administration

| Finding | Confidence | Source |
|---|---|---|
| Create your own role collection(s) with Joule roles (e.g. `end_user`, `extensibility_developer`, `tenant_admin`, `analytics_admin`) from application `das-application`; assign via IAS groups or directly. | Medium | SAP Community *Managing Joule on SAP BTP*; J4C guide |
| Joule Admin Center: `<joule-tenant-url>/admin` (role `tenant_admin`). Joule Analytics Center: `<joule-tenant-url>/analytics` (role `analytics_admin`) — product, scenario, interaction-type and client-type usage. Usage is not shown in SAP for Me. | Medium | SAP Community; SAP Help *Joule Analytics Center* |
| Support component **CA-JOULE**. | Medium | SAP Community troubleshooting guide |

## 5. Product-specific findings

### S/4HANA Cloud Public Edition
- Booster adds communication arrangements **SAP_COM_0882** and **SAP_COM_0647** in the background; **SAP_COM_0193** (Work Zone user/role provisioning) created manually. SAP_COM_0647 role exposure = ALL, or filter `cFLGExposure eq true` when SELECTED. (Medium, SAP Help + SAP Community)
- Joule URL into *Manage Content Security Policy*; S/4 tenant URL into BTP trusted domains; `Launchpad_Admin` for Work Zone admin. (Medium)
- Only one S/4HANA Public tenant per Joule tenant (per J4D guide). (Medium)
- Joule for Developers (ABAP AI): catalog **SAP_A4C_BC_DEV_AIQ_PC**; up to 24 h to take effect. (Medium)

### S/4HANA Cloud Private Edition (RISE)
- RISE customers only; S/4HANA **2021+**, **2023 FPS01 recommended**. (High)
- Sequence: IAS trust (OIDC) → trusted domains → user attributes → expose FLP content (CDM3) → S/4 as Work Zone content provider (Channel Manager) → booster + destinations → IPS. (High)
- Cloud Connector for connectivity; **principal propagation** required. (Medium)
- Content exposure: SICF `/sap/bc/ui2/cdm3` (V1) or `/sap/bc/http/ui2/flp_content_exposure/entities` (V2, from 2023 FPS01); report **/UI2/CDM3_EXP_SCOPE**; logs SLG1 object `/UI2/BE`, sub-object `/UI2/CDM3`; design-time destination with basic auth; schedule regular content update. (Medium)
- SAP Notes: **3639572** (Enabling Joule with S/4HANA Cloud PE), **3523238** (semantic objects/actions), **3641945** (Joule icon in FLP), **3558794** (AI functionality in PCE / ADT). (Medium / Verify)
- Provisioning can also be automated with **Cloud Integration Automation service (CIAS)**; multi-system support for PCE exists (2026). (Medium)

### On-premise S/4HANA and ECC
- Historically no native Joule (SAP Note 3632703 cited). Sapphire 2026: **Joule Work** and a share of agents for hybrid/on-prem landscapes, tied to cloud commitment (RISE / Max Success Plan); connectivity via Cloud Connector. Dates and scope conflict between sources. (Low / Verify)

### SAP SuccessFactors
- Valid licence + supported data centre; Work Zone standard edition / SAP Start; Cloud Identity Services active (usually delivered with SF). (High)
- IAS: add a source system, import the Joule JSON for SuccessFactors, rename to the company ID; SF domain as trusted domain in IAS. (Medium)
- RBP: **General User Permission → Access to Joule** on the permission roles; group-based assignment. (High)
- Discovery Center mission *Activate Joule for SAP SuccessFactors*; SAP Note 2791410 (IAS considerations); KBA **3685621** (Joule button not appearing). (Medium)

### SAP Concur
- Trust to IAS → trusted domains → user attributes → booster with Concur system; formation status *Ready*; add Concur domain under Security settings; existing formations: *Include Systems*. (High, SAP Help)

### SAP Ariba
- Organisation Admin role; realm data-centre details; Ariba applications for OAuth client ID/secret; SSO via IAS; booster system types Ariba Buyer / Ariba Sourcing. (Medium)

### SAP Analytics Cloud
- Work Zone required (Joule 2506+); IAS authentication; ≥3 free OAuth clients; one SAC tenant per formation; *Read* on Joule privilege; enable **Just Ask** (Conversational Analytics). (High)

### SAP Datasphere
- Role **DW Joule Consumer** (or role with Joule privilege); tenant admin activates Joule; ≥1 free OAuth client; XSUAA subject name identifier matches Datasphere IdP; Datasphere trusted domains in IAS; IPS sync to Work Zone. (High)

### SAP IBP
- System registration with BTP first; business catalog **SAP_CORE_BC_UI_JOU_PC** (User Interface – Joule Plugin) in users' business roles. (High)

### Other LoBs
- Help Portal integration pages exist for Signavio, Fieldglass, Integrated Product Development and others; detailed steps not retrieved. (Verify)

## 6. Extensions

| Topic | Findings | Confidence |
|---|---|---|
| Joule Studio | Requires SAP Build Process Automation **build_default** plan (not *standard*), Joule (standard plan cited), additional IAS tenant; OIDC trust; booster; create role collections (Joule admin + ProcessAutomationAdmin); Discovery Center mission *Setup Joule Studio for a BTP Enterprise Account*; SAP-managed provisioning for Joule Studio also exists. | Medium |
| Document grounding | Document Grounding service (plan **data-manager**) in BTP → service key → pipelines for **SharePoint** (Entra app, **Sites.Selected**), SAP Document Management Service, Google Drive; embeddings in HANA Cloud Vector Engine; CIAS automation available. | Medium |
| Microsoft 365 Copilot / Teams | IAS ↔ Entra ID trust over **OIDC**; register the Joule app in Entra; grant `svc-ai-joule-copilot-api-access` delegated `access_as_user`; add system type *Microsoft 365 Copilot for SAP Joule* to the formation; enable the agent in M365/Teams admin; separate Entra tenant per Joule environment; M365 Copilot licence where Copilot skills are used. | Medium |
| Joule for Consultants | Own subaccount; Joule (foundation) + **SAP Consulting Capability** (standard ga); role collection with `end_user` from `das-application`; admins: BTP GA admin, IAS admin, SAP for Me Cloud/Super Administrator. | High |
| Joule for Developers (ABAP) | Public: catalog SAP_A4C_BC_DEV_AIQ_PC. PCE 2025 (2021+ per newer post): BTP subscription → client certificate → certificate mapping in S/4; auth object S_AIQADTLO; allowlist regional proxy; Note 3558794. | Medium |

## 7. Data protection

- SAP states customer data is not shared with third-party LLM providers to train their models; prompts are processed, not retained, by model providers. Routing is SAP-managed through the generative AI hub in SAP AI Core. Residency and retention must be confirmed in the Joule security guide and SAP Data Protection documentation. (Medium / Verify)

## 8. Source list

SAP Help Portal
- Joule Integration Guide (PDF): https://help.sap.com/doc/de3af3c0f81642dbaa4d36172ed57a72/CLOUD/en-US/79bfc83ab386450c8cd9c7937ce26a3a.pdf
- What is Joule (PDF, 2026-10-20): https://help.sap.com/doc/75f5965fbb514fbcb89f1e47c094ea3f/CLOUD/en-US/9d8c0ef2443b49f993a27de8f38f83af.pdf
- Joule Onboarding Guide: https://help.sap.com/docs/joule/serviceguide/onboarding-joule
- Customer-Managed Provisioning: https://help.sap.com/docs/joule/integrating-joule-with-sap/initial-setup
- Prerequisites for Customer-Managed Provisioning: https://help.sap.com/docs/joule/integrating-joule-with-sap/prerequisites
- Integration with S/4HANA Cloud Public Edition: https://help.sap.com/docs/joule/integrating-joule-with-sap/integration-with-sap-s-4hana-cloud-public-edition
- Integration with S/4HANA Cloud Private Edition: https://help.sap.com/docs/joule/integrating-joule-with-sap/integration-with-sap-s-4hana-cloud-private-edition
- Integrating Joule with SAP Concur: https://help.sap.com/docs/joule/integrating-joule-with-sap/integrating-joule-with-sap-concur
- Integration with SAP Analytics Cloud: https://help.sap.com/docs/joule/integrating-joule-with-sap/integration-with-sap-analytics-cloud
- Integration with SAP Datasphere: https://help.sap.com/docs/joule/integrating-joule-with-sap/integration-with-sap-datasphere
- Integration with SAP IBP: https://help.sap.com/docs/joule/integrating-joule-with-sap/integration-with-sap-integrated-business-planning-for-supply-chain
- Integration with SAP Signavio: https://help.sap.com/docs/joule/integrating-joule-with-sap/integration-with-sap-signavio-process-transformation-suite
- Identity and Access Management for Joule: https://help.sap.com/docs/cloud-identity-services/cloud-identity-services/identity-and-access-management-for-joule
- Onboarding Guide for SAP Joule for Consultants: https://help.sap.com/docs/joule/serviceguide/provisioning-sap-joule-for-consultants
- SAP-Managed Provisioning for Joule Studio: https://help.sap.com/docs/joule-studio/joule-studio/sap-managed-provisioning-for-joule-studio

SAP Learning / Architecture Center
- Setting up Joule across your organizational system landscapes (course): https://learning.sap.com/courses/setting-up-joule-across-your-organizational-system-landscapes
- Introducing Joule – technical prerequisites: https://learning.sap.com/courses/introducing-joule/identifying-technical-prerequisites-and-architecture
- Activating Joule: https://learning.sap.com/courses/introducing-joule/activating-joule_c2c35ec3-8a48-42e0-928d-ec61a3b951c1
- Joule Landscape Recommendation: https://architecture.learning.sap.com/docs/ref-arch/4c80fa
- Extend Joule with Joule Studio: https://architecture.learning.sap.com/docs/ref-arch/ff07b1
- Microsoft Copilot integration with Joule agents: https://architecture.learning.sap.com/docs/ref-arch/a2c0f1

SAP Community (selection)
- Joule end-to-end setup guide for all LoB (unified): https://community.sap.com/t5/technology-blog-posts-by-sap/joule-end-to-end-setup-guide-for-all-line-of-business-unified-approach/ba-p/13964602
- Joule in S/4HANA Cloud Public Edition – setup guide: https://community.sap.com/t5/technology-blog-posts-by-sap/joule-in-sap-s-4hana-cloud-public-edition-setup-guide/ba-p/13965333
- Joule for S/4HANA Cloud Private Edition – comprehensive setup guide: https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/joule-for-sap-s-4hana-cloud-private-edition-a-comprehensive-setup-guide/ba-p/13786453
- Setup and activation guide: Joule in S/4HANA Private Cloud: https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/setup-and-activation-guide-joule-in-sap-s-4hana-private-cloud/ba-p/14325221
- End-to-end guide: Joule in S/4HANA FLP (PCE + on-prem PoC): https://community.sap.com/t5/technology-blog-posts-by-sap/end-to-end-guide-enabling-sap-joule-in-sap-s-4hana-fiori-launchpad-pce/ba-p/14410935
- Joule provisioning with PCE using CIAS: https://community.sap.com/t5/technology-blog-posts-by-sap/joule-provisioning-with-sap-s-4hana-cloud-private-edition-using-cloud/ba-p/14202777
- Multi-system Joule support for PCE: https://community.sap.com/t5/technology-blog-posts-by-sap/multi-system-joule-support-for-sap-s-4hana-cloud-private-edition/ba-p/14404092
- SAP-managed provisioning for Joule: https://community.sap.com/t5/technology-blog-posts-by-members/sap-managed-provisioning-for-joule-less-setup-more-impact/ba-p/14508411
- SAP-managed Joule integration testing (Level 2 / Level 0): https://community.sap.com/t5/technology-blog-posts-by-sap/sap-managed-joule-integration-testing-guide-for-lob-level-2-and-level-0/ba-p/14489750
- Managing Joule on SAP BTP (roles, analytics, admin, troubleshooting): https://community.sap.com/t5/technology-blog-posts-by-sap/managing-joule-on-sap-btp-roles-analytics-administration-and/ba-p/14325933
- Joule Analytics Center: https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/joule-analytics-center-your-go-to-tool-for-tracking-sap-joule-usage/ba-p/14347973
- Global User ID and SAP IAS: https://community.sap.com/t5/technology-blog-posts-by-sap/global-user-id-and-sap-ias-essentials-for-ai-integration-in-sap-landscape/ba-p/14067941
- Setting up a unified Joule instance – considerations: https://community.sap.com/t5/technology-blog-posts-by-sap/setting-up-a-unified-joule-instance-key-considerations-and-common-questions/ba-p/14126614
- SuccessFactors – step-by-step: https://community.sap.com/t5/human-capital-management-blog-posts-by-members/step-by-step-guide-to-setting-up-joule-with-sap-successfactors/ba-p/14074299
- SuccessFactors – common setup issues: https://blogs.sap.com/t5/technology-blogs-by-sap/sap-btp-onboarding-series-joule-with-sfsf-common-setup-issues/ba-p/13650311
- Ariba setup guide: https://community.sap.com/t5/technology-blog-posts-by-sap/joule-integration-with-sap-ariba-setup-guide/ba-p/14240003
- Concur step-by-step: https://community.sap.com/t5/technology-blog-posts-by-sap/activate-joule-in-sap-concur-a-step-by-step-guide/ba-p/14254529
- SAC integration into Joule: https://community.sap.com/t5/technology-blog-posts-by-sap/sap-analytics-cloud-integration-into-joule/ba-p/14298196
- Datasphere step-by-step: https://community.sap.com/t5/technology-blog-posts-by-sap/joule-with-sap-datasphere-step-by-step-setup-guide/ba-p/14418862
- IBP setup guide: https://community.sap.com/t5/technology-blog-posts-by-sap/joule-in-sap-integrated-business-planning-sap-ibp-setup-guide/ba-p/13965780
- Joule Studio enablement guide: https://community.sap.com/t5/tooling-sap-build-blog-posts/joule-studio-enablement-guide/ba-p/14336951
- Setting up Joule Studio (customer flows): https://community.sap.com/t5/technology-blog-posts-by-sap/setting-up-joule-studio-classic-edition-for-all-customer-flows-and/ba-p/14240537
- Document grounding – getting started: https://community.sap.com/t5/technology-blog-posts-by-sap/joule-getting-started-with-document-grounding-setup-guide-1/ba-p/13739501
- Document grounding with CIAS: https://community.sap.com/t5/technology-blog-posts-by-sap/setting-up-document-grounding-with-cloud-integration-automation-service/ba-p/14323963
- IAS and Entra ID for Joule: https://community.sap.com/t5/technology-blog-posts-by-sap/configuring-sap-cloud-identity-services-and-microsoft-entra-id-for-joule/ba-p/14105743
- Enable Copilot/Teams to pass requests to Joule: https://community.sap.com/t5/technology-blog-posts-by-sap/enable-microsoft-copilot-and-teams-to-pass-requests-to-joule/ba-p/14109137
- Joule for Consultants setup: https://community.sap.com/t5/technology-blog-posts-by-sap/getting-started-with-sap-joule-for-consultants-setup-guide/ba-p/14144178
- Joule for Developers, ABAP AI for PCE 2025: https://community.sap.com/t5/technology-blog-posts-by-sap/sap-joule-for-developers-abap-ai-capabilities-for-sap-s-4hana-cloud-private/ba-p/14236954
- Troubleshooting SAP Joule (part 3): https://community.sap.com/t5/technology-blog-posts-by-sap/troubleshooting-sap-joule-a-practical-guide-for-administrators-part3/ba-p/14417201
- SAP Joule common configuration issues: https://community.sap.com/t5/technology-blog-posts-by-sap/sap-joule-common-configuration-issues/ba-p/14353180

Microsoft
- SAP Joule and Microsoft Copilot integration: https://learn.microsoft.com/en-us/azure/sap/microsoft-ai/joule/joule-copilot-overview

SAP Knowledge Base / Notes referenced (open in SAP for Me): 2791410, 3523238, 3558794, 3632703, 3639572, 3641945, 3675105, 3685621, 3721340, 3721491, 3729978.

News and partner sources (context only): theregister.com (May 2026 on-prem AI), siliconangle.com (Oct 2026 Joule agentic work layer), savictech.com, clarity.cx, redresscompliance.com, saplicensingexperts.com.

---

## 9. Version 1.1: peer review of an "enhanced" edition (5 Nov 2026)

A peer-enhanced edition (Antigravity, v1.1 "Enhanced Master Edition") added about
6,900 words to v1.0 and marked all open items "CLOSED / VERIFIED" without citing
sources. Each addition was checked against the research above.

**Adopted** (folded into the runbook; tagged Verify where SAP docs were not seen):
request chain and diagnostic order (1.3); IAS must send groups in the token;
disable SAP ID Service for business-user logon; IPS keyed on Global User ID;
discovered vs registered systems; one formation per system; System Landscape
Administrator; booster retry and generated destinations; Launchpad_User /
Launchpad_Admin in role collections; IAS group mapping over direct assignment;
Joule plugin catalog SAP_CORE_BC_UI_JOU_PC for S/4HANA Cloud; Private Edition
principal propagation (Cloud Connector resources, STRUST, CERTRULE, SU53);
multi-system via central Work Zone; ECC scope caution; SuccessFactors company ID
spelling and third-party cookies; Ariba developer-portal app; SAC data access
control; grounding data hygiene; one Entra app registration per tier; Joule Studio
destination property sap.processautomation.enabled; certificate lifecycle;
12 extra troubleshooting rows; testing diagnostics (decode tokens locally).

**Parked as field notes to confirm** (runbook Appendix E): SKU 8019544 as Joule
Base; J4C 35 AI Units per user per month; grounding 0.005 AI Units per record;
plan `preview`; productive region list and region-dependent grounding; booster
screens, durations, error codes and destination names; CSP domains; Private
Edition plugin component and launchpad parameter; mobile redirect URI; Joule
Studio CLI; Joule for Developers ADT version, S_AIQADTLO values, proxy host and
release floor; SuccessFactors name-dependent bindings.

**Not adopted** (runbook Appendix F, with reasons): 18 GB Cloud Foundry memory
requirement; SAP_COM_0882 "EMPTY vs ROLE mode"; mapping personIdExternal to
userUuid; on-premise 2021+ fully eligible with CPEA; guaranteed EU residency and
"never logged"; always customer-managed from day 1; DNS-record quarantine of
users; pasting tokens into public JWT websites.
