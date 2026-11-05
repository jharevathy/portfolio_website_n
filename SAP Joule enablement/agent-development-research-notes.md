# Joule agents and Joule Studio — research notes

Collected 5 Nov 2026 for `SAP-Joule-Agent-Development-Guide.docx`.
Direct reads of help.sap.com, community.sap.com and learning.sap.com were blocked in the
research session; findings come from search extracts of SAP pages (Help, Learning,
Architecture Center, developers.sap.com, news.sap.com, SAP Community, GitHub SAP-samples)
and selected partner/press sources. Confidence: **High** = SAP source(s) agree ·
**Medium** = single SAP source or SAP Community · **Low / Verify** = partner/press only or conflicting.

## 1. Product landscape and status (Nov 2026)

| Finding | Conf. | Source |
|---|---|---|
| Joule Studio is the SAP Build capability for building Joule skills and Joule agents. Skill builder GA since Jul 2025; agent builder GA announced (SAP Community "Agent builder in Joule Studio is now generally available"). | High | sap.com Joule Studio; SAP Community |
| Agent builder = agents that plan and reason across SAP and non-SAP systems; skill builder = reusable, deterministic operations accessed through Joule. | High | news.sap.com AI Release Highlights Q3 2026 |
| Two build tracks: low-code (browser-based builder) and pro-code (own IDE with Joule Studio CLI and a coding agent over MCP; agents built with SAP Cloud SDK for AI in Python, Java or JS/TS, deployed in customer subaccount, connected to Joule via A2A). Recommendation: start low-code, move to pro-code as needs grow. | High | SAP Architecture Center golden path *Build Low-Code and Pro-Code AI Agents on SAP BTP* |
| Low-code deploy creates Joule artifacts (scenarios, dialog functions) and registers the agent in Joule's catalog automatically; pro-code needs a manually configured Joule scenario (A2A "Bring Your Own Agent"). | High | Same |
| TechEd 2026 (27 Oct, Berlin): Joule Studio runtime (SAP-managed) with security, observability, authorisations; agents appear in SAP AI Agent Hub and Joule Work; governed gateway lets third-party agents call Joule agents via A2A and MCP; n8n workflows for early adopters; 70+ models; new observability/admin controls for behaviour, model usage and spend; free developer certification to 31 Dec 2026; GA phased, new features late Q4 2026. | High | news.sap.com TechEd; SAP TechEd Innovation News Guide; sapinsider |
| Sandbox for validating agent behaviour rolling out; offline evaluations (including prompt-injection resistance) planned late Q4 2026; runtime isolation with configurable policies (NVIDIA-linked safety platform). | Medium / Verify | SAP TechEd Innovation News Guide (preview) |
| Extending SAP standard agents: agent extensions add instructions and context, connect extra MCP servers/tools, and hooks — without modifying the SAP agent. Tutorial: extend the AP Invoice Agent. | High | news.sap.com Q3 2026; developers.sap.com *Use Joule Studio to Extend the AP Invoice Agent using Agent Extensions*; SAP Learning |
| Joule Studio development lifecycle: intent analysis → requirements → technical specification → implementation → testing (generated evals) → deployment; Git-based CI/CD from dev to production; SAP Cloud ALM shows usage, cost, business impact; AI Agent Hub links agents and MCP servers to capabilities/processes with execution traces and decision logs. | Medium | SAP Community *Joule Studio empowers teams…*; *Joule Studio: From Business Intent…* |
| Three trigger modes for Joule agents; system-triggered agents run in background on business events, schedules or system signals; agent builder supports system-triggered agents (events, API triggers, schedules). | High | SAP Learning *Getting to Know Joule Agents*; SAP Community GA post |
| Joule Work: agentic workspace that plans and carries out multi-step tasks across SAP landscapes. | Medium | TechEd coverage |

## 2. Commercials

