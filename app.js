/* 9 Square Infra – Estimates / Quotations / Agreements (Supabase) */
(function () {
  "use strict";

  const SUPABASE_URL = "https://lfldgnjzxhsgrwxdpqwj.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_oRZqbx-1x7Md6lWuMADLOQ_18UBRJcb";
  const DRAFT_KEY = "9sq-offline-draft-v1";
  const STATUSES = ["draft", "pending_approval", "changes_requested", "approved", "sent", "accepted", "rejected"];
  const STATUS_LABEL = {
    draft: "Draft",
    pending_approval: "Pending approval",
    changes_requested: "Changes requested",
    approved: "Approved",
    sent: "Sent",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  const GOLD = "#c9a054";
  const TEAL = "#14b8a6";
  const TYPES = ["Construction", "Interiors", "Renovation", "Real Estate"];
  const TIERS = ["Budget", "Factory / Modular", "Manual (carpenter)", "Premium"];
  const WORK_CATS = ["-", "Material", "Labour", "Contract"];


  const RE_CATS = ["-", "Property/Plot Cost", "Registration & Stamp Duty", "Brokerage/Commission", "Legal & Documentation", "Development/Amenities", "Other"];
  const catsFor = (t) => (t === "Real Estate" ? RE_CATS : WORK_CATS);

  const TIER_RATES = {
    Budget: { frame: 650, box: 650, kit: 680, src: "₹650–680/sft (Interiors.xlsx, Yavanik)" },
    "Factory / Modular": { frame: 730, box: 730, kit: 830, src: "₹730/sft, kitchen base ₹830 (Sivaji, Sai Krishna, Factory, Temple Bell Modular)" },
    "Manual (carpenter)": { frame: 980, box: 980, kit: 1080, src: "₹980/sft, kitchen base ₹1,080–1,150 (Quotation Manual, Temple Bell Manual)" },
    Premium: { frame: 1180, box: 1480, kit: 1680, src: "Frame ₹1,180, Box ₹1,380–1,480, Kitchen ₹1,680 (Krishna Allampuram, Mavayya Thota)" },
  };

  const I = (s, d, sp, u, q, r, f = "") => ({ s, d, sp, u, q, r, k: "Material", f });

  function interiorItems(t) {
    const R = TIER_RATES[t];
    const rr = (f) => (f === "frame" ? R.frame : f === "box" ? R.box : R.kit);
    const C = "CUPBOARD WORK";
    return [
      I(C, "Master Bedroom Wardrobe (Frame)", "", "SFT", 108, rr("frame"), "frame"),
      I(C, "Dressing (Box)", "", "SFT", 30, rr("box"), "box"),
      I(C, "Children Bedroom Wardrobe (Frame)", "", "SFT", 108, rr("frame"), "frame"),
      I(C, "Hall TV Unit (Box)", "", "SFT", 81, rr("box"), "box"),
      I(C, "Dining Crockery (Box)", "", "SFT", 41, rr("box"), "box"),
      I(C, "Puja Unit (Box)", "", "SFT", 32, rr("box"), "box"),
      I(C, "Kitchen Base (Box)", "", "SFT", 41, rr("kit"), "kit"),
      I(C, "Kitchen Loft (Box)", "", "SFT", 74, rr("box"), "box"),
      I("ACCESSORIES", "Sliding Track", "", "Nos", 2, 8000),
      I("ACCESSORIES", "Tandem Baskets", "", "Nos", 4, 4500),
      I("OTHER WORKS", "POP Ceiling", "12mm Sheet, 0.8mm Channel", "SFT", 1706, 40),
      I("OTHER WORKS", "PVC Ceiling (Balcony, Toilets & Corridor)", "VOX / Pare", "SFT", 104, 180),
      I("OTHER WORKS", "Painting", "Asian Premium Shine", "LS", 1, 55000),
    ];
  }

  const TEMPLATES = {
    Construction: [
      I("FLOORS", "Ground Floor", "", "SFT", 1350, 2000),
      I("FLOORS", "First Floor", "", "SFT", 1350, 2000),
      I("OTHERS", "Compound Wall", "", "LS", 1, 300000),
    ],
    Renovation: [
      I("CIVIL & DISMANTLING WORK", "Civil & Dismantling work", "-", "LS", 1, 250000),
      I("CIVIL & DISMANTLING WORK", "Doors", "WPC Frames @ Flush Doors, Main Door Teak", "Nos", 14, 15700),
      I("CIVIL & DISMANTLING WORK", "Windows with Safety Grills & Mosquito mesh", "UPVC 90 Series Windows with Iron Safety Grill", "Nos", 8, 0),
      I("TILES & GRANITE WORK", "Tiles (2x4 Johnson / Kajaria)", "Flooring, Toilets, Corridors, Kitchen wall", "SFT", 2930, 135),
      I("TILES & GRANITE WORK", "Granite (Z-Black, Galaxy)", "Kitchen Platform", "SFT", 125, 480),
      I("ELECTRICAL, PLUMBING & SANITARY WORK", "Total Flat", "Wiring, Switch Boards, Lighting, Taps, Wash basins, Commodes, Pipelining", "LS", 1, 340000),
      I("CUPBOARD WORK", "3-Bedroom Wardrobes", "-", "SFT", 1050, 980),
    ],
    "Real Estate": [
      { ...I("PROPERTY", "Plot / land value (example)", "", "Sq.Yd", 200, 25000), k: "Property/Plot Cost" },
      { ...I("PROPERTY", "Built-up construction value (example)", "", "SFT", 1800, 2000), k: "Property/Plot Cost" },
      { ...I("REGISTRATION", "Stamp duty & registration (example ~7.5%)", "", "LS", 1, 645000), k: "Registration & Stamp Duty" },
      { ...I("SERVICES", "Brokerage / commission (example 2%)", "", "LS", 1, 172000), k: "Brokerage/Commission" },
      { ...I("SERVICES", "Legal verification, EC & documentation (example)", "", "LS", 1, 25000), k: "Legal & Documentation" },
      { ...I("DEVELOPMENT", "Layout development, roads, drainage & amenities (example)", "", "LS", 1, 100000), k: "Development/Amenities" },
    ],
  };
  const itemsFor = (t, tier) => (t === "Interiors" ? interiorItems(tier) : TEMPLATES[t].map((i) => ({ ...i })));

  const CIVIL_COVER = `External walls 9" thickness, internal walls 4.5" thickness
53 grade cement will be used for civil work @ KCP, Ultratech
Slab thickness 5" @ M20 mix
Water tank & septic tank @ RCC
Steel @ Vizag Steel
Columns, Beams, Piles, Plinth beam as per structural design
Bricks 1st quality will be used
Sand @ Godavari
Metal @ Gowripatnam
Elevation work owner choice
Bathroom tiles will be provided @ (Johnson / Kajaria)
Granite work for kitchen platform @ (Z-Black / Galaxy)
Emulsion painting two coats @ Asian Paints (Premium Shyne – inner, Ultima Protek – outer)
Windows @ UPVC with mosquito mesh with safety grills
Electrical wiring @ Finolex
Switch boards & metal boxes @ Gold Medal / Legrand
Plumbing pipes @ Ashirvad & Sanitary pipes @ Prince
Electrical pipes @ Sudhakar
Lights @ Havells / Sturlite
Taps @ Jaquar
Main door frame @ Teak, other doors @ WPC frames
Main door – Teak door, other doors – Flush doors
Bathroom @ PVC door
Sanitary work with commode or Indian @ Cera
Stair railing, gate @ MS (or) SS will be provided`;
  const CIVIL_NOTES = `In case of any delay in payment, work will be delayed.
Plan approval is not included in this estimation.
Cupboard work is not included in this estimation.
ACs, fans, furniture and other decorative items are not included in this estimation.
Service wire connection is not included in this estimation.
In case of any extra changes in plan or material, the amount will change.`;
  const INT_SPECS = `Plywood: HDHMR Action Tesa 18mm
Laminate: Inner 0.8mm
Laminate: Outer 1.0mm up to Rs. 3000/- only
Hardware: Ebco / Hafele
POP: 12mm Sheet, 0.8mm Channel
PVC: Pare / VOX`;
  const INT_TERMS = `Order once taken cannot be cancelled.
Design once finalized cannot be changed/modified.
Material once booked/purchased cannot be cancelled/returned.
Any additional change in the requirement would be undertaken with a revised quotation.
This quote is valid for 30 days, after which prices are subject to change based on current market rates.
If payment by client is not made as per the agreed schedule, final handover of work may get delayed.
After execution is completed, SFT may change (+ or -) 10% to 20%, and the amount will change accordingly.`;
  const INT_SIDE = `Up to 2 feet depth will be provided in boxing work
Lights & decorative items are not provided`;

  const A_SCOPE = {
    Construction: `Complete Structure: Execution of the building as per the sanctioned architectural drawings.
Compound Wall & Main Gate: Complete perimeter compound wall with gate fabrication (MS/SS).
Borewell: Borewell drilling, piping, and pump provisions.
Exterior Elevation: Modern exterior architectural elevation as per Owner's approved design.
Parapet Wall & Headroom: Roof parapet wall and RCC staircase headroom slab.
RCC Storage Tanks: Monolithic RCC underground septic tank and overhead RCC water tank.`,
    Interiors: `Interior Work: Design, manufacture and installation of all items listed in the attached quotation.
Ceiling & Finishes: POP / PVC ceiling and painting where listed in the quotation.
Site Coordination: Measurement, design approval, delivery, installation and handover.`,
    Renovation: `Civil & Dismantling: Dismantling, debris removal and civil changes as listed in the quotation.
Tiles, Granite, Doors & Windows: Supply and fixing as listed in the quotation.
Electrical, Plumbing & Sanitary: Complete rework for the flat as listed in the quotation.
Cupboard Work: Wardrobes and other woodwork as listed in the quotation.`,
    "Real Estate": `Property: Transfer / development of the property described above.
Documentation: Agreement of sale, registration and handover support.`,
  };
  const A_SPECS = {
    Construction: `A. Structural & Civil Works
Wall Thickness: External walls 9" thickness | Internal partition walls 4.5" thickness
Cement: 53 Grade OPC/PPC (KCP / UltraTech) for all structural and masonry works
Reinforcement Steel: Simhadri / Vizag TMT Fe 550 Grade primary reinforcement bars
Concrete Design: M20 design mix for all structural columns, beams, piles, and 5" thick slabs
Masonry & Aggregates: 1st-Class red clay bricks, Godavari river sand, and Gowripatnam coarse aggregates
B. Plumbing & Sanitary
Concealed Water Lines: Ashirvad CPVC / UPVC high-pressure plumbing pipes
Drainage / SWR Lines: Prince heavy-duty SWR drainage pipes
Sanitary Ware: Cera European Water Closets (EWC) / Indian Water Closets (IWC) & washbasins
Taps & CP Fittings: Jaquar quarter-turn / single-lever brass chrome-plated fixtures
C. Electrical & Lighting
Wiring & Conduits: Finolex / Apar multi-strand flame-retardant copper wires with Sudhakar PVC conduits
Switches & Boxes: Goldmedal / Legrand modular switches, designer cover plates & heavy metal boxes
Lighting Fixtures: Havells / Sturlite LED concealed spotlights and panel fixtures
D. Doors, Windows & Safety
Main Door: Teakwood frame with heavy Teakwood main shutter and brass/SS fittings
Internal Doors: WPC waterproof frames with factory-pressed flush door shutters
Bathroom Doors: Water-resistant rigid PVC/FRP single-panel doors
Windows: UPVC sliding windows with integrated mosquito mesh and MS safety grills
Fabrication & Railing: MS/SS designer staircase railing and MS safety grills for corridors/balconies
E. Flooring, Tiling & Kitchen
Bathroom Tiles: Johnson / Kajaria anti-skid ceramic floor & wall tiles up to lintel height (7')
Kitchen Countertop: Z-Black or Galaxy Black polished granite platform with SS sink and ceramic dado
F. Painting & Surface Care
Interior Walls: Wall putty / POP smooth finish followed by 2 coats of Asian Paints Premium Shyne
Exterior Finish: Exterior weather primer with 2 coats of Asian Paints Ultima Protek anti-fungal paint`,
    Interiors: `A. Woodwork Materials
${INT_SPECS}`,
    Renovation: `A. Woodwork Materials
${INT_SPECS}
B. Civil Materials
Tiles: 2x4 Johnson / Kajaria
Granite: Z-Black / Galaxy
Doors & Windows: WPC frames with flush doors, Teak main door, UPVC 90 series windows with iron safety grills`,
    "Real Estate": `A. Property Details
Title: As per documents furnished by the Owner
Approvals: As per sanctioned plan`,
  };
  const A_EXCL = {
    Construction: `Municipal plan sanctions, building license fees, town planning approvals, and official liaison expenses.
Interior woodwork, modular kitchen cabinets, wardrobes and TV wall units.
Electrical appliances (Air Conditioners, ceiling fans, decorative chandeliers, water geysers) and loose furniture.
APCPDCL electricity meter security deposits, transformer connection fees, and state municipal water/drainage tap connection charges.`,
    Interiors: `Lights & decorative items.
Electrical appliances, loose furniture and soft furnishings.
Civil, electrical and plumbing changes not listed in the quotation.`,
    Renovation: `Lights & decorative items.
Electrical appliances and loose furniture.
Hidden structural damages found after dismantling (billed separately on approval).`,
    "Real Estate": `Stamp duty, registration fees and bank loan charges payable by the buyer.`,
  };
  const A_CHANGES = `Prior Written Authorization: Any deviation from the sanctioned plan, elevation redesign, or material brand upgrade requested by the Owner must be mutually documented and approved before execution.
Billing of Variations: All extra items (additional electrical points, extra civil/masonry work, premium material upgrades beyond specification) will be billed separately at actual prevailing labour and material rates over and above the base contract sum of {TOTAL}.
Settlement of Extras: Invoices for approved extra works must be cleared alongside the immediate subsequent milestone disbursement.
Handover & Timeline Impact: Delays caused by plan modifications, custom material selections, or late design approvals by the Owner will proportionally extend the estimated project handover date.`;
  const A_GENERAL = {
    Construction: `Payment Discipline: Work progress is strictly coupled to milestone payments. In the event of a disbursement delay exceeding 7 days from stage completion, construction activity will be temporarily halted.
Site Possession & Key Handover: Physical handover and keys will be released strictly upon 100% full and final settlement of all milestone payments and approved variation invoices.`,
    Interiors: INT_TERMS.split("\n").map((x, i) => `${["Cancellation", "Design Freeze", "Material Booking", "Revisions", "Validity", "Payment Discipline", "Measurement Variation"][i]}: ${x}`).join("\n"),
    Renovation: INT_TERMS.split("\n").map((x, i) => `${["Cancellation", "Design Freeze", "Material Booking", "Revisions", "Validity", "Payment Discipline", "Measurement Variation"][i]}: ${x}`).join("\n"),
    "Real Estate": `Payment Discipline: Payments shall be made as per the schedule below.
Handover: Possession will be given upon full and final settlement.`,
  };
  const MILES = {
    Construction: `Advance payment upon signing this agreement | 21
Prior to casting Ground Floor (1st) RCC Slab | 15
Prior to casting First Floor (2nd) RCC Slab | 19
Upon completion of complete Brickwork Masonry | 15
Upon completion of Plastering, POP, and Wall Care (Interior & Exterior) | 15
Upon completion of Flooring Tiles, Plumbing lines, Sanitary fittings & 50% Electrical | 13
Final Handover & key delivery (Final Settlement) | 2`,
    Interiors: `Advance on order confirmation & design approval | 50
On material delivery & carcass installation | 40
Final handover | 10`,
    Renovation: `Advance on order confirmation | 40
On completion of civil, tiles & electrical work | 40
Final handover | 20`,
    "Real Estate": `Token advance | 10
On agreement of sale | 40
On registration | 50`,
  };
  const PTITLE = { Construction: "Residential Building (G+1)", Interiors: "Interior Work", Renovation: "Interior & Renovation Work", "Real Estate": "Property" };

  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (s) => { const p = String(s || "").split("-"); return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : s; };
  const inr = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");
  const rs = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN") + "/-";
  const numIN = (n) => (n || 0).toLocaleString("en-IN");
  const esc = (x) => String(x ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
  const num = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

  function words(n) {
    n = Math.round(n || 0);
    if (n === 0) return "Zero";
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const two = (x) => (x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? "-" + a[x % 10] : ""));
    const three = (x) => (x >= 100 ? a[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + two(x % 100) : "") : two(x));
    const parts = [];
    const cr = Math.floor(n / 1e7), lk = Math.floor((n % 1e7) / 1e5), th = Math.floor((n % 1e5) / 1e3), rest = n % 1000;
    if (cr) parts.push(three(cr) + " Crore");
    if (lk) parts.push(two(lk) + (lk === 1 ? " Lakh" : " Lakhs"));
    if (th) parts.push(two(th) + " Thousand");
    if (rest) parts.push(three(rest));
    return parts.join(" ");
  }

  function newDoc(t, n) {
    const tier = "Factory / Modular";
    const intr = t === "Interiors" || t === "Renovation";
    return {
      id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 7),
      type: t, status: "draft", tier, clientPhone: "", managerComment: "", dbType: "estimate", preparedBy: "", preparedByName: "",
      client: "", siteName: "", site: "", plot: "", ptitle: PTITLE[t],
      projDetails: t === "Construction" ? "Construction of Ground Floor + First Floor building as per plan." : t === "Real Estate" ? "Property transaction as per details below." : "",
      scope: t === "Construction" ? "Ground Floor: \nFirst Floor: \nCompound wall, Bore Well, Elevation, Parapet Wall, RCC Water Tank, Staircase Room Slab included." : "",
      items: itemsFor(t, tier), cont: 0, oh: 0, gst: 0, finalAmt: 0,
      qno: `9SQ/${new Date().getFullYear()}/${String(n).padStart(3, "0")}`, qdate: today(),
      specs: intr ? INT_SPECS : CIVIL_COVER, notes: intr ? INT_TERMS : CIVIL_NOTES, side: intr ? INT_SIDE : "",
      agrDate: today(), aScope: A_SCOPE[t], aSpecs: A_SPECS[t], aExcl: A_EXCL[t], aChanges: A_CHANGES, aGeneral: A_GENERAL[t], miles: MILES[t], updated: today(),
    };
  }

  function calc(d) {
    const sub = d.items.reduce((s, i) => s + (Number(i.q) || 0) * (Number(i.r) || 0), 0);
    const mat = d.items.filter((i) => i.k === "Material").reduce((s, i) => s + i.q * i.r, 0);
    const cont = sub * (d.cont || 0) / 100;
    const oh = (sub + cont) * (d.oh || 0) / 100;
    const taxable = sub + cont + oh;
    const gst = taxable * (d.gst || 0) / 100;
    const computed = taxable + gst;
    const total = d.finalAmt > 0 ? d.finalAmt : computed;
    const sft = d.items.filter((i) => String(i.u).toUpperCase() === "SFT").reduce((s, i) => s + (Number(i.q) || 0), 0);
    return { sub, mat, lab: sub - mat, cont, oh, taxable, gst, computed, total, sft };
  }

  function milestones(d, total) {
    const rows = lines(d.miles).map((x) => { const [desc, p] = x.split("|"); return { desc: (desc || "").trim(), pct: parseFloat(p || "0") || 0 }; });
    let used = 0;
    return rows.map((r, i) => {
      const amt = i === rows.length - 1 ? total - used : Math.round(total * r.pct / 100 / 1000) * 1000;
      used += amt;
      return { ...r, amt };
    });
  }


  function field(label, html) {
    return `<div class="field"><label>${esc(label)}</label>${html}</div>`;
  }
  function input(label, value, attrs) {
    return field(label, `<input data-bind="${attrs.bind}" ${attrs.type ? `type="${attrs.type}"` : ""} value="${esc(value)}" ${attrs.extra || ""} />`);
  }
  function select(label, value, options, bind) {
    return field(label, `<select data-bind="${bind}">${options.map((o) => `<option value="${esc(o)}"${o === value ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`);
  }
  function textarea(label, value, bind, h) {
    return field(label, `<textarea data-bind="${bind}" style="${h ? `min-height:${h}px` : ""}">${esc(value)}</textarea>`);
  }
  function btn(label, action, cls = "") {
    return `<button type="button" class="btn ${cls}" data-action="${action}">${esc(label)}</button>`;
  }

  function letterheadHtml(s) {
    return `<div>
      <div class="lh-top">
        <div class="lh-brand">
          <img src="assets/logo.png" alt="9 Square Infra" />
          <div><div class="lh-logo">${esc(s.logo)}</div><div class="lh-tag">${esc(s.tagline)}</div></div>
        </div>
        <div class="lh-right">${esc(s.engineer)}${s.qual ? ", " + esc(s.qual) : ""}<br/>${esc(s.role)}<br/>${esc(s.phone)}</div>
      </div>
      <div class="lh-addr">Address: ${esc(s.name)}, ${esc(s.address)}.${s.branch ? " Branch: " + esc(s.branch) + "." : ""}${s.email ? " · " + esc(s.email) : ""}${s.gstin ? " · GSTIN: " + esc(s.gstin) : ""}</div>
    </div>`;
  }

  function extraRowsHtml(d, c, cols) {
    let h = "";
    const row = (l, v) => { h += `<tr><td class="tot" colspan="${cols - 1}">${esc(l)}</td><td class="tot">${rs(v)}</td></tr>`; };
    if (d.cont > 0) row(`Contingency (${d.cont}%)`, c.cont);
    if (d.oh > 0) row(`Overhead & profit (${d.oh}%)`, c.oh);
    if (d.gst > 0) row(`GST ${d.gst}% (CGST ${d.gst / 2}% + SGST ${d.gst / 2}%)`, c.gst);
    if (d.finalAmt > 0) row("Grand Total (final)", d.finalAmt);
    return h;
  }

  function sections(items) {
    const out = [];
    items.forEach((i) => { const last = out[out.length - 1]; if (last && last.s === i.s) last.items.push(i); else out.push({ s: i.s, items: [i] }); });
    return out;
  }

  function civilQuoteHtml(d, s, c) {
    return `<div class="pb">
      <div class="ph1">QUOTATION</div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;font-size:12px;color:#444"><span>Ref: ${esc(d.qno)}</span><span>Date: ${fmtDate(d.qdate)}</span></div>
      ${d.client ? `<div style="margin-top:6px"><b>To:</b> ${esc(d.client)}${d.site ? ", " + esc(d.site) : ""}</div>` : ""}
      <div class="ph3">Project Details:</div>
      <div>${esc(d.projDetails)}${d.plot ? " Site area " + esc(d.plot) + "." : ""}</div>
      <div style="margin-top:4px"><b>Project Type :</b> ${esc(d.ptitle)}</div>
      ${d.scope.trim() ? `<div><div class="ph3">Scope of work :</div>${lines(d.scope).map((x) => `<div>${esc(x)}</div>`).join("")}</div>` : ""}
      <div style="margin-top:6px"><b>Total Built-up Area:</b> ${numIN(c.sft)} Sft</div>
      <table class="ptbl"><thead><tr><th>Description</th><th>Area (Sq. Ft.)</th><th>Rate (₹/Sq. Ft.)</th><th>Amount (₹)</th></tr></thead>
      <tbody>
        ${d.items.map((i) => `<tr><td>${esc(i.d)}${i.sp ? " – " + esc(i.sp) : ""}</td><td class="r">${String(i.u).toUpperCase() === "SFT" ? numIN(i.q) : "-"}</td><td class="r">${String(i.u).toUpperCase() === "SFT" ? numIN(i.r) : "-"}</td><td class="r">${rs(i.q * i.r)}</td></tr>`).join("")}
        <tr><td class="tot" colspan="3">Total</td><td class="tot">${rs(c.sub)}</td></tr>
        ${extraRowsHtml(d, c, 4)}
      </tbody></table>
      <div style="font-weight:700;font-size:14px">Grand Total : ${rs(c.total)}</div>
      <div style="font-size:12px;color:#444">(Rupees ${words(c.total)} Only)</div>
      <div class="ph3">Which Covers Following Items.</div>
      <ul style="margin:4px 0;padding-left:20px">${lines(d.specs).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="ph3">Note:</div>
      <ul style="margin:4px 0;padding-left:20px">${lines(d.notes).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="sig-row"><div>Client Signature<br/><br/>______________________</div><div style="text-align:right">For ${esc(s.name)}<br/><br/>______________________<br/>${esc(s.engineer)}</div></div>
      <div style="margin-top:18px;font-size:12px"><b>Office Address :</b> ${esc(s.address)}.</div>
    </div>`;
  }

  function intQuoteHtml(d, s, c) {
    return `<div class="pb">
      <div class="ph1">QUOTATION / AGREEMENT</div>
      <table class="ptbl"><tbody>
        <tr><td style="font-weight:700;width:22%">Customer Name:</td><td>${esc(d.client)}</td><td style="font-weight:700;width:12%">Date:</td><td>${fmtDate(d.qdate)}</td></tr>
        <tr><td style="font-weight:700">Project/Site Name:</td><td colspan="3">${esc(d.siteName)}</td></tr>
        <tr><td style="font-weight:700">Project/Site Location:</td><td colspan="3">${esc(d.site)}</td></tr>
        <tr><td colspan="2"><b>${esc(s.engineer.replace(/^Er\.\s*/, "").toUpperCase())} (${esc(s.role.toUpperCase())})</b> · PH: ${esc(s.phone)}</td><td colspan="2">${esc(s.address)}${s.branch ? " · Branch: " + esc(s.branch) : ""}</td></tr>
      </tbody></table>
      <div style="margin:8px 0">This is with reference to Proposed ${esc(d.ptitle)} for your Flat. Please do find the following Scope of Work and Specifications for the same for your perusal and approval to move ahead. This is the approximate estimation of SFT.</div>
      <div class="ph3" style="text-align:center">WORK DETAILS</div>
      <table class="ptbl"><thead><tr><th>S.No</th><th>Item Description / Requirements</th><th>Specifications / Material Type</th><th>Units</th><th>Price per Unit</th><th>Amount (Rs)</th></tr></thead>
      <tbody>
        ${sections(d.items).map((g) => `<tr><td class="sec" colspan="6">${esc(g.s)}</td></tr>` + g.items.map((i, n) => `<tr><td>${n + 1}</td><td>${esc(i.d)}</td><td>${esc(i.sp || "-")}</td><td class="r">${i.u === "LS" ? "-" : numIN(i.q) + " " + esc(i.u)}</td><td class="r">${i.u === "LS" ? "-" : numIN(i.r)}</td><td class="r">${rs(i.q * i.r)}</td></tr>`).join("")).join("")}
        <tr><td class="tot" colspan="3">Total</td><td class="tot">SFT = ${numIN(c.sft)}</td><td class="tot"></td><td class="tot">${rs(c.sub)}</td></tr>
        ${extraRowsHtml(d, c, 6)}
      </tbody></table>
      <div style="font-weight:700">Total: ${rs(c.total)} <span style="font-weight:400;font-size:12px">(Rupees ${words(c.total)} Only)</span></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px">
        <div style="flex:1 1 260px">
          <div class="ph3">Material Specifications</div>
          <table class="ptbl"><tbody>${lines(d.specs).map((x) => { const [k, ...v] = x.split(":"); return `<tr><td style="font-weight:600">${esc(k)}</td><td>${esc(v.join(":").trim())}</td></tr>`; }).join("")}</tbody></table>
        </div>
        ${d.side.trim() ? `<div style="flex:1 1 200px"><div class="ph3">Notes</div>${lines(d.side).map((x) => `<div>• ${esc(x)}</div>`).join("")}</div>` : ""}
      </div>
      <div class="ph3" style="text-align:center">IMPORTANT TERMS & CONDITIONS</div>
      <table class="ptbl"><tbody>${lines(d.notes).map((x, i) => `<tr><td style="width:28px">${i + 1}</td><td>${esc(x)}</td></tr>`).join("")}</tbody></table>
      <div class="sig-row"><div>______________________<br/>Client Signature<br/>${esc(s.city)}<br/>Date:</div><div style="text-align:right">______________________<br/>Authorized Signature<br/>${esc(s.name)}</div></div>
    </div>`;
  }

  function specBlock(s) {
    return lines(s).map((x) => {
      if (/^[A-Z]\.\s/.test(x)) return `<div class="ph3">${esc(x)}</div>`;
      const k = x.indexOf(":");
      return `<div style="margin:2px 0 2px 12px">• ${k > 0 ? `<b>${esc(x.slice(0, k))}:</b>${esc(x.slice(k + 1))}` : esc(x)}</div>`;
    }).join("");
  }

  function dayPhrase(agrDate) {
    const dd = new Date(agrDate);
    if (isNaN(dd.getTime())) return agrDate;
    const n = dd.getDate();
    const sfx = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
    return `${String(n).padStart(2, "0")}${sfx} day of ${dd.toLocaleString("en-IN", { month: "long" })}, ${dd.getFullYear()}`;
  }

  function agreementHtml(d, s, c) {
    const ms = milestones(d, c.total);
    const yr = String(d.agrDate || "").slice(0, 4);
    const floorRows = d.items.filter((i) => String(i.u).toUpperCase() === "SFT");
    const title = d.type === "Construction" ? "CONSTRUCTION AGREEMENT" : d.type === "Real Estate" ? "PROPERTY AGREEMENT" : "INTERIOR WORK AGREEMENT";
    const fill = (str) => str.replace(/\{TOTAL\}/g, rs(c.total));
    return `<div class="pb">
      <div class="ph1">${title}</div>
      <div style="text-align:center;font-weight:600;color:#444">${esc(d.ptitle)}</div>
      <div class="parties">This ${d.type === "Construction" ? "Construction" : ""} Agreement is entered into on this ${esc(dayPhrase(d.agrDate))}, by and between:
        <div style="margin-top:6px">• <b>OWNER:</b> ${esc(d.client || "________________")} (hereinafter referred to as the 'Owner')</div>
        <div>• <b>CONTRACTOR / ENGINEER:</b> ${esc(s.engineer)}, ${esc(s.role)}, ${esc(s.name)} (hereinafter referred to as the 'Contractor')</div>
      </div>
      <div class="ph2">1. Project Overview & Commercial Terms</div>
      <table class="ptbl"><tbody>
        <tr><td style="font-weight:600;width:32%">Project Type</td><td>${esc(d.ptitle)}</td></tr>
        ${d.site ? `<tr><td style="font-weight:600">Site Location</td><td>${esc(d.site)}</td></tr>` : ""}
        ${d.plot ? `<tr><td style="font-weight:600">Site Plot Dimensions</td><td>${esc(d.plot)}</td></tr>` : ""}
        ${d.type === "Construction" ? `<tr><td style="font-weight:600">Floor Built-up Area</td><td>${floorRows.map((i) => `${esc(i.d)}: ${numIN(i.q)} Sq. Ft.`).join(" | ")}</td></tr>` : ""}
        <tr><td style="font-weight:600">Total ${d.type === "Construction" ? "Built-up Area" : "Area (SFT)"}</td><td>${numIN(c.sft)} Sq. Ft.</td></tr>
        ${d.type === "Construction"
          ? `<tr><td style="font-weight:600">Agreed Construction Rate</td><td>${floorRows.map((i) => `${esc(i.d)}: ₹${numIN(i.r)}/- per Sq. Ft.`).join(" | ")}</td></tr>`
          : `<tr><td style="font-weight:600">Reference Quotation</td><td>${esc(d.qno)} dated ${fmtDate(d.qdate)}</td></tr>`}
        <tr><td style="font-weight:600">Total Contract Value</td><td>${rs(c.computed)} (Rupees ${words(c.computed)} Only)${d.gst > 0 ? ` incl. GST ${d.gst}%` : ""}</td></tr>
        ${d.finalAmt > 0 ? `<tr><td style="font-weight:700">GRAND TOTAL</td><td style="font-weight:700">${rs(d.finalAmt)} (Rupees ${words(d.finalAmt)} Only)</td></tr>` : ""}
      </tbody></table>
      <div class="ph2">2. Scope of Work Included${d.type === "Construction" ? " in Turnkey Package" : ""}</div>
      ${specBlock(d.aScope)}
      <div class="ph2">3. Detailed Material Specifications & Brand Standards</div>
      ${specBlock(d.aSpecs)}
      <div class="ph2">4. Exclusions (Out of Scope Items)</div>
      ${specBlock(d.aExcl)}
      <div class="ph2">5. Policy on Changes, Alterations & Extra Works</div>
      ${specBlock(fill(d.aChanges))}
      <div class="ph2">6. General Terms & Conditions</div>
      ${specBlock(d.aGeneral)}
      <div class="ph2">7. Milestone-Based Payment Schedule</div>
      <table class="ptbl"><thead><tr><th>Stage</th><th>Milestone / Work Phase Description</th><th>Amount (₹)</th><th>Customer Sign</th><th>Engineer Sign</th><th>Date</th></tr></thead>
      <tbody>
        ${ms.map((m, i) => `<tr><td>${i + 1}</td><td>${esc(m.desc)}</td><td class="r">${rs(m.amt)}</td><td></td><td></td><td></td></tr>`).join("")}
        <tr><td class="tot" colspan="2">TOTAL CONTRACT SUM:</td><td class="tot">${rs(c.total)}</td><td class="tot" colspan="3"></td></tr>
      </tbody></table>
      <div class="ph2">8. Execution & Signatures</div>
      <div>IN WITNESS WHEREOF, both the Owner and the Contractor have read, understood, and agreed to all terms, specifications, and commercial schedules contained herein, and set their hands on the date first written above.</div>
      <div class="sig-row" style="margin-top:44px">
        <div>_____________________________<br/><b>${esc(d.client || "Owner")}</b><br/>(Property Owner)<br/>Date: ____ / ____ / ${esc(yr)}</div>
        <div>_____________________________<br/><b>${esc(s.engineer)}</b><br/>(${esc(s.role)})<br/>Date: ____ / ____ / ${esc(yr)}</div>
      </div>
      <div class="sig-row" style="margin-top:28px">
        ${[1, 2].map((w) => `<div><b>Witness ${w}:</b><br/>Signature: ___________________<br/>Name: _______________________<br/>Address: _____________________</div>`).join("")}
      </div>
    </div>`;
  }

  


  const DEFAULT_SETTINGS = {
    name: "9 Square Infra", logo: "9 SQUARE INFRA", tagline: "Visualizing Spaces. Engineering Dreams.",
    address: "1st Floor, Opp Bandhan Bank, JMR Hospital Road, RR Pet, Eluru - 534002, Andhra Pradesh",
    branch: "Vijayawada", engineer: "Er. Rahel Shaik", qual: "B-Tech (Civil)", role: "Civil Engineer & Interior Designer",
    phone: "9393478247, 9948699399", email: "9squareinfra9@gmail.com", gstin: "", web: "9squareinfra.github.io/9-Square-Infra", city: "Eluru", bank: "",
    invite_code: "9SQUARE-STAFF",
  };

  // supabase client (CDN global `supabase`)
  if (!window.supabase || !window.supabase.createClient) { document.getElementById("app").innerHTML = "<p style=\"padding:2rem;color:#fecaca\">Failed to load Supabase SDK. Check your network.</p>"; return; }
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  function loadLocal(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } }
  function saveLocal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }

  const state = {
    tab: "estimate",
    settings: { ...DEFAULT_SETTINGS },
    docs: [],
    profiles: [],
    doc: null,
    msg: "",
    filter: "All",
    session: null, // { userId, email, role, displayName }
    loginEmail: "",
    loginPass: "",
    loginInvite: "",
    loginMode: "signin", // signin | signup
    loginError: "",
    loginBusy: false,
    managerCommentDraft: "",
    busy: false,
    boot: true,
  };

  function role() { return (state.session && state.session.role) || "user"; }
  function isAdmin() { return role() === "admin"; }
  function isManager() { return role() === "manager" || role() === "admin"; }
  function currentName() { return (state.session && state.session.displayName) || ""; }
  function currentUserId() { return state.session && state.session.userId; }

  function cacheDraft() {
    if (!state.doc) return;
    saveLocal(DRAFT_KEY, { userId: currentUserId(), doc: state.doc, savedAt: Date.now() });
  }
  function restoreDraft() {
    const d = loadLocal(DRAFT_KEY, null);
    if (d && d.doc && (!d.userId || d.userId === currentUserId())) return d.doc;
    return null;
  }

  function docFromRow(row) {
    const data = row.data || {};
    return {
      ...data,
      id: row.id,
      dbType: row.type,
      type: data.type || row.project_type || "Construction",
      status: row.status || "draft",
      client: row.client_name || data.client || "",
      clientPhone: row.client_phone || data.clientPhone || "",
      managerComment: row.manager_comment || "",
      createdBy: row.created_by,
      approvedBy: row.approved_by,
      updated: (row.updated_at || "").slice(0, 10) || today(),
      preparedBy: data.preparedBy || row.created_by,
      preparedByName: data.preparedByName || "",
      _row: row,
    };
  }

  function rowPayload(doc, statusOverride) {
    const c = calc(doc);
    const status = statusOverride || doc.status || "draft";
    const kind = doc.dbType || (state.tab === "agreement" ? "agreement" : state.tab === "quote" ? "quotation" : "estimate");
    const data = { ...doc };
    delete data._row;
    return {
      type: kind,
      project_type: doc.type,
      client_name: doc.client || "",
      client_phone: String(doc.clientPhone || "").replace(/\D/g, "").slice(-10),
      data,
      total: c.total,
      status,
      manager_comment: doc.managerComment || "",
    };
  }

  async function fetchProfile(userId) {
    const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function loadSettings() {
    const { data, error } = await sb.from("settings").select("data").eq("id", 1).maybeSingle();
    if (error) throw error;
    state.settings = { ...DEFAULT_SETTINGS, ...(data && data.data ? data.data : {}) };
  }

  async function saveSettingsRemote() {
    if (!isAdmin()) throw new Error("Admin only");
    const { error } = await sb.from("settings").upsert({
      id: 1,
      data: state.settings,
      updated_by: currentUserId(),
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  async function loadDocs() {
    let q = sb.from("documents").select("*").order("updated_at", { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    state.docs = (data || []).map(docFromRow);
  }

  async function loadProfiles() {
    if (!isManager()) { state.profiles = []; return; }
    const { data, error } = await sb.from("profiles").select("*").order("display_name");
    if (error) throw error;
    state.profiles = data || [];
  }

  async function logActivity(docId, action, detail) {
    try { await sb.rpc("log_activity", { p_document_id: docId || null, p_action: action, p_detail: detail || {} }); } catch (_) {}
  }

  async function saveDoc(statusOverride) {
    if (!state.session) return;
    const name = currentName();
    state.doc.preparedBy = state.doc.preparedBy || currentUserId();
    state.doc.preparedByName = name || state.doc.preparedByName || "";
    state.doc.status = statusOverride || state.doc.status || "draft";
    state.doc.updated = today();
    cacheDraft();
    const payload = rowPayload(state.doc, state.doc.status);
    let row;
    const id = String(state.doc.id || "");
    const existsRemote = !!(state.doc._row && state.doc._row.id) || state.docs.some((x) => x.id === id);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (existsRemote || isUuid) {
      const { data, error } = await sb.from("documents").update(payload).eq("id", id).select("*").single();
      if (error) throw error;
      row = data;
    } else {
      payload.created_by = currentUserId();
      const { data, error } = await sb.from("documents").insert(payload).select("*").single();
      if (error) throw error;
      row = data;
    }
    state.doc = docFromRow(row);
    await loadDocs();
    await logActivity(row.id, "save", { status: row.status });
    setMsg("Saved " + (state.doc.qno || row.id.slice(0, 8)) + " (" + STATUS_LABEL[row.status] + ").");
  }

  async function deleteDoc(id) {
    if (!isAdmin()) throw new Error("Admin only");
    const { error } = await sb.from("documents").delete().eq("id", id);
    if (error) throw error;
    await loadDocs();
    if (state.doc && state.doc.id === id) {
      state.doc = stampNew(newDoc("Construction", state.docs.length + 1));
    }
  }

  function stampNew(d) {
    d.preparedBy = currentUserId() || "";
    d.preparedByName = currentName();
    d.status = "draft";
    d.clientPhone = d.clientPhone || "";
    d.managerComment = "";
    d.dbType = "estimate";
    return d;
  }

  async function refreshSessionUser() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { state.session = null; return null; }
    let profile = null;
    try { profile = await fetchProfile(session.user.id); } catch (e) { console.warn(e); }
    state.session = {
      userId: session.user.id,
      email: session.user.email,
      role: (profile && profile.role) || "user",
      displayName: (profile && profile.display_name) || session.user.email,
    };
    return state.session;
  }

  async function boot() {
    state.boot = true;
    renderNow();
    try {
      await refreshSessionUser();
      if (state.session) {
        await loadSettings();
        await loadDocs();
        await loadProfiles();
        const draft = restoreDraft();
        state.doc = draft ? draft : stampNew(newDoc("Construction", state.docs.length + 1));
      }
    } catch (e) {
      state.loginError = e.message || String(e);
    }
    state.boot = false;
    render();
  }

  async function doSignIn(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    await refreshSessionUser();
    await loadSettings();
    await loadDocs();
    await loadProfiles();
    state.doc = stampNew(newDoc("Construction", state.docs.length + 1));
    state.tab = "estimate";
  }

  async function doSignUp(email, password, invite, displayName) {
    const { data: ok, error: vErr } = await sb.rpc("verify_invite_code", { p_code: invite });
    if (vErr) throw vErr;
    if (!ok) throw new Error("Invalid invite code. Ask your admin for the staff invite code.");
    const dn = (displayName || "").trim() || email.split("@")[0];
    const { error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: dn } },
    });
    if (error) throw error;
    // If email confirmation is off, session may exist
    await refreshSessionUser();
    if (state.session) {
      if (!state.session.displayName) state.session.displayName = dn;
      await loadSettings();
      await loadDocs();
      await loadProfiles();
      state.doc = stampNew(newDoc("Construction", 1));
    }
  }

  async function doLogout() {
    await sb.auth.signOut();
    state.session = null;
    state.docs = [];
    state.profiles = [];
    state.doc = null;
    state.tab = "estimate";
    state.msg = "";
    state.loginError = "";
  }

  function changeType(v) {
    const n = newDoc(v, state.docs.length + 1);
    const keep = { id: state.doc.id, qno: state.doc.qno, client: state.doc.client, clientPhone: state.doc.clientPhone, site: state.doc.site, siteName: state.doc.siteName, plot: state.doc.plot, preparedBy: state.doc.preparedBy, preparedByName: state.doc.preparedByName, status: state.doc.status, managerComment: state.doc.managerComment, dbType: state.doc.dbType };
    state.doc = { ...n, ...keep };
    cacheDraft();
    render();
  }

  function applyTier(tier) {
    const R = TIER_RATES[tier];
    state.doc.tier = tier;
    state.doc.items = state.doc.items.map((i) => (i.f ? { ...i, r: i.f === "frame" ? R.frame : i.f === "box" ? R.box : R.kit } : i));
    cacheDraft();
    render();
  }

  function setMsg(m) { state.msg = m; render(); }
  function setTab(t) { state.tab = t; state.msg = ""; render(); }
  function upItem(i, p) { state.doc.items = state.doc.items.map((x, j) => (j === i ? { ...x, ...p } : x)); cacheDraft(); render(); }

  async function withBusy(fn, okMsg) {
    try {
      state.busy = true; renderNow();
      await fn();
      if (okMsg) state.msg = okMsg;
    } catch (e) {
      state.msg = (e && e.message) || String(e);
      console.error(e);
    } finally {
      state.busy = false; render();
    }
  }

  function phoneDigits(p) {
    let d = String(p || "").replace(/\D/g, "");
    if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
    if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    return d;
  }

  async function makePdfBlob() {
    const el = document.getElementById("sq-print");
    if (!el) throw new Error("Nothing to export — open Quotation first.");
    if (!window.html2pdf) throw new Error("PDF library not loaded.");
    const opt = {
      margin: 10,
      filename: (state.doc.qno || "quotation").replace(/[^\w.-]+/g, "_") + ".pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    const worker = window.html2pdf().set(opt).from(el);
    const blob = await worker.outputPdf("blob");
    return { blob, filename: opt.filename };
  }

  async function sendWhatsApp() {
    const d = state.doc;
    const c = calc(d);
    const phone = phoneDigits(d.clientPhone);
    if (phone.length !== 10) throw new Error("Enter a 10-digit customer WhatsApp number on the Estimate tab.");
    const msg = encodeURIComponent(
      "Namaste " + (d.client || "Sir/Madam") + ",\n\n" +
      "Please find our quotation " + (d.qno || "") + " from 9 Square Infra.\n" +
      "Project: " + (d.ptitle || d.type) + "\n" +
      "Total: " + rs(c.total) + " (Rupees " + words(c.total) + " Only)\n\n" +
      "We look forward to your confirmation.\n— " + currentName() + "\n9 Square Infra"
    );
    const { blob, filename } = await makePdfBlob();
    const file = new File([blob], filename, { type: "application/pdf" });
    let shared = false;
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename, text: decodeURIComponent(msg) });
        shared = true;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    if (!shared) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      window.open("https://wa.me/91" + phone + "?text=" + msg, "_blank");
    } else {
      // still offer WhatsApp text
      window.open("https://wa.me/91" + phone + "?text=" + msg, "_blank");
    }
    await saveDoc("sent");
  }

  async function importBackupToSupabase(file) {
    if (!isAdmin()) throw new Error("Admin only");
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.settings) {
      state.settings = { ...DEFAULT_SETTINGS, ...data.settings };
      await saveSettingsRemote();
    }
    const docs = Array.isArray(data.docs) ? data.docs : [];
    let n = 0;
    for (const old of docs) {
      const mapped = {
        ...old,
        status: String(old.status || "draft").toLowerCase().replace(/\s+/g, "_"),
        clientPhone: old.clientPhone || "",
        managerComment: old.managerComment || "",
        dbType: "quotation",
      };
      if (!["draft","pending_approval","changes_requested","approved","sent","accepted","rejected"].includes(mapped.status)) {
        if (mapped.status === "draft") mapped.status = "draft";
        else if (mapped.status === "sent") mapped.status = "sent";
        else if (mapped.status === "accepted") mapped.status = "accepted";
        else mapped.status = "draft";
      }
      // strip local non-uuid ids so insert creates new rows
      const payload = rowPayload(mapped, mapped.status);
      payload.created_by = currentUserId();
      const { error } = await sb.from("documents").insert(payload);
      if (error) throw error;
      n++;
    }
    await loadDocs();
    setMsg("Imported " + n + " document(s) into Supabase.");
  }

  function exportLocalBackup() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ settings: state.settings, docs: state.docs }, null, 2)], { type: "application/json" }));
    a.download = "9square-documents-backup.json";
    document.body.appendChild(a); a.click(); a.remove();
  }



  function renderLogin() {
    const signup = state.loginMode === "signup";
    return `<div class="login-wrap">
      <div class="login-card">
        <img class="login-logo" src="assets/logo.png" alt="9 Square Infra" />
        <div class="lh-logo" style="text-align:center;margin-top:8px">9 SQUARE INFRA</div>
        <p class="login-tag">Estimates · Quotations · Agreements</p>
        <h1 class="login-title">${signup ? "Create staff account" : "Sign in"}</h1>
        ${state.loginError ? `<div class="login-error">${esc(state.loginError)}</div>` : ""}
        <div class="field"><label>Email</label><input id="login-email" type="email" autocomplete="username" value="${esc(state.loginEmail)}" /></div>
        <div class="field"><label>Password</label><input id="login-pass" type="password" autocomplete="${signup ? "new-password" : "current-password"}" value="${esc(state.loginPass)}" /></div>
        ${signup ? `<div class="field"><label>Your name</label><input id="login-name" value="" /></div>
        <div class="field"><label>Invite code</label><input id="login-invite" value="${esc(state.loginInvite)}" placeholder="Ask admin" /></div>` : ""}
        <button type="button" class="btn btn-primary login-btn" id="login-submit" ${state.loginBusy ? "disabled" : ""}>${state.loginBusy ? "Please wait…" : (signup ? "Create account" : "Sign in")}</button>
        <p class="login-switch">${signup
          ? `Already have an account? <button type="button" class="linkish" id="login-mode-signin">Sign in</button>`
          : `New staff? <button type="button" class="linkish" id="login-mode-signup">Create account with invite code</button>`}</p>
        <p class="login-note">Shared team dashboard (Supabase). Prefer: Admin creates accounts in Supabase Authentication → Add user, then staff sign in here.</p>
      </div>
    </div>`;
  }

  function statusBadge(st) {
    return `<span class="status status-${esc(st)}">${esc(STATUS_LABEL[st] || st)}</span>`;
  }

  function workflowBar() {
    const d = state.doc;
    if (!d) return "";
    const st = d.status || "draft";
    let actions = "";
    if (st === "draft" || st === "changes_requested") {
      actions += btn("Save draft", "save-draft") + btn("Send for approval", "send-approval", "btn-primary");
    }
    if (isManager() && st === "pending_approval") {
      actions += btn("✅ Approve & Send on WhatsApp", "approve-wa", "btn-wa") + btn("Approve only", "approve") + btn("Send back", "send-back");
    }
    if (isManager() && st === "approved") {
      actions += btn("📲 Send to customer on WhatsApp", "wa-send", "btn-wa") + btn("Download PDF", "pdf-only");
    }
    if (isManager() && (st === "sent" || st === "approved")) {
      actions += btn("Mark Accepted", "mark-accepted") + btn("Mark Rejected", "mark-rejected");
    }
    if (st === "changes_requested" && d.managerComment) {
      actions = `<div class="mgr-comment"><b>Manager comment:</b> ${esc(d.managerComment)}</div>` + actions;
    }
    return `<div class="workflow no-print"><div>Status: ${statusBadge(st)}</div><div class="row-actions" style="margin:0">${actions}</div></div>`;
  }

  function renderEstimate() {
    const d = state.doc;
    const c = calc(d);
    const cats = catsFor(d.type);
    const breakDown = Array.from(new Set([...cats, ...d.items.map((i) => i.k)]))
      .map((k) => ({ k, v: d.items.filter((i) => i.k === k).reduce((s, i) => s + i.q * i.r, 0) }))
      .filter((x) => x.k !== "-").filter((x) => x.v > 0 || (d.type !== "Real Estate" && x.k !== "Contract"));
    const canEditRates = isAdmin();
    return `<div class="card">
      <div class="card-head"><h2>Estimate · ${esc(d.qno)}</h2>${btn("New estimate", "new-doc")}</div>
      ${workflowBar()}
      <div class="grid grid-3">
        ${select("Project type", d.type, TYPES, "doc.type")}
        ${input("Customer name", d.client, { bind: "doc.client" })}
        ${input("Customer WhatsApp (10 digits)", d.clientPhone || "", { bind: "doc.clientPhone" })}
        ${input("Project type title", d.ptitle, { bind: "doc.ptitle" })}
        ${input("Project / site name", d.siteName, { bind: "doc.siteName" })}
        ${input("Site location", d.site, { bind: "doc.site" })}
        ${input("Plot dimensions (e.g. 35' x 52')", d.plot, { bind: "doc.plot" })}
      </div>
      ${d.type === "Interiors" && canEditRates ? `<div class="grid grid-2" style="margin-top:12px">${select("Woodwork rate tier", d.tier, TIERS, "doc.tier")}<div class="hint" style="align-self:end">${esc(TIER_RATES[d.tier].src)}</div></div>` : (d.type === "Interiors" ? `<p class="hint">Woodwork tier: ${esc(d.tier)} (rates locked — ask Admin).</p>` : "")}
      <div class="scroll"><table class="itable"><thead><tr>
        <th>Section</th><th style="width:24%">Description</th><th>Specification</th><th>Unit</th><th class="num">Qty</th><th class="num">Rate (₹)</th><th>Type</th><th class="num">Amount</th><th></th>
      </tr></thead><tbody>
        ${d.items.map((it, i) => {
          const opts = cats.includes(it.k) ? cats : [it.k, ...cats];
          return `<tr>
            <td style="width:150px"><input data-item="${i}" data-field="s" value="${esc(it.s)}" /></td>
            <td><input data-item="${i}" data-field="d" value="${esc(it.d)}" /></td>
            <td><input data-item="${i}" data-field="sp" value="${esc(it.sp)}" /></td>
            <td style="width:70px"><input data-item="${i}" data-field="u" value="${esc(it.u)}" /></td>
            <td style="width:80px"><input class="num" type="number" data-item="${i}" data-field="q" value="${it.q}" /></td>
            <td style="width:100px"><input class="num" type="number" data-item="${i}" data-field="r" value="${it.r}" /></td>
            <td style="width:${d.type === "Real Estate" ? 190 : 110}px"><select data-item="${i}" data-field="k">${opts.map((o) => `<option${o === it.k ? " selected" : ""}>${esc(o)}</option>`).join("")}</select></td>
            <td class="amt">${inr(it.q * it.r)}</td>
            <td style="width:40px"><button type="button" class="btn btn-sm" data-action="del-item" data-i="${i}">✕</button></td>
          </tr>`;
        }).join("")}
      </tbody></table></div>
      <div class="row-actions">${btn("Add line item", "add-item")} ${isAdmin() ? btn("Reload template", "reload-tpl") : ""}</div>
      <div class="grid grid-4">
        ${input("Contingency %", String(d.cont), { bind: "doc.cont", type: "number" })}
        ${input("Overhead & profit %", String(d.oh), { bind: "doc.oh", type: "number" })}
        ${input("GST % (0 = not shown)", String(d.gst), { bind: "doc.gst", type: "number" })}
        ${input("Final / negotiated total (₹)", d.finalAmt ? String(d.finalAmt) : "", { bind: "doc.finalAmt", type: "number" })}
      </div>
      <div class="metrics">
        <div class="metric"><div class="v">${inr(c.total)}</div><div class="l">Grand total</div></div>
        <div class="metric"><div class="v">${numIN(c.sft)} sft</div><div class="l">Total SFT</div></div>
        <div class="metric"><div class="v">${c.sft ? inr(c.total / c.sft) : "—"}</div><div class="l">Per sft</div></div>
        <div class="metric"><div class="v">${esc(STATUS_LABEL[d.status] || d.status)}</div><div class="l">Status</div></div>
      </div>
      <div class="row-actions">${btn("Save & continue to quotation", "save-quote", "btn-primary")}</div>
    </div>`;
  }

  function renderQuote() {
    const d = state.doc, s = state.settings, c = calc(d);
    const intr = d.type === "Interiors" || d.type === "Renovation";
    return `<div class="card">
      <div class="card-head"><h2>Quotation</h2></div>
      ${workflowBar()}
      <div class="grid grid-3">
        ${input("Reference no.", d.qno, { bind: "doc.qno" })}
        ${input("Date (YYYY-MM-DD)", d.qdate, { bind: "doc.qdate" })}
        ${intr ? input("Work title", d.ptitle, { bind: "doc.ptitle" }) : input("Project details", d.projDetails, { bind: "doc.projDetails" })}
      </div>
      <div class="grid grid-3" style="margin-top:12px">
        ${!intr ? textarea("Scope of work", d.scope, "doc.scope") : ""}
        ${textarea(intr ? "Material specifications" : "Which covers following items", d.specs, "doc.specs")}
        ${textarea(intr ? "Important terms" : "Note", d.notes, "doc.notes")}
        ${intr ? textarea("Side notes", d.side, "doc.side") : ""}
      </div>
      <div class="row-actions no-print">
        ${btn("Print / Save PDF", "print", "btn-primary")}
        ${btn("Save", "save")}
        ${btn("Next: Agreement", "to-agr")}
      </div>
      <div id="sq-print" class="paper">${letterheadHtml(s)}${intr ? intQuoteHtml(d, s, c) : civilQuoteHtml(d, s, c)}</div>
    </div>`;
  }

  function renderAgreement() {
    const d = state.doc, s = state.settings, c = calc(d);
    const intr = d.type === "Interiors" || d.type === "Renovation";
    return `<div class="card">
      <div class="card-head"><h2>Agreement · ${esc(d.type)}</h2></div>
      ${workflowBar()}
      <div class="grid grid-2">
        ${input("Agreement date", d.agrDate, { bind: "doc.agrDate" })}
        ${input("Final total (₹)", d.finalAmt ? String(d.finalAmt) : "", { bind: "doc.finalAmt", type: "number" })}
        ${textarea("2. Scope of work", d.aScope, "doc.aScope")}
        ${textarea("3. Material specifications", d.aSpecs, "doc.aSpecs")}
        ${textarea("4. Exclusions", d.aExcl, "doc.aExcl")}
        ${textarea("5. Changes & extras", d.aChanges, "doc.aChanges")}
        ${textarea("6. General terms", d.aGeneral, "doc.aGeneral")}
        ${textarea("7. Payment milestones (description | %)", d.miles, "doc.miles")}
      </div>
      <div class="row-actions no-print">
        ${btn("Print / Save PDF", "print", "btn-primary")}
        ${btn("Reset clauses", "reset-clauses")}
      </div>
      <div id="sq-print" class="paper">${letterheadHtml(s)}${agreementHtml(d, s, c)}</div>
    </div>`;
  }

  function renderDocs() {
    const base = state.docs;
    const pending = base.filter((d) => d.status === "pending_approval");
    const shown = base.filter((d) => state.filter === "All" || d.status === state.filter);
    const counts = { All: base.length };
    STATUSES.forEach((s) => { counts[s] = 0; });
    base.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });
    const filters = ["All", ...STATUSES];
    return `<div class="card">
      <div class="card-head"><h2>Documents</h2>
        <div class="row-actions" style="margin:0">
          ${isAdmin() ? btn("Export JSON", "export") : ""}
          ${isAdmin() ? btn("Import old backup → Supabase", "import") : ""}
          ${isAdmin() ? `<input type="file" accept="application/json,.json" class="hidden-file" id="import-file" />` : ""}
        </div>
      </div>
      ${isManager() && pending.length ? `<div class="pending-box"><b>Pending approvals (${pending.length})</b>
        <ul>${pending.map((d) => `<li>${esc(d.qno)} — ${esc(d.client || "—")} · ${inr(calc(d).total)}
          ${btn("Open", "open:" + d.id, "btn-sm")}</li>`).join("")}</ul></div>` : ""}
      <div class="tabs filter-tabs">
        ${filters.map((s) => `<button type="button" class="tab${state.filter === s ? " active" : ""}" data-filter="${s}">${s === "All" ? "All" : STATUS_LABEL[s]}<span class="count">${counts[s] || 0}</span></button>`).join("")}
      </div>
      ${shown.length ? `<div class="scroll"><table class="docs-table"><thead><tr><th>Ref</th><th>Customer</th><th>Type</th><th>Prepared by</th><th style="text-align:right">Value</th><th>Updated</th><th>Status</th><th></th></tr></thead>
      <tbody>${shown.map((d) => `<tr>
        <td>${esc(d.qno)}</td><td>${esc(d.client || "—")}</td><td>${esc(d.type)}</td>
        <td>${esc(d.preparedByName || "—")}</td>
        <td style="text-align:right">${inr(calc(d).total)}</td><td>${fmtDate(d.updated)}</td>
        <td>${statusBadge(d.status)}</td>
        <td style="text-align:right">${btn("Open", "open:" + d.id, "btn-sm")} ${isAdmin() ? btn("Delete", "del:" + d.id, "btn-sm btn-danger") : ""}</td>
      </tr>`).join("")}</tbody></table></div>` : `<p class="hint">No documents yet.</p>`}
    </div>`;
  }

  function renderSettings() {
    const s = state.settings;
    return `<div class="card">
      <div class="card-head"><div><h2>Company / letterhead</h2><p class="caption">Admin only. Saved to Supabase for the whole team.</p></div></div>
      <div class="grid grid-3">
        ${input("Company name", s.name, { bind: "settings.name" })}
        ${input("Logo text", s.logo, { bind: "settings.logo" })}
        ${input("Tagline", s.tagline, { bind: "settings.tagline" })}
        ${input("Engineer / signatory", s.engineer, { bind: "settings.engineer" })}
        ${input("Qualification", s.qual, { bind: "settings.qual" })}
        ${input("Designation", s.role, { bind: "settings.role" })}
        ${input("Phone", s.phone, { bind: "settings.phone" })}
        ${input("Email", s.email, { bind: "settings.email" })}
        ${input("Branch", s.branch, { bind: "settings.branch" })}
        ${input("City", s.city, { bind: "settings.city" })}
        ${input("GSTIN", s.gstin, { bind: "settings.gstin" })}
        ${input("Website", s.web, { bind: "settings.web" })}
        ${input("Staff invite code", s.invite_code || "", { bind: "settings.invite_code" })}
      </div>
      <div style="margin-top:12px">${textarea("Office address", s.address, "settings.address", 60)}</div>
      <div class="row-actions">${btn("Save settings", "save-settings", "btn-primary")} ${btn("Restore defaults", "restore-settings")}</div>
      <div class="paper" style="margin-top:16px">${letterheadHtml(s)}</div>
    </div>`;
  }

  function renderUsers() {
    if (!isAdmin()) return `<div class="card"><p class="hint">Admin only.</p></div>`;
    return `<div class="card">
      <div class="card-head"><h2>Users & roles</h2></div>
      <p class="caption">Create accounts in Supabase Authentication → Users → Add user (email + password, auto-confirm). Then set role here. Roles: <b>user</b> (create & send for approval), <b>manager</b> (approve / WhatsApp), <b>admin</b> (settings, delete, roles).</p>
      <div class="scroll"><table class="docs-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
      <tbody>${(state.profiles || []).map((p) => `<tr>
        <td><input data-prof-name="${esc(p.id)}" value="${esc(p.display_name || "")}" /></td>
        <td>${esc(p.email || "")}</td>
        <td><select data-prof-role="${esc(p.id)}">
          ${["user","manager","admin"].map((r) => `<option value="${r}"${p.role === r ? " selected" : ""}>${r}</option>`).join("")}
        </select></td>
        <td>${btn("Save", "save-prof:" + p.id, "btn-sm btn-primary")}</td>
      </tr>`).join("") || `<tr><td colspan="4">No profiles yet — create users in Supabase Auth first.</td></tr>`}</tbody></table></div>
    </div>`;
  }

  let _raf = 0;
  function render() {
    if (_raf) cancelAnimationFrame(_raf);
    _raf = requestAnimationFrame(() => { _raf = 0; renderNow(); });
  }

  function renderNow() {
    const root = document.getElementById("app");
    if (state.boot) {
      root.innerHTML = `<div class="login-wrap"><div class="login-card"><p class="login-tag">Loading…</p></div></div>`;
      return;
    }
    if (!state.session) {
      root.innerHTML = renderLogin();
      const emailEl = document.getElementById("login-email");
      const passEl = document.getElementById("login-pass");
      const go = async () => {
        const emailVal = (document.getElementById("login-email") || {}).value || "";
        const passVal = (document.getElementById("login-pass") || {}).value || "";
        const nameVal = (document.getElementById("login-name") || {}).value || "";
        const inviteVal = (document.getElementById("login-invite") || {}).value || "";
        state.loginEmail = emailVal;
        state.loginPass = passVal;
        state.loginInvite = inviteVal;
        state.loginBusy = true; state.loginError = ""; renderNow();
        try {
          if (state.loginMode === "signup") {
            await doSignUp(emailVal, passVal, inviteVal, nameVal);
            if (!state.session) state.loginError = "Account created. If email confirmation is ON, confirm your email then sign in.";
            else state.msg = "Welcome, " + currentName() + ".";
          } else {
            await doSignIn(emailVal, passVal);
            state.msg = "Welcome, " + currentName() + ".";
          }
          state.loginPass = "";
        } catch (e) {
          state.loginError = e.message || String(e);
          state.loginPass = "";
        }
        state.loginBusy = false;
        render();
      };
      document.getElementById("login-submit").addEventListener("click", go);
      [emailEl, passEl].forEach((el) => el && el.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); }));
      const si = document.getElementById("login-mode-signin");
      const su = document.getElementById("login-mode-signup");
      if (si) si.addEventListener("click", () => { state.loginMode = "signin"; state.loginError = ""; render(); });
      if (su) su.addEventListener("click", () => { state.loginMode = "signup"; state.loginError = ""; render(); });
      if (emailEl) emailEl.focus();
      return;
    }
    if (!state.doc) state.doc = stampNew(newDoc("Construction", 1));
    if ((state.tab === "settings" || state.tab === "users") && !isAdmin()) state.tab = "estimate";
    const tabs = [
      { id: "estimate", label: "1 · Estimate" },
      { id: "quote", label: "2 · Quotation" },
      { id: "agreement", label: "3 · Agreement" },
      { id: "docs", label: "Documents", count: state.docs.length },
    ];
    if (isAdmin()) {
      tabs.push({ id: "settings", label: "Settings" });
      tabs.push({ id: "users", label: "Users" });
    }
    let body = "";
    if (state.tab === "estimate") body = renderEstimate();
    else if (state.tab === "quote") body = renderQuote();
    else if (state.tab === "agreement") body = renderAgreement();
    else if (state.tab === "docs") body = renderDocs();
    else if (state.tab === "settings" && isAdmin()) body = renderSettings();
    else if (state.tab === "users" && isAdmin()) body = renderUsers();
    else body = renderEstimate();

    root.innerHTML = `<div class="app">
      <div class="topbar no-print">
        <img src="assets/logo.png" alt="9 Square Infra logo" />
        <div class="topbar-text">
          <h1>9 Square Infra – Estimates, Quotations & Agreements</h1>
          <p class="tag">Shared team dashboard · Construction · Interiors · Renovation · Real Estate</p>
        </div>
        <div class="session-box">
          <div class="session-name">${esc(currentName())}<span class="session-role">${esc(role())}</span></div>
          <button type="button" class="btn btn-sm" data-action="logout">Logout</button>
        </div>
      </div>
      <p class="summary no-print">Create estimate → send for approval → manager approves → WhatsApp PDF to customer. Data syncs via Supabase.${state.busy ? " Working…" : ""}</p>
      <div class="tabs no-print">${tabs.map((t) => `<button type="button" class="tab${state.tab === t.id ? " active" : ""}" data-tab="${t.id}">${esc(t.label)}${t.count != null ? `<span class="count">${t.count}</span>` : ""}</button>`).join("")}</div>
      ${state.msg ? `<div class="msg no-print">${esc(state.msg)}</div>` : ""}
      ${body}
    </div>`;
    bind();
  }

  function setPath(path, value) {
    const [root, key] = path.split(".");
    if (root === "doc") {
      if (["cont", "oh", "gst", "finalAmt"].includes(key)) state.doc[key] = num(value);
      else state.doc[key] = value;
      if (key === "type") changeType(value);
      else if (key === "tier") { if (!isAdmin()) return setMsg("Admin only — rates locked."); applyTier(value); }
      else { cacheDraft(); render(); }
    } else if (root === "settings") {
      state.settings[key] = value;
      render();
    }
  }

  function bind() {
    document.querySelectorAll("[data-tab]").forEach((el) => el.addEventListener("click", () => setTab(el.getAttribute("data-tab"))));
    document.querySelectorAll("[data-filter]").forEach((el) => el.addEventListener("click", () => { state.filter = el.getAttribute("data-filter"); render(); }));
    document.querySelectorAll("[data-bind]").forEach((el) => {
      el.addEventListener("change", () => setPath(el.getAttribute("data-bind"), el.value));
    });
    document.querySelectorAll("[data-item]").forEach((el) => {
      const i = Number(el.getAttribute("data-item"));
      const field = el.getAttribute("data-field");
      el.addEventListener("change", () => {
        const val = (field === "q" || field === "r") ? num(el.value) : el.value;
        upItem(i, { [field]: val });
      });
    });
    document.querySelectorAll("[data-action]").forEach((el) => {
      el.addEventListener("click", () => {
        const a = el.getAttribute("data-action");
        const run = async () => {
          if (a === "new-doc") {
            state.doc = stampNew(newDoc(state.doc.type, state.docs.length + 1));
            state.msg = ""; render(); return;
          }
          if (a === "add-item") {
            const last = state.doc.items[state.doc.items.length - 1];
            state.doc.items = [...state.doc.items, { ...I(last ? last.s : "WORK", "", "", state.doc.type === "Real Estate" ? "LS" : "SFT", 1, 0), k: catsFor(state.doc.type)[0] }];
            cacheDraft(); render(); return;
          }
          if (a === "del-item") { state.doc.items = state.doc.items.filter((_, j) => j !== Number(el.getAttribute("data-i"))); cacheDraft(); render(); return; }
          if (a === "save-quote") { state.doc.dbType = "quotation"; await saveDoc(); setTab("quote"); return; }
          if (a === "save-draft") { await saveDoc("draft"); return; }
          if (a === "save") { await saveDoc(); return; }
          if (a === "send-approval") { await saveDoc("pending_approval"); return; }
          if (a === "approve-wa") {
            if (!isManager()) throw new Error("Manager/admin only");
            state.doc.approvedBy = currentUserId();
            state.doc.managerComment = "";
            await saveDoc("approved");
            await sendWhatsApp();
            return;
          }
          if (a === "approve") {
            if (!isManager()) throw new Error("Manager/admin only");
            state.doc.approvedBy = currentUserId();
            state.doc.managerComment = "";
            await saveDoc("approved");
            return;
          }
          if (a === "send-back") {
            if (!isManager()) throw new Error("Manager/admin only");
            const comment = window.prompt("Comment for the preparer:", state.doc.managerComment || "");
            if (comment === null) return;
            state.doc.managerComment = comment;
            await saveDoc("changes_requested");
            return;
          }
          if (a === "wa-send") { await sendWhatsApp(); return; }
          if (a === "pdf-only") {
            const { blob, filename } = await makePdfBlob();
            const ael = document.createElement("a");
            ael.href = URL.createObjectURL(blob); ael.download = filename;
            document.body.appendChild(ael); ael.click(); ael.remove();
            return;
          }
          if (a === "mark-accepted") { await saveDoc("accepted"); return; }
          if (a === "mark-rejected") { await saveDoc("rejected"); return; }
          if (a === "to-agr") { state.doc.dbType = "agreement"; await saveDoc(); setTab("agreement"); return; }
          if (a === "print") { try { window.print(); } catch (_) { setMsg("Press Ctrl+P to print."); } return; }
          if (a === "reset-clauses") {
            const t = state.doc.type;
            Object.assign(state.doc, { aScope: A_SCOPE[t], aSpecs: A_SPECS[t], aExcl: A_EXCL[t], aChanges: A_CHANGES, aGeneral: A_GENERAL[t], miles: MILES[t] });
            cacheDraft(); render(); return;
          }
          if (a === "logout") { await doLogout(); render(); return; }
          if (a === "export") { if (!isAdmin()) throw new Error("Admin only"); exportLocalBackup(); return; }
          if (a === "import") { if (!isAdmin()) throw new Error("Admin only"); document.getElementById("import-file").click(); return; }
          if (a === "reload-tpl") { if (!isAdmin()) throw new Error("Admin only"); state.doc.items = itemsFor(state.doc.type, state.doc.tier); cacheDraft(); render(); return; }
          if (a === "restore-settings") {
            if (!isAdmin()) return;
            const invite = state.settings.invite_code;
            state.settings = { ...DEFAULT_SETTINGS, gstin: state.settings.gstin, invite_code: invite };
            render(); return;
          }
          if (a === "save-settings") { await saveSettingsRemote(); setMsg("Settings saved for the whole team."); return; }
          if (a.startsWith("save-prof:")) {
            if (!isAdmin()) throw new Error("Admin only");
            const id = a.slice(10);
            const nameEl = document.querySelector(`[data-prof-name="${id}"]`);
            const roleEl = document.querySelector(`[data-prof-role="${id}"]`);
            const { error } = await sb.rpc("admin_update_profile", {
              p_user_id: id,
              p_role: roleEl.value,
              p_display_name: nameEl.value,
            });
            if (error) throw error;
            await loadProfiles();
            if (id === currentUserId()) await refreshSessionUser();
            setMsg("Profile updated.");
            return;
          }
          if (a.startsWith("open:")) {
            const id = a.slice(5);
            const found = state.docs.find((x) => x.id === id);
            if (found) { state.doc = JSON.parse(JSON.stringify(found)); setTab(found.status === "draft" ? "estimate" : "quote"); }
            return;
          }
          if (a.startsWith("del:")) {
            if (!isAdmin()) throw new Error("Admin only");
            if (!window.confirm("Delete this document permanently?")) return;
            await deleteDoc(a.slice(4));
            setMsg("Deleted.");
            return;
          }
        };
        withBusy(run);
      });
    });
    const file = document.getElementById("import-file");
    if (file) file.addEventListener("change", () => {
      if (file.files && file.files[0]) withBusy(() => importBackupToSupabase(file.files[0]));
    });
  }

  window.__9sq = {
    state, calc, newDoc, saveDoc, setTab, render, sb, isAdmin, isManager, currentName,
    STATUSES, STATUS_LABEL, SUPABASE_URL, rowPayload, docFromRow, phoneDigits,
  };

  sb.auth.onAuthStateChange(async (event) => {
    if (event === "SIGNED_OUT") {
      state.session = null;
      render();
    }
  });

  boot();
})();
