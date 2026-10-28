import {
  CellStyleModule, ClientSideRowModelModule, ColumnApiModule, DateFilterModule, LocaleModule,
  NumberFilterModule, PaginationModule, RenderApiModule, RowApiModule, RowAutoHeightModule, RowSelectionModule, TextFilterModule,
  createGrid, themeQuartz,
  type ColDef, type FilterModel, type GridApi,
} from 'ag-grid-community';
import {organizationMarkMarkup} from '../organizationBrands.mjs';
import {taskConditionText} from './observationContext.mjs';
import {monitorValue} from './monitoring.mjs';

export interface EvidenceGridOptions {
  active?: boolean;
  rankAllowed?: boolean;
  filters?: FilterModel | null;
  sortField?: string;
  sortDirection?: string;
  selected?: string;
}
export interface EvidenceGridController {
  update(rows: any[], options: EvidenceGridOptions): void;
  destroy(): void;
}

const key = (row: any) => String(row.key ?? `${row.resultId}|${row.metricId}`);
const dateComparator = (filterDate: Date, value: string | null) => {
  if (!value) return -1;
  const filter = `${filterDate.getFullYear()}-${String(filterDate.getMonth() + 1).padStart(2, '0')}-${String(filterDate.getDate()).padStart(2, '0')}`;
  return value.slice(0, 10).localeCompare(filter);
};