| Finding | Conf. | Source |
|---|---|---|
| SAP pricing page: standard agents 0.02 AI Units per agent action; advanced agents 0.05 AI Units per agent action; no consumption when an agent is idle. | High | sap.com AI pricing page |
| Premium AI model phased in Q3 2026; agents are the centre of Premium AI. | High | SAP Learning commercial model |
| Custom agent execution on the SAP-managed runtime free through Dec 2026 for select customers; afterwards billed on actual resource consumption (compute, storage, transactions, AI tokens); dev/test tools free under fair use; agent builder becomes a premium AI feature after Dec 2026. | Medium / Verify | TechEd coverage; nageshpolu.com; sapinsider |
| SAP publishes no dollar list price per AI Unit. | High | Multiple |

## 3. Skill builder

| Finding | Conf. | Source |
|---|---|---|
| Skill = single, repetitive operation with predefined inputs/outputs, no reasoning. | High | sap.com Joule Studio |
| Trigger: started by Joule when a request semantically matches the skill **description**; overlapping descriptions cause unpredictable routing. | High | developers.sap.com tutorials; SRB blog |
| Parameters tab: Skill Inputs / Skill Outputs, each with name, description, required flag; Joule prompts for missing required inputs. | High | developers.sap.com |
| Steps include **Call Action** (from a released and published action project), process/automation calls (fire-and-forget: outputs do not return), messages; bind action inputs to skill inputs. | High | developers.sap.com *Consume an Automated Process in a Joule Skill* |
| "Allow Joule to generate a response" toggle on the trigger. Fallback messages configurable. | High | developers.sap.com |
| A skill with a confirmation/status message fails when an **agent** triggers it — remove those messages for agent-used skills. | Medium | SAP CodeJam tutorial |
| Explicit if/else branching inside skills not confirmed. | Verify | — |

## 4. Actions, destinations, automations

| Finding | Conf. | Source |
|---|---|---|
| Action projects in SAP Build lobby → Connectors → Actions → Create; source: live OData destination, OpenAPI upload, or from scratch with a destination; release and publish to library before use. | High | developers.sap.com *Create Action Projects*; SAP Community |
| Destinations used by SAP Build need `sap.processautomation.enabled = true`. | High | SAP Build docs (established) |
| User identity passes through to skill and service calls (principal propagation) when the Joule and service subaccounts trust the same IAS tenant. | Medium | SAP Community *Generative AI Hub: Extending Joule…* |
| Custom skills via RFC for S/4HANA and ECC (Cloud Connector). | Medium | SAP Community *Building Custom Joule Skills via RFC* |
| Discovery Center mission *Build custom Joule skills for SAP and non-SAP systems using Joule Studio* (4643). | High | Discovery Center |

## 5. Agent builder

| Finding | Conf. | Source |
|---|---|---|
| Create from project → Create → Joule Agent; agent editor; **Expertise** (instructions) section; name and description drive activation; tools = Joule skills, other agents (multi-agent), document grounding (AI Core resource groups), MCP servers. | High | developers.sap.com *Create Agent*; CodeJam 6; SAP Community GA post |
| Toggle **Allow Joule to interpret the output of the agent**. | High | developers.sap.com |
| **Test** opens a private test chat; **Timeline** shows how Joule processed the request (tool calls). | High | developers.sap.com |
| Deploy to an environment and make available to authorised users; approval gates mentioned. | Medium / Verify | SAP Community; partner guide |
| Max iterations / preprocessing settings not documented in sources found. | Verify | — |

## 6. Pro-code, A2A and MCP

