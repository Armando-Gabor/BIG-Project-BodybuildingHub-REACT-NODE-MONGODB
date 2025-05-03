// Utility za generiranje PDF izvještaja o treninzima
// Omogućuje stvaranje strukturiranih izvještaja o povijesti treninga
import { jsPDF } from "jspdf";

// Generiranje PDF izvještaja o filtriranim treninzima
export function generatePdfReport(
  savedWorkouts,
  filterMuscles,
  startDate,
  endDate,
  sortOrder,
  t
) {
  // Provjera postoje li treninzi za izvještaj
  if (savedWorkouts.length === 0) {
    alert(t("workouts.report.noWorkouts"));
    return;
  }

  // Stvaranje novog PDF dokumenta s podrškom za Unicode znakove (hrvatski)
  const doc = new jsPDF({
    orientation: "portrait", // Okomita orijentacija
    unit: "mm", // Mjerna jedinica: milimetri
    format: "a4", // Format papira: A4
    putOnlyUsedFonts: true, // Optimizacija veličine PDF-a
  });

  // Dodavanje fonta koji ispravno podržava hrvatske znakove
  doc.addFont("times", "Times", "normal");
  doc.setFont("Times");

  // Širina stranice za izračune centriranja elemenata
  const pageWidth = doc.internal.pageSize.getWidth();

  // Dodavanje naslova izvještaja
  doc.setFontSize(20);
  doc.setTextColor(128, 0, 128);
  const title = t("workouts.report.title");
  doc.text(title, pageWidth / 2, 15, { align: "center" });

  // Dodavanje datuma generiranja izvještaja
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const dateText = `${t(
    "workouts.report.generatedOn"
  )}: ${new Date().toLocaleString()}`;
  doc.text(dateText, pageWidth / 2, 22, {
    align: "center",
  });

  // Dodavanje informacija o filterima
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let yPos = 30;

  // Prikaz vremenskog raspona ako je definiran
  if (startDate || endDate) {
    let dateText = `${t("workouts.report.dateRange")}: `;
    if (startDate) dateText += `${t("workouts.report.from")} ${startDate} `;
    if (endDate) dateText += `${t("workouts.report.to")} ${endDate}`;
    doc.text(dateText, pageWidth / 2, yPos, { align: "center" });
    yPos += 7;
  }

  // Prikaz redoslijeda sortiranja
  doc.text(
    `${t("workouts.report.sortOrder")}: ${
      sortOrder === "asc"
        ? t("workouts.report.oldestFirst")
        : t("workouts.report.newestFirst")
    }`,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  yPos += 12;

  // Obrada svakog treninga
  savedWorkouts.forEach((workout) => {
    // Dodavanje nove stranice ako je potrebno
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Zaglavlje treninga
    doc.setFontSize(16);
    doc.setTextColor(128, 0, 128);
    doc.text(`${workout.name}`, pageWidth / 2, yPos, { align: "center" });
    yPos += 5;

    // Datum treninga i ciljane mišićne skupine
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${t("workouts.report.date")}: ${new Date(
        workout.date
      ).toLocaleDateString()}`,
      pageWidth / 2,
      yPos,
      { align: "center" }
    );
    yPos += 10;

    // Obrada svake vježbe u treningu
    workout.exercises.forEach((exercise) => {
      // Dodavanje nove stranice ako je potrebno
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Naziv vježbe
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `${t("workouts.report.exercise")}: ${exercise.name}`,
        pageWidth / 2,
        yPos,
        {
          align: "center",
        }
      );
      yPos += 3;

      // Izračun širine tablice i pozicije za centriranje
      const tableWidth = 90;
      const tableX = (pageWidth - tableWidth) / 2;

      // Zaglavlje tablice
      doc.setFillColor(128, 0, 128);
      doc.setDrawColor(128, 0, 128);
      doc.setTextColor(255, 255, 255);

      // Crtanje ćelija zaglavlja tablice
      doc.rect(tableX, yPos, 25, 7, "F");
      doc.rect(tableX + 25, yPos, 35, 7, "F");
      doc.rect(tableX + 60, yPos, 30, 7, "F");

      // Dodavanje teksta zaglavlja
      doc.text(t("workouts.report.set"), tableX + 12.5, yPos + 5, {
        align: "center",
      });
      doc.text(t("workouts.report.weight"), tableX + 25 + 17.5, yPos + 5, {
        align: "center",
      });
      doc.text(t("workouts.report.reps"), tableX + 60 + 15, yPos + 5, {
        align: "center",
      });
      yPos += 7;

      // Redovi tablice
      doc.setTextColor(0, 0, 0);
      doc.setDrawColor(200, 200, 200);

      // Obrada svakog seta vježbe
      exercise.sets.forEach((set, idx) => {
        // Dodavanje nove stranice ako je potrebno
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;

          // Ponovno dodavanje zaglavlja na novoj stranici
          doc.setFillColor(128, 0, 128);
          doc.setDrawColor(128, 0, 128);
          doc.setTextColor(255, 255, 255);

          doc.rect(tableX, yPos, 25, 7, "F");
          doc.rect(tableX + 25, yPos, 35, 7, "F");
          doc.rect(tableX + 60, yPos, 30, 7, "F");

          doc.text(t("workouts.report.set"), tableX + 12.5, yPos + 5, {
            align: "center",
          });
          doc.text(t("workouts.report.weight"), tableX + 25 + 17.5, yPos + 5, {
            align: "center",
          });
          doc.text(t("workouts.report.reps"), tableX + 60 + 15, yPos + 5, {
            align: "center",
          });
          yPos += 7;
          doc.setTextColor(0, 0, 0);
        }

        // Crtanje okvira ćelija
        doc.rect(tableX, yPos, 25, 7);
        doc.rect(tableX + 25, yPos, 35, 7);
        doc.rect(tableX + 60, yPos, 30, 7);

        // Dodavanje sadržaja ćelija
        doc.text(`${idx + 1}`, tableX + 12.5, yPos + 5, { align: "center" });
        doc.text(`${set.weight}`, tableX + 25 + 17.5, yPos + 5, {
          align: "center",
        });
        doc.text(`${set.reps}`, tableX + 60 + 15, yPos + 5, {
          align: "center",
        });

        yPos += 7;
      });

      yPos += 12; // Dodavanje razmaka nakon tablice
    });
  });

  // Spremanje PDF-a
  doc.save(
    `${t("workouts.report.filename")}-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
}
