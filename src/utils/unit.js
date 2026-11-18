// Product size/weight label from the API's `unit` + `unit_type` fields (e.g. 30 + "gm" -> "30gm").
// Returns null when the product has no unit, so nothing is shown.
export const formatUnit = (unit, unitType) => {
  const value = unit === null || unit === undefined ? "" : String(unit).trim();
  const type = unitType === null || unitType === undefined ? "" : String(unitType).trim();
  return value && type ? `${value}${type}` : null;
};