| Finding | Conf. | Source |
|---|---|---|
| Three Joule ↔ code-agent paths: (1) Joule Code Editor capability as A2A client → agent as A2A server; (2) Agent Builder → SAP Build Process Automation → async REST → agent; (3) A2A client service with streaming → remote A2A agent. | High | SAP Community *Integrating Joule with Code-based Agents: Three Paths Forward* |
| Synchronous BYOA call limit 60 seconds. | Medium | Architecture Center *Integrating AI Agents with Joule (Outbound A2A)* |
| Joule reads the agent card from the well-known endpoint (`/.well-known/agent-card.json` in one sample, `/.well-known/agent.json` in another), then sends messages to the card's URL. Capability YAML with `agent-request` action and `agent_type: remote`, DTA schema ≥ 3.28.0. | Medium / Verify | SAP-samples repos; joule-a2a-agent-toolkit |
| Samples: SAP-samples/btp-joule-a2a-pro-code-agent; codejam-code-based-agents (LangGraph on Cloud Foundry); partner-reference-application-joule-a2a-agent-workshop (CAP); joule-a2a-agent-toolkit. | High | GitHub |
| Custom MCP server for Joule Studio on AI Core: streamable HTTP transport; destination URL must not end in `/mcp`; tool flagged with a Joule-specific property; MCP SDK 1.26+ requires Zod schemas. | Medium | SAP Community *Creating an MCP Server for Joule Studio Using AI Core* |
| SAP can generate MCP servers from its semantic API catalog for LoB capabilities; SAP uses MCP internally for Joule agents. | Medium | Architecture Center *Third-Party MCP Access*; golden path |
| S/4HANA data via Integration Suite MCP gateway, AWS for SAP MCP server, or custom server; ABAP MCP server GA Q2 2026. | Low / Verify | Medium article |

## 7. SAP-delivered agents (examples; availability varies)

| Agent / assistant | Notes | Conf. |
|---|---|---|
| Accounts Receivable Assistant (3 agents) | Prioritises collections, accelerates disputes; agents incl. dispute creation (from e-mails/prompts, duplicate checks), dispute resolution (root cause across invoice, PO, goods receipt, pricing; beta), cash collection | Medium |
| Invoicing Assistant (3 agents) / AP Invoice Agent | AP processing, invoice exceptions; extensible via agent extensions | High |
| Asset and Service Assistant (5 agents) | Maintenance from issue detection to resolution | Medium |
| Financial Closing, Billing, Tax & Compliance, Financial Planning assistants | Announced 2026; staged availability | Low / Verify |
| Accounting accruals agent | Restricted availability; roadmap Q1 2027 | Low / Verify |
| Bid Analysis Agent (SAP Ariba) | Compares bids (cost, freight, lead time, terms) | Medium |
| Supplier Management Assistant / onboarding | Business Network invitations, validation, escalation | Low / Verify |
| SuccessFactors (May 2026): Career & Talent Development, HR Service, People Intelligence, Payroll; earlier Performance & Goals, Learning Assignment agents; HR Operations Assistant (restricted) | | Medium |
| Supply chain assistants (design, network, planning, manufacturing, logistics, asset ops) | Q4 2026 | Low / Verify |
| Case classification → cash collection hand-off | Multi-agent example | Medium |
| Configuration guides on SAP Business Accelerator Hub (e.g. search agent, troubleshooter agent, supplier agent) | | Medium |

## 8. Security and governance

| Finding | Conf. | Source |
|---|---|---|
| Layered guardrails via generative AI hub orchestration: content filtering, data masking (PII masked before the model, unmasked after), prompt-injection detection ("Prompt Shield"), templating. | Medium | SAP Learning *AI Guardrails and Content Safety*; SAP Community |
| Separate LLM reasoning path from data-access path; treat prompts and retrieved documents as untrusted. | Medium | SAP Community *Securing SAP Agentic AI* |
| Agent-to-agent traffic through a gateway enforcing access control. | Medium | TechEd guide |

## 9. Key sources

