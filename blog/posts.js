/* Blog data shared by the homepage, the Library (blog/) and the reader (blog/post.html).
   Newest first. To add a blog, copy one entry, give it a new slug and edit the text.

   Each blog:  slug (used in the link), title, topic, date, tags, quote (shown on its card),
               dek (standfirst under the title), take (key takeaways), cover (0-5 pattern),
               secs: sections, each { h: heading, b: blocks }.
   Blocks:     { p: 'paragraph' }  { h3: 'sub-heading' }  { q: 'pull quote' }  { ul: ['item', ...] }
               { code: 'source', file: 'name · Language' }  { call: 'Bold lead.', p: 'callout text' }
   Paragraph, quote and list text may contain <strong>, <code> and <span class="gold">. */
(function () {
  var TOPO = '<div class="topo">' +
    '<figure><svg viewBox="0 0 200 120" aria-hidden="true"><circle cx="100" cy="24" r="12" fill="rgba(243,198,140,.2)" stroke="#f3c68c"/><g stroke="rgba(255,255,255,.35)" fill="none"><path d="M100 36 40 88M100 36v52M100 36l60 52"/></g><g fill="#0b0d13" stroke="rgba(255,255,255,.6)"><circle cx="40" cy="96" r="9"/><circle cx="100" cy="96" r="9"/><circle cx="160" cy="96" r="9"/></g></svg><figcaption><b>Supervisor</b>One LLM delegates, checks and decides. Most control, highest latency.</figcaption></figure>' +
    '<figure><svg viewBox="0 0 200 120" aria-hidden="true"><g fill="#0b0d13" stroke="rgba(255,255,255,.6)"><circle cx="22" cy="60" r="9"/><circle cx="178" cy="60" r="9"/></g><rect x="62" y="48" width="30" height="24" rx="6" fill="rgba(243,198,140,.2)" stroke="#f3c68c"/><rect x="112" y="48" width="30" height="24" rx="6" fill="#0b0d13" stroke="rgba(255,255,255,.6)"/><g stroke="rgba(255,255,255,.35)" fill="none"><path d="M31 60h31M92 60h20M142 60h27"/></g></svg><figcaption><b>Router + DAG</b>Classify once, then run a fixed graph. Predictable and cheap.</figcaption></figure>' +
    '<figure><svg viewBox="0 0 200 120" aria-hidden="true"><g stroke="rgba(255,255,255,.35)" fill="none" stroke-dasharray="3 4"><path d="M48 40 100 82 152 40M48 40h104"/></g><g fill="#0b0d13" stroke="rgba(255,255,255,.6)"><circle cx="48" cy="40" r="9"/><circle cx="152" cy="40" r="9"/></g><circle cx="100" cy="86" r="9" fill="rgba(243,198,140,.2)" stroke="#f3c68c"/></svg><figcaption><b>Swarm hand-off</b>Agents pass control directly. Flexible, and the hardest to debug.</figcaption></figure></div>';

  var POSTS = [
    { slug: 'multi-agent-architectures', cover: 0, topic: 'Agents', date: 'Oct 2026', tags: ['LangGraph', 'Multi-agent', 'System design'],
      title: 'Deconstructing multi-agent architectures',
      quote: 'An agent you cannot bound is an agent you cannot ship.',
      dek: 'Supervisors, routers or decentralised swarms? A systems-engineering look at agent coordination in production: token latency budgets, circular deadlock and state checkpointing.',
      take: ['Treat agents as bounded state machines, not free-roaming digital colleagues.', 'A router plus a fixed graph (DAG) beats an open swarm for most enterprise work.', 'Validate structured output at every hand-off and cap retries to stop loops.'],
      secs: [
        { h: 'The illusion of free agency', b: [
          { p: 'When developers first experiment with autonomous agents, the temptation is to assemble an open-ended conversational pool: an Analyst talks to a Researcher, who delegates to a Coder, who asks a Reviewer for approval. In a demo this works. In production it degrades into message loops, runaway token spend and context drift.' },
          { p: 'Reliable generative systems treat agents as <strong>stateful finite state machines</strong> with bounded transitions and hard guardrails.' },
          { q: 'An agent you cannot bound is an agent you cannot <span class="gold">ship.</span>' }] },
        { h: 'Three topologies compared', b: [
          { p: 'Across enterprise deployments, three coordination patterns keep appearing. Each trades latency against control.' },
          { html: TOPO }] },
        { h: 'Why DAGs win most of the time', b: [
          { p: 'For most commercial applications, a hybrid router with a deterministic graph outperforms an open swarm. The state is explicit, so every step can be logged, replayed and tested.' },
          { code: 'from typing import TypedDict, Annotated, Sequence\nimport operator\n\n# Bounded state shared by every node in the graph\nclass AgentSystemState(TypedDict):\n    input_query: str\n    intermediate_steps: Annotated[Sequence[dict], operator.add]\n    evaluation_score: float\n    retry_count: int\n    final_response: str', file: 'state.py · Python' },
          { call: 'Production rule.', p: 'Never let the supervisor read raw tool dumps. Summarise tool output at the boundary node before control returns to the state manager.' }] },
        { h: 'Three fatal failure modes', b: [
          { h3: 'Circular deadlock' },
          { p: 'Agent A rejects Agent B’s output and B regenerates the same payload. Cap the loop with a hard <code>max_depth</code> and lower the temperature on each retry.' },
          { h3: 'Context bleed' },
          { p: 'Every turn bloats the shared prompt. Give each sub-agent its own scratchpad and commit only its final output to the shared state.' },
          { h3: 'Silent hallucinated hand-offs' },
          { ul: ['Require structured JSON at every edge, validated with Pydantic.', 'When validation fails, route straight to a human-in-the-loop queue.'] }] }
      ] },
    { slug: 'graph-rag-hybrid-search', cover: 3, topic: 'RAG', date: 'Oct 2026', tags: ['ColBERT', 'Vectors', 'Knowledge graph'],
      title: 'Beyond naive RAG: Graph-RAG with hybrid search',
      quote: 'Similarity is not the same thing as relevance.',
      dek: 'Vector search finds text that sounds alike. It doesn’t find facts that are connected. A knowledge graph plus hybrid retrieval closes that gap.',
      take: ['Dense vectors alone miss answers that need two or three connected facts.', 'Run keyword, dense and late-interaction retrieval together and fuse the rankings.', 'Use the graph to expand context around good hits, not to replace retrieval.'],
      secs: [
        { h: 'Where naive RAG breaks', b: [
          { p: 'A policy assistant was asked which approvals a contractor needs before getting VPN access. The answer lived in three documents that never mention each other by name. Top-k vector search returned the most similar paragraph and missed the other two.' },
          { p: 'That is the core limit: <strong>embeddings measure resemblance</strong>, and multi-hop questions need relationships.' },
          { q: 'Similarity is not the same thing as <span class="gold">relevance.</span>' }] },
        { h: 'Three retrievers, one ranking', b: [
          { ul: ['<strong>BM25</strong> catches exact terms such as policy IDs and product codes.', '<strong>Dense vectors</strong> catch paraphrases and synonyms.', '<strong>ColBERT</strong> scores token by token, which keeps precision on long passages.'] },
          { p: 'Reciprocal rank fusion merges the three lists without tuning score scales.' },
          { code: 'def rrf(rankings, k=60):\n    scores = {}\n    for ranking in rankings:\n        for rank, doc_id in enumerate(ranking):\n            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)\n    return sorted(scores, key=scores.get, reverse=True)', file: 'fusion.py · Python' }] },
        { h: 'Adding the graph', b: [
          { p: 'Entities and their relations are extracted once at indexing time. At query time the best hits become entry points, and the graph pulls in their one-hop neighbours as extra context.' },
          { call: 'Keep it small.', p: 'Expanding two hops usually floods the prompt. One hop with a relevance cut-off gave the best answers for the least tokens.' }] },
        { h: 'What changed in production', b: [
          { p: 'Multi-hop questions stopped failing silently, and answers started citing every document they relied on. Latency rose slightly, which a small re-ranker cache paid back.' }] }
      ] },
    { slug: 'microstrip-to-genai', cover: 5, topic: 'Career', date: 'Sep 2026', tags: ['Career', 'Telecom', 'Learning'],
      title: 'From microstrip antennas to architecting GenAI',
      quote: 'I didn’t switch fields. I carried signal processing into a new one.',
      dek: 'I spent years designing microstrip antennas. Then I built my first retrieval pipeline, and found the two had more in common than I expected.',
      take: ['Signal-processing intuition transfers directly to embeddings and retrieval.', 'Small shipped projects teach faster than long courses.', 'Domain knowledge is an advantage when you change fields.'],
      secs: [
        { h: 'Where I started', b: [
          { p: 'My early work was radio frequency design: microstrip patches, impedance matching and long nights with a network analyser. It was precise, physical work, and AI felt like a different world.' }] },
        { h: 'The first model I shipped', b: [
          { p: 'The turning point was a small internal tool that searched network incident reports. It was rough, but people used it every day, and that feedback loop hooked me.' },
          { q: 'I didn’t switch fields. I carried signal processing <span class="gold">into a new one.</span>' }] },
        { h: 'What carried over', b: [
          { ul: ['Thinking in vectors and similarity long before I heard the word embedding.', 'Respect for noise, and for measuring before optimising.', 'Comfort with systems where small changes ripple a long way.'] }] },
        { h: 'If you are switching too', b: [
          { p: 'Pick one real problem from your current domain and solve it with AI. You will learn the tools, and you will bring something most AI engineers don’t have: the context.' }] }
      ] },
    { slug: 'llm-as-a-judge', cover: 2, topic: 'Evaluation', date: 'Sep 2026', tags: ['Evals', 'Safety', 'LLM judge'],
      title: 'Production LLM-as-a-judge without the bias',
      quote: 'A judge you haven’t calibrated is just another opinion.',
      dek: 'Automated grading is only useful if you can trust it. Three biases quietly break most LLM judges, and each one has a practical fix.',
      take: ['Swap answer order and average the scores to cancel position bias.', 'Grade against a rubric with length limits to stop rewarding verbosity.', 'Never let a model judge its own outputs without human calibration.'],
      secs: [
        { h: 'Why we needed a judge', b: [
          { p: 'We were shipping prompt changes weekly and couldn’t hand-review thousands of answers. An LLM judge promised fast, cheap evaluation, until we noticed it preferred whichever answer came first.' }] },
        { h: 'Position bias', b: [
          { p: 'Run every comparison twice with the answers swapped. If the verdict flips, record a tie.' },
          { code: 'a_first = judge(question, answer_a, answer_b)\nb_first = judge(question, answer_b, answer_a)\nverdict = a_first if a_first == flip(b_first) else "tie"', file: 'judge.py · Python' }] },
        { h: 'Verbosity and self-preference', b: [
          { p: 'Judges reward longer answers and answers written in their own style. A strict rubric with explicit length guidance fixes the first. Using a different model family as judge reduces the second.' },
          { q: 'A judge you haven’t calibrated is just <span class="gold">another opinion.</span>' },
          { call: 'Calibrate first.', p: 'Have people grade 200 examples, then measure how often the judge agrees before trusting it on the rest.' }] }
      ] },
    { slug: 'microservices-architecture', cover: 4, topic: 'Engineering', date: 'Aug 2026', tags: ['Node.js', 'Docker', 'RabbitMQ'],
      title: 'Understanding microservices architecture',
      quote: 'The queue is where services agree to disagree.',
      dek: 'Splitting a Node.js monolith into services with Docker and RabbitMQ, and what asynchronous messaging changed.',
      take: ['Split along business capabilities, not technical layers.', 'Let services talk through a queue so one slow service can’t stall the rest.', 'Containers make every environment the same, from laptop to production.'],
      secs: [
        { h: 'Why split at all', b: [
          { p: 'The monolith deployed as one unit, so a small change to billing meant redeploying search, carts and accounts. Splitting it let each team ship on its own schedule.' }] },
        { h: 'Services talk through queues', b: [
          { p: 'Instead of calling each other directly, services publish events to RabbitMQ. The order service doesn’t wait for email; it announces the order and moves on.' },
          { code: 'const channel = await connection.createChannel();\nawait channel.assertQueue("order.created");\nchannel.sendToQueue("order.created", Buffer.from(JSON.stringify(order)));', file: 'publish.js · JavaScript' },
          { q: 'The queue is where services agree <span class="gold">to disagree.</span>' }] },
        { h: 'What I would tell my past self', b: [
          { ul: ['Start with two or three services, not twelve.', 'Add tracing on day one; debugging across services is hard without it.', 'Make every message handler safe to run twice.'] }] }
      ] },
    { slug: 'nextjs-for-nxtcart', cover: 1, topic: 'Engineering', date: 'Jul 2026', tags: ['Next.js', 'SEO', 'React'],
      title: 'Why I picked Next.js for Nxtcart',
      quote: 'Server rendering wasn’t a nice-to-have. Search was the product.',
      dek: 'Nxtcart started on Create React App. Moving to Next.js came down to one thing: people finding products through search.',
      take: ['Client-only React pages are slow to index and slow on first load.', 'Server rendering gave every product page real HTML for search engines.', 'File-based routing and image optimisation were welcome extras.'],
      secs: [
        { h: 'The problem with client-only rendering', b: [
          { p: 'With Create React App, every product page arrived as an empty shell until JavaScript ran. Search engines indexed it slowly and shoppers on slow phones stared at a spinner.' }] },
        { h: 'What Next.js changed', b: [
          { ul: ['Product pages render on the server with full HTML and meta tags.', 'Static generation for categories that rarely change.', 'Built-in image optimisation cut page weight noticeably.'] },
          { q: 'Server rendering wasn’t a nice-to-have. <span class="gold">Search was the product.</span>' }] },
        { h: 'Would I choose it again?', b: [
          { p: 'Yes, for anything where discovery matters. For an internal dashboard behind a login, plain React is still simpler.' }] }
      ] }
  ];
  POSTS.forEach(function (p, i) {
    var text = [p.dek, p.take.join(' ')].concat(p.secs.map(function (s) {
      return s.h + ' ' + s.b.map(function (b) { return [b.p, b.q, b.code, b.h3, b.ul && b.ul.join(' ')].filter(Boolean).join(' '); }).join(' ');
    })).join(' ').replace(/<[^>]+>/g, ' ');
    p.min = Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
    p.i = i;
  });
  window.BLOG = {
    posts: POSTS,
    find: function (slug) { for (var i = 0; i < POSTS.length; i++) if (POSTS[i].slug === slug) return POSTS[i]; return null; },
    // base: '' from blog/ pages, 'blog/' from the homepage
    href: function (slug, base) { return (base || '') + 'post.html?p=' + encodeURIComponent(slug); }
  };
})();
