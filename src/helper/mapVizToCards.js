export function mapVizToCardConfig(viz, resolvedMappings) {
  const xCols = (viz.x || []).map((col) =>
    typeof col === "string" ? col : col.column,
  );

  const columns = [
    ...xCols.map((col) => ({ column: col, mapping: "ITEM" })),
    ...(viz.categories || []).map((cat) => ({ column: cat, mapping: "ITEM" })),
    ...(viz.stack || []).map((s) => ({
      column: typeof s === "string" ? s : s.column,
      mapping: "SERIES",
    })),
    ...(viz.columns || []).map((col) => ({
      column: col.field,
      mapping: col.type === "DIMENSION" ? "ITEM" : "VALUE",
      ...(col.aggregation && { aggregation: col.aggregation }),
    })),
    ...(viz.measures || []).map((m) => ({
      column: m.column,
      aggregation: m.aggregation,
      mapping: "VALUE",
    })),
  ];

  const groupBy = [
    ...xCols.map((col) => ({ column: col })),
    ...(viz.categories || []).map((cat) => ({ column: cat })),
    ...(viz.stack || []).map((s) => ({
      column: typeof s === "string" ? s : s.column,
    })),
    ...(viz.columns || [])
      .filter((c) => c.type === "DIMENSION")
      .map((c) => ({ column: c.field })),
  ];

  const orderByCol = xCols[0] || (viz.categories || [])[0];

  return {
    dataSetId: resolvedMappings[viz.datasetRef],
    title: viz.title,
    chartType: viz.type.toLowerCase(),
    chartVersion: "12",
    description: "",
    chartBody: {
      columns,
      groupBy,
      orderBy: orderByCol
        ? [{ column: orderByCol, order: viz.sortOrder || "ASCENDING" }]
        : [],
      filters: [],
      limit: viz.limit || 500,
      distinct: false,
      projection: true,
    },
    calculatedFields: [],
    conditionalFormats: [],
    quickFilters: [],
    summaryNumber: {},
  };
}