- SAP Architecture Center: Build Low-Code and Pro-Code AI Agents — https://architecture.learning.sap.com/docs/golden-path/ai-golden-path/build-and-deliver/build-ai-agents
- Agentic AI & AI Agents on SAP Business AI Platform — https://architecture.learning.sap.com/docs/ref-arch/98efa0
- Joule Studio for Enterprise Agentic AI Solutions — https://architecture.learning.sap.com/docs/ref-arch/f5a3ef
- Integrating AI Agents with Joule (Outbound A2A) — https://architecture.learning.sap.com/docs/ref-arch/ae6821
- A2A and MCP for AI Agent Interoperability at SAP — https://architecture.learning.sap.com/docs/ref-arch/76ec36
- Third-Party MCP Access to SAP Solutions — https://architecture.learning.sap.com/docs/ref-arch/137800
- Extend Joule with Joule Studio — https://architecture.learning.sap.com/docs/ref-arch/06ff6062dc/3
- AI Release Highlights Q3 2026 — https://news.sap.com/2026/10/ai-release-highlights-q3-2026/
- SAP TechEd 2026 developers news — https://news.sap.com/2026/10/sap-teched-ai-developers-build-what-matters-autonomous-execution/
- SAP TechEd Innovation News Guide 2026 — https://www.sap.com/topics/events/teched/innovation-news-guide-2026
- SAP AI pricing — https://www.sap.com/products/artificial-intelligence/pricing.html
- Joule Agents and Assistants — https://www.sap.com/products/artificial-intelligence/ai-agents.html
- Agent builder GA (SAP Community) — https://community.sap.com/t5/artificial-intelligence-blogs-posts/agent-builder-in-joule-studio-is-now-generally-available-build-your-own/ba-p/14289282
- Integrating Joule with code-based agents: three paths — https://community.sap.com/t5/technology-blog-posts-by-sap/integrating-joule-with-code-based-agents-three-paths-forward/ba-p/14370520
- Creating an MCP server for Joule Studio using AI Core — https://community.sap.com/t5/technology-blog-posts-by-sap/from-prompt-to-production-creating-an-mcp-server-for-joule-studio-using-ai/ba-p/14338394
- Joule Studio empowers teams to build trusted agentic solutions — https://community.sap.com/t5/technology-blog-posts-by-sap/joule-studio-empowers-teams-to-build-trusted-custom-agentic-solutions/ba-p/14493943
- Securing SAP Agentic AI — https://community.sap.com/t5/technology-blog-posts-by-sap/securing-sap-agentic-ai-for-the-autonomous-enterpr/ba-p/14349147
- developers.sap.com: Create Action Projects — https://developers.sap.com/tutorials/joulestudio-skill-action-create..html
- developers.sap.com: Create Skill to Create / Update Shipment — https://developers.sap.com/tutorials/joule-studio-codejam-5-skill-create/
- developers.sap.com: Create Agent to Coordinate Skills — https://developers.sap.com/tutorials/joule-studio-codejam-6-agent
- developers.sap.com: Consume an Automated Process in a Joule Skill — https://developers.sap.com/tutorials/joulestudio-skill-process/
- developers.sap.com: Extend the AP Invoice Agent — https://developers.sap.com/tutorials/joule-studio-agent-extension/
- GitHub SAP-samples: btp-joule-a2a-pro-code-agent — https://github.com/SAP-samples/btp-joule-a2a-pro-code-agent
- GitHub SAP-samples: codejam-code-based-agents — https://github.com/SAP-samples/codejam-code-based-agents
- GitHub: joule-a2a-agent-toolkit — https://github.com/sap-samples/joule-a2a-agent-toolkit
- SAP Learning: Getting to Know Joule Agents — https://learning.sap.com/courses/introducing-joule/getting-to-know-joule-agents_f9d18ca0-1021-4c1a-a044-4c00ec8c2898
- SAP Learning: Extending a Standard Agent Using Joule Studio — https://learning.sap.com/courses/introducing-joule-studio/extending-a-standard-agent-using-joule-studio_fa8fe90b-a044-48e2-aed8-5c52df401f35
