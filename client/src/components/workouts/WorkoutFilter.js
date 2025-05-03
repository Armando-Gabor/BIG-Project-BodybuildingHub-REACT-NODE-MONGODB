// Komponenta za filtriranje i sortiranje liste treninga
// Omogućava filtriranje po mišićnoj skupini, datumu i sortiranje
import React from "react";
import { useTranslation } from "react-i18next";
import MuscleGroupSelector from "./MuscleGroupSelector";

const WorkoutFilter = ({
  filterMuscles,
  handleFilterMuscleChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortOrder,
  setSortOrder,
  clearFilters,
  generatePdfReport,
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="mb-6 bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold text-gray-300 mb-3 text-center">
        {t("workouts.filter")}
      </h3>

      {/* Selektor mišićnih skupina za filtriranje */}
      <div className="mb-4 text-sm">
        <MuscleGroupSelector
          selectedMuscles={filterMuscles}
          onMuscleChange={handleFilterMuscleChange}
          label={t("workouts.byMuscleGroup")}
        />
      </div>

      {/* Polja za filtriranje po datumu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-300">
            {t("workouts.startDate")}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-300">
            {t("workouts.endDate")}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Kontrole za sortiranje, čišćenje filtera i generiranje PDF izvještaja */}
      <div className="flex justify-between gap-2 sm:flex-row flex-col">
        {/* Kontrole za sortiranje po datumu */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-300">
            {t("workouts.sortByDate")}
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setSortOrder("desc")}
              className={`px-3 py-1 rounded text-sm ${
                sortOrder === "desc"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t("workouts.newestFirst")}
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("asc")}
              className={`px-3 py-1 rounded text-sm ${
                sortOrder === "asc"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t("workouts.oldestFirst")}
            </button>
          </div>
        </div>

        {/* Gumb za čišćenje filtera */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-300">
            {t("workouts.clearingFilters")}
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              {t("workouts.clearFilters")}
            </button>
          </div>
        </div>

        {/* Gumb za generiranje PDF izvještaja */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-300">
            {t("workouts.pdfReportLabel")}
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={generatePdfReport}
              className="px-3 py-1 rounded text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white self-end flex items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              {t("workouts.generateReport")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFilter;
