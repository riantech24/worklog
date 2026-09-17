/**
 * Seed data (§65).
 *
 * Mirrors the real 13 August – 12 September 2026 PUSKAPA period so the
 * timesheet, service log and invoice phases can be checked against documents
 * that already exist: 78 hours, 9.75 days, IDR 3,900,000, INV/018/IX/26.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient, Prisma } from "@prisma/client";

const db = new PrismaClient();

const TZ_OFFSET_HOURS = 7; // Asia/Jakarta, no DST
const SEED_EMAIL = (process.env.SEED_USER_EMAIL ?? "rian@example.com").toLowerCase();
const RATE_PER_DAY = 400_000;
const HOURS_PER_WORKDAY = 8;

/** A calendar date, as stored in a @db.Date column. */
function day(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** A wall-clock time in Jakarta, as a UTC instant. */
function at(iso: string, time: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - TZ_OFFSET_HOURS, mm));
}

type SeedEntry = {
  date: string;
  start: string;
  end: string;
  hours: number;
  category: string;
  title: string;
  description: string;
  participants: string;
  notes?: string;
};

const ENTRIES: SeedEntry[] = [
  {
    date: "2026-08-20",
    start: "10:00",
    end: "18:00",
    hours: 7,
    category: "IT Support",
    title: "Office standby, video editing and SIM PUSKAPA review",
    description:
      "Melakukan standby kantor, mengedit video testimoni Pelatihan Meneliti Bersama Anak, menangani error pada CCTV, serta melakukan review alur sistem SIM PUSKAPA dan mengidentifikasi area yang perlu dikembangkan lebih lanjut.",
    participants: "Rasti, Gobi",
  },
  {
    date: "2026-08-21",
    start: "14:00",
    end: "18:00",
    hours: 4,
    category: "System Development",
    title: "SIM PUSKAPA frontend and backend analysis",
    description:
      "Melakukan analisis terhadap struktur frontend dan backend SIM PUSKAPA bagian error employee list dan project list.",
    participants: "Rasti",
  },
  {
    date: "2026-08-22",
    start: "10:00",
    end: "16:00",
    hours: 5,
    category: "System Development",
    title: "SIM PUSKAPA frontend update and testing",
    description:
      "Melakukan pembaruan komponen frontend dan alur aplikasi SIM PUSKAPA serta melakukan pengujian terhadap perubahan yang telah diterapkan.",
    participants: "Rasti",
  },
  {
    date: "2026-08-27",
    start: "10:00",
    end: "18:00",
    hours: 7,
    category: "IT Support",
    title: "Video finalisation, e-poster and SIM PUSKAPA development",
    description:
      "Melakukan standby kantor, finalisasi video testimoni Pelatihan Meneliti Bersama Anak, membuat e-Poster Pelatihan Meneliti Bersama Anak Batch 2, serta melanjutkan pengembangan frontend dan troubleshooting backend SIM PUSKAPA.",
    participants: "Rasti, Gobi",
  },
  {
    date: "2026-08-28",
    start: "10:00",
    end: "18:00",
    hours: 7,
    category: "System Development",
    title: "SIM PUSKAPA technical meeting and workflow updates",
    description:
      "Mengikuti technical meeting SIM PUSKAPA untuk pengujian alur aplikasi dan penyelesaian kendala pengembangan, memperbarui logic backend dan memvalidasi respons API, serta memperbarui alur Project, Activity, Sub-Activity, dan Budget Needs.",
    participants: "Rasti",
  },
  {
    date: "2026-08-31",
    start: "10:00",
    end: "18:00",
    hours: 7,
    category: "System Administration",
    title: "SIM PUSKAPA role management and access control",
    description:
      "Melakukan review perilaku aplikasi terkait user access dan role, memperbarui role management dan permission handling, melakukan troubleshooting authentication dan user access flow, serta memperbarui role access dan JWT flow disertai pengujian access control dan proses build aplikasi.",
    participants: "Rasti",
  },
  {
    date: "2026-09-01",
    start: "10:00",
    end: "18:00",
    hours: 7,
    category: "IT Support",
    title: "Town hall, e-signature certificates and asset check",
    description:
      "Melakukan standby kantor, mengikuti Town Hall Meeting PUSKAPA, membuat nomor sertifikat, QR Code, dan halaman e-signature untuk sertifikat Pelatihan Safeguarding, serta melakukan pengecekan laptop staf dan rekapitulasi data aset tahun 2026.",
    participants: "Rasti, Gobi",
  },
  {
    date: "2026-09-02",
    start: "10:00",
    end: "16:00",
    hours: 4,
    category: "System Development",
    title: "SIM PUSKAPA payment request workflow",
    description:
      "Melakukan pengujian workflow dan proses approval Payment Request pada SIM PUSKAPA, melakukan troubleshooting alur pengecekan dan approval oleh Finance Team, serta memperbarui payment workflow dan menguji role-based actions serta responsive table UI.",
    participants: "Rasti",
  },
  {
    date: "2026-09-03",
    start: "10:30",
    end: "17:30",
    hours: 6,
    category: "Asset Management",
    title: "Learning Hub preparation meeting and asset recap",
    description:
      "Melakukan standby kantor, mengikuti monthly meeting persiapan Learning Hub, serta melanjutkan rekapitulasi data aset tahun 2026.",
    participants: "Rasti, Gobi, Bill",
  },
  {
    date: "2026-09-07",
    start: "10:00",
    end: "11:00",
    hours: 1,
    category: "Data Entry",
    title: "Instagram Ads estimation spreadsheet",
    description:
      "Menyusun rekapitulasi spreadsheet estimasi biaya dan kebutuhan Instagram Ads untuk keperluan perencanaan promosi.",
    participants: "Bill",
  },
  {
    date: "2026-09-08",
    start: "10:00",
    end: "18:00",
    hours: 7,
    category: "IT Support",
    title: "Instagram Ads management and payment workflow fixes",
    description:
      "Melakukan standby kantor, mengelola promosi Instagram Ads melalui Meta Business, serta melanjutkan troubleshooting payment workflow dan validasi tampilan antarmuka SIM PUSKAPA.",
    participants: "Rasti",
  },
  {
    date: "2026-09-09",
    start: "10:00",
    end: "14:00",
    hours: 3,
    category: "System Development",
    title: "SIM PUSKAPA access and payment flow finalisation",
    description:
      "Menyelesaikan penyesuaian access flow dan payment flow pada SIM PUSKAPA serta melakukan testing dan troubleshooting untuk memastikan fungsi berjalan sesuai kebutuhan.",
    participants: "Rasti",
  },
  {
    date: "2026-09-10",
    start: "10:30",
    end: "18:30",
    hours: 7,
    category: "IT Support",
    title: "User guide simulation, ads monitoring and video capture",
    description:
      "Melakukan standby kantor, mengikuti simulasi User Guide SIM PUSKAPA, melakukan monitoring Instagram Ads melalui Meta Business, melanjutkan pengecekan aset laptop, serta melakukan pengambilan video presentasi untuk kebutuhan promosi Pelatihan Meneliti Bersama Anak Batch 2.",
    participants: "Rasti, Melisa, Helga",
  },
  {
    date: "2026-09-11",
    start: "10:30",
    end: "16:30",
    hours: 5,
    category: "Asset Management",
    title: "Asset disposal recap and PR/APR/TR/APS workflow",
    description:
      "Melakukan standby kantor, menyelesaikan rekapitulasi data disposal asset tahun 2026, serta melakukan troubleshooting status workflow PR, APR, TR, dan APS pada SIM PUSKAPA termasuk validasi frontend/backend, proses build, dan testing.",
    participants: "Rasti",
  },
  {
    date: "2026-09-13",
    start: "13:00",
    end: "14:00",
    hours: 1,
    category: "Video Editing",
    title: "First draft of two promotional videos",
    description:
      "Melakukan editing draft pertama dua video promosi Pelatihan Meneliti Bersama Anak Batch 2 untuk kebutuhan publikasi dan promosi kegiatan.",
    participants: "Melisa, Helga",
    notes: "Masih dikerjakan saat log penggunaan jasa ditandatangani.",
  },
];

