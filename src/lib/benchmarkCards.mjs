/** Compact directory cards keep their observation metadata separate from presentation. */
export function benchmarkCardProjection(entry) {
  return entry.groups.flatMap(group=>group.records.map(record=>({
    resultIds:[record.id], systemKey:`${record.system}|${JSON.stringify(record.configuration)}`,
    sourceId:record.sourceId, areas:record.areas,
    dimensions:[...new Set(record.metrics.map(metric=>metric.dimension))],
    benchmark:entry.id, search:`${entry.benchmark.name} ${record.search}`,
  })));
}