/** Loaded only after the parent explicitly activates its Data view. */
export function createEvidenceGrid(
  host: HTMLElement,
  owner: HTMLElement,
  rows: any[],
  locale: 'en' | 'zh',
  initialOptions: EvidenceGridOptions,
): EvidenceGridController {
  const en = locale === 'en';
  const style = getComputedStyle(owner);
  const token = (name:string,fallback:string) => style.getPropertyValue(name).trim() || fallback;
  const text = (english: string, chinese: string) => en ? english : chinese;
  const base = `${en ? '/en' : ''}/nuwa/whitzard-index`;
  const metricLabel = (row: any) => [row.benchmarkName,typeof row.label === 'string' ? row.label : row.label?.[locale] ?? row.label?.en ?? ''].filter(Boolean).join(' · ');
  const conditionLabels: Record<string, string> = en ? {matched: 'Matched', conditional: 'Conditional', incomplete: 'Incomplete'} : {matched: '条件匹配', conditional: '附条件', incomplete: '条件不完整'};
  let options = initialOptions;
  let suppress = true;
  let destroyed = false;
  let api: GridApi;
  const status = owner.querySelector<HTMLElement>('[data-grid-status]');
  const announce = () => {
    if (status && api && !destroyed) {
      const count = api.getDisplayedRowCount();
      status.textContent = count ? text(`${count} observations`, `${count} 条观测`) : text('No observations match these filters.', '没有符合筛选条件的观测。');
    }
  };
  const emitChange = () => {
    if (suppress || destroyed || !api) return;
    const sort = api.getColumnState().find(column => column.sort);
    owner.dispatchEvent(new CustomEvent('nuwa-grid-change', {bubbles: true, detail: {
      filters: api.getFilterModel(), sortField: sort?.colId ?? '', sortDirection: sort?.sort ?? '',
    }}));
    announce();
  };
  const select = (row: any) => {
    if (!row || suppress || destroyed) return;
    api.getRowNode(key(row))?.setSelected(true, true);
    owner.dispatchEvent(new CustomEvent('nuwa-grid-select', {bubbles: true, detail: {key: key(row)}}));
  };
  const columns = (): ColDef[] => [
    {
      colId: 'system', field: 'system', headerName: text('System / model', '系统／模型'),
      minWidth: 210, flex: 2, filterValueGetter: p => p.data?.system ?? '',
      cellRenderer: (p: any) => {
        const row = p.data;
        const wrap = document.createElement('div');
        wrap.className = 'ne-grid-system';
        const link = document.createElement('a');
        link.href = `${base}/result/${encodeURIComponent(row.resultId)}/`;
        link.textContent = row.system;
        wrap.append(link);
        const developerIds = row.developerIds??[row.developerId ?? row.developerID];
        for(const developerId of developerIds){
        if (developerId) {
          const mark = document.createElement('span');
          mark.innerHTML = organizationMarkMarkup(developerId, '', {showName: false});
          wrap.prepend(mark);
        }
        }
        if(row.observationCondition){const c=document.createElement('small');c.textContent=row.observationCondition[locale]??row.observationCondition.en;wrap.append(c);}
        if(row.experimentalConditions){const c=document.createElement('small');c.textContent=row.experimentalConditions.goal+' · '+row.experimentalConditions.threat;wrap.append(c);}
        if (row.modelName && row.modelName !== row.system) {
          const model = document.createElement('small');
          model.textContent = row.modelName;
          wrap.append(model);
        }
        return wrap;
      },
    },
    {colId: 'value', field: 'value', headerName: text('Result', '结果'), minWidth: 130, flex: 1,
      filter: 'agNumberColumnFilter', sortable: true,
      valueFormatter: p => p.data ? monitorValue(p.data) : '',
      cellRenderer: (p: any) => {
        const wrap = document.createElement('div'); wrap.className = 'ne-grid-value';
        if (!p.data) return wrap;
        const value = document.createElement('span'); value.textContent = monitorValue(p.data); wrap.append(value);
        const label = document.createElement('small'); label.textContent = metricLabel(p.data); wrap.append(label);
        if (p.data.intervalText) {const interval = document.createElement('small'); interval.textContent = p.data.intervalText; wrap.append(interval);}
        return wrap;
      },
    },
    {colId: 'conditionStatus', field: 'conditionStatus', headerName: text('Condition status', '条件状态'), minWidth: 155, flex: 1, valueFormatter: p => conditionLabels[p.value] ?? p.value ?? '—'},
    {colId: 'taskSet', field: 'taskSet', headerName: text('Task / conditions', '任务／条件'), valueGetter:p=>p.data?taskConditionText(p.data,locale):'', minWidth: 180, flex: 1.2},
    {colId: 'harness', headerName: text('Harness', '评测框架'), valueGetter: p => p.data?.configuration?.harness ?? '', minWidth: 150, flex: 1},
    {colId: 'evaluator', headerName: text('Evaluator', '实际评测方'), valueGetter: p => p.data?.attribution?.evaluator ?? '', minWidth: 170, flex: 1.2},
    {colId: 'releaseDate', field: 'releaseDate', headerName: text('Release date', '发布日期'), minWidth: 150, flex: 1,
      filter: 'agDateColumnFilter', filterParams: {comparator: dateComparator, browserDatePicker: true},
      valueFormatter: p => p.value ?? '—'},
    {colId: 'reportDate', field: 'reportDate', headerName: text('Report date', '报告日期'), minWidth: 150, flex: 1, hide: true,
      filter: 'agDateColumnFilter', filterParams: {comparator: dateComparator, browserDatePicker: true},
      valueFormatter: p => p.value ?? '—'},
  ];
  const media = window.matchMedia('(max-width: 699px)');
  const resize = () => {
    if (!destroyed && api) {
      api.setColumnsVisible(['conditionStatus', 'taskSet', 'harness', 'evaluator', 'releaseDate'], !media.matches);
      api.setColumnsPinned(['system'], media.matches ? null : 'left');
      api.setGridOption('paginationPageSizeSelector', media.matches ? false : [20, 50, 100]);
    }
  };
  const apply = (nextRows: any[], nextOptions: EvidenceGridOptions) => {
    if (destroyed) return;
    suppress = true;
    try {
      const rankChanged = options.rankAllowed !== nextOptions.rankAllowed;
      options = nextOptions;
      if (rankChanged) api.setGridOption('columnDefs', columns());
      api.setGridOption('rowData', nextRows);
      api.setFilterModel(options.filters ?? null);
      const sortField = options.sortField;
      const sortDirection = options.sortDirection;
      const allowed = sortField && ['asc', 'desc'].includes(sortDirection ?? '');
      api.applyColumnState({state: allowed ? [{colId: sortField, sort: sortDirection as 'asc' | 'desc'}] : [], defaultState: {sort: null}});
      api.deselectAll();
      if (options.selected) api.getRowNode(options.selected)?.setSelected(true);
      resize();
      announce();
    } finally { suppress = false; }
  };
  api = createGrid(host, {
    theme: themeQuartz.withParams({
      backgroundColor: '#ffffff', foregroundColor: token('--wz-ink','#182234'), headerBackgroundColor: token('--wz-moon','#f6f7f3'),
      headerTextColor: token('--wz-xuan','#102b5c'), accentColor: token('--nw-deep-jade','#2f7f7a'), borderColor: token('--wz-hairline','#dce2e8'),
      oddRowBackgroundColor: token('--wz-panel','#fafcf9'), selectedRowBackgroundColor: token('--nw-jade-pale','#e7f1ed'),
      fontFamily: 'var(--font-sans, system-ui)', fontSize: 13,
      headerFontWeight: 600, spacing: 8, wrapperBorderRadius: 4,
      rowHeight: 64, headerHeight: 48,
    }),
    defaultColDef: {sortable: true, resizable: true, filter: 'agTextColumnFilter', filterParams: {debounceMs: 150}, floatingFilter: true,
      cellDataType: false, wrapText: true, autoHeight: true, wrapHeaderText: true, autoHeaderHeight: true,
      suppressMovable: true, cellStyle: {lineHeight: '1.6', paddingTop: '12px', paddingBottom: '12px'}},
    columnDefs: columns(), rowData: rows, getRowId: p => key(p.data),
    rowSelection: {mode: 'singleRow', checkboxes: false, enableClickSelection: false},
    pagination: true, paginationPageSize: 20, paginationPageSizeSelector: [20, 50, 100],
    suppressMultiSort: true, suppressScrollOnNewData: true, animateRows: false,
    enableCellTextSelection: true, ensureDomOrder: true,
    localeText: en ? undefined : {
      noRowsToShow: '没有可显示的观测', noMatchingRows: '没有符合筛选条件的观测',
      filterOoo: '筛选…', equals: '等于', notEqual: '不等于', contains: '包含', notContains: '不包含',
      startsWith: '开头为', endsWith: '结尾为', blank: '为空', notBlank: '非空',
      lessThan: '小于', lessThanOrEqual: '小于等于', greaterThan: '大于', greaterThanOrEqual: '大于等于',
      inRange: '介于', inRangeStart: '从', inRangeEnd: '到', andCondition: '且', orCondition: '或',
      dateFormatOoo: '年-月-日', before: '早于', after: '晚于',
      ariaColumnFilter: '列筛选', ariaFilterInput: '筛选输入', ariaMenuColumn: '列菜单',
      ariaRowSelect: '选择行', ariaRowDeselect: '取消选择行',
      pageSizeSelectorLabel: '每页条数：', page: '页', to: '至', of: '共', more: '更多',
      nextPage: '下一页', lastPage: '末页', firstPage: '首页', previousPage: '上一页',
      ariaPageSizeSelectorLabel: '每页条数', ariaPagination: '分页',
    },
    overlayNoRowsTemplate: `<span role="status">${text('No observations match these filters.', '没有符合筛选条件的观测。')}</span>`,
    onFilterChanged: event => {if (event.source !== 'api' && !event.afterDataChange) emitChange();},
    onSortChanged: event => {if (event.source === 'uiColumnSorted') emitChange();},
    onRowClicked: event => select(event.data),
    onCellKeyDown: event => {
      const keyboard = event.event as KeyboardEvent | undefined;
      if (keyboard && ['Enter', ' '].includes(keyboard.key) && !(keyboard.target instanceof HTMLAnchorElement)) {
        keyboard.preventDefault(); select(event.data);
      }
    },
  }, {modules: [LocaleModule, CellStyleModule, RenderApiModule, RowApiModule, RowAutoHeightModule, ClientSideRowModelModule, ColumnApiModule, TextFilterModule, NumberFilterModule, DateFilterModule, RowSelectionModule, PaginationModule]});
  api.setGridAriaProperty('label', text('Evidence observations. Column headers sort and filter; Enter selects a row.', '证据观测。列标题支持排序和筛选，按回车键选择行。'));
  apply(rows, initialOptions);
  media.addEventListener('change', resize);
  return {
    update: apply,
    destroy() {if (destroyed) return; destroyed = true; media.removeEventListener('change', resize); api.destroy();},
  };
}
