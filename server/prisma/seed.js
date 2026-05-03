import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const now = new Date();
const daysAgo = (n) => new Date(now - n * 86400000);
const daysFromNow = (n) => new Date(now.getTime() + n * 86400000);

async function main() {
  // Clean in reverse-dependency order
  await prisma.dealNote.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash('Password123!', 12);
  const salesPass = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.create({
    data: { name: 'Alex Carter', email: 'admin@crm.com', password: adminPass, role: 'ADMIN' },
  });

  const sarah = await prisma.user.create({
    data: { name: 'Sarah Johnson', email: 'sarah@crm.com', password: salesPass, role: 'SALES' },
  });

  const leadsData = [
    // NEW leads
    {
      name: 'Marcus Webb', email: 'marcus@techflow.io', phone: '+1 555-101-2020',
      company: 'TechFlow Solutions', source: 'LINKEDIN', status: 'NEW', priority: 'HIGH',
      estimatedValue: 75000, expectedCloseDate: daysFromNow(30), assignedToId: sarah.id, createdById: admin.id,
    },
    {
      name: 'Priya Mehta', email: 'priya@datapulse.com', phone: '+1 555-202-3030',
      company: 'DataPulse Analytics', source: 'REFERRAL', status: 'NEW', priority: 'MEDIUM',
      estimatedValue: 42000, expectedCloseDate: daysFromNow(45), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Jordan Lee', email: 'jordan@cloudnine.net', phone: '+1 555-303-4040',
      company: 'CloudNine Ventures', source: 'WEBSITE', status: 'NEW', priority: 'LOW',
      estimatedValue: 15000, expectedCloseDate: daysFromNow(60), assignedToId: sarah.id, createdById: sarah.id,
    },
    {
      name: 'Fatima Al-Rashid', email: 'fatima@nexusglobal.com', phone: '+1 555-404-5050',
      company: 'Nexus Global', source: 'COLD_EMAIL', status: 'NEW', priority: 'MEDIUM',
      estimatedValue: 28000, expectedCloseDate: daysFromNow(50), assignedToId: admin.id, createdById: admin.id,
    },
    // CONTACTED leads
    {
      name: 'Derek Owens', email: 'derek@brightwave.io', phone: '+1 555-505-6060',
      company: 'BrightWave Digital', source: 'EVENT', status: 'CONTACTED', priority: 'HIGH',
      estimatedValue: 95000, expectedCloseDate: daysFromNow(20), assignedToId: sarah.id, createdById: admin.id,
    },
    {
      name: 'Yuki Tanaka', email: 'yuki@vertexai.jp', phone: '+1 555-606-7070',
      company: 'Vertex AI Japan', source: 'PARTNER', status: 'CONTACTED', priority: 'HIGH',
      estimatedValue: 120000, expectedCloseDate: daysFromNow(15), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Amara Osei', email: 'amara@pinnaclegroup.gh', phone: '+1 555-707-8080',
      company: 'Pinnacle Group', source: 'REFERRAL', status: 'CONTACTED', priority: 'MEDIUM',
      estimatedValue: 36000, expectedCloseDate: daysFromNow(35), assignedToId: sarah.id, createdById: sarah.id,
    },
    {
      name: 'Carlos Mendez', email: 'carlos@solarbright.mx', phone: '+1 555-808-9090',
      company: 'SolarBright Energy', source: 'WEBSITE', status: 'CONTACTED', priority: 'LOW',
      estimatedValue: 19500, expectedCloseDate: daysFromNow(55), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Lena Fischer', email: 'lena@alphatech.de', phone: '+49 30 555-1010',
      company: 'AlphaTech GmbH', source: 'LINKEDIN', status: 'CONTACTED', priority: 'MEDIUM',
      estimatedValue: 55000, expectedCloseDate: daysFromNow(40), assignedToId: sarah.id, createdById: admin.id,
    },
    // QUALIFIED leads
    {
      name: 'Tomás Rivera', email: 'tomas@logicbridge.co', phone: '+1 555-111-2222',
      company: 'LogicBridge Consulting', source: 'COLD_EMAIL', status: 'QUALIFIED', priority: 'HIGH',
      estimatedValue: 88000, expectedCloseDate: daysFromNow(12), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Isabella Rossi', email: 'isabella@fusionworks.it', phone: '+39 02 555-3333',
      company: 'FusionWorks SpA', source: 'EVENT', status: 'QUALIFIED', priority: 'MEDIUM',
      estimatedValue: 64000, expectedCloseDate: daysFromNow(22), assignedToId: sarah.id, createdById: sarah.id,
    },
    {
      name: 'Kevin Zhao', email: 'kevin@quantumsys.cn', phone: '+1 555-444-5555',
      company: 'Quantum Systems', source: 'PARTNER', status: 'QUALIFIED', priority: 'HIGH',
      estimatedValue: 150000, expectedCloseDate: daysFromNow(8), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Nadia Kowalski', email: 'nadia@polarbyte.pl', phone: '+48 22 555-6666',
      company: 'PolarByte Solutions', source: 'REFERRAL', status: 'QUALIFIED', priority: 'LOW',
      estimatedValue: 22000, expectedCloseDate: daysFromNow(70), assignedToId: sarah.id, createdById: admin.id,
    },
    {
      name: 'Rashid Al-Farsi', email: 'rashid@deserttech.ae', phone: '+971 4 555-7777',
      company: 'DesertTech UAE', source: 'LINKEDIN', status: 'QUALIFIED', priority: 'MEDIUM',
      estimatedValue: 78000, expectedCloseDate: daysFromNow(25), assignedToId: admin.id, createdById: admin.id,
    },
    // PROPOSAL leads
    {
      name: 'Sophie Martin', email: 'sophie@luminary.fr', phone: '+33 1 555-8888',
      company: 'Luminary SAS', source: 'WEBSITE', status: 'PROPOSAL', priority: 'HIGH',
      estimatedValue: 110000, expectedCloseDate: daysFromNow(6), assignedToId: sarah.id, createdById: admin.id,
    },
    {
      name: 'Arjun Sharma', email: 'arjun@infiniteleap.in', phone: '+91 98 555-9999',
      company: 'InfiniteLeap Technologies', source: 'COLD_EMAIL', status: 'PROPOSAL', priority: 'HIGH',
      estimatedValue: 200000, expectedCloseDate: daysFromNow(4), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Elena Vasquez', email: 'elena@crystalline.es', phone: '+34 91 555-0001',
      company: 'Crystalline Labs', source: 'PARTNER', status: 'PROPOSAL', priority: 'MEDIUM',
      estimatedValue: 47000, expectedCloseDate: daysFromNow(18), assignedToId: sarah.id, createdById: sarah.id,
    },
    {
      name: 'Finn Andersen', email: 'finn@nordicops.dk', phone: '+45 33 555-0002',
      company: 'NordicOps A/S', source: 'EVENT', status: 'PROPOSAL', priority: 'LOW',
      estimatedValue: 31000, expectedCloseDate: daysFromNow(42), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Mei-Lin Chen', email: 'meilin@pearldigital.tw', phone: '+886 2 555-0003',
      company: 'Pearl Digital', source: 'REFERRAL', status: 'PROPOSAL', priority: 'MEDIUM',
      estimatedValue: 58000, expectedCloseDate: daysFromNow(10), assignedToId: sarah.id, createdById: admin.id,
    },
    // WON leads
    {
      name: 'Omar Hassan', email: 'omar@horizonlogic.eg', phone: '+20 2 555-0004',
      company: 'Horizon Logic', source: 'LINKEDIN', status: 'WON', priority: 'HIGH',
      estimatedValue: 130000, expectedCloseDate: daysAgo(5), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Vanessa Okoro', email: 'vanessa@sparkbridge.ng', phone: '+234 1 555-0005',
      company: 'SparkBridge Africa', source: 'REFERRAL', status: 'WON', priority: 'MEDIUM',
      estimatedValue: 45000, expectedCloseDate: daysAgo(10), assignedToId: sarah.id, createdById: sarah.id,
    },
    {
      name: 'Paulo Sousa', email: 'paulo@vortexbr.com.br', phone: '+55 11 555-0006',
      company: 'Vortex Brasil', source: 'WEBSITE', status: 'WON', priority: 'LOW',
      estimatedValue: 18000, expectedCloseDate: daysAgo(20), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Kirra Anderson', email: 'kirra@southerncloud.au', phone: '+61 2 555-0007',
      company: 'Southern Cloud Pty', source: 'EVENT', status: 'WON', priority: 'HIGH',
      estimatedValue: 85000, expectedCloseDate: daysAgo(3), assignedToId: sarah.id, createdById: admin.id,
    },
    // LOST leads
    {
      name: 'Viktor Petrov', email: 'viktor@ironforge.ru', phone: '+7 495 555-0008',
      company: 'IronForge Systems', source: 'COLD_EMAIL', status: 'LOST', priority: 'MEDIUM',
      estimatedValue: 35000, expectedCloseDate: daysAgo(15), assignedToId: admin.id, createdById: admin.id,
    },
    {
      name: 'Hana Yamamoto', email: 'hana@celticwave.ie', phone: '+353 1 555-0009',
      company: 'CelticWave Ltd', source: 'PARTNER', status: 'LOST', priority: 'LOW',
      estimatedValue: 12000, expectedCloseDate: daysAgo(30), assignedToId: sarah.id, createdById: sarah.id,
    },
  ];

  const leads = await Promise.all(leadsData.map((l) => prisma.lead.create({ data: l })));

  const activityTypes = ['CALL', 'EMAIL', 'MEETING', 'NOTE', 'FOLLOW_UP'];

  const activitiesData = [
    // Lead 0 — Marcus Webb (NEW, HIGH)
    { leadId: leads[0].id, type: 'EMAIL', title: 'Intro email sent', description: 'Sent product overview deck', dueDate: daysAgo(2), completed: true },
    { leadId: leads[0].id, type: 'FOLLOW_UP', title: 'Follow up on intro email', dueDate: daysAgo(1), completed: false },
    { leadId: leads[0].id, type: 'CALL', title: 'Discovery call scheduled', dueDate: daysFromNow(2), completed: false },
    // Lead 1 — Priya Mehta (NEW, MEDIUM)
    { leadId: leads[1].id, type: 'EMAIL', title: 'Initial outreach', dueDate: daysAgo(5), completed: true },
    { leadId: leads[1].id, type: 'FOLLOW_UP', title: 'Check in', dueDate: daysAgo(3), completed: false },
    // Lead 2 — Jordan Lee (NEW, LOW) — no activities (for insight panel test)
    // Lead 3 — Fatima (NEW, MEDIUM)
    { leadId: leads[3].id, type: 'EMAIL', title: 'Cold email sent', dueDate: daysAgo(7), completed: true },
    // Lead 4 — Derek Owens (CONTACTED, HIGH)
    { leadId: leads[4].id, type: 'CALL', title: 'Initial discovery call', description: 'Discussed pain points in current CRM', dueDate: daysAgo(10), completed: true },
    { leadId: leads[4].id, type: 'EMAIL', title: 'Sent case studies', dueDate: daysAgo(8), completed: true },
    { leadId: leads[4].id, type: 'FOLLOW_UP', title: 'Confirm demo slot', dueDate: daysAgo(2), completed: false },
    { leadId: leads[4].id, type: 'MEETING', title: 'Product demo', dueDate: daysFromNow(3), completed: false },
    // Lead 5 — Yuki Tanaka (CONTACTED, HIGH)
    { leadId: leads[5].id, type: 'CALL', title: 'Intro call', dueDate: daysAgo(14), completed: true },
    { leadId: leads[5].id, type: 'EMAIL', title: 'Sent pricing sheet', dueDate: daysAgo(5), completed: true },
    { leadId: leads[5].id, type: 'FOLLOW_UP', title: 'Follow up on pricing', dueDate: daysAgo(1), completed: false },
    // Lead 6 — Amara Osei (CONTACTED, MEDIUM)
    { leadId: leads[6].id, type: 'EMAIL', title: 'First contact', dueDate: daysAgo(6), completed: true },
    { leadId: leads[6].id, type: 'FOLLOW_UP', title: 'Schedule call', dueDate: daysAgo(4), completed: false },
    // Lead 7 — Carlos Mendez (CONTACTED, LOW)
    { leadId: leads[7].id, type: 'EMAIL', title: 'Newsletter signup response', dueDate: daysAgo(3), completed: true },
    // Lead 8 — Lena Fischer (CONTACTED, MEDIUM)
    { leadId: leads[8].id, type: 'CALL', title: 'Intro call', dueDate: daysAgo(8), completed: true },
    { leadId: leads[8].id, type: 'EMAIL', title: 'Sent brochure', dueDate: daysAgo(6), completed: true },
    { leadId: leads[8].id, type: 'FOLLOW_UP', title: 'Check interest level', dueDate: daysAgo(2), completed: false },
    // Lead 9 — Tomás Rivera (QUALIFIED, HIGH)
    { leadId: leads[9].id, type: 'CALL', title: 'Qualification call', description: 'Confirmed budget & timeline', dueDate: daysAgo(12), completed: true },
    { leadId: leads[9].id, type: 'MEETING', title: 'Stakeholder presentation', dueDate: daysAgo(6), completed: true },
    { leadId: leads[9].id, type: 'EMAIL', title: 'Sent SOW draft', dueDate: daysAgo(3), completed: true },
    { leadId: leads[9].id, type: 'FOLLOW_UP', title: 'SOW review feedback', dueDate: daysAgo(1), completed: false },
    // Lead 10 — Isabella Rossi (QUALIFIED, MEDIUM)
    { leadId: leads[10].id, type: 'CALL', title: 'Qualification call', dueDate: daysAgo(9), completed: true },
    { leadId: leads[10].id, type: 'MEETING', title: 'Technical deep-dive', dueDate: daysAgo(5), completed: true },
    { leadId: leads[10].id, type: 'FOLLOW_UP', title: 'Confirm next steps', dueDate: daysAgo(2), completed: false },
    // Lead 11 — Kevin Zhao (QUALIFIED, HIGH)
    { leadId: leads[11].id, type: 'CALL', title: 'Exec intro call', dueDate: daysAgo(15), completed: true },
    { leadId: leads[11].id, type: 'MEETING', title: 'Technical evaluation', dueDate: daysAgo(10), completed: true },
    { leadId: leads[11].id, type: 'MEETING', title: 'Budget approval meeting', dueDate: daysAgo(4), completed: true },
    { leadId: leads[11].id, type: 'FOLLOW_UP', title: 'Confirm proposal timeline', dueDate: daysAgo(1), completed: false },
    // Lead 12 — Nadia Kowalski (QUALIFIED, LOW)
    { leadId: leads[12].id, type: 'EMAIL', title: 'Qualification email exchange', dueDate: daysAgo(10), completed: true },
    { leadId: leads[12].id, type: 'CALL', title: 'Needs assessment', dueDate: daysAgo(7), completed: true },
    // Lead 13 — Rashid Al-Farsi (QUALIFIED, MEDIUM)
    { leadId: leads[13].id, type: 'CALL', title: 'Initial discovery', dueDate: daysAgo(20), completed: true },
    { leadId: leads[13].id, type: 'MEETING', title: 'Requirements workshop', dueDate: daysAgo(12), completed: true },
    { leadId: leads[13].id, type: 'EMAIL', title: 'Sent technical specs', dueDate: daysAgo(5), completed: true },
    { leadId: leads[13].id, type: 'FOLLOW_UP', title: 'Specs approval', dueDate: daysAgo(2), completed: false },
    // Lead 14 — Sophie Martin (PROPOSAL, HIGH)
    { leadId: leads[14].id, type: 'CALL', title: 'Proposal walkthrough', dueDate: daysAgo(8), completed: true },
    { leadId: leads[14].id, type: 'MEETING', title: 'Final negotiation', dueDate: daysAgo(3), completed: true },
    { leadId: leads[14].id, type: 'FOLLOW_UP', title: 'Contract sign-off', dueDate: daysAgo(1), completed: false },
    // Lead 15 — Arjun Sharma (PROPOSAL, HIGH)
    { leadId: leads[15].id, type: 'MEETING', title: 'Executive proposal review', dueDate: daysAgo(5), completed: true },
    { leadId: leads[15].id, type: 'CALL', title: 'Legal review discussion', dueDate: daysAgo(3), completed: true },
    { leadId: leads[15].id, type: 'FOLLOW_UP', title: 'Final decision', dueDate: daysFromNow(2), completed: false },
    // Lead 16 — Elena Vasquez (PROPOSAL, MEDIUM)
    { leadId: leads[16].id, type: 'CALL', title: 'Proposal sent & reviewed', dueDate: daysAgo(10), completed: true },
    { leadId: leads[16].id, type: 'FOLLOW_UP', title: 'Clarification questions', dueDate: daysAgo(5), completed: false },
    // Lead 17 — Finn Andersen (PROPOSAL, LOW)
    { leadId: leads[17].id, type: 'EMAIL', title: 'Proposal emailed', dueDate: daysAgo(7), completed: true },
    { leadId: leads[17].id, type: 'FOLLOW_UP', title: 'Awaiting internal approval', dueDate: daysAgo(3), completed: false },
    // Lead 18 — Mei-Lin Chen (PROPOSAL, MEDIUM)
    { leadId: leads[18].id, type: 'MEETING', title: 'Proposal presentation', dueDate: daysAgo(6), completed: true },
    { leadId: leads[18].id, type: 'FOLLOW_UP', title: 'Revision feedback', dueDate: daysAgo(2), completed: false },
    // WON leads — historical activities
    { leadId: leads[19].id, type: 'CALL', title: 'Closed deal call', dueDate: daysAgo(8), completed: true },
    { leadId: leads[19].id, type: 'NOTE', title: 'Deal closed successfully', description: 'Contract signed at full value', dueDate: daysAgo(5), completed: true },
    { leadId: leads[20].id, type: 'CALL', title: 'Final negotiation', dueDate: daysAgo(12), completed: true },
    { leadId: leads[20].id, type: 'NOTE', title: 'Onboarding started', dueDate: daysAgo(10), completed: true },
    { leadId: leads[21].id, type: 'EMAIL', title: 'Contract emailed', dueDate: daysAgo(22), completed: true },
    { leadId: leads[22].id, type: 'MEETING', title: 'Closing meeting', dueDate: daysAgo(5), completed: true },
    // LOST leads — historical
    { leadId: leads[23].id, type: 'CALL', title: 'Final check-in', description: 'Prospect went with competitor', dueDate: daysAgo(18), completed: true },
    { leadId: leads[24].id, type: 'EMAIL', title: 'Last follow-up', description: 'No budget approved for this year', dueDate: daysAgo(32), completed: true },
  ];

  await prisma.activity.createMany({ data: activitiesData });

  const notesData = [
    { leadId: leads[0].id, content: 'CTO is the main decision maker. Very interested in AI integrations.' },
    { leadId: leads[0].id, content: 'They are currently using Salesforce but finding it too expensive.' },
    { leadId: leads[1].id, content: 'Referred by Kevin Zhao — warm connection. Mention Quantum Systems deal.' },
    { leadId: leads[1].id, content: 'Budget cycle starts Q3. Target proposal before end of June.' },
    { leadId: leads[3].id, content: 'Responded positively to cold email. Schedule discovery ASAP.' },
    { leadId: leads[4].id, content: 'Company growing fast — 200 to 500 employees this year. Urgency is real.' },
    { leadId: leads[4].id, content: 'VP of Sales is champion. CFO needs to approve anything over $50k.' },
    { leadId: leads[5].id, content: 'Japanese market expansion requires localized pricing tier.' },
    { leadId: leads[5].id, content: 'Partnership with Vertex HQ would open 3 other enterprise accounts.' },
    { leadId: leads[6].id, content: 'Met at TechSummit Accra. Strong referral from their MD.' },
    { leadId: leads[8].id, content: 'Need to follow up in German — their English proficiency is limited.' },
    { leadId: leads[9].id, content: 'Budget confirmed at $80-90k. Need to finalize SOW by end of month.' },
    { leadId: leads[9].id, content: 'Their legal team needs 3-week review on all contracts.' },
    { leadId: leads[10].id, content: 'Integration with SAP is a must-have requirement.' },
    { leadId: leads[11].id, content: 'Largest deal in pipeline. Involves 5 subsidiaries across APAC.' },
    { leadId: leads[11].id, content: 'Board approval required — timeline depends on their Q2 board meeting.' },
    { leadId: leads[13].id, content: 'UAE compliance standards need to be covered in contract annex.' },
    { leadId: leads[14].id, content: 'Deal stuck on liability clause. Legal team reviewing.' },
    { leadId: leads[14].id, content: 'If signed this month, they want implementation to start immediately.' },
    { leadId: leads[15].id, content: 'Largest deal ever — involves full enterprise rollout across 12 offices.' },
    { leadId: leads[15].id, content: 'Payment in 3 installments. First payment upon contract signature.' },
    { leadId: leads[16].id, content: 'They requested a pilot project for 60 days before full commitment.' },
    { leadId: leads[18].id, content: 'Needs multi-currency support — they bill in TWD and USD.' },
    { leadId: leads[19].id, content: 'Excellent client. Consider for case study and referral program.' },
    { leadId: leads[20].id, content: 'Smooth deal — great champion in Vanessa. Possible upsell in 6 months.' },
    { leadId: leads[23].id, content: 'Lost to HubSpot on price. Could revisit in 12 months.' },
    { leadId: leads[24].id, content: 'Tight budget — they may come back next FY. Keep warm.' },
  ];

  await prisma.dealNote.createMany({ data: notesData });

  console.log('Seed complete:');
  console.log(`  Users: 2`);
  console.log(`  Leads: ${leads.length}`);
  console.log(`  Activities: ${activitiesData.length}`);
  console.log(`  Notes: ${notesData.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