async function main() {
  const user = await db.user.upsert({
    where: { email: SEED_EMAIL },
    update: {},
    create: {
      email: SEED_EMAIL,
      name: "Rian Agil Al Munawar",
      jobTitle: "IT Support Assistant",
      timezone: "Asia/Jakarta",
      currency: "IDR",
      locale: "en",
    },
  });

  const client = await db.client.upsert({
    where: { id: `seed-client-${user.id}` },
    update: {},
    create: {
      id: `seed-client-${user.id}`,
      userId: user.id,
      name: "PUSKAPA",
      organization: "Center on Child Protection & Wellbeing, Universitas Indonesia",
      contactPerson: "Rasti Setiawati",
      email: "puskapa@puskapa.org",
      phone: "+62 21 78849181",
      address:
        "Nusantara II Building (formerly PAU Ekonomi)\n1st Floor, Faculty of Social and Political Sciences (FISIP UI)\nUniversity of Indonesia, Depok Campus\nDepok, Indonesia",
      defaultRate: new Prisma.Decimal(RATE_PER_DAY),
      defaultBillingType: "PER_DAY",
      currency: "IDR",
    },
  });

  const project = await db.project.upsert({
    where: { id: `seed-project-${user.id}` },
    update: {},
    create: {
      id: `seed-project-${user.id}`,
      userId: user.id,
      clientId: client.id,
      name: "IT Support Assistant",
      description:
        "IT support, system development and multimedia assistance for PUSKAPA.",
      startDate: day("2026-08-13"),
      status: "ACTIVE",
      billingType: "PER_DAY",
      defaultRate: new Prisma.Decimal(RATE_PER_DAY),
      hoursPerWorkday: new Prisma.Decimal(HOURS_PER_WORKDAY),
      color: "#a4620c",
    },
  });

  await db.projectRate.deleteMany({ where: { projectId: project.id } });
  await db.projectRate.create({
    data: {
      projectId: project.id,
      billingType: "PER_DAY",
      rate: new Prisma.Decimal(RATE_PER_DAY),
      effectiveFrom: day("2026-08-13"),
    },
  });

  // Re-runnable: clear only this project's seeded entries.
  await db.workEntry.deleteMany({ where: { userId: user.id, projectId: project.id } });

  let totalMinutes = 0;
  let totalDayUnits = 0;

  for (const entry of ENTRIES) {
    const start = at(entry.date, entry.start);
    const end = at(entry.date, entry.end);
    const spanMinutes = (end.getTime() - start.getTime()) / 60000;
    const durationMinutes = entry.hours * 60;
    const breakMinutes = Math.max(0, spanMinutes - durationMinutes);
    const dayUnits = durationMinutes / 60 / HOURS_PER_WORKDAY;
    const billableAmount = dayUnits * RATE_PER_DAY;

    totalMinutes += durationMinutes;
    totalDayUnits += dayUnits;

    await db.workEntry.create({
      data: {
        userId: user.id,
        clientId: client.id,
        projectId: project.id,
        date: day(entry.date),
        startAt: start,
        endAt: end,
        breakMinutes,
        durationMinutes,
        dayUnits: new Prisma.Decimal(dayUnits.toFixed(3)),
        title: entry.title,
        category: entry.category,
        description: entry.description,
        participants: entry.participants,
        notes: entry.notes,
        status: "COMPLETED",
        source: "MANUAL",
        billable: true,
        billingType: "PER_DAY",
        rate: new Prisma.Decimal(RATE_PER_DAY),
        billableAmount: new Prisma.Decimal(billableAmount.toFixed(2)),
      },
    });
  }

  const template = await db.invoiceTemplate.upsert({
    where: { id: `seed-template-${user.id}` },
    update: {},
    create: {
      id: `seed-template-${user.id}`,
      userId: user.id,
      name: "Professional Minimal",
      isDefault: true,
      businessName: "Rian Agil Al Munawar",
      professionalTitle: "IT Support Assistant",
      bankName: "Bank Mandiri",
      bankAccount: "1270013573827",
      accountHolder: "RIAN AGIL AL MUNAWAR",
      declaration:
        "I hereby confirm that all tasks related to IT support and digital system maintenance have been completed properly and in accordance with the terms and agreements previously established. This declaration is made truthfully and in good faith, and may be used accordingly.",
      defaultRate: new Prisma.Decimal(RATE_PER_DAY),
      currency: "IDR",
      accentColor: "#e0a84b",
    },
  });

  const subtotal = totalDayUnits * RATE_PER_DAY;

  await db.invoice.deleteMany({ where: { userId: user.id, number: "INV/018/IX/26" } });
  const invoice = await db.invoice.create({
    data: {
      userId: user.id,
      clientId: client.id,
      projectId: project.id,
      templateId: template.id,
      number: "INV/018/IX/26",
      sequence: 18,
      issueDate: day("2026-09-16"),
      periodStart: day("2026-08-13"),
      periodEnd: day("2026-09-12"),
      status: "ISSUED",
      issuedAt: new Date(),
      currency: "IDR",
      subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
      total: new Prisma.Decimal(subtotal.toFixed(2)),
      declaration: template.declaration,
      paymentName: "RIAN AGIL AL MUNAWAR",
      bankName: "Bank Mandiri",
      bankAccount: "1270013573827",
      signerName: "Rian Agil Al Munawar",
      signerTitle: "IT Support Assistant",
      items: {
        create: [
          {
            position: 0,
            description: "IT Support Assistant",
            quantity: new Prisma.Decimal(totalDayUnits.toFixed(3)),
            unit: "Days",
            rate: new Prisma.Decimal(RATE_PER_DAY),
            amount: new Prisma.Decimal(subtotal.toFixed(2)),
          },
        ],
      },
    },
    include: { items: true },
  });

  // §29 — an issued invoice keeps its own copy of everything it printed.
  await db.invoiceSnapshot.create({
    data: {
      invoiceId: invoice.id,
      data: {
        number: invoice.number,
        issueDate: invoice.issueDate,
        period: { start: invoice.periodStart, end: invoice.periodEnd },
        client: {
          name: client.name,
          organization: client.organization,
          address: client.address,
        },
        items: invoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity.toString(),
          unit: item.unit,
          rate: item.rate.toString(),
          amount: item.amount.toString(),
        })),
        total: invoice.total.toString(),
        payment: {
          name: invoice.paymentName,
          bank: invoice.bankName,
          account: invoice.bankAccount,
        },
        declaration: invoice.declaration,
      },
    },
  });

  console.log("Seeded:");
  console.log(`  user           ${user.email}`);
  console.log(`  client         ${client.name}`);
  console.log(`  project        ${project.name}`);
  console.log(`  work entries   ${ENTRIES.length}`);
  console.log(`  total hours    ${totalMinutes / 60}`);
  console.log(`  total days     ${totalDayUnits}`);
  console.log(`  invoice        ${invoice.number} — IDR ${subtotal.toLocaleString("en-US")}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
